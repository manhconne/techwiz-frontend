'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import {
  Users,
  Search,
  ArrowUpDown,
  RefreshCw,
  WifiOff,
  CheckCircle2,
  Shield,
  UserCheck,
  Mail,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  Copy,
  Database,
  Lock,
  Ban,
  Unlock,
  AlertTriangle,
  X,
} from 'lucide-react';

// User type definition compatible with API doc: { id: "xxx", title: "User Management", ... }
export interface AdminUserItem {
  id: string | number;
  title?: string;
  name?: string;
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  created_at?: string;
  avatar?: string;
  [key: string]: any;
}

export interface ApiResponseMeta {
  total: number;
  page: number;
  limit: number;
}

// Fallback demo data to showcase the UI if backend is offline or deploying
const DEMO_FALLBACK_USERS: AdminUserItem[] = [
  {
    id: 'USR-8001',
    title: 'Minji Park (VIP Member)',
    name: 'Minji Park',
    email: 'minji.park@fanhubplus.com',
    role: 'admin',
    status: 'active',
    createdAt: '2026-03-24T10:30:00Z',
    phone: '+82 10-1234-5678',
  },
  {
    id: 'USR-8002',
    title: 'Sarah Jenkins',
    name: 'Sarah Jenkins',
    email: 'sarah.j@fandom.org',
    role: 'registered',
    status: 'active',
    createdAt: '2026-03-23T14:15:00Z',
    phone: '+1 415-987-6543',
  },
  {
    id: 'USR-8003',
    title: 'Kim Min-seok (Direct Distributor)',
    name: 'Kim Min-seok',
    email: 'minseok.k@seoulhub.kr',
    role: 'registered',
    status: 'active',
    createdAt: '2026-03-22T08:45:00Z',
    phone: '+82 10-5544-3322',
  },
  {
    id: 'USR-8004',
    title: 'Lucas Vance (B2B Bulk Manager)',
    name: 'Lucas Vance',
    email: 'lucas.v@kpopmerch.com',
    role: 'admin',
    status: 'active',
    createdAt: '2026-03-21T18:20:00Z',
    phone: '+44 20-7946-0958',
  },
  {
    id: 'USR-8005',
    title: 'Pham Minh Hang',
    name: 'Pham Minh Hang',
    email: 'hang.pham@bunnies.net',
    role: 'registered',
    status: 'inactive',
    createdAt: '2026-03-20T09:10:00Z',
    phone: '+84 934-889-900',
  },
  {
    id: 'USR-8006',
    title: 'Alexandre Roy (Policy Violation)',
    name: 'Alexandre Roy',
    email: 'alex.roy@outlook.com',
    role: 'registered',
    status: 'banned',
    createdAt: '2026-03-18T16:05:00Z',
    phone: '+33 6-12-34-56-78',
  },
];

