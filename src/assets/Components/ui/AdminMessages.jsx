import  { useState, useEffect } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FaEnvelope, FaPaperPlane, FaTrashAlt, FaClock } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AdminMessages = () => {
    const axiosSecure = useAxiosSecure();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMsg, setSelectedMsg] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axiosSecure.get('/messages');
                setMessages(res.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [axiosSecure]);

    // মেসেজ রিফ্রেশ করার জন্য আলাদা একটি ফাংশন
    const refreshMessages = async () => {
        try {
            const res = await axiosSecure.get('/messages');
            setMessages(res.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    // রিপ্লাই সাবমিট করার ফাংশন
    const handleReplySubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosSecure.patch(`/messages/${selectedMsg._id}`, {
                reply: replyText
            });

            if (res.data.success) {
                Swal.fire('Success!', 'Reply sent to user email successfully!', 'success');
                setSelectedMsg(null);
                setReplyText('');
                refreshMessages();
            }
        } catch (error) {
            console.error("Reply error:", error);
            Swal.fire('Error!', 'Failed to send reply.', 'error');
        }
    };

    // মেসেজ ডিলিট করার ফাংশন
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f97316",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/messages/${id}`);
                    Swal.fire("Deleted!", "Message has been deleted.", "success");
                    refreshMessages();
                } catch (error) {
                    console.error("Delete error:", error);
                }
            }
        });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2 mb-6">
                <FaEnvelope className="text-orange-500" /> Customer Messages ({messages.length})
            </h1>

            {loading ? (
                <p className="text-gray-400">Loading messages...</p>
            ) : messages.length === 0 ? (
                <p className="text-gray-400 font-semibold bg-white p-6 rounded-xl shadow-sm">No messages found!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {messages.map((msg) => (
                        <div key={msg._id} className={`bg-white p-6 rounded-2xl shadow-sm border ${msg.status === 'unread' ? 'border-orange-300 bg-orange-50/20' : 'border-gray-200'}`}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base">{msg.name}</h3>
                                    <p className="text-xs text-orange-600 font-semibold">{msg.email}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${msg.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {msg.status}
                                </span>
                            </div>

                            <p className="text-xs font-bold text-gray-700 mb-1">Subject: {msg.subject}</p>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl mb-3 border">{msg.message}</p>

                            {msg.reply && (
                                <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl mb-3">
                                    <p className="text-xs font-bold text-blue-800 mb-1">Admin Reply Sent:</p>
                                    <p className="text-xs text-blue-700">{msg.reply}</p>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                    <FaClock /> {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'N/A'}
                                </span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => { setSelectedMsg(msg); setReplyText(msg.reply || ''); }}
                                        className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 cursor-pointer"
                                    >
                                        {msg.reply ? 'Edit Reply' : 'Reply'}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(msg._id)}
                                        className="p-2 bg-red-50 text-red-600 rounded-lg text-xs hover:bg-red-100 cursor-pointer"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reply Modal */}
            {selectedMsg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Reply to {selectedMsg.name}</h3>
                        <p className="text-xs text-gray-500 mb-4 bg-gray-50 p-2.5 rounded-lg border">User Message: "{selectedMsg.message}"</p>

                        <form onSubmit={handleReplySubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-600 block mb-1">Your Reply (Will be sent via Email)</label>
                                <textarea 
                                    rows="4"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write your reply here..."
                                    required
                                    className="w-full p-3 text-gray-600 bg-gray-50 rounded-xl border text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button 
                                    type="button"
                                    onClick={() => setSelectedMsg(null)}
                                    className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-semibold hover:bg-orange-600 flex items-center gap-1 cursor-pointer shadow-md"
                                >
                                    <FaPaperPlane /> Send Email Reply
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMessages;