import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowLeft, Filter, X, ChevronDown, Check } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { ProductCard } from '../components/ProductCard';
import { AdBanner } from '../components/AdBanner';
import { useStoreData } from '../store/useStoreData';
import imgAarti from '../assets/story_aarti.png';
import imgMeditation from '../assets/story_meditation.png';

export function CategoryListingPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [layout, setLayout] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured'); // featured, price_asc, price_desc
  const { products, categories, loading } = useStoreData();
  const [banners, setBanners] = useState([]);
  
  useEffect(() => {
    const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";
    fetch(`${url}/general/banners?type=category_page_banner`)
      .then(r => r.json())
      .then(d => { if (d.banners) setBanners(d.banners); })
      .catch(e => console.error(e));
  }, []);
  
  const modelQuery = searchParams.get('model');
  const searchQuery = searchParams.get('search');
  
  // Prevent body scroll when mobile filter is open
  useEffect(() => {
    if (showMobileFilters) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showMobileFilters]);
  
  let categoryName = modelQuery ? `${modelQuery} Products` : 'All Products';
  let bannerImg = imgAarti;
  
  if (categoryId !== 'all') {
    const cat = categories.find(c => c.id.toString() === categoryId);
    if (cat) {
      categoryName = cat.name;
      if (cat.image_url) bannerImg = cat.image_url;
    }
  }
  if (searchQuery) categoryName = `Search: "${searchQuery}"`;

  // Filter products
  let filteredProducts = products.filter(p => {
    let matchCat = true;
    if (categoryId !== 'all' && !searchQuery) {
      const cat = categories.find(c => c.id.toString() === categoryId);
      matchCat = cat ? p.category === cat.name : false;
    }
    
    let matchModel = true;
    if (modelQuery) {
      matchModel = p.model === modelQuery;
    }

    let matchSearch = true;
    if (searchQuery) {
      const lowerSearch = searchQuery.toLowerCase();
      matchSearch = p.name.toLowerCase().includes(lowerSearch) || 
                    (p.description && p.description.toLowerCase().includes(lowerSearch));
    }

    return matchCat && matchModel && matchSearch;
  });

  // Sort products
  if (sortBy === 'price_asc') {
    filteredProducts.sort((a, b) => {
      const pA = a.sizes && a.sizes.length > 0 ? a.sizes[0].price : 0;
      const pB = b.sizes && b.sizes.length > 0 ? b.sizes[0].price : 0;
      return pA - pB;
    });
  } else if (sortBy === 'price_desc') {
    filteredProducts.sort((a, b) => {
      const pA = a.sizes && a.sizes.length > 0 ? a.sizes[0].price : 0;
      const pB = b.sizes && b.sizes.length > 0 ? b.sizes[0].price : 0;
      return pB - pA;
    });
  }

  const handleCategoryChange = (newCatId) => {
    // Clear subcategory when changing category
    setSearchParams({});
    navigate(`/category/${newCatId}`);
    setShowMobileFilters(false);
  };

  const handleModelChange = (model) => {
    if (model) {
      setSearchParams({ model });
    } else {
      setSearchParams({});
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    // Don't close immediately on sort change so they can apply multiple, but closing on sort is fine for a simpler UX
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-green">
        <div className="w-8 h-8 border-4 border-brand-orange/20 border-t-[#036e26] rounded-full animate-spin" />
      </div>
    );
  }

  const currentCat = categories.find(c => c.id.toString() === categoryId);
  const currentModels = currentCat ? (currentCat.models || []) : [];

  const FilterSidebarContent = () => (
    <div className="flex flex-col gap-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider glow-text">Categories</h3>
        <ul className="space-y-1.5">
          <li>
            <button 
              onClick={() => handleCategoryChange('all')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all border ${categoryId === 'all' ? 'bg-brand-orange/10 border-brand-orange/50 text-brand-orange font-bold shadow-[0_0_15px_rgba(255,123,0,0.2)]' : 'border-transparent text-brand-text-muted hover:bg-white/5 hover:text-white hover:border-white/10'}`}
            >
              All Products
            </button>
          </li>
          {categories.map(cat => (
            <li key={cat.id}>
              <button 
                onClick={() => handleCategoryChange(cat.id.toString())}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all border ${categoryId === cat.id.toString() ? 'bg-brand-orange/10 border-brand-orange/50 text-brand-orange font-bold shadow-[0_0_15px_rgba(255,123,0,0.2)]' : 'border-transparent text-brand-text-muted hover:bg-white/5 hover:text-white hover:border-white/10'}`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Subcategories (Models) */}
      {currentModels.length > 0 && (
        <div className="border-t border-white/10 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider glow-text">Subcategories</h3>
            {modelQuery && (
              <button onClick={() => handleModelChange('')} className="text-[11px] text-brand-orange hover:text-white font-bold bg-brand-orange/10 px-2 py-1 rounded-md transition-colors">Clear</button>
            )}
          </div>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {currentModels.map(model => (
              <label key={model} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${modelQuery === model ? 'border-brand-orange bg-brand-orange shadow-[0_0_10px_rgba(255,123,0,0.5)]' : 'border-white/20 group-hover:border-white/50 bg-white/5'}`}>
                  {modelQuery === model && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
                <span className={`text-sm ${modelQuery === model ? 'text-brand-orange font-bold' : 'text-brand-text-muted group-hover:text-white'}`}>{model}</span>
                <input type="radio" name="model_radio" className="hidden" checked={modelQuery === model} onChange={() => handleModelChange(model)} />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Sort By */}
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider glow-text">Sort By</h3>
        <div className="space-y-3">
          {[
            { id: 'featured', label: 'Featured' },
            { id: 'price_asc', label: 'Price: Low to High' },
            { id: 'price_desc', label: 'Price: High to Low' },
          ].map(opt => (
            <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${sortBy === opt.id ? 'border-brand-orange bg-brand-orange shadow-[0_0_10px_rgba(255,123,0,0.5)]' : 'border-white/20 group-hover:border-white/50 bg-white/5'}`}>
                {sortBy === opt.id && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className={`text-sm ${sortBy === opt.id ? 'text-brand-orange font-bold' : 'text-brand-text-muted group-hover:text-white'}`}>{opt.label}</span>
              <input type="radio" name="sort_radio" className="hidden" checked={sortBy === opt.id} onChange={() => handleSortChange(opt.id)} />
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-transparent min-h-screen pb-20">
      <Header title={categoryName} showShare={true} />
      
      {/* Category Banner */}
      <div className="glass-panel mx-4 lg:mx-8 rounded-3xl mt-6 relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)] border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between p-6 md:px-12 md:py-10 gap-6 relative z-10">
          <div className="text-center md:text-left text-white max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight glow-text">{categoryName}</h1>
            <p className="text-brand-text-muted font-sans text-sm md:text-lg leading-relaxed max-w-xl">
              Explore our handpicked collection of authentic, premium essentials for your divine rituals. Each item is crafted with devotion and purity.
            </p>
          </div>
          <div className="w-28 h-28 md:w-40 md:h-40 shrink-0 rounded-full bg-white/5 p-2 border border-brand-orange/30 shadow-[0_0_30px_rgba(255,123,0,0.3)] hidden md:block group-hover:shadow-[0_0_40px_rgba(255,123,0,0.5)] transition-all">
            <img src={bannerImg} alt={categoryName} className="w-full h-full object-cover rounded-full" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        
        {/* Categories Ribbon */}
        <div className="glass-panel border-white/10 rounded-3xl mb-8 px-4 py-6 overflow-x-auto hide-scrollbar shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          <div className="flex gap-6 md:gap-10 justify-start md:justify-center min-w-max mx-auto px-2">
            <Link to="/category/all" className="flex flex-col items-center gap-3 group">
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border overflow-hidden group-hover:border-brand-orange group-hover:shadow-[0_0_15px_rgba(255,123,0,0.4)] transition-all ${categoryId === 'all' ? 'border-brand-orange border-2 shadow-[0_0_20px_rgba(255,123,0,0.5)] bg-brand-orange/10' : 'border-white/10 bg-white/5'}`}>
                <div className="w-full h-full flex items-center justify-center text-white font-extrabold text-sm text-center leading-tight">All<br/>Products</div>
              </div>
              <span className={`text-[13px] md:text-sm font-bold text-center transition-colors ${categoryId === 'all' ? 'text-brand-orange' : 'text-brand-text-muted group-hover:text-white'}`}>All Products</span>
            </Link>
            {categories.map(cat => (
              <Link key={cat.id} to={`/category/${cat.id}`} className="flex flex-col items-center gap-3 group">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border overflow-hidden group-hover:border-brand-orange group-hover:shadow-[0_0_15px_rgba(255,123,0,0.4)] transition-all ${categoryId === cat.id.toString() ? 'border-brand-orange border-2 shadow-[0_0_20px_rgba(255,123,0,0.5)] bg-brand-orange/10' : 'border-white/10 bg-white/5 p-1'}`}>
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <img src={imgAarti} alt="Cat" className="w-full h-full object-cover opacity-50 rounded-xl" />
                  )}
                </div>
                <span className={`text-[13px] md:text-sm font-bold text-center transition-colors ${categoryId === cat.id.toString() ? 'text-brand-orange' : 'text-brand-text-muted group-hover:text-white'}`}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Ad Block */}
        {banners.length > 0 ? (
          <AdBanner 
            imageUrl={banners[0].image_url} 
            altText={banners[0].title || "Category Special Ad"} 
            link={banners[0].link_url || "/category/all"}
          />
        ) : (
          <AdBanner 
            imageUrl={imgMeditation} 
            altText="Category Special Ad" 
          />
        )}

        {/* Filter and Sort Bar for Mobile / Top Bar for Desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 glass-panel p-4 md:p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] border border-white/10 gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <span className="text-sm font-extrabold text-white bg-white/10 border border-white/20 px-4 py-2 rounded-xl">{filteredProducts.length} Items</span>
            
            {/* Mobile Filter Trigger */}
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 text-sm font-bold text-white bg-brand-orange px-5 py-2 rounded-xl shadow-[0_0_15px_rgba(255,123,0,0.4)]"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <span className="text-sm font-bold text-brand-text-muted uppercase tracking-wider">View:</span>
            <div className="flex bg-white/5 border border-white/10 rounded-xl p-1.5">
              <button onClick={() => setLayout('grid')} className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${layout === 'grid' ? 'bg-brand-orange text-white shadow-[0_0_10px_rgba(255,123,0,0.4)]' : 'text-brand-text-muted hover:text-white'}`}>Grid</button>
              <button onClick={() => setLayout('list')} className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${layout === 'list' ? 'bg-brand-orange text-white shadow-[0_0_10px_rgba(255,123,0,0.4)]' : 'text-brand-text-muted hover:text-white'}`}>List</button>
            </div>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 glass-panel p-6 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 sticky top-28">
            <FilterSidebarContent />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className={layout === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6' : 'flex flex-col gap-4'}>
              {filteredProducts.map((product, index) => {
                const isAdSlot = (index + 1) % 14 === 0;
                return (
                  <React.Fragment key={product.id}>
                    <ProductCard product={product} layout={layout} />
                    {isAdSlot && (
                      <div className="col-span-full">
                        {banners.length > 1 ? (
                          <AdBanner 
                            imageUrl={banners[1 % banners.length].image_url} 
                            altText={banners[1 % banners.length].title || "In-Feed Ad"} 
                            link={banners[1 % banners.length].link_url || "/category/all"}
                          />
                        ) : (
                          <AdBanner 
                            imageUrl={imgAarti} 
                            altText="In-Feed Ad" 
                          />
                        )}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
              
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-24 text-center flex flex-col items-center glass-panel rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10">
                  <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Search className="w-8 h-8 text-brand-text-muted/50" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mb-2 glow-text">No products found</h3>
                  <p className="text-brand-text-muted max-w-md">Try adjusting your filters or search terms to find what you're looking for.</p>
                  <button onClick={() => { handleCategoryChange('all'); setSortBy('featured'); }} className="mt-8 bg-brand-orange text-white font-bold px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(255,123,0,0.4)] hover:-translate-y-1 transition-all">
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Ad Block */}
        {banners.length > 2 ? (
          <AdBanner 
            imageUrl={banners[2 % banners.length].image_url} 
            altText={banners[2 % banners.length].title || "Category Bottom Ad"} 
            link={banners[2 % banners.length].link_url || "/category/all"}
          />
        ) : banners.length > 0 ? (
          <AdBanner 
            imageUrl={banners[0].image_url} 
            altText={banners[0].title || "Category Bottom Ad"} 
            link={banners[0].link_url || "/category/all"}
          />
        ) : (
          <AdBanner 
            imageUrl={imgAarti} 
            altText="Category Bottom Ad" 
          />
        )}
      </div>

      {/* Mobile Filters Drawer/Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={() => setShowMobileFilters(false)} />
          <div className="relative ml-auto w-[85%] max-w-sm glass-panel bg-black/95 h-full flex flex-col shadow-2xl transition-transform border-l border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 glow-text">
                <Filter className="w-5 h-5 text-brand-orange" /> Filters
              </h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 text-brand-text-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <FilterSidebarContent />
            </div>
            
            <div className="p-6 border-t border-white/10 bg-black/40 flex gap-4">
              <button 
                onClick={() => { handleCategoryChange('all'); setSortBy('featured'); setShowMobileFilters(false); }}
                className="flex-1 px-4 py-3 border border-white/20 text-white hover:bg-white/5 font-bold rounded-xl transition-all"
              >
                Reset
              </button>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="flex-[2] px-4 py-3 bg-brand-orange text-white font-bold rounded-xl shadow-[0_0_15px_rgba(255,123,0,0.4)]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      <BottomNav />
    </div>
  );
}
