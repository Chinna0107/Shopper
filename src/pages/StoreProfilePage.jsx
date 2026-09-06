import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, MapPin, Search } from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function StoreProfilePage() {
  const { vendorId } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStoreData();
  }, [vendorId]);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const [storeRes, productsRes] = await Promise.all([
        api.get(`/vendors/public/${vendorId}`),
        api.get(`/vendors/public/${vendorId}/products`)
      ]);
      setStore(storeRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error('Failed to fetch store data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#012980]/20 border-t-[#012980] rounded-full animate-spin" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-20">
        <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h2>
        <p className="text-gray-500 mb-6">The store you're looking for doesn't exist or is currently inactive.</p>
        <Link to="/" className="text-brand-navy font-semibold hover:underline">Return to Home</Link>
      </div>
    );
  }

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Store Header / Banner */}
      <div className="bg-white border-b border-gray-100 shadow-sm relative">
        <div className="h-48 md:h-64 lg:h-80 w-full bg-gray-200 relative overflow-hidden">
          {store.store_image ? (
            <img src={store.store_image} alt={store.store_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-brand-navy/10 to-brand-navy/5 flex items-center justify-center">
              <Store className="w-20 h-20 text-brand-navy/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 md:-mt-24 pb-8">
          <div className="flex flex-col md:flex-row gap-6 md:items-end">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden shrink-0 flex items-center justify-center relative z-10">
              {store.store_image ? (
                <img src={store.store_image} alt={store.store_name} className="w-full h-full object-cover" />
              ) : (
                <Store className="w-12 h-12 text-brand-navy/40" />
              )}
            </div>
            
            <div className="flex-1 pb-2">
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight font-serif mb-2">{store.store_name}</h1>
              {store.address && (
                <p className="flex items-center gap-2 text-gray-600 font-medium">
                  <MapPin className="w-4 h-4" />
                  {store.address}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Store Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search in store..." 
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy w-full sm:w-64"
            />
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg font-medium">No products found</p>
            {search && <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>}
          </div>
        )}
      </div>
    </div>
  );
}
