import { useEffect, useState, useRef } from 'react';
import useAxiosPublic from '../../hooks/useAxiosPublic'; 
import { FiCheckCircle, FiClock, FiX, FiShoppingBag, FiUser, FiMapPin, FiPhone, FiPrinter, FiMail } from 'react-icons/fi';
import Swal from 'sweetalert2';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const axiosPublic = useAxiosPublic();
  const invoiceRef = useRef();

  const DELIVERY_CHARGE = 120; // ডেলিভারি চার্জ 

  // ডাটা ফেচ করার ফাংশন এবং useEffect
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosPublic.get('/orders'); 
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [axiosPublic]);

  // আলাদাভাবে রিফ্রেশ করার জন্য ফাংশন
  const reloadOrders = async () => {
    try {
      const res = await axiosPublic.get('/orders');
      setOrders(res.data);
    } catch (error) {
      console.error("Error reloading orders:", error);
    }
  };

  // অর্ডার স্ট্যাটাস আপডেট করার ফাংশন
  const handleStatusUpdate = async (id, e) => {
    e.stopPropagation(); // রো-এর ক্লিক ইভেন্ট যেন কাজ না করে
    try {
      const res = await axiosPublic.patch(`/orders/${id}`, { status: 'approved' });
      if (res.data.modifiedCount > 0 || res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Approved!',
          text: 'Order status updated successfully.',
          showConfirmButton: false,
          timer: 1500
        });
        reloadOrders(); 
        
        // যদি মডালের অর্ডারটিকেই এপ্রুভ করা হয়, তবে মডালের স্ট্যাটাসও লাইভ আপডেট হবে
        if (selectedOrder && selectedOrder._id === id) {
          setSelectedOrder(prev => ({ ...prev, status: 'approved' }));
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to update status!',
      });
    }
  };

  // ইনভয়েস প্রিন্ট করার ফাংশন
  const handlePrintInvoice = () => {
    const printContent = invoiceRef.current;
    const WinPrint = window.open('', '', 'width=900,height=650');
    WinPrint.document.write(`
      <html>
        <head>
          <title>Invoice - ${selectedOrder?._id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .invoice-header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 20px; }
            .invoice-title { font-size: 24px; font-weight: bold; color: #2563eb; }
            .section { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; font-size: 14px; }
            th { background-color: #f8fafc; }
            .text-right { text-align: right; }
            .total-section { margin-top: 20px; text-align: right; font-size: 15px; }
            .total-section p { margin: 5px 0; }
            .grand-total { font-size: 18px; font-weight: bold; color: #111; border-top: 1px solid #ddd; padding-top: 5px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    WinPrint.document.close();
    WinPrint.focus();
    setTimeout(() => {
      WinPrint.print();
      WinPrint.close();
    }, 500);
  };

  // পেন্ডিং অর্ডারগুলো উপরে এবং এপ্রুভড অর্ডারগুলো নিচে সাজানোর জন্য সর্টিং (Sorting)
  const sortedOrders = [...orders].sort((a, b) => {
    const statusA = a.status || 'pending';
    const statusB = b.status || 'pending';
    if (statusA === statusB) return 0;
    return statusA === 'approved' ? 1 : -1; 
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // সাবটোটাল হিসাব করার ফাংশন (প্রোডাক্টগুলোর দামের যোগফল)
  const calculateSubtotal = (items) => {
    return items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* হেডার সেকশন */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Manage Orders</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Click on any order to view full details and manage status.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm border border-blue-100 flex items-center gap-2 w-full sm:w-auto justify-center">
          <FiShoppingBag /> Total Orders: {orders.length}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 sm:p-16 rounded-3xl text-center border border-gray-100 shadow-sm">
          <p className="text-gray-400 font-bold text-base sm:text-lg">No orders found!</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase text-[11px] tracking-wider font-extrabold">
                  <th className="p-4 sm:p-5">Customer Info</th>
                  <th className="p-4 sm:p-5">Products</th>
                  <th className="p-4 sm:p-5">Total Amount</th>
                  <th className="p-4 sm:p-5">Payment & TrxID</th>
                  <th className="p-4 sm:p-5">Status</th>
                  <th className="p-4 sm:p-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {sortedOrders.map((order) => (
                  <tr 
                    key={order._id} 
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-blue-50/40 transition-all cursor-pointer group"
                  >
                    {/* কাস্টমার ইনফো */}
                    <td className="p-4 sm:p-5 align-middle space-y-1">
                      <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5 text-xs sm:text-sm">
                        <FiUser size={14} className="text-gray-400 shrink-0" /> {order.customerName}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <FiPhone size={13} className="text-gray-400 shrink-0" /> {order.phone}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-xs">
                        <FiMapPin size={13} className="text-gray-400 shrink-0" /> {order.address}, {order.city}
                      </p>
                    </td>

                    {/* প্রোডাক্ট প্রিভিউ */}
                    <td className="p-4 sm:p-5 align-middle">
                      <div className="flex items-center gap-3">
                        <img 
                          src={order.items?.[0]?.image} 
                          alt="" 
                          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-2xl border border-gray-200 shadow-sm shrink-0" 
                        />
                        <div>
                          <p className="font-bold text-xs text-gray-800 line-clamp-1">{order.items?.[0]?.name}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {order.items?.length > 1 ? `+${order.items.length - 1} more` : `Qty: ${order.items?.[0]?.quantity}`}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* মোট টাকা */}
                    <td className="p-4 sm:p-5 align-middle font-black text-gray-900 text-sm sm:text-base">
                      ৳{order.totalPrice}
                    </td>

                    {/* পেমেন্ট মেথড */}
                    <td className="p-4 sm:p-5 align-middle space-y-1.5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.paymentMethod === 'bkash' ? 'bg-pink-100 text-pink-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {order.paymentMethod}
                      </span>
                      <p className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 w-fit">
                        Trx: <span className="font-bold text-gray-900">{order.transactionId}</span>
                      </p>
                    </td>

                    {/* স্ট্যাটাস */}
                    <td className="p-4 sm:p-5 align-middle">
                      <span className={`inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1 rounded-full text-xs font-bold ${
                        order.status === 'approved' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-600 border border-amber-200'
                      }`}>
                        {order.status === 'approved' ? <FiCheckCircle size={13} /> : <FiClock size={13} />}
                        {order.status || 'pending'}
                      </span>
                    </td>

                    {/* অ্যাকশন বাটন */}
                    <td className="p-4 sm:p-5 align-middle text-center">
                      {order.status !== 'approved' ? (
                        <button 
                          onClick={(e) => handleStatusUpdate(order._id, e)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all shadow-md shadow-blue-100 cursor-pointer active:scale-95"
                        >
                          Approve
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 font-bold">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* প্রিমিয়াম ডিটেইলস মডাল (Modal) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl sm:rounded-[32px] max-w-2xl w-full p-5 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-gray-100 relative">
            
            {/* মডাল হেডার */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Order Details</h2>
                <p className="text-[11px] sm:text-xs text-gray-400 font-mono mt-0.5">ID: {selectedOrder._id}</p>
              </div>
              <div className="flex items-center gap-2">
                {/* প্রিন্ট ইনভয়েস বাটন */}
                <button 
                  onClick={handlePrintInvoice}
                  className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl sm:rounded-2xl font-bold text-xs transition-all cursor-pointer"
                >
                  <FiPrinter size={15} /> <span className="hidden sm:inline">Print Invoice</span>
                </button>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 sm:p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-all cursor-pointer"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* হিডেন বা প্রিন্টযোগ্য ইনভয়েস কন্টেন্ট */}
            <div className="hidden">
              <div ref={invoiceRef}>
                <div className="invoice-header">
                  <div>
                    <div className="invoice-title">BILAL ZONE</div>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>Official Order Invoice</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '12px' }}><strong>Order ID:</strong> {selectedOrder._id}</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}><strong>Status:</strong> {selectedOrder.status || 'pending'}</p>
                  </div>
                </div>

                <div className="section">
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Customer Information:</h4>
                  <p style={{ margin: 0, fontSize: '13px' }}><strong>Name:</strong> {selectedOrder.customerName}</p>
                  <p style={{ margin: '3px 0', fontSize: '13px' }}><strong>Phone:</strong> {selectedOrder.phone}</p>
                  <p style={{ margin: '3px 0', fontSize: '13px' }}><strong>Email:</strong> {selectedOrder.email || 'N/A'}</p>
                  <p style={{ margin: 0, fontSize: '13px' }}><strong>Address:</strong> {selectedOrder.address}, {selectedOrder.city}</p>
                </div>

                <div className="section">
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Ordered Items:</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Color / Size</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th className="text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.name}</td>
                          <td>{item.color || 'N/A'} / {item.size || 'N/A'}</td>
                          <td>{item.quantity}</td>
                          <td>৳{item.price}</td>
                          <td className="text-right">৳{item.quantity * item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="total-section">
                  <p>Subtotal: ৳{calculateSubtotal(selectedOrder.items)}</p>
                  <p>Delivery Charge: ৳{DELIVERY_CHARGE}</p>
                  <p className="grand-total">Grand Total: ৳{selectedOrder.totalPrice}</p>
                  <p style={{ fontSize: '11px', fontWeight: 'normal', color: '#555', marginTop: '10px' }}>Payment Method: {selectedOrder.paymentMethod} (TrxID: {selectedOrder.transactionId})</p>
                </div>
              </div>
            </div>

            {/* কাস্টমার ইনফো কার্ড (এখানে জিমেইল যুক্ত করা হয়েছে) */}
            <div className="bg-gray-50/80 p-4 sm:p-5 rounded-2xl border border-gray-100 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Customer Information</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  selectedOrder.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  Status: {selectedOrder.status || 'pending'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <p className="text-xs text-gray-400">Name</p>
                  <p className="font-bold text-gray-900 text-xs sm:text-sm">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="font-bold text-gray-900 text-xs sm:text-sm">{selectedOrder.phone}</p>
                </div>
                {/* বায়ারের জিমেইল ফিল্ড */}
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-400 flex items-center gap-1"><FiMail size={12} /> Email</p>
                  <p className="font-bold text-blue-600 text-xs sm:text-sm">{selectedOrder.email || 'N/A'}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-400">Delivery Address</p>
                  <p className="font-bold text-gray-900 text-xs sm:text-sm">{selectedOrder.address}, {selectedOrder.city}</p>
                </div>
              </div>
            </div>

            {/* প্রোডাক্ট লিস্ট (কালার এবং সাইজসহ) */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Ordered Items</h3>
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex gap-3 sm:gap-4 items-center bg-white p-3 rounded-2xl border border-gray-100 shadow-xs">
                    <img src={item.image} alt={item.name} className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl border border-gray-100 shrink-0" />
                    <div className="space-y-1 flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate">{item.name}</h4>
                      
                      {/* কালার এবং সাইজ ব্যাজ */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs">
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-semibold">
                          Color: <strong className="text-gray-900">{item.color || 'N/A'}</strong>
                        </span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-semibold">
                          Size: <strong className="text-gray-900">{item.size || 'N/A'}</strong>
                        </span>
                      </div>

                      <p className="text-xs font-bold text-blue-600">Qty: {item.quantity} × ৳{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* পেমেন্ট এবং টোটাল অ্যামাউন্ট সামারি */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-5 rounded-2xl border border-blue-100 space-y-2.5">
              <div className="flex justify-between items-center text-xs text-gray-600 font-semibold border-b border-blue-100/60 pb-2">
                <span>Subtotal</span>
                <span>৳{calculateSubtotal(selectedOrder.items)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600 font-semibold border-b border-blue-100/60 pb-2">
                <span>Delivery Charge</span>
                <span>৳{DELIVERY_CHARGE}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1">
                <div>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">
                    Payment: <span className="uppercase font-black text-gray-900">{selectedOrder.paymentMethod}</span>
                  </p>
                  <p className="text-xs text-gray-600 font-mono mt-0.5">TrxID: <span className="font-bold text-gray-900">{selectedOrder.transactionId}</span></p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Grand Total</p>
                  <p className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight">৳{selectedOrder.totalPrice}</p>
                </div>
              </div>
            </div>

            {/* একশন বাটন / ক্লোজ বাটন */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {selectedOrder.status !== 'approved' && (
                <button
                  onClick={(e) => handleStatusUpdate(selectedOrder._id, e)}
                  className="w-full sm:flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl sm:rounded-2xl transition-all shadow-md cursor-pointer text-xs sm:text-sm"
                >
                  Approve Order Now
                </button>
              )}
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-full sm:flex-1 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl sm:rounded-2xl transition-all shadow-md cursor-pointer text-xs sm:text-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;