import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // useLocation যোগ করা হয়েছে
import { AuthContext } from '../../../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';


const Login = () => {
  const { signIn } = useContext(AuthContext);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation(); // লোকেশন ধরা হয়েছে
  
  // আগের লোকেশনটি এখানে সেভ থাকবে, যদি না থাকে তবে হোম ("/") এ যাবে
  const from = location.state?.from?.pathname || "/";

  // 🔐 ১. ইমেইল ও পাসওয়ার্ড দিয়ে লগইন হ্যান্ডলার
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      alert("Login Successful! Welcome back.");
      navigate(from, { replace: true }); // রিডাইরেক্ট লজিক এখানে
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password.');
      } else {
        setError('Failed to sign in.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 🌐 ২. গুগল পপআপ লগইন হ্যান্ডলার
  

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50 py-10">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8 space-y-6">
        
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Welcome Back!</h2>
          <p className="text-sm text-gray-400">Access your Billal Zone account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold p-3.5 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input 
                type="email" required value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="example@billalzone.com" 
                className="w-full bg-gray-50 text-gray-800 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all" 
              />
              <FiMail className="absolute left-3.5 top-3.5 text-gray-400 text-lg" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} required value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full bg-gray-50 text-gray-800 pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all" 
              />
              <FiLock className="absolute left-3.5 top-3.5 text-gray-400 text-lg" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600">
                {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" disabled={loading} 
            className={`w-full text-white font-semibold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 text-sm ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            <FiLogIn className="text-base" /> 
            <span>{loading ? "Signing In..." : "Sign In"}</span>
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">Or continue with</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        

        <p className="text-center text-xs text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;