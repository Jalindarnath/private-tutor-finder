import { Star, MapPin } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const TutorCard = ({ tutor }) => {
  const navigate = useNavigate();

  const handleBookNow = async () => {
    try {
      // 1. Create a Booking
      await api.post('/bookings', {
        tutorId: tutor._id,
        date: new Date().toISOString(), // Example: booking created today
        time: 'TBD', // In a full flow we'd have a dialog to pick time, but for auto-booking let's just create it
        message: 'I would like to book a monthly session with you.'
      });

      // 2. Create Chat Message to the Tutor
      await api.post('/messages', {
        receiverId: tutor.userId._id,
        content: `Hi ${tutor.userId.name}! I just booked you for a monthly session.`
      });

      alert('Tutor booked successfully! Check your messages or bookings page.');
      navigate('/messages');
    } catch (error) {
       console.error(error);
       alert(error.response?.data?.message || 'Error booking tutor');
    }
  };
  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full transform hover:-translate-y-1 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={tutor.profileImage || `https://ui-avatars.com/api/?name=${tutor.userId?.name}&background=random`} 
              alt={tutor.userId?.name} 
              className="w-14 h-14 rounded-2xl object-cover shadow-sm bg-gray-100"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">{tutor.userId?.name || 'Unknown'}</h3>
            <p className="text-xs text-brand-500 text-gray-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {tutor.location || 'Online'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-current" />
          {tutor.rating?.toFixed(1) || 'New'}
        </div>
      </div>

      <div className="mb-4 flex-1">
        <div className="flex flex-wrap gap-2 mb-3">
          {tutor.subjects?.slice(0,3).map(sub => (
            <span key={sub} className="px-2.5 py-1 bg-indigo-50/70 text-indigo-600 text-xs rounded-lg font-medium">
              {sub}
            </span>
          ))}
          {tutor.subjects?.length > 3 && (
            <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-xs rounded-lg font-medium">
              +{tutor.subjects.length - 3}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">
          {tutor.bio || 'Experienced and dedicated tutor ready to help you excel in your studies.'}
        </p>
      </div>

      <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
        <div>
          <p className="text-xs text-gray-400 font-medium">Monthly Rate</p>
          <p className="text-lg font-black text-gray-900">₹{tutor.monthlyRate || 0}<span className="text-xs font-normal text-gray-500">/mo</span></p>
        </div>
        <button 
          onClick={handleBookNow}
          className="bg-gray-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-300 shadow-md"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default TutorCard;
