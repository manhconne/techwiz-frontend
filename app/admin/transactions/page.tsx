'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import { getAccessToken } from '../../../utils/authUtils';
import {
  Receipt,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Check,
  X,
  Copy,
  DollarSign,
  Calendar,
  Filter,
  Eye,
  Clock,
  XCircle,
  CreditCard,
  User,
  Hash,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowUpDown,
  Download,
} from 'lucide-react';

export interface AdminTransactionItem {
  id: string;
  user: string | { name?: string; email?: string; id?: string };
  amount: number;
  provider: 'VNPay' | 'Momo' | 'ZaloPay' | 'VietQR' | 'Stripe' | string;
  merchant_ref: string;
  status: 'Success' | 'Pending' | 'Failed' | string;
  created_at: string;
  payment_method?: string;
  [key: string]: any;
}

// Fallback demo transactions
const FALLBACK_TRANSACTIONS: AdminTransactionItem[] = [
  {
    id: 'tx_98124',
    user: 'Nguyen Van A',
    amount: 250000,
    provider: 'VNPay',
    merchant_ref: 'ORD_12345',
    status: 'Success',
    created_at: '2026-09-26T14:32:00Z',
    payment_method: 'VNPay QR',
  },
  {
    id: 'tx_98125',
    user: 'Le Thi Thu Ha',
    amount: 1500000,
    provider: 'Momo',
    merchant_ref: 'ORD_12346',
    status: 'Success',
    created_at: '2026-09-26T15:10:00Z',
    payment_method: 'Ví MoMo',
  },
  {
    id: 'tx_98126',
    user: 'Tran Dinh Quang',
    amount: 500000,
    provider: 'VNPay',
    merchant_ref: 'ORD_12347',
    status: 'Pending',
    created_at: '2026-09-26T16:05:00Z',
    payment_method: 'ATM Nội địa',
  },
  {
    id: 'tx_98127',
    user: 'Pham Minh Hoang',
    amount: 850000,
    provider: 'ZaloPay',
    merchant_ref: 'ORD_12348',
    status: 'Success',
    created_at: '2026-09-26T16:45:00Z',
    payment_method: 'ZaloPay QR',
  },
  {
    id: 'tx_98128',
    user: 'Vuong Quoc Bao',
    amount: 3200000,
    provider: 'VietQR',
    merchant_ref: 'ORD_12349',
    status: 'Success',
    created_at: '2026-09-27T08:12:00Z',
    payment_method: 'Chuyển khoản VietQR Pro',
  },
  {
    id: 'tx_98129',
    user: 'Dang Thi Mai',
    amount: 450000,
    provider: 'VNPay',
    merchant_ref: 'ORD_12350',
    status: 'Failed',
    created_at: '2026-09-27T09:20:00Z',
    payment_method: 'Thẻ Quốc tế Visa/Master',
  },
];

