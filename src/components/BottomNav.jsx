import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Search, Tag, CircleUserRound } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuthStore } from '../store/useAuthStore';

export function BottomNav() {
  const { token } = useAuthStore();
  const location = useLocation();

  const tabs = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Categories', icon: LayoutGrid, path: '/category/all' },
    { name: 'Search', icon: Search, path: '/search' },
    { name: 'Offers', icon: Tag, path: '/offers' },
    { name: 'Account', icon: CircleUserRound, path: token ? '/dashboard' : '/login' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 w-full glass-panel rounded-t-[2rem] border-x-0 border-b-0 pb-safe z-50 transition-all shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="flex justify-around items-center h-[76px] px-2 relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.name === 'Categories' ? location.pathname.startsWith('/category') :
            tab.name === 'Offers' ? location.pathname === '/offers' :
            tab.name === 'Search' ? location.pathname === '/search' :
            tab.name === 'Account' ? ['/dashboard', '/profile', '/my-addresses', '/account-settings', '/login'].includes(location.pathname) :
            location.pathname === tab.path;

          return (
            <NavLink key={tab.name} to={tab.path}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 relative z-10',
                isActive ? 'text-brand-orange -translate-y-1' : 'text-brand-text-muted hover:text-white'
              )}>
              <div className={cn(
                'p-1.5 transition-all duration-300',
                isActive ? 'text-brand-orange drop-shadow-[0_0_8px_rgba(255,123,0,0.6)]' : 'bg-transparent'
              )}>
                <Icon className={cn('w-[22px] h-[22px] transition-transform duration-300', isActive ? 'scale-110' : '')} strokeWidth={isActive ? 2.5 : 1.5} />
              </div>
              <span className={cn('text-[10px] font-medium transition-all duration-300', isActive ? 'opacity-100 glow-text' : 'opacity-80')}>{tab.name}</span>
              {isActive && <div className="absolute bottom-1 w-1 h-1 bg-brand-orange rounded-full shadow-[0_0_8px_rgba(255,123,0,1)]" />}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
