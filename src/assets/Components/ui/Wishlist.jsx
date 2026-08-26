import  { useEffect, useState, useContext } from 'react';
import { FiTrash2, FiShoppingCart, FiArrowLeft, FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../context/AuthContext';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null); // কোন আইটেমে কাজ চলছে তা ট্র্যাক করার জন্য
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchWishlist = () => {
      if (user?.email) {
        axiosPublic.get(`/wishlist?email=${user.email}`)
          .then(res => {
            if (isMounted) {
              setWishlistItems(res.data);
              setLoading(false);
            }
          })
          .catch(err => {
            console.error("Error fetching wishlist:", err);
            if (isMounted) setLoading(false);
          });
      } else {
        setLoading(false);
      }
    };

    fetchWishlist();

    window.addEventListener('wishlistUpdated', fetchWishlist);
    return () => {
      isMounted = false;
      window.removeEventListener('wishlistUpdated', fetchWishlist);
    };
  }, [user?.email, axiosPublic]);

  // উইশলিস্ট থেকে আইটেম ডিলিট করার ফাংশন (লোডিং সহ)
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this item from your wishlist!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setActionLoadingId(id); // লোডিং শুরু
          const res = await axiosPublic.delete(`/wishlist/${id}`);
          if (res.data.deletedCount > 0) {
            Swal.fire({ icon: 'success', title: 'Removed from Wishlist', timer: 1200, showConfirmButton: false });
            setWishlistItems(wishlistItems.filter(item => item._id !== id));
            window.dispatchEvent(new Event('wishlistUpdated')); // ন্যাভবার অটো আপডেট করার জন্য
          }
        } catch (error) {
          console.error("Error deleting wishlist item:", error);
          Swal.fire({ icon: 'error', title: 'Failed to delete' });
        } finally {
          setActionLoadingId(null); // লোডিং শেষ
        }
      }
    });
  };

  // উইশলিস্ট থেকে সরাসরি কার্টে অ্যাড করার ফাংশন (লোডিং সহ)
  const handleAddToCart = async (item, e) => {
    e.stopPropagation();
    if (!user?.email) {
      return Swal.fire({ icon: 'error', title: 'Please login first!' });
    }

    const cartItem = {
      productId: item.productId,
      name: item.name,
      price: item.price,
      email: user.email,
      image: item.image,
      quantity: 1,
      color: item.color || 'Default',
      size: item.size || 'M',
      description: item.description,
      category: item.category
    };

    try {
      setActionLoadingId(item._id + 'cart');
      const res = await axiosPublic.post('/cart', cartItem);
      if (res.data.message === 'already exists') {
        Swal.fire({ icon: 'warning', title: 'Already in your cart!' });
      } else if (res.data.insertedId || res.data.success) {
        Swal.fire({ icon: 'success', title: 'Added to Cart!', timer: 1500, showConfirmButton: false });
        window.dispatchEvent(new Event('cartUpdated')); // কার্ট কাউন্ট অটো আপডেট করার জন্য
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({ icon: 'error', title: 'Failed to add to cart' });
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-gray-500 text-sm">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-bold text-gray-600 hover:text-orange-600 transition-colors cursor-pointer">
            <FiArrowLeft /> Back
          </button>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <FiHeart className="text-red-500 fill-red-500" /> My Wishlist ({wishlistItems.length})
          </h1>
        </div>

        {/* Wishlist Grid */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-gray-100 shadow-sm">
            <FiHeart className="mx-auto text-5xl text-gray-300" />
            <p className="text-lg font-bold text-gray-600">Your wishlist is empty!</p>
            <button 
              onClick={() => navigate('/products')} 
              className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl text-sm shadow-md hover:bg-orange-600 cursor-pointer"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div 
                key={item._id} 
                onClick={() => navigate(`/product/${item.productId}`)}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between group cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <button 
                    onClick={(e) => handleDelete(item._id, e)}
                    disabled={actionLoadingId === item._id}
                    className="absolute top-3 right-3 p-2.5 bg-white/80 backdrop-blur-md rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md cursor-pointer flex items-center justify-center"
                    title="Remove from Wishlist"
                  >
                    {actionLoadingId === item._id ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiTrash2 className="text-sm" />
                    )}
                  </button>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <h2 className="font-bold text-gray-800 text-base line-clamp-1">{item.name}</h2>
                    <p className="text-orange-600 font-extrabold text-lg">৳{item.price}</p>
                  </div>

                  <button 
                    onClick={(e) => handleAddToCart(item, e)}
                    disabled={actionLoadingId === item._id + 'cart'}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {actionLoadingId === item._id + 'cart' ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <FiShoppingCart /> Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;