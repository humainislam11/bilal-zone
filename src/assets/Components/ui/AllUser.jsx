import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { MdOutlineDelete } from "react-icons/md";
import { FaUsers, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";

const AllUser = () => {
    const axiosSecure = useAxiosSecure();
    const [searchQuery, setSearchQuery] = useState("");

    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });

    // সার্চ ফিল্টার করার জন্য
    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAdmin = user => {
        axiosSecure.patch(`/users/admin/${user._id}`)
        .then(res => {
            if(res.data.modifiedCount > 0){
                refetch();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `${user.name || 'User'} is an Admin Now!`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    };

    const handleDeleteUser = user => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`users/${user._id}`)
                .then(res => {
                    if(res.data.deletedCount > 0){
                        refetch();
                        Swal.fire({
                            title: "Deleted!",
                            text: "User has been deleted.",
                            icon: "success"
                        });
                    }
                });
            }
        });
    };

    return (
        <div className="p-6 md:p-10 bg-slate-100 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Manage Users</h1>
                    <p className="text-slate-500 text-sm mt-1">Total Users: <span className="font-semibold text-indigo-600">{users.length}</span></p>
                </div>
                
                {/* Search Box */}
                <div className="relative w-full md:w-72">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <FaSearch />
                    </span>
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="table w-full text-left border-collapse">
                        {/* head */}
                        <thead className="bg-indigo-600 text-white uppercase text-xs tracking-wider">
                            <tr>
                                <th className="py-4 px-6">#</th>
                                <th className="py-4 px-6">Name</th>
                                <th className="py-4 px-6">Email</th>
                                <th className="py-4 px-6 text-center">Role</th>
                                <th className="py-4 px-6 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600 text-sm">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-6 font-medium text-slate-400">{index + 1}</td>
                                        <td className="py-4 px-6 font-semibold text-slate-800">{user?.name || 'N/A'}</td>
                                        <td className="py-4 px-6 text-slate-500">{user?.email}</td>
                                        <td className="py-4 px-6 text-center">
                                            {user.role === 'admin' ? (
                                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                                    Admin
                                                </span>
                                            ) : (
                                                <button 
                                                    onClick={() => handleAdmin(user)} 
                                                    title="Make Admin"
                                                    className="bg-amber-500 hover:bg-amber-600 text-white p-2.5 rounded-xl shadow-sm transition-all duration-200 inline-flex items-center gap-1 cursor-pointer"
                                                >
                                                    <FaUsers className="text-base" />
                                                </button>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button 
                                                onClick={() => handleDeleteUser(user)} 
                                                title="Delete User"
                                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2.5 rounded-xl transition-all duration-200 inline-flex items-center cursor-pointer"
                                            >
                                                <MdOutlineDelete className="text-xl" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-slate-400">
                                        No users found!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllUser;