import { useState, useEffect } from 'react';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { FiBell } from 'react-icons/fi';

const AnnouncementSlider = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    axiosPublic.get('/announcements')
      .then(res => setAnnouncements(res.data))
      .catch(err => console.error(err));
  }, [axiosPublic]);

  // প্রতি ৩ সেকেন্ড পর পর স্লাইড পরিবর্তন করার জন্য
  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [announcements]);

  if (announcements.length === 0) return null;

  const currentItem = announcements[currentIndex];

  return (
    <div className="bg-white border border-blue-100 shadow-sm px-4 py-3.5 my-4 max-w-7xl mx-auto rounded-2xl flex items-center gap-4">
      <div className="flex items-center gap-2 font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full text-xs uppercase tracking-wider shrink-0">
        <FiBell className="animate-pulse" /> Latest News
      </div>
      
      <div className="overflow-hidden w-full">
        <div key={currentIndex} className="transition-all duration-500 ease-in-out text-sm text-gray-700 font-medium">
          <span className="font-bold text-gray-900 mr-2">{currentItem?.title}:</span> 
          <span>{currentItem?.message}</span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementSlider;