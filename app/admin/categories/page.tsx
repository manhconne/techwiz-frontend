'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import { getAccessToken } from '../../../utils/authUtils';
import {
  FolderTree,
  Folder,
  FolderOpen,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Check,
  X,
  Copy,
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronDown,
  Layers,
  Sparkles,
  Link as LinkIcon,
  BarChart3,
  Calendar,
  FileText,
  Tag,
  ArrowRight,
  List,
} from 'lucide-react';

export interface CategoryChild {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  stats?: {
    events_count?: number;
    posts_count?: number;
  };
}

export interface AdminCategoryItem {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  children?: CategoryChild[];
  stats?: {
    events_count?: number;
    posts_count?: number;
  };
  [key: string]: any;
}

export interface CategoryDetail extends AdminCategoryItem {
  stats: {
    events_count: number;
    posts_count: number;
  };
}

// Fallback demo data to showcase the UI if backend is offline
const FALLBACK_CATEGORIES: AdminCategoryItem[] = [
  {
    id: 'cat_1',
    name: 'Gaming',
    slug: 'gaming',
    parent_id: null,
    stats: { events_count: 24, posts_count: 580 },
    children: [
      { id: 'cat_2', name: 'Esports', slug: 'esports', parent_id: 'cat_1', stats: { events_count: 12, posts_count: 340 } },
      { id: 'cat_3', name: 'PC & Console', slug: 'pc-console', parent_id: 'cat_1', stats: { events_count: 7, posts_count: 150 } },
      { id: 'cat_4', name: 'Mobile Games', slug: 'mobile-games', parent_id: 'cat_1', stats: { events_count: 5, posts_count: 90 } },
    ],
  },
  {
    id: 'cat_5',
    name: 'Âm Nhạc (K-POP)',
    slug: 'kpop-music',
    parent_id: null,
    stats: { events_count: 45, posts_count: 1250 },
    children: [
      { id: 'cat_6', name: 'Concerts & Tour', slug: 'concerts-tour', parent_id: 'cat_5', stats: { events_count: 28, posts_count: 720 } },
      { id: 'cat_7', name: 'Album & Merch', slug: 'album-merch', parent_id: 'cat_5', stats: { events_count: 10, posts_count: 310 } },
      { id: 'cat_8', name: 'Fan Meeting', slug: 'fan-meeting', parent_id: 'cat_5', stats: { events_count: 7, posts_count: 220 } },
    ],
  },
  {
    id: 'cat_9',
    name: 'Anime & Manga',
    slug: 'anime-manga',
    parent_id: null,
    stats: { events_count: 18, posts_count: 420 },
    children: [
      { id: 'cat_10', name: 'Review Anime', slug: 'review-anime', parent_id: 'cat_9', stats: { events_count: 8, posts_count: 260 } },
      { id: 'cat_11', name: 'Cosplay Festival', slug: 'cosplay-festival', parent_id: 'cat_9', stats: { events_count: 10, posts_count: 160 } },
    ],
  },
  {
    id: 'cat_12',
    name: 'Công Nghệ & AI',
    slug: 'tech-ai',
    parent_id: null,
    stats: { events_count: 9, posts_count: 180 },
    children: [],
  },
];

