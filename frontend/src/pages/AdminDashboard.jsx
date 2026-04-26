import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Users, GraduationCap, Calendar, CheckSquare } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    if (user?.role === 'admin') fetchStats();
  }, [user]);

  if (loading) return <div>Loading Admin...</div>;

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and vital metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center">
           <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
             <Users className="w-6 h-6" />
           </div>
           <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Students</h3>
           <p className="text-3xl font-black text-gray-900">{stats?.totalStudents || 0}</p>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center">
           <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3">
             <GraduationCap className="w-6 h-6" />
           </div>
           <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Tutors</h3>
           <p className="text-3xl font-black text-gray-900">{stats?.totalTutors || 0}</p>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center">
           <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-3">
             <Calendar className="w-6 h-6" />
           </div>
           <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Bookings</h3>
           <p className="text-3xl font-black text-gray-900">{stats?.totalBookings || 0}</p>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center">
           <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
             <CheckSquare className="w-6 h-6" />
           </div>
           <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Sessions</h3>
           <p className="text-3xl font-black text-gray-900">{stats?.totalSessions || 0}</p>
        </div>
      </div>
      
      <div className="mt-6 bg-gradient-to-r from-gray-900 to-indigo-900 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between">
         <div>
            <h2 className="text-2xl font-bold mb-2">Manage Users</h2>
            <p className="text-gray-400">View and manage all registered tutors and students on the platform.</p>
         </div>
         <a href="/admin-users" className="mt-4 md:mt-0 bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg">Go to Users List</a>
      </div>
    </div>
  );
};

export default AdminDashboard;
