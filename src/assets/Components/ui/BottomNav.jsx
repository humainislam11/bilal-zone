import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiGrid, FiShoppingCart, FiSearch, FiUser, FiX } from 'react-icons/fi';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const BottomNav = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  
  const [cartCount, setCartCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  // কার্ট সংখ্যা ফেচ করা
  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/cart?email=${user.email}`)
        .then(res => setCartCount(res.data.length))
        .catch(err => console.error("Cart count error:", err));
    }

    const updateCart = () => {
      if (user?.email) {
        axiosSecure.get(`/cart?email=${user.email}`)
          .then(res => setCartCount(res.data.length));
      }
    };
    window.addEventListener('cartUpdated', updateCart);
    return () => window.removeEventListener('cartUpdated', updateCart);
  }, [user, axiosSecure]);

  // বটম নেভের সার্চ হ্যান্ডলার
  const handleBottomSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchText.trim())}`);
      setIsSearchOpen(false);
      setSearchText('');
    }
  };

  return (
    <>
      {/* ১. সার্চ পপ-আপ মডাল */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-20 px-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl p-4 shadow-2xl relative">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800">Search Products</h3>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="text-slate-400 hover:text-red-500 p-1"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            
            <form onSubmit={handleBottomSearch} className="relative">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Type product name..."
                autoFocus
                className="w-full bg-slate-50 text-sm text-slate-800 px-4 py-3 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 border border-slate-200"
              />
              <button type="submit" className="absolute right-3.5 top-3.5 text-orange-500 hover:text-orange-600">
                <FiSearch className="text-lg" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ২. মূল বটম নেভ বার (শুধুমাত্র মোবাইল স্ক্রিনে দেখাবে) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-orange-400 text-white shadow-lg border-t border-orange-600 z-40 py-2 px-3 flex justify-around items-center">
        
        {/* Home */}
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex flex-col items-center transition ${isActive ? 'text-white font-bold scale-105' : 'text-orange-100 hover:text-white'}`}
        >
          <FiHome className="text-lg mb-0.5" />
          <span className="text-[10px]">Home</span>
        </NavLink>

        {/* Shop (Navbar-এর Shop পেজের সাথে লিংক করা) */}
        <NavLink 
          to="/products" 
          className={({ isActive }) => `flex flex-col items-center transition ${isActive ? 'text-white font-bold scale-105' : 'text-orange-100 hover:text-white'}`}
        >
          <FiGrid className="text-lg mb-0.5" />
          <span className="text-[10px]">Shop</span>
        </NavLink>

        {/* Cart with Badge */}
        <NavLink 
          to="/cart" 
          className={({ isActive }) => `relative flex flex-col items-center transition ${isActive ? 'text-white font-bold scale-105' : 'text-orange-100 hover:text-white'}`}
        >
          <div className="relative">
            <FiShoppingCart className="text-lg mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-orange-500">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Cart</span>
        </NavLink>

        {/* Search Trigger Button */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center text-orange-100 hover:text-white transition"
        >
          <FiSearch className="text-lg mb-0.5" />
          <span className="text-[10px]">Search</span>
        </button>

        {/* Contact (Navbar-এর Contact পেজের সাথে লিংক করা) */}
        <NavLink 
          to="/contactUs" 
          className={({ isActive }) => `flex flex-col items-center transition ${isActive ? 'text-white font-bold scale-105' : 'text-orange-100 hover:text-white'}`}
        >
          <FiUser className="text-lg mb-0.5" />
          <span className="text-[10px]">Contact</span>
        </NavLink>

      </div>
    </>
  );
};

export default BottomNav;