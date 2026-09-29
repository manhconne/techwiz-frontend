'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import { setGoogleLanguage } from '../GoogleTranslate';
import { useAuth } from '../../context/AuthContext';
import { getAccessToken, parseJwt } from '../../utils/authUtils';
import {
  Menu,
  LogOut,
  Store,
  ChevronDown,
} from 'lucide-react';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  activeTab?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  searchQuery = '',
  setSearchQuery,
  activeTab = 'dashboard',
}) => {
  const { language, setLanguage, t } = useAdminLanguage();
  const isVi = language === 'vi';
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Retrieve logged-in user from AuthContext
  const auth = useAuth();
  const authUser = auth?.user;
  const logout = auth?.logout;

  const [adminUser, setAdminUser] = useState<{
    name: string;
    email: string;
    role: string;
    avatar: string;
  }>({
    name: 'Admin Chief',
    email: 'admin@fanhubplus.com',
    role: 'Super Admin',
    avatar: '',
  });

  useEffect(() => {
    let name = '';
    let email = '';
    let role = '';
    let avatar = '';

    // 1. Check AuthContext user
    if (authUser && authUser.id !== 'guest-1') {
      name = authUser.name || '';
      email = authUser.email || '';
      role = authUser.role || '';
      avatar = authUser.avatar || '';
    }

    // 2. Check localStorage saved user
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kpop_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (!name && parsed.name && parsed.id !== 'guest-1') name = parsed.name;
          if (!email && parsed.email) email = parsed.email;
          if (!role && parsed.role) role = parsed.role;
          if (!avatar && parsed.avatar) avatar = parsed.avatar;
        }
      } catch {}
    }

    // 3. Check JWT token payload
    const token = getAccessToken();
    if (token) {
      const payload = parseJwt(token);
      if (payload) {
        if (!name) name = payload.name || payload.unique_name || payload.fullName || payload.username || payload.sub || '';
        if (!email) email = payload.email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '';
        if (!role) role = payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '';
      }
    }

    setAdminUser({
      name: name || 'Admin Chief',
      email: email || 'admin@fanhubplus.com',
      role: role ? (role.toLowerCase() === 'admin' ? 'Super Admin' : role) : 'Super Admin',
      avatar: avatar || '',
    });
  }, [authUser]);

  const handleSignOut = () => {
    setIsProfileOpen(false);
    if (logout) {
      logout();
    }
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors admin-typography">
      <div className="px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            type="button"
            style={{ borderRadius: '12px' }}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Toggle Menu Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <Link
            href="/"
            style={{ borderRadius: '12px' }}
            className="admin-hide-on-mobile hidden md:flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-sky-400 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 transition-all shadow-2xs"
            target='_blank'
            title="Back to Store"
          >
            <Store className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
            <span>Back to Store</span>
          </Link>

          {/* Dual Segmented Language Switcher [ EN | VI ] */}
          <div
            translate="no"
            style={{ borderRadius: '12px' }}
            className="notranslate flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700"
          >
            <button
              type="button"
              onClick={() => {
                setLanguage('en');
                setGoogleLanguage('en');
              }}
              style={{ borderRadius: '10px' }}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="English (Default)"
            >
              <img
                src="https://flagcdn.com/w40/gb.png"
                alt="UK Flag"
                className="w-4 h-3 object-cover shadow-2xs"
                style={{ borderRadius: '2px' }}
              />
              <span>EN</span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage('vi')}
              style={{ borderRadius: '10px' }}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                language === 'vi'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Vietnamese"
            >
              <img
                src="https://flagcdn.com/w40/vn.png"
                alt="Vietnam Flag"
                className="w-4 h-3 object-cover shadow-2xs"
                style={{ borderRadius: '2px' }}
              />
              <span>VI</span>
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              type="button"
              style={{ borderRadius: '12px' }}
              className="flex items-center gap-2.5 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <div
                className="w-8 h-8 bg-gradient-to-tr from-rose-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-indigo-500/20 overflow-hidden shrink-0"
                style={{ borderRadius: '10px' }}
              >
                {adminUser.avatar ? (
                  <img
                    src={adminUser.avatar}
                    alt={adminUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (adminUser.name.trim().charAt(0) || 'A').toUpperCase()
                )}
              </div>
              <div className="hidden md:block text-left min-w-0 max-w-[160px]">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                  {adminUser.name}
                </div>
                <div className="text-[10px] text-indigo-600 dark:text-sky-400 font-extrabold mt-0.5 truncate uppercase">
                  {adminUser.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block shrink-0" />
            </button>

            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 overflow-hidden py-1" style={{ borderRadius: '12px' }}>
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{adminUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{adminUser.email}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800">
                      {adminUser.role}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    type="button"
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isVi ? 'Đăng xuất' : 'Sign Out'}</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
