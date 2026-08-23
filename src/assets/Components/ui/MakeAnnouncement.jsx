import { useState, useEffect } from 'react';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { FiBell, FiSend, FiTrash2, FiCalendar, FiVolume2 } from 'react-icons/fi';
import Swal from 'sweetalert2';

const MakeAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const axiosPublic = useAxiosPublic();

  // ডাটা ফেচ করার জন্য useEffect
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axiosPublic.get('/announcements');
        setAnnouncements(res.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [axiosPublic]);

  // আলাদা রিফ্রেশ ফাংশন
  const reloadAnnouncements = async () => {
    try {
      const res = await axiosPublic.get('/announcements');
      setAnnouncements(res.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  // নতুন এনাউন্সমেন্ট পোস্ট করার ফাংশন
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      Swal.fire('Error', 'Please fill in all fields!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axiosPublic.post('/announcements', {
        title,
        message,
        date: new Date().toISOString()
      });

      if (res.data.insertedId || res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Published!',
          text: 'Announcement posted successfully.',
          showConfirmButton: false,
          timer: 1500
        });
        setTitle('');
        setMessage('');
        reloadAnnouncements();
      }
    } catch (error) {
      console.error("Error posting announcement:", error);
      Swal.fire('Error', 'Failed to post announcement!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // এনাউন্সমেন্ট ডিলিট করার ফাংশন
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this announcement?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosPublic.delete(`/announcements/${id}`);
          if (res.data.deletedCount > 0 || res.data.success) {
            Swal.fire('Deleted!', 'Announcement has been deleted.', 'success');
            reloadAnnouncements();
          }
        } catch (error) {
          console.error("Error deleting announcement:", error);
          Swal.fire('Error', 'Failed to delete announcement!', 'error');
        }
      }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* হেডার সেকশন */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <FiVolume2 className="text-blue-600" /> Make Announcement
          </h1>
          <p className="text-sm text-gray-500 mt-1">Broadcast important news, offers, or updates to your users.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl font-bold text-sm border border-blue-100 flex items-center gap-2">
          <FiBell /> Total Announcements: {announcements.length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ফর্ম সেকশন */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 lg:col-span-1 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Notice</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Eid Special Discount 20%" 
                className="w-full px-4 py-3 rounded-2xl border text-gray-700 border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm font-medium transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Message Details</label>
              <textarea 
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your announcement details here..."
                className="w-full px-4 py-3 text-gray-700 rounded-2xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm font-medium transition-all resize-none"
              ></textarea>
            </div>
            <button 
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <FiSend size={16} /> {submitting ? 'Publishing...' : 'Publish Announcement'}
            </button>
          </form>
        </div>

        {/* লিস্ট বা হিস্ট্রি সেকশন */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Announcements</h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-16 text-gray-400 font-bold bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              No announcements found!
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {announcements.map((item) => (
                <div key={item._id} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-blue-50/30 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.message}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 font-mono pt-1">
                      <FiCalendar size={12} /> {new Date(item.date || item._id).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all cursor-pointer shrink-0"
                    title="Delete Announcement"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MakeAnnouncement;