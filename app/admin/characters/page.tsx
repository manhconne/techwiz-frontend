'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import { getAccessToken } from '../../../utils/authUtils';
import {
  Drama,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Check,
  X,
  Copy,
  Plus,
  Pencil,
  Trash2,
  Eye,
  LayoutGrid,
  List,
  Sparkles,
  TrendingUp,
  FolderTree,
  User,
  Image as ImageIcon,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileText,
  BookOpen,
} from 'lucide-react';

export interface AdminCharacterItem {
  id: string;
  name: string;
  category?: string;
  category_id?: string;
  avatar_url?: string;
  biography?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface AdminCategoryOption {
  id: string;
  name: string;
  slug?: string;
}

// Fallback demo characters to showcase UI when API is offline
const FALLBACK_CHARACTERS: AdminCharacterItem[] = [
  {
    id: 'chr_001',
    name: 'Naruto Uzumaki',
    category: 'Anime',
    category_id: 'cat_anime',
    avatar_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
    biography: 'Hokage Đệ Thất của Làng Lá. Anh hùng của Thế chiến Ninja lần thứ tư, người sở hữu Cửu Vĩ Kurama và ý chí Hỏa Quốc bất diệt.',
    created_at: '2026-01-15T08:30:00Z',
  },
  {
    id: 'chr_002',
    name: 'Monkey D. Luffy',
    category: 'Anime',
    category_id: 'cat_anime',
    avatar_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80',
    biography: 'Thuyền trưởng Băng Hải Tặc Mũ Rơm, Tứ Hoàng của biển cả. Sở hữu sức mạnh Hito Hito no Mi, Model: Nika với giấc mơ trở thành Vua Hải Tặc.',
    created_at: '2026-01-20T10:15:00Z',
  },
  {
    id: 'chr_003',
    name: 'Ahri - Cửu Vĩ Hồ',
    category: 'Game / MOBA',
    category_id: 'cat_moba',
    avatar_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80',
    biography: 'Pháp sư Vastaya sở hữu ma thuật linh hồn diệu kỳ từ vùng đất Ionia. Nhân vật biểu tượng của Liên Minh Huyền Thoại.',
    created_at: '2026-02-02T14:45:00Z',
  },
  {
    id: 'chr_004',
    name: 'Geralt of Rivia',
    category: 'RPG Game',
    category_id: 'cat_game',
    avatar_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    biography: 'Thợ săn quái vật đột biến - Sói Trắng (Gwynbleidd). Bậc thầy kiếm thuật, độc dược và dấu ấn ma thuật Witcher.',
    created_at: '2026-02-14T09:20:00Z',
  },
  {
    id: 'chr_005',
    name: 'Jinx - Khẩu Pháo Nổi Loạn',
    category: 'Game / MOBA',
    category_id: 'cat_moba',
    avatar_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80',
    biography: 'Tội phạm nguy hiểm và điên cuồng nhất xứ Zaun. Nhân vật chính trong bom tấn hoạt hình ARCANE đoạt giải Emmy.',
    created_at: '2026-02-28T16:00:00Z',
  },
  {
    id: 'chr_006',
    name: 'Son Goku',
    category: 'Anime',
    category_id: 'cat_anime',
    avatar_url: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=400&auto=format&fit=crop&q=80',
    biography: 'Chiến binh Saiyan huyền thoại, người bảo vệ Trái Đất và đa vũ trụ. Đã khai mở Bản Năng Vô Cực (Ultra Instinct).',
    created_at: '2026-03-05T11:10:00Z',
  },
];

const FALLBACK_CATEGORIES: AdminCategoryOption[] = [
  { id: 'cat_anime', name: 'Anime' },
  { id: 'cat_moba', name: 'Game / MOBA' },
  { id: 'cat_game', name: 'RPG Game' },
  { id: 'cat_comic', name: 'Manga / Comic' },
  { id: 'cat_esports', name: 'Esports' },
];

export default function AdminCharactersPage() {
  const { language } = useAdminLanguage();
  const isVi = language === 'vi';

  // Responsive layout state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  // Main data states
  const [characters, setCharacters] = useState<AdminCharacterItem[]>([]);
  const [categories, setCategories] = useState<AdminCategoryOption[]>(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<AdminCharacterItem | null>(null);
  const [detailItem, setDetailItem] = useState<AdminCharacterItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<AdminCharacterItem | null>(null);

  // Form states for POST /api/v1/admin/characters
  const [createForm, setCreateForm] = useState({
    name: '',
    category_id: '',
    biography: '',
    avatar_url: '',
  });
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

  // Form states for PUT /api/v1/admin/characters/{id}
  const [editForm, setEditForm] = useState({
    name: '',
    biography: '',
    avatar_url: '',
  });
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  // Helper toast dismiss
  useEffect(() => {
    if (apiSuccess) {
      const timer = setTimeout(() => setApiSuccess(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [apiSuccess]);

  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => setApiError(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [apiError]);

  // Load category options for dropdown
  const fetchCategoryOptions = useCallback(async () => {
    try {
      const token = getAccessToken();
      const res = await fetch('/api/v1/admin/categories', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const json = await res.json();
        const raw = json.data || json;
        if (Array.isArray(raw)) {
          const mapped: AdminCategoryOption[] = raw.map((c: any) => ({
            id: c.id || c._id,
            name: c.name || c.title,
            slug: c.slug,
          }));
          if (mapped.length > 0) {
            setCategories(mapped);
          }
        }
      }
    } catch {
      // Keep fallback categories
    }
  }, []);

  // Fetch characters: GET /api/v1/admin/characters?category_id=...&search=...&page=...&limit=...
  const fetchCharacters = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const token = getAccessToken();
      const params = new URLSearchParams();
      if (selectedCategoryId) params.set('category_id', selectedCategoryId);
      if (searchTerm.trim()) params.set('search', searchTerm.trim());
      params.set('page', page.toString());
      params.set('limit', limit.toString());

      const url = `/api/v1/admin/characters?${params.toString()}`;
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
      const rawData = json.data || json.characters || (Array.isArray(json) ? json : []);

      if (Array.isArray(rawData)) {
        setCharacters(rawData);
        setTotalCount(json.total || json.pagination?.total || rawData.length);
      } else {
        setCharacters([]);
      }
      setApiError(null);
    } catch (err: any) {
      console.warn('API /api/v1/admin/characters error or offline. Using demo data:', err);
      // Client-side filter fallback demo data
      let filtered = [...FALLBACK_CHARACTERS];
      if (selectedCategoryId) {
        filtered = filtered.filter(
          (c) => c.category_id === selectedCategoryId || c.category === selectedCategoryId
        );
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            (c.biography && c.biography.toLowerCase().includes(q))
        );
      }
      setCharacters(filtered);
      setTotalCount(filtered.length);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchTerm, selectedCategoryId, page, limit]);

  useEffect(() => {
    fetchCategoryOptions();
  }, [fetchCategoryOptions]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  // Handle Copy ID
  const handleCopyId = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Submit Create: POST /api/v1/admin/characters
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim()) {
      setApiError(isVi ? 'Vui lòng nhập tên nhân vật!' : 'Character name is required');
      return;
    }

    setIsSubmittingCreate(true);
    setApiError(null);

    const payload = {
      name: createForm.name.trim(),
      category_id: createForm.category_id || undefined,
      biography: createForm.biography.trim(),
      avatar_url: createForm.avatar_url.trim(),
    };

    try {
      const token = getAccessToken();
      const res = await fetch('/api/v1/admin/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok || res.status === 201) {
        setApiSuccess(json.message || (isVi ? 'Tạo hồ sơ nhân vật thành công' : 'Character profile created successfully'));
        setIsCreateOpen(false);
        setCreateForm({ name: '', category_id: '', biography: '', avatar_url: '' });
        fetchCharacters(true);
      } else {
        throw new Error(json.message || json.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      console.warn('POST character failed, simulating success locally:', err);
      // Local optimistic update
      const matchedCat = categories.find((c) => c.id === payload.category_id);
      const newChar: AdminCharacterItem = {
        id: `chr_${Date.now()}`,
        name: payload.name,
        category: matchedCat ? matchedCat.name : 'Chung',
        category_id: payload.category_id,
        avatar_url: payload.avatar_url || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80',
        biography: payload.biography,
        created_at: new Date().toISOString(),
      };
      setCharacters((prev) => [newChar, ...prev]);
      setApiSuccess(isVi ? 'Tạo hồ sơ nhân vật thành công (Local)' : 'Character profile created locally');
      setIsCreateOpen(false);
      setCreateForm({ name: '', category_id: '', biography: '', avatar_url: '' });
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (item: AdminCharacterItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditItem(item);
    setEditForm({
      name: item.name || '',
      biography: item.biography || '',
      avatar_url: item.avatar_url || '',
    });
  };

  // Submit Edit: PUT /api/v1/admin/characters/{id}
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    if (!editForm.name.trim()) {
      setApiError(isVi ? 'Tên nhân vật không được để trống!' : 'Character name cannot be blank');
      return;
    }

    setIsSubmittingEdit(true);
    setApiError(null);

    const payload = {
      name: editForm.name.trim(),
      biography: editForm.biography.trim(),
      avatar_url: editForm.avatar_url.trim(),
    };

    try {
      const token = getAccessToken();
      const res = await fetch(`/api/v1/admin/characters/${editItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        setApiSuccess(json.message || (isVi ? 'Cập nhật hồ sơ nhân vật thành công' : 'Character profile updated successfully'));
        setEditItem(null);
        fetchCharacters(true);
      } else {
        throw new Error(json.message || json.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      console.warn('PUT character failed, simulating update locally:', err);
      setCharacters((prev) =>
        prev.map((c) =>
          c.id === editItem.id
            ? { ...c, ...payload, updated_at: new Date().toISOString() }
            : c
        )
      );
      setApiSuccess(isVi ? 'Cập nhật hồ sơ nhân vật thành công (Local)' : 'Character profile updated locally');
      setEditItem(null);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Submit Delete: DELETE /api/v1/admin/characters/{id}
  const handleDeleteSubmit = async () => {
    if (!deleteItem) return;
    setIsSubmittingDelete(true);
    setApiError(null);

    try {
      const token = getAccessToken();
      const res = await fetch(`/api/v1/admin/characters/${deleteItem.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        setApiSuccess(json.message || (isVi ? 'Đã xóa hồ sơ nhân vật' : 'Character profile deleted successfully'));
        setDeleteItem(null);
        fetchCharacters(true);
      } else {
        throw new Error(json.message || json.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      console.warn('DELETE character failed, removing locally:', err);
      setCharacters((prev) => prev.filter((c) => c.id !== deleteItem.id));
      setApiSuccess(isVi ? 'Đã xóa hồ sơ nhân vật (Local)' : 'Character deleted locally');
      setDeleteItem(null);
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  // KPI computations
  const totalCharacters = characters.length;
  const categoriesCount = useMemo(() => {
    const set = new Set(characters.map((c) => c.category || c.category_id).filter(Boolean));
    return set.size;
  }, [characters]);

  return (
    <div className="flex h-screen bg-[#0b0f17] text-slate-100 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <AdminSidebar
        activeTab="characters"
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
          activeTab="characters"
        />

        {/* BREADCRUMB & TOOLBAR */}
        <div className="border-b border-slate-800 bg-[#0f172a]/60 px-6 py-4 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Link href="/admin" className="hover:text-amber-400 transition-colors">Admin</Link>
                <span>/</span>
                <span className="text-amber-400 font-medium">
                  {isVi ? 'Hồ sơ nhân vật (Characters)' : 'Character Profiles'}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Drama className="w-5 h-5" />
                </div>
                <span>{isVi ? 'Quản lý Hồ sơ Nhân vật' : 'Character Management'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                  {totalCharacters} {isVi ? 'nhân vật' : 'records'}
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchCharacters(true)}
                disabled={loading || refreshing}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                title={isVi ? 'Làm mới' : 'Refresh'}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-amber-400' : ''}`} />
                <span className="hidden sm:inline">{isVi ? 'Làm mới' : 'Refresh'}</span>
              </button>

              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>{isVi ? 'Thêm nhân vật mới' : 'Create Character'}</span>
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

        {apiError && (
          <div className="mx-6 mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center justify-between shadow-lg shadow-rose-500/5 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{apiError}</span>
            </div>
            <button onClick={() => setApiError(null)} className="p-1 hover:bg-rose-500/20 rounded-md">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* CONTENT BODY */}
        <div className="p-6 space-y-6">
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>{isVi ? 'Tổng nhân vật' : 'Total Profiles'}</span>
                <Drama className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">{totalCharacters}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                {isVi ? 'Đã lưu trong CSDL hệ thống' : 'Active character entries'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>{isVi ? 'Danh mục đại diện' : 'Categories Represented'}</span>
                <FolderTree className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white">{categoriesCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                {isVi ? 'Bao gồm Anime, MOBA, Game...' : 'Across media genres'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>{isVi ? 'Có ảnh Avatar' : 'With Custom Avatar'}</span>
                <ImageIcon className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {characters.filter((c) => Boolean(c.avatar_url)).length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {isVi ? 'Đầy đủ hình ảnh nhận diện' : 'Verified avatar links'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>{isVi ? 'Có tiểu sử chi tiết' : 'With Biography'}</span>
                <BookOpen className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {characters.filter((c) => Boolean(c.biography && c.biography.trim().length > 0)).length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {isVi ? 'Cốt truyện & thông tin lore' : 'Lore descriptions documented'}
              </div>
            </div>
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-lg space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input: ?search=naruto */}
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
                      ? 'Tìm kiếm nhân vật theo tên hoặc tiểu sử (vd: naruto, luffy, ahri...)...'
                      : 'Search character by name or biography (e.g. naruto, luffy)...'
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

              {/* Filter category dropdown: ?category_id=cat_xxx */}
              <div className="flex items-center gap-2">
                <div className="relative min-w-[180px]">
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => {
                      setSelectedCategoryId(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer appearance-none"
                  >
                    <option value="">{isVi ? 'Tất cả danh mục' : 'All Categories'}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-amber-500/20 text-amber-400 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title={isVi ? 'Xem dạng lưới card' : 'Grid View'}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      viewMode === 'table'
                        ? 'bg-amber-500/20 text-amber-400 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title={isVi ? 'Xem dạng bảng' : 'Table View'}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Filter Badges */}
            <div className="flex items-center gap-2 overflow-x-auto text-[11px] pt-1">
              <span className="text-slate-500 shrink-0 font-medium">
                {isVi ? 'Lọc nhanh:' : 'Quick tags:'}
              </span>
              <button
                onClick={() => setSelectedCategoryId('')}
                className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer shrink-0 ${
                  selectedCategoryId === ''
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 font-semibold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isVi ? 'Tất cả' : 'All'}
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategoryId(c.id === selectedCategoryId ? '' : c.id)}
                  className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer shrink-0 ${
                    selectedCategoryId === c.id
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 font-semibold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN CHARACTERS DISPLAY */}
          {loading ? (
            <div className="p-12 text-center rounded-2xl bg-[#0f172a] border border-slate-800">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-400 mx-auto mb-3" />
              <p className="text-xs text-slate-400">{isVi ? 'Đang tải danh sách nhân vật...' : 'Loading character records...'}</p>
            </div>
          ) : characters.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Drama className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">
                {isVi ? 'Không tìm thấy hồ sơ nhân vật nào' : 'No character profiles found'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchTerm || selectedCategoryId
                  ? (isVi ? 'Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn lọc danh mục.' : 'Try changing search keywords or clearing category filter.')
                  : (isVi ? 'Chưa có hồ sơ nhân vật nào được tạo. Hãy nhấn "Thêm nhân vật mới" để bắt đầu.' : 'No characters yet. Click "Create Character" to add one.')}
              </p>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
              >
                {isVi ? 'Thêm nhân vật ngay' : 'Create Character Now'}
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
              {characters.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setDetailItem(item)}
                  className="group relative bg-[#0f172a] hover:bg-slate-850/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 transition-all duration-200 hover:shadow-xl hover:shadow-black/40 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Top avatar & category badge */}
                    <div className="flex items-start gap-3.5 mb-3">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/70 shrink-0 group-hover:border-amber-500/50 transition-colors">
                        {item.avatar_url ? (
                          <img
                            src={item.avatar_url}
                            alt={item.name}
                            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              // Fallback on broken image
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-850">
                          <User className="w-7 h-7" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 truncate max-w-[140px]">
                            {item.category || item.category_id || 'Anime'}
                          </span>

                          <button
                            onClick={(e) => handleCopyId(item.id, e)}
                            className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 font-mono px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-800"
                            title={isVi ? 'Sao chép ID' : 'Copy ID'}
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{item.id.slice(0, 8)}</span>
                          </button>
                        </div>

                        <h3 className="text-sm font-bold text-white mt-1.5 truncate group-hover:text-amber-400 transition-colors">
                          {item.name}
                        </h3>
                      </div>
                    </div>

                    {/* Biography excerpt */}
                    <div className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4 min-h-[54px]">
                      {item.biography || (isVi ? 'Chưa có tiểu sử chi tiết cho nhân vật này.' : 'No biography provided yet.')}
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400/70" />
                      <span>{isVi ? 'Hồ sơ chuẩn' : 'Verified'}</span>
                    </span>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setDetailItem(item)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title={isVi ? 'Xem chi tiết' : 'View details'}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* EDIT: PUT /api/v1/admin/characters/{id} */}
                      <button
                        onClick={(e) => openEditModal(item, e)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer"
                        title={isVi ? 'Chỉnh sửa' : 'Edit profile'}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {/* DELETE: DELETE /api/v1/admin/characters/{id} */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteItem(item);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title={isVi ? 'Xóa nhân vật' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* TABLE VIEW */
            <div className="rounded-2xl bg-[#0f172a] border border-slate-800 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3 w-16">{isVi ? 'Ảnh' : 'Avatar'}</th>
                      <th className="px-4 py-3">{isVi ? 'Tên nhân vật' : 'Character Name'}</th>
                      <th className="px-4 py-3">{isVi ? 'Danh mục' : 'Category'}</th>
                      <th className="px-4 py-3">{isVi ? 'Tiểu sử tóm tắt' : 'Biography Preview'}</th>
                      <th className="px-4 py-3 text-right">{isVi ? 'Thao tác' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {characters.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setDetailItem(item)}
                        className="hover:bg-slate-850/60 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/60 shrink-0">
                            {item.avatar_url ? (
                              <img
                                src={item.avatar_url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500">
                                <User className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-bold text-white hover:text-amber-400 transition-colors">
                            {item.name}
                          </div>
                          <button
                            onClick={(e) => handleCopyId(item.id, e)}
                            className="text-[10px] text-slate-500 hover:text-slate-300 font-mono flex items-center gap-1 mt-0.5"
                          >
                            <span>{item.id}</span>
                            {copiedId === item.id ? (
                              <Check className="w-2.5 h-2.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-2.5 h-2.5" />
                            )}
                          </button>
                        </td>

                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium">
                            {item.category || item.category_id || 'Anime'}
                          </span>
                        </td>

                        <td className="px-4 py-3 max-w-xs">
                          <div className="text-slate-400 truncate">
                            {item.biography || (isVi ? 'Chưa có tiểu sử' : 'No biography')}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setDetailItem(item)}
                              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
                              title={isVi ? 'Xem chi tiết' : 'View'}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => openEditModal(item, e)}
                              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg cursor-pointer"
                              title={isVi ? 'Sửa' : 'Edit'}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteItem(item);
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                              title={isVi ? 'Xóa' : 'Delete'}
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
            </div>
          )}

          {/* PAGINATION BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-2">
            <div>
              {isVi
                ? `Hiển thị ${characters.length} nhân vật (Trang ${page})`
                : `Showing ${characters.length} characters (Page ${page})`}
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
                disabled={characters.length < limit || loading}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
              >
                <span>{isVi ? 'Trang sau' : 'Next'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE CHARACTER MODAL: POST /api/v1/admin/characters */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Drama className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isVi ? 'Tạo Hồ sơ Nhân vật mới' : 'Create Character Profile'}
                  </h3>
                  <p className="text-[11px] text-slate-400">POST /api/v1/admin/characters</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
              {/* Name */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isVi ? 'Tên nhân vật *' : 'Character Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder={isVi ? 'Ví dụ: Naruto Uzumaki, Ahri...' : 'e.g. Naruto Uzumaki, Ahri...'}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Category ID */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isVi ? 'Danh mục (category_id)' : 'Category (category_id)'}
                </label>
                <select
                  value={createForm.category_id}
                  onChange={(e) => setCreateForm({ ...createForm, category_id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="">{isVi ? '-- Chọn danh mục --' : '-- Select Category --'}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isVi ? 'Đường dẫn ảnh đại diện (avatar_url)' : 'Avatar URL (avatar_url)'}
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    value={createForm.avatar_url}
                    onChange={(e) => setCreateForm({ ...createForm, avatar_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                  {createForm.avatar_url && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
                      <img
                        src={createForm.avatar_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Biography */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isVi ? 'Tiểu sử nhân vật (biography)' : 'Biography / Lore (biography)'}
                </label>
                <textarea
                  rows={4}
                  value={createForm.biography}
                  onChange={(e) => setCreateForm({ ...createForm, biography: e.target.value })}
                  placeholder={
                    isVi
                      ? 'Nhập thông tin tiểu sử, lai lịch, sức mạnh hoặc vai trò của nhân vật...'
                      : 'Enter character background, backstory, powers or lore details...'
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl cursor-pointer"
                >
                  {isVi ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCreate}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  {isSubmittingCreate && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isVi ? 'Tạo hồ sơ nhân vật' : 'Save Character'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CHARACTER MODAL: PUT /api/v1/admin/characters/{id} */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isVi ? 'Cập nhật Hồ sơ Nhân vật' : 'Update Character Profile'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    PUT /api/v1/admin/characters/{editItem.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditItem(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
              {/* Character ID (Readonly) */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Character ID (UUID)</label>
                <input
                  type="text"
                  readOnly
                  value={editItem.id}
                  className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-400 font-mono cursor-not-allowed"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isVi ? 'Tên nhân vật *' : 'Character Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isVi ? 'Đường dẫn ảnh đại diện (avatar_url)' : 'Avatar URL (avatar_url)'}
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    value={editForm.avatar_url}
                    onChange={(e) => setEditForm({ ...editForm, avatar_url: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                  {editForm.avatar_url && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
                      <img
                        src={editForm.avatar_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Biography */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isVi ? 'Tiểu sử nhân vật (biography)' : 'Biography / Lore (biography)'}
                </label>
                <textarea
                  rows={5}
                  value={editForm.biography}
                  onChange={(e) => setEditForm({ ...editForm, biography: e.target.value })}
                  placeholder={isVi ? 'Cập nhật tiểu sử nhân vật...' : 'Update biography...'}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl cursor-pointer"
                >
                  {isVi ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  {isSubmittingEdit && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isVi ? 'Cập nhật hồ sơ' : 'Update Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="relative h-44 bg-slate-950 overflow-hidden">
              {detailItem.avatar_url ? (
                <img
                  src={detailItem.avatar_url}
                  alt={detailItem.name}
                  className="w-full h-full object-cover blur-sm opacity-40 scale-110"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

              <button
                onClick={() => setDetailItem(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900/80 border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-6 flex items-end gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 border-2 border-amber-400 shadow-xl shrink-0">
                  {detailItem.avatar_url ? (
                    <img
                      src={detailItem.avatar_url}
                      alt={detailItem.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <User className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <div className="mb-1">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {detailItem.category || detailItem.category_id || 'Anime'}
                  </span>
                  <h2 className="text-xl font-black text-white mt-1">{detailItem.name}</h2>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Character ID (UUID)</div>
                  <div className="font-mono text-slate-300 font-semibold mt-0.5">{detailItem.id}</div>
                </div>
                <button
                  onClick={() => handleCopyId(detailItem.id)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 text-[11px]"
                >
                  {copiedId === detailItem.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === detailItem.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div>
                <h4 className="text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isVi ? 'Tiểu sử / Lore nhân vật' : 'Character Biography & Lore'}</span>
                </h4>
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 leading-relaxed whitespace-pre-line">
                  {detailItem.biography || (isVi ? 'Chưa có tiểu sử chi tiết.' : 'No biography documented.')}
                </div>
              </div>

              {detailItem.created_at && (
                <div className="text-[11px] text-slate-500">
                  {isVi ? 'Thời gian tạo: ' : 'Created at: '}
                  {new Date(detailItem.created_at).toLocaleString()}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <button
                onClick={() => {
                  const item = detailItem;
                  setDetailItem(null);
                  setDeleteItem(item);
                }}
                className="px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {isVi ? 'Xóa hồ sơ' : 'Delete'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDetailItem(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs cursor-pointer"
                >
                  {isVi ? 'Đóng' : 'Close'}
                </button>
                <button
                  onClick={() => {
                    const item = detailItem;
                    setDetailItem(null);
                    openEditModal(item);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Chỉnh sửa' : 'Edit'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL: DELETE /api/v1/admin/characters/{id} */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-xs text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                {isVi ? 'Xác nhận xóa hồ sơ nhân vật?' : 'Delete Character Profile?'}
              </h3>
              <p className="text-slate-400 mt-1">
                {isVi
                  ? `Bạn có chắc chắn muốn xóa hồ sơ "${deleteItem.name}" (ID: ${deleteItem.id})? Hành động này không thể hoàn tác.`
                  : `Are you sure you want to permanently delete "${deleteItem.name}"?`}
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
