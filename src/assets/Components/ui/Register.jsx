import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext'; 
import { FiMail, FiLock, FiUser, FiUserPlus, FiEye, FiEyeOff } from 'react-icons/fi';
import Swal from 'sweetalert2';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { FaGoogle } from 'react-icons/fa';

const Register = () => {
  const { createUser, googleLogin } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [step, setStep] = useState(1);
  const [otpCode, setOtpCode] = useState('');

  const navigate = useNavigate();

  // ধাপ ১: ওটিপি পাঠানোর জন্য
  const handleRegister = async (e) => {
  e.preventDefault();
  setError('');

  if (password !== confirmPassword) {
    return setError("Passwords do not match!");
  }

  if (password.length < 6) {
    return setError("Password should be at least 6 characters.");
  }

  setLoading(true);
  try {
    const otpRes = await axiosPublic.post('/send-otp', { email });
    
    if (otpRes.data.success) {
      // setServerOtp(otpRes.data.otp);  ❌ আর দরকার নেই, backend আর otp পাঠায় না
      setStep(2);
      Swal.fire({
        icon: "success",
        title: "OTP Sent!",
        text: "A 6-digit verification code has been sent to your Gmail.",
      });
    }
  } catch (err) {
    console.error(err);
    setError('Failed to send verification email. Try again.');
  } finally {
    setLoading(false);
  }
};

  // ধাপ ২: ওটিপি ভেরিফাই করে ফায়ারবেসে অ্যাকাউন্ট তৈরি, ব্যাকএন্ড থেকে টোকেন নেওয়া এবং ডাটা সেভ করা
 const handleVerifyOtp = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    // ✅ ব্যাকএন্ডে verify করা, লোকালি compare না করে
    const verifyRes = await axiosPublic.post('/verify-otp', { email, otp: otpCode });

    if (!verifyRes.data.success) {
      setLoading(false);
      return setError(verifyRes.data.message || "Invalid OTP Code! Please check your Gmail.");
    }

    // ১. ফায়ারবেসে ইউজার তৈরি করা
    const result = await createUser(email, password);
    const loggedUser = result.user;

    // ২. ব্যাকএন্ডের /jwt রাউট থেকে নিজস্ব টোকেন জেনারেট করে নেওয়া
    const resToken = await axiosPublic.post('/jwt', { email: loggedUser.email });
    const token = resToken.data.token;

    localStorage.setItem('access-token', token);

    // ৩. ডাটাবেজে ইউজার পাঠানো
    const userInfo = { name, email };
    await axiosPublic.post('/users', userInfo, {
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    Swal.fire({
      icon: "success",
      title: "Register successfully!",
      showConfirmButton: false,
      timer: 1500,
    });

    navigate('/');
  } catch (err) {
    console.error(err);
    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else if (err.code === 'auth/email-already-in-use') {
      setError('This email is already registered. Try signing in.');
    } else {
      setError('Failed to create an account. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const result = await googleLogin();
      const loggedUser = result.user;
      
      // গুগল লগইনের ক্ষেত্রেও ব্যাকএন্ড থেকে JWT টোকেন নিয়ে নেওয়া
      const resToken = await axiosPublic.post('/jwt', { email: loggedUser.email });
      const token = resToken.data.token;
      localStorage.setItem('access-token', token);

      const userInfo = {
        name: loggedUser?.displayName,
        email: loggedUser?.email,
      };
      
      await axiosPublic.post('/users', userInfo, {
        headers: {
          authorization: `Bearer ${token}`
        }
      });

      Swal.fire({
        icon: "success",
        title: "Sign Up successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/');
    } catch (err) {
      // ইউজার পপআপ কেটে দিলে ফায়ারবেসের এই এররটি হ্যান্ডেল করা হলো যাতে অ্যাপ ক্রাশ না করে
      if (err.code === 'auth/popup-closed-by-user') {
        console.log("Google popup closed by user.");
      } else {
        setError(err.message.replace("Firebase: ", ""));
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-gray-50 py-10">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {step === 1 ? "Create Account" : "Verify Email"}
          </h2>
          <p className="text-sm text-gray-400">
            {step === 1 ? "Join Billal Zone e-commerce today" : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold p-3.5 rounded-xl text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="John Doe" 
                  className="w-full bg-gray-50 text-gray-800 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                />
                <FiUser className="absolute left-3.5 top-3.5 text-gray-400 text-lg" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="example@billalzone.com" 
                  className="w-full bg-gray-50 text-gray-800 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                />
                <FiMail className="absolute left-3.5 top-3.5 text-gray-400 text-lg" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full bg-gray-50 text-gray-800 pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                />
                <FiLock className="absolute left-3.5 top-3.5 text-gray-400 text-lg" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-gray-400 cursor-pointer">
                  {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full bg-gray-50 text-gray-800 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                />
                <FiLock className="absolute left-3.5 top-3.5 text-gray-400 text-lg" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full text-white font-semibold py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiUserPlus className="text-base" /> 
              <span>{loading ? "Sending OTP..." : "Get OTP Code"}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Enter 6-Digit OTP</label>
              <input 
                type="text" 
                maxLength="6"
                required 
                value={otpCode} 
                onChange={(e) => setOtpCode(e.target.value)} 
                placeholder="123456" 
                className="w-full bg-gray-50 text-center tracking-widest text-2xl text-gray-800 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full text-white font-semibold py-3.5 rounded-xl bg-green-600 hover:bg-green-700 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? "Verifying..." : "Verify & Register"}</span>
            </button>
          </form>
        )}

        {step === 1 && (
          <>
            <button 
              onClick={handleGoogleLogin} 
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
            >
              <FaGoogle className="text-red-500 text-base" /> Google
            </button>

            <p className="text-center text-xs text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">
                Sign In here
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;