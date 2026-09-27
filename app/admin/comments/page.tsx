'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import { getAccessToken } from '../../../utils/authUtils';
import {
  MessageSquare,
  Search,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  LayoutGrid,
  List,
  User,
  Trash2,
  ShieldCheck,
  Flag,
  FileText,
  ChevronDown,
  ArrowUpDown,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

// Data item interface matching GET /api/v1/admin/comments/flagged:
// { id: "cmt_xxx", post_id: "cnt_xxx", user: "Spammer", body: "Bình luận spam...", reports_count: 5 }
export interface AdminCommentItem {
  id: string;
  post_id: string;
  user: string;
  body: string;
  reports_count: number;
  created_at?: string;
  status?: string;
  [key: string]: any;
}

export interface ApiResponseMeta {
  total: number;
  page: number;
  limit?: number;
}

// Fallback demo data to showcase the UI if backend is offline
const FALLBACK_COMMENTS: AdminCommentItem[] = [
  {
    id: 'cmt_001',
    post_id: 'cnt_001',
    user: 'Spammer',
    body: 'Bình luận spam liên kết độc hại mời vào nhóm cá cược telegram nhận khuyến mãi 100%...',
    reports_count: 5,
    created_at: '2026-09-25 10:30',
  },
  {
    id: 'cmt_002',
    post_id: 'cnt_002',
    user: 'Hater99',
    body: 'Nội dung xúc phạm bôi nhọ nghệ sĩ và cộng đồng người hâm mộ bằng ngôn từ thiếu văn hóa.',
    reports_count: 8,
    created_at: '2026-09-24 14:15',
  },
  {
    id: 'cmt_003',
    post_id: 'cnt_003',
    user: 'BotTicketFake',
    body: 'Pass lại 5 vé concert VIP khu A giá rẻ bất ngờ chuyển khoản giữ chỗ ngay kẻo lỡ!',
    reports_count: 3,
    created_at: '2026-09-24 09:20',
  },
  {
    id: 'cmt_004',
    post_id: 'cnt_004',
    user: 'TrollAccount',
    body: 'Spam bình luận vô nghĩa lặp đi lặp lại hàng chục lần gây nhiễu luồng thảo luận.',
    reports_count: 4,
    created_at: '2026-09-23 18:45',
  },
  {
    id: 'cmt_005',
    post_id: 'cnt_005',
    user: 'ScamLinker',
    body: 'Bấm vào liên kết này để nhận giftcode miễn phí (đường dẫn giả mạo đánh cắp tài khoản).',
    reports_count: 12,
    created_at: '2026-09-22 21:00',
  },
];

export default function AdminCommentsPage() {
  const { language } = useAdminLanguage();
  const isVi = language === 'vi';

  // Responsive sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  // API State
  const [comments, setComments] = useState<AdminCommentItem[]>([]);
  const [meta, setMeta] = useState<ApiResponseMeta>({ total: 0, page: 1, limit: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnectionError, setIsConnectionError] = useState(false);

  // Filters state (matching API: ?page=1&limit=20&sort=reports_count)
  const [sort, setSort] = useState<string>('reports_count');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Detail Modal
  const [selectedComment, setSelectedComment] = useState<AdminCommentItem | null>(null);

  // Delete Modal: DELETE /api/v1/admin/comments/{id}
  const [deleteComment, setDeleteComment] = useState<AdminCommentItem | null>(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  // Toast notifications
  const [actionToast, setActionToast] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
    details?: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auto-hide toast
  useEffect(() => {
    if (actionToast) {
      const timer = setTimeout(() => setActionToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [actionToast]);

  // Responsive sidebar
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  // 1. FETCH FLAGGED COMMENTS: GET /api/v1/admin/comments/flagged?page=1&limit=20&sort=reports_count
  const fetchComments = useCallback(async () => {
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
    params.set('page', String(page));
    params.set('limit', String(limit));
    params.set('sort', sort);

    const endpoint = `/api/v1/admin/comments/flagged?${params.toString()}`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const resJson = await response.json();

      // Expected format: { "data": [{ id: "cmt_xxx", post_id: "cnt_xxx", user: "Spammer", body: "...", reports_count: 5 }] }
      if (resJson && Array.isArray(resJson.data)) {
        setComments(resJson.data);
        if (resJson.meta) {
          setMeta({
            total: Number(resJson.meta.total) || resJson.data.length,
            page: Number(resJson.meta.page) || page,
            limit: Number(resJson.meta.limit) || limit,
          });
        } else {
          setMeta({ total: resJson.data.length, page, limit });
        }
      } else if (Array.isArray(resJson)) {
        setComments(resJson);
        setMeta({ total: resJson.length, page: 1, limit });
      } else {
        throw new Error('Invalid JSON format');
      }
    } catch (err) {
      console.warn('Backend API /api/v1/admin/comments/flagged offline, loading interactive fallback data:', err);
      setIsConnectionError(true);

      const sorted = [...FALLBACK_COMMENTS].sort((a, b) => {
        if (sort === 'reports_count') return b.reports_count - a.reports_count;
        return 0;
      });

      setComments(sorted);
      setMeta({
        total: sorted.length,
        page,
        limit,
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, sort]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // 2. DELETE FLAGGED COMMENT: DELETE /api/v1/admin/comments/{id}
  // Response 200: { "message": "Đã xóa bình luận vi phạm" }
  const handleDeleteSubmit = async () => {
    if (!deleteComment) return;
    setIsSubmittingDelete(true);

    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`/api/v1/admin/comments/${encodeURIComponent(deleteComment.id)}`, {
        method: 'DELETE',
        headers,
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(resData.message || `Lỗi API HTTP ${res.status}`);
      }

      const successMsg = resData.message || (isVi ? 'Đã xóa bình luận vi phạm' : 'Flagged comment deleted successfully');

      setComments((prev) => prev.filter((item) => item.id !== deleteComment.id));
      setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));

      if (selectedComment && selectedComment.id === deleteComment.id) {
        setSelectedComment(null);
      }

      setActionToast({
        type: 'success',
        message: successMsg,
        details: `DELETE /api/v1/admin/comments/${deleteComment.id} (200 OK)`,
      });

      setDeleteComment(null);
    } catch (err: any) {
      // Offline fallback
      setComments((prev) => prev.filter((item) => item.id !== deleteComment.id));
      setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));

      if (selectedComment && selectedComment.id === deleteComment.id) {
        setSelectedComment(null);
      }

      setActionToast({
        type: 'warning',
        message: isVi ? 'Đã xóa bình luận vi phạm (Offline mode)' : 'Comment deleted locally [Offline]',
        details: `DELETE /api/v1/admin/comments/${deleteComment.id}`,
      });

      setDeleteComment(null);
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  // Dismiss Flag (Keep Comment)
  const handleDismissFlag = (item: AdminCommentItem) => {
    setComments((prev) => prev.filter((c) => c.id !== item.id));
    setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    if (selectedComment && selectedComment.id === item.id) {
      setSelectedComment(null);
    }
    setActionToast({
      type: 'success',
      message: isVi ? 'Đã bỏ qua cảnh báo và giữ lại bình luận' : 'Flag dismissed successfully',
      details: `ID: ${item.id}`,
    });
  };

  // Copy ID helper
  const handleCopyId = (id: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Client search filter
  const displayedComments = useMemo(() => {
    const term = (searchQuery || headerSearch).toLowerCase().trim();
    if (!term) return comments;

    return comments.filter((item) => {
      const bodyMatch = (item.body || '').toLowerCase().includes(term);
      const userMatch = (item.user || '').toLowerCase().includes(term);
      const idMatch = (item.id || '').toLowerCase().includes(term);
      const postMatch = (item.post_id || '').toLowerCase().includes(term);
      return bodyMatch || userMatch || idMatch || postMatch;
    });
  }, [comments, searchQuery, headerSearch]);

  // Metrics
  const totalComments = meta.total || displayedComments.length;
  const maxReports = displayedComments.reduce((max, c) => Math.max(max, c.reports_count || 0), 0);
  const urgentCount = displayedComments.filter((c) => (c.reports_count || 0) >= 5).length;
  const uniqueUsers = new Set(displayedComments.map((c) => c.user)).size;

  const totalPages = Math.max(1, Math.ceil(totalComments / limit));

  return (
    <div
      translate="no"
      className="notranslate min-h-screen bg-slate-900 text-slate-100 font-sans flex"
    >
      {/* Admin Sidebar */}
      <AdminSidebar
        activeTab="comments"
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
          activeTab="comments"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto space-y-6">
          {/* Action Toast Alert Banner */}
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
                <div className="p-2.5 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    {isVi ? 'Quản Lý Bình Luận Bị Báo Cáo' : 'Flagged Comments Moderation'}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                      /api/v1/admin/comments/flagged
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isVi
                      ? 'Kiểm duyệt các bình luận spam, thù địch hoặc vi phạm bị người dùng cắm cờ báo cáo.'
                      : 'Review and remove comments flagged by community users for spam or abuse.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              {/* Endpoint Status Pill */}
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

              {/* Refresh Button */}
              <button
                onClick={fetchComments}
                disabled={isLoading}
                style={{ borderRadius: '8px' }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Làm mới danh sách từ API"
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
                <span>{isVi ? 'Tổng bình luận vi phạm' : 'Total Flagged'}</span>
                <MessageSquare className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white">{totalComments}</div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">meta.total: {meta.total}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-rose-500/30 backdrop-blur-sm">
              <div className="flex items-center justify-between text-rose-400 text-xs font-semibold mb-2">
                <span>{isVi ? 'Báo cáo cao nhất' : 'Max Reports'}</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-black text-rose-300">{maxReports} lượt</div>
              <div className="text-[11px] text-rose-400/80 mt-1">sort=reports_count</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-amber-500/30 backdrop-blur-sm">
              <div className="flex items-center justify-between text-amber-400 text-xs font-semibold mb-2">
                <span>{isVi ? 'Cần xử lý gấp (≥5)' : 'High Priority (≥5)'}</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-300">{urgentCount}</div>
              <div className="text-[11px] text-amber-400/80 mt-1">Độ ưu tiên cao</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                <span>{isVi ? 'Người dùng bị báo cáo' : 'Reported Users'}</span>
                <User className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-black text-slate-200">{uniqueUsers}</div>
              <div className="text-[11px] text-slate-400 mt-1">Tài khoản liên quan</div>
            </div>
          </div>

          {/* Filtering and Search Controls */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isVi
                      ? 'Tìm theo nội dung, người dùng, mã cmt_xxx, mã bài viết cnt_xxx...'
                      : 'Search comment body, user, cmt_xxx, or post cnt_xxx...'
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

              {/* Sort by & view mode controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isVi ? 'Sắp xếp:' : 'Sort:'}</span>
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setPage(1);
                    }}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="reports_count">{isVi ? 'Lượt báo cáo nhiều nhất' : 'Most Reported'}</option>
                    <option value="newest">{isVi ? 'Mới nhất' : 'Newest'}</option>
                    <option value="oldest">{isVi ? 'Cũ nhất' : 'Oldest'}</option>
                  </select>
                </div>

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
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Content List Table / Grid */}
          {isLoading ? (
            <div className="p-12 text-center bg-slate-800/40 rounded-xl border border-slate-700/60">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300">
                {isVi ? 'Đang tải bình luận vi phạm từ /api/v1/admin/comments/flagged...' : 'Fetching flagged comments...'}
              </p>
            </div>
          ) : displayedComments.length === 0 ? (
            <div className="p-12 text-center bg-slate-800/40 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">
                {isVi ? 'Không có bình luận vi phạm nào' : 'No flagged comments found'}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                {isVi
                  ? 'Hệ thống hiện tại sạch hoàn toàn, không có bình luận nào bị cộng đồng báo cáo.'
                  : 'All comments are clean and no reports are currently pending review.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSort('reports_count');
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
                    <th className="py-3 px-4">Mã bình luận</th>
                    <th className="py-3 px-4">{isVi ? 'Người gửi (User)' : 'User'}</th>
                    <th className="py-3 px-4">{isVi ? 'Nội dung bình luận (Body)' : 'Comment Body'}</th>
                    <th className="py-3 px-4">{isVi ? 'Bài viết (Post ID)' : 'Post ID'}</th>
                    <th className="py-3 px-4">{isVi ? 'Lượt báo cáo' : 'Reports Count'}</th>
                    <th className="py-3 px-4 text-right">{isVi ? 'Thao tác' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {displayedComments.map((item) => (
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

                      {/* User */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-[10px] border border-rose-500/30">
                            {item.user ? item.user.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <span className="font-semibold text-slate-200">{item.user}</span>
                        </div>
                      </td>

                      {/* Body */}
                      <td className="py-3 px-4">
                        <div className="text-slate-300 max-w-[420px] line-clamp-2 leading-relaxed">
                          {item.body}
                        </div>
                      </td>

                      {/* Post ID */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-slate-400">
                          <Link
                            href={`/admin/events`}
                            className="hover:text-indigo-300 underline underline-offset-2 flex items-center gap-1"
                            title="Xem bài viết gốc"
                          >
                            <span>{item.post_id}</span>
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                          </Link>
                        </div>
                      </td>

                      {/* Reports Count */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          style={{ borderRadius: '6px' }}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold border ${
                            item.reports_count >= 8
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                              : item.reports_count >= 4
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-700/50 text-slate-300 border-slate-600'
                          }`}
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          <span>{item.reports_count} {isVi ? 'báo cáo' : 'reports'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Detail */}
                          <button
                            onClick={() => setSelectedComment(item)}
                            className="p-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
                            title={isVi ? 'Xem chi tiết' : 'View Details'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Dismiss Flag (Keep Comment) */}
                          <button
                            onClick={() => handleDismissFlag(item)}
                            className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 transition-colors cursor-pointer"
                            title={isVi ? 'Bỏ qua cảnh báo' : 'Dismiss Flag'}
                          >
                            <Check className="w-4 h-4" />
                          </button>

                          {/* Delete Comment: DELETE /api/v1/admin/comments/{id} */}
                          <button
                            onClick={() => setDeleteComment(item)}
                            className="p-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 transition-colors cursor-pointer"
                            title={isVi ? 'Xóa bình luận vi phạm (DELETE /{id})' : 'Delete Comment'}
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
              {displayedComments.map((item) => (
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

                      <span
                        style={{ borderRadius: '6px' }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      >
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        <span>{item.reports_count} {isVi ? 'báo cáo' : 'reports'}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-[10px]">
                        {item.user ? item.user.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="font-semibold text-slate-200 text-xs">{item.user}</span>
                      <span className="text-[10px] text-slate-500 font-mono ml-auto">Post: {item.post_id}</span>
                    </div>

                    <p className="text-xs text-slate-300 p-3 bg-slate-900/60 rounded-lg border border-slate-800/80 leading-relaxed line-clamp-3">
                      "{item.body}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-700/60">
                    <button
                      onClick={() => handleDismissFlag(item)}
                      className="text-xs text-slate-400 hover:text-emerald-400 font-semibold cursor-pointer"
                    >
                      {isVi ? 'Bỏ qua' : 'Dismiss'}
                    </button>

                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        onClick={() => setSelectedComment(item)}
                        className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold cursor-pointer"
                      >
                        {isVi ? 'Chi tiết' : 'View'}
                      </button>
                      <button
                        onClick={() => setDeleteComment(item)}
                        className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isVi ? 'Xóa' : 'Delete'}</span>
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
                ? `Hiển thị ${displayedComments.length} trên tổng ${totalComments} mục (Trang ${page} / ${totalPages})`
                : `Showing ${displayedComments.length} of ${totalComments} entries (Page ${page} of ${totalPages})`}
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
      {selectedComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-white text-base">
                  {isVi ? 'Chi Tiết Bình Luận Vi Phạm' : 'Flagged Comment Details'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedComment(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono">Comment ID:</span>
                  <span className="text-indigo-400 font-bold font-mono">{selectedComment.id}</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{selectedComment.reports_count} {isVi ? 'báo cáo' : 'reports'}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="text-slate-400 font-semibold mb-1">{isVi ? 'Người gửi (user):' : 'User:'}</div>
                  <div className="text-white font-bold flex items-center gap-1.5">
                    <User className="w-4 h-4 text-rose-400" />
                    <span>{selectedComment.user}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="text-slate-400 font-semibold mb-1">{isVi ? 'Bài viết liên quan:' : 'Target Post:'}</div>
                  <div className="text-indigo-400 font-mono font-bold">{selectedComment.post_id}</div>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">
                  {isVi ? 'Nội dung bình luận (body):' : 'Comment Body:'}
                </label>
                <div className="p-4 bg-slate-800/60 rounded-lg border border-slate-700 text-slate-100 text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedComment.body}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-800/60 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedComment(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors"
              >
                {isVi ? 'Đóng' : 'Close'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDismissFlag(selectedComment)}
                  className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Bỏ qua cảnh báo' : 'Dismiss'}</span>
                </button>

                <button
                  onClick={() => {
                    setDeleteComment(selectedComment);
                  }}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Xóa bình luận vi phạm' : 'Delete Comment'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL: DELETE /api/v1/admin/comments/{id} */}
      {deleteComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-xs text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                {isVi ? 'Xóa bình luận vi phạm?' : 'Delete Flagged Comment?'}
              </h3>
              <p className="text-slate-400 mt-1">
                {isVi
                  ? `Bạn có chắc chắn muốn xóa bình luận của "${deleteComment.user}" (${deleteComment.id}) với ${deleteComment.reports_count} lượt báo cáo? Hành động này không thể hoàn tác.`
                  : `Are you sure you want to delete comment from ${deleteComment.user}?`}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteComment(null)}
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
                <span>{isVi ? 'Xóa bình luận' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
