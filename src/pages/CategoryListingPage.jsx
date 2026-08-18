import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowLeft, Filter, X, ChevronDown, Check } from 'lucide-react';
import { Header } from '../components/Header';
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
  const priceQuery = searchParams.get('price');
  
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

  // Helper to safely get base price of a product
  const getProductPrice = (p) => {
    let price = p.price || 0;
    try {
      let parsedSizes = [];
      if (typeof p.sizes === 'string') parsedSizes = JSON.parse(p.sizes);
      else if (Array.isArray(p.sizes)) parsedSizes = p.sizes;
      
      if (parsedSizes?.length > 0) {
        if (Array.isArray(parsedSizes[0].sizes) && parsedSizes[0].sizes.length > 0) {
          price = parsedSizes[0].sizes[0].price || price;
        } else if (parsedSizes[0].price) {
          price = parsedSizes[0].price || price;
        }
      }
    } catch (e) {}
    return Number(price);
  };

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

    let matchPrice = true;
    if (priceQuery) {
      const pPrice = getProductPrice(p);
      if (priceQuery === 'under_1000') matchPrice = pPrice < 1000;
      else if (priceQuery === '1000_2000') matchPrice = pPrice >= 1000 && pPrice <= 2000;
      else if (priceQuery === '2000_5000') matchPrice = pPrice > 2000 && pPrice <= 5000;
      else if (priceQuery === 'above_5000') matchPrice = pPrice > 5000;
    }

    return matchCat && matchModel && matchSearch && matchPrice;
  });

  // Sort products
  if (sortBy === 'price_asc') {
    filteredProducts.sort((a, b) => getProductPrice(a) - getProductPrice(b));
  } else if (sortBy === 'price_desc') {
    filteredProducts.sort((a, b) => getProductPrice(b) - getProductPrice(a));
  }

  const handleCategoryChange = (newCatId) => {
    // Clear subcategory when changing category
    setSearchParams({});
    navigate(`/category/${newCatId}`);
    setShowMobileFilters(false);
  };

  const handleModelChange = (model) => {
    if (model) {
      const newParams = Object.fromEntries(searchParams.entries());
      newParams.model = model;
      setSearchParams(newParams);
    } else {
      const newParams = Object.fromEntries(searchParams.entries());
      delete newParams.model;
      setSearchParams(newParams);
    }
  };

  const handlePriceChange = (priceKey) => {
    const newParams = Object.fromEntries(searchParams.entries());
    if (priceKey && newParams.price !== priceKey) {
      newParams.price = priceKey;
    } else {
      delete newParams.price; // toggle off
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    // Don't close immediately on sort change so they can apply multiple, but closing on sort is fine for a simpler UX
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f9f9f9]">
        <div className="w-8 h-8 border-4 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin" />
      </div>
    );
  }

  const currentCat = categories.find(c => c.id.toString() === categoryId);
  const currentModels = currentCat ? (currentCat.models || []) : [];

  const FilterSidebarContent = () => (
    <div className="flex flex-col gap-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Categories</h3>
        <ul className="space-y-1.5">
          <li>
            <button 
              onClick={() => handleCategoryChange('all')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all border ${categoryId === 'all' ? 'bg-orange-50/50 border-brand-orange text-brand-orange font-bold shadow-sm' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-200'}`}
            >
              All Products
            </button>
          </li>
          {categories.map(cat => (
            <li key={cat.id}>
              <button 
                onClick={() => handleCategoryChange(cat.id.toString())}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all border ${categoryId === cat.id.toString() ? 'bg-orange-50/50 border-brand-orange text-brand-orange font-bold shadow-sm' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-200'}`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Subcategories (Models) */}
      {currentModels.length > 0 && (
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Subcategories</h3>
            {modelQuery && (
              <button onClick={() => handleModelChange('')} className="text-[11px] text-brand-orange hover:text-brand-orange/80 font-bold bg-orange-50/50 px-2 py-1 rounded-md transition-colors">Clear</button>
            )}
          </div>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {currentModels.map(model => (
              <label key={model} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${modelQuery === model ? 'border-brand-orange bg-brand-orange shadow-sm' : 'border-gray-300 group-hover:border-brand-orange bg-white'}`}>
                  {modelQuery === model && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
                <span className={`text-sm ${modelQuery === model ? 'text-brand-orange font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>{model}</span>
                <input type="radio" name="model_radio" className="hidden" checked={modelQuery === model} onChange={() => handleModelChange(model)} />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Shop by Price */}
      <div className="border-t border-gray-100 pt-6 mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Shop by Price</h3>
        <div className="space-y-3">
          {[
            { id: 'under_1000', label: 'Under ₹1,000' },
            { id: '1000_2000', label: '₹1,000 - ₹2,000' },
            { id: '2000_5000', label: '₹2,000 - ₹5,000' },
            { id: 'above_5000', label: 'Above ₹5,000' },
          ].map(opt => (
            <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${priceQuery === opt.id ? 'border-brand-orange bg-brand-orange shadow-sm' : 'border-gray-300 group-hover:border-brand-orange bg-white'}`}>
                {priceQuery === opt.id && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
              </div>
              <span className={`text-sm ${priceQuery === opt.id ? 'text-brand-orange font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>{opt.label}</span>
              <input type="radio" name="price_radio" className="hidden" checked={priceQuery === opt.id} onChange={() => handlePriceChange(opt.id)} />
            </label>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Sort By</h3>
        <div className="space-y-3">
          {[
            { id: 'featured', label: 'Featured' },
            { id: 'price_asc', label: 'Price: Low to High' },
            { id: 'price_desc', label: 'Price: High to Low' },
          ].map(opt => (
            <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${sortBy === opt.id ? 'border-brand-orange bg-brand-orange shadow-sm' : 'border-gray-300 group-hover:border-brand-orange bg-white'}`}>
                {sortBy === opt.id && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className={`text-sm ${sortBy === opt.id ? 'text-brand-orange font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>{opt.label}</span>
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
      <div className="bg-white mx-4 lg:mx-8 rounded-3xl mt-6 relative overflow-hidden shadow-sm border border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between p-6 md:px-12 md:py-10 gap-6 relative z-10">
          <div className="text-center md:text-left text-gray-900 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight font-serif text-[#022A21]">{categoryName}</h1>
            <p className="text-gray-600 font-sans text-sm md:text-lg leading-relaxed max-w-xl">
              Explore our handpicked collection of authentic, premium essentials for your divine rituals. Each item is crafted with devotion and purity.
            </p>
          </div>
          <div className="w-28 h-28 md:w-40 md:h-40 shrink-0 rounded-full bg-white p-2 border border-brand-orange/30 shadow-sm hidden md:block group-hover:shadow-md transition-all">
            <img src={bannerImg} alt={categoryName} className="w-full h-full object-cover rounded-full" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        
        {/* Categories Ribbon */}
        <div className="bg-white border-gray-100 rounded-3xl mb-8 px-4 py-6 overflow-x-auto hide-scrollbar shadow-sm">
          <div className="flex gap-6 md:gap-10 justify-start md:justify-center min-w-max mx-auto px-2">
            <Link to="/category/all" className="flex flex-col items-center gap-3 group">
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border overflow-hidden transition-all ${categoryId === 'all' ? 'border-brand-orange border-2 shadow-sm bg-orange-50/50' : 'border-gray-200 bg-white group-hover:border-brand-orange group-hover:shadow-sm'}`}>
                <div className={`w-full h-full flex items-center justify-center font-extrabold text-sm text-center leading-tight ${categoryId === 'all' ? 'text-brand-orange' : 'text-gray-600 group-hover:text-brand-orange'}`}>All<br/>Products</div>
              </div>
              <span className={`text-[13px] md:text-sm font-bold text-center transition-colors ${categoryId === 'all' ? 'text-brand-orange' : 'text-gray-600 group-hover:text-gray-900'}`}>All Products</span>
            </Link>
            {categories.map(cat => (
              <Link key={cat.id} to={`/category/${cat.id}`} className="flex flex-col items-center gap-3 group">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border overflow-hidden transition-all ${categoryId === cat.id.toString() ? 'border-brand-orange border-2 shadow-sm bg-orange-50/50' : 'border-gray-200 bg-white p-1 group-hover:border-brand-orange group-hover:shadow-sm'}`}>
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <img src={imgAarti} alt="Cat" className="w-full h-full object-cover opacity-50 rounded-xl mix-blend-multiply" />
                  )}
                </div>
                <span className={`text-[13px] md:text-sm font-bold text-center transition-colors ${categoryId === cat.id.toString() ? 'text-brand-orange' : 'text-gray-600 group-hover:text-gray-900'}`}>{cat.name}</span>
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <span className="text-sm font-extrabold text-[#022A21] bg-orange-50/50 border border-brand-orange/30 px-4 py-2 rounded-xl">{filteredProducts.length} Items</span>
            
            {/* Mobile Filter Trigger */}
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 text-sm font-bold text-white bg-[#022A21] px-5 py-2 rounded-xl shadow-md"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">View:</span>
            <div className="flex bg-gray-50 border border-gray-200 rounded-xl p-1.5">
              <button onClick={() => setLayout('grid')} className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${layout === 'grid' ? 'bg-[#022A21] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>Grid</button>
              <button onClick={() => setLayout('list')} className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${layout === 'list' ? 'bg-[#022A21] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>List</button>
            </div>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 bg-white p-6 rounded-3xl shadow-md border border-gray-100 sticky top-28">
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
                <div className="col-span-full py-24 text-center flex flex-col items-center bg-white rounded-3xl shadow-sm border border-gray-100">
                  <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#022A21] mb-2 font-serif">No products found</h3>
                  <p className="text-gray-500 max-w-md">Try adjusting your filters or search terms to find what you're looking for.</p>
                  <button onClick={() => { handleCategoryChange('all'); setSortBy('featured'); }} className="mt-8 bg-gradient-to-r from-brand-orange to-yellow-500 text-white font-bold px-8 py-3 rounded-xl shadow-md hover:-translate-y-1 transition-all">
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setShowMobileFilters(false)} />
          <div className="relative ml-auto w-[85%] max-w-sm bg-white h-full flex flex-col shadow-2xl transition-transform border-l border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-bold text-[#022A21] flex items-center gap-2 font-serif">
                <Filter className="w-5 h-5 text-brand-orange" /> Filters
              </h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-full transition-all border border-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <FilterSidebarContent />
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
              <button 
                onClick={() => { handleCategoryChange('all'); setSortBy('featured'); setShowMobileFilters(false); }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold rounded-xl transition-all bg-white"
              >
                Reset
              </button>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="flex-[2] px-4 py-3 bg-[#022A21] text-white font-bold rounded-xl shadow-md hover:bg-[#033429]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
