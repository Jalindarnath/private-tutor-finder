import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, ArrowRight } from 'lucide-react';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 py-10">
      <div className="w-full max-w-md bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-indigo-100/50 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        
        <div className="flex justify-center mb-8 gap-3 items-center">
           <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
             <GraduationCap className="w-7 h-7" />
           </div>
           <span className="text-2xl font-black text-gray-900 tracking-tight">TutorFind</span>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-8">Join our community of learners and educators.</p>
        
        {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-xl mb-6 text-sm font-medium border border-rose-100">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all"
                placeholder="John Doe"
              />
              <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all"
                placeholder="john@example.com"
              />
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all"
                placeholder="••••••••"
              />
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-2">I want to...</label>
             <div className="grid grid-cols-2 gap-3">
               <button 
                 type="button"
                 onClick={() => setFormData({...formData, role: 'student'})}
                 className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                   formData.role === 'student' 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                 }`}
               >
                 Find a Tutor
               </button>
               <button 
                 type="button"
                 onClick={() => setFormData({...formData, role: 'tutor'})}
                 className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                   formData.role === 'tutor' 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                 }`}
               >
                 Become a Tutor
               </button>
             </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-indigo-600 text-white font-bold py-3.5 rounded-xl transition-colors duration-300 shadow-md flex items-center justify-center gap-2 group mt-4"
          >
            {loading ? 'Creating account...' : 'Create Account'}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 font-medium">
          Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-bold">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
