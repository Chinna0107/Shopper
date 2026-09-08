import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Share2, CheckCircle2, Users, Wallet, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../utils/api';

export function ReferPage() {
  const [copiedFriend, setCopiedFriend] = useState(false);
  const [copiedStore, setCopiedStore] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(50);
  const { token, user, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (token && (!user || !user.referral_code)) {
      fetchProfile();
    }
    
    // Fetch current referral amount
    api.get('/general/settings/referral_amount')
      .then(res => {
        if (res.data && res.data.amount) {
          setRewardAmount(res.data.amount);
        }
      })
      .catch(err => console.error("Could not fetch referral amount:", err));
  }, [token, user, fetchProfile]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Use the unique referral code from the database, fallback to a placeholder while loading
  const friendCode = user?.referral_code || "LOADING...";
  const storeCode = user?.referral_code || "LOADING...";

  const handleCopyFriend = () => {
    navigator.clipboard.writeText(friendCode);
    setCopiedFriend(true);
    toast.success("Friend referral code copied!");
    setTimeout(() => setCopiedFriend(false), 2000);
  };

  const handleCopyStore = () => {
    navigator.clipboard.writeText(storeCode);
    setCopiedStore(true);
    toast.success("Store referral code copied!");
    setTimeout(() => setCopiedStore(false), 2000);
  };

  const steps = [
    { title: "Share Code", desc: "Share your unique link or code with friends.", icon: Share2 },
    { title: "Friend Signs Up", desc: "They get a special discount on their first order.", icon: Users },
    { title: "Vendor Commissions 🚀", desc: "Refer a vendor and earn a lifetime commission on every single product they sell!", icon: TrendingUp },
    { title: "Your Earnings ", desc: `Once they complete their order, you get the amount to your wallet.`, icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Banner */}
      <div className="bg-[#0b162c] pt-12 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#012980] to-[#0b162c] opacity-90"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-yellow-400/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-[60px]"></div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
          <Gift className="w-64 h-64 text-white" />
        </div>
        <div className="max-w-2xl mx-auto relative z-10 text-center">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-5 border border-white/20">
              <Gift className="w-8 h-8 text-yellow-400" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-md">
              Refer & Earn <span className="text-yellow-400"></span>
            </h1>
            <p className="text-white/80 text-lg">Give your friends a treat, and get rewarded with the amount when they shop with us.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-16 relative z-20">
        {/* Friend Referral Code Card */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 md:p-8 border border-gray-100">
          <h2 className="text-xl font-extrabold text-[#0b162c] mb-6 text-center">Refer to your friend</h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full bg-gray-50 border-2 border-dashed border-[#0b162c]/30 rounded-2xl p-4 flex items-center justify-between group hover:border-[#0b162c]/60 transition-colors">
              <span className="text-2xl font-black text-[#0b162c] tracking-widest">{friendCode}</span>
              <button onClick={handleCopyFriend} className="p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group-hover:-translate-y-0.5">
                {copiedFriend ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-500" />}
              </button>
            </div>
            <button className="w-full md:w-auto bg-gradient-to-r from-[#0b162c] to-[#1a2d52] text-white font-bold py-4 px-8 rounded-2xl shadow-[0_4px_20px_rgba(11,22,44,0.3)] hover:shadow-[0_8px_30px_rgba(11,22,44,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5" /> Share Link
            </button>
          </div>
        </motion.div>
        
        {/* Store Referral Code Card */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
          className="mt-6 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 md:p-8 border border-gray-100">
          <h2 className="text-xl font-extrabold text-[#0b162c] mb-6 text-center">Refer to a new store</h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full bg-orange-50 border-2 border-dashed border-[#f36b21]/30 rounded-2xl p-4 flex items-center justify-between group hover:border-[#f36b21]/60 transition-colors">
              <span className="text-2xl font-black text-[#f36b21] tracking-widest">{storeCode}</span>
              <button onClick={handleCopyStore} className="p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group-hover:-translate-y-0.5">
                {copiedStore ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-500" />}
              </button>
            </div>
            <button className="w-full md:w-auto bg-gradient-to-r from-[#f36b21] to-[#e05a18] text-white font-bold py-4 px-8 rounded-2xl shadow-[0_4px_20px_rgba(243,107,33,0.3)] hover:shadow-[0_8px_30px_rgba(243,107,33,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5" /> Share Link
            </button>
          </div>
        </motion.div>
        

        {/* How it works */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="mt-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 md:p-8 border border-gray-100">
          <h3 className="text-lg font-extrabold text-[#0b162c] mb-6 text-center">How It Works</h3>
          <div className="space-y-6">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0b162c]/5 rounded-2xl flex items-center justify-center shrink-0 border border-[#0b162c]/10">
                  <step.icon className="w-5 h-5 text-[#0b162c]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0b162c] text-[15px]">{step.title}</h4>
                  <p className="text-gray-500 text-sm mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Stats */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 text-center flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-full blur-xl -mr-4 -mt-4"></div>
            <p className="text-sm font-bold text-gray-500 mb-1 relative z-10">Total Referrals</p>
            <p className="text-3xl font-black text-[#0b162c] relative z-10">0</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 text-center flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-full blur-xl -mr-4 -mt-4"></div>
            <p className="text-sm font-bold text-gray-500 mb-1 relative z-10">Total Earned</p>
            <p className="text-3xl font-black text-green-500 relative z-10">₹0</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
