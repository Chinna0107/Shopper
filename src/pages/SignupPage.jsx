import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, ShieldCheck, CheckCircle2, Tag } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import logo from '../assets/logo.png';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-5 h-5">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, verifyOtp, loginWithGoogle, loading, error } = useAuthStore();

  const [step, setStep] = useState('form');
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', referralCode: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [localError, setLocalError] = useState('');
  const [referrer, setReferrer] = useState(null);
  const otpRefs = useRef([]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    const code = form.referralCode?.trim();
    if (!code) {
      setReferrer(null);
      return;
    }
    
    if (code.length < 3) return;

    setReferrer({ status: 'checking' });
    const timer = setTimeout(async () => {
      const res = await useAuthStore.getState().checkReferralCode(code);
      if (res.valid) {
        setReferrer({ status: 'valid', name: res.name });
      } else {
        setReferrer({ status: 'invalid' });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [form.referralCode]);

  const handleSignup = async (e) => {
    e.preventDefault(); setLocalError('');
    const res = await signup(form.name, form.email, form.phone, form.password, form.referralCode);
    if (res.success) setStep('otp');
    else setLocalError(res.error);
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[idx] = val; setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault(); setLocalError('');
    const code = otp.join('');
    if (code.length < 6) return setLocalError('Enter all 6 digits');
    const res = await verifyOtp(form.email, code);
    if (res.success) navigate('/');
    else setLocalError(res.error);
  };

  const displayError = localError || error;

  const inputClass = "w-full border-2 border-gray-100 rounded-2xl px-4 py-3.5 pl-11 text-[15px] text-gray-900 focus:outline-none focus:border-[#0b162c] focus:bg-white transition-all bg-gray-50 placeholder-gray-400 font-medium";

  const perks = ['Premium ethnic wear', 'Exclusive festive offers', 'Free replacements & exchanges'];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: '#0b162c' }}>

      {/* ── LEFT / TOP HERO ── */}
      <div className="relative flex flex-col items-center justify-center pt-12 pb-24 lg:py-12 px-6 overflow-hidden lg:w-1/2 lg:min-h-screen">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border border-white/[0.06]" />
          <div className="absolute bottom-8 left-[-40px] w-48 h-48 rounded-full border border-brand-navy/[0.08]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-navy/[0.06] rounded-full blur-3xl" />
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 rounded-full bg-brand-navy/25"
              style={{ top: `${8 + i * 11}%`, left: `${5 + i * 12}%` }} />
          ))}
        </div>

        <button onClick={() => navigate('/login')}
          className="absolute top-5 left-5 z-10 flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-medium transition-colors bg-white/[0.07] px-3 py-1.5 rounded-full border border-white/10">
          <ArrowLeft className="w-3.5 h-3.5" /> Login
        </button>

        <div className="relative z-10 flex-col items-center text-center lg:mt-0 hidden lg:flex">
          <div className="relative mb-6 lg:mb-8">
            <div className="w-[100px] h-[100px] lg:w-[140px] lg:h-[140px] rounded-[1.75rem] lg:rounded-[2.5rem] bg-white border border-gray-100 flex items-center justify-center shadow-xl p-2.5 lg:p-4">
              <img src={logo} alt="SWABHIVAR" className="h-full w-full object-contain" />
            </div>
            <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-brand-navy to-blue-500 rounded-full border-[3px] border-[#0b162c] flex items-center justify-center shadow-md">
              <span className="text-white text-[10px] lg:text-[14px] font-black">✦</span>
            </div>
          </div>
          <h1 className="text-white text-[22px] lg:text-[32px] font-extrabold tracking-widest drop-shadow-md" style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.15em' }}>
            SWABHIVAR
          </h1>
          <p className="text-white/80 text-[10px] lg:text-[12px] font-bold tracking-[0.25em] uppercase mt-1 lg:mt-2">Your Choice, From Anywhere.</p>

          {step === 'form' && (
            <div className="mt-8 space-y-3 hidden lg:block text-left">
              {perks.map(p => (
                <div key={p} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-white/90 text-[14px] font-medium">{p}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── FORM CARD ── */}
      <div className="flex-1 bg-white rounded-t-[2.5rem] lg:rounded-none lg:rounded-l-[3rem] -mt-10 lg:mt-0 relative z-10 px-5 pt-2 lg:pt-10 pb-10 shadow-[0_-20px_60px_rgba(0,0,0,0.25)] lg:shadow-[-20px_0_60px_rgba(0,0,0,0.25)] flex flex-col justify-center lg:w-1/2">
        <div className="max-w-sm mx-auto w-full">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-2 mb-6 lg:hidden" />

          {/* Mobile only branding overlap */}
          <div className="flex flex-col items-center mb-6 text-center lg:hidden -mt-16">
            <div className="relative mb-3">
              <div className="w-[80px] h-[80px] rounded-[1.25rem] bg-white border border-gray-100 flex items-center justify-center shadow-lg p-2">
                <img src={logo} alt="SWABHIVAR" className="h-full w-full object-contain" />
              </div>
            </div>
            
            {step === 'form' && (
              <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1">
                {perks.map(p => (
                  <div key={p} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-brand-navy" />
                    <span className="text-gray-600 text-[10px] font-medium">{p}</span>
                  </div>
                ))}
              </div>
            )}
          </div>



          {step === 'form' ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-[#0b162c]" style={{ fontFamily: 'Georgia, serif' }}>Create Account ✨</h2>
                <p className="text-[13px] text-gray-500 mt-1.5">Join thousands of happy SWABHIVAR shoppers</p>
              </div>

              {displayError && (
                <div className="mb-5 bg-red-50 text-red-600 text-[13px] font-semibold px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2">
                  <span className="w-5 h-5 bg-red-500 rounded-full text-white flex items-center justify-center text-[10px] font-black shrink-0">!</span>
                  {displayError}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-3.5">
                {[
                  { icon: <User className="w-4 h-4 text-gray-400" />, name: 'name', type: 'text', placeholder: 'Full name', required: true },
                  { icon: <Mail className="w-4 h-4 text-gray-400" />, name: 'email', type: 'email', placeholder: 'Email address', required: true },
                  { icon: <Phone className="w-4 h-4 text-gray-400" />, name: 'phone', type: 'tel', placeholder: 'Phone number (+91...)', required: true },
                  { icon: <Tag className="w-4 h-4 text-gray-400" />, name: 'referralCode', type: 'text', placeholder: 'Referral Code (Optional)', required: false },
                ].map(f => (
                  <div key={f.name} className="relative">
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">{f.icon}</span>
                      <input name={f.name} type={f.type} value={form[f.name]} onChange={handleChange}
                        required={f.required} placeholder={f.placeholder} className={inputClass} />
                    </div>
                    {f.name === 'referralCode' && referrer?.status === 'valid' && (
                      <div className="mt-1.5 ml-2 flex items-center gap-1.5 text-green-600 text-[12px] font-semibold animate-in fade-in slide-in-from-top-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Referred by: {referrer.name}
                      </div>
                    )}
                    {f.name === 'referralCode' && referrer?.status === 'invalid' && (
                      <div className="mt-1.5 ml-2 text-red-500 text-[12px] font-medium animate-in fade-in slide-in-from-top-1">
                        Invalid referral code
                      </div>
                    )}
                    {f.name === 'referralCode' && referrer?.status === 'checking' && (
                      <div className="mt-1.5 ml-2 flex items-center gap-1.5 text-gray-500 text-[12px] font-medium">
                        <span className="w-3.5 h-3.5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" /> Checking...
                      </div>
                    )}
                  </div>
                ))}
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input name="password" type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={handleChange} required minLength={6} placeholder="Password (min. 6 characters)" className={inputClass + ' pr-12'} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-navy transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-brand-navy to-yellow-400 text-white font-bold py-4 rounded-2xl text-[15px] shadow-[0_4px_20px_rgba(254,102,3,0.4)] hover:shadow-[0_8px_30px_rgba(254,102,3,0.5)] hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-1">
                  {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending OTP...</> : 'Continue →'}
                </button>
              </form>

              {/* Google button below form */}
              <div className="flex items-center gap-3 mt-5 mb-4">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[11px] text-gray-400 font-medium px-1">or continue with</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <button onClick={loginWithGoogle}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-2xl text-[15px] transition-all shadow-sm hover:shadow-md active:scale-[0.98] mb-5">
                <GoogleIcon />
                Continue with Google
              </button>

              <div className="flex items-center gap-3 mt-5 mb-4">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[11px] text-gray-400 font-medium">Already a member?</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <Link to="/login"
                className="flex items-center justify-center w-full border-2 border-[#0b162c]/15 text-[#0b162c] font-bold py-3.5 rounded-2xl text-[15px] hover:bg-[#0b162c]/5 hover:border-[#0b162c]/40 transition-all">
                Login
              </Link>
            </>
          ) : (
            <>
              <div className="mb-8 text-center">
                <div className="w-16 h-16 rounded-full bg-brand-navy/5 border border-brand-navy/10 flex items-center justify-center mx-auto mb-5">
                  <ShieldCheck className="w-8 h-8 text-brand-navy" />
                </div>
                <h2 className="text-2xl font-extrabold text-[#0b162c]" style={{ fontFamily: 'Georgia, serif' }}>Verify Email</h2>
                <p className="text-[13px] text-gray-500 mt-2">We've sent a 6-digit code to</p>
                <p className="text-[#0b162c] font-bold text-[14px] mt-0.5">{form.email}</p>
              </div>

              {displayError && (
                <div className="mb-5 bg-red-50 text-red-600 text-[13px] font-semibold px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2">
                  <span className="w-5 h-5 bg-red-500 rounded-full text-white flex items-center justify-center text-[10px] font-black shrink-0">!</span>
                  {displayError}
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-6">
                <div className="flex justify-between gap-2 max-w-xs mx-auto">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpRefs.current[idx] = el)}
                      type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      className={`w-12 h-14 text-center text-xl font-extrabold rounded-2xl border-2 focus:outline-none transition-all
                        ${digit ? 'border-brand-navy text-brand-navy shadow-[0_0_0_4px_rgba(254,102,3,0.12)] bg-[#0b162c]/5' : 'border-gray-200 bg-gray-50 text-[#0b162c] focus:border-[#0b162c] focus:bg-white focus:shadow-[0_0_0_4px_rgba(11,22,44,0.08)]'}`}
                    />
                  ))}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-[#0b162c] to-[#1a2d52] text-white font-bold py-4 rounded-2xl text-[15px] shadow-[0_4px_20px_rgba(11,22,44,0.3)] hover:shadow-[0_8px_30px_rgba(11,22,44,0.4)] hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying...</> : 'Verify & Create Account →'}
                </button>

                <button type="button" onClick={() => { setStep('form'); setOtp(['','','','','','']); }}
                  className="flex items-center justify-center gap-1 w-full text-[13px] text-gray-400 hover:text-[#0b162c] font-medium transition-colors pt-2">
                  <ArrowLeft className="w-3.5 h-3.5" /> Change my details
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
