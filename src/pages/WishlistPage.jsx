import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, Star, ShoppingCart } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { useWishlistStore } from '../store/useWishlistStore';
import { useStoreData } from '../store/useStoreData';
import { useCartStore } from '../store/useCartStore';

export function WishlistPage() {
  const navigate = useNavigate();
  const { items, toggleWishlist } = useWishlistStore();
  const { products } = useStoreData();
  const { addToCart } = useCartStore();
  
  React.useEffect(() => {
    if (products.length > 0) {
      const validItems = items.filter(id => products.some(p => String(p.id) === String(id)));
      if (validItems.length !== items.length) {
        useWishlistStore.setState({ items: validItems });
      }
    }
  }, [items, products]);

  const wishlistProducts = items.map(id => products.find(p => String(p.id) === String(id))).filter(Boolean);

  return (
    <div className="min-h-screen bg-transparent pb-24 font-sans">
      <Header />
      
      <div className="max-w-[1200px] mx-auto px-4 md:px-0 py-6 md:py-8 flex flex-col md:flex-row gap-6 md:gap-8 mt-16 md:mt-0">
        
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-72 shrink-0">
           <div className="glass-panel bg-brand-orange/5 p-5 mb-6 rounded-3xl flex items-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-brand-orange/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-orange/20 to-transparent rounded-bl-full pointer-events-none opacity-50 blur-xl"></div>
              <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-full overflow-hidden shrink-0 shadow-inner group-hover:shadow-[0_0_15px_rgba(255,123,0,0.4)] transition-all">
                <img src="https://ui-avatars.com/api/?name=Zesto+User&background=ff7b00&color=fff" alt="Profile" />
              </div>
              <div className="relative z-10">
                <div className="text-[12px] text-brand-text-muted">Hello,</div>
                <div className="font-bold text-[16px] text-white">Zesto User</div>
              </div>
           </div>
           
           <div className="glass-panel rounded-3xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
             <div className="border-b border-white/10 p-5 hover:bg-white/5 cursor-pointer font-bold text-brand-text-muted hover:text-white transition-all">
               My Orders
             </div>
             <div className="p-5 bg-brand-orange/10 cursor-pointer font-bold text-brand-orange border-l-4 border-brand-orange transition-all flex items-center justify-between">
               <span>My Wishlist</span>
               <span className="bg-brand-orange text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(255,123,0,0.5)]">{wishlistProducts.length}</span>
             </div>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 glass-panel rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] border border-white/10 min-h-[60vh] overflow-hidden">
          <div className="px-6 py-5 border-b border-white/10 bg-white/5">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-brand-orange rounded-full inline-block shadow-[0_0_10px_rgba(255,123,0,0.5)]"></span>
              My Wishlist <span className="font-medium text-brand-text-muted text-[14px] ml-2">({wishlistProducts.length})</span>
            </h1>
          </div>

          {wishlistProducts.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-24 text-center px-4">
               <div className="mb-6 w-32 h-32 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
                 <Heart className="w-16 h-16 text-brand-text-muted/30" />
               </div>
               <h2 className="text-xl font-bold text-white mb-2 glow-text">Empty Wishlist</h2>
               <p className="text-brand-text-muted text-[15px] mb-8 max-w-sm">
                 You have no items in your wishlist. Start adding your favorite pieces!
               </p>
               <Link to="/category/all" className="bg-brand-orange text-white px-8 py-3.5 rounded-xl font-bold text-[15px] hover:bg-orange-500 shadow-[0_0_20px_rgba(255,123,0,0.4)] hover:-translate-y-1 transition-all">
                 Explore Products
               </Link>
             </div>
          ) : (
            <div className="flex flex-col">
              {wishlistProducts.map((product, idx) => {
                
                let parsedSizes = [];
                try {
                  if (typeof product.sizes === 'string') {
                    parsedSizes = JSON.parse(product.sizes);
                  } else if (Array.isArray(product.sizes)) {
                    parsedSizes = product.sizes;
                  }
                } catch (e) {}

                let defaultSize = { size: 'Standard', price: product.price || 0 };
                let firstImg = product.image_url;
                let color = product.color;

                if (parsedSizes && parsedSizes.length > 0) {
                  if (parsedSizes[0].sizes && Array.isArray(parsedSizes[0].sizes) && parsedSizes[0].sizes.length > 0) {
                    defaultSize = parsedSizes[0].sizes[0];
                    color = parsedSizes[0].color;
                    if (parsedSizes[0].images && parsedSizes[0].images.length > 0) {
                      firstImg = parsedSizes[0].images[0];
                    }
                  } else if (parsedSizes[0].size) {
                    defaultSize = parsedSizes[0];
                  }
                }

                if (!firstImg && product.images && product.images.length > 0) {
                  firstImg = product.images[0];
                }
                
                const displayPrice = defaultSize.price;
                const originalPrice = Math.round(displayPrice * 1.4);
                const discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);

                return (
                  <div key={product.id} className={`flex gap-6 p-6 ${idx !== wishlistProducts.length - 1 ? 'border-b border-white/10' : ''} hover:bg-white/5 transition-all relative group cursor-pointer`} onClick={() => navigate(`/product/${product.id}`)}>
                    
                    <div className="w-28 h-28 md:w-32 md:h-32 flex-shrink-0 relative bg-white/5 rounded-2xl p-2 border border-white/10 shadow-inner overflow-hidden">
                      <img src={firstImg} alt={product.name} className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    
                    <div className="flex flex-col flex-grow justify-center">
                      <div className="flex justify-between items-start gap-4">
                        <div className="pr-12">
                          <h3 className="text-[16px] md:text-lg font-bold text-white group-hover:text-brand-orange transition-colors line-clamp-2 leading-snug mb-2">{product.name}</h3>
                          
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-1 bg-brand-orange/20 border border-brand-orange/40 text-brand-orange px-2 py-0.5 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(255,123,0,0.2)]">
                              4.5 <Star className="w-3 h-3 fill-current" />
                            </div>
                            <span className="text-brand-text-muted font-medium text-[13px]">(1,245 reviews)</span>
                          </div>

                          <div className="flex items-baseline gap-3 mb-2">
                            <span className="text-2xl font-extrabold text-white glow-text">₹{displayPrice}</span>
                            <span className="text-brand-text-muted line-through text-[14px]">₹{originalPrice}</span>
                            <span className="text-brand-orange font-bold text-[14px]">{discountPercent}% off</span>
                          </div>
                        </div>

                        {/* Trash Button */}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className="absolute right-4 top-4 md:right-6 md:top-6 text-brand-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all p-2.5 z-10"
                          title="Remove from Wishlist"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center gap-2 md:opacity-0 md:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                         <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart(product, defaultSize);
                              navigate('/cart');
                            }}
                            className="bg-brand-orange text-white px-6 py-2.5 text-[14px] font-bold rounded-xl flex items-center gap-2 hover:bg-orange-500 shadow-[0_0_15px_rgba(255,123,0,0.4)] hover:-translate-y-0.5 transition-all"
                         >
                            <ShoppingCart className="w-4 h-4" /> Add to Cart
                         </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
