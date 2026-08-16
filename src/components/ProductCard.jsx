import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Share2 } from 'lucide-react';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';

export function ProductCard({ product, layout = 'grid' }) {
  const navigate = useNavigate();
  const { toggleWishlist, items: wishlistItems } = useWishlistStore();
  const { addToCart } = useCartStore();

  const isWishlisted = wishlistItems.includes(product.id);
  
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

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = window.location.origin + `/product/${product.id}`;
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on Zesto!`,
      url: url
    };

    if (navigator.share) {
      try {
        if (firstImg) {
          const response = await fetch(firstImg);
          const blob = await response.blob();
          const file = new File([blob], 'product.jpg', { type: blob.type });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            shareData.files = [file];
          }
        }
      } catch (err) {
        console.warn('Could not attach image to share:', err);
      }
      
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, defaultSize);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  if (layout === 'list') {
    return (
      <Link to={`/product/${product.id}`} className="flex gap-4 p-4 glass-panel bg-gradient-to-br from-[#0a1128]/80 to-[#020617]/90 rounded-2xl mb-4 relative hover:shadow-[0_12px_40px_rgba(37,99,235,0.2)] hover:-translate-y-1 transition-all duration-300 border border-white/5 hover:border-blue-500/30 group">
        <div className="w-24 h-24 bg-white/5 rounded-xl flex-shrink-0 p-2 relative border border-white/5 overflow-hidden shadow-inner">
          <img src={firstImg} alt={product.name} className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="flex flex-col justify-center flex-grow pr-8">
          <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug mb-1 group-hover:text-brand-orange transition-colors">{product.name}</h3>
          
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-medium text-yellow-400">4.5</span>
            {color && (
              <>
                <span className="text-[10px] font-medium text-brand-text-muted px-1">•</span>
                <span className="text-[10px] font-medium text-brand-text-muted">{color}</span>
              </>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <span className="text-base font-bold text-white tracking-tight">₹{displayPrice}</span>
              <span className="text-[10px] text-brand-text-muted line-through">₹{Math.round(displayPrice * 1.4)}</span>
            </div>
            <button onClick={handleAddToCart} className="bg-[#2563eb] hover:bg-blue-600 transition-colors p-2 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:scale-110 relative z-20">
              <ShoppingCart className="w-4 h-4 text-white" strokeWidth={2} />
            </button>
          </div>
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button 
            onClick={handleWishlist}
            className="hover:scale-110 transition-transform"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-brand-text-muted hover:text-white'}`} strokeWidth={isWishlisted ? 0 : 1.5} />
          </button>
          <button 
            onClick={handleShare}
            className="hover:scale-110 transition-transform mt-1"
          >
            <Share2 className="w-4 h-4 text-brand-text-muted hover:text-white" strokeWidth={1.5} />
          </button>
        </div>
      </Link>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      className="group flex flex-col glass-panel bg-gradient-to-br from-[#0a1128]/80 to-[#020617]/90 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_12px_40px_rgba(37,99,235,0.2)] hover:-translate-y-1 hover:border-blue-500/30 h-full p-3 relative border border-white/5"
    >
      <div className="absolute top-3 right-3 z-20">
        <button onClick={handleWishlist} className="hover:scale-110 transition-transform">
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-brand-text-muted hover:text-white'}`} strokeWidth={isWishlisted ? 0 : 1.5} />
        </button>
      </div>

      <div className="relative aspect-square overflow-hidden rounded-xl mb-3 mt-2 flex items-center justify-center bg-white/5 shadow-inner border border-white/5">
        <img src={firstImg} alt={product.name} className="w-4/5 h-4/5 object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110" />
      </div>

      <div className="flex flex-col flex-grow px-1">
        <div className="flex items-center gap-1 mb-1.5">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-[10px] md:text-xs font-semibold text-yellow-400">4.8</span>
        </div>

        <h3 className="text-xs md:text-sm font-medium text-brand-text-muted line-clamp-2 leading-snug mb-3 group-hover:text-white transition-colors">{product.name}</h3>

        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-sm md:text-base font-bold text-white tracking-tight">₹{displayPrice}</span>
            <span className="text-[10px] text-brand-text-muted line-through">₹{Math.round(displayPrice * 1.4)}</span>
          </div>
          
          <button onClick={handleAddToCart} className="bg-[#2563eb] hover:bg-blue-600 transition-colors p-2 md:p-2.5 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:scale-110 relative z-20">
            <ShoppingCart className="w-4 h-4 text-white" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
