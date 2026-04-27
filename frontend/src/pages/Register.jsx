import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, ArrowRight } from 'lucide-react';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    phoneNumber: '',
    parentPhoneNumber: '',
    subjects: '',
    experience: '',
    qualification: '',
    monthlyRate: '',
    location: '',
    bio: '',
    languages: '',
    teachingMode: 'Both'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phoneNumber: formData.phoneNumber,
        parentPhoneNumber: formData.parentPhoneNumber
      };

      if (formData.role === 'tutor') {
        payload.subjects = formData.subjects.split(',').map((item) => item.trim()).filter(Boolean);
        payload.experience = formData.experience;
        payload.qualification = formData.qualification;
        payload.monthlyRate = formData.monthlyRate ? Number(formData.monthlyRate) : undefined;
        payload.location = formData.location;
        payload.bio = formData.bio;
        payload.languages = formData.languages.split(',').map((item) => item.trim()).filter(Boolean);
        payload.teachingMode = formData.teachingMode;
      }

      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 py-10">
      <div className="w-full max-w-md bg-white rounded-4xl p-8 md:p-10 shadow-2xl shadow-indigo-100/50 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-indigo-500 to-purple-500"></div>
        
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
            <label htmlFor="register-name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <input 
                id="register-name"
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
            <label htmlFor="register-email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <input 
                id="register-email"
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
            <label htmlFor="register-phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <div className="relative">
              <input
                id="register-phone"
                type="tel"
                required={formData.role === 'tutor'}
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all"
                placeholder="+91 9876543210"
              />
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {formData.role === 'student' && (
            <div>
              <label htmlFor="register-parent-phone" className="block text-sm font-semibold text-gray-700 mb-2">Parent Phone Number</label>
              <div className="relative">
                <input
                  id="register-parent-phone"
                  type="tel"
                  required
                  value={formData.parentPhoneNumber}
                  onChange={(e) => setFormData({ ...formData, parentPhoneNumber: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all"
                  placeholder="+91 Parent number"
                />
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
          )}
          <div>
             <label htmlFor="register-password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input 
                id="register-password"
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
             <p className="block text-sm font-semibold text-gray-700 mb-2">I want to...</p>
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

          {formData.role === 'tutor' && (
            <div className="grid grid-cols-1 gap-4 border border-indigo-100 bg-indigo-50/40 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-indigo-700">Tutor Details</h3>
              <div>
                <label htmlFor="register-subjects" className="block text-sm font-semibold text-gray-700 mb-2">Subjects (comma separated)</label>
                <input
                  id="register-subjects"
                  type="text"
                  required
                  value={formData.subjects}
                  onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="Math, Science, English"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="register-experience" className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
                  <input
                    id="register-experience"
                    type="text"
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="5 years"
                  />
                </div>
                <div>
                  <label htmlFor="register-qualification" className="block text-sm font-semibold text-gray-700 mb-2">Qualification</label>
                  <input
                    id="register-qualification"
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="M.Sc Physics"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="register-monthly-rate" className="block text-sm font-semibold text-gray-700 mb-2">Monthly Rate (INR)</label>
                  <input
                    id="register-monthly-rate"
                    type="number"
                    value={formData.monthlyRate}
                    onChange={(e) => setFormData({ ...formData, monthlyRate: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label htmlFor="register-teaching-mode" className="block text-sm font-semibold text-gray-700 mb-2">Teaching Mode</label>
                  <select
                    id="register-teaching-mode"
                    value={formData.teachingMode}
                    onChange={(e) => setFormData({ ...formData, teachingMode: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="Both">Both</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="register-languages" className="block text-sm font-semibold text-gray-700 mb-2">Languages (comma separated)</label>
                <input
                  id="register-languages"
                  type="text"
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="English, Hindi"
                />
              </div>
              <div>
                <label htmlFor="register-location" className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  id="register-location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="Pune"
                />
              </div>
              <div>
                <label htmlFor="register-bio" className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                <textarea
                  id="register-bio"
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="Share your teaching style and strengths"
                />
              </div>
            </div>
          )}
          
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
