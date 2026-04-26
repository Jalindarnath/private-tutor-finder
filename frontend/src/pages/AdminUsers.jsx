import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Trash2 } from 'lucide-react';

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    if (user?.role === 'admin') fetchUsers();
  }, [user]);

  if (loading) return <div>Loading Users...</div>;

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Users Management</h1>
        <p className="text-gray-500 mt-1">Review all registered students and tutors.</p>
      </div>

      <div className="bg-white border text-gray-900 border-gray-100 shadow-sm rounded-3xl overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-bold">Name</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">Role</th>
                <th className="p-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
               {users.map(u => (
                 <tr key={u._id} className="hover:bg-gray-50/50 transition">
                   <td className="p-4 font-semibold flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                        {u.name.charAt(0)}
                     </div>
                     {u.name}
                   </td>
                   <td className="p-4 text-gray-600">{u.email}</td>
                   <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold capitalize ${u.role === 'tutor' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span>
                   </td>
                   <td className="p-4 text-center">
                     <button className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition" title="Delete User">
                       <Trash2 className="w-4 h-4"/>
                     </button>
                   </td>
                 </tr>
               ))}
               {users.length === 0 && (
                 <tr>
                   <td colSpan="4" className="p-8 text-center text-gray-500">No users found.</td>
                 </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default AdminUsers;
