import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext'; 
import Swal from 'sweetalert2';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { FaGoogle } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

const Register = () => {
  const { googleLogin } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await googleLogin();
      const loggedUser = result.user;
      
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
      if (err.code === 'auth/popup-closed-by-user') {
        console.log("Google popup closed by user.");
      } else {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-gray-50 py-10">
      <Helmet>
        <title>BILAL-ZONE-REGISTER</title>
      </Helmet>
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-gray-400">
            Join Billal Zone e-commerce with Google
          </p>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          type="button"
          className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
        >
          <FaGoogle className="text-red-500 text-lg" /> Continue with Google
        </button>

      
      </div>
    </div>
  );
};

export default Register;