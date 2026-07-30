import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tag, Ticket, Copy, Check, ShoppingBag, Calendar } from 'lucide-react';
import { Header } from '../components/Header';
import { motion } from 'framer-motion';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const highlightId = searchParams.get('id');

  useEffect(() => {
    fetch(`${BACKEND_URL}/offers/active`)
      .then(r => r.json())
      .then(d => setOffers(d.offers || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const discountLabel = (o) =>
    o.discount_type === 'flat' ? `₹${o.discount_percent} OFF` : `${o.discount_percent}% OFF`;

  const restrictionLabel = (o) => {
    if (!o.min_value && !o.restriction_value) return null;
    const val = o.min_value || o.restriction_value;
    const type = o.min_type || o.restriction_type;
    if (type === 'qty' || type === 'min_qty') return `Min. ${val} items`;
    return `Min. order ₹${val}`;
  };

  const productOffers = offers.filter(o => o.offer_type === 'offer' || !o.code);
  const coupons = offers.filter(o => o.offer_type === 'coupon' || o.code);

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-orange rounded-full animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-green to-[#024d1b] px-6 py-10 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3">
          <Tag className="w-3.5 h-3.5" /> EXCLUSIVE DEALS
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Offers & Coupons</h1>
        <p className="text-white/70 text-sm">Save more on every order with our latest deals</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">

        {/* Coupons */}
        {coupons.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Ticket className="w-5 h-5 text-brand-orange" />
              <h2 className="text-lg font-bold text-gray-900">Coupon Codes</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coupons.map((c, i) => {
                const isHighlighted = highlightId && String(c.id) === highlightId;
                const restriction = restrictionLabel(c);
                return (
                  <motion.div key={c.id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className={`bg-white rounded-2xl border-2 p-5 relative overflow-hidden ${isHighlighted ? 'border-brand-orange shadow-lg shadow-orange-100' : 'border-gray-100'}`}>
                    {/* dashed divider */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-gray-50 rounded-r-full border-r-2 border-dashed border-gray-200" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-gray-50 rounded-l-full border-l-2 border-dashed border-gray-200" />

                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-2xl font-black text-brand-orange">{discountLabel(c)}</p>
                        {restriction && <p className="text-xs text-gray-400 mt-0.5">{restriction}</p>}
                      </div>
                      {c.usage === 'one_time' || c.usage_type === 'single'
                        ? <span className="text-[10px] font-bold bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">ONE TIME</span>
                        : <span className="text-[10px] font-bold bg-green-100 text-green-600 px-2 py-0.5 rounded-full">UNLIMITED</span>
                      }
                    </div>

                    <div className="flex items-center gap-2 bg-orange-50 border border-dashed border-brand-orange/40 rounded-xl px-4 py-2.5">
                      <span className="flex-1 font-bold tracking-widest text-gray-900 text-sm">{c.code}</span>
                      <button onClick={() => handleCopy(c.code, c.id)}
                        className="flex items-center gap-1 text-xs font-bold text-brand-orange hover:text-[#e55c02] transition-colors">
                        {copied === c.id ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                      </button>
                    </div>

                    {c.expires_at && (
                      <p className="flex items-center gap-1 text-[11px] text-gray-400 mt-2">
                        <Calendar className="w-3 h-3" /> Expires {new Date(c.expires_at).toLocaleDateString('en-IN')}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Product Offers */}
        {productOffers.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-brand-orange" />
              <h2 className="text-lg font-bold text-gray-900">Active Offers</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {productOffers.map((o, i) => (
                <motion.div key={o.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-100 p-5">
                  <p className="text-xl font-black text-brand-green mb-1">{discountLabel(o)}</p>
                  <p className="text-sm font-semibold text-gray-800 mb-1">{o.name}</p>
                  <p className="text-xs text-gray-400 capitalize">
                    {o.scope === 'all' ? 'On all products' : o.scope === 'category' ? 'On selected categories' : 'On selected products'}
                  </p>
                  {o.expires_at && (
                    <p className="flex items-center gap-1 text-[11px] text-gray-400 mt-2">
                      <Calendar className="w-3 h-3" /> Expires {new Date(o.expires_at).toLocaleDateString('en-IN')}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {offers.length === 0 && (
          <div className="text-center py-20">
            <Tag className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">No active offers right now. Check back soon!</p>
            <button onClick={() => navigate('/')}
              className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-[#e55c02]">
              <ShoppingBag className="w-4 h-4" /> Shop Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