export default function AdminUsersPage() {
  const { language, setLanguage } = useAdminLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  const isVi = language === 'vi';

  // API State
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [meta, setMeta] = useState<ApiResponseMeta>({ total: 0, page: 1, limit: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnectionError, setIsConnectionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDemoPreview, setShowDemoPreview] = useState(false);

  // Filters & Pagination query parameters per API doc (?page=1&limit=20&sort=newest)
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [sort, setSort] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Detail & Confirmation Modal State
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);
  const [confirmActionUser, setConfirmActionUser] = useState<AdminUserItem | null>(null);
  const [banningUserId, setBanningUserId] = useState<string | number | null>(null);
  const [actionToast, setActionToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Responsive sidebar detection
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  // Fetch users from backend API
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setIsConnectionError(false);
    setErrorMessage(null);

    // Get Admin JWT token from cookie or localStorage
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

    const apiUrl = `/api/v1/admin/users?${params.toString()}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const resData = await response.json();

      // Handle response structure { data: [...], meta: { total, page, limit } }
      if (resData && Array.isArray(resData.data)) {
        setUsers(resData.data);
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
        setUsers(resData);
        setMeta({ total: resData.length, page: 1, limit });
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err: any) {
      console.warn('Backend API connection error /api/v1/admin/users:', err);
      // Strictly set error state to "Connection Error"  per requirement
      setIsConnectionError(true);
      setErrorMessage('Connection Error');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, sort, searchQuery]);

  // Trigger fetch on query param changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Toggle Ban / Unban User: PUT /api/v1/admin/users/{id}/ban
  const handleToggleBanUser = async (targetUser: AdminUserItem) => {
    const isCurrentlyBanned = (targetUser.status || '').toLowerCase() === 'banned' || (targetUser.status || '').toLowerCase() === 'locked';
    const nextStatus = isCurrentlyBanned ? 'active' : 'banned';
    const actionLabel = isCurrentlyBanned ? 'Unban' : 'Ban';

    setBanningUserId(targetUser.id);
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

    // Body according to API doc: { "title": "Update data", "status": "updated" }
    const requestBody = {
      title: 'Update data',
      status: 'updated',
      targetStatus: nextStatus,
      action: isCurrentlyBanned ? 'unban' : 'ban',
    };

    try {
      const response = await fetch(`/api/v1/admin/users/${encodeURIComponent(targetUser.id)}/ban`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const resJson = await response.json().catch(() => ({}));
      const successMessage = resJson.message || `User successfully ${isCurrentlyBanned ? 'unbanned' : 'banned'}!`;

      // Update state locally
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, status: nextStatus } : u))
      );
      if (selectedUser && selectedUser.id === targetUser.id) {
        setSelectedUser((prev) => (prev ? { ...prev, status: nextStatus } : null));
      }

      setActionToast({
        type: 'success',
        message: successMessage,
      });
      setTimeout(() => setActionToast(null), 4000);
    } catch (err: any) {
      console.warn('Connection error on PUT /api/v1/admin/users/{id}/ban:', err);
      
      if (showDemoPreview || users.length === 0) {
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, status: nextStatus } : u))
        );
        if (selectedUser && selectedUser.id === targetUser.id) {
          setSelectedUser((prev) => (prev ? { ...prev, status: nextStatus } : null));
        }
        setActionToast({
          type: 'warning',
          message: `Connection Error: Server offline. (Simulated ${actionLabel.toLowerCase()} action in demo preview)`,
        });
      } else {
        setActionToast({
          type: 'error',
          message: 'Connection Error: Failed to update user status to backend server.',
        });
      }
      setTimeout(() => setActionToast(null), 5000);
    } finally {
      setBanningUserId(null);
      setConfirmActionUser(null);
    }
  };

  // Filtered users for local search / roles if demo data or local filter active
  const displayedUsers = showDemoPreview && users.length === 0 ? DEMO_FALLBACK_USERS : users;

  const filteredUsers = displayedUsers.filter((u) => {
    const term = (searchQuery || headerSearch).toLowerCase().trim();
    const titleMatch = (u.title || '').toLowerCase().includes(term);
    const nameMatch = (u.name || u.fullName || u.username || '').toLowerCase().includes(term);
    const emailMatch = (u.email || '').toLowerCase().includes(term);
    const idMatch = String(u.id || '').toLowerCase().includes(term);

    const matchSearch = !term || titleMatch || nameMatch || emailMatch || idMatch;
    const matchRole = roleFilter === 'all' || (u.role || 'registered').toLowerCase() === roleFilter.toLowerCase();
    const matchStatus = statusFilter === 'all' || (u.status || 'active').toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchRole && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil((meta.total || displayedUsers.length) / (meta.limit || limit)));

  const handleCopyId = (id: string | number) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(String(id));
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div
      translate="no"
      className="notranslate min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex text-slate-900 dark:text-slate-100"
    >
      {/* Sidebar with activeTab='users' */}
      <AdminSidebar
        activeTab="users"
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
          activeTab="users"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 max-w-[1600px] w-full mx-auto">
          {/* Action Toast Alert Banner */}
          {actionToast && (
            <div
              style={{ borderRadius: '8px' }}
              className={`p-3 text-xs font-bold flex items-center justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-200 ${
                actionToast.type === 'success'
                  ? 'bg-emerald-600 text-white'
                  : actionToast.type === 'warning'
                  ? 'bg-amber-600 text-white'
                  : 'bg-rose-600 text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                {actionToast.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                )}
                <span>{actionToast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setActionToast(null)}
                className="p-1 hover:bg-white/20 rounded cursor-pointer bg-transparent border-0 text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Top Title & Route Breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800 mb-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <span>{'Admin'}</span>
                <span>/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{'User Management'}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <span>{'User Management'}</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {'API Endpoints:'} <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300 font-mono">GET /api/v1/admin/users</code> | <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300 font-mono">PUT /api/v1/admin/users/{'{id}'}/ban</code>
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={fetchUsers}
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
                title={'Reload users from backend API'}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
                <span>{'Refresh'}</span>
              </button>

              {isConnectionError && (
                <button
                  type="button"
                  onClick={() => setShowDemoPreview(!showDemoPreview)}
                  style={{
                    borderRadius: '8px',
                    backgroundColor: '#e0e7ff',
                    color: '#3730a3',
                    border: '1px solid #c7d2fe',
                    padding: '8px 14px',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>{showDemoPreview ? ('Hide Demo Preview') : ('View Demo Data')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Connection Error Banner */}
          {isConnectionError && (
            <div
              style={{ borderRadius: '10px' }}
              className="p-4 mb-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <WifiOff className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm flex items-center gap-2">
                    <span>{'Connection Error'}</span>
                    <span className="text-[11px] font-normal px-2 py-0.5 bg-amber-200/60 dark:bg-amber-800/60 rounded text-amber-800 dark:text-amber-300">
                      {'HTTP / Network'}
                    </span>
                  </div>
                  <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                    {'Could not connect to backend server at /api/v1/admin/users. When deployed alongside the backend, data will sync automatically.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={fetchUsers}
                  style={{
                    borderRadius: '6px',
                    backgroundColor: '#d97706',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 14px',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  {'Retry Connection'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDemoPreview(true)}
                  style={{
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    color: '#92400e',
                    border: '1px solid #fcd34d',
                    padding: '6px 14px',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  {'View Demo'}
                </button>
              </div>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">{'TOTAL USERS'}</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {meta.total || (showDemoPreview ? DEMO_FALLBACK_USERS.length : 0)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{'From API response meta.total'}</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">{'ADMINISTRATORS'}</span>
                <Shield className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {filteredUsers.filter((u) => (u.role || '').toLowerCase() === 'admin').length || (showDemoPreview ? 2 : 0)}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">{'Full privileged access'}</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">{'BANNED ACCOUNTS'}</span>
                <Ban className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
                {filteredUsers.filter((u) => (u.status || '').toLowerCase() === 'banned' || (u.status || '').toLowerCase() === 'locked').length || (showDemoPreview ? 1 : 0)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{'Login blocked'}</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">{'API STATUS'}</span>
                {isConnectionError ? (
                  <WifiOff className="w-4 h-4 text-rose-500" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </div>
              <div className={`text-base font-bold ${isConnectionError ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {isConnectionError ? ('Connection Error') : ('Connected')}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {isConnectionError ? ('Awaiting backend deployment') : ('JWT Authentication OK')}
              </div>
            </div>
          </div>

          {/* Filter, Search & Sort Toolbar */}
          <div className="p-4 mb-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder={'Search users by name, email, title or ID...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ borderRadius: '8px' }}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Filter controls */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Sort selector: ?sort=newest */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setPage(1);
                    }}
                    style={{ borderRadius: '6px' }}
                    className="p-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="newest">{'Newest first (newest)'}</option>
                    <option value="oldest">{'Oldest first (oldest)'}</option>
                    <option value="name_asc">{'Name (A-Z)'}</option>
                    <option value="name_desc">{'Name (Z-A)'}</option>
                  </select>
                </div>

                {/* Limit selector: ?limit=20 */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">{'Show:'}</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    style={{ borderRadius: '6px' }}
                    className="p-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
                  >
                    <option value={10}>10 {'/ page'}</option>
                    <option value={20}>20 {'/ page (default)'}</option>
                    <option value={50}>50 {'/ page'}</option>
                  </select>
                </div>

                {/* Role filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  style={{ borderRadius: '6px' }}
                  className="p-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
                >
                  <option value="all">{'All Roles'}</option>
                  <option value="admin">{'Administrator (Admin)'}</option>
                  <option value="registered">{'Registered Member'}</option>
                </select>

                {/* Status filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ borderRadius: '6px' }}
                  className="p-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
                >
                  <option value="all">{'All Status'}</option>
                  <option value="active">{'Active'}</option>
                  <option value="inactive">{'Pending'}</option>
                  <option value="banned">{'Banned'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* User Data Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-500">{'Loading user catalog from server...'}</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-16 px-4 text-center">
                {isConnectionError ? (
                  <div className="max-w-md mx-auto flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                      <WifiOff className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                      {'Connection Error'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {'Could not load user list from backend API (/api/v1/admin/users). Once deployed, the frontend will connect and sync automatically.'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={fetchUsers}
                        style={{
                          borderRadius: '8px',
                          backgroundColor: '#4f46e5',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px 16px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {'Retry Connection'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDemoPreview(true)}
                        style={{
                          borderRadius: '8px',
                          backgroundColor: '#f1f5f9',
                          color: '#334155',
                          border: '1px solid #cbd5e1',
                          padding: '8px 16px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {'Enable Demo Preview'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Users className="w-8 h-8 stroke-1" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{'No matching users found'}</p>
                    <p className="text-xs">{'Try adjusting your search terms or filter settings.'}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">{'USER / TITLE'}</th>
                      <th className="py-3 px-4">{'USER ID'}</th>
                      <th className="py-3 px-4">{'EMAIL / CONTACT'}</th>
                      <th className="py-3 px-4">{'ROLE'}</th>
                      <th className="py-3 px-4">{'STATUS'}</th>
                      <th className="py-3 px-4">{'JOIN DATE'}</th>
                      <th className="py-3 px-4 text-right">{'ACTIONS'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredUsers.map((item, idx) => {
                      const displayTitle = item.title || item.name || item.fullName || `User #${item.id}`;
                      const email = item.email || (item.id ? `user_${item.id}@fanhub.com` : 'Not provided');
                      const role = (item.role || 'registered').toLowerCase();
                      const status = (item.status || 'active').toLowerCase();
                      const rawDate = item.createdAt || item.created_at || '2026-09-25';
                      const formattedDate = new Date(rawDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      });

                      const isAdmin = role.includes('admin');
                      const isActive = status === 'active';
                      const isBanned = status === 'banned' || status === 'locked';
                      const isProcessingThis = banningUserId === item.id;

                      return (
                        <tr
                          key={item.id || idx}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                        >
                          {/* User Name / Title */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                style={{ borderRadius: '50%' }}
                                className={`w-8 h-8 flex items-center justify-center font-bold text-xs uppercase shrink-0 ${
                                  isAdmin
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                                    : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                                }`}
                              >
                                {item.avatar ? (
                                  <img
                                    src={item.avatar}
                                    alt={displayTitle}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  displayTitle.charAt(0) || 'U'
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-[260px]">
                                  {displayTitle}
                                </div>
                                {item.phone && (
                                  <div className="text-[11px] text-slate-400 font-mono">{item.phone}</div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* ID Code with Copy */}
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            <button
                              type="button"
                              onClick={() => handleCopyId(item.id)}
                              className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer bg-transparent border-0 p-0"
                              title="Copy ID"
                            >
                              <span>{String(item.id)}</span>
                              <Copy className="w-3 h-3 opacity-60 hover:opacity-100" />
                            </button>
                          </td>

                          {/* Email */}
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                            <div className="flex items-center gap-1.5 truncate max-w-[220px]">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{email}</span>
                            </div>
                          </td>

                          {/* Role Badge */}
                          <td className="py-3 px-4">
                            {isAdmin ? (
                              <span
                                style={{ borderRadius: '6px' }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                              >
                                <Shield className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                <span>{'Admin'}</span>
                              </span>
                            ) : (
                              <span
                                style={{ borderRadius: '6px' }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                              >
                                <UserCheck className="w-3 h-3 text-slate-500" />
                                <span>{'Member'}</span>
                              </span>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3 px-4">
                            {isBanned ? (
                              <span
                                style={{ borderRadius: '6px' }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800"
                              >
                                <Ban className="w-3 h-3 text-rose-500" />
                                <span>{'BANNED'}</span>
                              </span>
                            ) : isActive ? (
                              <span
                                style={{ borderRadius: '6px' }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>{'Active'}</span>
                              </span>
                            ) : (
                              <span
                                style={{ borderRadius: '6px' }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                              >
                                <span>{'Pending'}</span>
                              </span>
                            )}
                          </td>

                          {/* Created Date */}
                          <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {formattedDate}
                          </td>

                          {/* Actions: View Detail & Ban/Unban Buttons */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Ban / Unban Button with explicit inline style */}
                              {isBanned ? (
                                <button
                                  type="button"
                                  onClick={() => setConfirmActionUser(item)}
                                  disabled={isProcessingThis}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 14px',
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    backgroundColor: '#16a34a',
                                    color: '#ffffff',
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: isProcessingThis ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.35)',
                                    opacity: isProcessingThis ? 0.6 : 1,
                                    transition: 'all 0.15s ease',
                                  }}
                                  title={'Unban this user'}
                                >
                                  {isProcessingThis ? (
                                    <RefreshCw className="w-3 h-3 animate-spin text-white" />
                                  ) : (
                                    <Unlock className="w-3 h-3 text-white" />
                                  )}
                                  <span style={{ color: '#ffffff' }}>{'Unban'}</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmActionUser(item)}
                                  disabled={isProcessingThis}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 14px',
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    backgroundColor: '#dc2626',
                                    color: '#ffffff',
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: isProcessingThis ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 2px 6px rgba(220, 38, 38, 0.35)',
                                    opacity: isProcessingThis ? 0.6 : 1,
                                    transition: 'all 0.15s ease',
                                  }}
                                  title={'Ban this user account'}
                                >
                                  {isProcessingThis ? (
                                    <RefreshCw className="w-3 h-3 animate-spin text-white" />
                                  ) : (
                                    <Ban className="w-3 h-3 text-white" />
                                  )}
                                  <span style={{ color: '#ffffff' }}>{'Ban'}</span>
                                </button>
                              )}

                              {/* View Detail Button */}
                              <button
                                type="button"
                                onClick={() => setSelectedUser(item)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '6px',
                                  backgroundColor: '#f1f5f9',
                                  color: '#334155',
                                  border: '1px solid #cbd5e1',
                                  cursor: 'pointer',
                                }}
                                title={'View User Details'}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div>
                {'Showing '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {filteredUsers.length > 0 ? (page - 1) * limit + 1 : 0}
                </strong>{' '}
                -{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {Math.min(page * limit, meta.total || filteredUsers.length)}
                </strong>{' '}
                {'of '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {meta.total || filteredUsers.length}
                </strong>{' '}
                {'users'}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1 || isLoading}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  style={{
                    borderRadius: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#334155',
                    cursor: page <= 1 ? 'not-allowed' : 'pointer',
                    opacity: page <= 1 ? 0.4 : 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600,
                  }}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>{'Previous'}</span>
                </button>

                <div className="px-3 py-1.5 font-bold text-slate-800 dark:text-slate-200">
                  {'Page'} {page} / {totalPages}
                </div>

                <button
                  type="button"
                  disabled={page >= totalPages || isLoading}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  style={{
                    borderRadius: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#334155',
                    cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                    opacity: page >= totalPages ? 0.4 : 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600,
                  }}
                >
                  <span>{'Next'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Modal for Ban / Unban */}
      {confirmActionUser && (
        <div
          translate="no"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          className="notranslate"
          onClick={() => setConfirmActionUser(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '460px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              position: 'relative',
            }}
            className="dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 animate-in fade-in-0 zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const isBanned = (confirmActionUser.status || '').toLowerCase() === 'banned' || (confirmActionUser.status || '').toLowerCase() === 'locked';
              const userName = confirmActionUser.title || confirmActionUser.name || `User #${confirmActionUser.id}`;

              return (
                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      style={{
                        borderRadius: '50%',
                        width: '44px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isBanned ? '#dcfce7' : '#fee2e2',
                        color: isBanned ? '#16a34a' : '#dc2626',
                        flexShrink: 0,
                      }}
                    >
                      {isBanned ? <Unlock className="w-6 h-6" /> : <Ban className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {isBanned ? ('Confirm Account Unban') : ('Confirm Account Ban')}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {isBanned
                          ? (`Are you sure you want to unban ${userName}? The user will regain normal login and purchasing privileges.`)
                          : (`Are you sure you want to ban ${userName}? When banned, this user will be immediately blocked from logging in.`)}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-1 font-mono">
                    <div className="text-slate-500">{'API Endpoint:'} <span className="text-indigo-600 dark:text-indigo-400 font-bold">PUT /api/v1/admin/users/{confirmActionUser.id}/ban</span></div>
                    <div className="text-slate-500">{'User:'} <span className="text-slate-800 dark:text-slate-200 font-sans font-semibold">{userName}</span></div>
                    <div className="text-slate-500">{'Email:'} <span className="text-slate-800 dark:text-slate-200 font-sans">{confirmActionUser.email || 'N/A'}</span></div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setConfirmActionUser(null)}
                      style={{
                        padding: '9px 18px',
                        fontSize: '12px',
                        fontWeight: 700,
                        backgroundColor: '#f1f5f9',
                        color: '#334155',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s',
                      }}
                    >
                      {'Cancel'}
                    </button>
                    <button
                      type="button"
                      disabled={banningUserId === confirmActionUser.id}
                      onClick={() => handleToggleBanUser(confirmActionUser)}
                      style={{
                        padding: '9px 18px',
                        fontSize: '12px',
                        fontWeight: 800,
                        backgroundColor: isBanned ? '#16a34a' : '#dc2626',
                        color: '#ffffff',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: isBanned ? '0 4px 10px rgba(22, 163, 74, 0.35)' : '0 4px 10px rgba(220, 38, 38, 0.35)',
                      }}
                    >
                      {banningUserId === confirmActionUser.id && (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                      )}
                      <span style={{ color: '#ffffff' }}>
                        {isBanned ? ('Confirm Unban') : ('Confirm Ban')}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          translate="no"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          className="notranslate"
          onClick={() => setSelectedUser(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              position: 'relative',
            }}
            className="dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 animate-in fade-in-0 zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const isBanned = (selectedUser.status || '').toLowerCase() === 'banned' || (selectedUser.status || '').toLowerCase() === 'locked';

              return (
                <>
                  <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black text-sm flex items-center justify-center uppercase">
                        {(selectedUser.title || selectedUser.name || 'U').charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {selectedUser.title || selectedUser.name || `User #${selectedUser.id}`}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono">ID: {String(selectedUser.id)}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedUser(null)}
                      style={{
                        borderRadius: '6px',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f1f5f9',
                        color: '#64748b',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="py-4 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Email:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {selectedUser.email || 'user_' + selectedUser.id + '@fanhub.com'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">{'Role:'}</span>
                        <span className="font-bold uppercase text-indigo-600 dark:text-indigo-400">
                          {selectedUser.role || 'registered'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">{'Status:'}</span>
                        <span className={`font-bold ${isBanned ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {isBanned ? ('BANNED') : ((selectedUser.status || 'Active'))}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">{'Joined Date:'}</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {new Date(selectedUser.createdAt || '2026-09-25').toLocaleDateString('en-US')}
                        </span>
                      </div>
                    </div>

                    {/* Raw Payload Preview from API */}
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        {'Raw Backend API Payload (JSON):'}
                      </span>
                      <pre className="p-3 bg-slate-900 text-sky-300 font-mono text-[11px] rounded-lg overflow-x-auto max-h-[150px]">
                        {JSON.stringify(selectedUser, null, 2)}
                      </pre>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    {/* Ban / Unban Trigger Button inside Detail Modal */}
                    <div>
                      {isBanned ? (
                        <button
                          type="button"
                          onClick={() => setConfirmActionUser(selectedUser)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 14px',
                            fontSize: '11px',
                            fontWeight: 800,
                            backgroundColor: '#16a34a',
                            color: '#ffffff',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(22, 163, 74, 0.35)',
                          }}
                        >
                          <Unlock className="w-3.5 h-3.5 text-white" />
                          <span style={{ color: '#ffffff' }}>{'Unban this user'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmActionUser(selectedUser)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 14px',
                            fontSize: '11px',
                            fontWeight: 800,
                            backgroundColor: '#dc2626',
                            color: '#ffffff',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.35)',
                          }}
                        >
                          <Ban className="w-3.5 h-3.5 text-white" />
                          <span style={{ color: '#ffffff' }}>{'Ban this user'}</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedUser(null)}
                      style={{
                        padding: '7px 16px',
                        fontSize: '12px',
                        fontWeight: 700,
                        backgroundColor: '#f1f5f9',
                        color: '#334155',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        cursor: 'pointer',
                      }}
                    >
                      {'Close'}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
