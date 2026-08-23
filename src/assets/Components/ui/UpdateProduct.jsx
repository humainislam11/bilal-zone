import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FiUploadCloud } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const UpdateProduct = () => {
  const { id } = useParams();
  const { register, handleSubmit, setValue } = useForm();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  
  const [existingImages, setExistingImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]); // নতুন সিলেক্ট করা ছবির প্রিভিউ স্টেট
  const [uploading, setUploading] = useState(false);

  // ১. নির্দিষ্ট প্রোডাক্টের ডাটা ফেচ করে ফর্মে সেট করা
  useEffect(() => {
    axiosSecure.get(`/products/${id}`)
      .then(res => {
        const product = res.data;
        setValue('name', product.name);
        setValue('price', product.price);
        setValue('stock', product.stock);
        setValue('category', product.category);
        setValue('description', product.description);
        setExistingImages(product.images || [product.image] || []);
      })
      .catch(err => console.error("Failed to fetch product:", err));
  }, [id, axiosSecure, setValue]);

  // নতুন ছবি সিলেক্ট করলে প্রিভিউ দেখানোর ফাংশন
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // ২. ফর্ম সাবমিট এবং ইমেজ আপলোড লজিক
  const onSubmit = async (data) => {
    setUploading(true);
    try {
      let imageUrls = existingImages;

      // চেক করা হচ্ছে নতুন কোনো ফাইল সিলেক্ট করা হয়েছে কি না
      const imageFiles = data.images;
      if (imageFiles && imageFiles.length > 0) {
        const files = Array.from(imageFiles).slice(0, 3);
        
        const uploadPromises = files.map(async (image) => {
          const formData = new FormData();
          formData.append('image', image);
          
          const res = await fetch(image_hosting_api, {
            method: 'POST',
            body: formData
          });
          const imgRes = await res.json();
          if (imgRes.success) {
            return imgRes.data.display_url;
          } else {
            throw new Error("Image hosting failed");
          }
        });

        imageUrls = await Promise.all(uploadPromises);
      }

      // ডাটাবেজে পাঠানোর জন্য অবজেক্ট তৈরি
      const updatedProductInfo = {
        name: data.name,
        price: parseFloat(data.price),
        category: data.category,
        stock: parseInt(data.stock),
        description: data.description,
        images: imageUrls,
        image: imageUrls[0] || "" // প্রধান ছবি হিসেবে প্রথমটি সেট করা হলো
      };

      // ৩. সার্ভারে প্যাচ রিকোয়েস্ট পাঠানো
      const result = await axiosSecure.patch(`/products/${id}`, updatedProductInfo);
      
      if (result.data.modifiedCount > 0 || result.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Product Updated Successfully!',
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/dashboard/manageProducts');
      } else {
        Swal.fire({
          icon: 'info',
          title: 'No changes were made.',
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({ icon: 'error', title: 'Something went wrong!', text: error.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl text-gray-500 font-semibold mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-xl border p-8">
        <h2 className="text-2xl font-black text-gray-900 mb-6">Update Product</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input 
            {...register("name", { required: true })} 
            type="text" 
            placeholder="Product Name" 
            className="w-full p-3 bg-gray-50 rounded-xl border text-gray-800" 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <input 
              {...register("price", { required: true })} 
              type="number" 
              placeholder="Price (৳)" 
              className="w-full p-3 bg-gray-50 rounded-xl border text-gray-800" 
            />
            <input 
              {...register("stock", { required: true })} 
              type="number" 
              placeholder="Stock" 
              className="w-full p-3 bg-gray-50 rounded-xl border text-gray-800" 
            />
          </div>

          <select {...register("category")} className="w-full p-3 bg-gray-50 rounded-xl border text-gray-800">
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Clothing">Clothing</option>
          </select>

          <textarea 
            {...register("description", { required: true })} 
            placeholder="Product Description" 
            className="w-full p-3 bg-gray-50 rounded-xl border h-32 text-gray-800" 
          />

          {/* আগের ছবিগুলোর প্রিভিউ */}
          <div>
            <label className="text-xs text-gray-400 block mb-2">Current Images:</label>
            <div className="flex gap-2">
              {existingImages.map((img, index) => (
                <img key={index} src={img} alt="Product" className="w-16 h-16 object-cover rounded-xl border" />
              ))}
            </div>
          </div>

          {/* নতুন সিলেক্ট করা ছবির প্রিভিউ */}
          {previewImages.length > 0 && (
            <div>
              <label className="text-xs text-green-600 font-bold block mb-2">New Selected Images Preview:</label>
              <div className="flex gap-2">
                {previewImages.map((src, index) => (
                  <img key={index} src={src} alt="New Preview" className="w-16 h-16 object-cover rounded-xl border-2 border-green-500 shadow-sm" />
                ))}
              </div>
            </div>
          )}

          {/* নতুন ফাইল ইনপুট */}
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50">
            <FiUploadCloud className="text-2xl text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">Upload new images (Optional, up to 3)</span>
            <input 
              {...register("images")} 
              type="file" 
              className="hidden" 
              accept="image/*" 
              multiple 
              onChange={(e) => {
                register("images").onChange(e);
                handleImageChange(e);
              }}
            />
          </label>

          {/* লোডিং স্পিনারসহ সাবমিট বাটন */}
          <button 
            type="submit" 
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition cursor-pointer flex items-center justify-center gap-2 disabled:bg-blue-400"
          >
            {uploading ? (
              <>
                <FaSpinner className="animate-spin text-lg" /> Updating Product...
              </>
            ) : (
              "Update Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;