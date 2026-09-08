import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Eye } from 'lucide-react';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export function AdminVendorOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BACKEND_URL}/admin/vendor-orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      toast.error('Failed to load vendor orders');
    } finally {
      setLoading(false);
    }
  };

  const executePayVendor = async (payoutId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BACKEND_URL}/admin/vendor-order-payout/${payoutId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Vendor marked as paid successfully');
        fetchOrders();
      } else {
        toast.error(data.error || 'Failed to pay vendor');
      }
    } catch (error) {
      toast.error('Failed to pay vendor');
    }
  };

  const handlePayVendor = (payoutId) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="text-sm font-medium text-gray-800 mb-3">Confirm payout to vendor?</p>
          <div className="flex justify-end gap-2">
            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200" onClick={closeToast}>Cancel</button>
            <button className="px-3 py-1.5 bg-[#012980] text-white rounded-lg text-xs font-medium hover:bg-blue-900" onClick={() => { executePayVendor(payoutId); closeToast(); }}>Confirm</button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => 
    o.order_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vendor Orders</h1>
        <p className="text-gray-500 mt-1">Monitor orders that contain vendor products.</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#012980]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-sm text-gray-900">Order ID</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-900">Date</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-900">Vendor Items</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-900">Order Total</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-900">Status</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-900">Payouts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Loading orders...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    No vendor orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#012980]">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {order.vendor_items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      ₹{parseFloat(order.total).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize 
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {order.vendor_payouts && order.vendor_payouts.map(payout => (
                        <div key={payout.id} className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-700">Vendor #{payout.vendor_id}:</span>
                          <span className="text-sm font-bold text-gray-900">₹{payout.amount}</span>
                          {payout.status === 'paid' ? (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Paid</span>
                          ) : (
                            <button
                              onClick={() => handlePayVendor(payout.id)}
                              className="text-xs bg-[#012980] hover:bg-blue-900 text-white px-2 py-1 rounded transition-colors shadow-sm"
                            >
                              Pay
                            </button>
                          )}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
