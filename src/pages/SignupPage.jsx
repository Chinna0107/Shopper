import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Flower2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import logo from '../assets/logo.png';

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, verifyOtp, loading, error } = useAuthStore();

  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [localError, setLocalError] = useState('');
  const otpRefs = useRef([]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setLocalError('');
    const res = await signup(form.name, form.email, form.phone, form.password);
    if (res.success) setStep('otp');
    else setLocalError(res.error);
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLocalError('');
    const code = otp.join('');
    if (code.length < 6) return setLocalError('Enter all 6 digits');
    const res = await verifyOtp(form.email, code);
    if (res.success) navigate('/');
    else setLocalError(res.error);
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 relative z-10">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-6 mt-2">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Zesto" className="h-16 object-contain rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-2 tracking-tight">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1 text-center">Join Zesto today</p>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-brand-text-muted block mb-1.5 uppercase tracking-wide">Full Name</label>
              <input
                name="name" value={form.name} onChange={handleChange} required
                placeholder="Your full name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all bg-gray-50 hover:bg-white focus:bg-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-brand-text-muted block mb-1.5 uppercase tracking-wide">Email</label>
              <input
                name="email" type="email" value={form.email} onChange={handleChange} required
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all bg-gray-50 hover:bg-white focus:bg-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-brand-text-muted block mb-1.5 uppercase tracking-wide">Phone</label>
              <input
                name="phone" value={form.phone} onChange={handleChange} required
                placeholder="+91 98765 43210"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all bg-gray-50 hover:bg-white focus:bg-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-brand-text-muted block mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  name="password" type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={handleChange} required minLength={6}
                  placeholder="Min 6 characters"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all bg-gray-50 hover:bg-white focus:bg-white pr-12 placeholder-gray-400"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-orange transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {displayError && (
              <div className="bg-red-500/10 text-red-400 text-xs font-semibold px-3 py-2 rounded-lg border border-red-500/20 text-center">
                {displayError}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-brand-blue text-white font-bold py-3.5 rounded-xl text-sm shadow-md hover:shadow-lg hover:bg-blue-700 transition-all disabled:opacity-60 disabled:hover:shadow-md mt-2 hover:-translate-y-0.5">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-brand-text-muted">OTP sent to</p>
              <p className="font-semibold text-gray-900">{form.email}</p>
            </div>
            <div className="flex justify-center gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpRefs.current[idx] = el)}
                  type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                  className="w-10 h-12 text-center text-lg font-bold text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue bg-gray-50 hover:bg-white focus:bg-white"
                />
              ))}
            </div>

            {displayError && (
              <div className="bg-red-500/10 text-red-400 text-xs font-semibold px-3 py-2 rounded-lg border border-red-500/20 text-center">
                {displayError}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-brand-blue text-white font-bold py-3.5 rounded-xl text-sm shadow-md hover:shadow-lg hover:bg-blue-700 transition-all disabled:opacity-60 disabled:hover:shadow-md mt-2 hover:-translate-y-0.5">
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>
            <button type="button" onClick={() => setStep('form')}
              className="w-full text-xs text-brand-blue hover:text-blue-700 transition-colors">
              ← Change details
            </button>
          </form>
        )}

        <p className="text-center text-sm text-brand-text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-blue font-bold hover:underline underline-offset-2">Login</Link>
        </p>
      </div>
    </div>
  );
}
