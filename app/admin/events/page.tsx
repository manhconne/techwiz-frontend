'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import { getAccessToken } from '../../../utils/authUtils';
import {
  Calendar,
  Search,
  RefreshCw,
  WifiOff,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Sparkles,
  LayoutGrid,
  List,
  Filter,
  User,
  Trash2,
  ShieldCheck,
  Flag,
  FileText,
  ExternalLink,
  ChevronDown,
  Info,
} from 'lucide-react';

// Data item interface matching API response:
// { id: "cnt_xxx", title: "Review Anime Mùa Thu", author: "User B", status: "Pending", created_at: "2026-09-25" }
export interface AdminContentItem {
  id: string;
  title: string;
  author: string;
  status: 'Pending' | 'Published' | 'Flagged' | string;
  created_at: string;
  category_id?: string;
  category?: string;
  description?: string;
  views?: number;
  [key: string]: any;
}

export interface ApiResponseMeta {
  total: number;
  page: number;
  limit?: number;
}

// Fallback demo data to showcase the UI if backend /api/v1/admin/contents is offline
const FALLBACK_CONTENTS: AdminContentItem[] = [
  {
    id: 'cnt_001',
    title: 'Review Anime Mùa Thu: Những siêu phẩm đáng xem nhất năm 2026',
    author: 'User B',
    status: 'Pending',
    created_at: '2026-09-25',
    category: 'Review',
    category_id: 'cat_review',
    description: 'Tổng hợp đánh giá chi tiết các bộ anime nổi bật phát sóng trong mùa thu năm nay, phân tích cốt truyện và chất lượng hoạt họa.',
    views: 1240,
  },
  {
    id: 'cnt_002',
    title: 'Hội thảo Công Nghệ AI & Web3 Fan Hub 2026',
    author: 'Admin Tech',
    status: 'Published',
    created_at: '2026-09-24',
    category: 'Sự kiện',
    category_id: 'cat_event',
    description: 'Chương trình hội thảo kết nối cộng đồng nhà phát triển và người hâm mộ công nghệ trên toàn quốc.',
    views: 8450,
  },
  {
    id: 'cnt_003',
    title: 'Nghi vấn bài viết chứa liên kết quảng cáo không hợp lệ',
    author: 'Spammer99',
    status: 'Flagged',
    created_at: '2026-09-23',
    category: 'Báo cáo',
    category_id: 'cat_report',
    description: 'Nội dung bị cộng đồng người dùng báo cáo nhiều lần do chứa liên kết spam và nội dung không phù hợp chuẩn mực.',
    views: 210,
  },
  {
    id: 'cnt_004',
    title: 'K-POP World Tour 2026: Hướng dẫn săn vé mở bán Presale độc quyền',
    author: 'MusicLover',
    status: 'Published',
    created_at: '2026-09-22',
    category: 'Sự kiện',
    category_id: 'cat_event',
    description: 'Kinh nghiệm chuẩn bị tài khoản, thẻ thanh toán quốc tế và khung giờ săn vé mở bán đợt 1 dành riêng cho hội viên.',
    views: 14200,
  },
  {
    id: 'cnt_005',
    title: 'Thông tin fansign chưa được kiểm duyệt chính thức từ ban tổ chức',
    author: 'LeakerFan',
    status: 'Flagged',
    created_at: '2026-09-21',
    category: 'Tin tức',
    category_id: 'cat_news',
    description: 'Bài viết chia sẻ thông tin rò rỉ chưa qua xác minh, cần kiểm duyệt kỹ trước khi cho phép hiển thị rộng rãi.',
    views: 890,
  },
  {
    id: 'cnt_006',
    title: 'Cẩm nang bình chọn Tân binh của năm tại giải thưởng âm nhạc',
    author: 'VoteLeader',
    status: 'Pending',
    created_at: '2026-09-20',
    category: 'Hướng dẫn',
    category_id: 'cat_guide',
    description: 'Chi tiết các bước cài đặt ứng dụng và xác thực tài khoản để tích lũy điểm bầu chọn cho nghệ sĩ yêu thích.',
    views: 3100,
  },
  {
    id: 'cnt_007',
    title: 'Fan Meeting kỷ niệm 5 năm ra mắt: Lịch trình & địa điểm tổ chức',
    author: 'OfficialFanclub',
    status: 'Published',
    created_at: '2026-09-18',
    category: 'Sự kiện',
    category_id: 'cat_event',
    description: 'Thông báo chính thức về buổi gặp gỡ thân mật giữa nghệ sĩ và người hâm mộ tại Trung tâm Hội nghị Quốc gia.',
    views: 22800,
  },
];

