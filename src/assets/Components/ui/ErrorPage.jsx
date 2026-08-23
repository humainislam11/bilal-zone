import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';

const ErrorPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm">
        
        {/* ⚠️ আইকন সেকশন */}
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <FiAlertTriangle className="text-5xl" />
        </div>

        {/* 🛑 এরর টেক্সট */}
        <div className="space-y-2">
          <h1 className="text-7xl font-black text-gray-900 tracking-tight">404</h1>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Page Not Found</h2>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            Oops! The page you are looking for doesn't exist or has been moved. Let's get you back on track at Billal Zone.
          </p>
        </div>

        <hr className="border-gray-100 my-4" />

        {/* 🏁 অ্যাকশন বাটন গ্রুপ */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          {/* হোম পেজে যাওয়ার বাটন */}
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-blue-500/10 transition-all duration-200 active:scale-95 text-sm"
          >
            <FiHome className="text-lg" />
            <span>Go to Home</span>
          </Link>

          {/* আগের পেজে ফিরে যাওয়ার বাটন */}
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 active:scale-95 text-sm"
          >
            <FiArrowLeft className="text-lg" />
            <span>Go Back</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ErrorPage;