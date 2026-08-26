import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, CreditCard, Gift, ShieldCheck } from 'lucide-react';

export function WalletPage() {
  const balance = 1240;
  const points = 2450;

  const transactions = [
    { id: 1, type: 'credit', title: 'Cashback on Order #4521', date: 'Oct 24, 2023', amount: 150, status: 'success' },
    { id: 2, type: 'debit', title: 'Payment for Order #4510', date: 'Oct 20, 2023', amount: -450, status: 'success' },
    { id: 3, type: 'credit', title: 'Referral Bonus (A501)', date: 'Oct 15, 2023', amount: 501, status: 'success' },
    { id: 4, type: 'credit', title: 'Welcome Bonus', date: 'Oct 01, 2023', amount: 100, status: 'success' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-4 px-4 md:px-8 max-w-[800px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-orange-50 border border-brand-orange/20 flex items-center justify-center shadow-sm">
          <Wallet className="w-6 h-6 text-brand-orange" />
        </div>
        <h1 className="text-3xl font-bold text-[#0b162c] font-serif" style={{ fontFamily: 'Georgia, serif' }}>My Wallet</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#0b162c] to-[#15284b] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Wallet className="w-32 h-32" strokeWidth={1} />
          </div>
          <p className="text-sm text-gray-300 font-medium tracking-wider uppercase mb-1">Available Balance</p>
          <h2 className="text-5xl font-extrabold mb-4 font-serif text-brand-orange" style={{ fontFamily: 'Georgia, serif' }}>₹{balance.toLocaleString()}</h2>
          
          <div className="flex gap-3 mt-6">
            <button className="flex-1 bg-brand-orange hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-sm">
              Add Money
            </button>
            <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
              Send to Bank
            </button>
          </div>
        </div>

        {/* <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Gift className="w-24 h-24" />
          </div>
          <p className="text-sm text-purple-200 font-medium tracking-wide uppercase mb-1">Reward Balance</p>
          <h2 className="text-4xl font-extrabold mb-4 font-serif">₹{points.toLocaleString()}</h2>
          
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-purple-200">Earn more rewards by shopping and referring friends.</p>
          </div>
        </div> */}
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-[#0b162c] flex items-center gap-2 font-serif" style={{ fontFamily: 'Georgia, serif' }}>
            <span className="w-1.5 h-6 bg-brand-orange rounded-full inline-block shadow-sm"></span>
            Recent Transactions
          </h3>
          <button className="text-sm font-bold text-brand-orange hover:text-orange-700 bg-orange-50 px-4 py-1.5 rounded-full transition-colors">View All</button>
        </div>

        <div className="space-y-4">
          {transactions.map(txn => (
            <div key={txn.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {txn.type === 'credit' ? (
                    <ArrowDownLeft className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[#0b162c]">{txn.title}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    {txn.date}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-lg font-extrabold ${txn.type === 'credit' ? 'text-green-600' : 'text-[#0b162c]'}`}>
                  {txn.type === 'credit' ? '+' : ''}₹{Math.abs(txn.amount)}
                </span>
                <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400 mt-0.5 font-medium uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-green-500" />
                  {txn.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
