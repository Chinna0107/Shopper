import React, { useState, useEffect } from 'react';
import { IndianRupee, ShoppingBag, Search, ChevronDown, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const STATUS_COLORS = {
  pending: "bg-gray-100 text-gray-700",
  paid: "bg-blue-100 text-blue-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export function VendorRevenuePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('vendor_token');
      const res = await fetch(`${BACKEND_URL}/vendor/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getFilteredOrders = () => {
    return orders.filter(order => {
      const orderDate = new Date(order.created_at);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start) {
        start.setHours(0, 0, 0, 0);
      }
      if (end) {
        end.setHours(23, 59, 59, 999);
      }

      let dateMatch = true;
      if (start && end) {
        dateMatch = orderDate >= start && orderDate <= end;
      } else if (start) {
        dateMatch = orderDate >= start;
      } else if (end) {
        dateMatch = orderDate <= end;
      }

      const searchMatch = order.order_number?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return dateMatch && searchMatch;
    });
  };

  const filteredOrders = getFilteredOrders();
  
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
  const totalOrders = filteredOrders.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Revenue Dashboard</h1>
          <p className="text-gray-500 mt-1.5 font-medium">Analyze your revenue across specific dates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group bg-white p-6 rounded-[24px] shadow-sm border border-gray-100/50 flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-[#012980]/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="w-16 h-16 bg-gradient-to-br from-[#012980] to-[#e55c02] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#012980]/30 flex-shrink-0">
            <IndianRupee className="w-8 h-8" />
          </div>
          <div className="z-10">
            <p className="text-sm font-bold text-gray-400 tracking-wide uppercase mb-1">Generated Revenue</p>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {loading ? '...' : `₹${totalRevenue.toLocaleString()}`}
            </h3>
          </div>
        </div>

        <div className="group bg-white p-6 rounded-[24px] shadow-sm border border-gray-100/50 flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="z-10">
            <p className="text-sm font-bold text-gray-400 tracking-wide uppercase mb-1">Total Orders</p>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {loading ? '...' : totalOrders}
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col md:flex-row items-center gap-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Calendar className="w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#012980]/50 focus:border-[#012980] transition-all"
          />
          <span className="text-gray-400 font-bold">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#012980]/50 focus:border-[#012980] transition-all"
          />
        </div>

        <div className="relative flex-1 w-full mt-4 md:mt-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#012980]/50 focus:border-[#012980] transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500">Order ID</th>
                <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500">Date</th>
                <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500">Items</th>
                <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500">Revenue Generated</th>
                <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-gray-500 text-right">History Detailed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">Loading revenue details...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <IndianRupee className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    No orders found for the selected date range.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <React.Fragment key={order.id}>
                    <tr 
                      className="hover:bg-gray-50/80 transition-all cursor-pointer group"
                      onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    >
                      <td className="px-8 py-5">
                        <div className="font-bold text-gray-900 group-hover:text-[#012980] transition-colors">{order.order_number || order.id}</div>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-gray-500">
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#012980]/10 text-[#012980]">
                          {order.items?.length || 0} items
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-extrabold text-gray-900 text-lg tracking-tight">₹{parseFloat(order.total || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[order.status?.toLowerCase() || 'pending']}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center ml-auto group-hover:bg-[#012980]/10 group-hover:text-[#012980] transition-colors">
                          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expanded === order.id ? "rotate-180 text-[#012980]" : "text-gray-400"}`} />
                        </div>
                      </td>
                    </tr>
                    
                    {expanded === order.id && (
                      <tr>
                        <td colSpan="6" className="p-0 border-b border-gray-100">
                          <div className="bg-gray-50/50 p-6 shadow-inner border-y border-gray-100">
                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">Detailed Item History</h4>
                              <div className="space-y-4">
                                {order.items && order.items.map((item, idx) => (
                                  <div key={idx} className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-gray-900 truncate">{item.product?.name}</p>
                                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                                        <span>Variant: <strong className="text-gray-900">{item.variant?.color ? item.variant.color + " / " : ""}{item.variant?.size}</strong></span>
                                        <span>Qty: <strong className="text-gray-900">{item.qty}</strong></span>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <p className="font-bold text-brand-navy">₹{((item.variant?.price || item.product?.price || 0) * item.qty).toLocaleString()}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
