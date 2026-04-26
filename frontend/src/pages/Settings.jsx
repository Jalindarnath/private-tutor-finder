import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Settings = () => {
  const { user } = useContext(AuthContext);

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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input type="text" defaultValue={user.name} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input type="email" defaultValue={user.email} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none" />
              </div>
            </div>
            
            {user.role === 'tutor' && (
               <>
                 <hr className="my-6 border-gray-100" />
                 <h3 className="text-lg font-bold text-gray-900 mb-4">Tutor Profile Settings</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Rate (₹)</label>
                     <input type="number" placeholder="5000" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none" />
                   </div>
                   <div>
                     <label className="block text-sm font-semibold text-gray-700 mb-2">Subjects (comma separated)</label>
                     <input type="text" placeholder="Math, Physics" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none" />
                   </div>
                   <div className="col-span-full">
                     <label className="block text-sm font-semibold text-gray-700 mb-2">Experience & Bio</label>
                     <textarea rows="3" placeholder="I have 5 years teaching..." className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"></textarea>
                   </div>
                 </div>
               </>
            )}

            <div className="pt-4 mt-6 border-t border-gray-50">
               <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-md">
                 Save Changes
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
