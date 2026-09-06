const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

if (!code.includes('StoreProfilePage')) {
  // Add import
  code = code.replace(
    "import ProductDetailsPage from './pages/ProductDetailsPage';",
    "import ProductDetailsPage from './pages/ProductDetailsPage';\nimport StoreProfilePage from './pages/StoreProfilePage';"
  );
  
  // Add Route
  code = code.replace(
    '<Route path="/product/:id" element={<ProductDetailsPage />} />',
    '<Route path="/product/:id" element={<ProductDetailsPage />} />\n              <Route path="/store/:vendorId" element={<StoreProfilePage />} />'
  );
  
  fs.writeFileSync('src/App.jsx', code);
  console.log('patched App.jsx');
}
