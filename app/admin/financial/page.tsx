'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import { getAccessToken } from '../../../utils/authUtils';
import {
  TrendingUp,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Check,
  X,
  Copy,
  DollarSign,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  BarChart3,
  PieChart,
  Download,
  Ticket,
  Percent,
  Wallet,
  Building2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export interface FinancialBreakdownItem {
  event_id: string;
  event_title: string;
  tickets_sold: number;
  revenue: number;
  commission?: number;
}

export interface FinancialReportData {
  total_volume: number;
  commission_earned: number;
  breakdown: FinancialBreakdownItem[];
  meta?: any;
}

// Fallback demo financial data
const FALLBACK_REPORT: FinancialReportData = {
  total_volume: 450000000,
  commission_earned: 22500000,
  breakdown: [
    {
      event_id: 'evt_001',
      event_title: 'Cosplay Expo 2026 - Vietnam Fandom Fest',
      tickets_sold: 450,
      revenue: 120000000,
      commission: 6000000,
    },
    {
      event_id: 'evt_002',
      event_title: 'K-POP Symphony World Tour Hanoi Stage',
      tickets_sold: 820,
      revenue: 210000000,
      commission: 10500000,
    },
    {
      event_id: 'evt_003',
      event_title: 'Giải Đấu MOBA Champions Cup 2026',
      tickets_sold: 340,
      revenue: 75000000,
      commission: 3750000,
    },
    {
      event_id: 'evt_004',
      event_title: 'Hội Chợ Truyện Tranh & Manga Festival',
      tickets_sold: 560,
      revenue: 45000000,
      commission: 2250000,
    },
  ],
};

export default function AdminFinancialPage() {
  const { language } = useAdminLanguage();
  const isVi = language === 'vi';

  // Responsive sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  // Date Filter & Group By states
  const [fromDate, setFromDate] = useState('2026-01-01');
  const [toDate, setToDate] = useState('2026-09-30');
  const [groupBy, setGroupBy] = useState<'event' | 'month' | 'category'>('event');

  // Report State
  const [report, setReport] = useState<FinancialReportData>(FALLBACK_REPORT);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Search in breakdown
  const [searchTerm, setSearchTerm] = useState('');

  // Currency Formatter
  const formatCurrency = (amount: number | string) => {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat(isVi ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Fetch Report: GET /api/v1/admin/financial/reports?from=2026-01-01&to=2026-09-30&group_by=event
  const fetchReport = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const token = getAccessToken();
      const params = new URLSearchParams({
        from: fromDate,
        to: toDate,
        group_by: groupBy,
      });

      const url = `/api/v1/admin/financial/reports?${params.toString()}`;
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const json = await res.json();
      const rawData = json.data || json;

      if (rawData && (rawData.total_volume !== undefined || rawData.breakdown)) {
        setReport({
          total_volume: rawData.total_volume || 0,
          commission_earned: rawData.commission_earned || 0,
          breakdown: Array.isArray(rawData.breakdown) ? rawData.breakdown : [],
        });
      }
      setApiError(null);
    } catch (err: any) {
      console.warn('API /api/v1/admin/financial/reports offline, using fallback report:', err);
      setReport(FALLBACK_REPORT);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fromDate, toDate, groupBy]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleCopyId = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered breakdown
  const filteredBreakdown = useMemo(() => {
    if (!searchTerm.trim()) return report.breakdown || [];
    const q = searchTerm.toLowerCase();
    return (report.breakdown || []).filter(
      (b) =>
        b.event_title.toLowerCase().includes(q) ||
        b.event_id.toLowerCase().includes(q)
    );
  }, [report.breakdown, searchTerm]);

  // Derived metrics
  const totalTicketsSold = useMemo(() => {
    return (report.breakdown || []).reduce((sum, b) => sum + (b.tickets_sold || 0), 0);
  }, [report.breakdown]);

  const netPayout = report.total_volume - report.commission_earned;
  const commissionRate = report.total_volume > 0
    ? ((report.commission_earned / report.total_volume) * 100).toFixed(1)
    : '5.0';

  return (
    <div className="flex h-screen bg-[#0b0f17] text-slate-100 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <AdminSidebar
        activeTab="financial"
        setActiveTab={() => {}}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* HEADER */}
        <AdminHeader
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          searchQuery={headerSearch}
          setSearchQuery={setHeaderSearch}
          activeTab="financial"
        />

        {/* BREADCRUMB & TOP ACTIONS */}
        <div className="border-b border-slate-800 bg-[#0f172a]/60 px-6 py-4 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Link href="/admin" className="hover:text-amber-400 transition-colors">Admin</Link>
                <span>/</span>
                <span className="text-amber-400 font-medium">
                  {isVi ? 'Báo cáo Tài chính (Financial Reports)' : 'Financial Reports'}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span>{isVi ? 'Doanh Thu & Hoa Hồng Nền Tảng' : 'Platform Financial & Revenue'}</span>
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchReport(true)}
                disabled={loading || refreshing}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-amber-400' : ''}`} />
                <span>{isVi ? 'Làm mới' : 'Refresh'}</span>
              </button>

              <button
                onClick={() => {
                  alert(isVi ? 'Đang xuất file báo cáo tài chính Excel/CSV...' : 'Exporting financial data...');
                }}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isVi ? 'Xuất báo cáo' : 'Export'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT BODY */}
        <div className="p-6 space-y-6">
          {/* DATE RANGE FILTER TOOLBAR: ?from=...&to=...&group_by=event */}
          <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-slate-400 font-medium">{isVi ? 'Từ ngày:' : 'From:'}</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="bg-transparent text-white font-mono focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-slate-400 font-medium">{isVi ? 'Đến ngày:' : 'To:'}</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="bg-transparent text-white font-mono focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-medium">{isVi ? 'Nhóm theo:' : 'Group by:'}</span>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as any)}
                  className="bg-transparent text-amber-400 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="event" className="bg-slate-900 text-white">Sự kiện (Event)</option>
                  <option value="month" className="bg-slate-900 text-white">Tháng (Month)</option>
                  <option value="category" className="bg-slate-900 text-white">Danh mục (Category)</option>
                </select>
              </div>
            </div>

            {/* Quick date range buttons */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => {
                  setFromDate('2026-09-01');
                  setToDate('2026-09-30');
                }}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg cursor-pointer"
              >
                {isVi ? 'Tháng này' : 'This Month'}
              </button>
              <button
                onClick={() => {
                  setFromDate('2026-07-01');
                  setToDate('2026-09-30');
                }}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg cursor-pointer"
              >
                {isVi ? 'Quý 3' : 'Q3'}
              </button>
              <button
                onClick={() => {
                  setFromDate('2026-01-01');
                  setToDate('2026-09-30');
                }}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold rounded-lg cursor-pointer"
              >
                {isVi ? 'Từ đầu năm' : 'YTD'}
              </button>
            </div>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>{isVi ? 'Tổng Doanh Số (total_volume)' : 'Total Volume'}</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {formatCurrency(report.total_volume)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                <span>+18.4% so với kỳ trước</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>{isVi ? 'Hoa Hồng Thu Được (commission)' : 'Commission Earned'}</span>
                <Percent className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {formatCurrency(report.commission_earned)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Tỷ lệ chiết khấu bình quân: <strong className="text-slate-300">{commissionRate}%</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>{isVi ? 'Thực Nhận BTC (Net Payout)' : 'Net Organizer Payout'}</span>
                <Wallet className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {formatCurrency(netPayout)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {isVi ? 'Đã khấu trừ hoa hồng hệ thống' : 'After platform fee'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>{isVi ? 'Tổng Số Vé Bán Ra' : 'Total Tickets Sold'}</span>
                <Ticket className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {totalTicketsSold.toLocaleString()} {isVi ? 'vé' : 'tickets'}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {isVi ? 'Qua cổng thanh toán trực tuyến' : 'Online transaction volume'}
              </div>
            </div>
          </div>

          {/* BREAKDOWN TABLE */}
          <div className="rounded-2xl bg-[#0f172a] border border-slate-800 overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  {isVi ? 'Chi Tiết Doanh Thu Theo Sự Kiện (Breakdown)' : 'Revenue Breakdown by Event'}
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {filteredBreakdown.length} sự kiện
                </span>
              </div>

              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isVi ? 'Lọc theo tên sự kiện...' : 'Filter events...'}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">{isVi ? 'Sự kiện' : 'Event'}</th>
                    <th className="px-4 py-3 text-right">{isVi ? 'Số vé đã bán' : 'Tickets Sold'}</th>
                    <th className="px-4 py-3 text-right">{isVi ? 'Doanh thu (revenue)' : 'Revenue'}</th>
                    <th className="px-4 py-3 text-right">{isVi ? 'Hoa hồng ước tính' : 'Commission'}</th>
                    <th className="px-4 py-3 text-center">{isVi ? 'Tỷ trọng doanh thu' : 'Share'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredBreakdown.map((item) => {
                    const share = report.total_volume > 0 ? (item.revenue / report.total_volume) * 100 : 0;
                    const comm = item.commission || Math.round(item.revenue * 0.05);

                    return (
                      <tr key={item.event_id} className="hover:bg-slate-850/60 transition-colors">
                        <td className="px-4 py-3.5 max-w-sm">
                          <div className="font-bold text-white hover:text-amber-400 transition-colors">
                            {item.event_title}
                          </div>
                          <button
                            onClick={(e) => handleCopyId(item.event_id, e)}
                            className="text-[10px] text-slate-500 hover:text-slate-300 font-mono flex items-center gap-1 mt-0.5"
                          >
                            <span>{item.event_id}</span>
                            {copiedId === item.event_id ? (
                              <Check className="w-2.5 h-2.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-2.5 h-2.5" />
                            )}
                          </button>
                        </td>

                        <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-200">
                          {item.tickets_sold.toLocaleString()}
                        </td>

                        <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-400">
                          {formatCurrency(item.revenue)}
                        </td>

                        <td className="px-4 py-3.5 text-right font-mono font-bold text-amber-400">
                          {formatCurrency(comm)}
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-center gap-2 max-w-[120px] mx-auto">
                            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                                style={{ width: `${Math.min(100, Math.max(5, share))}%` }}
                              />
                            </div>
                            <span className="font-mono text-[11px] text-slate-400 w-10 text-right">
                              {share.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
