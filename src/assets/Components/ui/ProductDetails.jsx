import { useLoaderData, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart, FiHeart, FiShare2, FiTruck, FiRotateCcw, FiShield, FiStar, FiCopy, FiCheck, FiFlag } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin } from 'react-icons/fa';
import { useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../context/AuthContext';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const ProductDetails = () => {
  const product = useLoaderData();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [activeImage, setActiveImage] = useState(product?.images?.[0] || product?.image);
  const [quantity, setQuantity] = useState(1);
  
  // কালার এবং সাইজ ইনিশিয়ালাইজেশন
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || 'Default');
  const [selectedSize, setSelectedSize] = useState(
    product?.size ? product.size.split(',')[0].trim() : 'M'
  );

  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const currentUrl = window.location.href;

  // ডিসকাউন্ট প্রাইস এবং পার্সেন্টেজ ক্যালকুলেশন
  const displayPrice = product?.discountPrice || product?.price;
  const hasDiscount = product?.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  useEffect(() => {
    if (product?._id) {
      axiosSecure.get(`/reviews/${product._id}`)
        .then(res => setReviews(res.data))
        .catch(err => console.error("Error fetching reviews:", err));
    }
  }, [product?._id, axiosSecure]);

  // উইশলিস্টে অলরেডি আছে কিনা চেক করার জন্য
  useEffect(() => {
    if (user?.email && product?._id) {
      axiosSecure.get(`/wishlist/check?email=${user.email}&productId=${product._id}`)
        .then(res => {
          if (res.data?.exists) {
            setIsWishlisted(true);
          }
        })
        .catch(err => console.error("Error checking wishlist:", err));
    }
  }, [user?.email, product?._id, axiosSecure]);

  const handleQuantityChange = (type) => {
    if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (type === 'increase' && quantity < (product?.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const handleColorSelect = (color, index) => {
    setSelectedColor(color);
    if (product?.images && product.images[index]) {
      setActiveImage(product.images[index]);
    }
  };

  // উইশলিস্টে অ্যাড করার ফাংশন
  const handleAddToWishlist = async () => {
    if (!user?.email) {
      return Swal.fire({ icon: 'error', title: 'Please login first!' });
    }

    setWishlistLoading(true);
    const wishlistItem = {
      productId: product._id,
      name: product.name,
      price: displayPrice,
      email: user.email,
      image: activeImage || product.images?.[0] || product.image,
      category: product.category,
      description: product.description
    };

    try {
      const res = await axiosSecure.post('/wishlist', wishlistItem);
      if (res.data.message === 'already exists' || res.data.insertedId === undefined) {
        Swal.fire({ icon: 'info', title: 'Already in your Wishlist!', timer: 1500, showConfirmButton: false });
        setIsWishlisted(true);
      } else if (res.data.insertedId) {
        Swal.fire({ icon: 'success', title: 'Added to Wishlist!', timer: 1500, showConfirmButton: false });
        setIsWishlisted(true);
        window.dispatchEvent(new Event('wishlistUpdated'));
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      Swal.fire({ icon: 'error', title: 'Failed to add to wishlist' });
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user?.email) {
      return Swal.fire({ icon: 'error', title: 'Please login first!' });
    }

    setLoading(true);
    const cartItem = {
      productId: product._id,
      name: product.name,
      price: displayPrice,
      email: user.email,
      image: activeImage || product.images?.[0] || product.image,
      quantity: quantity,
      color: selectedColor,
      size: selectedSize,
      description: product.description,
      category: product.category
    };

    try {
      const res = await axiosSecure.post('/cart', cartItem);
      if (res.data.message === 'already exists') {
        Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Already in your cart!' });
      } else if (res.data.insertedId || res.data.modifiedCount > 0 || res.data.success) {
        Swal.fire({ icon: 'success', title: 'Added to Cart!', timer: 1500, showConfirmButton: false });
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({ icon: 'error', title: 'Failed to add to cart' });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!user?.email) {
      return Swal.fire({ icon: 'error', title: 'Please login first!' });
    }

    const singleProductItem = {
      productId: product._id,
      name: product.name,
      price: displayPrice,
      image: activeImage || product.images?.[0] || product.image,
      quantity: quantity,
      color: selectedColor,
      size: selectedSize,
      description: product.description,
      category: product.category
    };

    navigate('/checkout', {
      state: {
        totalAmount: displayPrice * quantity,
        cartItems: [singleProductItem]
      }
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) {
      return Swal.fire({ icon: 'error', title: 'Please login to give a review!' });
    }
    if (!userComment.trim()) {
      return Swal.fire({ icon: 'warning', title: 'Please write something in your review.' });
    }

    setReviewLoading(true);
    const newReview = {
      productId: product._id,
      userName: user?.displayName || 'Anonymous User',
      userEmail: user?.email,
      userPhoto: user?.photoURL || 'https://i.ibb.co/2M7StZP/default-avatar.png',
      rating: userRating,
      comment: userComment,
      isReported: false,
      date: new Date()
    };

    try {
      const res = await axiosSecure.post('/reviews', newReview);
      if (res.data.insertedId) {
        Swal.fire({ icon: 'success', title: 'Review added successfully!', timer: 1500, showConfirmButton: false });
        setReviews([{ ...newReview, _id: res.data.insertedId }, ...reviews]);
        setUserComment('');
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleReportReview = async (reviewId) => {
    if (!user?.email) {
      return Swal.fire({ icon: 'error', title: 'Please login to report a comment!' });
    }

    Swal.fire({
      title: "Report this comment?",
      text: "Are you sure you want to report this comment to the admin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, report it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/reviews/report/${reviewId}`);
          if (res.data.modifiedCount > 0 || res.data.success) {
            Swal.fire("Reported!", "The comment has been reported to the admin.", "success");
            setReviews(reviews.map(rev => rev._id === reviewId ? { ...rev, isReported: true } : rev));
          } else {
            Swal.fire("Notice", "This comment is already reported or action already taken.", "info");
          }
        } catch (error) {
          console.error("Error reporting review:", error);
          Swal.fire("Error!", "Failed to report the comment.", "error");
        }
      }
    });
  };

  if (!product) return <div className="text-center mt-20 text-xl font-bold">Product not found!</div>;

  const productImages = product.images?.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-bold text-gray-600 hover:text-orange-600 transition-colors cursor-pointer">
          <FiArrowLeft /> Back
        </button>

        {/* Main Details Card */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10 relative">
          
          {/* Image Gallery */}
          <div className="space-y-4 lg:col-span-1">
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
              <img src={activeImage || productImages[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((imgUrl, index) => (
                  <div 
                    key={index}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                      activeImage === imgUrl ? 'border-orange-500 scale-95 shadow-md' : 'border-transparent hover:opacity-80'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Options */}
          <div className="space-y-6 flex flex-col justify-between lg:col-span-1">
            <div className="space-y-4 relative">
              <div className="flex justify-between items-center">
                <span className="text-orange-600 font-bold uppercase tracking-wider text-xs bg-orange-50 px-3 py-1 rounded-lg inline-block">
                  {product.category}
                </span>
                
                {/* Share & Wishlist */}
                <div className="flex gap-4 text-gray-500 relative text-lg items-center">
                  <button onClick={() => setShowShareModal(!showShareModal)} className="cursor-pointer hover:text-orange-600">
                    <FiShare2 />
                  </button>
                  
                  {/* Wishlist Button with Active State */}
                  <button 
                    disabled={wishlistLoading} 
                    onClick={handleAddToWishlist} 
                    className={`cursor-pointer transition-colors ${isWishlisted ? 'text-red-500' : 'hover:text-red-500'}`}
                    title="Add to Wishlist"
                  >
                    <FiHeart className={isWishlisted ? 'fill-red-500' : ''} />
                  </button>

                  {showShareModal && (
                    <div className="absolute right-0 top-8 bg-white border shadow-xl rounded-2xl p-4 w-64 z-20 space-y-3">
                      <p className="text-xs font-bold text-gray-700 uppercase">Share this product</p>
                      <div className="flex justify-around text-xl">
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:scale-110 transition-transform">
                          <FaFacebook />
                        </a>
                        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:scale-110 transition-transform">
                          <FaTwitter />
                        </a>
                        <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(product.name + ' ' + currentUrl)}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:scale-110 transition-transform">
                          <FaWhatsapp />
                        </a>
                        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:scale-110 transition-transform">
                          <FaLinkedin />
                        </a>
                      </div>
                      <div className="flex items-center gap-2 border rounded-xl px-2 py-1 bg-gray-50">
                        <input type="text" readOnly value={currentUrl} className="text-xs bg-transparent w-full outline-none text-gray-500" />
                        <button onClick={handleCopyLink} className="text-orange-600 hover:text-orange-700 cursor-pointer text-sm">
                          {copied ? <FiCheck /> : <FiCopy />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-snug">{product.name}</h1>
              
              {/* Price Section with Discount Percentage */}
              <div className="flex items-center gap-4 flex-wrap">
                <p className="text-3xl font-black text-orange-600">৳{displayPrice}</p>
                {hasDiscount && (
                  <>
                    <p className="text-lg font-bold text-gray-400 line-through">৳{product.price}</p>
                    <span className="bg-red-100 text-red-600 text-xs font-extrabold px-2.5 py-1 rounded-lg">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Colors Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Available Colors: <span className="text-orange-600 font-extrabold">{selectedColor}</span></label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleColorSelect(color, idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedColor === color ? 'bg-orange-600 text-white border-orange-600 shadow-sm' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Selection */}
            {product.size && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Select Size: <span className="text-orange-600 font-extrabold">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.size.split(',').map((sizeStr, idx) => {
                    const cleanSize = sizeStr.trim();
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedSize(cleanSize)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          selectedSize === cleanSize 
                            ? 'bg-orange-600 text-white border-orange-600 shadow-sm' 
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {cleanSize}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                  <button onClick={() => handleQuantityChange('decrease')} className="px-3.5 py-2 font-bold text-gray-600 hover:bg-gray-200 cursor-pointer">-</button>
                  <span className="px-5 font-bold text-gray-800">{quantity}</span>
                  <button onClick={() => handleQuantityChange('increase')} className="px-3.5 py-2 font-bold text-gray-600 hover:bg-gray-200 cursor-pointer">+</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  disabled={product.stock === 0 || loading} 
                  onClick={handleAddToCart}
                  className="py-3.5 px-3 rounded-xl font-bold bg-orange-100 text-orange-600 hover:bg-orange-200 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <FiShoppingCart /> Add to Cart
                </button>
                <button 
                  disabled={product.stock === 0 || loading} 
                  onClick={handleBuyNow}
                  className="py-3.5 px-3 rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-white transition-all text-sm shadow-md cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Delivery & Warranty Card */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6 lg:col-span-1 h-fit text-sm">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold mb-2">Delivery Options</p>
              <div className="flex items-start gap-3 text-gray-700 pt-1">
                <FiTruck className="text-xl text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Standard Delivery</p>
                  <p className="text-xs text-gray-500">Get by 3-5 days</p>
                </div>
                <span className="ml-auto font-bold text-gray-900">৳120</span>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <p className="text-xs text-gray-400 uppercase font-bold mb-2">Return & Warranty</p>
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3 text-gray-700">
                  <FiRotateCcw className="text-base text-orange-600 shrink-0" />
                  <span className="text-xs font-medium">7 Days Easy Return</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FiShield className="text-base text-orange-600 shrink-0" />
                  <span className="text-xs font-medium">Warranty Not Available</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Full Description Section */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-black text-gray-900 border-b pb-3">Product Description</h2>
          <div className="text-gray-600 leading-relaxed text-base whitespace-pre-line">
            {product.description || "No description available for this product."}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 md:p-8 space-y-8">
          <h2 className="text-xl font-black text-gray-900">Customer Reviews ({reviews.length})</h2>

          <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
            <p className="font-bold text-sm text-gray-700">Leave a Review</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    onClick={() => setUserRating(star)}
                    className={`cursor-pointer text-lg ${star <= userRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
            <textarea
              rows="3"
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              placeholder="Write your opinion about this product..."
              className="w-full border text-gray-700 rounded-xl p-3 text-sm bg-white outline-none focus:border-orange-500"
            ></textarea>
            <button
              disabled={reviewLoading}
              type="submit"
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Submit Review
            </button>
          </form>

          <div className="space-y-4 divide-y divide-gray-100">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No reviews yet. Be the first one to review!</p>
            ) : (
              reviews.map((rev, index) => (
                <div key={rev._id || index} className="pt-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img src={rev.userPhoto} alt={rev.userName} className="w-10 h-10 rounded-full object-cover border" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-sm text-gray-800">{rev.userName}</p>
                        <div className="flex text-yellow-500 text-xs">
                          {[...Array(rev.rating)].map((_, i) => (
                            <FiStar key={i} className="fill-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">{new Date(rev.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600 pt-1">{rev.comment}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleReportReview(rev._id)}
                    className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${
                      rev.isReported 
                        ? 'bg-red-50 text-red-600 border-red-200 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    <FiFlag className="text-sm" />
                    {rev.isReported ? 'Reported' : 'Report'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;