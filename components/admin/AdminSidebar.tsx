'use client';

import React from 'react';
import Link from 'next/link';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Bot,
  Settings,
  ShieldCheck,
  Store,
  ChevronLeft,
  ChevronRight,
  Sparkles,
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
  const { t } = useAdminLanguage();

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, badge: null },
    { id: 'catalog', label: t('catalog'), icon: Package, badge: '28' },
    { id: 'orders', label: t('orders'), icon: ShoppingBag, badge: '12 New' },
    { id: 'customers', label: t('customers'), icon: Users, badge: null },
    { id: 'analytics', label: t('analytics'), icon: BarChart3, badge: null },
    { id: 'aiSupport', label: t('aiSupport'), icon: Bot, badge: '98%' },
    { id: 'settings', label: t('settings'), icon: Settings, badge: null },
  ];

  return (
    <aside
      className={`admin-sidebar sticky top-0 h-screen shrink-0 z-30 flex flex-col justify-between transition-all duration-300 admin-typography ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Top Header & Brand */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 bg-black/20">
          <Link href="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 via-purple-500 to-sky-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform" style={{ borderRadius: '8px' }}>
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            {isOpen && (
              <div className="flex flex-col">
                <span className="font-black text-sm tracking-tight text-white leading-none flex items-center gap-1">
                  Fan Hub <span className="text-sky-400">Plus</span>
                </span>
                <span className="text-[10px] font-bold text-indigo-300 tracking-wider uppercase mt-1">
                  Admin Portal
                </span>
              </div>
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

        {/* Navigation Section */}
        <div className="p-3 space-y-2 overflow-y-auto max-h-[calc(100vh-180px)]">
          {isOpen && (
            <div className="px-3 pt-2 text-[10px] font-black text-indigo-300 uppercase tracking-widest flex items-center justify-between">
              <span>Main Menu</span>
              <Sparkles className="w-3 h-3 text-indigo-400" />
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                type="button"
                className={`w-full flex items-center ${
                  isOpen ? 'justify-between px-3.5' : 'justify-center px-0'
                } py-2.5 text-xs transition-all duration-200 cursor-pointer ${
                  isActive ? 'admin-active-nav' : 'admin-inactive-nav'
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
                    className={`text-[10px] font-black px-2 py-0.5 ${
                      isActive
                        ? 'bg-white/30 text-white shadow-2xs'
                        : 'bg-indigo-950/80 text-sky-300 border border-indigo-700/50'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Status Card & Store Link */}
      <div className="p-3 border-t border-white/10 space-y-2 bg-black/20">
        {isOpen ? (
          <div className="p-3 bg-indigo-950/60 border border-indigo-800/40 space-y-2" style={{ borderRadius: '8px' }}>
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Telemetry
              </span>
              <span className="text-[10px] text-indigo-300 font-mono">v2.4</span>
            </div>
            <p className="text-[11px] text-slate-200 leading-tight font-medium">
              {t('systemOperational')}
            </p>
          </div>
        ) : (
          <div className="flex justify-center p-2 text-emerald-400" title={t('systemOperational')}>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}

        <Link
          href="/"
          style={{ borderRadius: '8px' }}
          className={`flex items-center ${
            isOpen ? 'justify-start px-3' : 'justify-center px-0'
          } py-2.5 text-xs font-bold text-indigo-200 hover:text-white bg-white/10 hover:bg-white/20 transition-all shadow-xs`}
          title={t('backToStorefront')}
        >
          <Store className="w-4 h-4 flex-shrink-0 text-sky-400" />
          {isOpen && <span className="ml-2.5">{t('backToStorefront')}</span>}
        </Link>
      </div>
    </aside>
  );
};
