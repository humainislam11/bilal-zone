import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                {/* Brand Info */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-black text-white tracking-wider">
                        BILAL<span className="text-orange-500">-ZONE</span>
                    </h2>
                    <p className="text-sm text-gray-400">
                        Your ultimate destination for quality electronics, accessories, and trendy clothing. Shop with confidence!
                    </p>
                    <div className="flex gap-3 pt-2">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2.5 bg-gray-800 hover:bg-orange-500 text-white rounded-xl transition-all">
                            <FaFacebook />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2.5 bg-gray-800 hover:bg-orange-500 text-white rounded-xl transition-all">
                            <FaInstagram />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2.5 bg-gray-800 hover:bg-orange-500 text-white rounded-xl transition-all">
                            <FaTwitter />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2.5 bg-gray-800 hover:bg-orange-500 text-white rounded-xl transition-all">
                            <FaLinkedin />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-4 border-b border-gray-800 pb-2">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-orange-400 transition-colors">Home</Link></li>
                        <li><Link to="/shop" className="hover:text-orange-400 transition-colors">Shop</Link></li>
                        <li><Link to="/dashboard" className="hover:text-orange-400 transition-colors">Dashboard</Link></li>
                        <li><Link to="/about" className="hover:text-orange-400 transition-colors">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-orange-400 transition-colors">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-4 border-b border-gray-800 pb-2">Categories</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/shop" className="hover:text-orange-400 transition-colors">Electronics</Link></li>
                        <li><Link to="/shop" className="hover:text-orange-400 transition-colors">Accessories</Link></li>
                        <li><Link to="/shop" className="hover:text-orange-400 transition-colors">Clothing</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-4 border-b border-gray-800 pb-2">Contact Us</h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li className="flex items-start gap-3">
                            <FaMapMarkerAlt className="text-orange-500 mt-1 shrink-0" />
                            <span>Sreemangal, Sylhet, Bangladesh</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <FaPhoneAlt className="text-orange-500 shrink-0" />
                            <span>+880 1234-567890</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <FaEnvelope className="text-orange-500 shrink-0" />
                            <span>support@bilalzone.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Copyright */}
            <div className="max-w-7xl mx-auto px-6 border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
                <p>&copy; {new Date().getFullYear()} BILAL-ZONE. All rights reserved.</p>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-gray-300 transition-colors">Support</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;