import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Heart, ShoppingCart, Star, Tag, MapPin, Zap, X, RefreshCcw, Banknote } from 'lucide-react';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useStoreData } from '../store/useStoreData';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useStoreData();
  const product = products.find(p => p.id.toString() === id);
  const { addToCart } = useCartStore();
  const { toggleWishlist, items: wishlistItems } = useWishlistStore();
  
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const isWishlisted = product ? wishlistItems.includes(product.id) : false;
  const relatedProducts = product ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 10) : [];
  
  const container = useRef(null);

  let parsedSizes = [];
  try {
    if (typeof product?.sizes === 'string') {
      parsedSizes = JSON.parse(product.sizes);
    } else if (Array.isArray(product?.sizes)) {
      parsedSizes = product.sizes;
    }
  } catch(e) {}

  const isHierarchical = parsedSizes.length > 0 && Array.isArray(parsedSizes[0].sizes);

  const currentVariant = isHierarchical ? parsedSizes[selectedVariantIdx] : null;
  const currentSizesArray = isHierarchical ? currentVariant.sizes : parsedSizes;
  const selectedSizeObj = currentSizesArray && currentSizesArray.length > 0 ? currentSizesArray[selectedSizeIdx] : { size: 'Standard', price: product?.price || 0 };

  const productImages = (currentVariant && currentVariant.images && currentVariant.images.length > 0) 
    ? currentVariant.images 
    : (product ? ((product.images && product.images.length > 0) ? product.images : (product.image_url ? [product.image_url] : [])) : []);
    
  const [mainImg, setMainImg] = useState(null);

  useEffect(() => {
    if (productImages.length > 0 && !productImages.includes(mainImg)) {
      setMainImg(productImages[0]);
    }
  }, [productImages, selectedVariantIdx]);

  useGSAP(() => {
    if (product) {
      gsap.from('.fade-up', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.out',
        clearProps: 'all'
      });
    }
  }, { scope: container, dependencies: [product] });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent">
        <div className="w-8 h-8 border-4 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-brand-text-muted bg-transparent">
        <p className="mb-4 text-lg text-gray-600">Product not found.</p>
        <button onClick={() => navigate('/')} className="bg-brand-blue text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 shadow-md">
          Go Home
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    const variantWithColor = { ...selectedSizeObj, color: parsedSizes[selectedVariantIdx]?.color || '' };
    addToCart(product, variantWithColor, quantity);
  };

  const handleBuyNow = () => {
    const variantWithColor = { ...selectedSizeObj, color: parsedSizes[selectedVariantIdx]?.color || '' };
    addToCart(product, variantWithColor, quantity);
    navigate('/cart');
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = window.location.href;
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on Zesto!`,
      url: url
    };

    if (navigator.share) {
      try {
        const imgUrl = mainImg || productImages[0];
        if (imgUrl) {
          const response = await fetch(imgUrl);
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

  const originalPrice = selectedSizeObj ? Math.round(selectedSizeObj.price * 1.4) : 0;
  const discountPercent = originalPrice > 0 ? Math.round(((originalPrice - selectedSizeObj.price) / originalPrice) * 100) : 0;
  
  let customAttrs = {};
  try {
    customAttrs = typeof product.custom_attributes === 'string' ? JSON.parse(product.custom_attributes) : product.custom_attributes || {};
  } catch(e) {}

  return (
    <div ref={container} className="min-h-screen bg-transparent pb-28 md:pb-12">
      <Header />
      
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 mt-6 md:mt-10 space-y-12 font-sans">
        <div className="md:flex items-start gap-8 lg:gap-16">
          
          {/* LEFT COLUMN: Images & Action Buttons */}
          <div className="md:w-[45%] lg:w-[50%] flex-shrink-0 relative">
            <div className="sticky top-[100px]">
              <div className="flex gap-4">
                {/* Thumbnails (Desktop Left) */}
                <div className="hidden md:flex flex-col gap-3 w-[72px]">
                  {productImages.map((img, i) => (
                    <div 
                      key={i} 
                      onClick={() => setMainImg(img)}
                      className={`w-18 h-18 rounded-xl p-2 cursor-pointer transition-all ${mainImg === img ? 'border-brand-blue border-2 shadow-sm bg-blue-50' : 'border border-gray-200 hover:border-brand-blue bg-white'}`}
                    >
                      <img src={img} alt={`thumb-${i}`} className="w-full h-full object-contain drop-shadow-md" />
                    </div>
                  ))}
                </div>
                
                {/* Main Image */}
                <div 
                  className="flex-1 relative aspect-square bg-white rounded-3xl p-4 group cursor-zoom-in border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center"
                  onClick={() => setIsImageModalOpen(true)}
                >
                  <div className="absolute top-4 right-4 z-10 flex flex-col gap-3">
                    <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }} className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center border border-gray-200 hover:scale-110 hover:border-red-500 transition-all shadow-sm">
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} strokeWidth={isWishlisted ? 0 : 1.5} />
                    </button>
                    <button onClick={handleShare} className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center border border-gray-200 hover:scale-110 hover:border-brand-blue transition-all shadow-sm">
                      <Share2 className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                    </button>
                  </div>
                  <img src={mainImg || productImages[0]} alt={product.name} className="w-4/5 h-4/5 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                </div>
              </div>

              {/* Mobile Thumbnails */}
              <div className="flex md:hidden gap-3 mt-4 overflow-x-auto hide-scrollbar snap-x px-1">
                {productImages.map((img, i) => (
                  <div 
                    key={i} 
                    onClick={() => setMainImg(img)}
                    className={`w-16 h-16 rounded-xl p-2 cursor-pointer flex-shrink-0 snap-start transition-all ${mainImg === img ? 'border-brand-blue border-2 shadow-sm bg-blue-50' : 'border border-gray-200 bg-white'}`}
                  >
                    <img src={img} alt={`thumb-${i}`} className="w-full h-full object-contain drop-shadow-md" />
                  </div>
                ))}
              </div>

              {/* Desktop Action Buttons */}
              <div className="hidden md:flex gap-5 mt-8">
                <button onClick={handleAddToCart} className="flex-1 relative overflow-hidden bg-white hover:bg-gray-50 border border-brand-blue text-brand-blue font-bold py-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-1 hover:shadow-md group">
                  <ShoppingCart className="w-5 h-5" /> ADD TO CART
                </button>
                <button onClick={handleBuyNow} className="flex-[1.5] relative overflow-hidden bg-brand-blue border border-blue-600 text-white font-extrabold py-4 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all hover:-translate-y-1 hover:shadow-lg hover:bg-blue-700 group">
                  <Zap className="w-6 h-6 fill-current drop-shadow-sm" /> BUY NOW
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Details */}
          <div className="md:w-[60%] p-6 md:p-10 text-gray-600 text-sm bg-white rounded-3xl shadow-xl border border-gray-100 mt-8 md:mt-0">
            <div className="fade-up">
              {/* Title & Ratings */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 tracking-tight leading-tight">{product.name}</h1>
              <div className="text-gray-600 mb-4 text-base">{product.short_description}</div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-2.5 py-1 rounded-lg text-[13px] font-bold shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                  4.5 <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="text-gray-500 font-medium">1,245 Ratings & 142 Reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-extrabold text-gray-900">₹{selectedSizeObj?.price || 0}</span>
                {discountPercent > 0 && (
                  <>
                    <span className="text-gray-400 line-through text-xl">₹{originalPrice}</span>
                    <span className="text-green-500 font-bold text-lg">{discountPercent}% off</span>
                  </>
                )}
              </div>
            </div>

            {/* Colors */}
            {isHierarchical && parsedSizes.length > 0 && (
              <div className="fade-up flex flex-col md:flex-row md:items-start gap-4 md:gap-8 mb-8 pb-8 border-b border-gray-100">
                <span className="text-gray-900 font-semibold w-16 shrink-0 pt-2 text-base">Color</span>
                <div className="flex flex-wrap gap-3">
                  {parsedSizes.map((variant, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        setSelectedVariantIdx(idx);
                        setSelectedSizeIdx(0);
                      }}
                      className={`px-5 py-2.5 rounded-xl border transition-all duration-300 font-medium ${
                        selectedVariantIdx === idx 
                          ? 'border-brand-blue text-brand-blue bg-blue-50 shadow-sm' 
                          : 'border-gray-200 text-gray-600 hover:border-brand-blue hover:bg-gray-50'
                      }`}
                    >
                      {variant.color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes/Variants */}
            {currentSizesArray && currentSizesArray.length > 0 && (
              <div className="fade-up flex flex-col md:flex-row md:items-start gap-4 md:gap-8 mb-8 pb-8 border-b border-gray-100">
                <span className="text-gray-900 font-semibold w-16 shrink-0 pt-2 text-base">Size</span>
                <div className="flex flex-wrap gap-3">
                  {currentSizesArray.map((sizeObj, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedSizeIdx(idx)}
                      className={`px-5 py-2.5 rounded-xl border transition-all duration-300 font-medium ${
                        selectedSizeIdx === idx 
                          ? 'border-brand-blue text-brand-blue bg-blue-50 shadow-sm' 
                          : 'border-gray-200 text-gray-600 hover:border-brand-blue hover:bg-gray-50'
                      }`}
                    >
                      {sizeObj.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery */}
            <div className="fade-up flex flex-col md:flex-row md:items-start gap-4 md:gap-8 mb-8 pb-8 border-b border-gray-100">
              <span className="text-gray-900 font-semibold w-16 shrink-0 pt-1 text-base">Delivery</span>
              <div className="flex-1 w-full max-w-sm">
                <div className="flex items-center border-b border-gray-200 pb-2 mb-3 focus-within:border-brand-blue transition-colors">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Enter Delivery Pincode" 
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1 outline-none text-[15px] placeholder-gray-400 font-medium bg-transparent text-gray-900" 
                    maxLength={6}
                  />
                  <button className="text-brand-blue hover:text-blue-700 font-bold text-[14px] transition-colors ml-2">Check</button>
                </div>
                <p className="text-[14px] font-medium mt-3 text-gray-900">Delivery by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} | <span className="text-green-500">Free</span> <span className="line-through text-gray-400 ml-1">₹40</span></p>
                <p className="text-[12px] text-gray-500 mt-1.5">If ordered before 4:00 PM</p>
              </div>
            </div>

            {/* Product Description */}
            <div className="fade-up mb-8 pb-8 border-b border-gray-100">
              <h2 className="font-bold text-xl text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-blue rounded-full inline-block"></span>
                Product Description
              </h2>
              <div className="text-[15px] text-gray-600 leading-relaxed whitespace-pre-wrap pl-3">
                {product.description || "Experience the perfect blend of tradition and quality. This product is carefully crafted to meet your daily needs while maintaining an authentic feel. Suitable for all occasions and built to last."}
              </div>
            </div>

            {/* Specifications */}
            <div className="fade-up mb-4">
              <h2 className="font-bold text-xl text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-blue rounded-full inline-block"></span>
                Specifications
              </h2>
              <div className="pl-3">
                <div className="font-semibold text-[16px] mb-4 text-gray-900">General</div>
                <table className="w-full text-[15px]">
                  <tbody>
                    <tr className="align-top border-b border-gray-100">
                      <td className="py-3.5 text-gray-500 w-32 md:w-48">Category</td>
                      <td className="py-3.5 font-medium text-gray-900">{product.category || 'General'}</td>
                    </tr>
                    {currentVariant?.color && (
                      <tr className="align-top border-b border-gray-100">
                        <td className="py-3.5 text-gray-500 w-32 md:w-48">Color</td>
                        <td className="py-3.5 font-medium text-gray-900">{currentVariant.color}</td>
                      </tr>
                    )}
                    {Object.entries(customAttrs).map(([key, value]) => (
                      <tr key={key} className="align-top border-b border-gray-100">
                        <td className="py-3.5 text-gray-500 w-32 md:w-48 capitalize">{key.replace(/_/g, ' ')}</td>
                        <td className="py-3.5 font-medium text-gray-900">
                           {String(value).startsWith('http') ? <a href={value} target="_blank" rel="noreferrer" className="text-brand-blue hover:text-blue-700 hover:underline">View Document/Image</a> : value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
        
        {/* People Also Bought / Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-gray-100 fade-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">People also bought</h2>
            <div className="flex overflow-x-auto gap-6 hide-scrollbar pb-6 snap-x">
              {relatedProducts.map(rp => (
                <div key={rp.id} className="w-[180px] md:w-[220px] flex-shrink-0 snap-start">
                  <ProductCard product={rp} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Bar (Visible only on mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex gap-3 p-3 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-gray-50 border border-brand-blue text-brand-blue font-bold py-3.5 flex items-center justify-center gap-2 hover:bg-gray-100 transition-all active:scale-95 rounded-xl shadow-sm"
        >
          <ShoppingCart className="w-5 h-5" />
          CART
        </button>
        <button 
          onClick={handleBuyNow}
          className="flex-[1.5] bg-brand-blue rounded-xl text-white font-extrabold py-3.5 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 hover:bg-blue-700"
        >
           <Zap className="w-5 h-5 fill-current drop-shadow-sm" />
           BUY NOW
        </button>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
            onClick={() => setIsImageModalOpen(false)}
          >
            <button 
              onClick={() => setIsImageModalOpen(false)} 
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-[101]"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-4xl p-4 md:p-8 flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={mainImg || productImages[0]} alt={product.name} className="w-full h-auto max-h-[70vh] object-contain" />
              
              <div className="flex gap-2 overflow-x-auto hide-scrollbar max-w-full pb-2">
                {productImages.map((img, i) => (
                  <div 
                    key={i} 
                    onClick={() => setMainImg(img)}
                    className={`w-16 h-16 border-2 rounded-sm p-1 cursor-pointer flex-shrink-0 bg-white transition-all ${mainImg === img ? 'border-[#2874f0]' : 'border-transparent'}`}
                  >
                    <img src={img} alt={`thumb-${i}`} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
