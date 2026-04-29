import { useContext, useEffect, useMemo, useState } from 'react';
import { Search, Bell, Moon, Sun } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { connectSocket } from '../services/socket';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [upcomingSessions, setUpcomingSessions] = useState([]);

  const fetchUpcomingSessions = async () => {
    if (!user) return;
    try {
      const res = await api.get('/sessions');
      const now = new Date();
      const upcoming = (res.data || []).filter((session) => {
        if (session.status !== 'Scheduled') return false;
        const dateValue = new Date(session.date);
        return dateValue >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
      });
      setUpcomingSessions(upcoming.slice(0, 5));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUpcomingSessions();
    const interval = setInterval(fetchUpcomingSessions, 15000);

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('token');
    const socket = connectSocket(token);
    if (!socket) return;

    const handleSessionUpdated = () => {
      fetchUpcomingSessions();
    };

    socket.on('session:updated', handleSessionUpdated);

    return () => {
      socket.off('session:updated', handleSessionUpdated);
    };
  }, [user]);

  const hasNotifications = useMemo(() => upcomingSessions.length > 0, [upcomingSessions]);

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 py-4 sticky top-0 z-10 transition-all duration-300">
      <div className="flex items-center gap-4 w-full md:w-1/2 lg:w-1/3">
        {/* Placeholder for Mobile Menu Icon if needed */}
        <div className="relative w-full group hidden md:block">
          <input 
            type="text" 
            placeholder="Search subject or location..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 dark:text-white border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow duration-300 shadow-sm group-hover:shadow-md"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 w-5 h-5 group-hover:text-indigo-500 transition-colors duration-300" />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-800"
          title="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <div className="relative">
        <button onClick={() => setShowNotifications((prev) => !prev)} className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-800">
          <Bell className="w-5 h-5" />
          {hasNotifications && <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>}
        </button>
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl p-3 z-50">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white px-2 py-1">Upcoming Sessions</h3>
            <div className="max-h-72 overflow-y-auto">
              {upcomingSessions.length > 0 ? upcomingSessions.map((session) => (
                <div key={session._id} className="px-2 py-3 border-b border-gray-50 dark:border-gray-700 last:border-b-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {user?.role === 'tutor' ? (session.studentId?.name || 'Student Session') : (session.tutorId?.name || 'Tutor Session')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(session.date).toLocaleDateString()} at {session.time}
                  </p>
                </div>
              )) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 px-2 py-4">No upcoming sessions.</p>
              )}
            </div>
          </div>
        )}
        </div>
        
        {user ? (
          <div className="flex items-center gap-3 relative group cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-sm hover:shadow-md transition-shadow">
              {user.name.charAt(0)}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
            </div>
            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
              <div className="py-2">
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400">Profile</Link>
                <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-gray-700">Logout</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
             <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Log in</Link>
             <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all">Sign up</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
