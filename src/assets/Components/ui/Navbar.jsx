import { useState, useContext, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiLayout, FiHeart, FiBell } from 'react-icons/fi';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAdmin from '../../hooks/useAdmin';

const Navbar = () => {
  const axiosSecure = useAxiosSecure();
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [unseenOrders, setUnseenOrders] = useState(0);

  const { user, logOut } = useContext(AuthContext);
  const [isAdmin] = useAdmin();
  const navigate = useNavigate();

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchText.trim())}`);
      setNavOpen(false);
    }
  };

  const activeLinkStyle = ({ isActive }) => 
    isActive 
      ? "text-orange-600 font-bold transition-all" 
      : "text-slate-700 hover:text-orange-600 transition-colors";

  const mobileActiveLinkStyle = ({ isActive }) => 
    isActive 
      ? "block px-3 py-2 rounded-xl bg-orange-50 text-orange-600 font-bold" 
      : "block px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-colors";

  useEffect(() => {
    let isMounted = true;

    const fetchCartAndWishlist = () => {
      if (user?.email) {
        axiosSecure.get(`/cart?email=${user.email}`)
          .then(res => { if (isMounted) setCart(res.data); })
          .catch(err => console.error(err));

        axiosSecure.get(`/wishlist?email=${user.email}`)
          .then(res => { if (isMounted) setWishlist(res.data); })
          .catch(err => console.error(err));
      } else {
        if (isMounted) {
          setCart([]);
          setWishlist([]);
        }
      }
    };

    fetchCartAndWishlist();
    
    window.addEventListener('cartUpdated', fetchCartAndWishlist);
    window.addEventListener('wishlistUpdated', fetchCartAndWishlist);

    return () => {
      isMounted = false;
      window.removeEventListener('cartUpdated', fetchCartAndWishlist);
      window.removeEventListener('wishlistUpdated', fetchCartAndWishlist);
    };
  }, [axiosSecure, user?.email]);

  useEffect(() => {
    if (!isAdmin || !user?.email) return;

    let isMounted = true;

    const fetchUnseenCount = () => {
      axiosSecure.get('/orders/unseen-count')
        .then(res => { if (isMounted) setUnseenOrders(res.data.count); })
        .catch(err => console.error('Error fetching unseen order count:', err));
    };

    fetchUnseenCount();
    const interval = setInterval(fetchUnseenCount, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [axiosSecure, isAdmin, user?.email]);

  const handleBellClick = async () => {
    try {
      await axiosSecure.patch('/orders/mark-all-seen');
      setUnseenOrders(0);
    } catch (err) {
      console.error('Error marking orders as seen:', err);
    }
    navigate('/dashboard/manageOrders');
    setNavOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 lg:sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* ================= DESKTOP VIEW ================= */}
          {/* ১. লোগো */}
          <div className="hidden md:flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="https://i.ibb.co.com/Xr23H5Bv/Whats-App-Image-2026-08-26-at-10-44-30-AM-removebg-preview.png" 
                alt="BILAL ZONE" 
                className="h-12 w-auto object-contain rounded-xl"
              />
              <h1 className='text-orange-500 text-2xl font-bold'>BILAL</h1>
              <h1 className='text-black text-2xl font-bold'>ZONE</h1>
            </Link>
          </div>

          {/* ২. নেভিগেশন লিংক (ডেস্কটপ) */}
          <nav className="hidden md:flex items-center space-x-8 font-semibold text-xs tracking-wider uppercase">
            <NavLink to="/" className={activeLinkStyle}>Home</NavLink>
            <NavLink to="/products" className={activeLinkStyle}>Shop</NavLink>
            <NavLink to="/contactUs" className={activeLinkStyle}>Contact</NavLink>
            {user && (
              <NavLink to="/dashboard" className={activeLinkStyle}>Dashboard</NavLink>
            )}
          </nav>

          {/* ৩. ডানপাশের আইকনসমূহ (ডেস্কটপ) */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search"
                className="bg-slate-50 text-xs text-slate-800 px-3.5 py-1.5 pr-8 rounded-full focus:outline-none focus:ring-1 focus:ring-orange-500 border border-slate-200 w-44 transition-all"
              />
              <button type="submit" className="absolute right-2.5 top-2 text-slate-400 hover:text-orange-500">
                <FiSearch className="text-sm" />
              </button>
            </form>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 text-xs font-semibold text-slate-700 hover:text-orange-600 focus:outline-none cursor-pointer"
                >
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-orange-500 shadow-sm" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                      <FiUser className="text-base" />
                    </div>
                  )}
                  <span className="truncate max-w-[100px]">{user?.displayName || "Account"}</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-50">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Logged in as</p>
                      <p className="text-xs font-bold text-slate-800 truncate">{user.displayName || "User"}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-orange-600 transition-all">
                      <FiLayout /> Dashboard
                    </Link>
                    <button onClick={handleLogOut} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-all font-semibold cursor-pointer">
                      <FiLogOut /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/register" className="flex items-center space-x-1 text-xs font-semibold text-slate-700 hover:text-orange-600 transition-colors">
                <FiUser className="text-base" />
                <span>My Account</span>
              </Link>
            )}

            {isAdmin && (
              <button onClick={handleBellClick} className="relative text-slate-700 hover:text-orange-600 transition-colors cursor-pointer" title="Order Notifications">
                <FiBell className="text-base" />
                {unseenOrders > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold animate-pulse">
                    {unseenOrders > 9 ? '9+' : unseenOrders}
                  </span>
                )}
              </button>
            )}

            <Link to="/wishlist" className="relative text-slate-700 hover:text-orange-600 transition-colors">
              <FiHeart className="text-base" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative text-slate-700 hover:text-orange-600 transition-colors">
              <FiShoppingCart className="text-base" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>

          {/* ================= MOBILE VIEW ================= */}
          {/* বাম পাশে মেনু বাটন */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setNavOpen(!navOpen)} 
              className="text-slate-700 hover:text-orange-600 focus:outline-none p-1"
            >
              {navOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>

          {/* মাঝখানে লোগো */}
          <div className="md:hidden flex items-center justify-center flex-grow mx-2">
            <Link to="/" className="flex items-center justify-center">
              <img 
                src="https://i.ibb.co.com/Xr23H5Bv/Whats-App-Image-2026-08-26-at-10-44-30-AM-removebg-preview.png" 
                alt="BILAL ZONE" 
                className="h-10 w-auto object-contain rounded-lg"
              />
              <span className='text-orange-500 text-xl font-bold ml-1'>BILAL</span>
              <span className='text-black text-xl font-bold ml-0.5'>ZONE</span>
            </Link>
          </div>

          {/* ডানপাশে নোটিফিকেশন (যদি অ্যাডমিন হয়) এবং কার্ট আইকন */}
          <div className="md:hidden flex items-center space-x-3">
            {isAdmin && (
              <button onClick={handleBellClick} className="relative p-1 text-slate-700 hover:text-orange-600 transition-colors cursor-pointer" title="Order Notifications">
                <FiBell className="text-xl" />
                {unseenOrders > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold animate-pulse">
                    {unseenOrders > 9 ? '9+' : unseenOrders}
                  </span>
                )}
              </button>
            )}

            <Link to="/cart" className="relative p-1 text-slate-700">
              <FiShoppingCart className="text-xl" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>

        </div>
      </div>

      {/* মোবাইল ড্রপডাউন মেনু */}
      {navOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 transition-all duration-300 shadow-lg">
          <div className="px-4 pt-3 pb-6 space-y-2 font-medium text-xs">
            <NavLink to="/" onClick={() => setNavOpen(false)} className={mobileActiveLinkStyle}>Home</NavLink>
            <NavLink to="/products" onClick={() => setNavOpen(false)} className={mobileActiveLinkStyle}>Shop</NavLink>
            <NavLink to="/contactUs" onClick={() => setNavOpen(false)} className={mobileActiveLinkStyle}>Contact</NavLink>
            
            <NavLink to="/wishlist" onClick={() => setNavOpen(false)} className={mobileActiveLinkStyle}>
              Wishlist ({wishlist.length})
            </NavLink>

            {isAdmin && (
              <NavLink to="/dashboard/manageOrders" onClick={() => setNavOpen(false)} className={mobileActiveLinkStyle}>
                Manage Orders {unseenOrders > 0 && `(${unseenOrders})`}
              </NavLink>
            )}

            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2 bg-orange-50/50 rounded-xl my-2">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-orange-400" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center font-bold">
                      <FiUser />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">Signed in as</p>
                    <p className="text-xs font-black text-slate-800 truncate">{user.displayName || user.email}</p>
                  </div>
                </div>
                <NavLink to="/dashboard" onClick={() => setNavOpen(false)} className={mobileActiveLinkStyle}>Dashboard</NavLink>
                <button onClick={handleLogOut} className="w-full text-left block px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-bold cursor-pointer">
                  Log Out
                </button>
              </>
            ) : (
              <NavLink to="/login" onClick={() => setNavOpen(false)} className={mobileActiveLinkStyle}>Login / My Account</NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;