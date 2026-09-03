import { useState, useEffect } from 'react';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { FiBell } from 'react-icons/fi';

const AnnouncementSlider = () => {
  const [announcements, setAnnouncements] = useState([]);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    axiosPublic.get('/announcements')
      .then(res => setAnnouncements(res.data))
      .catch(err => console.error(err));
  }, [axiosPublic]);

  if (announcements.length === 0) return null;

  return (
    <div className="bg-white border border-blue-100 shadow-sm px-4 py-3.5 my-4 max-w-7xl mx-auto rounded-2xl flex items-center gap-4 overflow-hidden">
      <div className="flex items-center gap-2 font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full text-xs uppercase tracking-wider shrink-0">
        <FiBell className="animate-bell-ring origin-top" /> Latest News
      </div>

      <div className="overflow-hidden w-full relative">
        <div className="whitespace-nowrap inline-block animate-marquee">
          {announcements.map((item, index) => (
            <span key={index} className="text-sm text-gray-700 font-medium mr-16">
              <span className="font-bold text-gray-900 mr-2">{item?.title}:</span>
              <span>{item?.message}</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }

        @keyframes bellRing {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(15deg); }
          20% { transform: rotate(-13deg); }
          30% { transform: rotate(10deg); }
          40% { transform: rotate(-8deg); }
          50% { transform: rotate(6deg); }
          60% { transform: rotate(-4deg); }
          70% { transform: rotate(2deg); }
          80%, 100% { transform: rotate(0deg); }
        }
        .animate-bell-ring {
          animation: bellRing 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AnnouncementSlider;