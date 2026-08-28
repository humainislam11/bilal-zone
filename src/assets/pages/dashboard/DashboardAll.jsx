import { useState } from "react";
import { BsBagCheckFill } from "react-icons/bs";
import { FaHouseUser, FaRegUserCircle, FaBars, FaTimes, FaBoxOpen, FaClipboardList, FaEnvelopeOpenText } from "react-icons/fa";
import { GoReport } from "react-icons/go";
import { IoMdAddCircle } from "react-icons/io";
import { TfiAnnouncement } from "react-icons/tfi";
import { Outlet, NavLink, Navigate, useLocation } from "react-router-dom";
import useAdmin from "../../hooks/useAdmin";

const DashboardAll = () => {
    const [isAdmin] = useAdmin();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // যদি কেউ শুধু `/dashboard` বা `/dashboard/` এ প্রবেশ করে, তবে তাকে ডিফল্ট পেজে পাঠিয়ে দিবে
    if (location.pathname === "/dashboard" || location.pathname === "/dashboard/") {
        return <Navigate to={isAdmin ? "/dashboard/adminProfile" : "/dashboard/myProfile"} replace />;
    }

    // অ্যাক্টিভ ক্লাসের জন্য স্টাইল
    const navLinkClass = ({ isActive }) =>
        isActive
            ? "flex items-center gap-3 p-3 bg-blue-50 text-blue-600 font-bold rounded-xl transition-all"
            : "flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all";

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 relative">
            
            {/* 📱 মোবাইল টপ হেডার (ছোট স্ক্রিনের জন্য মেনু বার্গার বাটন) */}
            <div className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                <span className="font-black text-gray-900 text-lg">Billal Zone Dashboard</span>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-gray-700 hover:bg-gray-100 rounded-xl focus:outline-none cursor-pointer"
                >
                    {isSidebarOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                </button>
            </div>

            {/* 🌑 মোবাইল ব্যাকড্রপ ওভারলে (সাইডবার ওপেন থাকলে বাইরে ক্লিক করলে বন্ধ হবে) */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs transition-opacity"
                ></div>
            )}

            {/* 📂 সাইডবার (ডেস্কটপে ফিক্সড, মোবাইলে স্লাইডার) */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50
                w-64 bg-white text-gray-700 font-bold min-h-screen border-r 
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
                <div className="p-5 hidden md:block border-b">
                    <h2 className="text-xl font-black text-gray-900">Dashboard</h2>
                </div>

                <ul className="menu p-4 space-y-1">
                    {isAdmin ? (
                        <>
                            <li><NavLink to='/dashboard/adminProfile' onClick={() => setIsSidebarOpen(false)} className={navLinkClass}><FaHouseUser size={18} />Admin Profile</NavLink></li>
                            <li><NavLink to='/dashboard/allUser' onClick={() => setIsSidebarOpen(false)} className={navLinkClass}><FaRegUserCircle size={18} /> Manage Users</NavLink></li>
                            <li><NavLink to='/dashboard/addProduct' onClick={() => setIsSidebarOpen(false)} className={navLinkClass}><IoMdAddCircle size={18} /> Add Product</NavLink></li>
                            <li><NavLink to='/dashboard/manageProducts' onClick={() => setIsSidebarOpen(false)} className={navLinkClass}><FaBoxOpen size={18} /> Manage Products</NavLink></li>
                            <li><NavLink to='/dashboard/reportedComments' onClick={() => setIsSidebarOpen(false)} className={navLinkClass}><GoReport size={18} /> Reported Comments</NavLink></li>
                            <li><NavLink to='/dashboard/makeAnnouncement' onClick={() => setIsSidebarOpen(false)} className={navLinkClass}><TfiAnnouncement size={18} /> Make Announcement</NavLink></li>
                            <li><NavLink to='/dashboard/manageOrders' onClick={() => setIsSidebarOpen(false)} className={navLinkClass}><FaClipboardList size={18} /> Manage Orders</NavLink></li>
                            <li><NavLink to='/dashboard/adminMessages' onClick={() => setIsSidebarOpen(false)} className={navLinkClass}><FaEnvelopeOpenText size={18} /> Admin Messages</NavLink></li>
                        </>
                    ) : (
                        <>
                            <li><NavLink to='/dashboard/myProfile' onClick={() => setIsSidebarOpen(false)} className={navLinkClass}><FaHouseUser size={18} /> My Profile</NavLink></li>
                            <li><NavLink to='/dashboard/myOrders' onClick={() => setIsSidebarOpen(false)} className={navLinkClass}><BsBagCheckFill size={18} /> My Orders</NavLink></li>
                            
                        </>
                    )}
                </ul>
            </aside>
            
            {/* 💻 মূল ড্যাশবোর্ড কন্টেন্ট এরিয়া */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-auto w-full">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardAll;