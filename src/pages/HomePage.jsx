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
    <div ref={container} className="bg-transparent min-h-screen pb-12">
      <Header variant="home" />
      
      {/* 1. Hero Banner Carousel */}
      <div className="animate-section px-4 md:px-6 mb-8 max-w-[1280px] mx-auto mt-6">
        {banners.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 mt-6">
            {banners.map((banner) => (
              <div key={banner.id} className="relative w-full shrink-0 snap-center rounded-[2.5rem] overflow-hidden bg-white border border-gray-100 shadow-md h-[320px] md:h-[500px] group">
                {/* Background image with subtle zoom on hover */}
                <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out" />
                
                {/* Light Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent flex flex-col justify-center px-8 md:px-24">
                  
                  <h2 className="relative z-10 text-gray-900 text-4xl md:text-7xl font-extrabold mb-4 md:mb-8 max-w-3xl leading-[1.1] tracking-tight">
                    {banner.title}
                  </h2>
                  {(banner.link_url || banner.link_url === '') && (
                    <Link to={banner.link_url || "/category/all"} className="relative z-10 bg-brand-blue text-white text-sm md:text-lg font-bold px-8 md:px-12 py-3 md:py-4 rounded-xl shadow-md w-fit hover:scale-105 hover:bg-blue-700 transition-all flex items-center gap-3 group/btn">
                      Shop Now <span className="text-xl group-hover/btn:translate-x-1 transition-transform">→</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white border border-gray-100 shadow-md h-[320px] md:h-[500px] mt-6 group">
            {/* Fallback Image */}
            <img src={imgHeroBannerPremium} alt="Hero Banner" className="w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700 ease-out" />
            
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent flex flex-col justify-center px-8 md:px-24">
              
              <h2 className="relative z-10 text-brand-blue text-4xl md:text-7xl font-extrabold mb-4 md:mb-6 max-w-2xl leading-[1.1] tracking-tight">
                SHOP SMART.<br/><span className="text-brand-orange">LIVE BETTER.</span>
              </h2>
              <p className="relative z-10 text-gray-700 mb-10 text-lg md:text-xl max-w-lg hidden md:block leading-relaxed">
                Top quality products. Best prices. Fast delivery.
              </p>
              
              <Link to="/category/all" className="relative z-10 group/btn bg-brand-blue text-white text-sm md:text-lg font-bold px-8 py-3 md:py-4 rounded-xl shadow-md w-fit hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-4">
                <span>Shop Now</span> 
                <span className="text-white leading-none font-bold text-xl group-hover/btn:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 2. Categories Ribbon */}
      <div className="animate-section z-30 mb-8 px-2 overflow-x-auto hide-scrollbar mt-4">
        <div className="flex gap-4 md:gap-8 justify-start md:justify-center min-w-max mx-auto px-4">
          {categories.map(cat => (
            <Link key={cat.id} to={`/category/${cat.id}`} className="flex flex-col items-center gap-3 group w-20 md:w-24">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center p-3 border border-gray-100 shadow-sm transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1 group-hover:border-brand-blue group-hover:shadow-md">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-contain relative z-10 mix-blend-multiply" />
                ) : (
                  <img src={imgHeroBanner} alt="Cat" className="w-full h-full object-cover opacity-20 relative z-10" />
                )}
                <div className="absolute inset-0 bg-brand-blue/0 group-hover:bg-brand-blue/5 transition-colors duration-300"></div>
              </div>
              <span className="text-[12px] font-medium text-gray-700 text-center group-hover:text-brand-blue transition-colors leading-tight line-clamp-2">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6">
        
        {/* Unified Transparent Block */}
        <div className="animate-section mb-12 flex flex-col gap-8 md:gap-10">
          
          {/* Flash Sale Banner Style - Single Row */}
          {products.filter(p => p.is_offer).length > 0 && (
            <div className="relative bg-white border border-gray-200 px-4 py-4 md:px-8 md:py-5 rounded-2xl shadow-sm flex flex-row items-center justify-between gap-3 w-full overflow-hidden">
               <div className="flex items-center gap-3 shrink-0 relative z-10">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                    <span className="text-xl md:text-2xl text-brand-orange">⚡</span>
                 </div>
                 <div className="flex flex-col">
                   <h3 className="text-base md:text-xl font-extrabold text-gray-900 tracking-wide">Deals of the Day</h3>
                 </div>
               </div>
               
               <div className="flex items-center ml-auto shrink-0 relative z-10">
                 <Link to="/collection/top-picks" className="text-brand-blue font-bold text-sm md:text-base flex items-center gap-1 hover:gap-2 transition-all">
                   View All <span>→</span>
                 </Link>
               </div>
            </div>
          )}

          {/* Best Sellers */}
          {products.filter(p => p.is_bestseller).length > 0 && (
            <div>
              <div className="flex justify-between items-center px-4 py-4 mb-4 border-b border-gray-100 bg-white rounded-t-2xl shadow-sm">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Best Selling</h3>
                <Link to="/collection/best-sellers" className="text-brand-blue hover:text-blue-700 text-sm md:text-base font-semibold flex items-center gap-2 transition-colors">View All →</Link>
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
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Trending Now</h3>
                <Link to="/collection/trending" className="text-brand-blue hover:text-blue-700 text-sm md:text-base font-semibold flex items-center gap-2 transition-colors">View All →</Link>
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

          {/* Categories horizontally scrolling products */}
          {categories.map((cat) => {
            const catProducts = products.filter(p => p.category === cat.name);
            if (catProducts.length === 0) return null;
            return (
              <div key={cat.id}>
                <div className="flex justify-between items-center px-2 py-4 mb-4 border-b border-gray-100">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{cat.name}</h3>
                  <Link to={`/category/${cat.id}`} className="text-brand-blue hover:text-blue-700 text-sm md:text-base font-semibold flex items-center gap-2 transition-colors">View All →</Link>
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
          
          {/* Bottom Features Block (Free Delivery, etc) */}
          <div className="bg-white p-6 md:p-8 rounded-3xl mt-8 mb-4 shadow-sm border border-gray-100">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-x-0 md:divide-x divide-gray-100">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 px-4 text-center md:text-left">
                   <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-2xl border border-blue-100">✈️</div>
                   <div>
                     <h4 className="text-gray-900 font-semibold">Free Delivery</h4>
                     <p className="text-gray-500 text-xs md:text-sm">On orders over $50</p>
                   </div>
                </div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 px-4 text-center md:text-left">
                   <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue text-2xl border border-brand-blue/20">🔄</div>
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
