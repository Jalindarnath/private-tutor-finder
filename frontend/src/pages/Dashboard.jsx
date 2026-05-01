import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Calendar, Clock } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [dashLoading, setDashLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [bookingsRes, sessionsRes] = await Promise.all([
          api.get('/bookings'),
          api.get('/sessions'),
        ]);

        setBookings(bookingsRes.data || []);
        setSessions(sessionsRes.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setDashLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const upcomingSessions = sessions
    .filter((session) => session.status === 'Scheduled')
    .sort((left, right) => {
      const leftDate = new Date(`${left.date?.slice?.(0, 10) || left.date}T${left.time || '00:00'}`);
      const rightDate = new Date(`${right.date?.slice?.(0, 10) || right.date}T${right.time || '00:00'}`);
      return leftDate - rightDate;
    });

  const nextSession = upcomingSessions[0];

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Welcome back, {user.name}</h1>
          <p className="text-gray-500 mt-1">Here is the overview of your {user.role === 'tutor' ? 'teaching' : 'learning'} schedule.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-xl"></div>
            <h3 className="text-indigo-100 font-semibold mb-1 relative z-10">Total Sessions</h3>
            <p className="text-4xl font-black relative z-10">{bookings.length}</p>
         </div>
         <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 font-semibold mb-1">Confirmed</h3>
          <p className="text-4xl font-black text-gray-900">{bookings.length}</p>
         </div>
      </div>

      {user.role === 'tutor' ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mt-4">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">Your Bookings (Recent Activity)</h2>
          </div>
          
          {dashLoading ? (
              <div className="p-10 text-center text-gray-500">Loading schedule...</div>
          ) : bookings.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {bookings.map(booking => (
                <div key={booking._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {booking.studentId?.name || 'Unknown Student'}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(booking.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {booking.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-gray-500 capitalize">Confirmed</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center text-gray-500">
               No students have booked you yet.
            </div>
          )}
        </div>
      ) : user.role === 'student' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
             <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900">Next Session</h2>
             </div>
             {dashLoading ? (
               <div className="p-6 flex-1 flex flex-col justify-center items-center text-center text-gray-400">Loading...</div>
             ) : nextSession ? (
               <div className="p-6 flex-1 flex flex-col justify-center items-center text-center">
                  <Calendar className="w-12 h-12 text-indigo-500 mb-3" />
                  <p className="font-semibold text-gray-900 text-lg">
                    {user.role === 'student' ? nextSession.tutorId?.name || 'Your tutor' : nextSession.studentId?.name || 'Class Session'}
                  </p>
                  <p className="text-gray-500 mt-1">
                    {new Date(nextSession.date).toLocaleDateString()} at {nextSession.time}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-gray-400 mt-2">{nextSession.status}</p>
               </div>
             ) : (
               <div className="p-6 flex-1 flex flex-col justify-center items-center text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-500">You don't have any upcoming sessions yet.</p>
               </div>
             )}
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
             </div>
             {dashLoading ? (
               <div className="p-6 text-center text-gray-400">Loading...</div>
             ) : bookings.slice(0, 3).length > 0 ? (
               <div className="divide-y divide-gray-50">
                 {bookings.slice(0, 3).map(b => (
                   <div key={b._id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{b.tutorId?.userId?.name}</p>
                        <p className="text-xs text-gray-500">{new Date(b.date).toLocaleDateString()}</p>
                      </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="p-6 text-center text-gray-400 text-sm">No recent activity.</div>
             )}
          </div>
        </div>
      ) : (
        <div className="mt-4 p-6 bg-white rounded-3xl border shadow-sm text-center">
          Admin Dashboard Under Construction
        </div>
      )}
    </div>
  );
};

export default Dashboard;
