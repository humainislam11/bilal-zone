import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { FaMoneyBillWave, FaMobileAlt, FaMapMarkerAlt, FaShoppingBag, FaTruck, FaShieldAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Checkout = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();

    // Cart / ProductDetails পেজ থেকে পাওয়া ডাটা
    const { totalAmount = 0, cartItems = [] } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [tranId, setTranId] = useState('');
    const [loading, setLoading] = useState(false);

    // কাস্টমার এড্রেস ও ইনফরমেশন
    const [formData, setFormData] = useState({
        name: user?.displayName || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '', 
        note: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ডেলিভারি চার্জ স্থায়ীভাবে ১২০ টাকা নির্ধারণ করা হলো
    const deliveryCharge = 120;
    const finalPrice = totalAmount + deliveryCharge;

    // মোট আইটেম সংখ্যা
    const totalItemsCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

    const handleConfirmOrder = async (e) => {
        e.preventDefault();

        if (!formData.phone || !formData.address || !formData.city) {
            return Swal.fire({
                icon: 'warning',
                title: 'Incomplete Information',
                text: 'Please fill up all required customer address details!'
            });
        }

        // বিকাশ পেমেন্টের জন্য Transaction ID চেক
        if (paymentMethod === 'bkash' && !tranId) {
            return Swal.fire({
                icon: 'warning',
                title: 'Transaction ID Required',
                text: 'Please enter your bKash Transaction ID to proceed!'
            });
        }

        setLoading(true);

        const orderInfo = {
            customerName: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            note: formData.note,
            items: cartItems,
            subtotal: totalAmount,
            deliveryCharge: deliveryCharge,
            totalPrice: finalPrice,
            paymentMethod: paymentMethod,
            transactionId: paymentMethod === 'bkash' ? tranId : 'COD',
            status: 'pending',
            date: new Date()
        };

        try {
            const res = await axiosPublic.post('/orders', orderInfo);
            if (res.data.insertedId || res.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Order Placed Successfully!',
                    text: 'Thank you for shopping with us.',
                    timer: 2000,
                    showConfirmButton: false
                });
                navigate('/dashboard/myOrders'); // অর্ডার কনফার্ম শেষে My Orders পেজে রিডাইরেক্ট
            }
        } catch (error) {
            console.error("Order placement error:", error);
            Swal.fire('Error', 'Failed to place order. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen py-8 px-4 font-sans text-gray-800">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-black mb-6 flex items-center gap-2 text-gray-800">
                    <FaShoppingBag className="text-orange-500" /> Checkout
                </h2>

                <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* 👈 বাম পাশ: এড্রেস, অর্ডারের আইটেম ও পেমেন্ট মেথড */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* ১. Shipping & Delivery Address Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
                            <div className="flex items-center gap-2 border-b pb-3">
                                <FaMapMarkerAlt className="text-orange-500 text-lg" />
                                <h3 className="font-bold text-lg text-gray-800">1. Delivery Address</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleInputChange} 
                                        required 
                                        className="w-full px-4 py-2.5 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Phone Number</label>
                                    <input 
                                        type="text" 
                                        name="phone" 
                                        placeholder="017XXXXXXXX" 
                                        value={formData.phone} 
                                        onChange={handleInputChange} 
                                        required 
                                        className="w-full px-4 py-2.5 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">City / Region</label>
                                    <input 
                                        type="text" 
                                        name="city" 
                                        placeholder="e.g. Dhaka / Sylhet / Sreemangal" 
                                        value={formData.city} 
                                        onChange={handleInputChange} 
                                        required 
                                        className="w-full px-4 py-2.5 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleInputChange} 
                                        required 
                                        className="w-full px-4 py-2.5 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Detailed Address</label>
                                <textarea 
                                    name="address" 
                                    rows="2" 
                                    placeholder="House no, Road no, Area, Post Office" 
                                    value={formData.address} 
                                    onChange={handleInputChange} 
                                    required 
                                    className="w-full px-4 py-2.5 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm"
                                ></textarea>
                            </div>
                        </div>

                        {/* ২. Order Package Review */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
                            <h3 className="font-bold text-lg border-b pb-3 text-gray-800">2. Package Items ({totalItemsCount})</h3>
                            
                            <div className="divide-y max-h-60 overflow-y-auto pr-2">
                                {cartItems.length > 0 ? (
                                    cartItems.map((item, index) => (
                                        <div key={index} className="py-3 flex items-center gap-4">
                                            <img 
                                                src={item.image || 'https://via.placeholder.com/80'} 
                                                alt={item.name} 
                                                className="w-16 h-16 object-cover rounded-lg border bg-gray-50 shrink-0" 
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{item.name}</h4>
                                                <p className="text-xs text-gray-500 mt-0.5">Qty: <span className="font-bold text-gray-700">{item.quantity || 1}</span></p>
                                            </div>
                                            <p className="font-extrabold text-orange-600 text-sm">৳{item.price * (item.quantity || 1)}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 py-2">No items found in cart.</p>
                                )}
                            </div>
                        </div>

                        {/* ৩. Payment Method Selection */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
                            <h3 className="font-bold text-lg border-b pb-3 text-gray-800">3. Select Payment Method</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div 
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                        paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50/40 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => setPaymentMethod('cod')}
                                >
                                    <div className="flex items-center gap-3 font-bold text-gray-800 text-sm">
                                        <FaMoneyBillWave className="text-green-600 text-xl" /> Cash on Delivery
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Pay in cash when your order is delivered to your doorstep.</p>
                                </div>

                                <div 
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                        paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-50/40 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => setPaymentMethod('bkash')}
                                >
                                    <div className="flex items-center gap-3 font-bold text-pink-600 text-sm">
                                        <FaMobileAlt className="text-xl" /> bKash Online Payment
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Fast and secure payment using your bKash wallet.</p>
                                </div>
                            </div>

                            {paymentMethod === 'bkash' && (
                                <div className="mt-4 p-4 bg-pink-50/60 rounded-xl border border-pink-200 space-y-2">
                                    <p className="text-xs font-semibold text-gray-700">
                                        Please send payment to our bKash Merchant Number: <span className="font-bold text-pink-600">01700000000</span>
                                    </p>
                                    <input 
                                        type="text" 
                                        placeholder="Enter 10-digit bKash Transaction ID (TrxID)" 
                                        value={tranId} 
                                        onChange={(e) => setTranId(e.target.value)} 
                                        className="w-full px-4 py-2.5 rounded-xl border bg-white focus:ring-2 focus:ring-pink-400 outline-none text-sm font-mono uppercase" 
                                    />
                                </div>
                            )}
                        </div>

                    </div>

                    {/* 👉 ডান পাশ: অর্ডার সামারি */}
                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit space-y-4 sticky top-6">
                            <h3 className="font-bold text-lg border-b pb-3 text-gray-800">Order Summary</h3>
                            
                            <div className="space-y-2.5 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Items Total ({totalItemsCount})</span> 
                                    <span className="font-semibold text-gray-800">৳{totalAmount}</span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span className="flex items-center gap-1"><FaTruck className="text-xs text-gray-400" /> Delivery Fee</span> 
                                    <span className="font-semibold text-gray-800">৳{deliveryCharge}</span>
                                </div>

                                <div className="border-t pt-3 flex justify-between font-black text-lg text-gray-900">
                                    <span>Total Payable</span> 
                                    <span className="text-orange-600">৳{finalPrice}</span>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-md transition-all cursor-pointer text-center flex justify-center items-center gap-2 disabled:bg-gray-400"
                            >
                                {loading ? 'Processing Order...' : 'Place Order Now'}
                            </button>

                            <div className="pt-2 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                                <FaShieldAlt /> 100% Safe & Secure Checkout
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Checkout;