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

  // যদি কার্টে কোনো আইটেম না থাকে, তবে এটি হাইড থাকবে (অথবা চাইলে জিরো দেখাতে পারেন)
  if (totalItems === 0) return null;

  return (
    <div 
      onClick={() => navigate('/cart')}
      className="fixed top-1/2 right-0 -translate-y-1/2 z-50 bg-orange-500 hover:bg-orange-600 text-white shadow-2xl rounded-l-2xl p-3 cursor-pointer flex flex-col items-center justify-center transition-all duration-300 border-l border-t border-b border-orange-600 group"
    >
      <div className="relative mb-1">
        <FiShoppingCart className="text-2xl group-hover:scale-110 transition-transform" />
        <span className="absolute -top-2 -right-3 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-white">
          {totalItems}
        </span>
      </div>
      <div className="text-[11px] font-bold tracking-wider mt-1 uppercase text-center">
        {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
      </div>
      <div className="text-xs font-black bg-white/20 px-2 py-0.5 rounded-lg mt-1 w-full text-center">
        ৳{totalPrice.toFixed(2)}
      </div>
    </div>
  );
};

export default FloatingCart;