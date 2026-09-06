const fs = require('fs');
let code = fs.readFileSync('src/pages/vendor/VendorSignupPage.jsx', 'utf8');

const oldCode = `  const [referrer, setReferrer] = useState({ status: 'idle', name: '' });

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

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', storeName: '', storeAddress: '', otp: '', referralCode: ''
  });`;

const newCode = `  const [formData, setFormData] = useState({
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
  }, [formData.referralCode]);`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('src/pages/vendor/VendorSignupPage.jsx', code);
console.log('Fixed VendorSignupPage');
