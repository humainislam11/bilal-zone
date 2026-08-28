import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { FiShoppingBag, FiClock, FiCheckCircle,  FiTrash2, FiPrinter } from 'react-icons/fi';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    if (user?.email) {
      axiosSecure.get(`/my-orders?email=${user.email}`)
        .then(res => {
          // ইউজারের ইমেইল অনুযায়ী ফিল্টার করা
          const userOrders = res.data.filter(order => order.email === user.email);
          setOrders(userOrders);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching orders:", err);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [axiosSecure, user?.email]);

  const handleCancelOrder = (id, status) => {
    if (status === 'approved' || status === 'Delivered' || status === 'Processing' || status === 'Shipped') {
      return Swal.fire({
        icon: 'error',
        title: 'Action Denied',
        text: 'You cannot cancel an order that is already processing or approved!'
      });
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to cancel this order?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/my-orders/${id}`)
          .then(res => {
            if (res.data.deletedCount > 0 || res.data.success) {
              setOrders(prev => prev.filter(order => order._id !== id));
              Swal.fire('Cancelled!', 'Your order has been cancelled.', 'success');
            }
          })
          .catch(err => {
            console.error("Error deleting order:", err);
            Swal.fire('Error!', 'Failed to cancel the order.', 'error');
          });
      }
    });
  };

  // ইনভয়েস প্রিন্ট বা ডাউনলোড করার ফাংশন
  const handlePrintInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order._id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 20px; }
            .invoice-details { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 14px; }
            th { background-color: #f4f4f4; }
            .total { text-align: right; font-weight: bold; margin-top: 15px; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>BILAL-ZONE</h2>
            <p>Invoice / Cash Memo</p>
          </div>
          <div class="invoice-details">
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Customer Name:</strong> ${order.customerName || user?.displayName}</p>
            <p><strong>Phone:</strong> ${order.phone || 'N/A'}</p>
            <p><strong>Address:</strong> ${order.address || 'N/A'}, ${order.city || ''}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod?.toUpperCase() || 'COD'}</p>
            <p><strong>TrxID:</strong> ${order.transactionId || 'N/A'}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items?.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>৳${item.price}</td>
                  <td>৳${item.quantity * item.price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            Total Amount: ৳${order.totalPrice}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-800">My Orders</h1>
        <p className="text-sm text-gray-500">View and track all your product orders here.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <FiShoppingBag />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">No orders found</h3>
          <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const orderStatus = order.status || 'pending';

            return (
              <div 
                key={order._id} 
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between transition-all hover:shadow-md"
              >
                {/* অর্ডার আইডি, ডেট ও প্রডাক্ট লিস্ট */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-mono">ID: {order._id}</span>
                    {order.createdAt && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-2xl border w-fit">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl border" />
                      <div>
                        <h2 className="text-sm font-bold text-gray-900">{item.name}</h2>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ৳{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* মূল্য, স্ট্যাটাস এবং অ্যাকশন বাটন */}
                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold text-right">Total Amount</p>
                    <p className="text-xl font-black text-blue-600">৳{order.totalPrice}</p>
                  </div>

                  <div className="flex items-center flex-wrap gap-2 justify-end">
                    {/* স্ট্যাটাস ব্যাজ */}
                    <div className={`px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 capitalize ${
                      orderStatus === 'approved' || orderStatus === 'Delivered' ? 'bg-green-50 text-green-600 border border-green-200' :
                      orderStatus === 'Processing' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                      orderStatus === 'Cancelled' ? 'bg-red-50 text-red-600 border border-red-200' :
                      'bg-yellow-50 text-yellow-600 border border-yellow-200'
                    }`}>
                      {orderStatus === 'approved' || orderStatus === 'Delivered' ? <FiCheckCircle /> : <FiClock />}
                      {orderStatus}
                    </div>

                    {/* ইনভয়েস প্রিন্ট বাটন */}
                    <button 
                      onClick={() => handlePrintInvoice(order)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                      title="Print Invoice"
                    >
                      <FiPrinter size={16} /> Invoice
                    </button>

                    {/* পেন্ডিং থাকলে ক্যান্সেল বাটন */}
                    {orderStatus.toLowerCase() === 'pending' && (
                      <button 
                        onClick={() => handleCancelOrder(order._id, orderStatus)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                        title="Cancel Order"
                      >
                        <FiTrash2 size={16} /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;