import { useState, useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck, MessageSquare, Star, Settings, GraduationCap, ChevronLeft, History, DollarSign, List } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useContext(AuthContext);

  const studentNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Find Tutors', path: '/find-tutors', icon: Users },
    { name: 'My Tutors', path: '/my-tutors', icon: CalendarCheck },
    { name: 'Sessions', path: '/sessions', icon: History },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const tutorNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Sessions', path: '/sessions', icon: History },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'Reviews', path: '/reviews', icon: Star },
    { name: 'Earnings', path: '/earnings', icon: DollarSign },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const adminNavItems = [
    { name: 'Admin Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
    { name: 'Users List', path: '/admin-users', icon: List },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  let navItems = studentNavItems;
  if(user?.role === 'tutor') navItems = tutorNavItems;
  if(user?.role === 'admin') navItems = adminNavItems;

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 hidden md:flex flex-col transition-all duration-300 ease-in-out relative z-20`}>
      <div className="h-16 flex items-center px-4 md:px-6 justify-between border-b border-gray-50 dark:border-gray-800">
        <Link to="/dashboard" className={`flex items-center gap-3 overflow-hidden ${collapsed ? 'justify-center opacity-0 w-0' : 'opacity-100 w-auto'} transition-opacity duration-300 hover:opacity-80`}>
          <GraduationCap className="h-7 w-7 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight whitespace-nowrap">TutorFind</span>
        </Link>
        {collapsed ? (
          <GraduationCap className="h-7 w-7 text-indigo-600 dark:text-indigo-400 shrink-0 absolute left-1/2 -translate-x-1/2" />
        ) : (
          <GraduationCap className="h-7 w-7 text-indigo-600 dark:text-indigo-400 shrink-0 absolute left-6 transition-all duration-300 opacity-0" />
        )}
      </div>

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full p-1 shadow-sm text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 z-50 transition-colors"
      >
        <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
      </button>

      <nav className="flex-1 py-6 flex flex-col gap-2 overflow-y-auto hide-scrollbar px-3 relative">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`
            }
            title={collapsed ? item.name : ""}
          >
            <item.icon className={`h-5 w-5 shrink-0 transition-colors ${collapsed ? 'mx-auto' : ''}`} />
            {!collapsed && <span className="whitespace-nowrap">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

    </aside>
  );
};

export default Sidebar;
