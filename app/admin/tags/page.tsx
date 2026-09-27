'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import { getAccessToken } from '../../../utils/authUtils';
import {
  Tag as TagIcon,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Check,
  X,
  Copy,
  Plus,
  Trash2,
  LayoutGrid,
  List,
  Sparkles,
  TrendingUp,
  Hash,
  Layers,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';

export interface AdminTagItem {
  id: string;
  name: string;
  used_count: number;
  [key: string]: any;
}

export interface ApiResponseMeta {
  total?: number;
  page?: number;
  limit?: number;
}

// Fallback demo tags to showcase the UI if backend is offline
const FALLBACK_TAGS: AdminTagItem[] = [
  { id: 'tag_001', name: 'MOBA', used_count: 45 },
  { id: 'tag_002', name: 'Limited Edition', used_count: 68 },
  { id: 'tag_003', name: 'K-POP 2026', used_count: 120 },
  { id: 'tag_004', name: 'World Tour VIP', used_count: 89 },
  { id: 'tag_005', name: 'Presale Ticket', used_count: 95 },
  { id: 'tag_006', name: 'Photocard', used_count: 52 },
  { id: 'tag_007', name: 'Anime Fan Hub', used_count: 34 },
  { id: 'tag_008', name: 'Cosplay Festival', used_count: 27 },
  { id: 'tag_009', name: 'Esports Finals', used_count: 73 },
  { id: 'tag_010', name: 'Lightstick Offical', used_count: 61 },
  { id: 'tag_011', name: 'Album Unboxing', used_count: 40 },
  { id: 'tag_012', name: 'Fan Meeting', used_count: 82 },
];

export default function AdminTagsPage() {
  const { language } = useAdminLanguage();
  const isVi = language === 'vi';

  // Responsive sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  // API State
  const [tags, setTags] = useState<AdminTagItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnectionError, setIsConnectionError] = useState(false);

  // Filters & Pagination query parameters per API doc (?search=moba&page=1&limit=50)
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [sortBy, setSortBy] = useState<'used_count' | 'name'>('used_count');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Quick Add Tag input (inline bar)
  const [quickTagName, setQuickTagName] = useState('');
  const [isQuickAdding, setIsQuickAdding] = useState(false);

  // Create Modal State: POST /api/v1/admin/tags
  // Body: { "name": "Limited Edition" }
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createTagName, setCreateTagName] = useState('');
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

  // Delete Modal State: DELETE /api/v1/admin/tags/{id}
  const [deleteItem, setDeleteItem] = useState<AdminTagItem | null>(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  // Toasts & Copy
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

  // 1. FETCH TAGS: GET /api/v1/admin/tags?search=moba&page=1&limit=50
  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    setIsConnectionError(false);

    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    params.set('page', String(page));
    params.set('limit', String(limit));

    const endpoint = `/api/v1/admin/tags?${params.toString()}`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const resJson = await response.json();

      // Expected format: { "data": [{ "id": "tag_xxx", "name": "MOBA", "used_count": 45 }] }
      if (resJson && Array.isArray(resJson.data)) {
        setTags(resJson.data);
      } else if (Array.isArray(resJson)) {
        setTags(resJson);
      } else {
        throw new Error('Invalid JSON format');
      }
    } catch (err) {
      console.warn('API /api/v1/admin/tags offline, loading fallback tags:', err);
      setIsConnectionError(true);

      let filtered = [...FALLBACK_TAGS];
      if (searchQuery.trim()) {
        filtered = filtered.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase().trim()));
      }
      setTags(filtered);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, page, limit]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // 2. CREATE TAG: POST /api/v1/admin/tags
  // Body: { "name": "Limited Edition" }
  // Response 201: { "id": "tag_xxx", "message": "Đã tạo thẻ thành công" }
  const handleCreateTag = async (name: string, isModal = false) => {
    const trimmed = name.trim();
    if (!trimmed) {
      setActionToast({
        type: 'error',
        message: isVi ? 'Vui lòng nhập tên thẻ' : 'Please provide a tag name',
      });
      return;
    }

    if (isModal) setIsSubmittingCreate(true);
    else setIsQuickAdding(true);

    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const payload = { name: trimmed };

    try {
      const res = await fetch('/api/v1/admin/tags', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(resData.message || `Lỗi API HTTP ${res.status}`);
      }

      const newId = resData.id || `tag_${Date.now().toString().slice(-4)}`;
      const successMsg = resData.message || (isVi ? 'Đã tạo thẻ thành công' : 'Tag created successfully');

      const newTagItem: AdminTagItem = {
        id: newId,
        name: trimmed,
        used_count: 0,
      };

      setTags((prev) => [newTagItem, ...prev]);

      setActionToast({
        type: 'success',
        message: successMsg,
        details: `ID: ${newId} · POST /api/v1/admin/tags (201)`,
      });

      if (isModal) {
        setCreateTagName('');
        setIsCreateModalOpen(false);
      } else {
        setQuickTagName('');
      }
    } catch (err: any) {
      // Local optimistic fallback
      const newId = `tag_${Date.now().toString().slice(-4)}`;
      const newTagItem: AdminTagItem = {
        id: newId,
        name: trimmed,
        used_count: 0,
      };

      setTags((prev) => [newTagItem, ...prev]);

      setActionToast({
        type: 'warning',
        message: isVi ? 'Đã tạo thẻ trên giao diện (Offline mode)' : 'Tag created locally [Offline]',
        details: `ID: ${newId}`,
      });

      if (isModal) {
        setCreateTagName('');
        setIsCreateModalOpen(false);
      } else {
        setQuickTagName('');
      }
    } finally {
      if (isModal) setIsSubmittingCreate(false);
      else setIsQuickAdding(false);
    }
  };

  // 3. DELETE TAG: DELETE /api/v1/admin/tags/{id}
  // Response 200: { "message": "Đã xóa thẻ" }
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
      const res = await fetch(`/api/v1/admin/tags/${encodeURIComponent(deleteItem.id)}`, {
        method: 'DELETE',
        headers,
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(resData.message || `Lỗi API HTTP ${res.status}`);
      }

      const successMsg = resData.message || (isVi ? 'Đã xóa thẻ' : 'Tag deleted successfully');

      setTags((prev) => prev.filter((t) => t.id !== deleteItem.id));

      setActionToast({
        type: 'success',
        message: successMsg,
        details: `DELETE /api/v1/admin/tags/${deleteItem.id} (200)`,
      });

      setDeleteItem(null);
    } catch (err: any) {
      // Offline fallback
      setTags((prev) => prev.filter((t) => t.id !== deleteItem.id));

      setActionToast({
        type: 'warning',
        message: isVi ? 'Đã xóa thẻ (Offline mode)' : 'Tag deleted locally [Offline]',
        details: `DELETE /api/v1/admin/tags/${deleteItem.id}`,
      });

      setDeleteItem(null);
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  // Copy helper
  const handleCopyId = (id: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Sorted and searched tags
  const displayedTags = useMemo(() => {
    const term = (searchQuery || headerSearch).toLowerCase().trim();
    let res = tags;

    if (term) {
      res = tags.filter(
        (t) => t.name.toLowerCase().includes(term) || t.id.toLowerCase().includes(term)
      );
    }

    return [...res].sort((a, b) => {
      if (sortBy === 'used_count') {
        return (b.used_count || 0) - (a.used_count || 0);
      }
      return a.name.localeCompare(b.name);
    });
  }, [tags, searchQuery, headerSearch, sortBy]);

  // Metrics
  const totalTags = tags.length;
  const totalUsed = tags.reduce((sum, t) => sum + (t.used_count || 0), 0);
  const maxUsed = tags.reduce((max, t) => Math.max(max, t.used_count || 0), 0);
  const mostPopularTag = tags.find((t) => t.used_count === maxUsed);
  const avgUsed = totalTags > 0 ? Math.round(totalUsed / totalTags) : 0;

  return (
    <div
      translate="no"
      className="notranslate min-h-screen bg-slate-900 text-slate-100 font-sans flex"
    >
      {/* Admin Sidebar */}
      <AdminSidebar
        activeTab="tags"
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
          activeTab="tags"
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
                <div className="p-2.5 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
                  <TagIcon className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    {isVi ? 'Quản Lý Thẻ (Tags)' : 'Tag Management'}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                      /api/v1/admin/tags
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isVi
                      ? 'Tạo thẻ định danh bài viết, quản lý tần suất sử dụng (used_count) và xóa thẻ không hợp lệ.'
                      : 'Create and organize content tags, track usage counts, and clean up obsolete labels.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              {/* + Create New Tag Button */}
              <button
                onClick={() => {
                  setCreateTagName('');
                  setIsCreateModalOpen(true);
                }}
                style={{ borderRadius: '8px' }}
                className="px-3.5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-violet-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isVi ? 'Tạo thẻ mới' : 'Add Tag'}</span>
              </button>

              {/* Refresh Button */}
              <button
                onClick={fetchTags}
                disabled={isLoading}
                style={{ borderRadius: '8px' }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
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
                <span>{isVi ? 'Tổng số thẻ' : 'Total Tags'}</span>
                <Layers className="w-4 h-4 text-violet-400" />
              </div>
              <div className="text-2xl font-black text-white">{totalTags}</div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">GET /tags?limit=50</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-violet-500/30 backdrop-blur-sm">
              <div className="flex items-center justify-between text-violet-400 text-xs font-semibold mb-2">
                <span>{isVi ? 'Tổng lượt gắn thẻ' : 'Total Usages'}</span>
                <BarChart2 className="w-4 h-4 text-violet-400" />
              </div>
              <div className="text-2xl font-black text-violet-300">{totalUsed}</div>
              <div className="text-[11px] text-violet-400/80 mt-1">used_count</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-emerald-500/30 backdrop-blur-sm">
              <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold mb-2">
                <span>{isVi ? 'Thẻ dùng nhiều nhất' : 'Top Tag'}</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-lg font-black text-emerald-300 truncate">
                #{mostPopularTag?.name || 'N/A'}
              </div>
              <div className="text-[11px] text-emerald-400/80 mt-1">{maxUsed} lượt sử dụng</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-indigo-500/30 backdrop-blur-sm">
              <div className="flex items-center justify-between text-indigo-400 text-xs font-semibold mb-2">
                <span>{isVi ? 'Lượt dùng trung bình' : 'Avg per Tag'}</span>
                <Hash className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-indigo-300">{avgUsed}</div>
              <div className="text-[11px] text-indigo-400/80 mt-1">lượt / thẻ</div>
            </div>
          </div>

          {/* Quick Add Tag Bar */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-violet-950/40 via-slate-800/60 to-indigo-950/40 border border-violet-700/30">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateTag(quickTagName, false);
              }}
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-violet-300 shrink-0">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>{isVi ? 'Thêm nhanh thẻ mới:' : 'Quick Add Tag:'}</span>
              </div>

              <div className="relative flex-1 w-full">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={quickTagName}
                  onChange={(e) => setQuickTagName(e.target.value)}
                  placeholder={
                    isVi
                      ? 'Nhập tên thẻ mới (ví dụ: Limited Edition, K-POP, MOBA...)'
                      : 'Enter tag name (e.g., Limited Edition, MOBA)...'
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isQuickAdding || !quickTagName.trim()}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm shadow-violet-600/30"
              >
                {isQuickAdding && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <Plus className="w-4 h-4" />
                <span>{isVi ? 'Thêm thẻ (POST)' : 'Add Tag'}</span>
              </button>
            </form>
          </div>

          {/* Search, Sort & View Mode Toolbar */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isVi
                      ? 'Tìm kiếm theo tên thẻ hoặc mã ID (tag_xxx)...'
                      : 'Search by tag name or ID (tag_xxx)...'
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

              <div className="flex items-center gap-3">
                {/* Sort Option */}
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isVi ? 'Sắp xếp:' : 'Sort:'}</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="used_count">{isVi ? 'Lượt dùng nhiều nhất' : 'Most Used'}</option>
                    <option value="name">{isVi ? 'Theo tên (A-Z)' : 'Name (A-Z)'}</option>
                  </select>
                </div>

                {/* View Switch */}
                <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-700/80 shrink-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer flex items-center gap-1.5 ${
                      viewMode === 'grid' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Dạng thẻ Chip"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Đám mây thẻ' : 'Chips'}</span>
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer flex items-center gap-1.5 ${
                      viewMode === 'table' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Dạng bảng chi tiết"
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Bảng chi tiết' : 'Table'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content View */}
          {isLoading ? (
            <div className="p-12 text-center bg-slate-800/40 rounded-xl border border-slate-700/60">
              <RefreshCw className="w-8 h-8 text-violet-400 animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300">
                {isVi ? 'Đang tải danh sách thẻ từ /api/v1/admin/tags...' : 'Fetching tags...'}
              </p>
            </div>
          ) : displayedTags.length === 0 ? (
            <div className="p-12 text-center bg-slate-800/40 rounded-xl border border-slate-700/60">
              <TagIcon className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">
                {isVi ? 'Không tìm thấy thẻ nào' : 'No tags found'}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                {isVi ? 'Chưa có thẻ nào phù hợp với từ khóa tìm kiếm.' : 'No tags matching your query.'}
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                {isVi ? 'Xóa tìm kiếm' : 'Clear Search'}
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* 1. TAG CHIP CLOUD GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {displayedTags.map((tag) => (
                <div
                  key={tag.id}
                  className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 hover:border-violet-500/50 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-violet-500/15 text-violet-300 border border-violet-500/25">
                        <Hash className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm group-hover:text-violet-300 transition-colors">
                          {tag.name}
                        </div>
                        <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500 mt-0.5">
                          <span>{tag.id}</span>
                          <button
                            onClick={() => handleCopyId(tag.id)}
                            className="hover:text-slate-300 p-0.5"
                            title="Sao chép ID"
                          >
                            {copiedId === tag.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setDeleteItem(tag)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title={isVi ? 'Xóa thẻ (DELETE /{id})' : 'Delete Tag'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Popularity bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>{isVi ? 'Tần suất sử dụng:' : 'Usage:'}</span>
                      <span className="font-bold text-violet-300 font-mono">{tag.used_count || 0} bài</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-700/70 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                        style={{
                          width: `${maxUsed > 0 ? Math.min(100, ((tag.used_count || 0) / maxUsed) * 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 2. TABLE VIEW */
            <div className="overflow-x-auto rounded-xl border border-slate-700/70 bg-slate-800/40 backdrop-blur-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/80 bg-slate-900/60 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Mã Thẻ (ID)</th>
                    <th className="py-3 px-4">{isVi ? 'Tên thẻ (Tag Name)' : 'Tag Name'}</th>
                    <th className="py-3 px-4">{isVi ? 'Số lần sử dụng (used_count)' : 'Used Count'}</th>
                    <th className="py-3 px-4">{isVi ? 'Độ phổ biến' : 'Popularity'}</th>
                    <th className="py-3 px-4 text-right">{isVi ? 'Thao tác' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {displayedTags.map((tag) => (
                    <tr key={tag.id} className="hover:bg-slate-700/30 transition-colors group">
                      {/* ID with Copy */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-indigo-400 font-bold">
                          <span>{tag.id}</span>
                          <button
                            onClick={() => handleCopyId(tag.id)}
                            className="text-slate-500 hover:text-indigo-300 p-1 rounded transition-colors cursor-pointer"
                            title="Sao chép ID"
                          >
                            {copiedId === tag.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/30 font-bold">
                          <Hash className="w-3.5 h-3.5 text-violet-400" />
                          <span>{tag.name}</span>
                        </span>
                      </td>

                      {/* Used Count */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-white font-bold">
                        {tag.used_count || 0} bài viết
                      </td>

                      {/* Popularity bar */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="w-36 h-2 rounded-full bg-slate-700/70 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                            style={{
                              width: `${maxUsed > 0 ? Math.min(100, ((tag.used_count || 0) / maxUsed) * 100) : 0}%`,
                            }}
                          />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setDeleteItem(tag)}
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                            title="Xóa thẻ (DELETE /{id})"
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
          )}
        </main>
      </div>

      {/* CREATE MODAL: POST /api/v1/admin/tags */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
              <div className="flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-violet-400" />
                <h3 className="font-bold text-white text-base">
                  {isVi ? 'Tạo Thẻ Mới (POST /tags)' : 'Create Tag'}
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateTag(createTagName, true);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  {isVi ? 'Tên thẻ định danh (name) *' : 'Tag Name *'}
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={createTagName}
                    onChange={(e) => setCreateTagName(e.target.value)}
                    placeholder="Ví dụ: Limited Edition, MOBA, Presale..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 placeholder-slate-500"
                  />
                </div>
              </div>

              {createTagName && (
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 flex items-center gap-2">
                  <span className="text-slate-400">Xem trước:</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-bold border border-violet-500/30">
                    #{createTagName.trim()}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors"
                >
                  {isVi ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCreate}
                  className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center gap-1.5 shadow-md shadow-violet-600/20"
                >
                  {isSubmittingCreate && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isVi ? 'Tạo thẻ mới' : 'Submit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL: DELETE /api/v1/admin/tags/{id} */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-xs text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                {isVi ? 'Xác nhận xóa thẻ?' : 'Delete Tag?'}
              </h3>
              <p className="text-slate-400 mt-1">
                {isVi
                  ? `Bạn có chắc chắn muốn xóa thẻ "#${deleteItem.name}" (${deleteItem.id}) với ${deleteItem.used_count || 0} bài viết đang gắn thẻ này?`
                  : `Are you sure you want to delete tag #${deleteItem.name}?`}
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
