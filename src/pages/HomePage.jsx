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
              <div key={banner.id} className="relative w-full shrink-0 snap-center rounded-[2.5rem] overflow-hidden glass-panel border border-brand-orange/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] h-[320px] md:h-[500px] group">
                {/* Background image with subtle zoom on hover */}
                <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out" />
                
                {/* Premium Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent flex flex-col justify-center px-8 md:px-24">
                  
                  {/* Decorative Ambient Glows */}
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-1/4 left-10 w-32 h-32 bg-brand-orange/20 rounded-full blur-[80px]" />
                    <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-blue-500/10 rounded-full blur-[100px]" />
                  </div>

                  <h2 className="relative z-10 text-white text-4xl md:text-7xl font-extrabold mb-4 md:mb-8 drop-shadow-[0_0_20px_rgba(255,123,0,0.3)] max-w-3xl leading-[1.1] tracking-tight">
                    {banner.title}
                  </h2>
                  {(banner.link_url || banner.link_url === '') && (
                    <Link to={banner.link_url || "/category/all"} className="relative z-10 bg-gradient-to-r from-brand-orange to-[#ff9533] text-white text-sm md:text-lg font-bold px-12 py-4 md:py-5 rounded-full shadow-[0_0_30px_rgba(255,123,0,0.5)] w-fit hover:scale-105 hover:shadow-[0_0_40px_rgba(255,123,0,0.7)] transition-all uppercase tracking-widest flex items-center gap-3 group/btn">
                      Shop Now <span className="text-2xl group-hover/btn:translate-x-1 transition-transform">→</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative w-full rounded-[2.5rem] overflow-hidden glass-panel border border-brand-orange/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] h-[320px] md:h-[500px] mt-6 group">
            {/* Fallback Premium Image - custom generated */}
            <img src={imgHeroBannerPremium} alt="Hero Banner" className="w-full h-full object-cover opacity-70 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out" />
            
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent flex flex-col justify-center px-8 md:px-24">
              
              {/* Ambient Glows */}
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-orange/20 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

              <h2 className="relative z-10 text-white text-4xl md:text-7xl font-extrabold mb-4 md:mb-6 drop-shadow-[0_0_30px_rgba(255,123,0,0.3)] max-w-2xl leading-[1.1] tracking-tight">
                Shop Smart.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-[#ffb366] glow-text drop-shadow-[0_0_15px_rgba(255,123,0,0.5)]">Live Better.</span>
              </h2>
              <p className="relative z-10 text-brand-text-muted mb-10 text-lg md:text-xl max-w-lg hidden md:block leading-relaxed">
                Experience the next generation of e-commerce. Discover top quality products curated exclusively for you.
              </p>
              
              <Link to="/category/all" className="relative z-10 group/btn bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm md:text-lg font-bold pl-8 pr-3 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-fit hover:bg-white/20 hover:border-white/40 hover:scale-105 transition-all flex items-center gap-6">
                <span className="tracking-widest uppercase">Explore Now</span> 
                <div className="bg-gradient-to-r from-brand-orange to-orange-500 p-4 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,123,0,0.5)] group-hover/btn:shadow-[0_0_30px_rgba(255,123,0,0.8)] transition-shadow">
                  <span className="text-white leading-none font-bold text-xl group-hover/btn:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 2. Categories Ribbon */}
      <div className="animate-section z-30 mb-8 px-2 overflow-x-auto hide-scrollbar mt-4">
        <div className="flex gap-4 md:gap-8 justify-start md:justify-center min-w-max mx-auto px-4">
          {categories.map(cat => (
            <Link key={cat.id} to={`/category/${cat.id}`} className="flex flex-col items-center gap-2 group w-16 md:w-20">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl glass-panel bg-gradient-to-b from-[#111a3a] to-[#040816] flex items-center justify-center p-2.5 md:p-3 border border-white/5 border-t-blue-500/40 shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1 group-hover:border-t-brand-orange">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-contain drop-shadow-md relative z-10" />
                ) : (
                  <img src={imgHeroBanner} alt="Cat" className="w-full h-full object-cover opacity-50 relative z-10" />
                )}
                <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-brand-orange/10 transition-colors duration-300"></div>
              </div>
              <span className="text-[10px] md:text-xs font-medium text-brand-text-muted text-center group-hover:text-white transition-colors leading-tight line-clamp-1">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6">
        
        {/* Unified Transparent Block */}
        <div className="animate-section mb-12 flex flex-col gap-8 md:gap-10">
          
          {/* Flash Sale Banner Style - Single Row */}
          {products.filter(p => p.is_offer).length > 0 && (
            <div className="relative glass-panel px-4 py-4 md:px-8 md:py-5 rounded-[2rem] border border-brand-orange/40 shadow-[0_10px_40px_rgba(255,123,0,0.25)] flex flex-row items-center justify-between gap-3 md:gap-6 w-full overflow-hidden bg-gradient-to-r from-brand-orange/20 via-black/40 to-brand-orange/10 group hover:shadow-[0_15px_50px_rgba(255,123,0,0.4)] transition-all duration-500 hover:-translate-y-1">
               {/* Ambient Glow & Shimmer */}
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
               <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 bg-brand-orange/20 rounded-full blur-[60px] pointer-events-none" />
               
               <div className="flex items-center gap-3 md:gap-5 shrink-0 relative z-10">
                 <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-brand-orange to-orange-600 flex items-center justify-center shadow-[0_0_20px_rgba(255,123,0,0.6)] shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-2xl md:text-3xl text-white drop-shadow-md">⚡</span>
                 </div>
                 <div className="flex flex-col">
                   <h3 className="text-[16px] md:text-2xl font-extrabold text-white glow-text whitespace-nowrap leading-tight tracking-wide">Flash Sale</h3>
                   <p className="text-brand-text-muted text-[11px] md:text-sm whitespace-nowrap leading-tight mt-0.5">Up to <span className="text-brand-orange font-bold glow-text text-[13px] md:text-base">60%</span> Off</p>
                 </div>
               </div>
               
               {/* Timer */}
               <div className="flex items-center gap-1.5 md:gap-3 ml-auto shrink-0 relative z-10">
                 <div className="bg-black/60 backdrop-blur-md border border-brand-orange/30 rounded-xl px-2.5 py-1.5 md:px-4 md:py-2 text-center min-w-[36px] md:min-w-[60px] shadow-inner group-hover:border-brand-orange/60 transition-colors">
                   <span className="block text-[15px] md:text-2xl font-black text-white leading-none mb-1">02</span>
                   <span className="block text-[9px] md:text-[11px] text-brand-orange font-bold uppercase leading-none tracking-wider">Hrs</span>
                 </div>
                 <span className="text-brand-orange font-bold text-lg md:text-2xl animate-pulse mb-1">:</span>
                 <div className="bg-black/60 backdrop-blur-md border border-brand-orange/30 rounded-xl px-2.5 py-1.5 md:px-4 md:py-2 text-center min-w-[36px] md:min-w-[60px] shadow-inner group-hover:border-brand-orange/60 transition-colors">
                   <span className="block text-[15px] md:text-2xl font-black text-white leading-none mb-1">45</span>
                   <span className="block text-[9px] md:text-[11px] text-brand-orange font-bold uppercase leading-none tracking-wider">Mins</span>
                 </div>
                 <span className="text-brand-orange font-bold text-lg md:text-2xl animate-pulse mb-1">:</span>
                 <div className="bg-black/60 backdrop-blur-md border border-brand-orange/30 rounded-xl px-2.5 py-1.5 md:px-4 md:py-2 text-center min-w-[36px] md:min-w-[60px] shadow-inner group-hover:border-brand-orange/60 transition-colors">
                   <span className="block text-[15px] md:text-2xl font-black text-white leading-none mb-1">30</span>
                   <span className="block text-[9px] md:text-[11px] text-brand-orange font-bold uppercase leading-none tracking-wider">Secs</span>
                 </div>
                 <Link to="/collection/top-picks" className="ml-3 md:ml-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-brand-orange to-orange-500 flex items-center justify-center hover:scale-110 hover:shadow-[0_0_25px_rgba(255,123,0,0.8)] transition-all shadow-[0_0_15px_rgba(255,123,0,0.5)] shrink-0 relative overflow-hidden">
                   <span className="text-white font-bold text-lg md:text-xl relative z-10 transition-transform group-hover:translate-x-1">→</span>
                 </Link>
               </div>
            </div>
          )}

          {/* Best Sellers */}
          {products.filter(p => p.is_bestseller).length > 0 && (
            <div>
              <div className="flex justify-between items-center px-4 py-4 mb-4 border-b border-white/10 glass-panel bg-white/5 rounded-2xl">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight glow-text">Best Selling</h3>
                <Link to="/collection/best-sellers" className="text-[#3b82f6] hover:text-blue-400 text-sm md:text-base font-semibold flex items-center gap-2 transition-colors">View All →</Link>
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
          <div className="rounded-[2rem] overflow-hidden glass-panel border-white/10">
            <AdBanner 
              imageUrl={imgAarti} 
              altText="Middle Ad" 
              link="/category/all" 
            />
          </div>

          {/* Trending */}
          {products.filter(p => p.is_trending).length > 0 && (
            <div>
              <div className="flex justify-between items-center px-2 py-4 mb-4 border-b border-white/10">
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Trending Now</h3>
                <Link to="/collection/trending" className="text-[#3b82f6] hover:text-blue-400 text-sm md:text-base font-semibold flex items-center gap-2 transition-colors">View All →</Link>
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
                <div className="flex justify-between items-center px-2 py-4 mb-4 border-b border-white/10">
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{cat.name}</h3>
                  <Link to={`/category/${cat.id}`} className="text-[#3b82f6] hover:text-blue-400 text-sm md:text-base font-semibold flex items-center gap-2 transition-colors">View All →</Link>
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
          <div className="glass-panel p-6 md:p-8 rounded-3xl mt-8 mb-4">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-x-0 md:divide-x divide-white/10">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 px-4 text-center md:text-left">
                   <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-blue-400 text-2xl">✈️</div>
                   <div>
                     <h4 className="text-white font-semibold">Free Delivery</h4>
                     <p className="text-brand-text-muted text-xs md:text-sm">On orders over $50</p>
                   </div>
                </div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 px-4 text-center md:text-left">
                   <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-brand-orange text-2xl">🔄</div>
                   <div>
                     <h4 className="text-white font-semibold">Easy Returns</h4>
                     <p className="text-brand-text-muted text-xs md:text-sm">30 days return policy</p>
                   </div>
                </div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 px-4 text-center md:text-left">
                   <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-green-400 text-2xl">🔒</div>
                   <div>
                     <h4 className="text-white font-semibold">Secure Payments</h4>
                     <p className="text-brand-text-muted text-xs md:text-sm">100% secure checkout</p>
                   </div>
                </div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 px-4 text-center md:text-left">
                   <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-yellow-400 text-2xl">🏆</div>
                   <div>
                     <h4 className="text-white font-semibold">Best Prices</h4>
                     <p className="text-brand-text-muted text-xs md:text-sm">Guaranteed deals</p>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>

    </div>
  );
}
