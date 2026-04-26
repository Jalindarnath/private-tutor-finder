import { useState, useEffect } from 'react';
import api from '../services/api';
import TutorCard from '../components/TutorCard';
import { Filter, SlidersHorizontal } from 'lucide-react';

const FindTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ subject: '', minPrice: '', maxPrice: '', rating: '' });

  useEffect(() => {
    async function fetchTutors() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(filters).toString();
        const res = await api.get(`/tutors?${queryParams}`);
        setTutors(res.data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }
    fetchTutors();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <h1 className="text-3xl font-black text-gray-900">Find Tutors</h1>
        <p className="text-gray-500 mt-1">Discover millions of experts worldwide.</p>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end glassmorphism">
        <div className="w-full md:w-1/4">
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Subject</label>
          <div className="relative">
             <input 
               type="text" 
               name="subject" 
               value={filters.subject} 
               onChange={handleFilterChange} 
               placeholder="E.g. Math, React" 
               className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
             />
          </div>
        </div>
        <div className="w-full md:w-1/4 flex gap-2">
          <div className="w-1/2">
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Min ₹</label>
            <input 
              type="number" 
              name="minPrice" 
              value={filters.minPrice} 
              onChange={handleFilterChange} 
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Max ₹</label>
            <input 
              type="number" 
              name="maxPrice" 
              value={filters.maxPrice} 
              onChange={handleFilterChange} 
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>
        <div className="w-full md:w-1/4">
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Min Rating</label>
          <select 
            name="rating" 
            value={filters.rating} 
            onChange={handleFilterChange} 
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
        
        <button className="w-full md:w-auto bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 h-[42px] whitespace-nowrap">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
             <div key={i} className="bg-white rounded-3xl p-5 border border-gray-100 h-64 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
             </div>
          ))}
        </div>
      ) : tutors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map(tutor => (
            <TutorCard key={tutor._id} tutor={tutor} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200 flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
             <SlidersHorizontal className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No tutors found</h3>
          <p className="text-gray-500 max-w-md">Try adjusting your filters or search terms to find what you're looking for.</p>
          <button 
            onClick={() => setFilters({ subject: '', minPrice: '', maxPrice: '', rating: '' })}
            className="mt-6 text-indigo-600 font-semibold hover:text-indigo-800"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FindTutors;
