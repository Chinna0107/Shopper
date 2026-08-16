import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, Tag, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { useCartStore } from '../store/useCartStore';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export function CartPage() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getSubtotal, getTotal, deliveryCharge } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);   // applied coupon object
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  
  const container = React.useRef(null);
  
  useGSAP(() => {
    if (items.length > 0) {
      gsap.from('.animate-cart-item', {
        x: -30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all'
      });
      gsap.from('.animate-cart-summary', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
        ease: 'power2.out',
        clearProps: 'all'
      });
    }
  }, { scope: container });

  const handleCheckout = () => {
    navigate('/checkout', { state: { couponCode: coupon?.code || couponCode, discount } });
  };

  const subtotal = getSubtotal();
  const totalQty = items.reduce((s, i) => s + i.qty, 0);

  const discount = (() => {
    if (!coupon) return 0;
    const type = coupon.type || coupon.discount_type;
    const val = Number(coupon.value || coupon.discount_value || coupon.discount_percent || 0);
    if (type === 'percentage' || type === 'percent') {
      return Math.round((subtotal * val) / 100);
    }
    return val;
  })();

  const grandTotal = Math.max(0, subtotal - discount) + (subtotal > 0 ? deliveryCharge : 0);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    setCoupon(null);
    try {
      const res = await fetch(`${BACKEND_URL}/general/coupon/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim().toUpperCase(), subtotal, qty: totalQty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid coupon');
      setCoupon(data.coupon);
    } catch (e) {
      setCouponError(e.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => { setCoupon(null); setCouponCode(''); setCouponError(''); };

  return (
    <div ref={container} className="min-h-screen bg-transparent pb-36">
      <Header title={`My Cart (${items.length})`} />
      
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 mt-20 max-w-md mx-auto glass-panel rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="w-24 h-24 bg-gradient-to-br from-brand-orange/20 to-transparent rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,123,0,0.2)]">
            <ShoppingCart className="w-12 h-12 text-brand-orange" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Your cart is empty</h2>
          <p className="text-brand-text-muted mb-8 text-center text-sm">Looks like you haven't added anything to your cart yet. Discover our latest collections.</p>
          <button 
            onClick={() => navigate('/')} 
            className="w-full bg-brand-orange text-white px-6 py-3.5 rounded-xl font-bold shadow-[0_0_15px_rgba(255,123,0,0.4)] hover:bg-orange-500 hover:-translate-y-0.5 transition-all"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 md:max-w-7xl mx-auto">
          {/* Step Indicator */}
          <div className="flex justify-between items-center mb-4 px-2 max-w-lg mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center text-sm font-bold shadow-[0_0_10px_rgba(255,123,0,0.5)]">1</div>
              <span className="text-[11px] text-brand-orange font-bold mt-2">Cart</span>
            </div>
            <div className="h-[2px] bg-white/10 flex-1 mx-4 relative overflow-hidden">
               <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-brand-orange to-transparent opacity-50"></div>
            </div>
            <div className="flex flex-col items-center opacity-50">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center text-sm font-bold">2</div>
              <span className="text-[11px] text-brand-text-muted font-bold mt-2">Address</span>
            </div>
            <div className="h-[2px] bg-white/10 flex-1 mx-4"></div>
            <div className="flex flex-col items-center opacity-50">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center text-sm font-bold">3</div>
              <span className="text-[11px] text-brand-text-muted font-bold mt-2">Payment</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 items-start">
            {/* Left Column: Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              {items.map(item => (
              <div key={`${item.product.id}-${item.variant?.size || 'default'}`} className="animate-cart-item glass-panel rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 hover:border-white/20 transition-all p-4 flex gap-4 relative">
                <button 
                  onClick={() => removeFromCart(item.product.id, item.variant)}
                  className="absolute top-4 right-4 text-brand-text-muted hover:text-red-500 hover:bg-white/5 p-1 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
                <div className="w-24 h-24 bg-white/5 rounded-xl shrink-0 p-2 border border-white/5 shadow-inner">
                  <img src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : item.product.image_url} alt={item.product.name} className="w-full h-full object-contain drop-shadow-md" />
                </div>
                
                <div className="flex flex-col justify-between py-1 flex-grow pr-8">
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight mb-2">{item.product.name}</h3>
                    <div className="flex gap-2 flex-wrap">
                      <p className="text-[11px] text-brand-text-muted font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded-md inline-block">
                        {item.variant?.size || 'Standard'}
                      </p>
                      {item.product.color && (
                        <p className="text-[11px] text-brand-orange font-bold bg-brand-orange/10 border border-brand-orange/20 px-2 py-0.5 rounded-md inline-block">
                          {item.product.color}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-end justify-between mt-4">
                    <div className="font-extrabold text-xl text-brand-orange glow-text">₹{item.variant?.price || item.product.price}</div>
                    
                    <div className="flex items-center w-28 glass-panel border border-white/20 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.variant, Math.max(1, item.qty - 1))}
                        className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 hover:text-brand-orange rounded-md transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="flex-1 text-center text-[13px] font-bold text-white">{item.qty}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.variant, item.qty + 1)}
                        className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 hover:text-brand-orange rounded-md transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </div>            {/* Right Column: Summary & Checkout */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              {/* Coupon */}
              <div className="animate-cart-summary glass-panel rounded-2xl border border-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-brand-orange" />
                  <span className="text-base font-bold text-white">Apply Coupon</span>
                </div>
                {coupon ? (
                  <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-sm font-bold text-green-400">{coupon.code}</p>
                        <p className="text-xs text-green-400/80">You save ₹{discount}</p>
                      </div>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-brand-text-muted hover:text-red-400 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Enter coupon code"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-brand-orange focus:shadow-[0_0_10px_rgba(255,123,0,0.3)] transition-all placeholder-gray-500"
                      />
                      <button onClick={handleApplyCoupon} disabled={couponLoading || !couponCode.trim()}
                        className="bg-brand-orange text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-orange-500 shadow-[0_0_15px_rgba(255,123,0,0.4)] transition-all disabled:opacity-50">
                        {couponLoading ? '...' : 'APPLY'}
                      </button>
                    </div>
                    {couponError && (
                      <div className="flex items-center gap-1.5 mt-3 text-xs text-red-400">
                        <AlertCircle className="w-4 h-4" /> {couponError}
                      </div>
                    )}
                  </>
                )}
              </div>

          {/* Bill Details */}
          <div className="animate-cart-summary glass-panel p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10">
            <h3 className="font-bold text-white mb-5 pb-4 border-b border-white/10 text-lg flex items-center gap-2">
              <span className="w-1.5 h-5 bg-brand-orange rounded-full inline-block"></span>
              Price Details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-[15px] text-brand-text-muted">
                <span>Item Total ({items.length} items)</span>
                <span className="font-medium text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[15px] text-brand-text-muted">
                <span>Delivery Charges</span>
                <span className="font-medium text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
                  {deliveryCharge > 0 ? `₹${deliveryCharge.toFixed(2)}` : 'FREE'}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[15px] text-green-400 font-semibold drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
                  <span>Coupon Discount</span>
                  <span>- ₹{discount.toFixed(2)}</span>
                </div>
              )}
                <div className="flex justify-between font-extrabold text-white text-xl pt-5 mt-4 border-t border-dashed border-white/20">
                  <span>Grand Total</span>
                  <span className="text-brand-orange glow-text">₹{grandTotal.toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="hidden lg:flex w-full mt-8 bg-brand-orange hover:bg-orange-500 text-white font-bold text-base rounded-xl py-4 shadow-[0_0_20px_rgba(255,123,0,0.4)] hover:shadow-[0_0_30px_rgba(255,123,0,0.6)] hover:-translate-y-1 transition-all items-center justify-center gap-2"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Checkout Bar - Mobile Only */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 mx-auto w-full glass-panel bg-black/80 backdrop-blur-xl border-t border-white/10 p-4 pb-safe z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-wider mb-0.5">Total Amount</p>
              <p className="text-xl font-bold text-white leading-none">₹{grandTotal.toFixed(2)}</p>
            </div>
            <button 
              onClick={handleCheckout}
              className="flex-1 sm:max-w-md bg-brand-orange hover:bg-orange-500 text-white font-bold text-base rounded-xl py-4 shadow-[0_0_20px_rgba(255,123,0,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <span className="w-1.5 h-1.5 bg-white rounded-full mx-1 opacity-50" />
              Step 2
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
