import { useEffect, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FiTrash2, FiMessageSquare } from 'react-icons/fi';
import Swal from 'sweetalert2';

const ReportedComments = () => {
  const [reportedReviews, setReportedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // useEffect এর ভেতরেই ডেটা ফেচিং লজিক সরাসরি লিখে দেওয়া হলো
  useEffect(() => {
    const fetchReportedReviews = async () => {
      try {
        const res = await axiosSecure.get('/reported-reviews');
        setReportedReviews(res.data);
      } catch (error) {
        console.error("Error fetching reported reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportedReviews();
  }, [axiosSecure]);

  // কমেন্ট বা রিভিউ ডিলিট করার ফাংশন
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this reported comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/reviews/${id}`);
          if (res.data.deletedCount > 0 || res.data.success) {
            Swal.fire("Deleted!", "The comment has been removed.", "success");
            setReportedReviews(reportedReviews.filter(item => item._id !== id));
          }
        } catch (error) {
          console.error("Error deleting review:", error);
          Swal.fire("Error!", "Failed to delete the comment.", "error");
        }
      }
    });
  };

  if (loading) {
    return <div className="text-center mt-20 font-bold text-gray-500">Loading reported comments...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Reported Comments</h2>
          <p className="text-xs text-gray-500 mt-1">Manage and moderate user comments or reviews that have been reported.</p>
        </div>
        <span className="bg-orange-50 text-orange-600 font-bold text-xs px-3 py-1.5 rounded-xl border border-orange-200">
          Total Reports: {reportedReviews.length}
        </span>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        {reportedReviews.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <FiMessageSquare className="mx-auto text-4xl text-gray-300" />
            <p className="text-gray-500 font-bold text-sm">No reported comments found!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {reportedReviews.map((item) => (
              <div key={item._id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-gray-50/50 transition">
                <div className="flex items-start gap-4">
                  <img 
                    src={item.userPhoto || 'https://i.ibb.co/2M7StZP/default-avatar.png'} 
                    alt={item.userName} 
                    className="w-12 h-12 rounded-full object-cover border shrink-0" 
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-800 text-sm">{item.userName}</h4>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
                        {item.userEmail}
                      </span>
                    </div>
                    <p className="text-xs text-orange-600 font-semibold">Product ID: {item.productId}</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border mt-1">
                      &quot;{item.comment}&quot;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer"
                  >
                    <FiTrash2 /> Remove Comment
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

export default ReportedComments;