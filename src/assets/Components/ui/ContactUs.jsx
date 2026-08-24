import  { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane, FaClock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure'; 

const ContactUs = () => {
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target;
        const messageData = {
            name: form.name.value,
            email: form.email.value,
            subject: form.subject.value,
            message: form.message.value
        };

        try {
            const res = await axiosSecure.post('/messages', messageData);
            if (res.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Message Sent!',
                    text: 'We have received your message. We will reply soon.',
                    confirmButtonColor: '#f97316'
                });
                form.reset();
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Failed to send message. Please try again later.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 text-gray-700 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Header */}
            <div className="max-w-7xl mx-auto text-center mb-12">
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest">
                    Get In Touch
                </span>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-3">We'd Love To Hear From You</h1>
                <p className="text-gray-500 max-w-xl mx-auto mt-2 text-sm">
                    Have a question about our products, orders, or anything else? Feel free to send us a message.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Info Cards */}
                <div className="space-y-6 lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                        <div className="bg-orange-50 text-orange-500 p-4 rounded-xl text-lg"><FaMapMarkerAlt /></div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-base">Our Location</h3>
                            <p className="text-gray-500 text-sm mt-1">Sreemangal-Railgate,Moulovibazar, Sylhet, Bangladesh</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                        <div className="bg-orange-50 text-orange-500 p-4 rounded-xl text-lg"><FaPhoneAlt /></div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-base">Phone Number</h3>
                            <p className="text-gray-500 text-sm mt-1">+8801608313487</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                        <div className="bg-orange-50 text-orange-500 p-4 rounded-xl text-lg"><FaEnvelope /></div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-base">Email Support</h3>
                            <p className="text-gray-500 text-sm mt-1">bilalzone2026@gmail.com</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                        <div className="bg-orange-50 text-orange-500 p-4 rounded-xl text-lg"><FaClock /></div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-base">Working Hours</h3>
                            <p className="text-gray-500 text-sm mt-1">Sat - Thu: 9:00 AM - 8:00 PM</p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="text-xl font-black text-gray-800 mb-6">Send Us A Message</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Your Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    placeholder="Enter your name" 
                                    required 
                                    className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Your Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    placeholder="Enter your email" 
                                    required 
                                    className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Subject</label>
                            <input 
                                type="text" 
                                name="subject" 
                                placeholder="What is this about?" 
                                required 
                                className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Message</label>
                            <textarea 
                                name="message" 
                                rows="5" 
                                placeholder="Write your message here..." 
                                required 
                                className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-100"
                        >
                            {loading ? "Sending..." : <> <FaPaperPlane /> Send Message </>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;