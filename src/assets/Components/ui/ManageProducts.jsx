import { useState, useEffect } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FaBoxes, FaTrashAlt, FaEdit, FaSearch, FaTimes, FaCamera, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';

// 🌟 ক্লাউডিনারি কনফিগারেশন
const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const cloudinary_upload_preset = "bilal-zone"; 
const cloudinary_api = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

const ManageProducts = () => {
    const axiosSecure = useAxiosSecure();
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // 🌟 এডিট মোডালের জন্য স্টেটসমূহ
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axiosSecure.get('/products');
                setProducts(res.data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [axiosSecure]);

    // এডিট মোডাল খোলার ফাংশন
    const handleOpenEditModal = (product) => {
        setCurrentProduct(product);
        setImagePreview(product.image || product.images?.[0] || '');
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    // ছবি পরিবর্তনের সময় প্রিভিউ দেখানোর ফাংশন
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // প্রোডাক্ট আপডেট সাবমিট করার ফাংশন
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            let imageUrl = currentProduct.image;
            let imagesArray = currentProduct.images || [];

            // যদি নতুন ছবি সিলেক্ট করা হয়ে থাকে, তবে ক্লাউডিনারিতে আপলোড হবে
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('upload_preset', cloudinary_upload_preset);
                
                const res = await fetch(cloudinary_api, {
                    method: 'POST',
                    body: formData
                });
                const imgRes = await res.json();
                
                if (!imgRes.secure_url) {
                    throw new Error("Cloudinary image upload failed");
                }
                
                imageUrl = imgRes.secure_url;
                imagesArray = [imageUrl, ...imagesArray.filter(img => img !== imageUrl)];
            }

            const updatedData = {
                name: e.target.name.value,
                price: parseFloat(e.target.price.value),
                discountPrice: e.target.discountPrice.value ? parseFloat(e.target.discountPrice.value) : null,
                category: e.target.category.value,
                stock: parseInt(e.target.stock.value),
                description: e.target.description.value,
                image: imageUrl,
                images: imagesArray
            };

            const res = await axiosSecure.patch(`/products/${currentProduct._id}`, updatedData);
            
            if (res.data.modifiedCount > 0 || res.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Product Updated Successfully!',
                    showConfirmButton: false,
                    timer: 1500
                });

                setIsModalOpen(false);
                // প্রোডাক্ট লিস্ট রিফ্রেশ করা
                const updatedRes = await axiosSecure.get('/products');
                setProducts(updatedRes.data);
            }
        } catch (error) {
            console.error("Update error:", error);
            Swal.fire({ icon: 'error', title: 'Something went wrong!', text: error.message });
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f97316",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/products/${id}`);
                    if (res.data.deletedCount > 0 || res.data.success) {
                        Swal.fire("Deleted!", "Product has been deleted.", "success");
                        const updatedRes = await axiosSecure.get('/products');
                        setProducts(updatedRes.data);
                    }
                } catch (error) {
                    console.error("Delete error:", error);
                    Swal.fire("Error!", "Failed to delete product.", "error");
                }
            }
        });
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                        <FaBoxes className="text-orange-500" /> Manage All Products
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Total {products.length} products available in store.</p>
                </div>

                <div className="relative w-full md:w-72">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <FaSearch />
                    </span>
                    <input 
                        type="text" 
                        placeholder="Search by name or category..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100/70 border-b text-xs uppercase font-extrabold text-gray-500 tracking-wider">
                                <th className="py-4 px-6">Product Info</th>
                                <th className="py-4 px-6">Category</th>
                                <th className="py-4 px-6">Price</th>
                                <th className="py-4 px-6">Stock</th>
                                <th className="py-4 px-6 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-400 font-semibold">Loading products...</td>
                                </tr>
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-6 flex items-center gap-4">
                                            <img 
                                                src={product.image || product.images?.[0] || 'https://via.placeholder.com/80'} 
                                                alt={product.name} 
                                                className="w-12 h-12 object-cover rounded-xl border bg-gray-50 shrink-0" 
                                            />
                                            <div>
                                                <h4 className="font-bold text-gray-800 line-clamp-1">{product.name}</h4>
                                                <p className="text-xs text-gray-400">ID: {product._id?.slice(-6)}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 font-semibold text-gray-600">
                                            <span className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg text-xs font-bold uppercase">
                                                {product.category || 'General'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-black text-gray-900">৳{product.price}</td>
                                        <td className="py-4 px-6">
                                            <span className={`font-bold text-xs px-2.5 py-1 rounded-full ${
                                                (product.stock || 10) > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                                {(product.stock || 10) > 0 ? `${product.stock || 'In Stock'}` : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => handleOpenEditModal(product)}
                                                    className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all cursor-pointer"
                                                    title="Edit Product"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                                                    title="Delete Product"
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-gray-400 font-semibold">No products found!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 🛠️ Edit Product Modal with Image Upload */}
            {isModalOpen && currentProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4 border-b pb-3">
                            <h3 className="text-xl font-bold text-gray-800">Update Product</h3>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            {/* ছবি আপলোড ও প্রিভিউ */}
                            <div className="flex flex-col items-center justify-center space-y-2">
                                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-orange-400 group shadow-sm">
                                    <img 
                                        src={imagePreview || 'https://via.placeholder.com/80'} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover"
                                    />
                                    <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <FaCamera className="text-xl mb-1" />
                                        <span className="text-[10px]">Change</span>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <span className="text-xs text-gray-400">Click image to upload new from computer</span>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Product Name</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    defaultValue={currentProduct.name}
                                    required
                                    className="w-full p-3 bg-gray-50 rounded-xl border text-gray-800 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none" 
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Price</label>
                                    <input 
                                        type="number" 
                                        name="price"
                                        defaultValue={currentProduct.price}
                                        required
                                        className="w-full p-3 bg-gray-50 rounded-xl border text-gray-800 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Discount</label>
                                    <input 
                                        type="number" 
                                        name="discountPrice"
                                        defaultValue={currentProduct.discountPrice || ''}
                                        className="w-full p-3 bg-gray-50 rounded-xl border text-gray-800 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Stock</label>
                                    <input 
                                        type="number" 
                                        name="stock"
                                        defaultValue={currentProduct.stock || 10}
                                        required
                                        className="w-full p-3 bg-gray-50 rounded-xl border text-gray-800 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Category</label>
                                <input 
                                    type="text" 
                                    name="category"
                                    defaultValue={currentProduct.category}
                                    required
                                    className="w-full p-3 bg-gray-50 rounded-xl border text-gray-800 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none" 
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Description</label>
                                <textarea 
                                    name="description"
                                    defaultValue={currentProduct.description}
                                    required
                                    rows="3"
                                    className="w-full p-3 bg-gray-50 rounded-xl border text-gray-800 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none" 
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border text-gray-600 font-semibold text-sm hover:bg-gray-100 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={updating}
                                    className="px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 flex items-center justify-center min-w-[120px] cursor-pointer disabled:bg-orange-300"
                                >
                                    {updating ? (
                                        <>
                                            <FaSpinner className="animate-spin text-sm mr-2" /> Updating...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageProducts;