import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const BannerGrid = () => {
  // 🌟 আপনার দেওয়া ক্যাটাগরি অনুযায়ী ব্যানার ডাটা ও ছবি
  const banners = [
    {
      id: 1,
      title: "T-SHIRT",
      subtitle: "EVERYDAY ESSENTIAL",
      description: "Soft, breathable and stylish t-shirts for a relaxed, effortless everyday look.",
      categoryQuery: "T-Shirt",
      bgGradient: "from-orange-600/90 to-red-700/90",
      badgeColor: "bg-orange-100 text-orange-700",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      title: "SHIRT",
      subtitle: "SHARP & CLASSY",
      description: "Premium formal and casual shirts crafted for confidence, comfort and a sharp look.",
      categoryQuery: "Shirt",
      bgGradient: "from-slate-700/90 to-slate-900/90",
      badgeColor: "bg-slate-100 text-slate-800",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      title: "PANT",
      subtitle: "PERFECT FIT",
      description: "Durable, comfortable pants designed for the perfect fit in every step you take.",
      categoryQuery: "Pant",
      bgGradient: "from-stone-800/90 to-neutral-900/90",
      badgeColor: "bg-amber-100 text-amber-800",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 4,
      title: "JACKET",
      subtitle: "STAY BOLD & WARM",
      description: "Trendy jackets built for style and warmth, perfect for every season and occasion.",
      categoryQuery: "Jacket",
      bgGradient: "from-indigo-700/90 to-blue-900/90",
      badgeColor: "bg-blue-100 text-blue-800",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 5,
      title: "HOODIE",
      subtitle: "COZY & COMFORTABLE",
      description: "Ultra-comfortable hoodies that keep you cozy while looking effortlessly cool.",
      categoryQuery: "Hoodie",
      bgGradient: "from-emerald-700/90 to-teal-900/90",
      badgeColor: "bg-emerald-100 text-emerald-800",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=60"
    }
  ];

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">Shop By Categories</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Versatile everyday apparel crafted for ultimate comfort, modern style, and a sharp look from head to toe.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {banners.map((banner, index) => {
          const isLastOddCard = banners.length % 2 !== 0 && index === banners.length - 1;

          return (
            <div 
              key={banner.id}
              className={`group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-gray-900 min-h-[280px] sm:min-h-[320px] flex flex-col justify-end p-6 sm:p-8 ${
                isLastOddCard ? 'sm:col-span-2' : ''
              }`}
            >
              {/* ব্যাকগ্রাউন্ড ইমেজ ও ওভারলে */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-75"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${banner.bgGradient} opacity-85 mix-blend-multiply`}></div>
                <div className="absolute inset-0 bg-black/20"></div>
              </div>

              {/* কন্টেন্ট */}
              <div className="relative z-10 space-y-2 sm:space-y-3">
                <span className={`inline-block text-[10px] sm:text-xs font-black uppercase px-3 py-1 rounded-full ${banner.badgeColor} shadow-sm`}>
                  {banner.subtitle}
                </span>
                
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  {banner.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-gray-100 font-medium line-clamp-2 max-w-md">
                  {banner.description}
                </p>

                <div className="pt-2">
                  <Link 
                    to={`/products?category=${encodeURIComponent(banner.categoryQuery)}`}
                    className="relative inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-orange-500 hover:text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 shadow-lg active:scale-95 cursor-pointer group/btn"
                  >
                    {/* 🌟 বাটনের চারপাশে পালসিং রিং — বোঝাবে এটা ক্লিকযোগ্য */}
                    <span className="absolute inset-0 rounded-xl bg-white animate-ping opacity-20 group-hover/btn:opacity-0"></span>

                    <span className="relative">Shop Now</span>
                    <FiArrowRight className="relative transform transition-transform duration-300 animate-bounce-x group-hover/btn:translate-x-1.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BannerGrid;