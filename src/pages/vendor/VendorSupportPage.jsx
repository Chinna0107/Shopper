import React, { useEffect, useState } from "react";
import { HeadphonesIcon, Plus, X, MessageSquare, Clock, CheckCircle, Search } from "lucide-react";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

function CreateTicketModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onAdd(form);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900 text-lg">Create Support Ticket</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Subject</label>
            <input
              type="text"
              required
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent focus:ring-[#012980]"
              placeholder="E.g. Issue with payout"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Message</label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent focus:ring-[#012980] resize-none"
              placeholder="Describe your issue in detail..."
            />
          </div>

          <button type="submit" disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#012980] text-white text-sm font-semibold hover:bg-[#e55c02] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isSubmitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {isSubmitting ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}

export function VendorSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const vendorToken = localStorage.getItem("vendor_token") || "mock_vendor";

  useEffect(() => {
    fetch(`${BACKEND_URL}/vendor/tickets`, {
      headers: { "Authorization": "Bearer " + vendorToken }
    })
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) setTickets(d);
      })
      .catch(console.error);
  }, [vendorToken]);

  const handleCreate = async (form) => {
    try {
      const res = await fetch(`${BACKEND_URL}/vendor/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + vendorToken
        },
        body: JSON.stringify(form)
      });
      const newTicket = await res.json();
      setTickets([newTicket, ...tickets]);
      toast.success("Support ticket created!");
    } catch (e) {
      toast.error("Failed to create ticket");
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'open':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase flex items-center gap-1"><Clock className="w-3 h-3" /> Open</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Pending</span>;
      case 'closed':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Closed</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase">{status}</span>;
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {showModal && <CreateTicketModal onClose={() => setShowModal(false)} onAdd={handleCreate} />}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Support Tickets</h1>
          <p className="text-gray-500 mt-1.5 font-medium">Contact admin for any assistance or inquiries.</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#012980] text-white rounded-[12px] text-sm font-bold hover:bg-[#e55c02] transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Create Ticket
        </button>
      </div>

      <div className="bg-white p-5 rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets by ID or Subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#012980]/50 transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <HeadphonesIcon className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium text-lg mb-2">No tickets found.</p>
            <p className="text-gray-400 text-sm">You haven't submitted any support tickets yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500">Ticket ID</th>
                  <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500">Subject</th>
                  <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/80">
                {filteredTickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-8 py-5">
                      <span className="font-bold text-gray-900 group-hover:text-[#012980] transition-colors">{ticket.id}</span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-gray-900">{ticket.subject}</p>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-1 max-w-sm">{ticket.message}</p>
                    </td>
                    <td className="px-8 py-5">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-gray-500">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
