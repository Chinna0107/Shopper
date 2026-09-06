import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, CreditCard, ShieldCheck, History, X, Plus } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../utils/api';

export function WalletPage() {
  const navigate = useNavigate();
  const { user, fetchProfile } = useAuthStore();
  const balance = user?.wallet_balance ? parseFloat(user.wallet_balance) : 0;
  
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showAddBank, setShowAddBank] = useState(false);
  const [savedBanks, setSavedBanks] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [redeemAmount, setRedeemAmount] = useState('');
  const [selectedBankId, setSelectedBankId] = useState(null);
  
  const [newBank, setNewBank] = useState({
    account_name: '',
    account_number: '',
    ifsc_code: '',
    bank_name: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [banksRes, payoutsRes] = await Promise.all([
        api.get('/wallet/banks'),
        api.get('/wallet/payouts')
      ]);
      setSavedBanks(banksRes.data || []);
      setPayouts(payoutsRes.data || []);
      if (banksRes.data && banksRes.data.length > 0) {
        setSelectedBankId(banksRes.data[0].id);
      }
    } catch (err) {
      console.error("Error fetching wallet data", err);
    }
  };

  const handleAddBank = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/wallet/banks', newBank);
      setSavedBanks([res.data, ...savedBanks]);
      setSelectedBankId(res.data.id);
      setShowAddBank(false);
      setNewBank({ account_name: '', account_number: '', ifsc_code: '', bank_name: '' });
      toast.success("Bank account saved successfully");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save bank");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRedeem = async () => {
    const amount = parseFloat(redeemAmount);
    if (!amount || amount <= 0) return toast.error("Enter a valid amount");
    if (amount > balance) return toast.error("Insufficient balance");
    if (!selectedBankId) return toast.error("Select a bank account");

    const selectedBank = savedBanks.find(b => b.id === selectedBankId);
    
    setIsSubmitting(true);
    try {
      await api.post('/wallet/payout', {
        amount,
        bank_details: {
          account_name: selectedBank.account_name,
          account_number: selectedBank.account_number,
          ifsc_code: selectedBank.ifsc_code,
          bank_name: selectedBank.bank_name
        }
      });
      toast.success("Payout request submitted successfully");
      setShowRedeemModal(false);
      setRedeemAmount('');
      fetchProfile(); // update balance
      fetchData(); // update payout history
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to request payout");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-4 px-4 md:px-8 max-w-[800px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-50 border border-brand-navy/20 flex items-center justify-center shadow-sm">
          <Wallet className="w-6 h-6 text-brand-navy" />
        </div>
        <h1 className="text-3xl font-bold text-[#0b162c] font-serif" style={{ fontFamily: 'Georgia, serif' }}>My Wallet</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-3xl p-6 md:p-8 text-gray-900 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
            <Wallet className="w-32 h-32 text-yellow-700" strokeWidth={1} />
          </div>
          <p className="text-sm text-yellow-900/80 font-bold tracking-wider uppercase mb-1">Available Balance</p>
          <h2 className="text-5xl font-extrabold mb-4 font-serif text-[#0b162c]" style={{ fontFamily: 'Georgia, serif' }}>₹{balance.toLocaleString()}</h2>
          
          <div className="flex gap-3 mt-6">
            <button 
              onClick={() => navigate('/category/all')} 
              className="flex-1 bg-white/20 hover:bg-white/30 border border-white/40 text-yellow-900 font-bold py-3 rounded-xl text-sm transition-all backdrop-blur-sm"
            >
              Shop Now
            </button>
            <button 
              onClick={() => setShowRedeemModal(true)} 
              className="flex-1 bg-[#0b162c] hover:bg-blue-900 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md"
            >
              Redeem to Bank
            </button>
          </div>
        </div>
      </div>

      {/* Referral Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 md:p-8 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <ShieldCheck className="w-40 h-40 text-blue-900" />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-[#0b162c] mb-2 font-serif">Refer & Earn 1% Commission</h3>
          <p className="text-sm text-gray-600 mb-6 max-w-md">Share your unique referral code with friends. When they sign up and place an order, <span className="font-bold text-brand-navy">1% of their order value</span> will be instantly added to your wallet!</p>
          
          <div className="bg-white p-4 rounded-2xl border border-gray-200 inline-flex items-center gap-4 shadow-sm">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Your Referral Code</p>
              <p className="text-2xl font-extrabold text-brand-navy tracking-wider">{user?.referral_code || 'COMINGSOON'}</p>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(user?.referral_code || 'COMINGSOON');
                toast.success("Referral code copied!");
              }}
              className="bg-brand-navy hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
            >
              Copy Code
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-[#0b162c] flex items-center gap-2 font-serif" style={{ fontFamily: 'Georgia, serif' }}>
            <span className="w-1.5 h-6 bg-brand-navy rounded-full inline-block shadow-sm"></span>
            Payout Requests
          </h3>
        </div>

        <div className="space-y-4">
          {payouts.length > 0 ? payouts.map(txn => (
            <div key={txn.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.status === 'paid' ? 'bg-green-100' : txn.status === 'rejected' ? 'bg-red-100' : 'bg-orange-100'}`}>
                  <ArrowUpRight className={`w-5 h-5 ${txn.status === 'paid' ? 'text-green-600' : txn.status === 'rejected' ? 'text-red-600' : 'text-orange-600'}`} />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[#0b162c]">Bank Transfer</h4>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(txn.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-extrabold text-[#0b162c]">
                  ₹{parseFloat(txn.amount).toLocaleString()}
                </span>
                <div className="flex items-center justify-end gap-1 text-[10px] mt-0.5 font-bold uppercase tracking-wider">
                  {txn.status === 'paid' && <span className="text-green-600">PAID</span>}
                  {txn.status === 'pending' && <span className="text-orange-600">PENDING</span>}
                  {txn.status === 'rejected' && <span className="text-red-600">REJECTED</span>}
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-gray-900 font-bold mb-1">No Payouts Yet</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">When you request a withdrawal to your bank, it will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* REDEEM MODAL */}
      {showRedeemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-bold text-[#0b162c] font-serif">Redeem to Bank</h2>
              <button onClick={() => { setShowRedeemModal(false); setShowAddBank(false); }} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {showAddBank ? (
                <form onSubmit={handleAddBank} className="space-y-4">
                  <h3 className="font-bold text-gray-900 mb-2">Add New Bank Account</h3>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Account Holder Name</label>
                    <input required value={newBank.account_name} onChange={e => setNewBank({...newBank, account_name: e.target.value})} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none transition-all text-sm" placeholder="e.g. John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Bank Name</label>
                    <input required value={newBank.bank_name} onChange={e => setNewBank({...newBank, bank_name: e.target.value})} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none transition-all text-sm" placeholder="e.g. State Bank of India" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Account Number</label>
                    <input required value={newBank.account_number} onChange={e => setNewBank({...newBank, account_number: e.target.value})} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none transition-all text-sm" placeholder="Enter Account Number" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">IFSC Code</label>
                    <input required value={newBank.ifsc_code} onChange={e => setNewBank({...newBank, ifsc_code: e.target.value})} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none transition-all text-sm" placeholder="e.g. SBIN0001234" />
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowAddBank(false)} className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-3 text-sm font-bold text-white bg-brand-navy hover:bg-blue-900 rounded-xl transition-all disabled:opacity-70 shadow-md">
                      {isSubmitting ? 'Saving...' : 'Save Bank'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Amount to Redeem (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                      <input 
                        type="number" 
                        value={redeemAmount}
                        onChange={(e) => setRedeemAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 text-lg font-bold rounded-xl border border-gray-200 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none transition-all"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-medium">Available Balance: <span className="text-brand-navy font-bold">₹{balance.toLocaleString()}</span></p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-semibold text-gray-700">Select Bank Account</label>
                      <button onClick={() => setShowAddBank(true)} className="text-xs font-bold text-brand-navy hover:text-blue-700 flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add New
                      </button>
                    </div>
                    
                    {savedBanks.length === 0 ? (
                      <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-4 text-center">
                        <p className="text-sm text-gray-500 mb-2">No bank accounts saved.</p>
                        <button onClick={() => setShowAddBank(true)} className="text-sm font-bold text-brand-navy bg-brand-navy/5 px-4 py-2 rounded-lg hover:bg-brand-navy/10 transition-colors">Add Bank Account</button>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                        {savedBanks.map(bank => (
                          <div 
                            key={bank.id} 
                            onClick={() => setSelectedBankId(bank.id)}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedBankId === bank.id ? 'border-brand-navy bg-brand-navy/5' : 'border-gray-100 hover:border-gray-300 bg-white'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${selectedBankId === bank.id ? 'bg-brand-navy text-white' : 'bg-gray-100 text-gray-500'}`}>
                                <CreditCard className="w-5 h-5" />
                              </div>
                              <div className="overflow-hidden">
                                <h4 className="text-sm font-bold text-gray-900 truncate">{bank.bank_name}</h4>
                                <p className="text-xs text-gray-500 truncate">{bank.account_number.replace(/.(?=.{4})/g, '•')}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={handleRedeem}
                    disabled={isSubmitting || !redeemAmount || savedBanks.length === 0 || !selectedBankId}
                    className="w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-brand-navy to-blue-900 hover:shadow-lg rounded-xl transition-all disabled:opacity-70 disabled:hover:shadow-none shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                    Submit Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
