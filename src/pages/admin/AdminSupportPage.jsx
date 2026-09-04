import React, { useEffect, useState } from "react";
import { HeadphonesIcon, MessageSquare, Clock, CheckCircle, Search } from "lucide-react";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export function AdminSupportPage() {
  const [vendorTickets, setVendorTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const adminToken = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${BACKEND_URL}/admin/vendor-tickets`, {
      headers: { "Authorization": "Bearer " + adminToken }
    })
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) setVendorTickets(d);
      })
      .catch(console.error);
  }, [adminToken]);

  const handleTicketStatus = async (ticketId, newStatus) => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/vendor-tickets/${ticketId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + adminToken
        },
        body: JSON.stringify({ status: newStatus })
      });
      const updatedTicket = await res.json();
      
      setVendorTickets(vendorTickets.map(t => t.id === ticketId ? { ...t, status: updatedTicket.status } : t));
      toast.success("Ticket status updated to " + newStatus);
    } catch (e) {
      toast.error("Failed to update status");
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

  const filteredTickets = vendorTickets.filter(t => 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.vendor_id.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Support Tickets</h1>
          <p className="text-gray-500 mt-1.5 font-medium">Manage support tickets submitted by vendors.</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets by ID, Vendor, or Subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#036e26]/50 transition-all"
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
            <p className="text-gray-400 text-sm">There are currently no support tickets from vendors.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500">Ticket ID</th>
                  <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500">Vendor</th>
                  <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500">Subject</th>
                  <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/80">
                {filteredTickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-8 py-5">
                      <span className="font-bold text-gray-900 group-hover:text-[#036e26] transition-colors">{ticket.id}</span>
                      <p className="text-gray-400 text-xs mt-1">{new Date(ticket.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md text-xs">{ticket.vendor_id}</span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-gray-900">{ticket.subject}</p>
                      <p className="text-gray-500 text-sm mt-1 max-w-xs">{ticket.message}</p>
                    </td>
                    <td className="px-8 py-5">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex flex-col gap-2 items-end">
                        {ticket.status !== 'open' && (
                          <button onClick={() => handleTicketStatus(ticket.id, 'open')} className="px-3 py-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg text-xs font-semibold transition-colors">
                            Mark Open
                          </button>
                        )}
                        {ticket.status !== 'pending' && (
                          <button onClick={() => handleTicketStatus(ticket.id, 'pending')} className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors">
                            Mark Pending
                          </button>
                        )}
                        {ticket.status !== 'closed' && (
                          <button onClick={() => handleTicketStatus(ticket.id, 'closed')} className="px-3 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-semibold transition-colors">
                            Mark Closed
                          </button>
                        )}
                      </div>
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