// Helper to generate slug from name
const generateSlug = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export default function AdminCategoriesPage() {
  const { language } = useAdminLanguage();
  const isVi = language === 'vi';

  // Responsive sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  // API State
  const [categories, setCategories] = useState<AdminCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnectionError, setIsConnectionError] = useState(false);

  // Filters & View state
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree');
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    cat_1: true,
    cat_5: true,
    cat_9: true,
  });

  // 1. DETAIL MODAL STATE: GET /api/v1/admin/categories/{id}
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<CategoryDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // 2. CREATE MODAL STATE: POST /api/v1/admin/categories
  // Body: { "name": "Esports", "slug": "esports", "parent_id": "cat_1" }
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    slug: '',
    parent_id: '' as string,
  });
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

  // 3. EDIT MODAL STATE: PUT /api/v1/admin/categories/{id}
  // Body: { "name": "Esports 2026", "slug": "esports-2026", "parent_id": null }
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<AdminCategoryItem | CategoryChild | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    slug: '',
    parent_id: '' as string,
  });
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // 4. DELETE MODAL STATE: DELETE /api/v1/admin/categories/{id}
  const [deleteItem, setDeleteItem] = useState<{ id: string; name: string } | null>(null);
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

  // 1. FETCH CATEGORIES: GET /api/v1/admin/categories?include_children=true
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setIsConnectionError(false);

    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const response = await fetch('/api/v1/admin/categories?include_children=true', {
        method: 'GET',
        headers,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const resJson = await response.json();
      if (resJson && Array.isArray(resJson.data)) {
        setCategories(resJson.data);
      } else if (Array.isArray(resJson)) {
        setCategories(resJson);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      console.warn('API /api/v1/admin/categories offline. Loading interactive fallback categories:', err);
      setIsConnectionError(true);
      setCategories(FALLBACK_CATEGORIES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 2. FETCH DETAIL: GET /api/v1/admin/categories/{id}
  // Response: { "id": "cat_xxx", "name": "Esports", "slug": "esports", "parent_id": "cat_1", "stats": { "events_count": 12, "posts_count": 340 } }
  const handleOpenDetailModal = async (catId: string, fallbackCat?: any) => {
    setIsDetailModalOpen(true);
    setIsDetailLoading(true);
    setDetailItem(null);

    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`/api/v1/admin/categories/${encodeURIComponent(catId)}`, {
        method: 'GET',
        headers,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setDetailItem(data);
    } catch (err) {
      console.warn(`GET /api/v1/admin/categories/${catId} failed, using local item details:`, err);
      // Fallback detail
      setDetailItem({
        id: fallbackCat?.id || catId,
        name: fallbackCat?.name || 'Esports',
        slug: fallbackCat?.slug || 'esports',
        parent_id: fallbackCat?.parent_id || null,
        stats: fallbackCat?.stats || { events_count: 12, posts_count: 340 },
      });
    } finally {
      setIsDetailLoading(false);
    }
  };

  // 3. CREATE CATEGORY: POST /api/v1/admin/categories
  // Body: { "name": "Esports", "slug": "esports", "parent_id": "cat_1" }
  // Response 201: { "id": "cat_xxx", "message": "Đã tạo danh mục mới" }
  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim() || !createForm.slug.trim()) {
      setActionToast({
        type: 'error',
        message: isVi ? 'Vui lòng nhập đầy đủ tên và slug danh mục' : 'Please provide name and slug',
      });
      return;
    }

    setIsSubmittingCreate(true);

    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const payload = {
      name: createForm.name.trim(),
      slug: createForm.slug.trim(),
      parent_id: createForm.parent_id ? createForm.parent_id : null,
    };

    try {
      const res = await fetch('/api/v1/admin/categories', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(resData.message || `Lỗi API HTTP ${res.status}`);
      }

      const newId = resData.id || `cat_${Date.now().toString().slice(-4)}`;
      const successMsg = resData.message || (isVi ? 'Đã tạo danh mục mới' : 'Category created successfully');

      // Update local state
      if (!payload.parent_id) {
        // Root category
        const newCat: AdminCategoryItem = {
          id: newId,
          name: payload.name,
          slug: payload.slug,
          parent_id: null,
          children: [],
          stats: { events_count: 0, posts_count: 0 },
        };
        setCategories((prev) => [newCat, ...prev]);
      } else {
        // Child category
        const newChild: CategoryChild = {
          id: newId,
          name: payload.name,
          slug: payload.slug,
          parent_id: payload.parent_id,
          stats: { events_count: 0, posts_count: 0 },
        };
        setCategories((prev) =>
          prev.map((parent) => {
            if (parent.id === payload.parent_id) {
              return {
                ...parent,
                children: [...(parent.children || []), newChild],
              };
            }
            return parent;
          })
        );
        // Expand the parent
        setExpandedCats((prev) => ({ ...prev, [payload.parent_id as string]: true }));
      }

      setActionToast({
        type: 'success',
        message: successMsg,
        details: `ID: ${newId} · POST /api/v1/admin/categories (201)`,
      });

      setCreateForm({ name: '', slug: '', parent_id: '' });
      setIsCreateModalOpen(false);
    } catch (err: any) {
      // Offline fallback
      const newId = `cat_${Date.now().toString().slice(-4)}`;
      if (!payload.parent_id) {
        const newCat: AdminCategoryItem = {
          id: newId,
          name: payload.name,
          slug: payload.slug,
          parent_id: null,
          children: [],
          stats: { events_count: 0, posts_count: 0 },
        };
        setCategories((prev) => [newCat, ...prev]);
      } else {
        const newChild: CategoryChild = {
          id: newId,
          name: payload.name,
          slug: payload.slug,
          parent_id: payload.parent_id,
          stats: { events_count: 0, posts_count: 0 },
        };
        setCategories((prev) =>
          prev.map((parent) => {
            if (parent.id === payload.parent_id) {
              return {
                ...parent,
                children: [...(parent.children || []), newChild],
              };
            }
            return parent;
          })
        );
        setExpandedCats((prev) => ({ ...prev, [payload.parent_id as string]: true }));
      }

      setActionToast({
        type: 'warning',
        message: isVi ? 'Đã tạo danh mục trên giao diện (Offline mode)' : 'Category created locally [Offline]',
        details: `ID: ${newId}`,
      });

      setCreateForm({ name: '', slug: '', parent_id: '' });
      setIsCreateModalOpen(false);
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  // 4. EDIT CATEGORY: PUT /api/v1/admin/categories/{id}
  // Body: { "name": "Esports 2026", "slug": "esports-2026", "parent_id": null }
  // Response 200: { "message": "Đã cập nhật danh mục" }
  const handleOpenEditModal = (cat: AdminCategoryItem | CategoryChild) => {
    setEditItem(cat);
    setEditForm({
      name: cat.name,
      slug: cat.slug,
      parent_id: cat.parent_id || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    if (!editForm.name.trim() || !editForm.slug.trim()) {
      setActionToast({
        type: 'error',
        message: isVi ? 'Vui lòng nhập đầy đủ tên và slug danh mục' : 'Please provide name and slug',
      });
      return;
    }

    setIsSubmittingEdit(true);

    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const payload = {
      name: editForm.name.trim(),
      slug: editForm.slug.trim(),
      parent_id: editForm.parent_id ? editForm.parent_id : null,
    };

    try {
      const res = await fetch(`/api/v1/admin/categories/${encodeURIComponent(editItem.id)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(resData.message || `Lỗi API HTTP ${res.status}`);
      }

      const successMsg = resData.message || (isVi ? 'Đã cập nhật danh mục' : 'Category updated successfully');

      // Update state
      setCategories((prev) =>
        prev.map((root) => {
          if (root.id === editItem.id) {
            return { ...root, name: payload.name, slug: payload.slug, parent_id: payload.parent_id };
          }
          if (root.children && root.children.length > 0) {
            const updatedChildren = root.children.map((child) =>
              child.id === editItem.id
                ? { ...child, name: payload.name, slug: payload.slug, parent_id: payload.parent_id }
                : child
            );
            return { ...root, children: updatedChildren };
          }
          return root;
        })
      );

      if (detailItem && detailItem.id === editItem.id) {
        setDetailItem((prev) => (prev ? { ...prev, name: payload.name, slug: payload.slug, parent_id: payload.parent_id } : null));
      }

      setActionToast({
        type: 'success',
        message: successMsg,
        details: `PUT /api/v1/admin/categories/${editItem.id} (200)`,
      });

      setIsEditModalOpen(false);
    } catch (err: any) {
      // Local optimistic update
      setCategories((prev) =>
        prev.map((root) => {
          if (root.id === editItem.id) {
            return { ...root, name: payload.name, slug: payload.slug, parent_id: payload.parent_id };
          }
          if (root.children && root.children.length > 0) {
            const updatedChildren = root.children.map((child) =>
              child.id === editItem.id
                ? { ...child, name: payload.name, slug: payload.slug, parent_id: payload.parent_id }
                : child
            );
            return { ...root, children: updatedChildren };
          }
          return root;
        })
      );

      if (detailItem && detailItem.id === editItem.id) {
        setDetailItem((prev) => (prev ? { ...prev, name: payload.name, slug: payload.slug, parent_id: payload.parent_id } : null));
      }

      setActionToast({
        type: 'warning',
        message: isVi ? 'Đã cập nhật danh mục trên giao diện (Offline mode)' : 'Category updated locally [Offline]',
        details: `ID: ${editItem.id}`,
      });

      setIsEditModalOpen(false);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // 5. DELETE CATEGORY: DELETE /api/v1/admin/categories/{id}
  // Response 200: { "message": "Đã xóa danh mục thành công" }
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
      const res = await fetch(`/api/v1/admin/categories/${encodeURIComponent(deleteItem.id)}`, {
        method: 'DELETE',
        headers,
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(resData.message || `Lỗi API HTTP ${res.status}`);
      }

      const successMsg = resData.message || (isVi ? 'Đã xóa danh mục thành công' : 'Category deleted successfully');

      // Remove from state
      setCategories((prev) =>
        prev
          .filter((root) => root.id !== deleteItem.id)
          .map((root) => ({
            ...root,
            children: (root.children || []).filter((child) => child.id !== deleteItem.id),
          }))
      );

      if (detailItem && detailItem.id === deleteItem.id) {
        setIsDetailModalOpen(false);
      }

      setActionToast({
        type: 'success',
        message: successMsg,
        details: `DELETE /api/v1/admin/categories/${deleteItem.id} (200)`,
      });

      setDeleteItem(null);
    } catch (err: any) {
      // Local optimistic delete
      setCategories((prev) =>
        prev
          .filter((root) => root.id !== deleteItem.id)
          .map((root) => ({
            ...root,
            children: (root.children || []).filter((child) => child.id !== deleteItem.id),
          }))
      );

      if (detailItem && detailItem.id === deleteItem.id) {
        setIsDetailModalOpen(false);
      }

      setActionToast({
        type: 'warning',
        message: isVi ? 'Đã xóa danh mục trên giao diện (Offline mode)' : 'Category removed locally [Offline]',
        details: `ID: ${deleteItem.id}`,
      });

      setDeleteItem(null);
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  // Toggle tree expansion
  const toggleExpand = (catId: string) => {
    setExpandedCats((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  // Copy helper
  const handleCopyId = (id: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    const term = (searchQuery || headerSearch).toLowerCase().trim();
    if (!term) return categories;

    return categories
      .map((root) => {
        const rootMatch = root.name.toLowerCase().includes(term) || root.slug.toLowerCase().includes(term) || root.id.toLowerCase().includes(term);
        const matchingChildren = (root.children || []).filter(
          (child) => child.name.toLowerCase().includes(term) || child.slug.toLowerCase().includes(term) || child.id.toLowerCase().includes(term)
        );
        if (rootMatch) return root;
        if (matchingChildren.length > 0) return { ...root, children: matchingChildren };
        return null;
      })
      .filter(Boolean) as AdminCategoryItem[];
  }, [categories, searchQuery, headerSearch]);

  // Flattened for flat table view
  const flattenedCategories = useMemo(() => {
    const list: Array<{ item: AdminCategoryItem | CategoryChild; isChild: boolean; parentName?: string }> = [];
    filteredCategories.forEach((root) => {
      list.push({ item: root, isChild: false });
      (root.children || []).forEach((child) => {
        list.push({ item: child, isChild: true, parentName: root.name });
      });
    });
    return list;
  }, [filteredCategories]);

  // Metrics
  const totalRoot = categories.length;
  const totalChildren = categories.reduce((sum, c) => sum + (c.children?.length || 0), 0);
  const totalAll = totalRoot + totalChildren;
  const totalEvents = categories.reduce(
    (sum, c) => sum + (c.stats?.events_count || 0) + (c.children || []).reduce((cs, ch) => cs + (ch.stats?.events_count || 0), 0),
    0
  );
  const totalPosts = categories.reduce(
    (sum, c) => sum + (c.stats?.posts_count || 0) + (c.children || []).reduce((cs, ch) => cs + (ch.stats?.posts_count || 0), 0),
    0
  );

  return (
    <div
      translate="no"
      className="notranslate min-h-screen bg-slate-900 text-slate-100 font-sans flex"
    >
      {/* Admin Sidebar */}
      <AdminSidebar
        activeTab="categories"
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
          activeTab="categories"
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
                <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <FolderTree className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    {isVi ? 'Quản Lý Danh Mục (Categories)' : 'Category Management'}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                      /api/v1/admin/categories
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isVi
                      ? 'Cấu trúc cây phân cấp danh mục cha - con (include_children=true), thống kê sự kiện và bài viết.'
                      : 'Hierarchical category tree with subcategories and linked content statistics.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              {/* + Create New Category */}
              <button
                onClick={() => {
                  setCreateForm({ name: '', slug: '', parent_id: '' });
                  setIsCreateModalOpen(true);
                }}
                style={{ borderRadius: '8px' }}
                className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isVi ? 'Thêm danh mục mới' : 'Add Category'}</span>
              </button>

              {/* Refresh Button */}
              <button
                onClick={fetchCategories}
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
                <span>{isVi ? 'Tổng số danh mục' : 'Total Categories'}</span>
                <Layers className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white">{totalAll}</div>
              <div className="text-[11px] text-slate-400 mt-1">Gốc: {totalRoot} · Con: {totalChildren}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-indigo-500/30 backdrop-blur-sm">
              <div className="flex items-center justify-between text-indigo-400 text-xs font-semibold mb-2">
                <span>{isVi ? 'Danh mục cha (Root)' : 'Root Categories'}</span>
                <Folder className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-indigo-300">{totalRoot}</div>
              <div className="text-[11px] text-indigo-400/80 mt-1">parent_id: null</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-violet-500/30 backdrop-blur-sm">
              <div className="flex items-center justify-between text-violet-400 text-xs font-semibold mb-2">
                <span>{isVi ? 'Sự kiện liên kết' : 'Linked Events'}</span>
                <Calendar className="w-4 h-4 text-violet-400" />
              </div>
              <div className="text-2xl font-black text-violet-300">{totalEvents}</div>
              <div className="text-[11px] text-violet-400/80 mt-1">stats.events_count</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-emerald-500/30 backdrop-blur-sm">
              <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold mb-2">
                <span>{isVi ? 'Bài viết liên kết' : 'Linked Posts'}</span>
                <FileText className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-300">{totalPosts}</div>
              <div className="text-[11px] text-emerald-400/80 mt-1">stats.posts_count</div>
            </div>
          </div>

          {/* Search & View Controls */}
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
                      ? 'Tìm kiếm theo tên danh mục, đường dẫn slug (gaming, esports)...'
                      : 'Search by category name, slug...'
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

              {/* View Switch */}
              <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-700/80 shrink-0">
                <button
                  onClick={() => setViewMode('tree')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'tree' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Xem dạng cây phân cấp (Tree View)"
                >
                  <FolderTree className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Cây phân cấp' : 'Tree View'}</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Xem bảng phẳng (Flat Table)"
                >
                  <List className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Bảng danh sách' : 'Table View'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Views */}
          {isLoading ? (
            <div className="p-12 text-center bg-slate-800/40 rounded-xl border border-slate-700/60">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300">
                {isVi ? 'Đang tải danh mục từ /api/v1/admin/categories...' : 'Loading categories...'}
              </p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-12 text-center bg-slate-800/40 rounded-xl border border-slate-700/60">
              <FolderTree className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">
                {isVi ? 'Không tìm thấy danh mục nào' : 'No categories found'}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                {isVi ? 'Chưa có danh mục nào phù hợp với từ khóa tìm kiếm.' : 'No categories match the current filter.'}
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                {isVi ? 'Xóa tìm kiếm' : 'Clear Search'}
              </button>
            </div>
          ) : viewMode === 'tree' ? (
            /* 1. TREE HIERARCHY VIEW */
            <div className="space-y-3">
              {filteredCategories.map((root) => {
                const isExpanded = !!expandedCats[root.id];
                const hasChildren = root.children && root.children.length > 0;

                return (
                  <div
                    key={root.id}
                    className="rounded-xl border border-slate-700/80 bg-slate-800/50 backdrop-blur-sm overflow-hidden"
                  >
                    {/* Root Category Row */}
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-700/30 transition-colors">
                      <div className="flex items-center gap-3">
                        {/* Expand/Collapse Toggle */}
                        <button
                          onClick={() => toggleExpand(root.id)}
                          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer ${
                            !hasChildren ? 'opacity-30 pointer-events-none' : ''
                          }`}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>

                        <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                          {isExpanded ? <FolderOpen className="w-5 h-5" /> : <Folder className="w-5 h-5" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{root.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                              /{root.slug}
                            </span>
                            <span className="text-[10px] font-mono text-indigo-400">ID: {root.id}</span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                            <span>
                              {hasChildren ? `${root.children?.length} danh mục con` : 'Chưa có danh mục con'}
                            </span>
                            {root.stats && (
                              <span className="text-slate-500">
                                · {root.stats.events_count || 0} sự kiện · {root.stats.posts_count || 0} bài viết
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Root Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {/* Add child button */}
                        <button
                          onClick={() => {
                            setCreateForm({ name: '', slug: '', parent_id: root.id });
                            setIsCreateModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Thêm danh mục con"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isVi ? 'Thêm danh mục con' : 'Add Sub'}</span>
                        </button>

                        {/* View details */}
                        <button
                          onClick={() => handleOpenDetailModal(root.id, root)}
                          className="p-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
                          title="Xem chi tiết (GET /{id})"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEditModal(root)}
                          className="p-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white transition-colors cursor-pointer"
                          title="Chỉnh sửa (PUT /{id})"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteItem({ id: root.id, name: root.name })}
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                          title="Xóa danh mục (DELETE /{id})"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Children List */}
                    {isExpanded && hasChildren && (
                      <div className="border-t border-slate-800 bg-slate-900/60 divide-y divide-slate-800/80 pl-6 sm:pl-12">
                        {root.children?.map((child) => (
                          <div
                            key={child.id}
                            className="p-3.5 pr-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-slate-600 font-mono">└─</span>
                              <div className="p-1.5 rounded-md bg-slate-800 text-violet-400 border border-slate-700">
                                <Tag className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-100 text-xs">{child.name}</span>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                                    /{child.slug}
                                  </span>
                                  <span className="text-[10px] font-mono text-indigo-400">ID: {child.id}</span>
                                </div>
                                {child.stats && (
                                  <div className="text-[11px] text-slate-400 mt-0.5">
                                    {child.stats.events_count || 0} sự kiện · {child.stats.posts_count || 0} bài viết
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <button
                                onClick={() => handleOpenDetailModal(child.id, child)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenEditModal(child)}
                                className="p-1.5 rounded-lg bg-indigo-600/70 hover:bg-indigo-600 text-white transition-colors cursor-pointer"
                                title="Chỉnh sửa (PUT /{id})"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteItem({ id: child.id, name: child.name })}
                                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                                title="Xóa danh mục con"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* 2. FLAT TABLE VIEW */
            <div className="overflow-x-auto rounded-xl border border-slate-700/70 bg-slate-800/40 backdrop-blur-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/80 bg-slate-900/60 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Mã ID</th>
                    <th className="py-3 px-4">{isVi ? 'Tên danh mục' : 'Category Name'}</th>
                    <th className="py-3 px-4">{isVi ? 'Đường dẫn (Slug)' : 'Slug'}</th>
                    <th className="py-3 px-4">{isVi ? 'Cấp bậc (Hierarchy)' : 'Level'}</th>
                    <th className="py-3 px-4">{isVi ? 'Thống kê (Events/Posts)' : 'Stats'}</th>
                    <th className="py-3 px-4 text-right">{isVi ? 'Thao tác' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {flattenedCategories.map(({ item, isChild, parentName }) => (
                    <tr key={item.id} className="hover:bg-slate-700/30 transition-colors group">
                      {/* ID with Copy */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-indigo-400 font-bold">
                          <span>{item.id}</span>
                          <button
                            onClick={() => handleCopyId(item.id)}
                            className="text-slate-500 hover:text-indigo-300 p-1 rounded transition-colors cursor-pointer"
                            title="Sao chép ID"
                          >
                            {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className={`flex items-center gap-2 ${isChild ? 'pl-4' : ''}`}>
                          {isChild ? (
                            <span className="text-slate-600 font-mono">└─</span>
                          ) : (
                            <Folder className="w-4 h-4 text-indigo-400" />
                          )}
                          <span className={`font-bold ${isChild ? 'text-slate-200' : 'text-white'}`}>{item.name}</span>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          /{item.slug}
                        </span>
                      </td>

                      {/* Hierarchy level */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isChild ? (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                            <span>Con của {parentName}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                            <span>Danh mục gốc (Root)</span>
                          </span>
                        )}
                      </td>

                      {/* Stats */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                        {item.stats ? (
                          <span>{item.stats.events_count || 0} events · {item.stats.posts_count || 0} posts</span>
                        ) : (
                          <span>0 events · 0 posts</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDetailModal(item.id, item)}
                            className="p-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white transition-colors cursor-pointer"
                            title="Chỉnh sửa"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteItem({ id: item.id, name: item.name })}
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                            title="Xóa danh mục"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* 1. DETAIL MODAL (GET /api/v1/admin/categories/{id}) */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">
                  {isVi ? 'Chi Tiết Danh Mục (GET /{id})' : 'Category Details'}
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
              {isDetailLoading ? (
                <div className="py-12 text-center">
                  <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-2" />
                  <p className="text-slate-400">Đang tải dữ liệu từ GET /categories/{'{id}'}...</p>
                </div>
              ) : detailItem ? (
                <>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/70 border border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono">ID:</span>
                      <span className="text-indigo-400 font-bold font-mono">{detailItem.id}</span>
                    </div>
                    {detailItem.parent_id ? (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-semibold border border-violet-500/30">
                        Parent: {detailItem.parent_id}
                      </span>
                    ) : (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                        Danh mục gốc (Root)
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="text-slate-400 font-semibold mb-1">{isVi ? 'Tên danh mục:' : 'Name:'}</div>
                      <div className="text-white font-bold text-sm">{detailItem.name}</div>
                    </div>

                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="text-slate-400 font-semibold mb-1">{isVi ? 'Đường dẫn (slug):' : 'Slug:'}</div>
                      <div className="text-indigo-300 font-mono font-bold">/{detailItem.slug}</div>
                    </div>
                  </div>

                  {/* Stats Object: { "events_count": 12, "posts_count": 340 } */}
                  <div>
                    <label className="text-slate-400 font-semibold block mb-2">
                      {isVi ? 'Thống kê nội dung liên kết (stats):' : 'Linked Content Stats:'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-xl bg-slate-800/80 border border-violet-500/30 flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-violet-500/20 text-violet-300">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xl font-black text-white">{detailItem.stats?.events_count || 0}</div>
                          <div className="text-[11px] text-violet-400">events_count</div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-800/80 border border-emerald-500/30 flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xl font-black text-white">{detailItem.stats?.posts_count || 0}</div>
                          <div className="text-[11px] text-emerald-400">posts_count</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-slate-400">Không tìm thấy thông tin danh mục.</div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-800/60 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors"
              >
                {isVi ? 'Đóng' : 'Close'}
              </button>

              {detailItem && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleOpenEditModal(detailItem);
                    }}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Chỉnh sửa' : 'Edit'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. CREATE MODAL (POST /api/v1/admin/categories) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">
                  {isVi ? 'Thêm Danh Mục Mới (POST)' : 'Create Category'}
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCreate} className="p-6 space-y-4 text-xs">
              {/* Name */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  {isVi ? 'Tên danh mục (name) *' : 'Category Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setCreateForm({
                      ...createForm,
                      name: newName,
                      slug: generateSlug(newName),
                    });
                  }}
                  placeholder="Ví dụ: Esports, Review, Âm nhạc..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  {isVi ? 'Đường dẫn định danh (slug) *' : 'Slug *'}
                </label>
                <input
                  type="text"
                  required
                  value={createForm.slug}
                  onChange={(e) => setCreateForm({ ...createForm, slug: e.target.value })}
                  placeholder="esports"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Tự động sinh từ tên danh mục</span>
              </div>

              {/* Parent Category */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  {isVi ? 'Danh mục cha (parent_id)' : 'Parent Category'}
                </label>
                <select
                  value={createForm.parent_id}
                  onChange={(e) => setCreateForm({ ...createForm, parent_id: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="">{isVi ? 'Không có (Danh mục gốc - Root Category)' : 'None (Root Category)'}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id})
                    </option>
                  ))}
                </select>
              </div>

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
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  {isSubmittingCreate && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isVi ? 'Tạo danh mục' : 'Submit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. EDIT MODAL (PUT /api/v1/admin/categories/{id}) */}
      {isEditModalOpen && editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">
                  {isVi ? 'Chỉnh Sửa Danh Mục (PUT /{id})' : 'Edit Category'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 flex items-center justify-between">
                <span className="text-slate-400 font-mono">Category ID:</span>
                <span className="text-indigo-400 font-bold font-mono">{editItem.id}</span>
              </div>

              {/* Name */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  {isVi ? 'Tên danh mục (name) *' : 'Category Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Esports 2026..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  {isVi ? 'Đường dẫn định danh (slug) *' : 'Slug *'}
                </label>
                <input
                  type="text"
                  required
                  value={editForm.slug}
                  onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                  placeholder="esports-2026"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Parent Category */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  {isVi ? 'Danh mục cha (parent_id)' : 'Parent Category'}
                </label>
                <select
                  value={editForm.parent_id}
                  onChange={(e) => setEditForm({ ...editForm, parent_id: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="">{isVi ? 'Không có (null - Danh mục gốc)' : 'null (Root Category)'}</option>
                  {categories
                    .filter((c) => c.id !== editItem.id) // Avoid self-parenting
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.id})
                      </option>
                    ))}
                </select>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors"
                >
                  {isVi ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  {isSubmittingEdit && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isVi ? 'Lưu cập nhật (PUT)' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. DELETE CONFIRMATION MODAL (DELETE /api/v1/admin/categories/{id}) */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-xs text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                {isVi ? 'Xác nhận xóa danh mục?' : 'Delete Category?'}
              </h3>
              <p className="text-slate-400 mt-1">
                {isVi
                  ? `Bạn có chắc chắn muốn xóa danh mục "${deleteItem.name}" (${deleteItem.id})? Các danh mục con hoặc nội dung liên quan có thể bị ảnh hưởng.`
                  : `Are you sure you want to delete category "${deleteItem.name}"?`}
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
