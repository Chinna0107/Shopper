import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Package, CircleUserRound, Zap } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuthStore } from '../store/useAuthStore';

export function BottomNav() {
  const { token } = useAuthStore();
  const location = useLocation();

  const tabs = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Categories', icon: LayoutGrid, path: '/category/all' },
    { name: 'Deals', icon: Zap, path: '/offers', isPrimary: true },
    { name: 'Orders', icon: Package, path: '/my-orders' },
    { name: 'Account', icon: CircleUserRound, path: token ? '/dashboard' : '/login' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-100 pb-safe z-50 transition-all shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-end h-[70px] px-2 relative pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.name === 'Categories' ? location.pathname.startsWith('/category') :
            tab.name === 'Deals' ? location.pathname === '/offers' :
            tab.name === 'Orders' ? location.pathname === '/my-orders' :
            tab.name === 'Account' ? ['/dashboard', '/profile', '/my-addresses', '/account-settings', '/login'].includes(location.pathname) :
            location.pathname === tab.path;

          if (tab.isPrimary) {
            return (
              <NavLink key={tab.name} to={tab.path}
                className="flex flex-col items-center justify-center -translate-y-5 relative z-10 w-16">
                <div className="bg-brand-orange text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(255,123,0,0.4)] border-4 border-white transition-transform hover:scale-105 active:scale-95">
                  <Icon className="w-6 h-6 fill-white" strokeWidth={1} />
                </div>
                <span className="text-[10px] font-medium text-gray-800 mt-1">{tab.name}</span>
              </NavLink>
            );
          }

          return (
            <NavLink key={tab.name} to={tab.path}
              className={cn(
                'flex flex-col items-center justify-end w-full h-full space-y-1 transition-all duration-300 relative z-10',
                isActive ? 'text-brand-blue' : 'text-gray-500 hover:text-gray-900'
              )}>
              <div className="p-1">
                <Icon className={cn('w-6 h-6 transition-transform duration-300', isActive ? 'scale-110' : '')} strokeWidth={isActive ? 2 : 1.5} />
              </div>
              <span className="text-[10px] font-medium">{tab.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

