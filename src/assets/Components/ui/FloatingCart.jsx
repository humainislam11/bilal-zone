import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { AuthContext } from '../../../context/AuthContext';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const FloatingCart = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);

  // কার্ট ডাটা ফেচ করা
  useEffect(() => {
    const fetchCart = () => {
      if (user?.email) {
        axiosSecure.get(`/cart?email=${user.email}`)
          .then(res => setCartItems(res.data))
          .catch(err => console.error("Cart fetch error:", err));
      } else {
        setCartItems([]);
      }
    };

    fetchCart();

    // ইভেন্ট লিসেনার দিয়ে রিয়েল-টাইম আপডেট করা
    window.addEventListener('cartUpdated', fetchCart);
    return () => window.removeEventListener('cartUpdated', fetchCart);
  }, [user, axiosSecure]);

  // মোট আইটেম সংখ্যা এবং মোট দাম হিসাব করা
  const totalItems = cartItems.length;
  const totalPrice = cartItems.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);

  return (
    <div 
      onClick={() => navigate('/cart')}
      className="fixed top-1/2 right-0 -translate-y-1/2 z-50 shadow-2xl rounded-md cursor-pointer overflow-hidden transition-all duration-300 group flex flex-col w-18"
    >
      {/* ওপরের অরেঞ্জ অংশ (আইকন এবং আইটেম টেক্সট) */}
      <div className="bg-orange-400/80  group-hover:bg-orange-500 text-white p-3 flex flex-col items-center justify-center transition-colors">
        <div className="relative mb-1">
          <FiShoppingCart className="text-2xl group-hover:scale-110 transition-transform" />
          <span className="absolute -top-2 -right-3 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        </div>
        <div className="text-[10px] font-bold tracking-wider mt-1 uppercase text-center whitespace-nowrap">
          {totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'}
        </div>
      </div>

      {/* নিচের সাদা অংশ (টাকার পরিমাণ) */}
      <div className="bg-white text-slate-800 py-1.5 px-1 text-center font-black text-xs border-t border-slate-100">
        ৳{totalPrice.toFixed(2)}
      </div>
    </div>
  );
};

export default FloatingCart;