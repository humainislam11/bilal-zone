import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // স্ক্রিনশটের ডিজাইন অনুযায়ী স্লাইড ডাটা
  const slides = [
    {
      badge: "SUMMER SALE",
      title: "BILAL ZONE",
      description: "Discover our exclusive summer collection with massive discounts on electronics, gadgets, and lifestyle items.",
      btnText: "SHOP NOW",
      link: "/products",
      bgGradient: "from-orange-50 via-amber-50 to-orange-100",
      blobColor: "bg-orange-300/30",
      accentColor: "text-orange-500",
      image: "https://i.ibb.co.com/q351gQrL/Chat-GPT-Image-Aug-26-2026-10-42-04-AM.png"
    },
    {
      badge: "EXCLUSIVE DEALS",
      title: "TRENDING GADGETS",
      description: "Upgrade your tech game with high-performance smart gadgets and wireless accessories at unbeatable prices.",
      btnText: "EXPLORE NOW",
      link: "/products",
      bgGradient: "from-blue-50 via-sky-50 to-indigo-100",
      blobColor: "bg-blue-300/30",
      accentColor: "text-blue-600",
      image: "https://i.ibb.co.com/PGvwWJxc/Chat-GPT-Image-Aug-26-2026-10-34-42-AM-removebg-preview.png"
    },
    {
      badge: "NEW ARRIVALS",
      title: "SMART LIFESTYLE",
      description: "Explore top-rated products crafted to simplify your daily routine with style and reliability.",
      btnText: "DISCOVER",
      link: "/products",
      bgGradient: "from-teal-50 via-emerald-50 to-teal-100",
      blobColor: "bg-teal-300/30",
      accentColor: "text-teal-600",
      image: "https://i.ibb.co.com/99LhqhxF/Chat-GPT-Image-Aug-26-2026-10-38-23-AM.png"
    }
  ];

  const SLIDE_DURATION = 5000;

  // অটোমেটিক স্লাইড পরিবর্তন (প্রতি ৫ সেকেন্ডে)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [slides.length, currentSlide]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      {/* কাস্টম অ্যানিমেশনসমূহ */}
      <style>{`
        @keyframes float-img {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        .animate-float-img {
          animation: float-img 4s ease-in-out infinite;
        }
        @keyframes blob-move {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -15px) scale(1.1); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
        }
        .animate-blob {
          animation: blob-move 8s ease-in-out infinite;
        }
        @keyframes dot-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-dot-progress {
          animation: dot-progress ${SLIDE_DURATION}ms linear forwards;
        }
      `}</style>

      {/* মেইন ব্যানার ফ্রেম */}
      <div className="relative h-[320px] sm:h-[380px] md:h-[400px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg group bg-white border border-slate-200/70">

        {/* স্লাইডসমূহ (স্মুথ স্লাইড ট্রানজিশন) */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full bg-gradient-to-br ${slide.bgGradient} transition-transform duration-700 ease-in-out flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 md:px-16 py-6 overflow-hidden ${
              index === currentSlide
                ? "translate-x-0 z-10"
                : index < currentSlide
                ? "-translate-x-full z-0"
                : "translate-x-full z-0"
            }`}
          >
            {/* ডেকোরেটিভ ব্লব ব্যাকগ্রাউন্ড */}
            <div className={`absolute -top-16 -right-16 w-56 h-56 sm:w-72 sm:h-72 rounded-full ${slide.blobColor} blur-3xl animate-blob`}></div>
            <div className={`absolute -bottom-20 -left-10 w-48 h-48 sm:w-64 sm:h-64 rounded-full ${slide.blobColor} blur-3xl animate-blob`} style={{ animationDelay: '2s' }}></div>

            {/* বামপাশ: টেক্সট কন্টেন্ট */}
            <div className="flex-1 text-center md:text-left space-y-2 sm:space-y-3 z-10">
              <span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black tracking-widest uppercase ${slide.accentColor} bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-white`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                {slide.badge}
              </span>

              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight ${slide.accentColor} leading-none`}>
                BILAL <span className="text-slate-900">ZONE</span>
              </h1>

              <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-sm hidden sm:block leading-relaxed">
                {slide.description}
              </p>

              <div className="pt-2">
                <Link
                  to={slide.link}
                  className="group/btn inline-flex items-center gap-2 bg-[#112244] hover:bg-blue-900 text-white font-bold text-xs tracking-wider px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
                >
                  {slide.btnText}
                  <FiArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* ডানপাশ: ইমেজ ফ্রেম (float অ্যানিমেশন সহ) */}
            <div className="flex-1 flex justify-center md:justify-end items-center w-full h-full relative z-10">
              <div className="animate-float-img drop-shadow-2xl">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="max-h-[160px] sm:max-h-[220px] md:max-h-[260px] w-auto object-contain"
                />
              </div>
            </div>
          </div>
        ))}

        {/* নেভিগেশন কন্ট্রোল বাটন (বামে ও ডানে) */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 text-slate-700 hover:text-white bg-white/80 hover:bg-slate-900 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
        >
          <FiChevronLeft className="text-lg sm:text-xl font-bold" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 text-slate-700 hover:text-white bg-white/80 hover:bg-slate-900 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
        >
          <FiChevronRight className="text-lg sm:text-xl font-bold" />
        </button>

        {/* ইন্ডিকেটর ডটস (অটো-স্লাইড টাইমিং সহ প্রোগ্রেস বার) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`relative h-1.5 rounded-full overflow-hidden bg-white/50 backdrop-blur-sm transition-all duration-300 cursor-pointer ${
                index === currentSlide ? "w-8 sm:w-10" : "w-1.5 hover:w-3"
              }`}
            >
              {index === currentSlide && (
                <span
                  key={currentSlide}
                  className="absolute inset-0 bg-slate-900 rounded-full animate-dot-progress"
                ></span>
              )}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Banner;