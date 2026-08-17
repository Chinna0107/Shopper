import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { useStoreData } from '../store/useStoreData';

export function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const { products, categories, loading } = useStoreData();
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the search input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Update URL search params as user types for shareability/history
  useEffect(() => {
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  }, [query, setSearchParams]);

  const filteredProducts = products.filter(product => {
    if (!query) return false; // Show nothing or everything? Let's show nothing if no query, or popular items? 
    // Let's show all if query is empty, or maybe just a prompt to search.
    const searchLower = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      (product.description && product.description.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-transparent font-sans pb-24">
      {/* Search Header */}
      <div className="bg-white sticky top-0 z-40 px-4 py-4 shadow-sm border-b border-gray-100 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors border border-transparent">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 relative group">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-brand-orange transition-colors" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, categories..."
            className="w-full bg-gray-100 border border-transparent rounded-2xl py-3.5 pl-12 pr-12 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:border-brand-orange focus:bg-white focus:shadow-sm transition-all placeholder-gray-500"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results Area */}
      <div className="max-w-[1400px] mx-auto w-full px-4 pt-6">
        {!query ? (
          <div className="flex flex-col items-center justify-center py-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Browse Categories</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 w-full max-w-4xl px-4">
              {categories.map(cat => (
                <Link key={cat.id} to={`/category/${cat.id}`} className="flex flex-col items-center gap-3 group">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center border border-gray-100 group-hover:border-brand-blue group-hover:shadow-md overflow-hidden transition-all group-hover:scale-105 group-hover:-translate-y-1">
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:opacity-100 transition-opacity mix-blend-multiply" />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center text-brand-blue font-bold text-xl">{cat.name.charAt(0)}</div>
                    )}
                  </div>
                  <span className="text-gray-700 text-xs md:text-sm font-semibold text-center group-hover:text-brand-blue transition-colors line-clamp-2">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div>
            <h3 className="text-gray-900 font-bold mb-4">
              Found {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{query}"
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="hover:-translate-y-1 transition-transform">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl border border-gray-100 p-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 text-sm max-w-xs">We couldn't find anything matching "{query}". Try adjusting your spelling or try different keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
}
