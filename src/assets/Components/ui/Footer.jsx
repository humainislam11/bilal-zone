import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800/80">
            <div className="max-w-6xl mx-auto px-6">
                
                {/* মূল ফুটার কন্টেন্ট */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-12 border-b border-slate-800/80 items-center">
                    
                    {/* বাম পাশ: লোগো ও বর্ণনা */}
                    <div className="space-y-4">
                        <Link to="/" className="inline-block">
                            <img 
                                src="https://i.ibb.co.com/bgnVy6BL/Whats-App-Image-2026-09-03-at-2-45-57-PM-removebg-preview.png" 
                                alt="BILAL ZONE" 
                                className="h-12 w-auto object-contain rounded-xl"
                            />
                        </Link>
                        <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                            Your ultimate destination for quality electronics, accessories, and trendy clothing. Shop with confidence!
                        </p>
                        <div className="flex gap-3 pt-1">
                            {/* Facebook */}
                            <a href="https://www.facebook.com/share/1HDeNZRzRX/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="p-2.5 bg-slate-900 hover:bg-orange-600 text-slate-300 hover:text-white rounded-xl transition-all border border-slate-800">
                                <FaFacebook />
                            </a>
                            {/* Instagram */}
                            <a href="https://www.instagram.com/bilalzone?igsi=MTEzcmZ6OG1rbjk5cQ%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" className="p-2.5 bg-slate-900 hover:bg-orange-600 text-slate-300 hover:text-white rounded-xl transition-all border border-slate-800">
                                <FaInstagram />
                            </a>
                            {/* WhatsApp (Linkedin ও Twitter এর পরিবর্তে যুক্ত করা হয়েছে) */}
                            <a href="https://wa.me/+8801608313487" target="_blank" rel="noreferrer" className="p-2.5 bg-slate-900 hover:bg-orange-600 text-slate-300 hover:text-white rounded-xl transition-all border border-slate-800">
                                <FaWhatsapp />
                            </a>
                        </div>
                    </div>

                    {/* ডান পাশ: কন্টাক্ট ইনফো */}
                    <div className="md:justify-self-end space-y-4 bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 w-full md:w-80">
                        <h3 className="text-white font-bold text-base tracking-wide border-b border-slate-800 pb-2">Contact Us</h3>
                        <ul className="space-y-3 text-xs text-slate-400">
                            <li className="flex items-start gap-3">
                                <FaMapMarkerAlt className="text-orange-500 mt-0.5 shrink-0 text-sm" />
                                <span>Sreemangal, Sylhet, Bangladesh</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaPhoneAlt className="text-orange-500 shrink-0 text-sm" />
                                <span>+8801608313487</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaEnvelope className="text-orange-500 shrink-0 text-sm" />
                                <span>teambilalzone@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* ফুটারের নিচের অংশ (কপিরাইট ও পলিসি লিংক) */}
                <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
                    <p>&copy; {new Date().getFullYear()} BILAL-ZONE. All rights reserved.</p>
                    <div className="flex gap-6 font-medium">
                        <a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-orange-400 transition-colors">Support</a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;