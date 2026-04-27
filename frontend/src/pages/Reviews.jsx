import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Star } from 'lucide-react';

const Reviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user) return;
      try {
        if (user.role === 'tutor') {
          const res = await api.get('/reviews/my');
          setReviews(res.data);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading reviews...</div>;
  }

  if (user?.role !== 'tutor') {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reviews</h1>
        <p className="text-gray-500">Students can view tutor reviews while booking sessions.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Student Reviews</h1>
        <p className="text-gray-500 mt-1">Feedback from students who booked your sessions.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center text-gray-500">
          No reviews yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">{review.studentId?.name || 'Student'}</h3>
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className={`w-4 h-4 ${index < review.rating ? 'fill-current' : ''}`} />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 text-sm">{review.comment || 'No comment provided.'}</p>
              <p className="text-xs text-gray-400 mt-3">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
