import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { AdBanner } from '../components/AdBanner';
import { useStoreData } from '../store/useStoreData';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import imgHeroBanner from '../assets/hero_banner.png';
import imgHeroBannerPremium from '../assets/hero_banner_premium.jpg';
import imgAarti from '../assets/story_aarti.png';

export function HomePage() {
  const container = useRef(null);
  const { products, categories, loading } = useStoreData();
  const [banners, setBanners] = React.useState([]);

  React.useEffect(() => {
    const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";
    fetch(`${url}/general/banners`)
      .then(r => r.json())
      .then(d => { if (d.banners) setBanners(d.banners); })
      .catch(e => console.error(e));
  }, []);
  
  useGSAP(() => {
    if (!loading) {
      gsap.from('.animate-section', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        clearProps: 'all'
      });
    }
  }, { scope: container, dependencies: [loading] });

  return (
    <div ref={container} className="bg-white min-h-screen pb-20">
      <Header variant="home" />
      
      <div className="max-w-[1280px] mx-auto px-4 pt-6 mt-2">
        {/* Wallet and Points Cards */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-orange-50/30 rounded-2xl p-4 border border-orange-100/50 shadow-[0_2px_15px_rgba(228,123,37,0.04)] flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-brand-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/>
                  <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/>
                  <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/>
                </svg>
              </div>
              <span className="text-[11px] font-bold text-gray-600 tracking-wider">WALLET</span>
            </div>
            <span className="text-2xl font-serif font-bold text-brand-orange" style={{ fontFamily: 'Georgia, serif' }}>₹1,240</span>
          </div>
          
          <div className="flex-1 bg-orange-50/30 rounded-2xl p-4 border border-orange-100/50 shadow-[0_2px_15px_rgba(228,123,37,0.04)] flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-brand-orange" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <span className="text-[11px] font-bold text-gray-600 tracking-wider">POINTS</span>
            </div>
            <span className="text-2xl font-serif font-bold text-brand-orange" style={{ fontFamily: 'Georgia, serif' }}>2,450</span>
          </div>
        </div>
      </div>

      {/* 1. Hero Banner Carousel */}
      <div className="animate-section px-4 md:px-6 mb-8 max-w-[1280px] mx-auto mt-2 md:mt-4">
        {banners.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 mt-6">
            {banners.map((banner) => (
              <div key={banner.id} className="relative w-full shrink-0 snap-center rounded-3xl md:rounded-[3rem] overflow-hidden bg-white border border-gray-100 shadow-md h-[260px] sm:h-[320px] md:h-[480px] group">
                {/* Background image with subtle zoom on hover */}
                <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out" />
                
                {/* Light Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent flex flex-col justify-center px-6 sm:px-10 md:px-20">
                  
                  <h2 className="relative z-10 text-gray-900 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold mb-3 md:mb-6 max-w-2xl leading-[1.1] tracking-tight">
                    {banner.title}
                  </h2>
                  {(banner.link_url || banner.link_url === '') && (
                    <Link to={banner.link_url || "/category/all"} className="relative z-10 bg-[#022A21] text-white text-sm md:text-base lg:text-lg font-bold px-6 md:px-10 py-3 rounded-xl shadow-md w-fit hover:scale-105 hover:bg-[#034435] transition-all flex items-center gap-3 group/btn">
                      Shop Now <span className="text-xl group-hover/btn:translate-x-1 transition-transform">→</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative w-full rounded-3xl md:rounded-[3rem] overflow-hidden bg-white border border-gray-100 shadow-md h-[260px] sm:h-[320px] md:h-[480px] mt-6 group">
            {/* Fallback Image */}
            <img src={imgHeroBannerPremium} alt="Hero Banner" className="w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700 ease-out" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end px-6 py-8">
              <div className="mb-2">
                <span className="bg-brand-orange text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  SILK EDIT
                </span>
              </div>
              <h2 className="relative z-10 text-white text-3xl sm:text-4xl font-serif font-bold mb-2 max-w-[200px] leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
                Kanjeevaram<br/>Heirlooms
              </h2>
              <p className="relative z-10 text-brand-orange font-medium text-sm">
                Up to 50% off
              </p>
              
              <div className="absolute bottom-6 right-6 flex gap-1.5">
                <div className="w-4 h-1.5 rounded-full bg-brand-orange"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Categories Ribbon */}
      <div className="animate-section z-30 mb-8 px-2 overflow-x-auto hide-scrollbar mt-4">
        <div className="flex gap-4 md:gap-8 justify-start md:justify-center min-w-max mx-auto px-4">
          {categories.slice(0, 10).map(cat => (
            <Link key={cat.id} to={`/category/${cat.id}`} className="flex flex-col items-center gap-3 group w-20 md:w-24">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center p-3 border border-gray-100 shadow-sm transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1 group-hover:border-brand-orange group-hover:shadow-md">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-contain relative z-10 mix-blend-multiply" />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-full"></div>
                )}
                <div className="absolute inset-0 bg-brand-orange/0 group-hover:bg-brand-orange/5 transition-colors duration-300"></div>
              </div>
              <span className="text-[12px] font-medium text-gray-700 text-center group-hover:text-brand-orange transition-colors leading-tight line-clamp-2">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6">
        
        {/* Unified Transparent Block */}
        <div className="animate-section mb-12 flex flex-col gap-8 md:gap-10">
          


          {/* Best Sellers */}
          {products.filter(p => p.is_bestseller).length > 0 && (
            <div>
              <div className="flex justify-between items-center px-4 py-4 mb-4 border-b border-gray-100 bg-white rounded-t-2xl shadow-sm">
                <h3 className="text-xl md:text-2xl font-bold text-[#022A21] tracking-tight font-serif">Best Selling</h3>
                <Link to="/collection/best-sellers" className="text-brand-orange hover:text-orange-700 text-sm md:text-base font-semibold flex items-center gap-2 transition-colors">View All →</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {products.filter(p => p.is_bestseller).slice(0, 6).map(product => (
                  <div key={product.id} className="hover:-translate-y-2 transition-transform duration-300 h-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Middle Advertisement Block */}
          <div className="rounded-[1.5rem] overflow-hidden bg-white shadow-sm border border-gray-100">
            <AdBanner 
              imageUrl={imgAarti} 
              altText="Middle Ad" 
              link="/category/all" 
            />
          </div>

          {/* Trending */}
          {products.filter(p => p.is_trending).length > 0 && (
            <div>
              <div className="flex justify-between items-center px-2 py-4 mb-4 border-b border-gray-100">
                <h3 className="text-xl md:text-2xl font-bold text-[#022A21] tracking-tight font-serif">Trending Now</h3>
                <Link to="/collection/trending" className="text-brand-orange hover:text-orange-700 text-sm md:text-base font-semibold flex items-center gap-2 transition-colors">View All →</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {products.filter(p => p.is_trending).slice(0, 6).map(product => (
                  <div key={product.id} className="hover:-translate-y-2 transition-transform duration-300 h-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Festive Collection */}
          {products.filter(p => ['Sarees', 'Lehengas', 'Ethnic Sets', 'Gowns'].includes(p.category)).length > 0 && (
            <div>
              <div className="flex justify-between items-center px-4 py-4 mb-4 border-b border-gray-100 bg-orange-50/50 rounded-t-2xl shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl md:text-2xl text-brand-orange">✨</span>
                  <h3 className="text-xl md:text-2xl font-bold text-brand-orange tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>Festive Collection</h3>
                </div>
                <Link to="/collection/festive" className="text-brand-orange hover:text-orange-700 text-sm md:text-base font-semibold flex items-center gap-2 transition-colors">View All →</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {products.filter(p => ['Sarees', 'Lehengas', 'Ethnic Sets', 'Gowns'].includes(p.category)).slice(0, 6).map(product => (
                  <div key={product.id} className="hover:-translate-y-2 transition-transform duration-300 h-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories horizontally scrolling products */}
          {categories.map((cat) => {
            const catProducts = products.filter(p => p.category === cat.name);
            if (catProducts.length === 0) return null;
            return (
              <div key={cat.id}>
                <div className="flex justify-between items-center px-2 py-4 mb-4 border-b border-gray-100">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#022A21] tracking-tight font-serif">{cat.name}</h3>
                  <Link to={`/category/${cat.id}`} className="text-brand-orange hover:text-orange-700 text-sm md:text-base font-semibold flex items-center gap-2 transition-colors">View All →</Link>
                </div>
                <div className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-4 snap-x">
                  {catProducts.slice(0, 8).map(product => (
                    <div key={product.id} className="w-[160px] md:w-[220px] shrink-0 snap-start hover:-translate-y-2 transition-transform duration-300 h-full">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          {/* Customer Reviews */}
          <div className="mb-12 mt-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-[#022A21] mb-2 font-serif" style={{ fontFamily: 'Georgia, serif' }}>What Our Customers Say</h3>
              <p className="text-gray-500">Trusted by thousands of happy shoppers.</p>
            </div>
            
            <div className="flex gap-6 overflow-x-auto snap-x hide-scrollbar pb-4 px-2">
              {[
                { name: "Priya Sharma", rating: 5, review: "Absolutely in love with the silk saree I bought! The quality is top-notch and the delivery was super fast." },
                { name: "Anjali Verma", rating: 5, review: "The festive collection is amazing. Bought a lehenga for my sister's wedding and everyone complimented it." },
                { name: "Sneha Reddy", rating: 4, review: "Great products and good prices. The cotton kurti fits perfectly and is very comfortable." },
                { name: "Riya Kapoor", rating: 5, review: "SWABHIVAR SHOPPER never disappoints. The app is so easy to use and the customer service is excellent." }
              ].map((rev, idx) => (
                <div key={idx} className="w-[280px] shrink-0 snap-start bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 mb-3 text-brand-orange text-lg">
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed italic">"{rev.review}"</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="font-bold text-gray-900 text-sm">{rev.name}</p>
                    <p className="text-xs text-gray-400">Verified Buyer</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Features Block (Free Delivery, etc) */}
          <div className="bg-white p-6 md:p-8 rounded-3xl mt-8 mb-4 shadow-sm border border-gray-100">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-x-0 md:divide-x divide-gray-100">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 px-4 text-center md:text-left">
                   <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-2xl border border-emerald-100">✈️</div>
                   <div>
                     <h4 className="text-gray-900 font-semibold">Free Delivery</h4>
                     <p className="text-gray-500 text-xs md:text-sm">On orders over $50</p>
                   </div>
                </div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 px-4 text-center md:text-left">
                   <div className="w-12 h-12 rounded-full bg-[#022A21]/10 flex items-center justify-center text-[#022A21] text-2xl border border-[#022A21]/20">🔄</div>
                   <div>
                     <h4 className="text-gray-900 font-semibold">Easy Returns</h4>
                     <p className="text-gray-500 text-xs md:text-sm">30 days return policy</p>
                   </div>
                </div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 px-4 text-center md:text-left">
                   <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 text-2xl border border-green-100">🔒</div>
                   <div>
                     <h4 className="text-gray-900 font-semibold">Secure Payments</h4>
                     <p className="text-gray-500 text-xs md:text-sm">100% secure checkout</p>
                   </div>
                </div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 px-4 text-center md:text-left">
                   <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500 text-2xl border border-yellow-100">🏆</div>
                   <div>
                     <h4 className="text-gray-900 font-semibold">Best Prices</h4>
                     <p className="text-gray-500 text-xs md:text-sm">Guaranteed deals</p>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>

    </div>
  );
}
