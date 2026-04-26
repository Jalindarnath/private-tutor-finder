import { useContext } from 'react';
import { Search, Bell } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 py-4 sticky top-0 z-10 transition-all duration-300">
      <div className="flex items-center gap-4 w-full md:w-1/2 lg:w-1/3">
        {/* Placeholder for Mobile Menu Icon if needed */}
        <div className="relative w-full group hidden md:block">
          <input 
            type="text" 
            placeholder="Search subject or location..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow duration-300 shadow-sm group-hover:shadow-md"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5 group-hover:text-indigo-500 transition-colors duration-300" />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button className="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors duration-300 rounded-full hover:bg-indigo-50">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>
        
        {user ? (
          <div className="flex items-center gap-3 relative group cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-sm hover:shadow-md transition-shadow">
              {user.name.charAt(0)}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-800 leading-tight">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
              <div className="py-2">
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600">Profile</Link>
                <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">Logout</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
             <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Log in</Link>
             <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all">Sign up</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
