import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../services/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/bookings/tutor/students');
        setStudents(res.data || []);
      } catch (error) {
        if (error.response?.status === 403) {
          setForbidden(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (forbidden) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="max-w-5xl flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Students</h1>
        <p className="text-gray-500 mt-1">Students who booked your tutoring sessions.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 text-gray-500">Loading students...</div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 text-gray-500">No students booked yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {students.map((student) => (
            <div key={student._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p>Email: {student.email || 'NA'}</p>
                <p>Phone: {student.phoneNumber || 'NA'}</p>
                <p>Parent Phone: {student.parentPhoneNumber || 'NA'}</p>
                <p>Latest Booking: {student.latestBookingDate ? new Date(student.latestBookingDate).toLocaleDateString() : 'NA'}</p>
                <p className="capitalize">Status: {student.latestBookingStatus || 'NA'}</p>
              </div>
              <Link
                to={`/messages?contact=${student._id}`}
                className="inline-block mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
              >
                Message Student
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Students;
