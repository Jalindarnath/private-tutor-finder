import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { connectSocket } from '../services/socket';
import { Calendar, Clock, Video, Presentation, X, Plus } from 'lucide-react';

const Sessions = () => {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [tutorStudents, setTutorStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newSession, setNewSession] = useState({ date: '', time: '', duration: '1 hour', mode: 'Online', meetingLink: '' });

  const fetchSessions = useCallback(async () => {
    try {
      const res = await api.get('/sessions');
      console.log('📥 [Sessions] Fetched sessions:', res.data?.length || 0, 'sessions');
      if (res.data?.length > 0) {
        console.log('   Sessions:', res.data.map(s => ({ id: s._id, tutorName: s.tutorId?.name, studentName: s.studentId?.name })));
      }
      setSessions(res.data || []);
    } catch (error) {
      console.error('❌ [Sessions] Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 15000);

    return () => clearInterval(interval);
  }, [fetchSessions]);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('token');
    const socket = connectSocket(token);
    if (!socket) return;

    console.log('🔌 [Socket] Connected for user:', user.userId, 'role:', user.role);

    const handleSessionUpdated = (payload) => {
      console.log('🔔 [Socket] Received session:updated event', payload);
      fetchSessions();
    };

    socket.on('session:updated', handleSessionUpdated);

    return () => {
      socket.off('session:updated', handleSessionUpdated);
    };
  }, [user, fetchSessions]);

  useEffect(() => {
    const fetchTutorStudents = async () => {
      if (user?.role !== 'tutor') return;

      try {
        const res = await api.get('/bookings/tutor/students');
        setTutorStudents(res.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTutorStudents();
  }, [user]);

  const handleCreateSession = async (e) => {
    e.preventDefault();

    try {
      await api.post('/sessions', newSession);
      setShowModal(false);
      setNewSession({ date: '', time: '', duration: '1 hour', mode: 'Online', meetingLink: '' });
      fetchSessions();
    } catch (error) {
      console.error(error);
      alert('Error creating session');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/sessions/${id}`, { status });
      await fetchSessions();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading sessions...</div>;

  const upcoming = sessions.filter(s => s.status === 'Scheduled');
  const past = sessions.filter(s => s.status === 'Completed' || s.status === 'Cancelled');

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Sessions</h1>
          <p className="text-gray-500 mt-1">Manage your active and past classes.</p>
        </div>
        {user.role === 'tutor' && (
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md flex items-center gap-2 hover:bg-indigo-700 transition">
            <Plus className="w-5 h-5"/> Add Session
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Upcoming Sessions</h2>
        </div>
        <div className="p-6">
          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {upcoming.map(s => (
                 <div key={s._id} className="border border-indigo-100 bg-indigo-50/30 p-5 rounded-2xl relative">
                    <span className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 px-3 py-1 text-xs font-bold rounded-full">{s.status}</span>
                    <h3 className="font-bold text-gray-900 mb-1">{user.role === 'student' ? s.tutorId?.name : s.studentId?.name || 'Class Session'}</h3>
                    <div className="space-y-2 mt-4 text-sm text-gray-600">
                       <p className="flex items-center gap-2"><Calendar className="w-4 h-4"/> {new Date(s.date).toLocaleDateString()}</p>
                       <p className="flex items-center gap-2"><Clock className="w-4 h-4"/> {s.time} ({s.duration})</p>
                       <p className="flex items-center gap-2">{s.mode === 'Online' ? <Video className="w-4 h-4"/> : <Presentation className="w-4 h-4"/>} {s.mode}</p>
                    </div>
                    {s.mode === 'Online' && s.meetingLink && (
                       <a href={s.meetingLink} target="_blank" rel="noopener noreferrer" className="mt-4 block w-full text-center bg-white border border-gray-200 text-indigo-600 font-semibold py-2 rounded-xl hover:bg-indigo-50 transition">Join Meeting</a>
                    )}
                    <div className="mt-4 flex gap-2">
                       <button onClick={() => handleStatusUpdate(s._id, 'Completed')} className="flex-1 text-xs font-bold py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 text-center">Mark Done</button>
                       <button onClick={() => handleStatusUpdate(s._id, 'Cancelled')} className="flex-1 text-xs font-bold py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 text-center">Cancel</button>
                    </div>
                 </div>
               ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">No upcoming sessions.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Session History</h2>
        </div>
        <div className="p-6">
          {past.length > 0 ? (
            <div className="divide-y divide-gray-100">
               {past.map(s => (
                 <div key={s._id} className="py-4 flex justify-between items-center opacity-70 hover:opacity-100 transition">
                    <div>
                      <p className="font-semibold text-gray-800">{user.role === 'student' ? s.tutorId?.name : s.studentId?.name || 'Class Session'}</p>
                      <p className="text-xs text-gray-500">{new Date(s.date).toLocaleDateString()} at {s.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {s.status}
                    </span>
                 </div>
               ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">No past sessions.</p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold">Add Session</h2>
               <button onClick={() => setShowModal(false)}><X className="text-gray-400 hover:text-gray-600"/></button>
             </div>
             <form onSubmit={handleCreateSession} className="space-y-4">
               <div>
                <label htmlFor="session-date" className="block text-xs font-bold text-gray-600 uppercase mb-1">Date</label>
                <input id="session-date" required type="date" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={newSession.date} onChange={e => setNewSession({...newSession, date: e.target.value})}/>
               </div>
               <div className="flex gap-4">
                 <div className="w-1/2">
                  <label htmlFor="session-time" className="block text-xs font-bold text-gray-600 uppercase mb-1">Time</label>
                  <input id="session-time" required type="time" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={newSession.time} onChange={e => setNewSession({...newSession, time: e.target.value})}/>
                 </div>
                 <div className="w-1/2">
                  <label htmlFor="session-duration" className="block text-xs font-bold text-gray-600 uppercase mb-1">Duration</label>
                  <select id="session-duration" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={newSession.duration} onChange={e => setNewSession({...newSession, duration: e.target.value})}>
                      <option>30 mins</option>
                      <option>1 hour</option>
                      <option>2 hours</option>
                    </select>
                 </div>
               </div>
               <div>
                    <label htmlFor="session-mode" className="block text-xs font-bold text-gray-600 uppercase mb-1">Mode</label>
                    <select id="session-mode" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={newSession.mode} onChange={e => setNewSession({...newSession, mode: e.target.value})}>
                      <option>Online</option>
                      <option>Offline</option>
                    </select>
               </div>
               {newSession.mode === 'Online' && (
                 <div>
                   <label htmlFor="session-link" className="block text-xs font-bold text-gray-600 uppercase mb-1">Link</label>
                   <input id="session-link" type="text" placeholder="Zoom/Meet Link" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={newSession.meetingLink} onChange={e => setNewSession({...newSession, meetingLink: e.target.value})}/>
                 </div>
               )}
               <button className="w-full bg-indigo-600 text-white font-bold py-3 pt-3 rounded-xl mt-4 hover:bg-indigo-700 shadow-md">Create Session</button>
             </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Sessions;
