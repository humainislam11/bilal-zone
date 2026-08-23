import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { FaUserShield, FaShoppingBag, FaBoxOpen, FaUsers, FaDollarSign } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const AdminProfile = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                // ব্যাকএন্ড থেকে ড্যাশবোর্ড স্ট্যাটস ফেচ করা হচ্ছে
                const res = await axiosSecure.get('/admin-stats');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminStats();
    }, [axiosSecure]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* পেজের শিরোনাম */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                    <FaUserShield className="text-orange-500" /> Admin Profile Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-1">Welcome back, here is a quick overview of your store.</p>
            </div>

            {/* এডমিন ইনফো কার্ড */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                    <img 
                        src={user?.photoURL || 'https://via.placeholder.com/150'} 
                        alt="Admin Profile" 
                        className="w-28 h-28 rounded-full object-cover border-4 border-orange-500 shadow-md"
                    />
                    <span className="absolute bottom-1 right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold border-2 border-white">
                        Active
                    </span>
                </div>

                <div className="space-y-2 text-center md:text-left flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">{user?.displayName || 'Admin User'}</h2>
                    <p className="text-gray-500 text-sm">{user?.email || 'admin@bilalzone.com'}</p>
                    <div className="inline-block bg-orange-100 text-orange-600 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                        Role: Administrator
                    </div>
                </div>
            </div>

            {/* স্ট্যাটিস্টিক্স / ওভারভিউ কার্ড (ডায়নামিক ডেটা) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Orders */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Total Orders</p>
                        <h3 className="text-2xl font-black text-gray-800 mt-1">
                            {loading ? "..." : (stats.totalOrders || 0)}
                        </h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                        <FaShoppingBag />
                    </div>
                </div>

                {/* Total Products */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Total Products</p>
                        <h3 className="text-2xl font-black text-gray-800 mt-1">
                            {loading ? "..." : (stats.totalProducts || 0)}
                        </h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl">
                        <FaBoxOpen />
                    </div>
                </div>

                {/* Total Users */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Total Users</p>
                        <h3 className="text-2xl font-black text-gray-800 mt-1">
                            {loading ? "..." : (stats.totalUsers || 0)}
                        </h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
                        <FaUsers />
                    </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Total Revenue</p>
                        <h3 className="text-2xl font-black text-gray-800 mt-1">
                            ৳{loading ? "..." : (stats.totalRevenue || 0).toLocaleString()}
                        </h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl">
                        <FaDollarSign />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminProfile;