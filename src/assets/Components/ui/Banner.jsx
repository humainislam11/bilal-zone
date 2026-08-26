import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // স্ক্রিনশটের ডিজাইন অনুযায়ী স্লাইড ডাটা
  const slides = [
    {
      badge: "SUMMER SALE",
      title: "BILAL ZONE",
      description: "Discover our exclusive summer collection with massive discounts on electronics, gadgets, and lifestyle items.",
      btnText: "SHOP NOW",
      link: "/products",
      bgGradient: "from-sky-100 via-blue-50 to-sky-200",
      accentColor: "text-blue-900",
      image: "https://i.ibb.co.com/q351gQrL/Chat-GPT-Image-Aug-26-2026-10-42-04-AM.png"
    },
    {
      badge: "EXCLUSIVE DEALS",
      title: "TRENDING GADGETS",
      description: "Upgrade your tech game with high-performance smart gadgets and wireless accessories at unbeatable prices.",
      btnText: "EXPLORE NOW",
      link: "/products",
      bgGradient: "from-blue-50 via-sky-100 to-indigo-100",
      accentColor: "text-blue-600",
      image: "https://i.ibb.co.com/PGvwWJxc/Chat-GPT-Image-Aug-26-2026-10-34-42-AM-removebg-preview.png"
    },
    {
      badge: "NEW ARRIVALS",
      title: "SMART LIFESTYLE",
      description: "Explore top-rated products crafted to simplify your daily routine with style and reliability.",
      btnText: "DISCOVER",
      link: "/products",
      bgGradient: "from-sky-50 via-teal-50 to-blue-100",
      accentColor: "text-teal-600",
      image: "https://i.ibb.co.com/99LhqhxF/Chat-GPT-Image-Aug-26-2026-10-38-23-AM.png"
    }
  ];

  // অটোমেটিক স্লাইড পরিবর্তন (প্রতি ৫ সেকেন্ডে)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      {/* মেইন ব্যানার ফ্রেম (স্ক্রিনশটের মতো অনুপাত) */}
      <div className="relative h-[280px] sm:h-[340px] md:h-[320px] w-full rounded-xl overflow-hidden shadow-sm group bg-white border border-slate-200">
        
        {/* স্লাইডসমূহ */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full bg-gradient-to-r ${slide.bgGradient} transition-opacity duration-1000 ease-in-out flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 md:px-16 py-6 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* বামপাশ: টেক্সট কন্টেন্ট */}
            <div className="flex-1 text-center md:text-left space-y-2 z-10">
              <h3 className="text-sm sm:text-lg md:text-xl font-black tracking-widest uppercase  text-orange-500">
                {slide.badge}
              </h3>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight  text-orange-500 leading-none">
                BILAL <span className="text-slate-900">ZONE</span>
              </h1>
              
              <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-sm hidden sm:block leading-relaxed">
                {slide.description}
              </p>
              
              <div className="pt-2">
                <Link
                  to={slide.link}
                  className="inline-block bg-[#112244] hover:bg-blue-900 text-white font-bold text-xs tracking-wider px-5 py-2.5 rounded-md shadow transition-all duration-200 active:scale-95"
                >
                  {slide.btnText}
                </Link>
              </div>
            </div>

            {/* ডানপাশ: ইমেজ ফ্রেম (স্ক্রিনশটের মতো ফ্রেমে বাঁধানো ব্যানার ইমেজ) */}
            <div className="flex-1 flex justify-center md:justify-end items-center w-full h-full">
              <div className="">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className=""
                />
              </div>
            </div>
          </div>
        ))}

        {/* নেভিগেশন কন্ট্রোল বাটন (বামে ও ডানে) */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-1.5 text-slate-600 hover:text-black bg-white/70 hover:bg-white rounded-full shadow transition-all"
        >
          <FiChevronLeft className="text-xl font-bold" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-1.5 text-slate-600 hover:text-black bg-white/70 hover:bg-white rounded-full shadow transition-all"
        >
          <FiChevronRight className="text-xl font-bold" />
        </button>

        {/* ইন্ডিকেটর ডটস */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex space-x-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-5 bg-blue-600" : "w-1.5 bg-slate-400/60"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Banner;