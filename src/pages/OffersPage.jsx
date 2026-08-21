import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tag, ShoppingBag, Calendar, Zap } from 'lucide-react';
import { Header } from '../components/Header';
import { motion } from 'framer-motion';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const discountLabel = (o) =>
    o.discount_type === 'flat' ? `₹${o.discount_percent} OFF` : `${o.discount_percent}% OFF`;

  const productOffers = offers.filter(o => o.offer_type === 'offer' || !o.code);

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-orange rounded-full animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <Header />

      {/* Hero */}
      <div className="bg-[#022A21] px-6 py-12 md:py-16 text-center border-b border-[#054335] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-brand-orange/20 border border-brand-orange/30 text-brand-orange shadow-[0_0_10px_rgba(254,102,3,0.2)] text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            <Zap className="w-3.5 h-3.5 fill-current" /> EXCLUSIVE DEALS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>Offers & Deals</h1>
          <p className="text-gray-300 text-sm md:text-base font-medium">Save more on every order with our latest active offers</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">

        {/* Product Offers */}
        {productOffers.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6 px-2">
              <Tag className="w-6 h-6 text-brand-orange" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Active Offers</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {productOffers.map((o, i) => {
                const isHighlighted = highlightId && String(o.id) === highlightId;
                return (
                  <motion.div key={o.id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className={`bg-white rounded-3xl border p-6 relative overflow-hidden transition-all shadow-sm ${isHighlighted ? 'border-brand-orange shadow-[0_0_20px_rgba(254,102,3,0.15)] ring-1 ring-brand-orange' : 'border-gray-100 hover:border-gray-200 hover:shadow-md'}`}>
                    
                    <p className="text-3xl font-black text-[#022A21] tracking-tight mb-2">{discountLabel(o)}</p>
                    <p className="text-lg font-bold text-gray-900 mb-1.5">{o.name}</p>
                    <p className="text-sm text-gray-500 capitalize font-medium">
                      {o.scope === 'all' ? 'On all products' : o.scope === 'category' ? 'On selected categories' : 'On selected products'}
                    </p>
                    
                    {o.expires_at && (
                      <div className="mt-5 pt-4 border-t border-gray-50">
                        <p className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                          <Calendar className="w-4 h-4" /> Expires {new Date(o.expires_at).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {productOffers.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Tag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 mb-6 text-lg font-medium">No active offers right now. Check back soon!</p>
            <button onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-[#022A21] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#034032] transition-all hover:-translate-y-0.5 w-max">
              <ShoppingBag className="w-4 h-4" /> Shop Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
