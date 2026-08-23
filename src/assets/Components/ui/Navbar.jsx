import { useState, useContext, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiLayout } from 'react-icons/fi';
import Swal from 'sweetalert2';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const Navbar = () => {
  const axiosPublic = useAxiosPublic();
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [cart, setCart] = useState([]);

  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🚪 লগআউট হ্যান্ডলার
  const handleLogOut = async () => {
    try {
      await logOut();
      Swal.fire({
        icon: "success",
        title: "Log Out successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      setProfileOpen(false);
      setNavOpen(false);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  // 🔍 সার্চ হ্যান্ডলার ফাংশন
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchText.trim())}`);
      setNavOpen(false);
    }
  };

  // 🎨 অ্যাক্টিভ রাউট হাইলাইট করার জন্য টেলউইন্ড ক্লাস ফাংশন
  const activeLinkStyle = ({ isActive }) => 
    isActive 
      ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1 transition-all" 
      : "text-gray-600 hover:text-blue-600 transition-colors pb-1";

  const mobileActiveLinkStyle = ({ isActive }) => 
    isActive 
      ? "block px-3 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold" 
      : "block px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors";

  // 🛒 রিয়েল-টাইম কার্ট ফেচ করার জন্য useEffect এবং Event Listener
  useEffect(() => {
    const fetchCart = () => {
      if (user?.email) {
        axiosPublic.get(`/cart?email=${user.email}`)
          .then(res => { setCart(res.data); })
          .catch(err => console.error(err));
      } else {
        setCart([]);
      }
    };

    fetchCart(); // প্রথমবার লোড হওয়ার সময়

    // কাস্টম ইভেন্ট শোনা (যাতে প্রোডাক্ট যোগ করলেই সাথে সাথে আপডেট হয়)
    window.addEventListener('cartUpdated', fetchCart);

    return () => {
      window.removeEventListener('cartUpdated', fetchCart);
    };
  }, [axiosPublic, user?.email]);

  return (
    <nav className="bg-white sticky top-0 z-50">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* ১. লোগো */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-black text-blue-600 tracking-wider">
              BILAL<span className="text-gray-800">ZONE</span>
            </Link>
          </div>

          {/* ২. সার্চ বার (ডেস্কটপ) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-gray-100 text-sm text-gray-800 px-4 py-2 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:bg-white transition-all"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-500 text-lg hover:text-blue-600 focus:outline-none">
                <FiSearch />
              </button>
            </div>
          </form>

          {/* ৩. নেভিগেশন লিংক (ডেস্কটপ) */}
          <div className="hidden md:flex items-center space-x-6 font-medium text-sm">
            <NavLink to="/" className={activeLinkStyle}>Home</NavLink>
            <NavLink to="/products" className={activeLinkStyle}>Shop</NavLink>
            {user && (
              <NavLink to="/dashboard" className={activeLinkStyle}>Dashboard</NavLink>
            )}
          </div>

          {/* ৪. রাইট সাইড আইকন + প্রোফাইল ড্রপডাউন (ডেস্কটপ) */}
          <div className="hidden md:flex items-center space-x-5 ml-6">
            {/* কার্ট আইকন */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <FiShoppingCart className="text-2xl" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* প্রোফাইল স্টেট */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center justify-center bg-blue-100 text-blue-600 font-bold w-9 h-9 rounded-full border border-blue-200 hover:shadow-md transition-all focus:outline-none"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user.displayName ? user.displayName.charAt(0).toUpperCase() : <FiUser />
                  )}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-xs text-gray-400 font-semibold uppercase">Logged in as</p>
                      <p className="text-sm font-bold text-gray-800 truncate">{user.displayName || "User"}</p>
                    </div>
                    
                    <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all">
                      <FiLayout /> Dashboard
                    </Link>

                    <button onClick={handleLogOut} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all font-semibold">
                      <FiLogOut /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-2 text-gray-700 hover:text-blue-600 transition-colors">
                <FiUser className="text-2xl" />
              </Link>
            )}
          </div>

          {/* ৫. মোবাইল মেনু বাটন */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-700">
              <FiShoppingCart className="text-xl" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cart.length}
                </span>
              )}
            </Link>

            <button onClick={() => setNavOpen(!navOpen)} className="text-gray-700 hover:text-blue-600 focus:outline-none">
              {navOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>

        </div>
      </div>

      {/* ৬. মোবাইল ড্রপডাউন মেনু */}
      {navOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 transition-all duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2 font-medium">
            <NavLink to="/" onClick={() => setNavOpen(false)} className={mobileActiveLinkStyle}>Home</NavLink>
            <NavLink to="/products" onClick={() => setNavOpen(false)} className={mobileActiveLinkStyle}>Shop</NavLink>

            {user ? (
              <>
                <div className="px-3 py-2 bg-blue-50/50 rounded-xl my-2">
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Signed in as</p>
                  <p className="text-sm font-black text-gray-800 truncate">{user.displayName || user.email}</p>
                </div>
                <NavLink to="/dashboard" onClick={() => setNavOpen(false)} className={mobileActiveLinkStyle}>Dashboard</NavLink>
                <button onClick={handleLogOut} className="w-full text-left block px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-bold">
                  Log Out
                </button>
              </>
            ) : (
              <NavLink to="/login" onClick={() => setNavOpen(false)} className={mobileActiveLinkStyle}>Login / Profile</NavLink>
            )}
            
            {/* মোবাইল সার্চ বার */}
            <form onSubmit={handleSearch} className="pt-4 border-t border-gray-50">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-gray-100 text-sm text-gray-800 px-4 py-2.5 pr-10 rounded-xl focus:outline-none focus:bg-white border border-transparent focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="absolute right-3 top-3 text-gray-500">
                  <FiSearch />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;