import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // স্লাইডার ইমেজ (বামপাশে ঘুরবে) — সবগুলোর background black
  const slides = [
    {
      src: "https://i.ibb.co.com/BH7xGmts/Gemini-Generated-Image-ejj9wpejj9wpejj9.jpg",
      bg: "bg-black",
    },
    {
      src: "https://i.ibb.co.com/0pT8fcHM/Gemini-Generated-Image-tv3xv5tv3xv5tv3x.jpg",
      bg: "bg-black",
    },
  ];

  // ডানপাশের স্ট্যাটিক ব্যানার (মোবাইলে দেখা যাবে না)
  const sideBanner = "https://i.ibb.co.com/qFkWkRsH/Gemini-Generated-Image-mmu4oummu4oummu4.jpg";

  const SLIDE_DURATION = 4000;

  // অটোমেটিক স্লাইড পরিবর্তন
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, SLIDE_DURATION);
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
      <style>{`
        @keyframes dot-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-dot-progress {
          animation: dot-progress ${SLIDE_DURATION}ms linear forwards;
        }
      `}</style>

      <div className="flex flex-col md:flex-row gap-3 sm:gap-4">

        {/* বামপাশ: ইমেজ স্লাইডার */}
        <div className="relative md:flex-[2] h-[220px] sm:h-[320px] md:h-[380px] w-full rounded-2xl overflow-hidden shadow-lg group bg-slate-100 border border-slate-200/70">

          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full ${slide.bg} transition-transform duration-700 ease-in-out ${
                index === currentSlide
                  ? "translate-x-0 z-10"
                  : index < currentSlide
                  ? "-translate-x-full z-0"
                  : "translate-x-full z-0"
              }`}
            >
              <img
                src={slide.src}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}

          {/* নেভিগেশন বাটন */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 text-slate-700 hover:text-white bg-white/80 hover:bg-slate-900 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <FiChevronLeft className="text-lg sm:text-xl font-bold" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 text-slate-700 hover:text-white bg-white/80 hover:bg-slate-900 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <FiChevronRight className="text-lg sm:text-xl font-bold" />
          </button>

          {/* ইন্ডিকেটর ডটস */}
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

        {/* ডানপাশ: স্ট্যাটিক ব্যানার — মোবাইলে hidden */}
        <div className="hidden md:block flex-1 h-[380px] rounded-2xl overflow-hidden shadow-lg border border-slate-200/70 bg-black">
          <img
            src={sideBanner}
            alt="Side Banner"
            className="w-full h-full object-contain"
          />
        </div>

      </div>
    </div>
  );
};

export default Banner;