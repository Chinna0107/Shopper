import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';

export function BottomNav() {
  const { token } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = useCartStore(s => s.items.reduce((a, i) => a + i.qty, 0));
  const wishlistCount = useWishlistStore(s => s.items.length);

  const isActive = (paths) => paths.some(p =>
    typeof p === 'function' ? p(location.pathname) : location.pathname === p
  );

  const tabs = [
    {
      name: 'Home',
      path: '/',
      active: isActive(['/']),
      icon: (active) => (
        <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke={active ? '#ffffff' : '#9ca3af'} strokeWidth="2">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" strokeLinejoin="round"/>
          <path d="M9 21V12h6v9" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: 'Shop',
      path: '/category/all',
      active: isActive([p => p.startsWith('/category')]),
      icon: (active) => (
        <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="none">
          <rect x="3" y="3" width="7" height="7" rx="1.5" fill={active ? '#ffffff' : 'none'} stroke={active ? 'none' : '#9ca3af'} strokeWidth="1.8"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5" fill={active ? '#ffffff' : 'none'} stroke={active ? 'none' : '#9ca3af'} strokeWidth="1.8"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5" fill={active ? '#ffffff' : 'none'} stroke={active ? 'none' : '#9ca3af'} strokeWidth="1.8"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5" fill={active ? '#ffffff' : 'none'} stroke={active ? 'none' : '#9ca3af'} strokeWidth="1.8"/>
        </svg>
      )
    },
    {
      name: 'Search',
      path: '/search',
      active: isActive(['/search']),
      icon: (active) => (
        <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke={active ? '#ffffff' : '#9ca3af'} strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      )
    },
    {
      name: 'Wishlist',
      path: '/wishlist',
      active: isActive(['/wishlist']),
      badge: wishlistCount,
      icon: (active) => (
        <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6" fill={active ? '#ffffff' : 'none'} stroke={active ? 'none' : '#9ca3af'} strokeWidth="1.8">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: 'My Account',
      path: token ? '/dashboard' : '/login',
      active: isActive(['/dashboard', '/profile', '/my-addresses', '/account-settings', '/login', '/my-orders']),
      icon: (active) => (
        <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="none">
          <circle cx="12" cy="8" r="4" fill={active ? '#ffffff' : 'none'} stroke={active ? 'none' : '#9ca3af'} strokeWidth="1.8"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill={active ? '#ffffff' : 'none'} stroke={active ? 'none' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      )
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 w-full z-50 bg-white/95 backdrop-blur-lg border-t border-gray-100 pb-safe px-2 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
      <div className="flex justify-around items-center h-[72px]">
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            className="flex flex-col items-center justify-center h-full gap-1 transition-all duration-300 relative flex-1"
          >
            <div className={`w-[60px] h-[34px] flex items-center justify-center rounded-full transition-all duration-300 ease-out ${tab.active ? 'bg-[#88313A] shadow-sm shadow-[#88313A]/20 scale-105' : 'bg-transparent'}`}>
              {tab.badge > 0 && (
                <span className="absolute top-1 right-2 min-w-[16px] h-4 bg-[#E57E25] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm z-10 border-[1.5px] border-white">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}
              <div className={`transition-transform duration-300 ${tab.active ? 'scale-95' : 'scale-100'}`}>
                {tab.icon(tab.active)}
              </div>
            </div>
            <span className={`text-[10px] font-medium tracking-wide transition-colors duration-300 ${tab.active ? 'text-[#88313A]' : 'text-gray-400'}`}>
              {tab.name}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
