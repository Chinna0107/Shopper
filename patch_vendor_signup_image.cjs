const fs = require('fs');
let code = fs.readFileSync('src/pages/vendor/VendorSignupPage.jsx', 'utf8');

if (!code.includes('storeImage')) {
  // Add state
  const oldState = `  const [formData, setFormData] = useState({`;
  const newState = `  const [storeImage, setStoreImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({`;
  code = code.replace(oldState, newState);

  // Add upload logic
  const uploadFn = `  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(\`\${BACKEND_URL}/admin/upload\`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) {
        setStoreImage(data.url);
        toast.success('Store image uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (err) {
      toast.error('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSignup = async (e) => {`;
  code = code.replace(`  const handleSignup = async (e) => {`, uploadFn);

  // Modify payload
  const oldPayload = `plan_id: selectedPlan.id, payment_id: paymentId, referral_code: formData.referralCode,`;
  const newPayload = `plan_id: selectedPlan.id, payment_id: paymentId, referral_code: formData.referralCode, store_image: storeImage,`;
  code = code.replace(oldPayload, newPayload);

  // Add UI for image upload
  const oldUI = `                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Store / Business Name</label>
                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} required
                      className="block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-[16px] text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#012980]/30 focus:border-[#012980] transition-all shadow-inner"
                      placeholder="My Awesome Store" />
                  </div>
                </div>`;
  const newUI = `                <div>
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
                </div>`;
  code = code.replace(oldUI, newUI);
  
  // Need to import XCircle if not already imported
  if (!code.includes("XCircle")) {
    code = code.replace("lucide-react';", "XCircle } from 'lucide-react';");
  }

  fs.writeFileSync('src/pages/vendor/VendorSignupPage.jsx', code);
  console.log('patched VendorSignupPage.jsx for image upload');
} else {
  console.log('Already patched');
}
