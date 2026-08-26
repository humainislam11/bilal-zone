import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const BannerGrid = () => {
  // 🌟 আপনার ৪টি ক্যাটাগরির ব্যানার ডাটা ও ছবি
  const banners = [
    {
      id: 1,
      title: "BEAUTY COSMETIC",
      subtitle: "ENHANCE YOUR BEAUTY",
      description: "Discover a wide range of premium cosmetics for glowing skin, flawless looks and everyday care.",
      categoryQuery: "Cosmetics",
      bgGradient: "from-pink-500/90 to-rose-600/90",
      badgeColor: "bg-pink-100 text-pink-700",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      title: "FASHION DESIGN",
      subtitle: "NEW COLLECTION",
      description: "Exclusive fashion designs crafted for comfort, confidence and a unique you.",
      categoryQuery: "Clothing",
      bgGradient: "from-stone-800/90 to-neutral-900/90",
      badgeColor: "bg-amber-100 text-amber-800",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      title: "DINING CROCKERY",
      subtitle: "ELEVATE YOUR TABLE",
      description: "Premium quality crockery and dinner sets for a perfect blend of elegance and durability.",
      categoryQuery: "Crockery",
      bgGradient: "from-emerald-700/90 to-teal-900/90",
      badgeColor: "bg-emerald-100 text-emerald-800",
      // ডাইনিং টেবিল ও ক্রকারিজের একদম পারফেক্ট ছবি এখানে আপডেট করা হলো
      image: "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 4,
      title: "TOYS & GIFTS",
      subtitle: "MAKE EVERY MOMENT SPECIAL",
      description: "Explore our wide collection of fun toys and thoughtful gifts for your loved ones.",
      categoryQuery: "Toys",
      bgGradient: "from-blue-600/90 to-indigo-800/90",
      badgeColor: "bg-blue-100 text-blue-800",
      image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=60"
    }
  ];

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <span className="text-xs font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
          Featured Collections
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">Shop By Categories</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Explore our exclusive product ranges tailored just for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div 
            key={banner.id}
            className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-gray-900 min-h-[280px] sm:min-h-[320px] flex flex-col justify-end p-6 sm:p-8"
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
                  className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-orange-500 hover:text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  <span>Shop Now</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BannerGrid;