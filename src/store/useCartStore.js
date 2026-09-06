import { create } from 'zustand';
import { useToastStore } from './useToastStore';
import api from '../utils/api';

export const useCartStore = create(
  (set, get) => ({
    items: [],
    deliveryCharge: 1,
    
    // Fetch cart from backend
    fetchCart: async () => {
      try {
        const res = await api.get('/general/cart');
        set({ items: res.data });
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    },

    addToCart: async (product, variant, qty = 1) => {
      try {
        await api.post('/general/cart', { product_id: product.id, variant, qty });
        await get().fetchCart();
        useToastStore.getState().showToast(`Added ${product.name} to cart!`);
      } catch (err) {
        console.error("Add to cart failed:", err);
        useToastStore.getState().showToast(`Failed to add ${product.name} to cart.`, 'error');
      }
    },
    
    removeFromCart: async (productId, variant) => {
      try {
        await api.delete('/general/cart', { data: { product_id: productId, variant } });
        await get().fetchCart();
      } catch (err) {
        console.error("Remove from cart failed:", err);
      }
    },
    
    updateQuantity: async (productId, variant, qty) => {
      try {
        await api.put('/general/cart', { product_id: productId, variant, qty });
        await get().fetchCart();
      } catch (err) {
        console.error("Update quantity failed:", err);
      }
    },

    clearCart: async () => {
      try {
        await api.delete('/general/cart/clear');
        set({ items: [] });
      } catch (err) {
        console.error("Clear cart failed:", err);
      }
    },
    
    // Clear local state when user logs out
    clearLocalCart: () => {
      set({ items: [] });
    },

    getSubtotal: () => {
      return get().items.reduce((sum, item) => {
        const itemPrice = item.variant?.price || item.product.price || 0;
        return sum + (Number(itemPrice) * item.qty);
      }, 0);
    },

    getTotal: () => {
      return get().getSubtotal() + get().deliveryCharge;
    },

    getDiscount: () => {
      return get().items.reduce((sum, item) => {
        const itemPrice = item.variant?.price || item.product.price || 0;
        const itemMrp = item.variant?.mrp || item.product.mrp || itemPrice;
        return sum + ((Number(itemMrp) - Number(itemPrice)) * item.qty);
      }, 0);
    }
  })
);
