'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import {
  Calendar,
  Ticket,
  Search,
  RefreshCw,
  WifiOff,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Eye,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  AlertTriangle,
  Sparkles,
  LayoutGrid,
  List,
  Filter,
  DollarSign,
  Building,
  Radio,
  FileCheck,
  Send,
  Info,
  Trash2,
  XCircle,
  ShieldAlert,
} from 'lucide-react';

// API Response Item compatible with API doc: { id: "xxx", title: "Sự kiện chờ duyệt" }
export interface AdminEventItem {
  id: string | number;
  title: string;
  artist?: string;
  venue?: string;
  location?: string;
  eventDate?: string;
  date?: string;
  time?: string;
  status: 'pending' | 'active' | 'approved' | 'rejected' | string;
  ticketPrice?: string | number;
  price?: string | number;
  totalTickets?: number;
  availableTickets?: number;
  organizer?: string;
  description?: string;
  banner?: string;
  image?: string;
  createdAt?: string;
  created_at?: string;
  category?: string;
  [key: string]: any;
}

export interface ApiResponseMeta {
  total: number;
  page: number;
  limit: number;
}

export default function AdminEventsPage() {
  const { language } = useAdminLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  const isVi = language === 'vi';

  // API State
  const [events, setEvents] = useState<AdminEventItem[]>([]);
  const [meta, setMeta] = useState<ApiResponseMeta>({ total: 0, page: 1, limit: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnectionError, setIsConnectionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tab & Filters: 'pending' (calls /pending API), 'active', 'all'
  const [activeStatusTab, setActiveStatusTab] = useState<'pending' | 'active' | 'all'>('pending');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Modal States
  const [selectedEvent, setSelectedEvent] = useState<AdminEventItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [eventToApprove, setEventToApprove] = useState<AdminEventItem | null>(null);

  // Approve Form State per API doc:
  // POST /api/v1/admin/events/{id}/approve
  // Body: { "title": "Dữ liệu mẫu", "description": "Chi tiết Duyệt sự kiện mở bán", "status": "active" }
  const [approveForm, setApproveForm] = useState({
    title: '',
    description: 'Chi tiết Duyệt sự kiện mở bán',
    status: 'active',
  });
  const [isSubmittingApprove, setIsSubmittingApprove] = useState(false);

  // Review Status Modal State: PUT /api/v1/admin/events/{id}
  // Body: { "status": "Approved|Rejected", "admin_note": "Nội dung vi phạm tiêu chuẩn" }
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewEvent, setReviewEvent] = useState<AdminEventItem | null>(null);
  const [reviewForm, setReviewForm] = useState<{
    status: 'Approved' | 'Rejected';
    admin_note: string;
  }>({
    status: 'Approved',
    admin_note: '',
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Delete Modal State: DELETE /api/v1/admin/events/{id}
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<AdminEventItem | null>(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  const [actionToast, setActionToast] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
    details?: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  // Responsive sidebar
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  // Fetch pending events from API: GET /api/v1/admin/events/pending?page=1&limit=20&sort=newest
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setIsConnectionError(false);
    setErrorMessage(null);

    // Get Admin JWT token from storage or cookie
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('access_token') || localStorage.getItem('token') || '';
      if (!token) {
        const match = document.cookie.match(/access_token=([^;]+)/);
        if (match) token = match[1];
      }
    }

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
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }

    // Call GET /api/v1/admin/events/pending
    const endpoint = `/api/v1/admin/events/pending?${params.toString()}`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const resData = await response.json();

      // Handle response structure { data: [...], meta: { total, page, limit } }
      if (resData && Array.isArray(resData.data)) {
        setEvents(resData.data);
        if (resData.meta) {
          setMeta({
            total: Number(resData.meta.total) || resData.data.length,
            page: Number(resData.meta.page) || page,
            limit: Number(resData.meta.limit) || limit,
          });
        } else {
          setMeta({
            total: resData.data.length,
            page,
            limit,
          });
        }
      } else if (Array.isArray(resData)) {
        setEvents(resData);
        setMeta({ total: resData.length, page: 1, limit });
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err: any) {
      setIsConnectionError(true);
      setErrorMessage(isVi ? 'Lỗi kết nối' : 'Connection Error');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, sort, searchQuery, isVi]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Open Approve Modal with prefilled values
  const handleOpenApproveModal = (event: AdminEventItem) => {
    setEventToApprove(event);
    setApproveForm({
      title: event.title || 'Dữ liệu mẫu',
      description: isVi ? 'Chi tiết Duyệt sự kiện mở bán' : 'Approve event for ticket presale',
      status: 'active',
    });
    setIsApproveModalOpen(true);
  };

  // Submit Approval: POST /api/v1/admin/events/{id}/approve
  const handleConfirmApprove = async () => {
    if (!eventToApprove) return;

    setIsSubmittingApprove(true);
    setActionToast(null);

    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('access_token') || localStorage.getItem('token') || '';
      if (!token) {
        const match = document.cookie.match(/access_token=([^;]+)/);
        if (match) token = match[1];
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const payload = {
      title: approveForm.title.trim() || eventToApprove.title || 'Dữ liệu mẫu',
      description: approveForm.description.trim() || 'Chi tiết Duyệt sự kiện mở bán',
      status: approveForm.status || 'active',
    };

    const targetUrl = `/api/v1/admin/events/${encodeURIComponent(eventToApprove.id)}/approve`;

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const resJson = await response.json().catch(() => ({}));
      const successMessage = resJson.message || (isVi ? 'Duyệt sự kiện mở bán thành công' : 'Event approved successfully');

      // Update local state
      setEvents((prev) =>
        prev.map((evt) => (evt.id === eventToApprove.id ? { ...evt, status: 'active' } : evt))
      );

      setActionToast({
        type: 'success',
        message: successMessage,
        details: `ID: ${resJson.id || eventToApprove.id} · POST /api/v1/admin/events/{id}/approve`,
      });

      setIsApproveModalOpen(false);
      setEventToApprove(null);
      if (isDetailModalOpen && selectedEvent?.id === eventToApprove.id) {
        setSelectedEvent((prev) => (prev ? { ...prev, status: 'active' } : null));
      }
    } catch (err: any) {
      setActionToast({
        type: 'error',
        message: isVi ? 'Lỗi kết nối: Không thể gửi yêu cầu duyệt tới máy chủ backend.' : 'Connection Error: Failed to approve event on backend.',
      });
    } finally {
      setIsSubmittingApprove(false);
      setTimeout(() => {
        setActionToast(null);
      }, 5000);
    }
  };

  // Open Review Status Modal: PUT /api/v1/admin/events/{id}
  const handleOpenReviewModal = (event: AdminEventItem, defaultStatus: 'Approved' | 'Rejected' = 'Approved') => {
    setReviewEvent(event);
    setReviewForm({
      status: defaultStatus,
      admin_note: defaultStatus === 'Rejected' ? (isVi ? 'Nội dung vi phạm tiêu chuẩn' : 'Content violates standards') : '',
    });
    setIsReviewModalOpen(true);
  };

  // Submit Review Status: PUT /api/v1/admin/events/{id}
  // Body: { "status": "Approved|Rejected", "admin_note": "Nội dung vi phạm tiêu chuẩn" }
  // 200: { "message": "Đã duyệt/Từ chối sự kiện" }
  const handleConfirmReview = async () => {
    if (!reviewEvent) return;

    setIsSubmittingReview(true);
    setActionToast(null);

    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('access_token') || localStorage.getItem('token') || '';
      if (!token) {
        const match = document.cookie.match(/access_token=([^;]+)/);
        if (match) token = match[1];
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const payload = {
      status: reviewForm.status,
      admin_note: reviewForm.admin_note.trim(),
    };

    const targetUrl = `/api/v1/admin/events/${encodeURIComponent(reviewEvent.id)}`;

    try {
      const response = await fetch(targetUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const resJson = await response.json().catch(() => ({}));
      const successMessage = resJson.message || (isVi ? 'Đã duyệt/Từ chối sự kiện' : 'Event status updated successfully');
      const nextStatus = reviewForm.status.toLowerCase();

      // Update local state
      setEvents((prev) =>
        prev.map((evt) => (evt.id === reviewEvent.id ? { ...evt, status: nextStatus, admin_note: reviewForm.admin_note } : evt))
      );

      setActionToast({
        type: 'success',
        message: successMessage,
        details: `ID: ${reviewEvent.id} · PUT /api/v1/admin/events/{id} [${reviewForm.status}]`,
      });

      setIsReviewModalOpen(false);
      setReviewEvent(null);
      if (isDetailModalOpen && selectedEvent?.id === reviewEvent.id) {
        setSelectedEvent((prev) => (prev ? { ...prev, status: nextStatus, admin_note: reviewForm.admin_note } : null));
      }
    } catch (err: any) {
      setActionToast({
        type: 'error',
        message: isVi ? 'Lỗi kết nối: Không thể cập nhật trạng thái sự kiện.' : 'Connection Error: Failed to update event status on backend.',
      });
    } finally {
      setIsSubmittingReview(false);
      setTimeout(() => {
        setActionToast(null);
      }, 5000);
    }
  };

  // Open Delete Modal: DELETE /api/v1/admin/events/{id}
  const handleOpenDeleteModal = (event: AdminEventItem) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  // Submit Delete: DELETE /api/v1/admin/events/{id}
  // 200: { "message": "Đã gỡ sự kiện khỏi hệ thống" }
  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;

    setIsSubmittingDelete(true);
    setActionToast(null);

    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('access_token') || localStorage.getItem('token') || '';
      if (!token) {
        const match = document.cookie.match(/access_token=([^;]+)/);
        if (match) token = match[1];
      }
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const targetUrl = `/api/v1/admin/events/${encodeURIComponent(eventToDelete.id)}`;

    try {
      const response = await fetch(targetUrl, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const resJson = await response.json().catch(() => ({}));
      const successMessage = resJson.message || (isVi ? 'Đã gỡ sự kiện khỏi hệ thống' : 'Event deleted successfully');

      // Remove from local events
      setEvents((prev) => prev.filter((evt) => evt.id !== eventToDelete.id));
      setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));

      setActionToast({
        type: 'success',
        message: successMessage,
        details: `ID: ${eventToDelete.id} · DELETE /api/v1/admin/events/{id}`,
      });

      setIsDeleteModalOpen(false);
      setEventToDelete(null);
      if (isDetailModalOpen && selectedEvent?.id === eventToDelete.id) {
        setIsDetailModalOpen(false);
        setSelectedEvent(null);
      }
    } catch (err: any) {
      setActionToast({
        type: 'error',
        message: isVi ? 'Lỗi kết nối: Không thể gỡ sự kiện khỏi hệ thống.' : 'Connection Error: Failed to delete event on backend.',
      });
    } finally {
      setIsSubmittingDelete(false);
      setTimeout(() => {
        setActionToast(null);
      }, 5000);
    }
  };

  // Copy ID helper
  const handleCopyId = (id: string | number) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(String(id));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Filtered events directly from API
  const sourceEvents = events;

  const filteredEvents = sourceEvents.filter((evt) => {
    const term = (searchQuery || headerSearch).toLowerCase().trim();
    const titleMatch = (evt.title || '').toLowerCase().includes(term);
    const artistMatch = (evt.artist || '').toLowerCase().includes(term);
    const venueMatch = (evt.venue || evt.location || '').toLowerCase().includes(term);
    const idMatch = String(evt.id || '').toLowerCase().includes(term);

    const matchSearch = !term || titleMatch || artistMatch || venueMatch || idMatch;

    if (activeStatusTab === 'pending') {
      return matchSearch && ((evt.status || 'pending').toLowerCase() === 'pending');
    }
    if (activeStatusTab === 'active') {
      return matchSearch && ((evt.status || '').toLowerCase() === 'active' || (evt.status || '').toLowerCase() === 'approved');
    }
    return matchSearch;
  });

  // Metric counters
  const countPending = sourceEvents.filter((e) => (e.status || 'pending').toLowerCase() === 'pending').length;
  const countActive = sourceEvents.filter((e) => (e.status || '').toLowerCase() === 'active' || (e.status || '').toLowerCase() === 'approved').length;
  const totalCapacity = sourceEvents.reduce((acc, curr) => acc + (Number(curr.totalTickets) || 0), 0);

  const totalPages = Math.max(1, Math.ceil((meta.total || sourceEvents.length) / (meta.limit || limit)));

  return (
    <div
      translate="no"
      className="notranslate min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex text-slate-900 dark:text-slate-100"
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

        <main
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
          className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto"
        >
          {/* Action Toast Alert Banner */}
          {actionToast && (
            <div
              style={{ borderRadius: '10px', marginBottom: '8px' }}
              className={`p-3.5 text-xs font-bold flex items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 border ${
                actionToast.type === 'success'
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : actionToast.type === 'warning'
                  ? 'bg-amber-600 text-white border-amber-500'
                  : 'bg-rose-600 text-white border-rose-500'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {actionToast.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="text-sm">{actionToast.message}</div>
                  {actionToast.details && (
                    <div className="text-[11px] opacity-90 font-mono mt-0.5">{actionToast.details}</div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActionToast(null)}
                className="p-1 hover:bg-white/20 rounded cursor-pointer bg-transparent border-0 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Top Title & Route Breadcrumbs */}
          <div
            style={{ marginBottom: '4px' }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <span>{isVi ? 'Quản trị viên' : 'Admin'}</span>
                <span>/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {isVi ? 'Quản lý sự kiện' : 'Event Management'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <span>{isVi ? 'Quản lý sự kiện & Mở bán vé' : 'Event & Concert Presale Management'}</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-1.5">
                <span>{isVi ? 'Điểm cuối API:' : 'API Endpoints:'}</span>
                <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300 font-mono text-[11px] border border-slate-200 dark:border-slate-700">
                  GET /api/v1/admin/events/pending
                </code>
                <span>·</span>
                <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300 font-mono text-[11px] border border-slate-200 dark:border-slate-700">
                  PUT /api/v1/admin/events/{'{id}'}
                </code>
                <span>·</span>
                <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300 font-mono text-[11px] border border-slate-200 dark:border-slate-700">
                  DELETE /api/v1/admin/events/{'{id}'}
                </code>
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={fetchEvents}
                disabled={isLoading}
                style={{
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  padding: '8px 14px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                className="hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                title={isVi ? 'Tải lại danh sách từ backend API' : 'Reload events from backend API'}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
                <span>{isVi ? 'Làm mới' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div
            style={{
              display: 'grid',
              gap: '16px',
            }}
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
            {/* Card 1: Pending Events */}
            <div
              onClick={() => setActiveStatusTab('pending')}
              style={{ borderRadius: '12px', padding: '16px 18px' }}
              className={`border transition-all cursor-pointer ${
                activeStatusTab === 'pending'
                  ? 'bg-amber-500/10 border-amber-500 dark:bg-amber-950/30 dark:border-amber-500/60 shadow-md ring-2 ring-amber-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {isVi ? 'Sự kiện chờ duyệt' : 'Pending Approval'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  GET /pending
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white flex items-baseline gap-2">
                <span>{isLoading ? '...' : (meta.total > 0 && activeStatusTab === 'pending' ? meta.total : countPending)}</span>
                <span className="text-xs font-normal text-slate-500">
                  {isVi ? 'yêu cầu mở bán' : 'requests'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {isVi ? 'Cần ban quản trị duyệt để mở bán vé' : 'Requires admin review to start presale'}
              </p>
            </div>

            {/* Card 2: Approved / Active Events */}
            <div
              onClick={() => setActiveStatusTab('active')}
              style={{ borderRadius: '12px', padding: '16px 18px' }}
              className={`border transition-all cursor-pointer ${
                activeStatusTab === 'active'
                  ? 'bg-emerald-500/10 border-emerald-500 dark:bg-emerald-950/30 dark:border-emerald-500/60 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {isVi ? 'Đang mở bán' : 'Active Events'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  Live
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white flex items-baseline gap-2">
                <span>{isLoading ? '...' : countActive}</span>
                <span className="text-xs font-normal text-slate-500">
                  {isVi ? 'sự kiện hoạt động' : 'live tours'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {isVi ? 'Vé đang được mở bán cho fan quốc tế' : 'Tickets open for global fans'}
              </p>
            </div>

            {/* Card 3: Total Seating / Tickets Capacity */}
            <div
              style={{ borderRadius: '12px', padding: '16px 18px' }}
              className="border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Ticket className="w-4 h-4" />
                  {isVi ? 'Tổng lượng vé phát hành' : 'Total Seating / Capacity'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700">
                  Global
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white flex items-baseline gap-2">
                <span>{isLoading ? '...' : totalCapacity.toLocaleString()}</span>
                <span className="text-xs font-normal text-slate-500">
                  {isVi ? 'chỗ ngồi' : 'seats'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {isVi ? 'Đồng bộ hệ thống vé điện tử QR Code' : 'Synchronized with anti-scalping QR ticketing'}
              </p>
            </div>

            {/* Card 4: Venues & Arenas */}
            <div
              style={{ borderRadius: '12px', padding: '16px 18px' }}
              className="border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-4 h-4" />
                  {isVi ? 'Địa điểm & Đơn vị tổ chức' : 'Venues & Partners'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-700">
                  Certified
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white flex items-baseline gap-2">
                <span>{isLoading ? '...' : '6+ Quốc gia'}</span>
                <span className="text-xs font-normal text-slate-500">
                  {isVi ? 'Sân vận động / Arena' : 'Stadiums & Domes'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {isVi ? 'Mỹ Đình, KSPO Dome, Tokyo Dome...' : 'My Dinh, KSPO Dome, Tokyo Dome...'}
              </p>
            </div>
          </div>

          {/* Connection Error Banner (if backend API is unreachable) */}
          {isConnectionError && (
            <div
              style={{
                borderRadius: '12px',
                padding: '16px 20px',
                backgroundColor: '#fffbeb',
                border: '1px solid #fcd34d',
              }}
              className="dark:bg-amber-950/40 dark:border-amber-700/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/60 rounded-lg text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
                  <WifiOff className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                    <span>{isVi ? 'Lỗi kết nối máy chủ backend' : 'Backend Server Connection Error'}</span>
                    <span className="text-[11px] font-normal px-2 py-0.5 bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 rounded-full font-mono">
                      GET /api/v1/admin/events/pending
                    </span>
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                    {isVi
                      ? 'Không thể kết nối đến máy chủ backend tại /api/v1/admin/events/pending. Vui lòng kiểm tra dịch vụ backend hoặc thử lại kết nối.'
                      : 'Could not connect to backend server at /api/v1/admin/events/pending. Please check backend service or retry connection.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={fetchEvents}
                  style={{
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    padding: '8px 14px',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  className="hover:bg-slate-100 transition-colors shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Thử lại' : 'Retry Connection'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Search, Filter, Tab Navigation Bar */}
          <div
            style={{
              borderRadius: '12px',
              padding: '16px 20px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
            }}
            className="dark:bg-slate-900 dark:border-slate-800 shadow-xs flex flex-col gap-4"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Status Segmented Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                <button
                  type="button"
                  onClick={() => {
                    setActiveStatusTab('pending');
                    setPage(1);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-0 whitespace-nowrap ${
                    activeStatusTab === 'pending'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Chờ duyệt' : 'Pending Approval'}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      activeStatusTab === 'pending'
                        ? 'bg-white/30 text-white'
                        : 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {meta.total > 0 ? meta.total : countPending}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveStatusTab('active');
                    setPage(1);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-0 whitespace-nowrap ${
                    activeStatusTab === 'active'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Đang mở bán' : 'Active Events'}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      activeStatusTab === 'active'
                        ? 'bg-white/30 text-white'
                        : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    {countActive}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveStatusTab('all');
                    setPage(1);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-0 whitespace-nowrap ${
                    activeStatusTab === 'all'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent'
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Tất cả sự kiện' : 'All Events'}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      activeStatusTab === 'all'
                        ? 'bg-white/30 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {sourceEvents.length}
                  </span>
                </button>
              </div>

              {/* View Switcher (Table vs Grid) */}
              <div className="flex items-center gap-2 self-end lg:self-center">
                <span className="text-xs text-slate-400 font-semibold">{isVi ? 'Giao diện:' : 'View:'}</span>
                <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center gap-1 border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded cursor-pointer border-0 transition-colors ${
                      viewMode === 'table'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                        : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                    title={isVi ? 'Dạng bảng' : 'Table View'}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded cursor-pointer border-0 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                        : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                    title={isVi ? 'Dạng thẻ lưới' : 'Grid View'}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search Input & Sort Controls */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="relative flex-1 max-w-lg">
                <Search
                  style={{ left: '14px' }}
                  className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isVi
                      ? 'Tìm kiếm theo tên sự kiện, ca sĩ, địa điểm, mã ID...'
                      : 'Search by event title, artist, venue, ID...'
                  }
                  style={{
                    paddingLeft: '42px',
                    paddingRight: '36px',
                    paddingTop: '9px',
                    paddingBottom: '9px',
                  }}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{ right: '12px' }}
                    className="absolute top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-transparent border-0 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Sort selector */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span>{isVi ? 'Sắp xếp:' : 'Sort:'}</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold focus:outline-none"
                  >
                    <option value="newest">{isVi ? 'Mới nhất (sort=newest)' : 'Newest First'}</option>
                    <option value="oldest">{isVi ? 'Cũ nhất' : 'Oldest First'}</option>
                  </select>
                </div>

                {/* Per page limit */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span>{isVi ? 'Hiển thị:' : 'Limit:'}</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold focus:outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20 (mặc định)</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area: Loading / Empty / Table / Grid */}
          {isLoading ? (
            <div
              style={{
                borderRadius: '12px',
                padding: '64px 24px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
              }}
              className="text-center dark:bg-slate-900 dark:border-slate-800 shadow-xs"
            >
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {isVi ? 'Đang kết nối API và tải danh sách sự kiện...' : 'Connecting to API and loading events...'}
              </p>
              <p className="text-xs text-slate-400 mt-1 font-mono">GET /api/v1/admin/events/pending</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div
              style={{
                borderRadius: '12px',
                padding: '64px 24px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
              }}
              className="text-center dark:bg-slate-900 dark:border-slate-800 shadow-xs"
            >
              <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                {isConnectionError
                  ? isVi
                    ? 'Không có kết nối backend'
                    : 'No Backend Connection'
                  : isVi
                  ? 'Không tìm thấy sự kiện nào'
                  : 'No Events Found'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-5">
                {isConnectionError
                  ? isVi
                    ? 'Máy chủ backend tại /api/v1/admin/events/pending chưa phản hồi. Vui lòng kiểm tra backend hoặc thử lại.'
                    : 'Backend server at /api/v1/admin/events/pending is unreachable. Please verify backend or retry.'
                  : isVi
                  ? 'Thử thay đổi từ khóa tìm kiếm hoặc chuyển sang tab trạng thái khác.'
                  : 'Try changing your search query or selecting a different status filter.'}
              </p>
              <button
                type="button"
                onClick={fetchEvents}
                style={{
                  borderRadius: '8px',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  border: '1px solid #4338ca',
                  padding: '9px 18px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
                }}
                className="hover:bg-indigo-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isVi ? 'Thử lại kết nối' : 'Retry Connection'}</span>
              </button>
            </div>
          ) : viewMode === 'table' ? (
            /* Table View */
            <div
              style={{
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
              }}
              className="dark:bg-slate-900 dark:border-slate-800 shadow-xs overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider text-[11px]">
                      <th className="py-3 px-4">{isVi ? 'Sự kiện & Nghệ sĩ' : 'Event & Artist'}</th>
                      <th className="py-3 px-4">{isVi ? 'Địa điểm' : 'Venue & City'}</th>
                      <th className="py-3 px-4">{isVi ? 'Ngày diễn' : 'Schedule'}</th>
                      <th className="py-3 px-4">{isVi ? 'Giá vé & Số lượng' : 'Pricing & Capacity'}</th>
                      <th className="py-3 px-4">{isVi ? 'Trạng thái' : 'Status'}</th>
                      <th className="py-3 px-4 text-right">{isVi ? 'Hành động duyệt' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredEvents.map((evt) => {
                      const isPending = (evt.status || 'pending').toLowerCase() === 'pending';
                      const isActive = (evt.status || '').toLowerCase() === 'active' || (evt.status || '').toLowerCase() === 'approved';
                      const isRejected = (evt.status || '').toLowerCase() === 'rejected';

                      return (
                        <tr
                          key={evt.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          {/* Event info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              {evt.banner ? (
                                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative">
                                  <img
                                    src={evt.banner}
                                    alt={evt.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900 font-bold">
                                  <Ticket className="w-5 h-5" />
                                </div>
                              )}
                              <div className="min-w-0 max-w-sm">
                                <div className="font-bold text-slate-900 dark:text-white truncate text-xs hover:text-indigo-600 transition-colors">
                                  {evt.title}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                                    {evt.artist || 'K-Pop Live'}
                                  </span>
                                  <span className="text-slate-300 dark:text-slate-700">·</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyId(evt.id)}
                                    className="text-[10px] font-mono text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 inline-flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0"
                                    title={isVi ? 'Nhấp để sao chép mã ID' : 'Click to copy ID'}
                                  >
                                    <span>#{evt.id}</span>
                                    {copiedId === evt.id ? (
                                      <Check className="w-3 h-3 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Venue */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                              <div>
                                <div className="font-semibold text-slate-800 dark:text-slate-200">
                                  {evt.venue || 'TBA'}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {evt.location || 'Châu Á'}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{evt.date || (evt.eventDate ? new Date(evt.eventDate).toLocaleDateString('vi-VN') : 'Sắp diễn ra')}</span>
                            </div>
                            {evt.time && (
                              <div className="text-[10px] text-slate-400 font-mono pl-5">
                                {evt.time} (ICT)
                              </div>
                            )}
                          </td>

                          {/* Price & Tickets */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {evt.ticketPrice || evt.price || 'Liên hệ'}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{evt.totalTickets ? `${evt.totalTickets.toLocaleString()} chỗ` : 'Đang cập nhật'}</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {isPending ? (
                              <span
                                style={{ borderRadius: '6px' }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 shadow-2xs"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                <span>{isVi ? 'Chờ duyệt' : 'Pending'}</span>
                              </span>
                            ) : isActive ? (
                              <span
                                style={{ borderRadius: '6px' }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 shadow-2xs"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span>{isVi ? 'Đã duyệt / Mở bán' : 'Approved'}</span>
                              </span>
                            ) : isRejected ? (
                              <span
                                style={{ borderRadius: '6px' }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-700/60 shadow-2xs"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                <span>{isVi ? 'Từ chối' : 'Rejected'}</span>
                              </span>
                            ) : (
                              <span
                                style={{ borderRadius: '6px' }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
                              >
                                <span>{evt.status}</span>
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              {/* View detail button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedEvent(evt);
                                  setIsDetailModalOpen(true);
                                }}
                                style={{ borderRadius: '6px' }}
                                className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer shadow-2xs inline-flex items-center gap-1 text-xs font-semibold"
                                title={isVi ? 'Xem chi tiết sự kiện' : 'View event details'}
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{isVi ? 'Chi tiết' : 'Details'}</span>
                              </button>

                              {/* PUT /api/v1/admin/events/{id} - Approve */}
                              <button
                                type="button"
                                onClick={() => handleOpenReviewModal(evt, 'Approved')}
                                style={{
                                  borderRadius: '6px',
                                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                }}
                                className="px-2.5 py-1.5 text-white font-bold text-xs border-0 hover:opacity-90 transition-opacity cursor-pointer shadow-xs inline-flex items-center gap-1"
                                title={isVi ? 'Duyệt sự kiện (PUT /api/v1/admin/events/{id})' : 'Approve event (PUT)'}
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>{isVi ? 'Duyệt' : 'Approve'}</span>
                              </button>

                              {/* PUT /api/v1/admin/events/{id} - Reject */}
                              <button
                                type="button"
                                onClick={() => handleOpenReviewModal(evt, 'Rejected')}
                                style={{
                                  borderRadius: '6px',
                                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                }}
                                className="px-2.5 py-1.5 text-white font-bold text-xs border-0 hover:opacity-90 transition-opacity cursor-pointer shadow-xs inline-flex items-center gap-1"
                                title={isVi ? 'Từ chối sự kiện (PUT /api/v1/admin/events/{id})' : 'Reject event (PUT)'}
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>{isVi ? 'Từ chối' : 'Reject'}</span>
                              </button>

                              {/* DELETE /api/v1/admin/events/{id} - Delete */}
                              <button
                                type="button"
                                onClick={() => handleOpenDeleteModal(evt)}
                                style={{ borderRadius: '6px' }}
                                className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-700 transition-colors border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-800 cursor-pointer shadow-2xs inline-flex items-center gap-1 text-xs font-semibold"
                                title={isVi ? 'Gỡ sự kiện khỏi hệ thống (DELETE /api/v1/admin/events/{id})' : 'Delete event (DELETE)'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{isVi ? 'Gỡ' : 'Delete'}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Grid Card View */
            <div
              style={{
                display: 'grid',
                gap: '20px',
              }}
              className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredEvents.map((evt) => {
                const isPending = (evt.status || 'pending').toLowerCase() === 'pending';
                const isActive = (evt.status || '').toLowerCase() === 'active' || (evt.status || '').toLowerCase() === 'approved';
                const isRejected = (evt.status || '').toLowerCase() === 'rejected';

                return (
                  <div
                    key={evt.id}
                    style={{ borderRadius: '12px' }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Image Banner */}
                      <div className="relative h-44 bg-slate-800 overflow-hidden group">
                        {evt.banner ? (
                          <img
                            src={evt.banner}
                            alt={evt.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-indigo-950 text-indigo-400">
                            <Ticket className="w-12 h-12 opacity-50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-black/70 text-white backdrop-blur-md border border-white/20">
                            {evt.category || 'Concert'}
                          </span>

                          {isPending ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white shadow-md flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{isVi ? 'Chờ duyệt' : 'Pending'}</span>
                            </span>
                          ) : isRejected ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-md flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              <span>{isVi ? 'Từ chối' : 'Rejected'}</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-md flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{isVi ? 'Đã duyệt / Mở bán' : 'Approved'}</span>
                            </span>
                          )}
                        </div>

                        {/* Bottom Overlay Title on Banner */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <div className="text-[11px] font-semibold text-sky-300 uppercase tracking-wide">
                            {evt.artist || 'Nghệ sĩ K-Pop'}
                          </div>
                          <h3 className="text-sm font-bold truncate drop-shadow-sm">{evt.title}</h3>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                          <span className="font-mono">ID: #{evt.id}</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {evt.organizer || 'Fan Hub Verified'}
                          </span>
                        </div>

                        <div className="space-y-1.5 pt-1 text-slate-700 dark:text-slate-300">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span className="truncate font-medium">{evt.venue} · {evt.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span>{evt.date || (evt.eventDate ? new Date(evt.eventDate).toLocaleDateString('vi-VN') : 'Sắp diễn ra')}</span>
                            {evt.time && <span className="text-slate-400 font-mono">({evt.time})</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <Ticket className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span className="font-bold text-slate-900 dark:text-white">
                              {evt.ticketPrice || evt.price || 'Đang cập nhật'}
                            </span>
                            <span className="text-slate-400 text-[11px]">
                              ({evt.totalTickets ? evt.totalTickets.toLocaleString() : 'N/A'} {isVi ? 'vé' : 'tickets'})
                            </span>
                          </div>
                        </div>

                        {evt.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 pt-1">
                            {evt.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 mt-2 flex items-center justify-between gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEvent(evt);
                          setIsDetailModalOpen(true);
                        }}
                        style={{ borderRadius: '6px' }}
                        className="px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isVi ? 'Chi tiết' : 'Details'}</span>
                      </button>

                      <div className="flex items-center gap-1.5 ml-auto">
                        <button
                          type="button"
                          onClick={() => handleOpenReviewModal(evt, 'Approved')}
                          style={{
                            borderRadius: '6px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          }}
                          className="px-2.5 py-1.5 text-xs font-bold text-white border-0 hover:opacity-90 transition-opacity cursor-pointer shadow-xs flex items-center gap-1"
                          title={isVi ? 'Duyệt sự kiện (PUT /api/v1/admin/events/{id})' : 'Approve event (PUT)'}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isVi ? 'Duyệt' : 'Approve'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenReviewModal(evt, 'Rejected')}
                          style={{
                            borderRadius: '6px',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          }}
                          className="px-2.5 py-1.5 text-xs font-bold text-white border-0 hover:opacity-90 transition-opacity cursor-pointer shadow-xs flex items-center gap-1"
                          title={isVi ? 'Từ chối sự kiện (PUT /api/v1/admin/events/{id})' : 'Reject event (PUT)'}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{isVi ? 'Từ chối' : 'Reject'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenDeleteModal(evt)}
                          style={{ borderRadius: '6px' }}
                          className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-800 cursor-pointer shadow-2xs flex items-center"
                          title={isVi ? 'Gỡ sự kiện khỏi hệ thống (DELETE /api/v1/admin/events/{id})' : 'Delete event (DELETE)'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          <div
            style={{
              marginTop: '12px',
              paddingTop: '16px',
              borderTop: '1px solid #e2e8f0',
            }}
            className="dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500"
          >
            <div>
              {isVi ? 'Hiển thị' : 'Showing'}{' '}
              <span className="font-bold text-slate-900 dark:text-white">
                {filteredEvents.length}
              </span>{' '}
              {isVi ? 'trên tổng số' : 'of'}{' '}
              <span className="font-bold text-slate-900 dark:text-white">
                {meta.total || sourceEvents.length}
              </span>{' '}
              {isVi ? 'sự kiện' : 'events'}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                style={{ borderRadius: '6px' }}
                className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer inline-flex items-center gap-1 font-semibold"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{isVi ? 'Trước' : 'Prev'}</span>
              </button>

              <span className="px-2 font-mono font-bold text-slate-800 dark:text-slate-200">
                {page} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                style={{ borderRadius: '6px' }}
                className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer inline-flex items-center gap-1 font-semibold"
              >
                <span>{isVi ? 'Sau' : 'Next'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* APPROVE MODAL: POST /api/v1/admin/events/{id}/approve */}
      {isApproveModalOpen && eventToApprove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            style={{ borderRadius: '16px' }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {isVi ? 'Duyệt Mở Bán Sự Kiện' : 'Approve Event Presale'}
                  </h3>
                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                    <span>POST /api/v1/admin/events/</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {eventToApprove.id}
                    </span>
                    <span>/approve</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsApproveModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer bg-transparent border-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <div className="p-6 space-y-4 text-xs">
              {/* Event preview box */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-sm shrink-0">
                  <Ticket className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white text-xs truncate">
                    {eventToApprove.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {eventToApprove.artist} · {eventToApprove.venue}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                    ID: {eventToApprove.id}
                  </div>
                </div>
              </div>

              {/* Title Input field per API doc: { "title": "Dữ liệu mẫu" } */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isVi ? 'Tiêu đề xác nhận duyệt (title)' : 'Approval Title (title)'}
                </label>
                <input
                  type="text"
                  value={approveForm.title}
                  onChange={(e) => setApproveForm({ ...approveForm, title: e.target.value })}
                  placeholder={isVi ? 'Dữ liệu mẫu' : 'Sample title'}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  {isVi ? 'Trường dữ liệu mẫu gửi theo body API' : 'Body field sent to backend API'}
                </p>
              </div>

              {/* Description Input field per API doc: { "description": "Chi tiết Duyệt sự kiện mở bán" } */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isVi ? 'Chi tiết phê duyệt (description)' : 'Approval Note / Description (description)'}
                </label>
                <textarea
                  rows={3}
                  value={approveForm.description}
                  onChange={(e) => setApproveForm({ ...approveForm, description: e.target.value })}
                  placeholder={isVi ? 'Chi tiết Duyệt sự kiện mở bán' : 'Approval details note'}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Status field per API doc: { "status": "active" } */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isVi ? 'Trạng thái sau duyệt (status)' : 'Status after approval (status)'}
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800 dark:text-slate-200">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={approveForm.status === 'active'}
                      onChange={() => setApproveForm({ ...approveForm, status: 'active' })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">active</span>
                    <span className="text-slate-400 text-[11px]">({isVi ? 'Mở bán chính thức' : 'Presale Active'})</span>
                  </label>
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  {isVi
                    ? 'Sau khi duyệt, sự kiện sẽ chuyển sang trạng thái "active", hiển thị trên cổng mua vé của Fan Hub và gửi thông báo mở bán đến các tài khoản người hâm mộ đã đăng ký theo dõi.'
                    : 'Once approved, the event status will change to "active" and tickets will be available for global fans on the storefront.'}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsApproveModalOpen(false)}
                disabled={isSubmittingApprove}
                style={{ borderRadius: '8px' }}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 cursor-pointer"
              >
                {isVi ? 'Hủy bỏ' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleConfirmApprove}
                disabled={isSubmittingApprove}
                style={{
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                }}
                className="px-5 py-2 text-xs font-black text-white border-0 hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                {isSubmittingApprove ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{isVi ? 'Đang gửi duyệt...' : 'Approving...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{isVi ? 'Xác Nhận Duyệt Mở Bán' : 'Confirm Approval'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EVENT DETAIL MODAL */}
      {isDetailModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            style={{ borderRadius: '16px' }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
          >
            {/* Detail Banner */}
            <div className="relative h-48 bg-slate-900 overflow-hidden shrink-0">
              {selectedEvent.banner ? (
                <img
                  src={selectedEvent.banner}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-indigo-400 bg-indigo-950">
                  <Ticket className="w-16 h-16 opacity-40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full cursor-pointer backdrop-blur-md border border-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-600 text-white inline-block mb-1.5">
                  {selectedEvent.artist || 'K-Pop Live'}
                </span>
                <h2 className="text-lg sm:text-xl font-black leading-tight drop-shadow-md">
                  {selectedEvent.title}
                </h2>
              </div>
            </div>

            {/* Detail Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Status pill & ID */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold">{isVi ? 'Trạng thái:' : 'Status:'}</span>
                  {(selectedEvent.status || 'pending').toLowerCase() === 'pending' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                      {isVi ? 'Chờ duyệt mở bán' : 'Pending Approval'}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                      {isVi ? 'Đang mở bán vé' : 'Active Presale'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 font-mono text-slate-500">
                  <span>ID: #{selectedEvent.id}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyId(selectedEvent.id)}
                    className="p-1 hover:text-slate-800 dark:hover:text-slate-200 bg-transparent border-0 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{isVi ? 'Địa điểm tổ chức' : 'Venue & Location'}</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs">
                    {selectedEvent.venue || 'TBA'}
                  </div>
                  <div className="text-[11px] text-slate-500">{selectedEvent.location || 'Châu Á'}</div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{isVi ? 'Thời gian tổ chức' : 'Event Date & Time'}</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs">
                    {selectedEvent.date || (selectedEvent.eventDate ? new Date(selectedEvent.eventDate).toLocaleDateString('vi-VN') : 'Sắp diễn ra')}
                  </div>
                  <div className="text-[11px] text-slate-500">{selectedEvent.time ? `${selectedEvent.time} (Giờ địa phương)` : 'TBA'}</div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{isVi ? 'Giá vé niêm yết' : 'Ticket Pricing Range'}</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs">
                    {selectedEvent.ticketPrice || selectedEvent.price || 'Liên hệ'}
                  </div>
                  <div className="text-[11px] text-slate-500">{isVi ? 'Bao gồm vé VIP & General Admission' : 'VIP & General Admission'}</div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{isVi ? 'Đơn vị tổ chức' : 'Organizer Agency'}</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs">
                    {selectedEvent.organizer || 'Fan Hub Partner'}
                  </div>
                  <div className="text-[11px] text-slate-500">{isVi ? 'Đã ký kết hợp đồng phân phối' : 'Verified Partner'}</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  {isVi ? 'Mô tả chi tiết sự kiện' : 'Event Description'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  {selectedEvent.description || (isVi ? 'Chưa có mô tả chi tiết cho sự kiện này.' : 'No detailed description provided.')}
                </p>
              </div>
            </div>

            {/* Detail Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  style={{ borderRadius: '8px' }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 cursor-pointer"
                >
                  {isVi ? 'Đóng' : 'Close'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleOpenDeleteModal(selectedEvent);
                  }}
                  style={{ borderRadius: '8px' }}
                  className="px-3.5 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-800/70 cursor-pointer inline-flex items-center gap-1.5"
                  title="DELETE /api/v1/admin/events/{id}"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Gỡ sự kiện (DELETE)' : 'Delete Event'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleOpenReviewModal(selectedEvent, 'Rejected');
                  }}
                  style={{
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  }}
                  className="px-4 py-2 text-xs font-bold text-white border-0 hover:opacity-90 transition-opacity cursor-pointer shadow-md inline-flex items-center gap-1.5"
                  title="PUT /api/v1/admin/events/{id} [status: Rejected]"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{isVi ? 'Từ chối (PUT)' : 'Reject'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleOpenReviewModal(selectedEvent, 'Approved');
                  }}
                  style={{
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  }}
                  className="px-5 py-2 text-xs font-black text-white border-0 hover:opacity-90 transition-opacity cursor-pointer shadow-md inline-flex items-center gap-2"
                  title="PUT /api/v1/admin/events/{id} [status: Approved]"
                >
                  <Check className="w-4 h-4" />
                  <span>{isVi ? 'Duyệt sự kiện (PUT)' : 'Approve Now'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW STATUS MODAL: PUT /api/v1/admin/events/{id} */}
      {/* Headers: Admin JWT */}
      {/* Body: { "status": "Approved|Rejected", "admin_note": "Nội dung vi phạm tiêu chuẩn" } */}
      {/* Response 200: { "message": "Đã duyệt/Từ chối sự kiện" } */}
      {isReviewModalOpen && reviewEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            style={{ borderRadius: '16px' }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div
                  style={{ borderRadius: '8px' }}
                  className={`w-9 h-9 flex items-center justify-center ${
                    reviewForm.status === 'Approved'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {reviewForm.status === 'Approved' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{isVi ? 'Phê duyệt / Từ chối sự kiện' : 'Review Event Status'}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-bold">
                      PUT #{reviewEvent.id}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    /api/v1/admin/events/{reviewEvent.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors bg-transparent border-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Event preview box */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm shrink-0">
                  <Ticket className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white text-xs truncate">
                    {reviewEvent.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {reviewEvent.artist || 'Fan Hub Artist'} · {reviewEvent.venue || 'TBA'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    ID: #{reviewEvent.id}
                  </div>
                </div>
              </div>

              {/* Status Selector (Approved | Rejected) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isVi ? 'Chọn trạng thái cập nhật (status)' : 'Select Status (status)'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Approved option */}
                  <button
                    type="button"
                    onClick={() =>
                      setReviewForm({
                        ...reviewForm,
                        status: 'Approved',
                      })
                    }
                    style={{ borderRadius: '10px' }}
                    className={`p-3 text-left border cursor-pointer transition-all flex flex-col justify-between ${
                      reviewForm.status === 'Approved'
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approved</span>
                      </span>
                      {reviewForm.status === 'Approved' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isVi ? 'Duyệt & mở bán vé' : 'Approve event'}
                    </span>
                  </button>

                  {/* Rejected option */}
                  <button
                    type="button"
                    onClick={() =>
                      setReviewForm({
                        status: 'Rejected',
                        admin_note:
                          reviewForm.admin_note ||
                          (isVi ? 'Nội dung vi phạm tiêu chuẩn' : 'Content violates standards'),
                      })
                    }
                    style={{ borderRadius: '10px' }}
                    className={`p-3 text-left border cursor-pointer transition-all flex flex-col justify-between ${
                      reviewForm.status === 'Rejected'
                        ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 shadow-xs ring-2 ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" />
                        <span>Rejected</span>
                      </span>
                      {reviewForm.status === 'Rejected' && (
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isVi ? 'Từ chối sự kiện' : 'Reject event'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Admin Note textarea (admin_note) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isVi ? 'Ghi chú quản trị viên (admin_note)' : 'Admin Note (admin_note)'}
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {reviewForm.status === 'Rejected'
                      ? (isVi ? 'Khuyến nghị khi từ chối' : 'Recommended')
                      : (isVi ? 'Tùy chọn' : 'Optional')}
                  </span>
                </div>

                <textarea
                  rows={3}
                  value={reviewForm.admin_note}
                  onChange={(e) => setReviewForm({ ...reviewForm, admin_note: e.target.value })}
                  placeholder={
                    reviewForm.status === 'Rejected'
                      ? (isVi ? 'Ví dụ: Nội dung vi phạm tiêu chuẩn' : 'e.g. Content violates standards')
                      : (isVi ? 'Nhập ghi chú phê duyệt (nếu có)...' : 'Enter approval notes...')
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Quick note templates matching API doc example */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">{isVi ? 'Mẫu nhanh:' : 'Templates:'}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setReviewForm({
                        ...reviewForm,
                        admin_note: isVi ? 'Nội dung vi phạm tiêu chuẩn' : 'Content violates standards',
                      })
                    }
                    className="px-2 py-0.5 text-[10px] rounded bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 cursor-pointer font-medium transition-colors"
                  >
                    + {isVi ? 'Nội dung vi phạm tiêu chuẩn' : 'Violates standards'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setReviewForm({
                        ...reviewForm,
                        admin_note: isVi
                          ? 'Thông tin thời gian & địa điểm chưa chính xác'
                          : 'Inaccurate event info',
                      })
                    }
                    className="px-2 py-0.5 text-[10px] rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 cursor-pointer font-medium transition-colors"
                  >
                    + {isVi ? 'Thông tin chưa chính xác' : 'Inaccurate info'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setReviewForm({
                        ...reviewForm,
                        admin_note: isVi
                          ? 'Đã xác minh đầy đủ hồ sơ tổ chức'
                          : 'Verified organizer credentials',
                      })
                    }
                    className="px-2 py-0.5 text-[10px] rounded bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 cursor-pointer font-medium transition-colors"
                  >
                    + {isVi ? 'Đã xác minh hợp lệ' : 'Verified'}
                  </button>
                </div>
              </div>

              {/* API Body Preview */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-600 dark:text-slate-300 space-y-1">
                <div className="font-bold text-indigo-600 dark:text-indigo-400">
                  PUT /api/v1/admin/events/{reviewEvent.id}
                </div>
                <div className="text-slate-500 dark:text-slate-400 truncate">
                  {`{ "status": "${reviewForm.status}", "admin_note": "${reviewForm.admin_note}" }`}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                disabled={isSubmittingReview}
                style={{ borderRadius: '8px' }}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 cursor-pointer"
              >
                {isVi ? 'Hủy bỏ' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleConfirmReview}
                disabled={isSubmittingReview}
                style={{
                  borderRadius: '8px',
                  background:
                    reviewForm.status === 'Approved'
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                }}
                className="px-5 py-2 text-xs font-black text-white border-0 hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                {isSubmittingReview ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{isVi ? 'Đang cập nhật...' : 'Updating...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>
                      {reviewForm.status === 'Approved'
                        ? (isVi ? 'Xác Nhận Duyệt Sự Kiện' : 'Confirm Approval')
                        : (isVi ? 'Xác Nhận Từ Chối' : 'Confirm Rejection')}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL: DELETE /api/v1/admin/events/{id} */}
      {/* Headers: Admin JWT */}
      {/* Path param: id */}
      {/* Response 200: { "message": "Đã gỡ sự kiện khỏi hệ thống" } */}
      {isDeleteModalOpen && eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            style={{ borderRadius: '16px' }}
            className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-rose-100 dark:border-rose-900/40 flex items-center justify-between bg-rose-50/60 dark:bg-rose-950/30">
              <div className="flex items-center gap-2.5">
                <div
                  style={{ borderRadius: '8px' }}
                  className="w-9 h-9 flex items-center justify-center bg-rose-500/15 text-rose-600 dark:text-rose-400"
                >
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-rose-950 dark:text-rose-200">
                    {isVi ? 'Gỡ sự kiện khỏi hệ thống' : 'Remove Event'}
                  </h3>
                  <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80 font-mono">
                    DELETE /api/v1/admin/events/{eventToDelete.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors bg-transparent border-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Alert notice */}
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-rose-800 dark:text-rose-300 leading-relaxed">
                  <div className="font-bold mb-1">
                    {isVi ? 'Cảnh báo thao tác quan trọng!' : 'Important Action Warning!'}
                  </div>
                  <div>
                    {isVi
                      ? 'Thao tác này sẽ gọi API DELETE để gỡ sự kiện này khỏi hệ thống. Vui lòng xác nhận trước khi tiếp tục.'
                      : 'This action will invoke the DELETE endpoint to permanently remove this event from the system.'}
                  </div>
                </div>
              </div>

              {/* Event preview */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-400 font-mono mb-1">
                  ID: #{eventToDelete.id}
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-xs mb-1 truncate">
                  {eventToDelete.title}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {eventToDelete.venue || 'TBA'} · {eventToDelete.location || 'Châu Á'}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isSubmittingDelete}
                style={{ borderRadius: '8px' }}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 cursor-pointer"
              >
                {isVi ? 'Hủy bỏ' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSubmittingDelete}
                style={{
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                }}
                className="px-5 py-2 text-xs font-black text-white border-0 hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                {isSubmittingDelete ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{isVi ? 'Đang gỡ sự kiện...' : 'Deleting...'}</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>{isVi ? 'Xác Nhận Gỡ Bỏ' : 'Confirm Delete'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
