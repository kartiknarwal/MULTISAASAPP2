import React, { useEffect, useState } from 'react';
import { Gem, Sparkles } from 'lucide-react';
import { Protect } from '@clerk/clerk-react';
import CreationItem from '../components/CreationItem';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) setCreations(data.creations);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className='h-full overflow-y-scroll p-8 bg-[#0F0F0F] font-mono text-white'>
      <div className='flex flex-wrap gap-6 justify-start'>
        {/* Total creations card */}
        <div className='flex justify-between items-center w-72 p-6 bg-[#111111] rounded-2xl shadow-[0_0_20px_#FF3C9E] hover:shadow-[0_0_30px_#FF3C9E] transition-all duration-500'>
          <div>
            <p className='text-sm text-[#00FFD1] tracking-wide'>TOTAL CREATIONS</p>
            <h2 className='text-2xl font-bold text-[#FF3C9E] glow'>{creations.length}</h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF3C9E] to-[#00FFD1] flex justify-center items-center shadow-[0_0_15px_#FF3C9E]">
            <Sparkles className='w-6 h-6 text-black' />
          </div>
        </div>

        {/* Active plan card */}
        <div className='flex justify-between items-center w-72 p-6 bg-[#111111] rounded-2xl shadow-[0_0_20px_#FF8C42] hover:shadow-[0_0_30px_#FF8C42] transition-all duration-500'>
          <div>
            <p className='text-sm text-[#FF8C42] tracking-wide'>ACTIVE PLAN</p>
            <h2 className='text-2xl font-bold text-[#9B4DFF]'>
              <Protect plan='premium' fallback="Free">Premium</Protect>
            </h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF8C42] to-[#9B4DFF] flex justify-center items-center shadow-[0_0_15px_#FF8C42]">
            <Gem className='w-6 h-6 text-black' />
          </div>
        </div>
      </div>

      {/* Recent Creations */}
      <div className='mt-10'>
        <p className='text-lg font-semibold text-[#00FFD1] mb-4 tracking-wide glow'>RECENT CREATIONS</p>
        {loading ? (
          <div className='flex justify-center items-center h-96'>
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#FF3C9E] border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {creations.map((item) => (
              <CreationItem key={item.id} item={item} cyberpunk />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
