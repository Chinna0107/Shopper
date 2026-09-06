const fs = require('fs');
let code = fs.readFileSync('src/pages/vendor/VendorSignupPage.jsx', 'utf8');

// Add import
if (!code.includes("useAuthStore")) {
  code = code.replace(
    "import logo from '../../assets/logo.png';",
    "import logo from '../../assets/logo.png';\nimport { useAuthStore } from '../../store/useAuthStore';"
  );
}

// Add state and effect
const oldState = `  const [formData, setFormData] = useState({`;
const newState = `  const [referrer, setReferrer] = useState({ status: 'idle', name: '' });

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

  const [formData, setFormData] = useState({`;

code = code.replace(oldState, newState);

// Update UI
const oldUI = `                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Referral Code (Optional)</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" name="referralCode" value={formData.referralCode} onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-[16px] text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#012980]/30 focus:border-[#012980] transition-all shadow-inner"
                      placeholder="Enter referral code" />
                  </div>
                </div>`;

const newUI = `                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Referral Code (Optional)</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" name="referralCode" value={formData.referralCode} onChange={handleChange}
                      className={\`block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border \${referrer.status === 'invalid' ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : referrer.status === 'valid' ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20' : 'border-gray-200 focus:border-[#012980] focus:ring-[#012980]/30'} rounded-[16px] text-gray-900 focus:bg-white focus:ring-2 transition-all shadow-inner\`}
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
                </div>`;

code = code.replace(oldUI, newUI);

fs.writeFileSync('src/pages/vendor/VendorSignupPage.jsx', code);
console.log('patched VendorSignupPage.jsx');
