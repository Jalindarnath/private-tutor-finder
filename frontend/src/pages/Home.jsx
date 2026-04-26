import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TutorCard from '../components/TutorCard';
import { Sparkles, ArrowRight, Shield, Award, Users } from 'lucide-react';

const Home = () => {
  const [featuredTutors, setFeaturedTutors] = useState([]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await api.get('/tutors');
        setFeaturedTutors(res.data.slice(0, 3)); // Dummy featured logic
      } catch (error) {
        console.error(error);
      }
    };
    fetchTutors();
  }, []);

  return (
    <div className="flex flex-col gap-12 pb-10">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-[2rem] p-10 md:p-16 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-sm font-medium mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>The #1 platform for private tutoring</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mt-2 mb-6">
            Master Any Subject With <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Expert Tutors</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100/80 mb-10 leading-relaxed font-light">
            Connect with top-rated tutors worldwide. Accelerate your learning journey with personalized 1-on-1 sessions tailored to your goals.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/find-tutors" className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-colors duration-300 shadow-xl shadow-indigo-900/20 flex items-center gap-2 group">
              Find a Tutor
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/register" className="px-8 py-4 bg-indigo-800/50 text-white border border-indigo-700 rounded-2xl font-bold text-lg hover:bg-indigo-800 transition-colors duration-300 backdrop-blur-sm">
              Become a Tutor
            </Link>
          </div>
        </div>
      </section>

      {/* Stats/Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-gray-900">10,000+</h4>
            <p className="text-gray-500 font-medium text-sm">Active Students</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-gray-900">Verified</h4>
            <p className="text-gray-500 font-medium text-sm">Expert Tutors</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-gray-900">4.9/5</h4>
            <p className="text-gray-500 font-medium text-sm">Average Rating</p>
          </div>
        </div>
      </section>

      {/* Tutors */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Top Rated Tutors</h2>
            <p className="text-gray-500">Learn from the very best professionals.</p>
          </div>
          <Link to="/find-tutors" className="hidden md:flex text-indigo-600 font-semibold hover:text-indigo-800 items-center gap-1 group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {featuredTutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTutors.map(tutor => (
              <TutorCard key={tutor._id} tutor={tutor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-500">Loading amazing tutors...</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
