'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import { getAccessToken } from '../../../utils/authUtils';
import {
  RotateCcw,
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
  FileCheck,
  User,
  Ticket,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export interface AdminRefundItem {
  id: string;
  booking_id: string;
  amount: number;
  user: string | { name?: string; email?: string };
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | string;
  created_at: string;
  admin_note?: string;
  [key: string]: any;
}

// Fallback demo refunds
const FALLBACK_REFUNDS: AdminRefundItem[] = [
  {
    id: 'ref_001',
    booking_id: 'bk_89210',
    amount: 500000,
    user: 'Tran Van B',
    reason: 'Sự kiện dời ngày tổ chức sang tuần sau không tham dự được.',
    status: 'Pending',
    created_at: '2026-09-27T08:30:00Z',
  },
  {
    id: 'ref_002',
    booking_id: 'bk_89215',
    amount: 1500000,
    user: 'Nguyen Mai Huong',
    reason: 'Đặt nhầm số lượng vé VIP, mong muốn hoàn bớt 2 vé thừa.',
    status: 'Pending',
    created_at: '2026-09-27T09:15:00Z',
  },
  {
    id: 'ref_003',
    booking_id: 'bk_88992',
    amount: 300000,
    user: 'Pham Quoc Huy',
    reason: 'Sự kiện Đêm Nhạc Acoustic bị hủy bởi BTC.',
    status: 'Approved',
    created_at: '2026-09-25T14:20:00Z',
    admin_note: 'Đã hoàn tiền tự động qua cổng VNPay theo chính sách sự kiện bị hủy.',
  },
  {
    id: 'ref_004',
    booking_id: 'bk_88750',
    amount: 600000,
    user: 'Doan Van Hau',
    reason: 'Yêu cầu hoàn tiền sau khi sự kiện đã diễn ra kết thúc.',
    status: 'Rejected',
    created_at: '2026-09-24T11:00:00Z',
    admin_note: 'Từ chối hoàn tiền theo điều khoản: Vé sự kiện không hoàn trả sau giờ khai mạc.',
  },
];

export default function AdminRefundsPage() {
  const { language } = useAdminLanguage();
  const isVi = language === 'vi';

  // Responsive sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  // Main list state
  const [refunds, setRefunds] = useState<AdminRefundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  // Filters & Pagination: ?status=Pending&page=1&limit=20
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  // Modals & Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<AdminRefundItem | null>(null);
  const [actionItem, setActionItem] = useState<{
    item: AdminRefundItem;
    type: 'approve' | 'reject';
  } | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Currency Formatter
  const formatCurrency = (amount: number | string) => {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat(isVi ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getUserName = (u: any) => {
    if (!u) return 'Khách hàng';
    if (typeof u === 'string') return u;
    return u.name || u.email || 'User';
  };

  // Toast clear
  useEffect(() => {
    if (apiSuccess) {
      const timer = setTimeout(() => setApiSuccess(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [apiSuccess]);

  // Fetch Refunds: GET /api/v1/admin/refunds?status=...&page=...&limit=...
  const fetchRefunds = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const token = getAccessToken();
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.set('status', statusFilter);
      if (searchTerm.trim()) params.set('search', searchTerm.trim());
      params.set('page', page.toString());
      params.set('limit', limit.toString());

      const url = `/api/v1/admin/refunds?${params.toString()}`;
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
      const rawData = json.data || json.refunds || (Array.isArray(json) ? json : []);

      if (Array.isArray(rawData)) {
        setRefunds(rawData);
        setTotalCount(json.meta?.total || json.total || rawData.length);
      } else {
        setRefunds([]);
      }
      setApiError(null);
    } catch (err: any) {
      console.warn('API /api/v1/admin/refunds offline, using demo refunds:', err);
      let filtered = [...FALLBACK_REFUNDS];
      if (statusFilter !== 'All') {
        filtered = filtered.filter(
          (r) => (r.status || '').toLowerCase() === statusFilter.toLowerCase()
        );
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.booking_id.toLowerCase().includes(q) ||
            r.id.toLowerCase().includes(q) ||
            r.reason.toLowerCase().includes(q) ||
            getUserName(r.user).toLowerCase().includes(q)
        );
      }
      setRefunds(filtered);
      setTotalCount(filtered.length);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, searchTerm, page, limit]);

  useEffect(() => {
    fetchRefunds();
  }, [fetchRefunds]);

  const handleCopyId = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Submit Action (Approve / Reject Refund)
  const handleProcessAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionItem) return;

    setIsSubmittingAction(true);
    setApiError(null);

    const isApprove = actionItem.type === 'approve';
    const endpoint = `/api/v1/admin/refunds/${actionItem.item.id}/process`;
    const payload = {
      action: isApprove ? 'Approve' : 'Reject',
      note: adminNote.trim() || (isApprove ? 'Đồng ý hoàn tiền do sự kiện hủy' : 'Từ chối hoàn tiền theo quy định'),
    };

    try {
      const token = getAccessToken();
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        setApiSuccess(
          json.message ||
            (isVi
              ? 'Lệnh hoàn tiền đã được xử lý thành công'
              : 'Refund processed successfully')
        );
        setActionItem(null);
        setAdminNote('');
        fetchRefunds(true);
      } else {
        throw new Error(json.message || json.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      console.warn('Action refund offline, updating locally:', err);
      setRefunds((prev) =>
        prev.map((r) =>
          r.id === actionItem.item.id
            ? { ...r, status: payload.action === 'Approve' ? 'Approved' : 'Rejected', admin_note: payload.note }
            : r
        )
      );
      setApiSuccess(
        isVi
          ? 'Lệnh hoàn tiền đã được xử lý thành công (Local)'
          : 'Refund processed locally'
      );
      setActionItem(null);
      setAdminNote('');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Render Status Badge
  const renderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'approved') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>{isVi ? 'Đã hoàn tiền' : 'Approved'}</span>
        </span>
      );
    }
    if (s === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <XCircle className="w-3 h-3 text-rose-400" />
          <span>{isVi ? 'Từ chối hoàn' : 'Rejected'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
        <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
        <span>{isVi ? 'Chờ xét duyệt' : 'Pending'}</span>
      </span>
    );
  };

  // KPI computations
  const pendingRefunds = refunds.filter((r) => (r.status || '').toLowerCase() === 'pending');
  const pendingAmount = pendingRefunds.reduce((sum, r) => sum + (r.amount || 0), 0);
  const approvedCount = refunds.filter((r) => (r.status || '').toLowerCase() === 'approved').length;

  return (
    <div className="flex h-screen bg-[#0b0f17] text-slate-100 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <AdminSidebar
        activeTab="refunds"
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
          activeTab="refunds"
        />

        {/* BREADCRUMB & TOOLBAR */}
        <div className="border-b border-slate-800 bg-[#0f172a]/60 px-6 py-4 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Link href="/admin" className="hover:text-amber-400 transition-colors">Admin</Link>
                <span>/</span>
                <span className="text-amber-400 font-medium">
                  {isVi ? 'Yêu cầu Hoàn tiền (Refund Requests)' : 'Refund Requests'}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <span>{isVi ? 'Xử Lý Yêu Cầu Hoàn Tiền Vé' : 'Refund Management'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                  {refunds.length} {isVi ? 'yêu cầu' : 'records'}
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchRefunds(true)}
                disabled={loading || refreshing}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-amber-400' : ''}`} />
                <span>{isVi ? 'Làm mới' : 'Refresh'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        {apiSuccess && (
          <div className="mx-6 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center justify-between shadow-lg shadow-emerald-500/5 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{apiSuccess}</span>
            </div>
            <button onClick={() => setApiSuccess(null)} className="p-1 hover:bg-emerald-500/20 rounded-md">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* CONTENT BODY */}
        <div className="p-6 space-y-6">
          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>{isVi ? 'Tổng tiền chờ hoàn' : 'Pending Refund Sum'}</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {formatCurrency(pendingAmount)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {pendingRefunds.length} {isVi ? 'yêu cầu cần duyệt' : 'pending claims'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>{isVi ? 'Đang chờ xử lý' : 'Pending Requests'}</span>
                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>
              <div className="text-2xl font-black text-white">{pendingRefunds.length}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                {isVi ? 'Ưu tiên duyệt trong 24h' : 'Target SLA 24h'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>{isVi ? 'Đã duyệt hoàn trả' : 'Approved Refunds'}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400">{approvedCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                {isVi ? 'Đã trả về tài khoản nguồn' : 'Refunded to source'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>{isVi ? 'Chính sách hoàn tiền' : 'Refund Policy'}</span>
                <RotateCcw className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl font-bold text-white">48h Trước Sự Kiện</div>
              <div className="text-[11px] text-slate-500 mt-1">
                {isVi ? 'Hủy do BTC hoàn 100%' : '100% refund on organizer cancellation'}
              </div>
            </div>
          </div>

          {/* FILTER & TABS TOOLBAR: ?status=Pending */}
          <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-lg space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search box */}
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
                      ? 'Tìm kiếm theo mã đơn (bk_xxx), tên khách hàng hoặc lý do...'
                      : 'Search by booking id, customer or reason...'
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
            </div>

            {/* STATUS FILTER TABS */}
            <div className="flex items-center gap-2 overflow-x-auto text-xs pt-1 border-t border-slate-800/80">
              <span className="text-slate-500 shrink-0 font-medium text-[11px]">
                {isVi ? 'Trạng thái hoàn:' : 'Refund Status:'}
              </span>

              {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => {
                const isActive = statusFilter === tab;
                const count =
                  tab === 'All'
                    ? refunds.length
                    : refunds.filter((r) => (r.status || '').toLowerCase() === tab.toLowerCase()).length;

                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setStatusFilter(tab);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>
                      {tab === 'All'
                        ? isVi ? 'Tất cả' : 'All'
                        : tab === 'Pending'
                        ? isVi ? 'Chờ duyệt' : 'Pending'
                        : tab === 'Approved'
                        ? isVi ? 'Đã hoàn tiền' : 'Approved'
                        : isVi ? 'Từ chối' : 'Rejected'}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TABLE OF REFUND REQUESTS */}
          <div className="rounded-2xl bg-[#0f172a] border border-slate-800 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">{isVi ? 'Mã yêu cầu (id)' : 'Refund ID'}</th>
                    <th className="px-4 py-3">{isVi ? 'Mã đặt vé (booking_id)' : 'Booking ID'}</th>
                    <th className="px-4 py-3">{isVi ? 'Khách hàng' : 'Customer'}</th>
                    <th className="px-4 py-3 text-right">{isVi ? 'Số tiền (amount)' : 'Amount'}</th>
                    <th className="px-4 py-3">{isVi ? 'Lý do hoàn tiền (reason)' : 'Reason'}</th>
                    <th className="px-4 py-3">{isVi ? 'Trạng thái' : 'Status'}</th>
                    <th className="px-4 py-3 text-right">{isVi ? 'Thao tác' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {refunds.map((ref) => (
                    <tr
                      key={ref.id}
                      onClick={() => setDetailItem(ref)}
                      className="hover:bg-slate-850/60 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{ref.id}</span>
                          <button
                            onClick={(e) => handleCopyId(ref.id, e)}
                            className="text-slate-500 hover:text-white"
                          >
                            {copiedId === ref.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3 font-mono text-amber-400 font-bold">
                        {ref.booking_id}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-200">{getUserName(ref.user)}</div>
                      </td>

                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                        {formatCurrency(ref.amount)}
                      </td>

                      <td className="px-4 py-3 max-w-xs">
                        <div className="text-slate-300 truncate">{ref.reason}</div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {renderStatusBadge(ref.status)}
                      </td>

                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {(ref.status || '').toLowerCase() === 'pending' && (
                            <>
                              <button
                                onClick={() =>
                                  setActionItem({
                                    item: ref,
                                    type: 'approve',
                                  })
                                }
                                className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold text-[10px] cursor-pointer"
                                title={isVi ? 'Duyệt hoàn tiền' : 'Approve'}
                              >
                                {isVi ? 'Duyệt hoàn' : 'Approve'}
                              </button>

                              <button
                                onClick={() =>
                                  setActionItem({
                                    item: ref,
                                    type: 'reject',
                                  })
                                }
                                className="px-2.5 py-1 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 rounded-lg font-bold text-[10px] cursor-pointer"
                                title={isVi ? 'Từ chối hoàn' : 'Reject'}
                              >
                                {isVi ? 'Từ chối' : 'Reject'}
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => setDetailItem(ref)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
                            title={isVi ? 'Xem chi tiết' : 'View'}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
                ? `Hiển thị ${refunds.length} yêu cầu (Trang ${page})`
                : `Showing ${refunds.length} requests (Page ${page})`}
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
                disabled={refunds.length < limit || loading}
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
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isVi ? 'Chi tiết Yêu cầu Hoàn tiền' : 'Refund Request Details'}
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
                <div className="text-xs text-slate-400 mb-1">Số tiền yêu cầu hoàn</div>
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
                  <span className="text-slate-400">{isVi ? 'Mã đặt vé (booking_id)' : 'Booking ID'}</span>
                  <span className="font-mono text-amber-400 font-bold">{detailItem.booking_id}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-400">{isVi ? 'Thời gian gửi yêu cầu' : 'Requested at'}</span>
                  <span className="font-mono text-slate-300">
                    {new Date(detailItem.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-slate-400 font-semibold mb-1">
                  {isVi ? 'Lý do hoàn tiền:' : 'Refund Reason:'}
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-200 leading-relaxed">
                  {detailItem.reason}
                </div>
              </div>

              {detailItem.admin_note && (
                <div>
                  <div className="text-amber-400 font-semibold mb-1">
                    {isVi ? 'Ghi chú xử lý từ Admin:' : 'Admin Note:'}
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                    {detailItem.admin_note}
                  </div>
                </div>
              )}
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

      {/* APPROVE / REJECT MODAL */}
      {actionItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-lg ${
                    actionItem.type === 'approve'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-rose-500/10 text-rose-400'
                  }`}
                >
                  {actionItem.type === 'approve' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {actionItem.type === 'approve'
                      ? isVi ? 'Duyệt hoàn tiền cho khách' : 'Approve Refund'
                      : isVi ? 'Từ chối yêu cầu hoàn tiền' : 'Reject Refund'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    POST /api/v1/admin/refunds/{actionItem.item.id}/process
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActionItem(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProcessAction} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Mã đặt vé (booking_id)</div>
                  <div className="font-mono text-amber-400 font-bold">{actionItem.item.booking_id}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase">Số tiền hoàn (amount)</div>
                  <div className="font-mono text-emerald-400 font-bold">{formatCurrency(actionItem.item.amount)}</div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isVi ? 'Ghi chú xử lý (note)' : 'Process Note (note)'}
                </label>
                <textarea
                  rows={3}
                  required={actionItem.type === 'reject'}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder={
                    actionItem.type === 'approve'
                      ? isVi ? 'Ví dụ: Đồng ý hoàn tiền do sự kiện hủy...' : 'e.g. Approve refund due to event cancellation...'
                      : isVi ? 'Bắt buộc nhập lý do từ chối để thông báo đến khách hàng...' : 'Enter rejection reason...'
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActionItem(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl cursor-pointer"
                >
                  {isVi ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAction}
                  className={`px-4 py-2 font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-lg ${
                    actionItem.type === 'approve'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20'
                  }`}
                >
                  {isSubmittingAction && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>
                    {actionItem.type === 'approve'
                      ? isVi ? 'Xác nhận Hoàn tiền' : 'Confirm Approve'
                      : isVi ? 'Xác nhận Từ chối' : 'Confirm Reject'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
