import { useEffect, useState } from 'react';
import { FiStar, FiUser, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import useAxiosPublic from '../../hooks/useAxiosPublic';

// Swiper কম্পোনেন্ট ও মডিউল ইমপোর্ট
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Swiper-এর মূল এবং প্রয়োজনীয় CSS ফাইলগুলো ইমপোর্ট
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosPublic.get('/reviews');
        setReviews(res.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [axiosPublic]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-[#FAF8F5]">
        <div className="w-8 h-8 border-[3px] border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return null; // কোনো রিভিউ না থাকলে সেকশনটি দেখাবে না
  }

  return (
    <section className="py-24 px-4 bg-[#FAF8F5] text-gray-900 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* স্লাইডার কন্টেইনার এবং কাস্টম অ্যারো বাটন */}
        <div className="relative px-0 sm:px-16">
          {/* কাস্টম প্রিভিয়াস বাটন */}
          <button className="custom-prev absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all cursor-pointer hidden sm:flex">
            <FiChevronLeft size={22} />
          </button>

          {/* কাস্টম নেক্সট বাটন */}
          <button className="custom-next absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all cursor-pointer hidden sm:flex">
            <FiChevronRight size={22} />
          </button>

          {/* Swiper স্লাইডার সেকশন */}
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            loop={reviews.length > 1}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={{
              nextEl: '.custom-next',
              prevEl: '.custom-prev',
            }}
            className="pb-16 custom-swiper-pagination text-center"
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={review._id || index} className="h-auto py-4">
                <div className="flex flex-col items-center max-w-2xl mx-auto px-4">
                  
                  {/* সাব-হেডিং / টপ লেবেল */}
                  <span className="text-xs uppercase tracking-[0.25em] text-amber-600 font-semibold mb-3">
                    --- What Our Customers Say ---
                  </span>

                  {/* মেইন হেডার: TESTIMONIALS */}
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-widest text-gray-900 mb-6 uppercase border-b-2 border-gray-200/60 pb-3 w-full max-w-xs mx-auto">
                    Testimonials
                  </h2>

                  {/* ইউজারের গোল ফটো */}
                  <div className="w-20 h-20 rounded-full p-1 bg-white shadow-md border border-gray-200 mb-5 overflow-hidden">
                    {review.userPhoto || review.customerImage || review.userImage ? (
                      <img 
                        src={review.userPhoto || review.customerImage || review.userImage} 
                        alt="" 
                        className="w-full h-full object-cover rounded-full" 
                      />
                    ) : (
                      <div className="w-full h-full bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                        <FiUser size={30} />
                      </div>
                    )}
                  </div>

                  {/* স্টার রেটিং */}
                  <div className="flex items-center gap-1.5 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        size={18} 
                        className={i < (review.rating || 5) ? "fill-amber-500 text-amber-500" : "text-gray-300"} 
                      />
                    ))}
                  </div>

                  {/* বড় কোটেশন আইকন */}
                  <div className="text-amber-700/80 mb-4">
                    <svg width="36" height="30" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.998v10h-9.998z" />
                    </svg>
                  </div>

                  {/* রিভিউ টেক্সট / কমেন্ট */}
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-normal mb-8 max-w-xl">
                    {review.comment || review.review || review.text || "Various version have evolved over the years, sometimes by accident, sometimes on purpose."}
                  </p>

                  {/* ইউজারের নাম */}
                  <h4 className="text-amber-600 mb-4 font-bold text-sm sm:text-base tracking-[0.2em] uppercase">
                    {review.userName || review.customerName || "JANE DOE"}
                  </h4>
                 

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* স্লাইডারের ডট বা পেজিনেশনের কাস্টম স্টাইল */}
      <style>{`
        .custom-swiper-pagination .swiper-pagination-bullet {
          background-color: #d1d5db !important;
          opacity: 1;
        }
        .custom-swiper-pagination .swiper-pagination-bullet-active {
          background-color: #d97706 !important;
          opacity: 1;
          width: 22px;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
      `}</style>
    </section>
  );
};

export default CustomerReviews;