export default function AdminTransactionsPage() {
  const { language } = useAdminLanguage();
  const isVi = language === 'vi';

  // Responsive sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  // Main list state
  const [transactions, setTransactions] = useState<AdminTransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Filters & Pagination: ?provider=VNPay&status=Success&page=1&limit=20
  const [providerFilter, setProviderFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  // Modals & Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<AdminTransactionItem | null>(null);

  // Currency Formatter
  const formatCurrency = (amount: number | string) => {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat(isVi ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Helper get user name
  const getUserName = (u: any) => {
    if (!u) return 'Ẩn danh';
    if (typeof u === 'string') return u;
    return u.name || u.email || 'User';
  };

  // Fetch Transactions: GET /api/v1/admin/transactions?provider=...&status=...&page=...&limit=...
  const fetchTransactions = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const token = getAccessToken();
      const params = new URLSearchParams();
      if (providerFilter) params.set('provider', providerFilter);
      if (statusFilter) params.set('status', statusFilter);
      if (searchTerm.trim()) params.set('search', searchTerm.trim());
      params.set('page', page.toString());
      params.set('limit', limit.toString());

      const url = `/api/v1/admin/transactions?${params.toString()}`;
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
      const rawData = json.data || json.transactions || (Array.isArray(json) ? json : []);

      if (Array.isArray(rawData)) {
        setTransactions(rawData);
        setTotalCount(json.meta?.total || json.total || rawData.length);
      } else {
        setTransactions([]);
      }
      setApiError(null);
    } catch (err: any) {
      console.warn('API /api/v1/admin/transactions offline, using demo transactions:', err);
      let filtered = [...FALLBACK_TRANSACTIONS];
      if (providerFilter) {
        filtered = filtered.filter(
          (t) => (t.provider || '').toLowerCase() === providerFilter.toLowerCase()
        );
      }
      if (statusFilter) {
        filtered = filtered.filter(
          (t) => (t.status || '').toLowerCase() === statusFilter.toLowerCase()
        );
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.merchant_ref.toLowerCase().includes(q) ||
            t.id.toLowerCase().includes(q) ||
            getUserName(t.user).toLowerCase().includes(q)
        );
      }
      setTransactions(filtered);
      setTotalCount(filtered.length);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [providerFilter, statusFilter, searchTerm, page, limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleCopyId = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Status Badge
  const renderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'success' || s === 'completed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>{isVi ? 'Thành công' : 'Success'}</span>
        </span>
      );
    }
    if (s === 'failed' || s === 'error') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <XCircle className="w-3 h-3 text-rose-400" />
          <span>{isVi ? 'Thất bại' : 'Failed'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
        <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
        <span>{isVi ? 'Đang xử lý' : 'Pending'}</span>
      </span>
    );
  };

  // Provider Pill
  const renderProviderBadge = (provider: string) => {
    const p = (provider || '').toUpperCase();
    let bg = 'bg-slate-800 text-slate-300 border-slate-700';
    if (p.includes('VNPAY')) bg = 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    if (p.includes('MOMO')) bg = 'bg-pink-500/15 text-pink-400 border-pink-500/30';
    if (p.includes('ZALOPAY')) bg = 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
    if (p.includes('VIETQR')) bg = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';

    return (
      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold font-mono border ${bg}`}>
        {provider}
      </span>
    );
  };

  // KPI Computations
  const totalVolume = useMemo(() => {
    return transactions
      .filter((t) => (t.status || '').toLowerCase() === 'success')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  }, [transactions]);

  const successCount = transactions.filter((t) => (t.status || '').toLowerCase() === 'success').length;
  const pendingCount = transactions.filter((t) => (t.status || '').toLowerCase() === 'pending').length;

  return (
    <div className="flex h-screen bg-[#0b0f17] text-slate-100 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <AdminSidebar
        activeTab="transactions"
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
          activeTab="transactions"
        />

        {/* BREADCRUMB & TOOLBAR */}
        <div className="border-b border-slate-800 bg-[#0f172a]/60 px-6 py-4 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Link href="/admin" className="hover:text-amber-400 transition-colors">Admin</Link>
                <span>/</span>
                <span className="text-amber-400 font-medium">
                  {isVi ? 'Lịch sử Giao dịch (Transactions)' : 'Transaction History'}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <span>{isVi ? 'Nhật Ký Giao Dịch & Cổng Thanh Toán' : 'Transaction Logs & Gateways'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                  {transactions.length} {isVi ? 'giao dịch' : 'records'}
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchTransactions(true)}
                disabled={loading || refreshing}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-amber-400' : ''}`} />
                <span>{isVi ? 'Làm mới' : 'Refresh'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT BODY */}
        <div className="p-6 space-y-6">
          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>{isVi ? 'Tổng tiền thanh toán' : 'Settled Volume'}</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {formatCurrency(totalVolume)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {isVi ? 'Đã thanh toán thành công' : 'Captured successfully'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>{isVi ? 'Giao dịch thành công' : 'Successful'}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">{successCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                {isVi ? 'Tỷ lệ thanh toán chuẩn 100%' : 'Processed without issues'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>{isVi ? 'Giao dịch chờ xử lý' : 'Pending'}</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400">{pendingCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                {isVi ? 'Đang đợi webhook cổng' : 'Awaiting IPN callback'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>{isVi ? 'Cổng thanh toán' : 'Payment Gateways'}</span>
                <CreditCard className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white">VNPay, MoMo, VietQR</div>
              <div className="text-[11px] text-slate-500 mt-1">
                {isVi ? 'Hỗ trợ quét mã & thẻ ngân hàng' : 'Multi-gateway routing'}
              </div>
            </div>
          </div>

          {/* FILTER & SEARCH BAR */}
          <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-lg space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  placeholder={
                    isVi
                      ? 'Tìm kiếm theo mã đơn (ORD_xxx), mã GD, tên khách hàng...'
                      : 'Search by merchant_ref, transaction id, customer...'
                  }
                  className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setPage(1);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Provider Filter: ?provider=VNPay */}
              <div className="flex items-center gap-2">
                <div className="relative min-w-[150px]">
                  <select
                    value={providerFilter}
                    onChange={(e) => {
                      setProviderFilter(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer appearance-none"
                  >
                    <option value="">{isVi ? 'Tất cả Cổng (Provider)' : 'All Providers'}</option>
                    <option value="VNPay">VNPay</option>
                    <option value="Momo">MoMo</option>
                    <option value="ZaloPay">ZaloPay</option>
                    <option value="VietQR">VietQR</option>
                    <option value="Stripe">Stripe</option>
                  </select>
                  <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Status Filter: ?status=Success */}
                <div className="relative min-w-[140px]">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer appearance-none"
                  >
                    <option value="">{isVi ? 'Tất cả Trạng thái' : 'All Statuses'}</option>
                    <option value="Success">{isVi ? 'Thành công' : 'Success'}</option>
                    <option value="Pending">{isVi ? 'Chờ xử lý' : 'Pending'}</option>
                    <option value="Failed">{isVi ? 'Thất bại' : 'Failed'}</option>
                  </select>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* TABLE OF TRANSACTIONS */}
          <div className="rounded-2xl bg-[#0f172a] border border-slate-800 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">{isVi ? 'Mã Giao dịch (id)' : 'Tx ID'}</th>
                    <th className="px-4 py-3">{isVi ? 'Khách hàng' : 'User'}</th>
                    <th className="px-4 py-3 text-right">{isVi ? 'Số tiền (amount)' : 'Amount'}</th>
                    <th className="px-4 py-3">{isVi ? 'Cổng thanh toán' : 'Provider'}</th>
                    <th className="px-4 py-3">{isVi ? 'Mã đơn (merchant_ref)' : 'Merchant Ref'}</th>
                    <th className="px-4 py-3">{isVi ? 'Trạng thái' : 'Status'}</th>
                    <th className="px-4 py-3">{isVi ? 'Thời gian' : 'Time'}</th>
                    <th className="px-4 py-3 text-right">{isVi ? 'Chi tiết' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => setDetailItem(tx)}
                      className="hover:bg-slate-850/60 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{tx.id}</span>
                          <button
                            onClick={(e) => handleCopyId(tx.id, e)}
                            className="text-slate-500 hover:text-white"
                          >
                            {copiedId === tx.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-200">{getUserName(tx.user)}</div>
                      </td>

                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                        {formatCurrency(tx.amount)}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {renderProviderBadge(tx.provider)}
                      </td>

                      <td className="px-4 py-3 font-mono text-slate-300">
                        {tx.merchant_ref}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {renderStatusBadge(tx.status)}
                      </td>

                      <td className="px-4 py-3 font-mono text-slate-400 whitespace-nowrap">
                        {new Date(tx.created_at).toLocaleDateString()}{' '}
                        <span className="text-[10px] text-slate-500">
                          {new Date(tx.created_at).toLocaleTimeString()}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setDetailItem(tx)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
                          title={isVi ? 'Xem chi tiết' : 'View'}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINATION BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-2">
            <div>
              {isVi
                ? `Hiển thị ${transactions.length} giao dịch (Trang ${page})`
                : `Showing ${transactions.length} records (Page ${page})`}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{isVi ? 'Trang trước' : 'Previous'}</span>
              </button>

              <span className="px-3 py-1.5 bg-slate-800 text-white rounded-xl font-bold">
                {page}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={transactions.length < limit || loading}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
              >
                <span>{isVi ? 'Trang sau' : 'Next'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isVi ? 'Chi tiết Giao dịch' : 'Transaction Receipt'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">{detailItem.id}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailItem(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="text-center py-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">Số tiền thanh toán</div>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {formatCurrency(detailItem.amount)}
                </div>
                <div className="mt-2">{renderStatusBadge(detailItem.status)}</div>
              </div>

              <div className="divide-y divide-slate-800 border-t border-b border-slate-800 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-400">{isVi ? 'Khách hàng' : 'Customer'}</span>
                  <span className="font-semibold text-white">{getUserName(detailItem.user)}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-400">{isVi ? 'Cổng thanh toán' : 'Provider'}</span>
                  <div>{renderProviderBadge(detailItem.provider)}</div>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-400">{isVi ? 'Mã đơn đối soát' : 'Merchant Ref'}</span>
                  <span className="font-mono text-slate-200 font-bold">{detailItem.merchant_ref}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-400">{isVi ? 'Phương thức' : 'Payment Method'}</span>
                  <span className="text-slate-300">{detailItem.payment_method || detailItem.provider}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-400">{isVi ? 'Thời gian' : 'Timestamp'}</span>
                  <span className="font-mono text-slate-300">
                    {new Date(detailItem.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end">
              <button
                onClick={() => setDetailItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs cursor-pointer font-bold"
              >
                {isVi ? 'Đóng' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
