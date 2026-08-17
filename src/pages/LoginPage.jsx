import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import logo from '../assets/logo.png';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, forgotPassword, verifyResetOtp, resetPassword, loading, error } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [step, setStep] = useState('login'); // 'login', 'forgot_email', 'forgot_otp', 'forgot_reset'
  const [form, setForm] = useState({ email: '', password: '', otp: '', newPassword: '', confirmPassword: '' });
  const [localError, setLocalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const clearMessages = () => {
    setLocalError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    const res = await login(form.email, form.password);
    if (res.success) navigate(res.role === 'admin' ? '/admin' : '/');
    else setLocalError(res.error);
  };

  const handleForgotEmail = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!form.email) return setLocalError('Please enter your email');
    const res = await forgotPassword(form.email);
    if (res.success) {
      setSuccessMsg('OTP sent to your email.');
      setStep('forgot_otp');
    } else setLocalError(res.error);
  };

  const handleForgotOtp = async (e) => {
    e.preventDefault();
    clearMessages();
    const res = await verifyResetOtp(form.email, form.otp);
    if (res.success) {
      setSuccessMsg('OTP verified. Please create a new password.');
      setStep('forgot_reset');
    } else setLocalError(res.error);
  };

  const handleForgotReset = async (e) => {
    e.preventDefault();
    clearMessages();
    if (form.newPassword !== form.confirmPassword) {
      return setLocalError('Passwords do not match');
    }
    if (form.newPassword.length < 6) {
      return setLocalError('Password must be at least 6 characters');
    }
    const res = await resetPassword(form.email, form.otp, form.newPassword);
    if (res.success) {
      setSuccessMsg('Password reset successfully! You can now login.');
      setStep('login');
      setForm({ ...form, password: '', otp: '', newPassword: '', confirmPassword: '' });
    } else setLocalError(res.error);
  };

  const displayError = localError || (step === 'login' && error);

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative background elements for login page */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 relative z-10">
        
        {step !== 'login' && (
          <button 
            onClick={() => { setStep('login'); clearMessages(); }}
            className="absolute top-6 left-6 text-brand-text-muted hover:text-brand-orange transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}

        <div className="flex flex-col items-center mb-8 mt-2">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Zesto" className="h-16 object-contain rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-2 tracking-tight">
            {step === 'login' ? 'Welcome Back' : step === 'forgot_reset' ? 'Create New Password' : 'Reset Password'}
          </h1>
          <p className="text-sm text-brand-text-muted mt-1 text-center">
            {step === 'login' && 'Login to your account to continue'}
            {step === 'forgot_email' && 'Enter your email to receive an OTP'}
            {step === 'forgot_otp' && 'Enter the OTP sent to your email'}
            {step === 'forgot_reset' && 'Enter your new secure password'}
          </p>
        </div>

        {/* --- LOGIN FORM --- */}
        {step === 'login' && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-brand-text-muted block mb-1.5 uppercase tracking-wide">Email</label>
              <input
                name="email" type="email" value={form.email} onChange={handleChange} required
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all bg-gray-50 hover:bg-white focus:bg-white placeholder-gray-400"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wide">Password</label>
                <button type="button" onClick={() => { setStep('forgot_email'); clearMessages(); }} className="text-xs font-semibold text-brand-orange hover:underline hover:text-orange-400">
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  name="password" type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={handleChange} required
                  placeholder="Your password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all bg-gray-50 hover:bg-white focus:bg-white pr-12 placeholder-gray-400"
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
            
            {successMsg && (
              <div className="bg-green-500/10 text-green-400 text-xs font-semibold px-3 py-2 rounded-lg border border-green-500/20 text-center">
                {successMsg}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-brand-blue text-white font-bold py-3.5 rounded-xl text-sm shadow-md hover:shadow-lg hover:bg-blue-700 transition-all disabled:opacity-60 disabled:hover:shadow-md mt-2 hover:-translate-y-0.5">
              {loading ? 'Logging in...' : 'Login Securely'}
            </button>
            
            <p className="text-center text-sm text-brand-text-muted pt-4">
              Don't have an account?{' '}
              <Link to="/signup" className="text-brand-blue font-bold hover:underline underline-offset-2">Sign Up</Link>
            </p>
          </form>
        )}

        {/* --- FOR শকGOT EMAIL FORM --- */}
        {step === 'forgot_email' && (
          <form onSubmit={handleForgotEmail} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-brand-text-muted block mb-1.5 uppercase tracking-wide">Email</label>
              <input
                name="email" type="email" value={form.email} onChange={handleChange} required
                placeholder="Enter your registered email"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all bg-gray-50 hover:bg-white focus:bg-white placeholder-gray-400"
              />
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
        )}

        {/* --- FORGOT OTP FORM --- */}
        {step === 'forgot_otp' && (
          <form onSubmit={handleForgotOtp} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-brand-text-muted block mb-1.5 uppercase tracking-wide">Enter OTP</label>
              <input
                name="otp" type="text" value={form.otp} onChange={handleChange} required maxLength={6}
                placeholder="6-digit OTP"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center tracking-widest text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all bg-gray-50 hover:bg-white focus:bg-white placeholder-gray-400"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">Sent to {form.email}</p>
            </div>
            
            {displayError && (
              <div className="bg-red-500/10 text-red-400 text-xs font-semibold px-3 py-2 rounded-lg border border-red-500/20 text-center">
                {displayError}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-500/10 text-green-400 text-xs font-semibold px-3 py-2 rounded-lg border border-green-500/20 text-center">
                {successMsg}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-brand-blue text-white font-bold py-3.5 rounded-xl text-sm shadow-md hover:shadow-lg hover:bg-blue-700 transition-all disabled:opacity-60 disabled:hover:shadow-md mt-2 hover:-translate-y-0.5">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {/* --- FORGOT RESET PASSWORD FORM --- */}
        {step === 'forgot_reset' && (
          <form onSubmit={handleForgotReset} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-brand-text-muted block mb-1.5 uppercase tracking-wide">New Password</label>
              <div className="relative">
                <input
                  name="newPassword" type={showNewPass ? 'text' : 'password'} value={form.newPassword}
                  onChange={handleChange} required minLength={6}
                  placeholder="New password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all bg-gray-50 hover:bg-white focus:bg-white pr-12 placeholder-gray-400"
                />
                <button type="button" onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-orange transition-colors">
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-brand-text-muted block mb-1.5 uppercase tracking-wide">Confirm New Password</label>
              <div className="relative">
                <input
                  name="confirmPassword" type={showConfirmPass ? 'text' : 'password'} value={form.confirmPassword}
                  onChange={handleChange} required minLength={6}
                  placeholder="Confirm password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all bg-gray-50 hover:bg-white focus:bg-white pr-12 placeholder-gray-400"
                />
                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-orange transition-colors">
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            {displayError && (
              <div className="bg-red-500/10 text-red-400 text-xs font-semibold px-3 py-2 rounded-lg border border-red-500/20 text-center">
                {displayError}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-500/10 text-green-400 text-xs font-semibold px-3 py-2 rounded-lg border border-green-500/20 text-center">
                {successMsg}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-brand-blue text-white font-bold py-3.5 rounded-xl text-sm shadow-md hover:shadow-lg hover:bg-blue-700 transition-all disabled:opacity-60 disabled:hover:shadow-md mt-2 hover:-translate-y-0.5">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

