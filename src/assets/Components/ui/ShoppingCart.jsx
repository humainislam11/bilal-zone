import { useState, useMemo, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiMinus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../context/AuthContext';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.email) {
      axiosPublic.get(`/cart?email=${user.email}`)
        .then(res => { 
          const itemsWithQuantity = res.data.map(item => ({
            ...item,
            quantity: item.quantity || 1 
          }));
          setCartItems(itemsWithQuantity); 
          setLoading(false); 
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [axiosPublic, user?.email]);

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item =>
      item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const deleteItem = (id) => {
    Swal.fire({ 
      title: 'Are you sure?', 
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonColor: '#d33', 
      confirmButtonText: 'Yes, delete it!' 
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic.delete(`/cart/${id}`).then(res => {
          if (res.data.deletedCount > 0) {
            setCartItems(prev => prev.filter(item => item._id !== id));
            window.dispatchEvent(new Event('cartUpdated'));
          }
        });
      }
    });
  };

  const { totalAmount, totalQuantity } = useMemo(() => {
    return cartItems.reduce((acc, item) => ({
      totalAmount: acc.totalAmount + (Number(item.price) * item.quantity),
      totalQuantity: acc.totalQuantity + item.quantity
    }), { totalAmount: 0, totalQuantity: 0 });
  }, [cartItems]);

  if (loading) return <div className="text-center py-20 font-medium text-gray-500">Loading...</div>;

  return (
    <div className="max-w-7xl text-gray-700 mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-black mb-6 sm:mb-8 flex items-center gap-3">
        <FiShoppingBag /> Shopping Cart
      </h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-lg sm:text-xl font-medium text-gray-500">Cart is empty!</p>
          <Link to="/products" className="inline-block mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all">
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          
          {/* কার্ট প্রোডাক্ট লিস্ট */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div 
                key={item._id} 
                className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* প্রোডাক্ট ইমেজ ও নাম */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-base sm:text-lg truncate">{item.name}</h2>
                    <p className="text-blue-600 font-semibold text-sm sm:text-base">৳{item.price} × {item.quantity}</p>
                  </div>
                </div>

                {/* কন্ট্রোল বাটন ও ডিলিট */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                    <button onClick={() => updateQuantity(item._id, -1)} className="hover:text-blue-600 p-1"><FiMinus /></button>
                    <span className="font-bold text-sm sm:text-base w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, 1)} className="hover:text-blue-600 p-1"><FiPlus /></button>
                  </div>
                  <button onClick={() => deleteItem(item._id)} className="text-red-500 hover:text-red-700 p-2 transition-colors">
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* অর্ডার সামারি কার্ড */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm lg:sticky lg:top-6">
            <h3 className="font-bold text-lg mb-4 border-b pb-2">Order Summary</h3>
            <div className="flex justify-between text-sm sm:text-base mb-2">
              <span className="text-gray-500">Total Items:</span> 
              <span className="font-semibold">{totalQuantity}</span>
            </div>
            <div className="flex justify-between font-black text-lg sm:text-xl mt-4 border-t pt-3">
              <span>Total:</span> 
              <span className="text-blue-600">৳{totalAmount}</span>
            </div>
            
            <Link 
              to="/checkout" 
              state={{ totalAmount, totalQuantity, cartItems }} 
              className="w-full mt-6 block text-center bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-md transition-all text-sm sm:text-base"
            >
              Proceed to Checkout
            </Link>
          </div>

        </div>
      )}
    </div>
  );
};


export default ShoppingCart;