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
      <Link to={`/product/${product.id}`} className="flex gap-4 p-4 glass-panel rounded-2xl mb-4 relative hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 border border-gray-100 group bg-white">
        {/* Discount Tag */}
        <div className="absolute top-2 left-2 bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">-{(Math.random() * 20 + 20).toFixed(0)}%</div>
        
        <div className="w-24 h-24 bg-gray-50 rounded-xl flex-shrink-0 p-2 relative overflow-hidden">
          <img src={firstImg} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="flex flex-col justify-center flex-grow pr-8">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-1 group-hover:text-brand-blue transition-colors">{product.name}</h3>
          
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
            <span className="text-[10px] font-medium text-gray-600">4.5</span>
            <span className="text-[10px] text-gray-400 ml-1">(1,256)</span>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-brand-orange tracking-tight">₹{displayPrice}</span>
              <span className="text-xs text-gray-400 line-through">₹{Math.round(displayPrice * 1.4)}</span>
            </div>
            <button onClick={handleAddToCart} className="bg-brand-blue hover:bg-blue-700 transition-colors p-2 rounded-lg relative z-20">
              <ShoppingCart className="w-4 h-4 text-white" strokeWidth={2} />
            </button>
          </div>
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button 
            onClick={handleWishlist}
            className="hover:scale-110 transition-transform"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-gray-900'}`} strokeWidth={isWishlisted ? 0 : 1.5} />
          </button>
          <button 
            onClick={handleShare}
            className="hover:scale-110 transition-transform mt-1"
          >
            <Share2 className="w-4 h-4 text-gray-400 hover:text-gray-900" strokeWidth={1.5} />
          </button>
        </div>
      </Link>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      className="group flex flex-col glass-panel rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 h-full p-3 relative bg-white border border-gray-100"
    >
      <div className="absolute top-2 left-2 bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded z-20">
        -{(Math.random() * 20 + 20).toFixed(0)}%
      </div>

      <div className="absolute top-3 right-3 z-20">
        <button onClick={handleWishlist} className="hover:scale-110 transition-transform bg-white/80 rounded-full p-1 shadow-sm backdrop-blur-sm">
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-gray-900'}`} strokeWidth={isWishlisted ? 0 : 1.5} />
        </button>
      </div>

      <div className="relative aspect-square overflow-hidden rounded-xl mb-3 mt-4 flex items-center justify-center">
        <img src={firstImg} alt={product.name} className="w-4/5 h-4/5 object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
      </div>

      <div className="flex flex-col flex-grow">
        <h3 className="text-xs md:text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-1.5 group-hover:text-brand-blue transition-colors">{product.name}</h3>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className="w-3 h-3 fill-brand-orange text-brand-orange" />
            ))}
          </div>
          <span className="text-[10px] text-gray-500 ml-1">(1,024)</span>
        </div>

        <div className="flex items-center gap-2 mb-3 mt-auto">
          <span className="text-sm md:text-base font-bold text-brand-orange tracking-tight">₹{displayPrice}</span>
          <span className="text-xs text-gray-400 line-through">₹{Math.round(displayPrice * 1.4)}</span>
        </div>
        
        <button onClick={handleAddToCart} className="w-full bg-brand-blue hover:bg-blue-700 text-white font-medium text-xs md:text-sm py-2 md:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 relative z-20">
          <ShoppingCart className="w-4 h-4" strokeWidth={2} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

