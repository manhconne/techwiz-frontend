'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ShieldCheck,
  Store,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onToggle,
}) => {
  const { language, t } = useAdminLanguage();
  const pathname = usePathname();
  const isEn = language === 'en';

  const navItems = [
    { id: 'dashboard', label: isEn ? 'Dashboard Overview' : (t('dashboard') || 'Trang Chủ Admin'), icon: LayoutDashboard, href: '/admin', badge: null },
    { id: 'users', label: isEn ? 'User Management' : (t('users') || 'Quản lý người dùng'), icon: Users, href: '/admin/users', badge: null },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onToggle}
          className="admin-mobile-backdrop"
        />
      )}

      <aside
        translate="no"
        className={`notranslate admin-sidebar sticky top-0 h-screen shrink-0 z-30 flex flex-col justify-between transition-all duration-300 admin-typography ${isOpen ? 'sidebar-open' : 'sidebar-closed'
          }`}
      >
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 bg-black/20 w-100">
            <Link href="/" className="overflow-hidden group w-100 text-center">
              {isOpen && (
                <span className="font-black text-sm tracking-wider text-white uppercase text-center w-100">
                  ADMINISTRATOR
                </span>
              )}
            </Link>

            <button
              onClick={onToggle}
              type="button"
              style={{ borderRadius: '8px' }}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 space-y-2 overflow-y-auto max-h-[calc(100vh-180px)]">
            {isOpen && (
              <div className="pt-2 text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">
                <span>Main Menu</span>
              </div>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (typeof window !== 'undefined' && window.innerWidth < 768) {
                      onToggle();
                    }
                  }}
                  className={`w-full flex items-center mb-3 ${isOpen ? 'justify-between px-3.5' : 'justify-center px-0'
                    } py-2.5 text-xs transition-all duration-200 cursor-pointer text-decoration-none ${isActive ? 'admin-active-nav' : 'admin-inactive-nav'
                    }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1">
                      <Icon className="w-4 h-4" />
                    </div>
                    {isOpen && <span className="font-bold tracking-wide">{item.label}</span>}
                  </div>

                  {isOpen && item.badge && (
                    <span
                      style={{ borderRadius: '8px' }}
                      className={`text-[10px] font-black px-2 py-0.5 ${isActive
                        ? 'bg-white/30 text-white shadow-2xs'
                        : 'bg-indigo-950/80 text-sky-300 border border-indigo-700/50'
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};
