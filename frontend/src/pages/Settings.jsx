import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Settings = () => {
  const { user, setUser } = useContext(AuthContext);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    parentPhoneNumber: '',
    password: '',
    subjects: '',
    experience: '',
    qualification: '',
    monthlyRate: '',
    bio: '',
    location: '',
    languages: '',
    teachingMode: 'Both',
    welcomeMessage: ''
  });

  useEffect(() => {
    if (!user) return;
    const tutorProfile = user.tutorProfile || {};
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      parentPhoneNumber: user.parentPhoneNumber || '',
      password: '',
      subjects: (tutorProfile.subjects || []).join(', '),
      experience: tutorProfile.experience || '',
      qualification: tutorProfile.qualification || '',
      monthlyRate: tutorProfile.monthlyRate || '',
      bio: tutorProfile.bio || '',
      location: tutorProfile.location || '',
      languages: (tutorProfile.languages || []).join(', '),
      teachingMode: tutorProfile.teachingMode || 'Both',
      welcomeMessage: tutorProfile.welcomeMessage || ''
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      setSaving(true);
      setMessage('');
      const payload = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        parentPhoneNumber: formData.parentPhoneNumber
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (user.role === 'tutor') {
        payload.subjects = formData.subjects.split(',').map((item) => item.trim()).filter(Boolean);
        payload.experience = formData.experience;
        payload.qualification = formData.qualification;
        payload.monthlyRate = formData.monthlyRate ? Number(formData.monthlyRate) : undefined;
        payload.bio = formData.bio;
        payload.location = formData.location;
        payload.languages = formData.languages.split(',').map((item) => item.trim()).filter(Boolean);
        payload.teachingMode = formData.teachingMode;
        payload.welcomeMessage = formData.welcomeMessage;
      }

      const res = await api.put('/auth/profile', payload);
      setUser(res.data);
      setMessage('Profile updated successfully.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences and profile.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Information</h2>
        
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold transition-colors">
                  Change Avatar
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="settings-name" className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input id="settings-name" name="name" type="text" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none" />
              </div>
              <div>
                <label htmlFor="settings-email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input id="settings-email" name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none" />
              </div>
              <div>
                <label htmlFor="settings-phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input id="settings-phone" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none" />
              </div>
              {user.role === 'student' && (
                <div>
                  <label htmlFor="settings-parent-phone" className="block text-sm font-semibold text-gray-700 mb-2">Parent Phone Number</label>
                  <input id="settings-parent-phone" name="parentPhoneNumber" type="tel" value={formData.parentPhoneNumber} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none" />
                </div>
              )}
              <div>
                <label htmlFor="settings-password" className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <input id="settings-password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Leave empty to keep existing" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none" />
              </div>
            </div>
            
            {user.role === 'tutor' && (
               <>
                 <hr className="my-6 border-gray-100" />
                 <h3 className="text-lg font-bold text-gray-900 mb-4">Tutor Profile Settings</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label htmlFor="settings-rate" className="block text-sm font-semibold text-gray-700 mb-2">Monthly Rate (₹)</label>
                     <input id="settings-rate" name="monthlyRate" type="number" value={formData.monthlyRate} onChange={handleChange} placeholder="5000" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none" />
                   </div>
                   <div>
                     <label htmlFor="settings-subjects" className="block text-sm font-semibold text-gray-700 mb-2">Subjects (comma separated)</label>
                     <input id="settings-subjects" name="subjects" type="text" value={formData.subjects} onChange={handleChange} placeholder="Math, Physics" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none" />
                   </div>
                   <div>
                     <label htmlFor="settings-experience" className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
                     <input id="settings-experience" name="experience" type="text" value={formData.experience} onChange={handleChange} placeholder="5 years" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none" />
                   </div>
                   <div>
                     <label htmlFor="settings-qualification" className="block text-sm font-semibold text-gray-700 mb-2">Qualification</label>
                     <input id="settings-qualification" name="qualification" type="text" value={formData.qualification} onChange={handleChange} placeholder="M.Sc" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none" />
                   </div>
                   <div>
                     <label htmlFor="settings-languages" className="block text-sm font-semibold text-gray-700 mb-2">Languages (comma separated)</label>
                     <input id="settings-languages" name="languages" type="text" value={formData.languages} onChange={handleChange} placeholder="English, Hindi" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none" />
                   </div>
                   <div>
                     <label htmlFor="settings-mode" className="block text-sm font-semibold text-gray-700 mb-2">Teaching Mode</label>
                     <select id="settings-mode" name="teachingMode" value={formData.teachingMode} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none">
                       <option value="Both">Both</option>
                       <option value="Online">Online</option>
                       <option value="Offline">Offline</option>
                     </select>
                   </div>
                   <div className="col-span-full">
                     <label htmlFor="settings-location" className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                     <input id="settings-location" name="location" type="text" value={formData.location} onChange={handleChange} placeholder="Pune" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none" />
                   </div>
                   <div className="col-span-full">
                     <label htmlFor="settings-bio" className="block text-sm font-semibold text-gray-700 mb-2">Experience & Bio</label>
                     <textarea id="settings-bio" name="bio" rows="3" value={formData.bio} onChange={handleChange} placeholder="I have 5 years teaching..." className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"></textarea>
                   </div>
                   <div className="col-span-full">
                     <label htmlFor="settings-welcome" className="block text-sm font-semibold text-gray-700 mb-2">Default Welcome Message</label>
                     <textarea id="settings-welcome" name="welcomeMessage" rows="3" value={formData.welcomeMessage} onChange={handleChange} placeholder="Welcome! Excited to help you achieve your learning goals." className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"></textarea>
                   </div>
                 </div>
               </>
            )}

            {message && (
              <p className="text-sm font-medium text-gray-600 mt-3">{message}</p>
            )}

            <div className="pt-4 mt-6 border-t border-gray-50">
               <button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-md disabled:opacity-60">
                 {saving ? 'Saving...' : 'Save Changes'}
               </button>
            </div>
          </div>
        ) : (
          <p>Please log in.</p>
        )}
      </div>
    </div>
  );
};

export default Settings;
