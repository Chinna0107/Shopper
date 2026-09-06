import React, { useState, useEffect } from "react";
import { Users, Banknote, Search, Calendar, CheckCircle2, XCircle, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import api from "../../utils/api";

export function AdminReferralPayoutsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [processingId, setProcessingId] = useState(null);
  
  const [customerReferralAmount, setCustomerReferralAmount] = useState("");
  const [vendorReferralAmount, setVendorReferralAmount] = useState("");
  const [isSavingAmount, setIsSavingAmount] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  const [payouts, setPayouts] = useState([]);
  const [isLoadingPayouts, setIsLoadingPayouts] = useState(true);

  useEffect(() => {
    fetchSettings();
    fetchPayouts();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      if (res.data.customer_referral_amount) {
        setCustomerReferralAmount(res.data.customer_referral_amount);
      }
      if (res.data.vendor_referral_amount) {
        setVendorReferralAmount(res.data.vendor_referral_amount);
      }
    } catch (err) {
      console.error("Failed to fetch settings", err);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const fetchPayouts = async () => {
    try {
      const res = await api.get('/admin/payouts');
      setPayouts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch payouts", err);
      toast.error("Failed to load payout requests");
    } finally {
      setIsLoadingPayouts(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!customerReferralAmount || !vendorReferralAmount || isNaN(customerReferralAmount) || isNaN(vendorReferralAmount)) {
      toast.error("Please enter valid amounts");
      return;
    }
    setIsSavingAmount(true);
    try {
      await api.post('/admin/settings', { key: 'customer_referral_amount', value: customerReferralAmount.toString() });
      await api.post('/admin/settings', { key: 'vendor_referral_amount', value: vendorReferralAmount.toString() });
      toast.success("Referral amounts updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to update amounts");
    } finally {
      setIsSavingAmount(false);
    }
  };

  const updatePayoutStatus = async (payoutId, newStatus) => {
    setProcessingId(payoutId);
    try {
      await api.put(`/admin/payouts/${payoutId}/status`, { status: newStatus });
      setPayouts(payouts.map(p => p.payout_id === payoutId ? { ...p, status: newStatus } : p));
      toast.success(`Payout ${payoutId} marked as ${newStatus}!`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to process request");
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkAsPaid = (payoutId) => updatePayoutStatus(payoutId, 'paid');
  const handleReject = (payoutId) => updatePayoutStatus(payoutId, 'rejected');

  const filtered = payouts.filter(p => {
    const name = (p.user_name || p.vendor_name || "").toLowerCase();
    const pid = (p.payout_id || "").toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase()) || pid.includes(search.toLowerCase());
    const matchesFilter = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPendingAmount = payouts.filter(p => p.status === "pending").reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const totalPaidAmount = payouts.filter(p => p.status === "paid").reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const pendingCount = payouts.filter(p => p.status === "pending").length;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Referral Payouts</h1>
          <p className="text-gray-400 text-xs mt-0.5">Manage and process user withdrawal requests</p>
        </div>
      </div>

      {/* Referral Amount Setting Card */}
      <div className="bg-white p-6 rounded-2xl border border-brand-navy/10 shadow-[0_4px_20px_rgba(11,22,44,0.04)] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-navy/5 flex items-center justify-center border border-brand-navy/10 shrink-0">
            <Banknote className="w-6 h-6 text-brand-navy" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Referral Reward Amounts</h2>
            <p className="text-gray-500 text-sm mt-0.5">Set separate amounts for customer and vendor referrals.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600 w-20">Customer:</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
              <input 
                type="number" 
                value={customerReferralAmount}
                onChange={(e) => setCustomerReferralAmount(e.target.value)}
                placeholder="e.g. 50"
                disabled={isLoadingSettings}
                className="pl-8 pr-4 py-2.5 w-28 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-bold focus:outline-none focus:border-brand-navy/50 focus:ring-1 focus:ring-brand-navy/50 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600 w-16">Vendor:</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
              <input 
                type="number" 
                value={vendorReferralAmount}
                onChange={(e) => setVendorReferralAmount(e.target.value)}
                placeholder="e.g. 100"
                disabled={isLoadingSettings}
                className="pl-8 pr-4 py-2.5 w-28 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-bold focus:outline-none focus:border-brand-navy/50 focus:ring-1 focus:ring-brand-navy/50 transition-all"
              />
            </div>
          </div>
          <button 
            onClick={handleSaveSettings}
            disabled={isSavingAmount || isLoadingSettings}
            className="bg-brand-navy hover:bg-blue-900 text-white font-bold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed ml-2"
          >
            {isSavingAmount ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center border border-yellow-100 shrink-0">
            <Banknote className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-0.5">Pending Amount</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalPendingAmount.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center border border-green-100 shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-0.5">Total Paid Out</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalPaidAmount.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
            <Users className="w-6 h-6 text-brand-navy" />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-0.5">Pending Requests</p>
            <p className="text-2xl font-bold text-gray-900">{pendingCount} requests</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search by ID or Name..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-100 text-gray-900 text-sm focus:outline-none focus:border-[#036e26]/30 shadow-sm" 
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-100 text-gray-900 text-sm focus:outline-none focus:border-[#036e26]/30 shadow-sm appearance-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="text-left py-4 px-6 font-semibold">Request Info</th>
                <th className="text-left py-4 px-6 font-semibold">User</th>
                <th className="text-left py-4 px-6 font-semibold">Amount & Bank</th>
                <th className="text-left py-4 px-6 font-semibold">Status</th>
                <th className="text-right py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoadingPayouts ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">Loading payouts...</td>
                </tr>
              ) : filtered.map((payout, i) => {
                let bank;
                try {
                   bank = typeof payout.bank_details === 'string' ? JSON.parse(payout.bank_details) : payout.bank_details;
                } catch (e) {
                   bank = payout.bank_details || {};
                }
                const isVendor = !!payout.vendor_id;

                return (
                <motion.tr key={payout.payout_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-gray-900">{payout.payout_id}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(payout.created_at).toLocaleDateString("en-IN")}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-900">{payout.user_name || payout.vendor_name || 'Unknown'}</p>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1 inline-block ${isVendor ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {isVendor ? 'Vendor' : 'Customer'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-extrabold text-[#036e26] text-base mb-1">₹{parseFloat(payout.amount).toLocaleString()}</p>
                    <div className="text-xs text-gray-600 space-y-0.5 bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <p className="font-bold text-gray-900">{bank.bank_name || 'Bank'}</p>
                      <p>A/C: <span className="font-mono text-gray-900 tracking-tight">{bank.account_number || 'N/A'}</span></p>
                      <p>Name: <span className="text-gray-900">{bank.account_name || 'N/A'}</span></p>
                      <p>IFSC: <span className="text-gray-900 font-mono tracking-tight">{bank.ifsc_code || 'N/A'}</span></p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {payout.status === "pending" && <span className="bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Pending</span>}
                    {payout.status === "paid" && <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Paid</span>}
                    {payout.status === "rejected" && <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Rejected</span>}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {payout.status === "pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleMarkAsPaid(payout.payout_id)} disabled={processingId === payout.payout_id} className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-green-50 disabled:hover:text-green-600" title="Mark as Paid">
                          {processingId === payout.payout_id ? <div className="w-5 h-5 border-2 border-green-600/20 border-t-green-600 rounded-full animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                        </button>
                        <button onClick={() => handleReject(payout.payout_id)} disabled={processingId === payout.payout_id} className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-red-50 disabled:hover:text-red-600" title="Reject Request">
                          {processingId === payout.payout_id ? <div className="w-5 h-5 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin" /> : <XCircle className="w-5 h-5" />}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">Processed</span>
                    )}
                  </td>
                </motion.tr>
                )
              })}
              {!isLoadingPayouts && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No payout requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
