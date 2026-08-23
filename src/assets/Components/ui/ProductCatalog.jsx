import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiEye, FiChevronDown, FiGrid } from 'react-icons/fi';
import useAxiosPublic from '../../hooks/useAxiosPublic'; 

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockFilter, setStockFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const axiosPublic = useAxiosPublic();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosPublic.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [axiosPublic]);

  // ডাইনামিক ইউনিক ক্যাটাগরি তৈরি
  const dynamicCategories = ["All", ...new Set(products.map(product => product.category))];
  const stockStatuses = ["All", "In Stock", "Out of Stock"];

  // ফিল্টারিং লজিক
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
    let matchesStock = true;
    if (stockFilter === "In Stock") matchesStock = product.stock > 0;
    else if (stockFilter === "Out of Stock") matchesStock = product.stock === 0;
    return matchesSearch && matchesCategory && matchesStock;
  });

  // 🌟 ভিন্ন ভিন্ন ক্যাটাগরির একটি করে প্রোডাক্ট প্রথমে নিয়ে আসার সর্টিং লজিক (যখন ক্যাটাগরি "All" থাকে)
  const getSortedProducts = () => {
    if (categoryFilter !== "All") return filteredProducts;

    const map = new Map();
    const others = [];

    filteredProducts.forEach(product => {
      if (!map.has(product.category)) {
        map.set(product.category, product); // প্রতিটি ক্যাটাগরি থেকে প্রথম প্রোডাক্টটি রাখব
      } else {
        others.push(product); // বাকিগুলো আলাদা রাখব
      }
    });

    return [...map.values(), ...others];
  };

  const displayedProducts = getSortedProducts();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-gray-500 animate-pulse">Loading amazing products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* হেডার */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">Our Shop</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Explore top-quality products at Billal Zone</p>
          
          {searchQuery && (
            <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-blue-100">
              Results for: <span className="underline">"{searchQuery}"</span>
            </div>
          )}
        </div>

        {/* 🌟 ডাইনামিক ক্যাটাগরি ট্যাব বাটনগুলো (Clickable Pills) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all shadow-sm cursor-pointer ${
                categoryFilter === cat
                  ? "bg-blue-600 text-white shadow-blue-200 shadow-md scale-105"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {cat === "All" ? "🔥 All Categories" : cat}
            </button>
          ))}
        </div>

        {/* 🎛️ স্টক ফিল্টার বার */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3.5 sm:p-4 mb-6 sm:mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 text-gray-400 font-bold text-[11px] sm:text-xs uppercase tracking-wider">
            <FiGrid className="text-sm" /> Availability Filter:
          </div>

          <div className="flex items-center gap-3 justify-between sm:justify-end">
            {/* 🔽 স্টক ফিল্টার ড্রপডাউন */}
            <div className="relative flex-1 sm:min-w-[180px]">
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="w-full bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold px-3.5 py-2 sm:px-4 sm:py-2.5 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                {stockStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "All" ? "All Availability" : status}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-3 sm:top-3.5 text-gray-400 pointer-events-none text-base" />
            </div>

            {/* 🔄 ক্লিয়ার ফিল্টার বাটন */}
            {(categoryFilter !== "All" || stockFilter !== "All") && (
              <button
                onClick={() => { setCategoryFilter("All"); setStockFilter("All"); }}
                className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors whitespace-nowrap cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* 📦 প্রোডাক্ট গ্রিড লেআউট (মোবাইলে ২ কলাম: grid-cols-2) */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayedProducts.map((product) => {
              const displayPrice = product.discountPrice || product.price;
              const hasDiscount = product.discountPrice && product.discountPrice < product.price;
              const discountPercentage = hasDiscount 
                ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
                : 0;

              return (
                <Link 
                  to={`/products/${product._id}`} 
                  key={product._id} 
                  className="group bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative cursor-pointer"
                >
                  <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                    <img 
                      src={product.images?.[0] || product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-white/90 p-2 sm:p-3 rounded-full shadow-lg text-blue-600 transform translate-y-2 group-hover:translate-y-0 transition-transform font-bold flex items-center gap-1 text-[11px] sm:text-xs">
                        <FiEye className="text-sm sm:text-lg" /> Details
                      </div>
                    </div>

                    <span className={`absolute top-2 right-2 sm:top-3 sm:right-3 text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg shadow-sm flex items-center gap-1 z-10 ${
                      product.stock > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }`}>
                      {product.stock > 0 ? <FiCheckCircle size={10} /> : <FiXCircle size={10} />}
                      <span className="hidden xs:inline">{product.stock > 0 ? "In Stock" : "Out Of Stock"}</span>
                    </span>

                    {hasDiscount && (
                      <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg shadow-sm z-10">
                        {discountPercentage}% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-4">
                    <div className="space-y-0.5 sm:space-y-1">
                      <span className="text-[9px] sm:text-[10px] font-bold text-blue-600 uppercase tracking-widest">{product.category}</span>
                      <h3 className="font-bold text-gray-800 text-xs sm:text-base leading-snug truncate group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-1 sm:pt-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium">Price</span>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-sm sm:text-lg font-black text-gray-900">৳{displayPrice}</span>
                          {hasDiscount && (
                            <span className="text-[11px] sm:text-xs font-bold text-gray-400 line-through">৳{product.price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 font-bold text-base sm:text-lg">No products match your filters!</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductCatalog;