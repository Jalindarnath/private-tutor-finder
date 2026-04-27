import { useEffect, useState } from 'react';
import api from '../services/api';

const MyTutors = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings');
        setBookings(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const uniqueTutors = [];
  const seenTutors = new Set();
  bookings.forEach((booking) => {
    const tutor = booking.tutorId;
    if (!tutor?._id) return;
    if (seenTutors.has(tutor._id)) return;
    seenTutors.add(tutor._id);
    uniqueTutors.push({
      tutor,
      bookingStatus: booking.status,
      bookedOn: booking.date
    });
  });

  const handleDraftChange = (tutorId, key, value) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [tutorId]: {
        rating: prev[tutorId]?.rating || 5,
        comment: prev[tutorId]?.comment || '',
        [key]: value
      }
    }));
  };

  const submitReview = async (tutorId) => {
    try {
      const draft = reviewDrafts[tutorId] || { rating: 5, comment: '' };
      await api.post('/reviews', {
        tutorId,
        rating: Number(draft.rating || 5),
        comment: draft.comment
      });
      setStatusMessage('Review submitted successfully.');
    } catch (error) {
      setStatusMessage(error.response?.data?.message || 'Failed to submit review');
    }
  };

  let content = null;
  if (loading) {
    content = <div className="bg-white rounded-3xl p-8 border border-gray-100 text-gray-500">Loading tutors...</div>;
  } else if (uniqueTutors.length === 0) {
    content = <div className="bg-white rounded-3xl p-8 border border-gray-100 text-gray-500">No tutors booked yet.</div>;
  } else {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {uniqueTutors.map(({ tutor, bookingStatus, bookedOn }) => (
          <div key={tutor._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">{tutor.userId?.name || 'Tutor'}</h3>
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              <p>Email: {tutor.userId?.email || 'NA'}</p>
              <p>Phone: {tutor.userId?.phoneNumber || 'NA'}</p>
              <p>Subjects: {(tutor.subjects || []).join(', ') || 'NA'}</p>
              <p>Experience: {tutor.experience || 'NA'}</p>
              <p>Location: {tutor.location || 'Online'}</p>
              <p>Booked On: {bookedOn ? new Date(bookedOn).toLocaleDateString() : 'NA'}</p>
              <p className="capitalize">Latest Status: {bookingStatus || 'NA'}</p>
            </div>

            <div className="mt-4 border-t border-gray-100 pt-4 space-y-2">
              <p className="text-sm font-semibold text-gray-800">Give Review</p>
              <select
                value={reviewDrafts[tutor._id]?.rating || 5}
                onChange={(e) => handleDraftChange(tutor._id, 'rating', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Very Poor</option>
              </select>
              <textarea
                value={reviewDrafts[tutor._id]?.comment || ''}
                onChange={(e) => handleDraftChange(tutor._id, 'comment', e.target.value)}
                rows="2"
                placeholder="Write your feedback"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
              />
              <button
                onClick={() => submitReview(tutor._id)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
              >
                Submit Review
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-5xl flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">My Tutors</h1>
        <p className="text-gray-500 mt-1">Tutors you booked and their details.</p>
      </div>

      {statusMessage && <p className="text-sm text-indigo-700 font-medium">{statusMessage}</p>}

      {content}
    </div>
  );
};

export default MyTutors;
