import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { DollarSign, TrendingUp, CreditCard } from 'lucide-react';

const Earnings = () => {
  const { user } = useContext(AuthContext);
  const [totalEarned, setTotalEarned] = useState(0);
  const [pendingEarned, setPendingEarned] = useState(0);

  useEffect(() => {
    // In a real app we'd have a specific earnings endpoint.
    // For now we simulate by getting sessions or bookings.
    const fetchEarnings = async () => {
      try {
        const res = await api.get('/bookings');
        const accepted = res.data.filter(b => b.status === 'accepted');
        const pending = res.data.filter(b => b.status === 'pending');
        
        // Simulating earnings logic (usually joined with tutor's monthly rate)
        // Without an explicit earnings API, generating a mock stat based on length
        // A single session = approx rate/some value. Let's just mock a fixed value for demo since price varies
        const RATE = 3500; 
        setTotalEarned(accepted.length * (RATE/4)); // Roughly weekly split
        setPendingEarned(pending.length * (RATE/4));
      } catch (error) {
        console.error(error);
      }
    };
    if(user.role === 'tutor') fetchEarnings();
  }, [user]);

  if (user.role !== 'tutor') return <div>Only tutors can view earnings.</div>;

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="mb-2">
        <h1 className="text-3xl font-black text-gray-900">Your Earnings</h1>
        <p className="text-gray-500 mt-1">Track your financial progress and payouts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
           <DollarSign className="w-10 h-10 bg-white/20 p-2 rounded-2xl mb-4" />
           <p className="text-indigo-100 font-semibold mb-1 uppercase tracking-wider text-sm">Estimated Total Earnings</p>
           <h2 className="text-5xl font-black mb-2">₹{totalEarned}</h2>
           <p className="text-sm text-indigo-200">Based on accepted & completed classes.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-center">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
               <TrendingUp className="w-6 h-6"/>
             </div>
             <div>
               <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Pending Revenue</p>
               <h3 className="text-2xl font-bold text-gray-900">₹{pendingEarned}</h3>
             </div>
           </div>
           <p className="text-sm text-gray-500 mt-2">Revenue from sessions that are not yet accepted or completed.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mt-4 text-center text-gray-500 flex flex-col items-center">
         <CreditCard className="w-16 h-16 mb-4 text-gray-300" />
         <h3 className="text-lg font-bold text-gray-800 mb-2">Payout Configuration</h3>
         <p className="max-w-md mx-auto">Set up your bank account details to receive your monthly earnings directly to your Indian bank account.</p>
         <button className="mt-6 px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition">Configure Bank Details</button>
      </div>
    </div>
  );
};

export default Earnings;
