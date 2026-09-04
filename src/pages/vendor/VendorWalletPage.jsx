import React, { useState, useEffect } from 'react';
import { Wallet, IndianRupee, Landmark, ArrowUpRight, ArrowDownLeft, Clock, Users } from 'lucide-react';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export function VendorWalletPage() {
  const [vendor, setVendor] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('vendor_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    const fetchWallet = fetch(`${BACKEND_URL}/vendorAuth/me`, { headers }).then(r => r.json());
    const fetchTxns = fetch(`${BACKEND_URL}/vendor/transactions`, { headers }).then(r => r.json());
    const fetchReferrals = fetch(`${BACKEND_URL}/vendor/referrals`, { headers }).then(r => r.json()).catch(() => ({ referrals: [] }));

    Promise.all([fetchWallet, fetchTxns, fetchReferrals])
      .then(([walletData, txnData, refData]) => {
        if (walletData.vendor) setVendor(walletData.vendor);
        setTransactions(txnData.transactions || []);
        setReferrals(refData.referrals || []);
      })
      .catch(() => toast.error('Failed to load wallet data'))
      .finally(() => setLoading(false));
  }, []);

  const totalCredits = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  const totalDebits = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Virtual Wallet</h1>
          <p className="text-gray-500 mt-1.5 font-medium">Track your earnings, payouts, and transaction history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[#012980] to-[#e55c02] p-8 rounded-[24px] text-white shadow-[0_8px_30px_rgba(254,102,3,0.3)] relative overflow-hidden group transition-all duration-300 hover:shadow-[0_12px_40px_rgba(254,102,3,0.4)] hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-wide uppercase text-white/90">Available Balance</span>
            </div>
            <div className="flex items-baseline gap-2">
              <IndianRupee className="w-8 h-8 opacity-90" />
              <h2 className="text-5xl font-extrabold tracking-tight">
                {loading || !vendor ? '...' : parseFloat(vendor.wallet_balance || 0).toLocaleString()}
              </h2>
            </div>
          </div>
        </div>

        {/* Total Earned */}
        <div className="group bg-white p-6 rounded-[24px] shadow-sm border border-gray-100/50 flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/30 flex-shrink-0">
            <ArrowDownLeft className="w-8 h-8" />
          </div>
          <div className="z-10">
            <p className="text-sm font-bold text-gray-400 tracking-wide uppercase mb-1">Total Earned</p>
            <h3 className="text-3xl font-extrabold text-green-600 tracking-tight">
              {loading ? '...' : `₹${totalCredits.toLocaleString()}`}
            </h3>
          </div>
        </div>

        {/* Total Payouts */}
        <div className="group bg-white p-6 rounded-[24px] shadow-sm border border-gray-100/50 flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/30 flex-shrink-0">
            <ArrowUpRight className="w-8 h-8" />
          </div>
          <div className="z-10">
            <p className="text-sm font-bold text-gray-400 tracking-wide uppercase mb-1">Total Payouts</p>
            <h3 className="text-3xl font-extrabold text-red-500 tracking-tight">
              {loading ? '...' : `₹${totalDebits.toLocaleString()}`}
            </h3>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 overflow-hidden mt-8">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-3 bg-gradient-to-b from-gray-50/50 to-white">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Clock className="w-5 h-5 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Transaction History</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-200" />
            <p className="text-gray-500 font-medium">No transactions yet</p>
            <p className="text-sm text-gray-400 mt-1">Earnings from customer orders will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {transactions.map(txn => (
              <div key={txn.id} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50/80 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${txn.type === 'credit' ? 'bg-green-50 border border-green-100 text-green-600' : 'bg-red-50 border border-red-100 text-red-500'}`}>
                    {txn.type === 'credit' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base mb-1">
                      {txn.type === 'credit' ? 'Order Earning' : 'Payout'}
                    </p>
                    <p className="text-sm font-medium text-gray-500">
                      {txn.order_number && <span className="bg-gray-100 px-2 py-1 rounded-md text-gray-700 font-bold mr-2 text-xs uppercase tracking-wider">{txn.order_number}</span>}
                      {txn.description || ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-extrabold text-xl tracking-tight ${txn.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                    {txn.type === 'credit' ? '+' : '-'}₹{parseFloat(txn.amount || 0).toLocaleString()}
                  </p>
                  <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">
                    {new Date(txn.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Referred Users */}
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 overflow-hidden mt-8">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-3 bg-gradient-to-b from-gray-50/50 to-white">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Users className="w-5 h-5 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Referred Users & Earnings</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : referrals.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-200" />
            <p className="text-gray-500 font-medium">No referrals yet</p>
            <p className="text-sm text-gray-400 mt-1">Share your referral code to start earning rewards.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {referrals.map((ref, i) => (
              <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50/80 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm bg-blue-50 border border-blue-100 text-[#012980]">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base mb-1">{ref.name}</p>
                    <p className="text-sm font-medium text-gray-500">{ref.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {ref.status || 'Active'}
                  </span>
                  <p className="text-xs font-semibold text-gray-400 mt-2 uppercase tracking-wider">
                    Joined {new Date(ref.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
