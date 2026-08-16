import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Heart, MapPin, Wallet, Tag, Bell, Settings, LogOut, ChevronRight, User } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { Header } from '../components/Header';
import { useAuthStore } from '../store/useAuthStore';

export function ProfilePage() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!token) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center gap-4 pb-20">
        <Header title="My Profile" />
        <User className="w-16 h-16 text-white/50 mt-20" />
        <p className="text-white font-semibold">You're not logged in</p>
        <Link to="/login" className="bg-brand-orange text-white font-bold px-8 py-3 rounded-xl text-sm">Login</Link>
        <Link to="/signup" className="text-brand-orange text-sm font-semibold">Create Account</Link>
        <BottomNav />
      </div>
    );
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

  const menuItems = [
    { icon: Package, label: 'My Orders', action: () => navigate('/my-orders') },
    { icon: Heart, label: 'Wishlist', action: () => navigate('/wishlist') },
    { icon: MapPin, label: 'Saved Addresses', action: () => navigate('/my-addresses') },
    { icon: Settings, label: 'Account Settings', action: () => navigate('/account-settings') },
  ];

  return (
    <div className="min-h-screen bg-transparent pb-20">
      <Header title="My Profile" />
      <div className="glass-panel bg-black/40 border-b border-white/10 text-white px-6 pt-6 pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40 shrink-0">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{user?.name}</h1>
            <p className="text-xs text-brand-text-muted mt-0.5">{user?.phone || user?.email}</p>
            <Link to="/dashboard"
              className="mt-3 inline-block bg-brand-orange/20 hover:bg-brand-orange/40 text-brand-orange hover:text-white text-xs font-bold px-4 py-1.5 rounded-full border border-brand-orange/30 shadow-[0_0_10px_rgba(255,123,0,0.2)] hover:shadow-[0_0_15px_rgba(255,123,0,0.4)] transition-all">
              View Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="p-4 mt-6 max-w-4xl mx-auto">
        <div className="glass-panel rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button key={index} onClick={item.action}
                className={`w-full flex items-center justify-between p-4 bg-transparent hover:bg-white/5 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-white/10' : ''}`}>
                <div className="flex items-center gap-3 text-white">
                  <Icon className="w-5 h-5 text-brand-orange" />
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-brand-text-muted" />
              </button>
            );
          })}
          <button onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-red-500/10 transition-colors border-t border-white/10">
            <div className="flex items-center gap-3 text-red-500">
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-semibold">Logout</span>
            </div>
            <ChevronRight className="w-5 h-5 text-red-500/50" />
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
