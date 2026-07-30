import React, { useEffect, useState } from 'react';
import { CreditCard, Edit2, Check, X, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

function daysLeft(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

export function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    Promise.all([
      fetch(`${BACKEND_URL}/subscriptions/admin/plans`, { headers }).then(r => r.json()).catch(() => ({})),
      fetch(`${BACKEND_URL}/subscriptions/admin/vendors`, { headers }).then(r => r.json()).catch(() => ({})),
    ]).then(([p, v]) => {
      setPlans(p.plans || []);
      setVendors(v.vendors || []);
    }).finally(() => setLoading(false));
  }, []);

  const savePrice = async (plan) => {
    const price = parseFloat(editPrice);
    if (isNaN(price) || price <= 0) return toast.error('Enter a valid price');
    const res = await fetch(`${BACKEND_URL}/subscriptions/admin/plans/${plan.id}`, {
      method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ price, is_active: plan.is_active }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error);
    setPlans(prev => prev.map(p => p.id === plan.id ? data.plan : p));
    setEditId(null);
    toast.success('Price updated');
  };

  const togglePlan = async (plan) => {
    const res = await fetch(`${BACKEND_URL}/subscriptions/admin/plans/${plan.id}`, {
      method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: plan.price, is_active: !plan.is_active }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error);
    setPlans(prev => prev.map(p => p.id === plan.id ? data.plan : p));
    toast.success(`Plan ${data.plan.is_active ? 'enabled' : 'disabled'}`);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-[#036e26] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <p className="text-gray-400 text-xs mt-0.5">Manage subscription plans and view vendor subscriptions</p>
      </div>

      {/* Plans */}
      <div>
        <h2 className="font-bold text-gray-700 text-sm mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#036e26]" /> Subscription Plans
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map(plan => (
            <div key={plan.id} className={`bg-white rounded-2xl border p-5 ${plan.is_active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{plan.name}</p>
                  <p className="text-gray-400 text-xs">{plan.months} month{plan.months > 1 ? 's' : ''}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plan.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {plan.is_active ? 'Active' : 'Off'}
                </span>
              </div>

              {editId === plan.id ? (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 text-sm">₹</span>
                  <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)}
                    className="flex-1 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#036e26] w-0"
                    autoFocus />
                  <button onClick={() => savePrice(plan)} className="text-green-600 hover:text-green-700"><Check className="w-4 h-4" /></button>
                  <button onClick={() => setEditId(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[#036e26] font-bold text-xl">₹{plan.price}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditId(plan.id); setEditPrice(plan.price); }}
                      className="text-gray-400 hover:text-[#036e26] transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => togglePlan(plan)}
                      className={`text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${plan.is_active ? 'text-red-400 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}>
                      {plan.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Vendor Subscriptions */}
      <div>
        <h2 className="font-bold text-gray-700 text-sm mb-3">Vendor Subscriptions ({vendors.length})</h2>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Vendor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Plan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Expires</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vendors.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-400 py-10 text-sm">No vendor subscriptions yet.</td></tr>
              ) : vendors.map(v => {
                const days = daysLeft(v.subscription_expires_at);
                const expired = days !== null && days <= 0;
                const expiringSoon = days !== null && days > 0 && days <= 10;
                return (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{v.store_name}</p>
                      <p className="text-gray-400 text-xs">{v.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{v.plan_name || '—'}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900 hidden md:table-cell">{v.amount ? `₹${v.amount}` : '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {v.subscription_expires_at
                        ? new Date(v.subscription_expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {days === null ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">No Plan</span>
                      ) : expired ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> Expired
                        </span>
                      ) : expiringSoon ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 w-fit block">{days}d left</span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 w-fit block">{days}d left</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
