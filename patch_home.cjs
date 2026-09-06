const fs = require('fs');
let code = fs.readFileSync('src/pages/HomePage.jsx', 'utf8');

// Add stores state
if (!code.includes("const [stores, setStores]")) {
  code = code.replace(
    "const [products, setProducts] = useState([]);",
    "const [products, setProducts] = useState([]);\n  const [stores, setStores] = useState([]);"
  );
  
  // Add fetch for stores
  const oldFetch = `      const res = await api.get('/public/products');
      setProducts(res.data);
      setLoading(false);`;
  const newFetch = `      const res = await api.get('/public/products');
      setProducts(res.data);
      
      try {
        const storeRes = await api.get('/vendors/public');
        setStores(storeRes.data);
      } catch (err) {
        console.error('Failed to fetch stores', err);
      }
      
      setLoading(false);`;
  code = code.replace(oldFetch, newFetch);

  // Add Stores section before the closing tag of the main container
  const storesSection = `
          {/* Featured Stores */}
          {stores.length > 0 && (
            <div className="mt-8 mb-12">
              <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4 px-2">
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight font-serif mb-1">Featured Stores</h2>
                  <p className="text-gray-500 text-sm md:text-base font-medium">Discover unique collections from our top vendors</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {stores.map(store => (
                  <Link to={\`/store/\${store.id}\`} key={store.id} className="group block h-full">
                    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                      <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                        {store.store_image ? (
                          <img src={store.store_image} alt={store.store_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-brand-navy/20">
                            <Store className="w-12 h-12" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-brand-navy transition-colors line-clamp-1">{store.store_name}</h3>
                        <span className="text-xs text-brand-navy font-semibold uppercase tracking-wider mt-2 bg-brand-navy/5 px-3 py-1 rounded-full">Visit Store</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
`;
  // We need to inject this right before the last closing tags of HomePage.
  // We can search for the end of the `categories.map` block.
  const insertPoint = `          {categories.map((cat) => {`;
  code = code.replace(insertPoint, storesSection + insertPoint);

  fs.writeFileSync('src/pages/HomePage.jsx', code);
  console.log('patched HomePage.jsx');
} else {
  console.log('Already patched');
}
