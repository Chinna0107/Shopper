import React, { useState } from "react";
import { Users, Banknote, Search, Calendar, CheckCircle2, XCircle, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export function AdminReferralPayoutsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [processingId, setProcessingId] = useState(null);

  // Dummy data for payouts
  const [payouts, setPayouts] = useState([
    { id: "PAY-1001", user_name: "Priya Sharma", user_type: "Customer", requested_amount: 1500, method: "UPI", details: "priya@upi", status: "pending", created_at: "2026-08-25T10:30:00Z" },
    { id: "PAY-1002", user_name: "The Loom Story", user_type: "Vendor", requested_amount: 5000, method: "Bank Transfer", details: "HDFC •••• 4521", status: "pending", created_at: "2026-08-28T14:15:00Z" },
    { id: "PAY-1003", user_name: "Rahul Verma", user_type: "Customer", requested_amount: 500, method: "UPI", details: "rahul.v@okaxis", status: "paid", created_at: "2026-08-20T09:00:00Z" },
    { id: "PAY-1004", user_name: "Anjali Creations", user_type: "Vendor", requested_amount: 12500, method: "Bank Transfer", details: "ICICI •••• 9876", status: "rejected", created_at: "2026-08-15T11:45:00Z" },
  ]);

  const handleMarkAsPaid = async (id) => {
    setProcessingId(id);
    await new Promise(r => setTimeout(r, 800)); // Simulate API call
    setPayouts(payouts.map(p => p.id === id ? { ...p, status: "paid" } : p));
    toast.success(`Payout ${id} marked as paid successfully!`);
    setProcessingId(null);
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    await new Promise(r => setTimeout(r, 800)); // Simulate API call
    setPayouts(payouts.map(p => p.id === id ? { ...p, status: "rejected" } : p));
    toast.error(`Payout ${id} has been rejected.`);
    setProcessingId(null);
  };

  const filtered = payouts.filter(p => {
    const matchesSearch = p.user_name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPendingAmount = payouts.filter(p => p.status === "pending").reduce((sum, p) => sum + p.requested_amount, 0);
  const totalPaidAmount = payouts.filter(p => p.status === "paid").reduce((sum, p) => sum + p.requested_amount, 0);
  const pendingCount = payouts.filter(p => p.status === "pending").length;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Referral Payouts</h1>
          <p className="text-gray-400 text-xs mt-0.5">Manage and process user withdrawal requests</p>
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
                <th className="text-left py-4 px-6 font-semibold">Amount & Method</th>
                <th className="text-left py-4 px-6 font-semibold">Status</th>
                <th className="text-right py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((payout, i) => (
                <motion.tr key={payout.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-gray-900">{payout.id}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(payout.created_at).toLocaleDateString("en-IN")}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-900">{payout.user_name}</p>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1 inline-block ${payout.user_type === 'Vendor' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {payout.user_type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-extrabold text-[#036e26] text-base">₹{payout.requested_amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">{payout.method}: <span className="text-gray-900">{payout.details}</span></p>
                  </td>
                  <td className="py-4 px-6">
                    {payout.status === "pending" && <span className="bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Pending</span>}
                    {payout.status === "paid" && <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Paid</span>}
                    {payout.status === "rejected" && <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Rejected</span>}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {payout.status === "pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleMarkAsPaid(payout.id)} disabled={processingId === payout.id} className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-green-50 disabled:hover:text-green-600" title="Mark as Paid">
                          {processingId === payout.id ? <div className="w-5 h-5 border-2 border-green-600/20 border-t-green-600 rounded-full animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                        </button>
                        <button onClick={() => handleReject(payout.id)} disabled={processingId === payout.id} className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-red-50 disabled:hover:text-red-600" title="Reject Request">
                          {processingId === payout.id ? <div className="w-5 h-5 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin" /> : <XCircle className="w-5 h-5" />}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">Processed</span>
                    )}
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
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
