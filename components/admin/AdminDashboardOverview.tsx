'use client';

import React, { useState } from 'react';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import { mockAlbums } from '../../data/mockData';
import { Album } from '../../types';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Filter,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Plus,
  Trash2,
  Eye,
  ExternalLink,
  ShieldCheck,
  Disc,
} from 'lucide-react';

interface AdminDashboardOverviewProps {
  onAddNewAlbumClick?: () => void;
  searchQuery?: string;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  onAddNewAlbumClick,
  searchQuery = '',
}) => {
  const { t, language } = useAdminLanguage();
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | 'year'>('30d');
  const [metricView, setMetricView] = useState<'revenue' | 'orders'>('revenue');
  const [albumsList, setAlbumsList] = useState<Album[]>(mockAlbums);

  // Mock Sales Data for 2026 Trend Chart
  const trendData = [
    { month: 'Jan', revenue: 12400, orders: 310 },
    { month: 'Feb', revenue: 15800, orders: 420 },
    { month: 'Mar', revenue: 14200, orders: 380 },
    { month: 'Apr', revenue: 18900, orders: 490 },
    { month: 'May', revenue: 22400, orders: 580 },
    { month: 'Jun', revenue: 26800, orders: 690 },
    { month: 'Jul', revenue: 31200, orders: 810 },
    { month: 'Aug', revenue: 35600, orders: 940 },
    { month: 'Sep', revenue: 38420, orders: 1020 },
  ];

  const maxRevenue = Math.max(...trendData.map((d) => d.revenue));

  // Artist Sales Breakdown
  const artistSales = [
    { name: 'NewJeans', share: 34, color: '#3b82f6', albums: 'Supernatural, Get Up, OMG' },
    { name: 'BLACKPINK', share: 28, color: '#ec4899', albums: 'BORN PINK, THE ALBUM' },
    { name: 'BTS', share: 20, color: '#8b5cf6', albums: 'Proof, BE, Map of the Soul' },
    { name: 'Stray Kids', share: 10, color: '#f59e0b', albums: 'ATE, 5-STAR, ROCK-STAR' },
    { name: 'IVE & aespa', share: 8, color: '#10b981', albums: 'IVE SWITCH, Armageddon' },
  ];

  // Top Selling Albums List
  const topSellingAlbums = [
    { name: 'Supernatural (Single)', artist: 'NewJeans', units: 8450, revenue: 211250, percent: 92 },
    { name: 'BORN PINK (Box Set)', artist: 'BLACKPINK', units: 6200, revenue: 186000, percent: 78 },
    { name: 'Proof (Collector Edition)', artist: 'BTS', units: 5100, revenue: 229500, percent: 68 },
    { name: 'ATE (Mini Album)', artist: 'Stray Kids', units: 4300, revenue: 107500, percent: 54 },
    { name: 'IVE SWITCH (Standard)', artist: 'IVE', units: 3100, revenue: 77500, percent: 42 },
  ];

  // Recent Orders Mock
  const recentOrders = [
    {
      id: 'ORD-9842',
      customer: 'Minji Park',
      country: '🇰🇷 South Korea',
      product: 'NewJeans Supernatural (Drawstring Bag Ver)',
      totalUSD: 28.0,
      totalVND: 700000,
      status: 'paid',
      date: '2026-09-25 10:42',
    },
    {
      id: 'ORD-9841',
      customer: 'Sarah Jenkins',
      country: '🇺🇸 United States',
      product: 'BLACKPINK Born Pink Official Lightstick v2',
      totalUSD: 55.0,
      totalVND: 1375000,
      status: 'processing',
      date: '2026-09-25 10:15',
    },
    {
      id: 'ORD-9840',
      customer: 'Nguyen Van A',
      country: '🇻🇳 Vietnam',
      product: 'BTS Proof (Collector Edition Photobook)',
      totalUSD: 45.0,
      totalVND: 1125000,
      status: 'shipped',
      date: '2026-09-25 09:30',
    },
    {
      id: 'ORD-9839',
      customer: 'Kenji Sato',
      country: '🇯🇵 Japan',
      product: 'Stray Kids ATE (Limited Edition Accordion Ver)',
      totalUSD: 22.0,
      totalVND: 550000,
      status: 'paid',
      date: '2026-09-25 08:50',
    },
    {
      id: 'ORD-9838',
      customer: 'Emily Watson',
      country: '🇬🇧 United Kingdom',
      product: 'IVE SWITCH Special Photocard Binder Set',
      totalUSD: 35.0,
      totalVND: 875000,
      status: 'cancelled',
      date: '2026-09-24 23:10',
    },
  ];

  // Regional Sales
  const regions = [
    { region: 'Vietnam', percent: 45, color: '#ef4444' },
    { region: 'US & Global', percent: 25, color: '#3b82f6' },
    { region: 'South Korea', percent: 18, color: '#10b981' },
    { region: 'Japan', percent: 12, color: '#f59e0b' },
  ];

  const handleDeleteAlbum = (id: string) => {
    setAlbumsList((prev) => prev.filter((a) => a.id !== id));
  };

  const filteredAlbums = albumsList.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen admin-typography">
      {/* KPI STATS CARDS GRID - Spacious responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">

        {/* KPI 1: Total Revenue */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 shadow-sm hover:shadow-md relative overflow-hidden transition-all flex flex-col justify-between space-y-3 sm:space-y-4" style={{ borderRadius: '8px' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('totalRevenue')}
            </span>
            <div className="w-10 h-10 admin-kpi-icon-revenue flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              $128,450.00
            </div>
            <div className="text-xs text-slate-400 font-bold mt-1">
              ~ 3,211,250,000 ₫
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
            <span>+18.4%</span>
            <span className="text-slate-400 font-normal ml-1">{t('vsLastPeriod')}</span>
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 shadow-sm hover:shadow-md relative overflow-hidden transition-all flex flex-col justify-between space-y-3 sm:space-y-4" style={{ borderRadius: '8px' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('totalOrders')}
            </span>
            <div className="w-10 h-10 admin-kpi-icon-orders flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              3,842
            </div>
            <div className="text-xs text-slate-400 font-bold mt-1">
              98.2% {t('statusShipped')}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
            <span>+12.5%</span>
            <span className="text-slate-400 font-normal ml-1">{t('vsLastPeriod')}</span>
          </div>
        </div>

        {/* KPI 3: Active Fandom Members */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 shadow-sm hover:shadow-md relative overflow-hidden transition-all flex flex-col justify-between space-y-3 sm:space-y-4" style={{ borderRadius: '8px' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('activeFandomMembers')}
            </span>
            <div className="w-10 h-10 admin-kpi-icon-fandom flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              142,850
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400 font-bold mt-1">
              +1,420 new this week
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
            <span>+14.2%</span>
            <span className="text-slate-400 font-normal ml-1">{t('vsLastPeriod')}</span>
          </div>
        </div>

        {/* KPI 4: Albums & Merch Sold */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 shadow-sm hover:shadow-md relative overflow-hidden transition-all flex flex-col justify-between space-y-3 sm:space-y-4" style={{ borderRadius: '8px' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('albumsSold')}
            </span>
            <div className="w-10 h-10 admin-kpi-icon-albums flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              28,690
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-extrabold mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('hanteoSynced')}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
            <span>+22.1%</span>
            <span className="text-slate-400 font-normal ml-1">{t('vsLastPeriod')}</span>
          </div>
        </div>

        {/* KPI 5: AI Queries Handled */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 shadow-sm hover:shadow-md relative overflow-hidden transition-all flex flex-col justify-between space-y-3 sm:space-y-4" style={{ borderRadius: '8px' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('aiQueries')}
            </span>
            <div className="w-10 h-10 admin-kpi-icon-ai flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              19,530
            </div>
            <div className="text-xs text-pink-600 dark:text-pink-400 font-bold mt-1">
              98.4% {t('satisfactionRate')}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
            <span>+9.8%</span>
            <span className="text-slate-400 font-normal ml-1">{t('vsLastPeriod')}</span>
          </div>
        </div>

      </div>

      {/* ANALYTICS CHARTS & BREAKDOWN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-3">

        {/* Main Chart: Revenue & Sales Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col justify-between" style={{ borderRadius: '8px' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {t('revenueSalesTrend')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Monthly revenue and volume synced with Hanteo & Circle Charts
              </p>
            </div>

            {/* Metric Toggle */}
            <div className="bg-slate-100 dark:bg-slate-800 p-1 flex items-center self-start sm:self-auto border border-slate-200 dark:border-slate-700" style={{ borderRadius: '8px' }}>
              <button
                onClick={() => setMetricView('revenue')}
                type="button"
                style={{ borderRadius: '8px' }}
                className={`px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${metricView === 'revenue'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                {t('monthlyRevenue')}
              </button>
              <button
                onClick={() => setMetricView('orders')}
                type="button"
                style={{ borderRadius: '8px' }}
                className={`px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${metricView === 'orders'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                {t('monthlyOrders')}
              </button>
            </div>
          </div>

          {/* Interactive Bar Chart Visualization */}
          <div className="overflow-x-auto admin-custom-scrollbar pb-2">
            <div className="w-full min-w-[520px] lg:min-w-0 flex items-end justify-between gap-2 sm:gap-3 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 px-2 min-h-[260px]">
              {trendData.map((item, idx) => {
                const val = metricView === 'revenue' ? item.revenue : item.orders;
                const maxVal = metricView === 'revenue' ? maxRevenue : 1100;
                const heightPercent = Math.max(16, Math.round((val / maxVal) * 100));

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end gap-3 group relative h-[220px]">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1.5 shadow-lg pointer-events-none z-10 whitespace-nowrap" style={{ borderRadius: '8px' }}>
                      {metricView === 'revenue' ? `$${val.toLocaleString()}` : `${val} orders`}
                    </div>

                    {/* Bar Outer Track */}
                    <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-end h-[170px]" style={{ borderRadius: '8px 8px 0 0' }}>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full transition-all duration-500 group-hover:brightness-110 ${idx === trendData.length - 1
                          ? 'admin-chart-bar-active'
                          : 'admin-chart-bar'
                          }`}
                      />
                    </div>

                    {/* X Axis Label */}
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart Legend Footer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6 text-xs font-medium text-slate-500 dark:text-slate-400 mt-3">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <span className="admin-legend-dot-active" />
                Current Month (September 2026)
              </span>
              <span className="flex items-center gap-2">
                <span className="admin-legend-dot" />
                Past Months
              </span>
            </div>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">
              Avg Growth: +16.2%/mo
            </span>
          </div>
        </div>

        {/* Side Chart: Sales Breakdown by Artist */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col justify-between" style={{ borderRadius: '8px' }}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {t('salesByArtist')}
              </h2>
              <Disc className="w-5 h-5 text-sky-500 animate-spin-slow" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">
              Distribution of revenue generated per idol fandom
            </p>

            {/* Visual Bars for Artists */}
            <div className="flex flex-col gap-4 mt-3">
              {artistSales.map((artist, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200">{artist.name}</span>
                    <span className="text-slate-900 dark:text-white font-extrabold">
                      {artist.share}% {t('share')}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 overflow-hidden" style={{ borderRadius: '8px' }}>
                    <div
                      style={{ width: `${artist.share}%`, backgroundColor: artist.color, borderRadius: '8px' }}
                      className="h-full transition-all duration-500"
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    Albums: {artist.albums}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
            <span>NewJeans leading at 34% total sales</span>
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* SECONDARY GRID: Top Selling Albums & Regional Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Top Performing Albums */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs mt-3" style={{ borderRadius: '8px' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {t('topSellingAlbums')}
            </h2>
            <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-3 py-1 border border-sky-200 dark:border-sky-900" style={{ borderRadius: '8px' }}>
              Hanteo Verified
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {topSellingAlbums.map((album, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4"
                style={{ borderRadius: '8px' }}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-9 h-9 bg-slate-900 text-white font-black text-xs flex items-center justify-center flex-shrink-0" style={{ borderRadius: '8px' }}>
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {album.name}
                    </div>
                    <div className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 mt-0.5">
                      {album.artist}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {album.units.toLocaleString()} {t('unitsSold')}
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                      ${album.revenue.toLocaleString()} revenue
                    </div>
                  </div>

                  <div className="w-24 hidden sm:block">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 overflow-hidden" style={{ borderRadius: '8px' }}>
                      <div
                        style={{ width: `${album.percent}%`, borderRadius: '8px' }}
                        className="bg-sky-500 h-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Fandom Sales Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col justify-between mt-3" style={{ borderRadius: '8px' }}>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mb-1">
              {t('regionalBreakdown')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">
              Global distribution of fan orders
            </p>

            <div className="flex flex-col gap-4">
              {regions.map((reg, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200">{reg.region}</span>
                    <span className="text-slate-900 dark:text-white font-extrabold">{reg.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 overflow-hidden" style={{ borderRadius: '8px' }}>
                    <div
                      style={{ width: `${reg.percent}%`, backgroundColor: reg.color, borderRadius: '8px' }}
                      className="h-full transition-all duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-4 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 text-xs text-sky-800 dark:text-sky-300" style={{ borderRadius: '8px' }}>
            <span className="font-bold">🚀 Fastest Growing Region:</span> Vietnam (+38.2% YoY growth in photobook pre-orders).
          </div>
        </div>

      </div>

      {/* TABLES SECTION: Recent Orders & Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-3">

        {/* Recent Customer Orders Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs" style={{ borderRadius: '8px' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {t('recentOrders')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Live stream of inbound fandom purchases
              </p>
            </div>
            <button
              onClick={() => alert('Opening full orders list')}
              type="button"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 cursor-pointer"
            >
              {t('viewAllOrders')} →
            </button>
          </div>

          <div className="overflow-x-auto admin-custom-scrollbar border border-slate-200 dark:border-slate-800" style={{ borderRadius: '8px' }}>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">{t('orderId')}</th>
                  <th className="py-3.5 px-4">{t('customer')}</th>
                  <th className="py-3.5 px-4">{t('product')}</th>
                  <th className="py-3.5 px-4">{t('total')}</th>
                  <th className="py-3.5 px-4">{t('status')}</th>
                  <th className="py-3.5 px-4 text-right">{t('action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {ord.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      <div>{ord.customer}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{ord.country}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300 max-w-xs truncate">
                      {ord.product}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      ${ord.totalUSD.toFixed(2)}
                      <div className="text-[10px] text-slate-400 font-normal">
                        {ord.totalVND.toLocaleString()} ₫
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {ord.status === 'paid' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300" style={{ borderRadius: '8px' }}>
                          <CheckCircle2 className="w-3 h-3" />
                          {t('statusPaid')}
                        </span>
                      )}
                      {ord.status === 'processing' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300" style={{ borderRadius: '8px' }}>
                          <Clock className="w-3 h-3" />
                          {t('statusProcessing')}
                        </span>
                      )}
                      {ord.status === 'shipped' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300" style={{ borderRadius: '8px' }}>
                          <Truck className="w-3 h-3" />
                          {t('statusShipped')}
                        </span>
                      )}
                      {ord.status === 'cancelled' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300" style={{ borderRadius: '8px' }}>
                          <XCircle className="w-3 h-3" />
                          {t('statusCancelled')}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Viewing order details for ${ord.id}`)}
                        className="p-1.5 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                        title="View Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live System Activity Feed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col justify-between" style={{ borderRadius: '8px' }}>
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {t('liveActivityFeed')}
              </h2>
              <span className="w-3 h-3 bg-emerald-500 animate-ping" style={{ borderRadius: '50%' }} />
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5" style={{ borderRadius: '8px' }}>
                <div className="flex items-center justify-between text-[11px] font-bold text-sky-600 dark:text-sky-400">
                  <span>🛍️ New Order Placed</span>
                  <span className="text-[10px] text-slate-400">Just now</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {t('newOrderNotice')}
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5" style={{ borderRadius: '8px' }}>
                <div className="flex items-center justify-between text-[11px] font-bold text-purple-600 dark:text-purple-400">
                  <span>👤 New Fandom Signup</span>
                  <span className="text-[10px] text-slate-400">12 mins ago</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {t('newMemberNotice')}
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5" style={{ borderRadius: '8px' }}>
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <span>⭐ Fan Review Posted</span>
                  <span className="text-[10px] text-slate-400">45 mins ago</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {t('reviewNotice')}
                </p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-1.5" style={{ borderRadius: '8px' }}>
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-700 dark:text-amber-300">
                  <span>⚠️ Inventory Warning</span>
                  <span className="text-[10px] text-amber-500">2 hours ago</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {t('stockAlertNotice')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-xs font-bold text-slate-400">
              Auto-refreshing every 30 seconds
            </span>
          </div>
        </div>

      </div>

      {/* CATALOG MANAGEMENT SECTION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 mt-3" style={{ borderRadius: '8px' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {t('inventoryAlerts')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Monitor album releases, stock allocations, and tag statuses
            </p>
          </div>

          {onAddNewAlbumClick && (
            <button
              onClick={onAddNewAlbumClick}
              type="button"
              style={{ borderRadius: '8px' }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-2xs hover:opacity-90 transition-all cursor-pointer self-start sm:self-auto mb-3"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addNewAlbum')}</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto admin-custom-scrollbar border border-slate-200 dark:border-slate-800" style={{ borderRadius: '8px' }}>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">{t('albumTitle')}</th>
                <th className="py-3.5 px-4">{t('artist')}</th>
                <th className="py-3.5 px-4">{t('price')}</th>
                <th className="py-3.5 px-4">{t('stockRemaining')}</th>
                <th className="py-3.5 px-4">{t('tag')}</th>
                <th className="py-3.5 px-4 text-right">{t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAlbums.map((alb) => (
                <tr key={alb.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                    <img
                      src={alb.coverImage}
                      alt={alb.title}
                      className="w-9 h-9 object-cover flex-shrink-0"
                      style={{ borderRadius: '8px' }}
                    />
                    <span className="truncate max-w-xs">{alb.title}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-sky-600 dark:text-sky-400">
                    {alb.artist}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                    ${alb.priceUSD.toFixed(2)}
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {alb.priceVND.toLocaleString()} ₫
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-bold ${alb.stock < 20
                        ? 'text-rose-600 dark:text-rose-400 font-black'
                        : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                    >
                      {alb.stock} units
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200" style={{ borderRadius: '8px' }}>
                      {alb.tag}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDeleteAlbum(alb.id)}
                      type="button"
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                      title={t('delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
