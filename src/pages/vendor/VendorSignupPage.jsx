import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Store, ArrowRight, ShieldCheck, CheckCircle2, CreditCard, Tag } from 'lucide-react';
import { toast } from 'react-toastify';
import logo from '../../assets/logo.png';
import { useAuthStore } from '../../store/useAuthStore';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const STEP_LABELS = ['Personal', 'Store', 'Plan', 'Verify'];

export function VendorSignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentId, setPaymentId] = useState('');

  const [storeImage, setStoreImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', storeName: '', storeAddress: '', otp: '', referralCode: ''
  });

  const [referrer, setReferrer] = useState({ status: 'idle', name: '' });

  useEffect(() => {
    const code = formData.referralCode;
    if (!code) {
      setReferrer({ status: 'idle', name: '' });
      return;
    }
    if (code.length < 3) return;

    setReferrer({ status: 'checking', name: '' });
    const timer = setTimeout(async () => {
      const res = await useAuthStore.getState().checkReferralCode(code);
      if (res.valid) {
        setReferrer({ status: 'valid', name: res.name });
      } else {
        setReferrer({ status: 'invalid', name: '' });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.referralCode]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/subscriptions/plans`)
      .then(r => r.json())
      .then(d => setPlans(d.plans || []))
      .catch(() => {})
      .finally(() => setLoadingPlans(false));
  }, []);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePayment = async () => {
    if (!selectedPlan) return setError('Please select a plan');
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/subscriptions/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: selectedPlan.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: 'INR',
        name: 'Swabhivar Shoppers',
        description: `${selectedPlan.name} Vendor Subscription`,
        order_id: data.order.id,
        handler: (response) => {
          setPaymentId(response.razorpay_payment_id);
          setPaymentDone(true);
          toast.success('Payment successful!');
        },
        prefill: { name: `${formData.firstName} ${formData.lastName}`, email: formData.email, contact: formData.phone },
        theme: { color: '#012980' },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => { setError('Payment failed. Please try again.'); });
      rzp.open();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (step === 1) return setStep(2);

    if (step === 2) return setStep(3);

    if (step === 3) {
      if (!paymentDone) return setError('Please complete payment to continue');
      // Submit signup + send OTP
      setLoading(true);
      try {
        const payload = {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email, phone: formData.phone,
          password: formData.password,
          store_name: formData.storeName, address: formData.storeAddress,
          plan_id: selectedPlan.id, payment_id: paymentId, referral_code: formData.referralCode, store_image: storeImage,
        };
        const res = await fetch(`${BACKEND_URL}/vendorAuth/signup`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to sign up');
        setStep(4);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (step === 4) {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/vendorAuth/verify-otp`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, otp: formData.otp }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to verify OTP');
        toast.success('Application verified! We will review and notify you once approved.');
        navigate('/vendor-login');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <img src={logo} alt="Swabhivar Shoppers" className="h-12 mx-auto mix-blend-multiply" />
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Store className="w-6 h-6 text-[#012980]" />
            <h1 className="text-3xl font-bold text-gray-900">Become a Vendor</h1>
          </div>
          <p className="text-gray-500">Apply to sell your products on Swabhivar Shoppers</p>
        </div>

        <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#012980]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
          {/* Progress */}
          <div className="flex items-center justify-center mb-8 gap-1">
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              const active = step >= n;
              return (
                <React.Fragment key={n}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${active ? 'bg-[#012980] text-white' : 'bg-gray-100 text-gray-400'}`}>{n}</div>
                    <span className={`text-[10px] font-medium ${active ? 'text-[#012980]' : 'text-gray-400'}`}>{label}</span>
                  </div>
                  {i < STEP_LABELS.length - 1 && <div className={`w-8 sm:w-12 h-1 rounded-full mb-4 transition-colors ${step > n ? 'bg-[#012980]' : 'bg-gray-100'}`} />}
                </React.Fragment>
              );
            })}
          </div>

          {error && <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1 — Personal */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {['firstName', 'lastName'].map(f => (
                    <div key={f}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5 capitalize">{f === 'firstName' ? 'First Name' : 'Last Name'}</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input type="text" name={f} value={formData[f]} onChange={handleChange} required
                          className="block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-[16px] text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#012980]/30 focus:border-[#012980] transition-all shadow-inner"
                          placeholder={f === 'firstName' ? 'John' : 'Doe'} />
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required
                      className="block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-[16px] text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#012980]/30 focus:border-[#012980] transition-all shadow-inner"
                      placeholder="vendor@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                      className="block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-[16px] text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#012980]/30 focus:border-[#012980] transition-all shadow-inner"
                      placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required
                      className="block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-[16px] text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#012980]/30 focus:border-[#012980] transition-all shadow-inner"
                      placeholder="••••••••" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Referral Code (Optional)</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" name="referralCode" value={formData.referralCode} onChange={handleChange}
                      className={`block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border ${referrer.status === 'invalid' ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : referrer.status === 'valid' ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20' : 'border-gray-200 focus:border-[#012980] focus:ring-[#012980]/30'} rounded-[16px] text-gray-900 focus:bg-white focus:ring-2 transition-all shadow-inner`}
                      placeholder="Enter referral code" />
                    {referrer.status === 'checking' && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#012980]/30 border-t-[#012980] rounded-full animate-spin" />
                    )}
                    {referrer.status === 'valid' && (
                      <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {referrer.status === 'valid' && (
                    <p className="mt-1.5 text-xs font-medium text-green-600 flex items-center gap-1">
                      Referred by {referrer.name}
                    </p>
                  )}
                  {referrer.status === 'invalid' && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      Invalid referral code
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2 — Store */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Store / Business Name</label>
                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} required
                      className="block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-[16px] text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#012980]/30 focus:border-[#012980] transition-all shadow-inner"
                      placeholder="My Awesome Store" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Image Cover</label>
                  <div className="relative">
                    {storeImage ? (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200">
                        <img src={storeImage} alt="Store Cover" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setStoreImage('')} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                          <XCircle className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-32 rounded-[16px] border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors relative">
                        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        {uploadingImage ? (
                           <div className="w-6 h-6 border-2 border-[#012980]/30 border-t-[#012980] rounded-full animate-spin"></div>
                        ) : (
                           <>
                             <div className="w-10 h-10 rounded-full bg-[#012980]/5 flex items-center justify-center mb-2">
                               <Store className="w-5 h-5 text-[#012980]" />
                             </div>
                             <span className="text-sm font-medium text-gray-500">Click to upload store image</span>
                           </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Address</label>
                  <textarea name="storeAddress" value={formData.storeAddress} onChange={handleChange} required rows={3}
                    className="block w-full p-4 bg-gray-50/50 border border-gray-200 rounded-[16px] text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#012980]/30 focus:border-[#012980] transition-all shadow-inner resize-none"
                    placeholder="Enter complete business address" />
                </div>
              </div>
            )}

            {/* Step 3 — Subscription Plan */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-2">
                  <CreditCard className="w-10 h-10 text-[#012980] mx-auto mb-2" />
                  <h2 className="text-lg font-bold text-gray-900">Choose a Subscription Plan</h2>
                  <p className="text-gray-500 text-sm">Select a plan to activate your vendor account</p>
                </div>

                {loadingPlans ? (
                  <p className="text-center text-gray-400 py-4">Loading plans...</p>
                ) : plans.length === 0 ? (
                  <p className="text-center text-gray-400 py-4">No plans available.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plans.map(plan => {
                      const features = plan.features || {};
                      const featureList = [
                        { label: 'Products', value: features.product_limit || 'Unlimited' },
                        { label: 'Commission', value: `${features.commission_percent || '0'}%` },
                        { label: 'Images/Product', value: features.images_per_product || '—' },
                        features.seo_enabled ? { label: 'Advanced SEO' } : null,
                        features.analytics_enabled ? { label: 'Store Analytics' } : null,
                        features.verification_badge_enabled ? { label: 'Verification Badge' } : null,
                      ].filter(Boolean);

                      return (
                        <button key={plan.id} type="button"
                          onClick={() => { setSelectedPlan(plan); setPaymentDone(false); setPaymentId(''); }}
                          className={`relative p-5 rounded-[20px] border-2 text-left transition-all flex flex-col group ${
                            selectedPlan?.id === plan.id
                              ? 'border-[#012980] bg-gradient-to-br from-[#012980]/5 to-transparent shadow-[0_8px_20px_rgba(254,102,3,0.1)]'
                              : 'border-gray-100 hover:border-[#012980]/30 bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1'
                          }`}>
                          {selectedPlan?.id === plan.id && (
                            <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-[#012980]" />
                          )}
                          <p className="font-bold text-gray-900 text-lg">{plan.name}</p>
                          <p className="text-[#012980] font-extrabold text-2xl mt-1">₹{plan.price}</p>
                          <p className="text-gray-500 text-sm mt-0.5 mb-4">{plan.months} month{plan.months > 1 ? 's' : ''} access</p>
                          
                          <ul className="space-y-2 mt-auto">
                            {featureList.map((f, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <CheckCircle2 className="w-4 h-4 text-[#012980] mt-0.5 flex-shrink-0" />
                                <span>{f.label}{f.value ? `: ${f.value}` : ''}</span>
                              </li>
                            ))}
                          </ul>
                        </button>
                      );
                    })}
                  </div>
                )}

                {selectedPlan && !paymentDone && (
                  <button type="button" onClick={handlePayment} disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#036e26] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#025a1f] transition-colors disabled:opacity-50">
                    {loading ? 'Opening payment...' : `Pay ₹${selectedPlan.price} & Continue`}
                  </button>
                )}

                {paymentDone && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-green-700 font-semibold text-sm">Payment Successful!</p>
                      <p className="text-green-600 text-xs">ID: {paymentId}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4 — OTP */}
            {step === 4 && (
              <div className="space-y-4 text-center">
                <ShieldCheck className="w-16 h-16 text-[#012980] mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900">Verify Your Email</h2>
                <p className="text-gray-500 text-sm">We've sent a 6-digit OTP to <strong>{formData.email}</strong></p>
                <div className="pt-4 max-w-xs mx-auto">
                  <input type="text" name="otp" value={formData.otp} onChange={handleChange} required maxLength={6}
                    className="block w-full text-center tracking-[0.5em] font-bold text-2xl py-3.5 bg-gray-50/50 border border-gray-200 rounded-[16px] text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#012980]/30 focus:border-[#012980] transition-all shadow-inner"
                    placeholder="------" />
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              {step > 1 && step < 4 && (
                <button type="button" disabled={loading} onClick={() => setStep(s => s - 1)}
                  className="px-6 py-4 border border-gray-200 rounded-[16px] font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50">
                  Back
                </button>
              )}
              {step === 4 && (
                <button type="button" disabled={loading} onClick={() => setStep(3)}
                  className="px-6 py-4 border border-gray-200 rounded-[16px] font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50">
                  Back
                </button>
              )}
              <button type="submit" disabled={loading || (step === 3 && !paymentDone)}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#012980] to-[#ff7b23] text-white py-4 rounded-[16px] font-bold text-lg hover:shadow-[0_8px_20px_rgba(254,102,3,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:transform-none disabled:hover:shadow-none">
                {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : null}
                {loading ? 'Processing...' : step === 1 ? 'Continue' : step === 2 ? 'Continue' : step === 3 ? 'Send OTP' : 'Verify & Submit'}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </form>

          {step < 4 && (
            <p className="mt-8 text-center text-gray-600">
              Already have a vendor account?{' '}
              <Link to="/vendor-login" className="text-[#012980] font-medium hover:underline">Sign In</Link>
            </p>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
