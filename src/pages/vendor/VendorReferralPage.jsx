import React, { useState, useEffect } from 'react';
import { Users, Copy, TrendingUp, Gift, Share2 } from 'lucide-react';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export function VendorReferralPage() {
  const [vendor, setVendor] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('vendor_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    const fetchWallet = fetch(`${BACKEND_URL}/vendorAuth/me`, { headers }).then(r => r.json());
    const fetchReferrals = fetch(`${BACKEND_URL}/vendor/referrals`, { headers }).then(r => r.json()).catch(() => ({ referrals: [] }));

    Promise.all([fetchWallet, fetchReferrals])
      .then(([walletData, refData]) => {
        if (walletData.vendor) setVendor(walletData.vendor);
        setReferrals(refData.referrals || []);
      })
      .catch(() => toast.error('Failed to load referral data'))
      .finally(() => setLoading(false));
  }, []);

  const copyToClipboard = () => {
    if (vendor?.referral_code) {
      navigator.clipboard.writeText(vendor.referral_code);
      toast.success('Referral code copied to clipboard!');
    } else {
      toast.error('No referral code available');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Refer & Earn</h1>
          <p className="text-gray-500 mt-1.5 font-medium">Invite vendors or customers and earn rewards.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#012980] to-[#036e26] p-8 rounded-[24px] text-white shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Gift className="w-8 h-8 text-white/90" />
              <h2 className="text-2xl font-bold">Your Referral Code</h2>
            </div>
            <p className="text-white/80 mb-6">Share this code with your network and earn commission on their successful signups and sales.</p>
            
            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
              <span className="text-3xl font-extrabold tracking-wider flex-1 text-center">
                {loading ? '...' : (vendor?.referral_code || 'N/A')}
              </span>
              <div className="flex gap-2">
                <button onClick={copyToClipboard} className="p-3 bg-white text-[#012980] rounded-lg hover:bg-gray-50 transition-colors shadow-sm" title="Copy Code">
                  <Copy className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => {
                    const code = vendor?.referral_code || 'N/A';
                    const text = `Use my referral code ${code} to sign up and get rewards!`;
                    if (navigator.share) {
                      navigator.share({ title: 'Referral Code', text }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(text);
                      toast.success("Share text copied!");
                    }
                  }}
                  className="p-3 bg-white text-[#012980] rounded-lg hover:bg-gray-50 transition-colors shadow-sm" 
                  title="Share Code"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#012980]">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <p className="text-gray-500 font-medium">Total Referrals</p>
              <h3 className="text-3xl font-extrabold text-gray-900">{referrals.length}</h3>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-gray-500 font-medium">Active Referred Users</p>
              <h3 className="text-3xl font-extrabold text-gray-900">{referrals.filter(r => r.status === 'active').length || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 mt-8 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <Users className="w-5 h-5 text-gray-600" />
          <h3 className="text-xl font-bold text-gray-900">Referred Users</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : referrals.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-200" />
            <p className="text-gray-500 font-medium text-lg">No referrals yet</p>
            <p className="text-sm mt-2 max-w-md mx-auto">Share your referral code to start earning rewards when people sign up.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {referrals.map((ref, i) => (
              <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-bold text-gray-900 text-base">{ref.name}</p>
                  <p className="text-sm font-medium text-gray-500">{ref.email}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {ref.status || 'Active'}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">Joined {new Date(ref.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
