import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useRef } from 'react';

const FeaturedCategories = () => {
  const scrollRef = useRef(null);

  // আপনার চাওয়া অনুযায়ী Shirt, T-Shirt, Hoodie, Pant, Jacket এবং Custom ক্যাটাগরিগুলো যুক্ত করা হলো
  const categories = [
    { 
      name: "T-Shirt", 
      image: "https://i.ibb.co.com/ymCxbvBM/3e8da0a6-4c8c-4339-9318-7694e70dbe15.png", 
      query: "T-Shirt" 
    },
    { 
      name: "Shirt", 
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=60", 
      query: "Shirt" 
    },
    { 
      name: "Pant", 
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=60", 
      query: "Pant" 
    },
    { 
      name: "Hoodie", 
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=60", 
      query: "Hoodie" 
    },
    { 
      name: "Jacket", 
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60", 
      query: "Jacket" 
    },
    { 
      name: "Custom", 
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&auto=format&fit=crop&q=60", 
      query: "Custom" 
    },
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const offset = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 relative">
      
      {/* সেকশন হেডিং */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Featured Categories
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Explore our exclusive clothing collections tailored just for you
        </p>
      </div>

      {/* স্লাইডার কন্টেইনার এবং নেভিগেশন তীর */}
      <div className="relative group">
        
        {/* বাম পাশের স্ক্রল বাটন */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 p-2.5  text-slate-950 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hidden sm:flex items-center justify-center"
        >
          <FiChevronLeft className="text-lg font-bold" />
        </button>

        {/* ডান পাশের স্ক্রল বাটন */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 p-2.5  text-slate-950 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hidden sm:flex items-center justify-center"
        >
          <FiChevronRight className="text-lg font-bold" />
        </button>

        {/* ক্যাটাগরি কার্ড লিস্ট */}
        <div
          ref={scrollRef}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-2 px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat, index) => (
            <Link
              key={index}
              to={`/products?category=${encodeURIComponent(cat.query)}`}
              className="flex flex-col items-center group flex-shrink-0 cursor-pointer"
            >
              {/* গোল বক্স বা কার্ড */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white border border-slate-200/80 shadow-sm transition-all duration-300 overflow-hidden p-3 flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* ক্যাটাগরির নাম */}
              <span className="mt-3 text-xs sm:text-sm font-bold text-slate-800 transition-colors tracking-wide">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FeaturedCategories;