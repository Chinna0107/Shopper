import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, Truck, Award, Headset } from 'lucide-react';
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
  const navigate = useNavigate();
  const { products, categories, loading } = useStoreData();
  const [banners, setBanners] = React.useState([]);
  const [vendors, setVendors] = React.useState([
    { id: 'v1', business_name: 'Swabhivar Silks', store_image: 'https://vaarahisilks.com/cdn/shop/articles/Home_Banner_B_1080_x_1650_FHD_49daaf56-8dd9-4544-934c-f17ec4672e1c.jpg?v=1765869118' },
    { id: 'v2', business_name: 'Kavya Creations', store_image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=500&q=80' },
    { id: 'v3', business_name: 'The Loom Story', store_image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80' },
    { id: 'v4', business_name: 'Ethnic Aura', store_image: 'https://vaarahisilks.com/cdn/shop/articles/Home_Banner_B_1080_x_1650_FHD_49daaf56-8dd9-4544-934c-f17ec4672e1c.jpg?v=1765869118' },
  ]);

  React.useEffect(() => {
    const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";
    fetch(`${url}/general/banners`)
      .then(r => r.json())
      .then(d => { if (d.banners) setBanners(d.banners); })
      .catch(e => console.error(e));

    fetch(`${url}/general/vendors`)
      .then(r => r.json())
      .then(d => { if (d.vendors && d.vendors.length > 0) setVendors(d.vendors); })
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
    <div ref={container} className="bg-white min-h-screen pb-0">
      <Header variant="home" />

      {/* Mobile Search Bar (Moved from Header) */}
      <div className="md:hidden px-4 pt-8 pb-2 bg-white">
        <div
          className="relative flex items-center cursor-text"
          onClick={() => navigate('/search')}
        >
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sarees, kurtis, brands..."
            readOnly
            className="w-full bg-white border border-gray-300 rounded-full py-3.5 pl-14 pr-4 text-[15px] font-medium text-gray-900 placeholder-gray-500 focus:outline-none transition-all shadow-sm cursor-text"
          />
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 pt-4 mt-1">
        {/* Location Search Bar */}
        <Link to="/search" className="block bg-[#FFF8E7] border border-[#FDE1B9] rounded-full px-5 py-3.5 mb-5 flex items-center gap-3 cursor-text transition-all hover:bg-[#FFF4D4]">
          <svg className="w-5 h-5 text-[#88313A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" strokeWidth="2" />
            <line x1="12" y1="2" x2="12" y2="6" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="18" x2="12" y2="22" strokeWidth="2" strokeLinecap="round" />
            <line x1="2" y1="12" x2="6" y2="12" strokeWidth="2" strokeLinecap="round" />
            <line x1="18" y1="12" x2="22" y2="12" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-[15px] font-medium text-[#88313A]">Search shops near your location</span>
        </Link>
      </div>

      {/* 1. Hero Banner Carousel */}
      <div className="animate-section px-4 md:px-6 mb-8 max-w-[1280px] mx-auto mt-2 md:mt-4">
        {banners.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar mt-2">
            {banners.map((banner) => (
              <div key={banner.id} className="relative w-full shrink-0 snap-center rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-gray-50 aspect-[3/2] md:aspect-[21/9] group border border-gray-100 shadow-sm">
                <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end px-6 py-8">
                  <div className="mb-2">
                    <span className="bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                      {banner.badge || 'NEW SEASON'}
                    </span>
                  </div>
                  <h2 className="text-white text-4xl sm:text-5xl font-serif font-bold mb-1 leading-tight tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
                    {banner.title}
                  </h2>
                  <p className="text-white/90 font-medium text-sm tracking-wide">
                    {banner.subtitle || 'Explore our latest collection'}
                  </p>

                  <div className="absolute bottom-6 right-6 flex gap-1.5 items-center">
                    <div className="w-4 h-1.5 rounded-full bg-white"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar mt-2">
            <div className="relative w-full shrink-0 snap-center rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-gray-50 aspect-[3/2] md:aspect-[21/9] group border border-gray-100 shadow-sm">
              <img src={imgHeroBannerPremium} alt="Hero Banner" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end px-6 py-8">
                <div className="mb-2">
                  <span className="bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                    SILK EDIT
                  </span>
                </div>
                <h2 className="text-white text-4xl sm:text-5xl font-serif font-bold mb-1 leading-tight tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
                  Kanjeevaram<br />Heirlooms
                </h2>
                <p className="text-white/90 font-medium text-sm tracking-wide">
                  Up to 50% off
                </p>

                <div className="absolute bottom-6 right-6 flex gap-1.5 items-center">
                  <div className="w-4 h-1.5 rounded-full bg-white"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 1.5. Shop by Store (Vendors) */}
      <div className="animate-section z-30 mb-8 px-4 max-w-[1280px] mx-auto mt-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight font-serif mb-1">Shop by Store</h3>
            <p className="text-gray-500 text-sm">Buy directly from a shop</p>
          </div>
          <Link to="/stores" className="text-[#88313A] hover:text-red-900 text-sm font-medium transition-colors">See all {'>'}</Link>
        </div>
        <div className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-4 snap-x">
          {vendors.map((vendor, i) => (
            <Link key={vendor.id} to={`/store/${vendor.id}`} className="w-[160px] md:w-[200px] shrink-0 snap-start flex flex-col group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100/50">
              <div className="w-full aspect-square relative overflow-hidden rounded-3xl">
                <img
                  src={vendor.store_image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80'}
                  alt={vendor.business_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                  {((i % 4) * 3 + 5)} items
                </div>
              </div>
              <div className="p-3 pt-2">
                <h4 className="font-bold text-gray-900 text-sm truncate">{vendor.business_name || 'Vendor Shop'}</h4>
                <p className="mt-1 text-[11px] text-gray-500 truncate">
                  {['Kanchipuram, TN', 'Varanasi, UP', 'Jaipur, RJ', 'Surat, GJ'][i % 4]} · ★ 4.{8 - (i % 3)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. Categories Ribbon */}
      <div className="animate-section z-30 mb-8 px-4 max-w-[1280px] mx-auto mt-4">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight font-serif">Shop by Category</h3>
          <Link to="/category/all" className="text-[#88313A] hover:text-red-900 text-sm font-medium transition-colors">See all {'>'}</Link>
        </div>
        <div className="flex gap-4 md:gap-8 justify-start md:justify-center min-w-max mx-auto px-2 overflow-x-auto hide-scrollbar pb-2">
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

          {/* Shop by Price */}
          <div className="pt-2">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight font-serif mb-1">Shop by Price</h3>
              <p className="text-gray-500 text-sm">Find styles in your budget</p>
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x">
              <Link to="/category/all?price=under_1000" className="min-w-[160px] md:min-w-[180px] shrink-0 snap-start bg-[#FFFBF4] border border-[#F4E6D4] rounded-[1.5rem] p-5 flex flex-col items-start transition-all hover:shadow-[0_4px_15px_rgba(0,0,0,0.05)] group">
                <span className="text-[#7A1D25] text-xl font-bold mb-3">₹</span>
                <span className="font-bold text-gray-900 text-base md:text-lg mb-1">Under ₹1,000</span>
                <span className="text-gray-500 text-sm mt-auto flex items-center gap-1 group-hover:text-gray-900 transition-colors">Explore <span>→</span></span>
              </Link>
              <Link to="/category/all?price=1000_2000" className="min-w-[160px] md:min-w-[180px] shrink-0 snap-start bg-[#FFFBF4] border border-[#F4E6D4] rounded-[1.5rem] p-5 flex flex-col items-start transition-all hover:shadow-[0_4px_15px_rgba(0,0,0,0.05)] group">
                <span className="text-[#7A1D25] text-xl font-bold mb-3">₹</span>
                <span className="font-bold text-gray-900 text-base md:text-lg mb-1">₹1,000 - ₹2,000</span>
                <span className="text-gray-500 text-sm mt-auto flex items-center gap-1 group-hover:text-gray-900 transition-colors">Explore <span>→</span></span>
              </Link>
              <Link to="/category/all?price=2000_5000" className="min-w-[160px] md:min-w-[180px] shrink-0 snap-start bg-[#FFFBF4] border border-[#F4E6D4] rounded-[1.5rem] p-5 flex flex-col items-start transition-all hover:shadow-[0_4px_15px_rgba(0,0,0,0.05)] group">
                <span className="text-[#7A1D25] text-xl font-bold mb-3">₹</span>
                <span className="font-bold text-gray-900 text-base md:text-lg mb-1">₹2,000 - ₹5,000</span>
                <span className="text-gray-500 text-sm mt-auto flex items-center gap-1 group-hover:text-gray-900 transition-colors">Explore <span>→</span></span>
              </Link>
              <Link to="/category/all?price=above_5000" className="min-w-[160px] md:min-w-[180px] shrink-0 snap-start bg-[#FFFBF4] border border-[#F4E6D4] rounded-[1.5rem] p-5 flex flex-col items-start transition-all hover:shadow-[0_4px_15px_rgba(0,0,0,0.05)] group">
                <span className="text-[#7A1D25] text-xl font-bold mb-3">₹</span>
                <span className="font-bold text-gray-900 text-base md:text-lg mb-1">Above ₹5,000</span>
                <span className="text-gray-500 text-sm mt-auto flex items-center gap-1 group-hover:text-gray-900 transition-colors">Explore <span>→</span></span>
              </Link>
            </div>
          </div>

          {/* Features Highlights */}
          <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col items-center text-center gap-1.5 flex-1 border-r border-gray-50 last:border-0">
              <ShieldCheck className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-[10px] md:text-xs font-bold text-gray-800 leading-tight">Secure<br />Payments</span>
                <span className="text-[9px] md:text-[10px] text-gray-400 mt-0.5">100% safe</span>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5 flex-1 border-r border-gray-50 last:border-0">
              <Truck className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-[10px] md:text-xs font-bold text-gray-800 leading-tight">Fast<br />Delivery</span>
                <span className="text-[9px] md:text-[10px] text-gray-400 mt-0.5">On-time</span>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5 flex-1 border-r border-gray-50 last:border-0">
              <Award className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-[10px] md:text-xs font-bold text-gray-800 leading-tight">Best<br />Quality</span>
                <span className="text-[9px] md:text-[10px] text-gray-400 mt-0.5">Top products</span>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5 flex-1">
              <Headset className="w-5 h-5 text-orange-600" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-[10px] md:text-xs font-bold text-gray-800 leading-tight">24/7<br />Support</span>
                <span className="text-[9px] md:text-[10px] text-gray-400 mt-0.5">We're here</span>
              </div>
            </div>
          </div>

          {/* Ad Block Below Prices (Sponsored Card) */}
          <Link to={banners.length > 0 ? (banners[0].link_url || "/category/all") : "/category/all"} className="block bg-[#FFFBF4] border border-[#F4E6D4] rounded-[2rem] p-4 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all group">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-[#7A1D25]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <span className="text-[11px] font-bold text-[#7A1D25] tracking-widest uppercase">SWABHIVAR • SPONSORED</span>
            </div>

            <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-stretch">
              <div className="w-full md:w-56 h-56 rounded-3xl overflow-hidden shrink-0 border border-[#F4E6D4]/50">
                <img
                  src={banners.length > 0 ? banners[0].image_url : imgAarti}
                  alt="Sponsored"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="flex flex-col justify-center flex-1 w-full py-2">
                <p className="text-gray-500 text-[13px] font-medium tracking-wider uppercase mb-1">
                  SABYA COUTURE
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {banners.length > 0 ? banners[0].title || 'Bridal Season is Here' : 'Bridal Season is Here'}
                </h3>
                <p className="text-[#E87E15] font-medium text-sm md:text-base mb-6">
                  Flat ₹500 off • Free shipping
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl md:text-3xl font-extrabold text-[#7A1D25]">₹2,999</span>
                  <button className="bg-[#7A1D25] hover:bg-[#5C161C] text-white px-6 py-2.5 rounded-full font-bold text-sm md:text-base flex items-center gap-2 transition-colors">
                    Shop Now <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </Link>

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
              <div className="flex justify-between items-end mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#E57E25]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight font-serif mb-0">Trending Now</h3>
                </div>
                <Link to="/collection/trending" className="text-[#88313A] hover:text-red-900 text-sm font-medium transition-colors">See all {'>'}</Link>
              </div>
              <div className="flex overflow-x-auto gap-4 md:gap-6 hide-scrollbar pb-4 snap-x">
                {products.filter(p => p.is_trending).slice(0, 8).map(product => (
                  <div key={product.id} className="w-[160px] md:w-[220px] flex-shrink-0 snap-start h-full hover:-translate-y-1 transition-transform duration-300">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Beautiful Collections */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-[#E57E25]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight font-serif mb-0">Beautiful Collections</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Collection 1 */}
              <Link to="/collection/wedding" className="relative group overflow-hidden rounded-[2rem] aspect-[3/4] bg-gray-100 block">
                <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80" alt="Wedding Collection" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 md:p-6">
                  <h4 className="text-white font-serif font-bold text-lg md:text-xl leading-tight">Wedding Collection</h4>
                  <div className="mt-3 inline-flex">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-orange text-white text-[11px] font-black uppercase tracking-wider rounded-full shadow-lg group-hover:bg-orange-600 transition-all">Shop now <span className="group-hover:translate-x-1 transition-transform text-sm leading-none">→</span></span>
                  </div>
                </div>
              </Link>

              {/* Collection 2 */}
              <Link to="/collection/festival" className="relative group overflow-hidden rounded-[2rem] aspect-[3/4] bg-gray-100 block">
                <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80" alt="Festival Collection" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 md:p-6">
                  <h4 className="text-white font-serif font-bold text-lg md:text-xl leading-tight">Festival Collection</h4>
                  <div className="mt-3 inline-flex">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-orange text-white text-[11px] font-black uppercase tracking-wider rounded-full shadow-lg group-hover:bg-orange-600 transition-all">Shop now <span className="group-hover:translate-x-1 transition-transform text-sm leading-none">→</span></span>
                  </div>
                </div>
              </Link>

              {/* Collection 3 */}
              <Link to="/collection/office" className="relative group overflow-hidden rounded-[2rem] aspect-[3/4] bg-gray-100 block">
                <img src="https://images.unsplash.com/photo-1583391733958-d25e07fac04f?w=800&q=80" alt="Office Wear" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 md:p-6">
                  <h4 className="text-white font-serif font-bold text-lg md:text-xl leading-tight">Office Wear</h4>
                  <div className="mt-3 inline-flex">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-orange text-white text-[11px] font-black uppercase tracking-wider rounded-full shadow-lg group-hover:bg-orange-600 transition-all">Shop now <span className="group-hover:translate-x-1 transition-transform text-sm leading-none">→</span></span>
                  </div>
                </div>
              </Link>

              {/* Collection 4 */}
              <Link to="/collection/casual" className="relative group overflow-hidden rounded-[2rem] aspect-[3/4] bg-gray-100 block">
                <img src="https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=800&q=80" alt="Casual Wear" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 md:p-6">
                  <h4 className="text-white font-serif font-bold text-lg md:text-xl leading-tight">Casual Wear</h4>
                  <div className="mt-3 inline-flex">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-orange text-white text-[11px] font-black uppercase tracking-wider rounded-full shadow-lg group-hover:bg-orange-600 transition-all">Shop now <span className="group-hover:translate-x-1 transition-transform text-sm leading-none">→</span></span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recommended for You */}
          {products.length > 6 && (
            <div className="pt-2">
              <div className="flex justify-between items-end mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#E57E25]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight font-serif mb-0">Recommended for You</h3>
                </div>
                <Link to="/collection/recommended" className="text-[#88313A] hover:text-red-900 text-sm font-medium transition-colors">See all {'>'}</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {products.filter(p => !p.is_trending).slice(0, 6).map(product => (
                  <div key={`rec-${product.id}`} className="hover:-translate-y-2 transition-transform duration-300 h-full">
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
          <div className="mb-2 mt-8">
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
          <div className="bg-white py-6 px-4 md:p-8 rounded-2xl mt-0 mb-0 shadow-sm border border-gray-100">
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
                  <h4 className="text-gray-900 font-semibold">Easy Replacements</h4>
                  <p className="text-gray-500 text-xs md:text-sm">30 days replacement policy</p>
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