export default function AdminEventsPage() {
  const { language } = useAdminLanguage();
  const isVi = language === 'vi';

  // Responsive sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  // API State
  const [contents, setContents] = useState<AdminContentItem[]>([]);
  const [meta, setMeta] = useState<ApiResponseMeta>({ total: 0, page: 1, limit: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnectionError, setIsConnectionError] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  // Filters state (matching API doc: ?status=Pending|Published|Flagged&category_id=...&page=1&limit=20)
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Published' | 'Flagged'>('all');
  const [categoryIdFilter, setCategoryIdFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modals state
  const [selectedItem, setSelectedItem] = useState<AdminContentItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Status Change Modal
  const [statusChangeItem, setStatusChangeItem] = useState<AdminContentItem | null>(null);
  const [targetStatus, setTargetStatus] = useState<'Pending' | 'Published' | 'Flagged'>('Published');
  const [adminNote, setAdminNote] = useState('');
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);

  // Delete Modal
  const [deleteItem, setDeleteItem] = useState<AdminContentItem | null>(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  // Toasts
  const [actionToast, setActionToast] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
    details?: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auto-hide toast
  useEffect(() => {
    if (actionToast) {
      const timer = setTimeout(() => setActionToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionToast]);

  // Responsive sidebar detection
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  // Fetch from API: GET /api/v1/admin/contents?status=Pending|Published|Flagged&category_id=...&page=1&limit=20
  const fetchContents = useCallback(async () => {
    setIsLoading(true);
    setIsConnectionError(false);

    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const params = new URLSearchParams();
    if (statusFilter !== 'all') {
      params.set('status', statusFilter);
    }
    if (categoryIdFilter !== 'all' && categoryIdFilter.trim()) {
      params.set('category_id', categoryIdFilter.trim());
    }
    params.set('page', String(page));
    params.set('limit', String(limit));

    const endpoint = `/api/v1/admin/contents?${params.toString()}`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const resJson = await response.json();

      // Expected format: { data: [...], meta: { total: 25, page: 1 } }
      if (resJson && Array.isArray(resJson.data)) {
        setContents(resJson.data);
        setUsingFallback(false);
        if (resJson.meta) {
          setMeta({
            total: Number(resJson.meta.total) || resJson.data.length,
            page: Number(resJson.meta.page) || page,
            limit: Number(resJson.meta.limit) || limit,
          });
        } else {
          setMeta({
            total: resJson.data.length,
            page,
            limit,
          });
        }
      } else if (Array.isArray(resJson)) {
        setContents(resJson);
        setUsingFallback(false);
        setMeta({ total: resJson.length, page: 1, limit });
      } else {
        throw new Error('Invalid JSON format');
      }
    } catch (err: any) {
      console.warn('API /api/v1/admin/contents error, loading fallback UI demo data:', err);
      setIsConnectionError(true);
      setUsingFallback(true);

      // Provide filtered fallback data so UI remains interactive
      let filtered = [...FALLBACK_CONTENTS];
      if (statusFilter !== 'all') {
        filtered = filtered.filter((item) => item.status.toLowerCase() === statusFilter.toLowerCase());
      }
      if (categoryIdFilter !== 'all') {
        filtered = filtered.filter((item) => item.category_id === categoryIdFilter);
      }
      setContents(filtered);
      setMeta({
        total: filtered.length,
        page,
        limit,
      });
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, categoryIdFilter, page, limit]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  // Client-side search & filtering over current contents
  const displayedItems = useMemo(() => {
    const term = (searchQuery || headerSearch).toLowerCase().trim();
    if (!term) return contents;

    return contents.filter((item) => {
      const titleMatch = (item.title || '').toLowerCase().includes(term);
      const authorMatch = (item.author || '').toLowerCase().includes(term);
      const idMatch = (item.id || '').toLowerCase().includes(term);
      const categoryMatch = (item.category || '').toLowerCase().includes(term);
      return titleMatch || authorMatch || idMatch || categoryMatch;
    });
  }, [contents, searchQuery, headerSearch]);

  // Summary counts
  const totalCount = meta.total || displayedItems.length;
  const countPending = displayedItems.filter((i) => (i.status || '').toLowerCase() === 'pending').length;
  const countPublished = displayedItems.filter((i) => (i.status || '').toLowerCase() === 'published').length;
  const countFlagged = displayedItems.filter((i) => (i.status || '').toLowerCase() === 'flagged').length;

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  // Copy ID helper
  const handleCopyId = (id: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Status Change Submit
  const handleStatusChangeSubmit = async () => {
    if (!statusChangeItem) return;
    setIsSubmittingStatus(true);

    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`/api/v1/admin/contents/${encodeURIComponent(statusChangeItem.id)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          status: targetStatus,
          admin_note: adminNote.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      setContents((prev) =>
        prev.map((item) =>
          item.id === statusChangeItem.id ? { ...item, status: targetStatus } : item
        )
      );

      setActionToast({
        type: 'success',
        message: isVi ? `Cập nhật trạng thái thành ${targetStatus} thành công!` : `Status updated to ${targetStatus}!`,
        details: `ID: ${statusChangeItem.id}`,
      });
      setStatusChangeItem(null);
    } catch {
      // Local optimistic update
      setContents((prev) =>
        prev.map((item) =>
          item.id === statusChangeItem.id ? { ...item, status: targetStatus } : item
        )
      );
      setActionToast({
        type: 'warning',
        message: isVi ? `Đã cập nhật giao diện thành ${targetStatus} (Offline mode)` : `Status updated locally to ${targetStatus}`,
        details: `PUT /api/v1/admin/contents/${statusChangeItem.id}`,
      });
      setStatusChangeItem(null);
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  // Delete Content Submit
  const handleDeleteSubmit = async () => {
    if (!deleteItem) return;
    setIsSubmittingDelete(true);

    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`/api/v1/admin/contents/${encodeURIComponent(deleteItem.id)}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      setContents((prev) => prev.filter((item) => item.id !== deleteItem.id));
      setActionToast({
        type: 'success',
        message: isVi ? 'Đã xóa nội dung thành công' : 'Content deleted successfully',
      });
      setDeleteItem(null);
    } catch {
      // Local optimistic delete
      setContents((prev) => prev.filter((item) => item.id !== deleteItem.id));
      setActionToast({
        type: 'warning',
        message: isVi ? 'Đã xóa trên giao diện (Offline mode)' : 'Removed locally from view',
      });
      setDeleteItem(null);
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  // Status Badge Component
  const renderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'published' || s === 'active' || s === 'approved') {
      return (
        <span
          style={{ borderRadius: '6px' }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>{isVi ? 'Đã xuất bản' : 'Published'}</span>
        </span>
      );
    }
    if (s === 'flagged' || s === 'rejected' || s === 'banned') {
      return (
        <span
          style={{ borderRadius: '6px' }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          <span>{isVi ? 'Bị báo cáo' : 'Flagged'}</span>
        </span>
      );
    }
    // Default Pending
    return (
      <span
        style={{ borderRadius: '6px' }}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
      >
        <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        <span>{isVi ? 'Chờ duyệt' : 'Pending'}</span>
      </span>
    );
  };

  return (
    <div
      translate="no"
      className="notranslate min-h-screen bg-slate-900 text-slate-100 font-sans flex"
    >
      {/* Admin Sidebar */}
      <AdminSidebar
        activeTab="events"
        setActiveTab={() => {}}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <AdminHeader
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          searchQuery={headerSearch}
          setSearchQuery={setHeaderSearch}
          activeTab="events"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto space-y-6">
          {/* Toast Notification */}
          {actionToast && (
            <div
              style={{ borderRadius: '10px' }}
              className={`p-3.5 text-xs font-bold flex items-center justify-between gap-3 shadow-lg border ${
                actionToast.type === 'success'
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : actionToast.type === 'warning'
                  ? 'bg-amber-600 text-white border-amber-500'
                  : 'bg-rose-600 text-white border-rose-500'
              }`}
            >
              <div className="flex items-center gap-2">
                {actionToast.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                )}
                <span>{actionToast.message}</span>
                {actionToast.details && (
                  <span className="opacity-80 font-mono text-[11px] ml-2">({actionToast.details})</span>
                )}
              </div>
              <button
                onClick={() => setActionToast(null)}
                className="p-1 hover:bg-black/20 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Page Title & Status Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    {isVi ? 'Quản Lý Nội Dung & Sự Kiện' : 'Content & Event Management'}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                      /api/v1/admin/contents
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isVi
                      ? 'Kiểm duyệt bài viết, quản lý sự kiện và xử lý nội dung bị báo cáo theo thời gian thực.'
                      : 'Review articles, manage events, and handle flagged submissions in real-time.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              {/* Live Endpoint Status Indicator */}
              <div
                style={{ borderRadius: '8px' }}
                className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-2 border ${
                  !isConnectionError
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${!isConnectionError ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="font-mono text-[11px]">
                  {!isConnectionError ? 'GET 200 OK' : 'Demo Mode (Backend Offline)'}
                </span>
              </div>

              <button
                onClick={fetchContents}
                disabled={isLoading}
                style={{ borderRadius: '8px' }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Làm mới dữ liệu từ API"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isVi ? 'Làm mới' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                <span>{isVi ? 'Tổng nội dung' : 'Total Items'}</span>
                <FileText className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white">{totalCount}</div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">meta.total: {meta.total}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-amber-500/30 backdrop-blur-sm">
              <div className="flex items-center justify-between text-amber-400 text-xs font-semibold mb-2">
                <span>{isVi ? 'Chờ duyệt' : 'Pending Review'}</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-300">{countPending}</div>
              <div className="text-[11px] text-amber-400/80 mt-1">status=Pending</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-emerald-500/30 backdrop-blur-sm">
              <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold mb-2">
                <span>{isVi ? 'Đã xuất bản' : 'Published'}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-300">{countPublished}</div>
              <div className="text-[11px] text-emerald-400/80 mt-1">status=Published</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-rose-500/30 backdrop-blur-sm">
              <div className="flex items-center justify-between text-rose-400 text-xs font-semibold mb-2">
                <span>{isVi ? 'Bị báo cáo' : 'Flagged'}</span>
                <Flag className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-black text-rose-300">{countFlagged}</div>
              <div className="text-[11px] text-rose-400/80 mt-1">status=Flagged</div>
            </div>
          </div>

          {/* Filtering and Search Controls */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Status Filter Tabs (Matching API query ?status=Pending|Published|Flagged) */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-lg border border-slate-700/80 overflow-x-auto">
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === 'all'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isVi ? 'Tất cả' : 'All'}
                </button>
                <button
                  onClick={() => {
                    setStatusFilter('Pending');
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    statusFilter === 'Pending'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-amber-400/80 hover:text-amber-300'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Chờ duyệt (Pending)' : 'Pending'}</span>
                </button>
                <button
                  onClick={() => {
                    setStatusFilter('Published');
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    statusFilter === 'Published'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-400/80 hover:text-emerald-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Đã xuất bản (Published)' : 'Published'}</span>
                </button>
                <button
                  onClick={() => {
                    setStatusFilter('Flagged');
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    statusFilter === 'Flagged'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-rose-400/80 hover:text-rose-300'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Bị báo cáo (Flagged)' : 'Flagged'}</span>
                </button>
              </div>

              {/* View switch & page size */}
              <div className="flex items-center gap-3 self-end lg:self-auto">
                <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-700/80">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-md cursor-pointer ${
                      viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Bảng biểu (Table)"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md cursor-pointer ${
                      viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Dạng lưới (Grid)"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{isVi ? 'Hiển thị:' : 'Limit:'}</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Search Input & Category Filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isVi
                      ? 'Tìm kiếm theo tiêu đề, tác giả, mã ID (cnt_xxx)...'
                      : 'Search by title, author, or ID (cnt_xxx)...'
                  }
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="relative">
                <select
                  value={categoryIdFilter}
                  onChange={(e) => {
                    setCategoryIdFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none"
                >
                  <option value="all">{isVi ? 'Tất cả danh mục' : 'All Categories'}</option>
                  <option value="cat_review">Review</option>
                  <option value="cat_event">{isVi ? 'Sự kiện (Event)' : 'Events'}</option>
                  <option value="cat_news">{isVi ? 'Tin tức (News)' : 'News'}</option>
                  <option value="cat_guide">{isVi ? 'Hướng dẫn (Guide)' : 'Guides'}</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Content List Table / Grid */}
          {isLoading ? (
            <div className="p-12 text-center bg-slate-800/40 rounded-xl border border-slate-700/60">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300">
                {isVi ? 'Đang tải danh sách từ /api/v1/admin/contents...' : 'Fetching contents from API...'}
              </p>
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="p-12 text-center bg-slate-800/40 rounded-xl border border-slate-700/60">
              <FileText className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">
                {isVi ? 'Không tìm thấy nội dung nào' : 'No contents found'}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                {isVi
                  ? 'Không có dữ liệu bài viết hoặc sự kiện phù hợp với bộ lọc hiện tại.'
                  : 'No records matching the selected status or query filters.'}
              </p>
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setCategoryIdFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                {isVi ? 'Xóa bộ lọc' : 'Clear Filters'}
              </button>
            </div>
          ) : viewMode === 'table' ? (
            /* TABLE VIEW */
            <div className="overflow-x-auto rounded-xl border border-slate-700/70 bg-slate-800/40 backdrop-blur-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/80 bg-slate-900/60 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">{isVi ? 'Tiêu đề nội dung' : 'Title'}</th>
                    <th className="py-3 px-4">{isVi ? 'Tác giả' : 'Author'}</th>
                    <th className="py-3 px-4">{isVi ? 'Trạng thái' : 'Status'}</th>
                    <th className="py-3 px-4">{isVi ? 'Ngày tạo' : 'Created At'}</th>
                    <th className="py-3 px-4 text-right">{isVi ? 'Thao tác' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {displayedItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-700/30 transition-colors group"
                    >
                      {/* ID with Copy button */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-indigo-400 font-bold">
                          <span>{item.id}</span>
                          <button
                            onClick={() => handleCopyId(item.id)}
                            className="text-slate-500 hover:text-indigo-300 p-1 rounded transition-colors cursor-pointer"
                            title="Sao chép ID"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Title */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white max-w-[360px] line-clamp-2 leading-relaxed">
                          {item.title}
                        </div>
                        {item.category && (
                          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-semibold">
                            {item.category}
                          </span>
                        )}
                      </td>

                      {/* Author */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-[10px] border border-indigo-500/30">
                            {item.author ? item.author.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <span className="font-semibold text-slate-200">{item.author || 'N/A'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {renderStatusBadge(item.status)}
                      </td>

                      {/* Created At */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{item.created_at}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Detail */}
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setIsDetailModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
                            title={isVi ? 'Xem chi tiết' : 'View Details'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Change Status / Approve */}
                          <button
                            onClick={() => {
                              setStatusChangeItem(item);
                              setTargetStatus(item.status === 'Published' ? 'Pending' : 'Published');
                              setAdminNote('');
                            }}
                            className="p-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white transition-colors cursor-pointer"
                            title={isVi ? 'Cập nhật trạng thái' : 'Change Status'}
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>

                          {/* Delete Item */}
                          <button
                            onClick={() => setDeleteItem(item)}
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                            title={isVi ? 'Xóa nội dung' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/70 hover:border-slate-600 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-indigo-400">
                        <span>{item.id}</span>
                        <button
                          onClick={() => handleCopyId(item.id)}
                          className="p-0.5 text-slate-500 hover:text-white"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      {renderStatusBadge(item.status)}
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-2 mb-2 leading-snug">
                      {item.title}
                    </h4>

                    {item.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/60">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.author}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.created_at}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-700/60">
                    {item.category && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-semibold">
                        {item.category}
                      </span>
                    )}

                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setIsDetailModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold cursor-pointer"
                      >
                        {isVi ? 'Xem' : 'View'}
                      </button>
                      <button
                        onClick={() => {
                          setStatusChangeItem(item);
                          setTargetStatus(item.status === 'Published' ? 'Pending' : 'Published');
                          setAdminNote('');
                        }}
                        className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
                      >
                        {isVi ? 'Duyệt' : 'Status'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="text-xs text-slate-400 font-mono">
              {isVi
                ? `Hiển thị ${displayedItems.length} trên tổng ${totalCount} mục (Trang ${page} / ${totalPages})`
                : `Showing ${displayedItems.length} of ${totalCount} entries (Page ${page} of ${totalPages})`}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isVi ? 'Trước' : 'Prev'}</span>
              </button>

              <div className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono font-bold text-indigo-400">
                {page} / {totalPages}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{isVi ? 'Sau' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* DETAIL MODAL */}
      {isDetailModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">
                  {isVi ? 'Chi Tiết Nội Dung / Sự Kiện' : 'Content Details'}
                </h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-800/70 border border-slate-700 flex items-center justify-between font-mono">
                <span className="text-slate-400">ID:</span>
                <span className="text-indigo-400 font-bold">{selectedItem.id}</span>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">
                  {isVi ? 'Tiêu đề:' : 'Title:'}
                </label>
                <div className="text-white text-sm font-bold p-3 bg-slate-800/50 rounded-lg border border-slate-700/80">
                  {selectedItem.title}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/80">
                  <div className="text-slate-400 font-semibold mb-1">{isVi ? 'Tác giả:' : 'Author:'}</div>
                  <div className="text-white font-bold">{selectedItem.author}</div>
                </div>

                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/80">
                  <div className="text-slate-400 font-semibold mb-1">{isVi ? 'Trạng thái:' : 'Status:'}</div>
                  <div>{renderStatusBadge(selectedItem.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/80">
                  <div className="text-slate-400 font-semibold mb-1">{isVi ? 'Danh mục:' : 'Category:'}</div>
                  <div className="text-white font-medium">{selectedItem.category || selectedItem.category_id || 'N/A'}</div>
                </div>

                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/80">
                  <div className="text-slate-400 font-semibold mb-1">{isVi ? 'Ngày tạo:' : 'Created At:'}</div>
                  <div className="text-white font-mono">{selectedItem.created_at}</div>
                </div>
              </div>

              {selectedItem.description && (
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">
                    {isVi ? 'Mô tả tóm tắt:' : 'Description:'}
                  </label>
                  <p className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/80 text-slate-300 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-800/60 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors"
              >
                {isVi ? 'Đóng' : 'Close'}
              </button>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setStatusChangeItem(selectedItem);
                  setTargetStatus(selectedItem.status === 'Published' ? 'Pending' : 'Published');
                  setAdminNote('');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors"
              >
                {isVi ? 'Thay đổi trạng thái' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATUS CHANGE / REVIEW MODAL */}
      {statusChangeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">
                  {isVi ? 'Cập Nhật Trạng Thái' : 'Change Status'}
                </h3>
              </div>
              <button
                onClick={() => setStatusChangeItem(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="text-slate-400 mb-1">{isVi ? 'Tiêu đề nội dung:' : 'Content Title:'}</div>
                <div className="text-white font-bold">{statusChangeItem.title}</div>
                <div className="text-[11px] text-indigo-400 font-mono mt-1">ID: {statusChangeItem.id}</div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-2">
                  {isVi ? 'Chọn trạng thái mới:' : 'Select New Status:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetStatus('Pending')}
                    className={`p-2.5 rounded-lg border text-center font-bold transition-all cursor-pointer ${
                      targetStatus === 'Pending'
                        ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetStatus('Published')}
                    className={`p-2.5 rounded-lg border text-center font-bold transition-all cursor-pointer ${
                      targetStatus === 'Published'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    Published
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetStatus('Flagged')}
                    className={`p-2.5 rounded-lg border text-center font-bold transition-all cursor-pointer ${
                      targetStatus === 'Flagged'
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    Flagged
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1.5">
                  {isVi ? 'Ghi chú kiểm duyệt (Admin Note):' : 'Admin Note:'}
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder={
                    isVi
                      ? 'Nhập lý do duyệt hoặc ghi chú vi phạm...'
                      : 'Enter review reason or flag note...'
                  }
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-800/60 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setStatusChangeItem(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors"
              >
                {isVi ? 'Hủy' : 'Cancel'}
              </button>
              <button
                onClick={handleStatusChangeSubmit}
                disabled={isSubmittingStatus}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors flex items-center gap-1.5"
              >
                {isSubmittingStatus && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{isVi ? 'Lưu thay đổi' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-xs text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                {isVi ? 'Xác nhận xóa nội dung?' : 'Confirm Delete?'}
              </h3>
              <p className="text-slate-400 mt-1">
                {isVi
                  ? `Bạn có chắc chắn muốn xóa bài viết "${deleteItem.title}" (${deleteItem.id})? Hành động này không thể hoàn tác.`
                  : `Are you sure you want to delete "${deleteItem.title}"?`}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg cursor-pointer"
              >
                {isVi ? 'Hủy bỏ' : 'Cancel'}
              </button>
              <button
                onClick={handleDeleteSubmit}
                disabled={isSubmittingDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                {isSubmittingDelete && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{isVi ? 'Xác nhận xóa' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
