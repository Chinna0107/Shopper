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
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill={active ? '#FE6603' : 'none'} stroke={active ? '#FE6603' : '#9ca3af'} strokeWidth="1.8">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" strokeLinejoin="round"/>
          <path d="M9 21V12h6v9" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: 'Categories',
      path: '/category/all',
      active: isActive([p => p.startsWith('/category')]),
      icon: (active) => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke={active ? '#FE6603' : '#9ca3af'} strokeWidth="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1.5" fill={active ? '#FE6603' : 'none'} stroke={active ? '#FE6603' : '#9ca3af'}/>
          <rect x="14" y="3" width="7" height="7" rx="1.5" fill={active ? 'none' : 'none'} stroke={active ? '#FE6603' : '#9ca3af'}/>
          <rect x="3" y="14" width="7" height="7" rx="1.5" fill={active ? 'none' : 'none'} stroke={active ? '#FE6603' : '#9ca3af'}/>
          <rect x="14" y="14" width="7" height="7" rx="1.5" fill={active ? 'none' : 'none'} stroke={active ? '#FE6603' : '#9ca3af'}/>
        </svg>
      )
    },
    {
      name: 'Deals',
      path: '/offers',
      active: isActive(['/offers']),
      isPrimary: true,
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white" stroke="none">
          <path d="M13 2L4.09 12.97 12 12.14 11 22l8.91-10.97L12 11.86z"/>
        </svg>
      )
    },
    {
      name: 'Wishlist',
      path: '/wishlist',
      active: isActive(['/wishlist']),
      badge: wishlistCount,
      icon: (active) => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill={active ? '#FE6603' : 'none'} stroke={active ? '#FE6603' : '#9ca3af'} strokeWidth="1.8">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: 'Account',
      path: token ? '/dashboard' : '/login',
      active: isActive(['/dashboard', '/profile', '/my-addresses', '/account-settings', '/login', '/my-orders']),
      icon: (active) => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke={active ? '#FE6603' : '#9ca3af'} strokeWidth="1.8">
          <circle cx="12" cy="8" r="4" fill={active ? '#FE6603' : 'none'} stroke={active ? '#FE6603' : '#9ca3af'}/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/>
        </svg>
      )
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 w-full z-50">
      {/* Glassy pill container */}
      <div className="bg-[#022A21] border-t border-[#054335] shadow-[0_-8px_32px_rgba(0,0,0,0.4)] px-2 pb-safe">
        <div className="flex justify-around items-end h-[68px] relative">

          {tabs.map((tab) => {
            if (tab.isPrimary) {
              return (
                <NavLink
                  key={tab.name}
                  to={tab.path}
                  className="flex flex-col items-center justify-center -translate-y-5 relative z-10 w-16 shrink-0"
                >
                  {/* Glow ring */}
                  <div className="absolute -inset-1 rounded-full bg-brand-orange/30 blur-md pointer-events-none" />
                  <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-brand-orange to-yellow-500 flex items-center justify-center shadow-[0_4px_20px_rgba(254,102,3,0.6)] border-4 border-[#022A21] transition-transform active:scale-90 hover:scale-105">
                    {tab.icon(true)}
                  </div>
                  <span className="text-[10px] font-bold text-brand-orange mt-0.5 tracking-wide">{tab.name}</span>
                </NavLink>
              );
            }

            return (
              <NavLink
                key={tab.name}
                to={tab.path}
                className="flex flex-col items-center justify-end pb-2 w-full h-full gap-0.5 relative transition-all active:scale-90"
              >
                {/* Active indicator dot */}
                {tab.active && (
                  <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-orange shadow-[0_0_6px_rgba(254,102,3,0.8)]" />
                )}

                {/* Badge */}
                {tab.badge > 0 && (
                  <span className="absolute top-1 right-1/4 min-w-[16px] h-4 bg-brand-orange text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 shadow-md">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}

                <div className={`p-1.5 rounded-xl transition-all ${tab.active ? 'bg-brand-orange/15' : ''}`}>
                  {tab.icon(tab.active)}
                </div>
                <span className={`text-[10px] font-semibold tracking-wide transition-colors ${tab.active ? 'text-brand-orange' : 'text-gray-400'}`}>
                  {tab.name}
                </span>
              </NavLink>
            );
          })}

        </div>
      </div>
    </div>
  );
}
