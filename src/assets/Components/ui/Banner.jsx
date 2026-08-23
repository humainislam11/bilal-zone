import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // SRS রিকোয়ারমেন্ট অনুযায়ী ক্যাটাগরি ও অফার ভিত্তিক স্লাইড ডাটা
  const slides = [
    {
      badge: "Featured Products - 2026",
      title: "Next-Gen Smart Gadgets",
      description: "Explore our curated collection of premium gadgets, smart electronics, and tech accessories with active discounts.",
      btnText: "Explore Gadgets",
      link: "/products",
      bgGradient: "from-slate-950 via-blue-950 to-slate-950",
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&auto=format&fit=crop"
    },
    {
      badge: "New Arrivals",
      title: "Trendy Fashion & Lifestyle",
      description: "Upgrade your wardrobe with Billal Zone's exclusive new arrivals. High-quality materials tailored for you.",
      btnText: "Shop Fashion",
      link: "/products",
      bgGradient: "from-neutral-950 via-purple-950 to-neutral-950",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop"
    },
    {
      badge: "Exclusive Deal",
      title: "Unmatched Audio Zone",
      description: "Get active noise-canceling headphones and wireless earbuds at unbeatable prices. Free delivery included!",
      btnText: "Grab Offer",
      link: "/products",
      bgGradient: "from-blue-950 via-slate-950 to-indigo-950",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop"
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
      {/* মেইন ব্যানার ফ্রেম */}
      <div className="relative h-[460px] sm:h-[480px] md:h-[420px] w-full rounded-2xl overflow-hidden shadow-2xl group">
        
        {/* স্লাইডসমূহ */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full bg-gradient-to-r ${slide.bgGradient} transition-opacity duration-1000 ease-in-out flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 md:px-20 py-8 gap-6 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* বামপাশ: টেক্সট কন্টেন্ট */}
            <div className="flex-1 text-center md:text-left text-white space-y-4 md:space-y-5 max-w-xl">
              <span className="inline-block bg-white/10 backdrop-blur-md text-blue-400 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border border-white/20">
                {slide.badge}
              </span>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                {slide.title}
              </h1>
              
              <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed">
                {slide.description}
              </p>
              
              <div className="pt-2">
                <Link
                  to={slide.link}
                  className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-200 active:scale-95"
                >
                  {slide.btnText}
                </Link>
              </div>
            </div>

            {/* ডানপাশ: ইমেজ ফ্রেম */}
            <div className="flex-1 flex justify-center items-center w-full max-w-[260px] sm:max-w-[300px] md:max-w-none">
              <div className="relative p-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-[160px] sm:h-[200px] md:h-[260px] object-cover rounded-xl shadow-md"
                />
              </div>
            </div>
          </div>
        ))}

        {/* নেভিগেশন কন্ট্রোল বাটন (বামে ও ডানে) */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <FiChevronLeft className="text-2xl" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <FiChevronRight className="text-2xl" />
        </button>

        {/* ইন্ডিকেটর ডটস */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-7 bg-blue-500" : "w-2.5 bg-white/40"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Banner;