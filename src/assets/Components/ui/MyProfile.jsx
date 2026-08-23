import { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { FaUserEdit, FaEnvelope, FaUserTag, FaTimes, FaCamera, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';

// 🌟 ক্লাউডিনারি কনফিগারেশন (আপনার প্রজেক্টের ক্রডেনশিয়াল অনুযায়ী)
const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const cloudinary_upload_preset = "bilal-zone"; 
const cloudinary_api = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

const MyProfile = () => {
    const { user, updateUserProfile } = useContext(AuthContext);

    // মোডাল এবং ফর্মের স্টেট
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [imageFile, setSelectedFile] = useState(null); 
    const [imagePreview, setPreviewImage] = useState(''); 
    const [loading, setLoading] = useState(false);

    // মোডাল খোলার সময় বর্তমান ডাটা সেট করা
    const handleOpenModal = () => {
        setName(user?.displayName || '');
        setPreviewImage(user?.photoURL || '');
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    // কম্পিউটার থেকে ছবি সিলেক্ট করার পর প্রিভিউ দেখানোর ফাংশন
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // প্রোফাইল আপডেটের ফাংশন
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let photoURL = user?.photoURL; // যদি নতুন ছবি না দেয়, তবে পুরোনো ছবিই থাকবে

            // যদি কম্পিউটার থেকে নতুন ছবি সিলেক্ট করা হয়ে থাকে, তবে ক্লাউডিনারিতে আপলোড করব
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('upload_preset', cloudinary_upload_preset);
                
                const res = await fetch(cloudinary_api, {
                    method: 'POST',
                    body: formData
                });
                const imgRes = await res.json();
                
                if (!imgRes.secure_url) {
                    throw new Error("Cloudinary image upload failed");
                }
                
                photoURL = imgRes.secure_url;
            }

            // ফায়ারবেস প্রোফাইল আপডেট (যাতে নাম বা ছবি যেটিই পরিবর্তন করুক তা সেভ হয়)
            await updateUserProfile(name || user?.displayName, photoURL);
            
            Swal.fire({
                icon: "success",
                title: "Profile Updated Successfully!",
                showConfirmButton: false,
                timer: 1500,
            });

            setIsModalOpen(false);
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "Something went wrong!",
                text: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-700 p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* বাম দিকের কার্ড: প্রোফাইল পিকচার ও বেসিক ইনফো */}
                    <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm text-center">
                        <div className="avatar mb-4 flex justify-center">
                            <div className="w-32 h-32 rounded-full ring ring-amber-500 ring-offset-2 overflow-hidden">
                                <img 
                                    src={user?.photoURL || "https://i.ibb.co/56bJdJ4/user.png"} 
                                    alt="User" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold">{user?.displayName || "User Name"}</h2>
                        <p className="text-gray-500 text-sm mb-4 truncate">{user?.email}</p>
                        <button 
                            onClick={handleOpenModal}
                            className="btn btn-outline border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white hover:border-amber-500 w-full"
                        >
                            <FaUserEdit /> Edit Profile
                        </button>
                    </div>

                    {/* ডান দিকের কার্ড: বিস্তারিত তথ্য */}
                    <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm">
                        <h3 className="text-xl font-semibold mb-6 border-b pb-2">Account Details</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <FaUserTag className="text-amber-600 text-2xl" />
                                <div>
                                    <p className="text-sm text-gray-400">Full Name</p>
                                    <p className="font-medium">{user?.displayName || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <FaEnvelope className="text-amber-600 text-2xl" />
                                <div>
                                    <p className="text-sm text-gray-400">Email Address</p>
                                    <p className="font-medium">{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-amber-600 text-2xl font-bold">#</div>
                                <div>
                                    <p className="text-sm text-gray-400">User ID</p>
                                    <p className="font-medium break-all">{user?.uid}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🛠️ Edit Profile Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative animate-fadeIn">
                        <div className="flex justify-between items-center mb-4 border-b pb-3">
                            <h3 className="text-xl font-bold text-gray-800">Update Profile</h3>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            {/* ছবি আপলোড ও প্রিভিউ সেকশন */}
                            <div className="flex flex-col items-center justify-center space-y-2">
                                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-amber-500 group">
                                    <img 
                                        src={imagePreview || "https://i.ibb.co/56bJdJ4/user.png"} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover"
                                    />
                                    <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <FaCamera className="text-xl mb-1" />
                                        <span className="text-[10px]">Change</span>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-400">Click on the image to upload from computer</p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                />
                                <span className="text-[11px] text-gray-400 mt-1 block">খালি রাখলে বা পরিবর্তন না করলে পুরোনো নামই থাকবে।</span>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-100 transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition-all flex items-center justify-center min-w-[120px] cursor-pointer disabled:bg-amber-300"
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="animate-spin text-sm mr-2" /> Updating...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyProfile;