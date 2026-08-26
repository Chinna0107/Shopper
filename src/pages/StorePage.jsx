import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { useStoreData } from '../store/useStoreData';
import { MapPin, Star, Clock, Phone, ChevronRight } from 'lucide-react';

export function StorePage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useStoreData();
  
  // Use products from the store for this demo
  const storeProducts = products.slice(0, 8);

  const storeInfo = {
    name: 'Swabhivar Signature Store',
    rating: 4.8,
    reviews: 124,
    address: 'Madhapur, Hyderabad - 500081',
    timing: '10:00 AM - 9:00 PM (Open Now)',
    phone: '+91 98765 43210',
    coverImage: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=200&q=80'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f9f9f9]">
        <div className="w-8 h-8 border-4 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] pb-20">
      <Header title={storeInfo.name} showShare={true} />
      
      {/* Store Hero Banner */}
      <div className="relative bg-white shadow-sm border-b border-gray-100 z-10 -mt-1 rounded-b-3xl overflow-hidden pb-6">
        <div className="h-40 md:h-64 w-full relative">
          <img 
            src={storeInfo.coverImage} 
            alt={storeInfo.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 flex items-end gap-4">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-white p-1 shadow-lg shrink-0 overflow-hidden">
              <img src={storeInfo.logo} alt="Store Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="text-white pb-1 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Premium Vendor</span>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold">{storeInfo.rating}</span>
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold font-serif leading-tight">{storeInfo.name}</h1>
            </div>
          </div>
        </div>
        
        {/* Store Details Box */}
        <div className="max-w-7xl mx-auto px-4 mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-[#0b162c]/10 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-[#0b162c]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Location</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{storeInfo.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-[#0b162c]/10 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-[#0b162c]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Timing</p>
              <p className="text-sm font-semibold text-green-600 truncate">{storeInfo.timing}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-[#0b162c]/10 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-[#0b162c]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Contact</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{storeInfo.phone}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Store Products */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#0b162c] font-serif flex items-center gap-2">
            <span className="w-1.5 h-6 bg-brand-orange rounded-full inline-block shadow-sm"></span>
            Products from {storeInfo.name.split(' ')[0]}
          </h2>
        </div>
        
        {storeProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {storeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">No products available in this store currently.</p>
          </div>
        )}
      </div>
    </div>
  );
}
