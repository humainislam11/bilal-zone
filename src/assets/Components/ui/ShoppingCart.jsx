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
          // নিশ্চিত করুন প্রতিটি আইটেমে যেন একটি ডিফল্ট quantity থাকে
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
    // ইচ্ছা করলে এখানে ব্যাকএন্ডেও কোয়ান্টিটি আপডেটের API কল করতে পারেন
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
            
            // 🔥 কার্ট থেকে আইটেম ডিলিট হওয়ার সাথে সাথে Navbar-কে জানানোর জন্য ইভেন্ট ডিসপ্যাচ করা হলো
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

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-7xl text-gray-700 mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
        <FiShoppingBag /> Shopping Cart
      </h1>
      
      {cartItems.length === 0 ? (
        <p className="text-center text-xl font-medium">Cart is empty!</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                <div className="flex-1">
                  <h2 className="font-bold text-lg">{item.name}</h2>
                  <p className="text-blue-600 font-semibold">৳{item.price} × {item.quantity}</p>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg border">
                  <button onClick={() => updateQuantity(item._id, -1)} className="hover:text-blue-600"><FiMinus /></button>
                  <span className="font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, 1)} className="hover:text-blue-600"><FiPlus /></button>
                </div>
                <button onClick={() => deleteItem(item._id)} className="text-red-500 hover:text-red-700 p-2"><FiTrash2 size={20} /></button>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow-sm h-fit">
            <h3 className="font-bold text-lg mb-4 border-b pb-2">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span>Total Items:</span> 
              <span className="font-semibold">{totalQuantity}</span>
            </div>
            <div className="flex justify-between font-black text-xl mt-4 border-t pt-3">
              <span>Total:</span> 
              <span className="text-blue-600">৳{totalAmount}</span>
            </div>
            
            {/* Proceed to Checkout এ ক্লিক করলে state এর মাধ্যমে টোটাল অ্যামাউন্ট এবং কার্ট আইটেমগুলো চেকআউটে চলে যাবে */}
            <Link 
              to="/checkout" 
              state={{ totalAmount, totalQuantity, cartItems }} 
              className="w-full mt-6 block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-md transition-all"
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