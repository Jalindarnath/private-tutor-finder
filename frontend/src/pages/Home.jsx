import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, LogIn, UserPlus } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col gap-12 pb-10">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-4xl p-10 md:p-16 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-sm font-medium mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>The #1 platform for private tutoring</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mt-2 mb-6">
            Master Any Subject With <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-300 to-purple-300">Expert Tutors</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100/80 mb-10 leading-relaxed font-light">
            Pick the right path to continue. Sign in as a student, tutor, or admin to reach your own dashboard after login.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/login" className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-colors duration-300 shadow-xl shadow-indigo-900/20 flex items-center gap-2 group">
              <LogIn className="w-5 h-5" />
              Sign In
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/register" className="px-8 py-4 bg-indigo-800/50 text-white border border-indigo-700 rounded-2xl font-bold text-lg hover:bg-indigo-800 transition-colors duration-300 backdrop-blur-sm flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Sign Up
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
