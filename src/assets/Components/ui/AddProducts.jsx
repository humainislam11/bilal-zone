import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { FiUploadCloud, FiStar } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';

// 🌟 ক্লাউডিনারি কনফিগারেশন
const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const cloudinary_upload_preset = "bilal-zone"; 
const cloudinary_api = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

// 🌟 সর্বোচ্চ কতগুলো ইমেজ আপলোড করা যাবে
const MAX_IMAGES = 6;

const AddProducts = () => {
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure();
  
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]); 
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, MAX_IMAGES);

    if (e.target.files.length > MAX_IMAGES) {
      Swal.fire({
        icon: 'warning',
        title: 'Limit Exceeded',
        text: `You can upload a maximum of ${MAX_IMAGES} images. First ${MAX_IMAGES} images have been selected.`,
        timer: 2000,
        showConfirmButton: false
      });
    }

    setSelectedFiles(files); 
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // 🌟 কোন ছবিটা মেইন/কভার (সবার প্রথমে দেখানো) ছবি হবে সেটা সিলেক্ট করার ফাংশন
  const handleSetAsCover = (index) => {
    if (index === 0) return; // এটা আগে থেকেই কভার ছবি

    setPreviewImages(prev => {
      const updated = [...prev];
      const [selected] = updated.splice(index, 1);
      updated.unshift(selected);
      return updated;
    });

    setSelectedFiles(prev => {
      const updated = [...prev];
      const [selected] = updated.splice(index, 1);
      updated.unshift(selected);
      return updated;
    });
  };

  const onSubmit = async (data) => {
    if (selectedFiles.length === 0) {
      Swal.fire({ icon: 'error', title: 'Oops!', text: 'Please select at least one image!' });
      return;
    }

    setLoading(true);
    try {
      // 🌟 ক্লাউডিনারিতে ইমেজ আপলোড করার লজিক
      const uploadPromises = selectedFiles.map(async (image) => {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', cloudinary_upload_preset);
        
        const res = await fetch(cloudinary_api, {
          method: 'POST',
          body: formData
        });
        const imgRes = await res.json();
        
        if (!imgRes.secure_url) {
          throw new Error("Cloudinary image upload failed");
        }
        
        return imgRes.secure_url;
      });

      const imageUrls = await Promise.all(uploadPromises);

      // কালারগুলোকে কমা দিয়ে ভেঙে অ্যারে (Array) বানিয়ে নেওয়া হলো
      const colorsArray = data.colors ? data.colors.split(',').map(c => c.trim()) : [];

      const productInfo = {
        name: data.name,
        price: parseFloat(data.price), 
        discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : null, 
        category: data.category,
        stock: parseInt(data.stock),
        colors: colorsArray, 
        size: data.size || 'Free Size', 
        description: data.description,
        images: imageUrls,
        image: imageUrls[0],
        createdAt: new Date()
      };

      const result = await axiosSecure.post('/products', productInfo);
      
      if (result.data.insertedId) {
        Swal.fire({
          icon: 'success',
          title: 'Product Added Successfully!',
          text: `Product ID: ${result.data.insertedId}`,
          showConfirmButton: true
        });
        reset();
        setPreviewImages([]);
        setSelectedFiles([]);
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({ icon: 'error', title: 'Something went wrong!', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl text-gray-500 font-semibold mx-auto p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-3xl shadow-xl border p-5 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">Add New Product</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
          <input 
            {...register("name", { required: true })} 
            type="text" 
            placeholder="Product Name" 
            className="w-full p-3 bg-gray-50 rounded-xl border text-gray-800 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          
          {/* Price Section: Original Price, Discount Price & Stock (Mobile এ ১ কলাম, বড় স্ক্রিনে ৩ কলাম) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input 
              {...register("price", { required: true })} 
              type="number" 
              placeholder="Original Price (৳)" 
              className="w-full p-3 bg-gray-50 rounded-xl border text-gray-800 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <input 
              {...register("discountPrice")} 
              type="number" 
              placeholder="Discount Price (৳) [Opt]" 
              className="w-full p-3 bg-gray-50 rounded-xl border text-gray-800 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <input 
              {...register("stock", { required: true })} 
              type="number" 
              placeholder="Stock Quantity" 
              className="w-full p-3 bg-gray-50 rounded-xl border text-gray-800 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          {/* Category & Size (Mobile এ ১ কলাম, বড় স্ক্রিনে ২ কলাম) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Category (Select or Type)</label>
              <input 
                {...register("category", { required: true })}
                type="text"
                list="category-options"
                placeholder="e.g. Shirt or type new"
                className="w-full p-3 bg-gray-50 rounded-xl border text-gray-800 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <datalist id="category-options">
                <option value="Shirt" />
                <option value="Pant" />
                <option value="T-Shirt" />
                <option value="Panjabi" />
                <option value="Hoodie & Jacket" />
                <option value="Shoes" />
                <option value="Watch & Accessories" />
                <option value="Electronics" />
              </datalist>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Available Size (Select or Type)</label>
              <input 
                {...register("size")}
                type="text"
                list="size-options"
                placeholder="e.g. M, L, XL or type custom"
                className="w-full p-3 bg-gray-50 rounded-xl border text-gray-800 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <datalist id="size-options">
                <option value="M, L, XL" />
                <option value="S, M, L, XL, XXL" />
                <option value="Free Size" />
                <option value="38, 40, 42, 44" />
                <option value="S, M, L" />
              </datalist>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Available Colors (Comma separated)</label>
            <input 
              {...register("colors")} 
              type="text" 
              placeholder="e.g. Red, Black, Navy Blue, White" 
              className="w-full p-3 bg-gray-50 rounded-xl border text-gray-800 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          <textarea 
            {...register("description", { required: true })} 
            placeholder="Product Description (Fabric details, features, etc.)" 
            className="w-full p-3 bg-gray-50 rounded-xl border h-32 text-gray-800 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />

          {/* Preview Images */}
          {previewImages.length > 0 && (
            <div>
              <label className="text-xs text-gray-400 block mb-2">
                Selected Images Preview: <span className="text-gray-600">({previewImages.length}/{MAX_IMAGES})</span>
                <span className="block text-[10px] text-gray-400 mt-0.5 normal-case font-normal">
                  ছবির উপর হোভার করে "Set Cover" চাপুন যেটা মেইন ছবি হিসেবে দেখাতে চান
                </span>
              </label>
              <div className="flex gap-3 flex-wrap">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative group w-16 h-16 sm:w-20 sm:h-20">
                    <img
                      src={src}
                      alt="Preview"
                      className={`w-full h-full object-cover rounded-xl border shadow-sm transition-all ${
                        index === 0 ? 'border-2 border-blue-600' : 'border'
                      }`}
                    />

                    {index === 0 ? (
                      <span className="absolute -top-2 -left-2 bg-blue-600 text-white text-[8px] sm:text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full shadow flex items-center gap-0.5">
                        <FiStar size={8} /> Cover
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetAsCover(index)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <span className="text-white text-[8px] sm:text-[9px] font-bold flex flex-col items-center gap-0.5">
                          <FiStar size={12} />
                          Set Cover
                        </span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Area */}
          <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 transition">
            <FiUploadCloud className="text-2xl text-gray-400" />
            <span className="text-xs text-gray-500 mt-1 text-center px-2">Upload up to {MAX_IMAGES} Product Images</span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              multiple 
              onChange={handleImageChange} 
            />
          </label>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 sm:py-3.5 rounded-xl font-bold hover:bg-blue-700 transition cursor-pointer flex items-center justify-center gap-2 disabled:bg-blue-400 text-sm sm:text-base shadow-md"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin text-lg" /> Adding Product...
              </>
            ) : (
              "Add Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;