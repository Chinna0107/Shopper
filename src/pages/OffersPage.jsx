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
    <div className="min-h-screen bg-transparent">
      <Header />
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-white/10 border-t-brand-orange rounded-full animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent pb-20 font-sans">
      <Header />

      {/* Hero */}
      <div className="glass-panel bg-black/40 border-x-0 border-t-0 border-b border-white/10 px-6 py-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <div className="inline-flex items-center gap-2 bg-brand-orange/20 border border-brand-orange/30 text-brand-orange shadow-[0_0_10px_rgba(255,123,0,0.2)] text-xs font-bold px-4 py-1.5 rounded-full mb-4">
          <Tag className="w-3.5 h-3.5" /> EXCLUSIVE DEALS
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Offers & Coupons</h1>
        <p className="text-brand-text-muted text-sm md:text-base">Save more on every order with our latest deals</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">

        {/* Coupons */}
        {coupons.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6 px-2">
              <Ticket className="w-6 h-6 text-brand-orange" />
              <h2 className="text-xl font-bold text-white">Coupon Codes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coupons.map((c, i) => {
                const isHighlighted = highlightId && String(c.id) === highlightId;
                const restriction = restrictionLabel(c);
                return (
                  <motion.div key={c.id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className={`glass-panel bg-gradient-to-br from-[#0a1128]/80 to-[#020617]/90 rounded-3xl border-2 p-6 relative overflow-hidden transition-all ${isHighlighted ? 'border-brand-orange shadow-[0_0_30px_rgba(255,123,0,0.3)]' : 'border-white/10 hover:border-white/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]'}`}>
                    
                    {/* decorative circles */}
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#020617] rounded-full border-r-2 border-dashed border-white/20" />
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#020617] rounded-full border-l-2 border-dashed border-white/20" />

                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <p className="text-3xl font-black text-brand-orange glow-text">{discountLabel(c)}</p>
                        {restriction && <p className="text-xs text-brand-text-muted mt-1">{restriction}</p>}
                      </div>
                      {c.usage === 'one_time' || c.usage_type === 'single'
                        ? <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.2)]">ONE TIME</span>
                        : <span className="text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.2)]">UNLIMITED</span>
                      }
                    </div>

                    <div className="flex items-center gap-3 bg-brand-orange/10 border border-dashed border-brand-orange/50 rounded-xl px-5 py-3 shadow-[0_0_15px_rgba(255,123,0,0.1)]">
                      <span className="flex-1 font-bold tracking-widest text-white text-base">{c.code}</span>
                      <button onClick={() => handleCopy(c.code, c.id)}
                        className="flex items-center gap-1.5 text-sm font-bold text-brand-orange hover:text-orange-400 hover:shadow-[0_0_10px_rgba(255,123,0,0.3)] transition-all bg-brand-orange/20 px-3 py-1.5 rounded-lg">
                        {copied === c.id ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
                      </button>
                    </div>

                    {c.expires_at && (
                      <p className="flex items-center gap-1.5 text-[11px] text-brand-text-muted mt-4">
                        <Calendar className="w-3.5 h-3.5" /> Expires {new Date(c.expires_at).toLocaleDateString('en-IN')}
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
            <div className="flex items-center gap-2 mb-6 px-2">
              <Tag className="w-6 h-6 text-brand-orange" />
              <h2 className="text-xl font-bold text-white">Active Offers</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {productOffers.map((o, i) => (
                <motion.div key={o.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-panel bg-white/5 rounded-3xl border border-white/10 p-6 hover:border-white/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all">
                  <p className="text-2xl font-black text-brand-orange glow-text mb-2">{discountLabel(o)}</p>
                  <p className="text-base font-bold text-white mb-1.5">{o.name}</p>
                  <p className="text-xs text-brand-text-muted capitalize">
                    {o.scope === 'all' ? 'On all products' : o.scope === 'category' ? 'On selected categories' : 'On selected products'}
                  </p>
                  {o.expires_at && (
                    <p className="flex items-center gap-1.5 text-[11px] text-brand-text-muted mt-4 border-t border-white/10 pt-3">
                      <Calendar className="w-3.5 h-3.5" /> Expires {new Date(o.expires_at).toLocaleDateString('en-IN')}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {offers.length === 0 && (
          <div className="text-center py-24 glass-panel rounded-3xl border border-white/10">
            <Tag className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-brand-text-muted mb-6 text-lg">No active offers right now. Check back soon!</p>
            <button onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-brand-orange text-white rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(255,123,0,0.4)] hover:bg-orange-500 transition-all hover:-translate-y-0.5 w-max">
              <ShoppingBag className="w-4 h-4" /> Shop Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
