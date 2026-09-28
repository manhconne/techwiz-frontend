'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Heart,
  Bookmark,
  Clock,
  Sparkles,
  Camera,
  Edit3,
  Check,
  LogOut,
  ExternalLink,
  Flame,
  Star,
  Calendar,
  Disc,
  Radio,
  Share2,
  Tv,
  Bell,
  Trash2,
  FileText,
  User as UserIcon,
  Play,
  Award,
  ChevronRight,
  Shield,
  Layers,
  Settings,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { mockFeaturedArticles } from '../data/mockData';
import { INITIAL_MEDIA_ITEMS } from '../data/multimediaData';

interface PersonalDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
];

const ALL_FANDOM_OPTIONS = [
  { id: 'bunnies', name: 'Bunnies (NewJeans)', tag: 'K-Pop', color: '#ff2e93' },
  { id: 'blink', name: 'BLINK (BLACKPINK)', tag: 'K-Pop', color: '#ec4899' },
  { id: 'army', name: 'A.R.M.Y (BTS)', tag: 'K-Pop', color: '#8b5cf6' },
  { id: 'carat', name: 'CARAT (SEVENTEEN)', tag: 'K-Pop', color: '#06b6d4' },
  { id: 'stay', name: 'STAY (Stray Kids)', tag: 'K-Pop', color: '#84cc16' },
  { id: 'my', name: 'MY (aespa)', tag: 'K-Pop', color: '#6366f1' },
  { id: 'dive', name: 'DIVE (IVE)', tag: 'K-Pop', color: '#f97316' },
  { id: 'vpop', name: 'FC Anh Trai Say Hi', tag: 'V-Pop', color: '#10b981' },
  { id: 'anime', name: 'Demon Slayer & Anime Otaku', tag: 'Anime', color: '#ef4444' },
  { id: 'gaming', name: 'T1 & League of Legends', tag: 'Gaming', color: '#0284c7' },
];

export const PersonalDashboardModal: React.FC<PersonalDashboardModalProps> = ({ isOpen, onClose }) => {
  const { user, logout, updateProfile, toggleFavoriteFandom, activities } = useAuth();
  const { wishlist } = useCartWishlist();

  const [activeTab, setActiveTab] = useState<'overview' | 'fandoms' | 'activities' | 'bookmarks' | 'profile'>('overview');

  // Profile edit form
  const [editName, setEditName] = useState(user.name);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [editBio, setEditBio] = useState('Music lover, photocard collector, and passionate concert enthusiast!');
  const [saveToast, setSaveToast] = useState(false);

  // Sync state if user changes
  useEffect(() => {
    setEditName(user.name);
    setSelectedAvatar(user.avatar);
  }, [user]);

  // SRS 1.6: Categories of interest & Display preferences
  const FANDOM_CATEGORIES = ['Anime', 'Gaming', 'Movies', 'TV Shows', 'K-Pop', 'Comics', 'Manga', 'Cosplay'];
  const [selectedInterests, setSelectedInterests] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fanhub_user_interests');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['K-Pop', 'Anime', 'Gaming'];
  });
  const [prefTheme, setPrefTheme] = useState<'light' | 'dark'>('light');
  const [prefFontSize, setPrefFontSize] = useState<'standard' | 'large'>('standard');
  const [prefLanding, setPrefLanding] = useState<string>('all');

  // SRS 1.6 & Database Specification: Centralized Bookmarks & Notes
  const [bookmarkFilter, setBookmarkFilter] = useState<'all' | 'albums' | 'media' | 'articles' | 'characters'>('all');
  const [characterBookmarks, setCharacterBookmarks] = useState<any[]>([]);
  const [articleBookmarks, setArticleBookmarks] = useState<any[]>([]);
  const [mediaBookmarks, setMediaBookmarks] = useState<any[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');
  const [customNotes, setCustomNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('fanhub_bookmark_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const saveCustomNote = (id: string, noteText: string) => {
    setCustomNotes((prev) => {
      const next = { ...prev, [id]: noteText };
      try {
        localStorage.setItem('fanhub_bookmark_notes', JSON.stringify(next));
      } catch {}
      return next;
    });
    setEditingNoteId(null);
  };

  const removeCharacterBookmark = (charId: string) => {
    setCharacterBookmarks((prev) => {
      const next = prev.filter((c) => c.id !== charId);
      try {
        localStorage.setItem('fanhub_bookmarked_characters_list', JSON.stringify(next));
        const mapRaw = localStorage.getItem('fanhub_bookmarked_characters');
        if (mapRaw) {
          const map = JSON.parse(mapRaw);
          delete map[charId];
          localStorage.setItem('fanhub_bookmarked_characters', JSON.stringify(map));
        }
      } catch {}
      return next;
    });
  };

  const removeArticleBookmark = (artId: string) => {
    setArticleBookmarks((prev) => {
      const next = prev.filter((a) => a.id !== artId);
      try {
        const mapRaw = localStorage.getItem('fanhub_bookmarked_articles');
        if (mapRaw) {
          const map = JSON.parse(mapRaw);
          delete map[artId];
          localStorage.setItem('fanhub_bookmarked_articles', JSON.stringify(map));
        }
      } catch {}
      return next;
    });
  };

  const removeMediaBookmark = (mediaId: string) => {
    setMediaBookmarks((prev) => {
      const next = prev.filter((m) => m.id !== mediaId);
      try {
        const ids = next.map((m) => m.id);
        localStorage.setItem('fanhub_bookmarked_media', JSON.stringify(ids));
      } catch {}
      return next;
    });
  };

  // Load bookmarks on modal open
  useEffect(() => {
    if (isOpen) {
      try {
        const rawChars = localStorage.getItem('fanhub_bookmarked_characters_list');
        if (rawChars) setCharacterBookmarks(JSON.parse(rawChars));
      } catch {}

      try {
        const rawArts = localStorage.getItem('fanhub_bookmarked_articles');
        if (rawArts) {
          const map = JSON.parse(rawArts);
          const savedList = mockFeaturedArticles.filter((a) => map[a.id]);
          setArticleBookmarks(savedList);
        }
      } catch {}

      try {
        const rawMedia = localStorage.getItem('fanhub_bookmarked_media');
        if (rawMedia) {
          const ids: string[] = JSON.parse(rawMedia);
          const savedMedia = INITIAL_MEDIA_ITEMS.filter((m) => ids.includes(m.id));
          setMediaBookmarks(savedMedia);
        }
      } catch {}
    }
  }, [isOpen]);

  // Personalized Greeting calculation
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', sub: 'Wishing you a high-energy day filled with great music!' };
    if (hour < 18) return { text: 'Good afternoon', sub: 'Explore the latest events, albums, and comeback drops!' };
    return { text: 'Good evening', sub: 'Unwind with your favorite podcasts, tracks, and live stages after a long day!' };
  }, []);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAvatar = customAvatarUrl.trim() || selectedAvatar;
    updateProfile({
      name: editName.trim() || user.name,
      avatar: finalAvatar,
    });
    try {
      localStorage.setItem('fanhub_user_interests', JSON.stringify(selectedInterests));
      localStorage.setItem('fanhub_user_pref_theme', prefTheme);
      localStorage.setItem('fanhub_user_pref_font', prefFontSize);
      localStorage.setItem('fanhub_user_pref_landing', prefLanding);
    } catch {}
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const totalBookmarks = wishlist.length + articleBookmarks.length + characterBookmarks.length + mediaBookmarks.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 max-w-4xl w-full rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >

        {/* ========================================================= */}
        {/* 1. DASHBOARD HEADER & PERSONAL GREETING                   */}
        {/* ========================================================= */}
        <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-8 overflow-hidden select-none border-b border-indigo-900/40">
          {/* Subtle Ambient Glow Effects */}
          <div className="absolute -right-16 -top-16 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md border border-white/10"
            title="Close Dashboard"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
            {/* User Avatar with Edit Trigger */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ring-4 ring-white/15 dark:ring-white/10 shadow-2xl overflow-hidden bg-slate-800">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <button
                onClick={() => setActiveTab('profile')}
                className="absolute -bottom-1.5 -right-1.5 p-2 bg-gradient-to-tr from-pink-500 to-indigo-600 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-slate-900"
                title="Change avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* User Info & Personalized Greeting */}
            <div className="text-center sm:text-left flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide backdrop-blur-md border ${
                    user.role === 'admin'
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                      : 'bg-pink-500/20 text-pink-300 border-pink-500/30'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{user.role === 'admin' ? 'SYSTEM ADMINISTRATOR' : 'ELITE VIP STAN'}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-emerald-300 border border-white/10 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ONLINE</span>
                </div>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
                  <span>{greeting.text}, {user.name}!</span>
                  <span className="text-amber-400">✨</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300/90 font-normal mt-0.5 max-w-xl">
                  {greeting.sub}
                </p>
              </div>

              {/* Status Meta Pills */}
              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-300">
                <div className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">EMAIL:</span>
                  <span className="font-semibold text-white">{user.email}</span>
                </div>
                <div className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">SINCE:</span>
                  <span className="font-semibold text-white">{user.memberSince || '2024'}</span>
                </div>
                <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-slate-950" />
                  <span>DIAMOND STAN</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. NAVIGATION TABS BAR                                    */}
        {/* ========================================================= */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'OVERVIEW', icon: Sparkles },
            { id: 'fandoms', label: 'FAVORITE FANDOMS', icon: Heart, count: user.favoriteFandoms.length },
            { id: 'activities', label: 'RECENT ACTIVITY', icon: Clock, count: activities.length },
            { id: 'bookmarks', label: 'BOOKMARKS & NOTES', icon: Bookmark, count: totalBookmarks },
            { id: 'profile', label: 'PROFILE & SETTINGS', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 -translate-y-0.5'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Toast alert */}
        {saveToast && (
          <div className="mx-6 mt-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-2xl flex items-center gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Profile and display preferences have been successfully updated!</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. TAB CONTENT VIEWS                                      */}
        {/* ========================================================= */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50 dark:bg-slate-900/40">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stat Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 shadow-xs hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fandoms</span>
                    <div className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                      <Heart className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                    {user.favoriteFandoms.length}
                  </div>
                  <span className="text-xs text-pink-600 dark:text-pink-400 font-semibold block mt-0.5">
                    Official communities
                  </span>
                </div>

                <div className="p-4.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 shadow-xs hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Wishlist</span>
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Bookmark className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                    {wishlist.length}
                  </div>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold block mt-0.5">
                    Saved merch & items
                  </span>
                </div>

                <div className="p-4.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 shadow-xs hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">History</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                    {activities.length}
                  </div>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                    Reviews & streams
                  </span>
                </div>

                <div className="p-4.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 shadow-xs hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Points</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                    2,450
                  </div>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold block mt-0.5">
                    Diamond Tier ⭐
                  </span>
                </div>
              </div>

              {/* Fandom Highlight Row */}
              <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                    <span>Your Subscribed Fandoms</span>
                  </h4>
                  <button
                    onClick={() => setActiveTab('fandoms')}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Manage Fandoms</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {user.favoriteFandoms.map((fandom, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-pink-200/80 dark:border-pink-800/50 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs hover:bg-pink-100/70 transition-colors"
                    >
                      <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                      {fandom}
                    </span>
                  ))}
                  <button
                    onClick={() => setActiveTab('fandoms')}
                    className="px-3 py-1.5 border border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-500 text-slate-500 hover:text-indigo-600 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Fandom</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity Snapshot */}
              <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span>Recent Activity</span>
                  </h4>
                  <button
                    onClick={() => setActiveTab('activities')}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>View All ({activities.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {activities.slice(0, 3).map((act) => (
                    <div
                      key={act.id}
                      className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 shrink-0" />
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{act.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap ml-3">
                        {act.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: FANDOMS MANAGEMENT */}
          {activeTab === 'fandoms' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Choose Your Favorite Fandoms</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Toggle the fandoms you care about. Your newsfeed, recommendations, and universe navigation will prioritize content from followed communities.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {ALL_FANDOM_OPTIONS.map((item) => {
                  const isFollowed = user.favoriteFandoms.includes(item.name);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleFavoriteFandom(item.name)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-xs ${
                        isFollowed
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-700/60 shadow-sm'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-slate-800 shadow-xs shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</h5>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{item.tag}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isFollowed
                            ? 'bg-pink-600 hover:bg-pink-700 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {isFollowed ? '✓ Following' : '+ Follow'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ACTIVITIES TIMELINE */}
          {activeTab === 'activities' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Your Activity History</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Complete record of your interactions: trailer reviews, saved concert events, playlist additions, and community feedback.
                </p>
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                {activities.map((act) => (
                  <div key={act.id} className="relative group">
                    <span className="absolute -left-6 top-3 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900 shadow-xs" />
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/70 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{act.title}</p>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-1 inline-block">{act.timestamp}</span>
                      </div>
                      {act.link && (
                        <Link
                          href={act.link}
                          onClick={onClose}
                          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CENTRALIZED BOOKMARKS & NOTES (SRS 1.6 & 1.4) */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-indigo-500" />
                    <span>Bookmarks & Collector Notes</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Centralized hub for all saved albums, dispatches, characters, and streams with personal collector notes.
                  </p>
                </div>

                {/* Sub-Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                  {[
                    { id: 'all', label: `All (${totalBookmarks})` },
                    { id: 'albums', label: `Merch (${wishlist.length})` },
                    { id: 'media', label: `Media (${mediaBookmarks.length})` },
                    { id: 'articles', label: `Articles (${articleBookmarks.length})` },
                    { id: 'characters', label: `Characters (${characterBookmarks.length})` },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setBookmarkFilter(filter.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        bookmarkFilter === filter.id
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* No items fallback */}
              {totalBookmarks === 0 ? (
                <div className="py-14 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 p-6 space-y-2.5 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center mx-auto">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">No Bookmarks Saved Yet</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Click the bookmark button on any album, article, media stream, or character dossier to save them here with your personal notes!
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  
                  {/* SECTION 1: ALBUMS & MERCH */}
                  {(bookmarkFilter === 'all' || bookmarkFilter === 'albums') && wishlist.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        <Disc className="w-4 h-4 text-indigo-500" />
                        <span>Official Albums &amp; Merchandise ({wishlist.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {wishlist.map(({ album, note }) => {
                          const activeNote = customNotes[album.id] !== undefined ? customNotes[album.id] : (note || '');
                          const isEditing = editingNoteId === album.id;

                          return (
                            <div
                              key={album.id}
                              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-slate-800 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center gap-3.5">
                                <img
                                  src={album.coverImage}
                                  alt={album.title}
                                  className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 block uppercase">
                                    {album.artist}
                                  </span>
                                  <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {album.title}
                                  </h5>
                                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">
                                    ${album.priceUSD} USD
                                  </span>
                                </div>
                              </div>

                              {/* Personal Note */}
                              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                                {isEditing ? (
                                  <div className="flex gap-1.5">
                                    <input
                                      type="text"
                                      value={tempNoteText}
                                      onChange={(e) => setTempNoteText(e.target.value)}
                                      placeholder="Add note (e.g. Waiting for restock)..."
                                      className="flex-1 text-xs px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => saveCustomNote(album.id, tempNoteText)}
                                      className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-indigo-700"
                                    >
                                      Save
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                                    <span className="truncate text-slate-600 dark:text-slate-300 text-[11px]">
                                      {activeNote ? `📝 "${activeNote}"` : 'No note added'}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingNoteId(album.id);
                                        setTempNoteText(activeNote);
                                      }}
                                      className="text-indigo-600 dark:text-indigo-400 font-bold text-[11px] ml-2 shrink-0 hover:underline cursor-pointer"
                                    >
                                      {activeNote ? 'Edit Note' : '+ Note'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SECTION 2: ARTICLES */}
                  {(bookmarkFilter === 'all' || bookmarkFilter === 'articles') && articleBookmarks.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        <FileText className="w-4 h-4 text-emerald-500" />
                        <span>Bookmarked Articles &amp; Dispatches ({articleBookmarks.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {articleBookmarks.map((art) => {
                          const activeNote = customNotes[art.id] || '';
                          const isEditing = editingNoteId === art.id;

                          return (
                            <div
                              key={art.id}
                              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-slate-800 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start gap-3.5">
                                <img
                                  src={art.image}
                                  alt={art.title}
                                  className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 rounded-md uppercase">
                                      {art.category}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeArticleBookmark(art.id)}
                                      className="text-slate-400 hover:text-rose-500 cursor-pointer transition-colors p-1"
                                      title="Remove bookmark"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mt-1">{art.title}</h5>
                                  <p className="text-[11px] text-slate-500">By {art.author?.name || 'Contributor'}</p>
                                </div>
                              </div>

                              {/* Personal Note */}
                              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                                {isEditing ? (
                                  <div className="flex gap-1.5">
                                    <input
                                      type="text"
                                      value={tempNoteText}
                                      onChange={(e) => setTempNoteText(e.target.value)}
                                      placeholder="Add personal thoughts..."
                                      className="flex-1 text-xs px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => saveCustomNote(art.id, tempNoteText)}
                                      className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-indigo-700"
                                    >
                                      Save
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                                    <span className="truncate text-slate-600 dark:text-slate-300 text-[11px]">
                                      {activeNote ? `📝 "${activeNote}"` : 'No note added'}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingNoteId(art.id);
                                        setTempNoteText(activeNote);
                                      }}
                                      className="text-indigo-600 dark:text-indigo-400 font-bold text-[11px] ml-2 shrink-0 hover:underline cursor-pointer"
                                    >
                                      {activeNote ? 'Edit Note' : '+ Note'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SECTION 3: CHARACTERS */}
                  {(bookmarkFilter === 'all' || bookmarkFilter === 'characters') && characterBookmarks.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        <UserIcon className="w-4 h-4 text-purple-500" />
                        <span>Character Dossiers ({characterBookmarks.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {characterBookmarks.map((char) => {
                          const activeNote = customNotes[char.id] || '';
                          const isEditing = editingNoteId === char.id;

                          return (
                            <div
                              key={char.id}
                              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-slate-800 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 rounded-md uppercase">
                                      {char.artistName || 'Universe'}
                                    </span>
                                    <span className="text-[11px] text-slate-500">{char.role}</span>
                                  </div>
                                  <h5 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{char.name}</h5>
                                  <p className="text-xs text-slate-500 italic mt-0.5 line-clamp-1">"{char.personality}"</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeCharacterBookmark(char.id)}
                                  className="text-slate-400 hover:text-rose-500 cursor-pointer p-1 shrink-0"
                                  title="Remove bookmark"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Personal Note */}
                              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                                {isEditing ? (
                                  <div className="flex gap-1.5">
                                    <input
                                      type="text"
                                      value={tempNoteText}
                                      onChange={(e) => setTempNoteText(e.target.value)}
                                      placeholder="Add note on character traits, lore..."
                                      className="flex-1 text-xs px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => saveCustomNote(char.id, tempNoteText)}
                                      className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-indigo-700"
                                    >
                                      Save
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                                    <span className="truncate text-slate-600 dark:text-slate-300 text-[11px]">
                                      {activeNote ? `📝 "${activeNote}"` : 'No note added'}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingNoteId(char.id);
                                        setTempNoteText(activeNote);
                                      }}
                                      className="text-indigo-600 dark:text-indigo-400 font-bold text-[11px] ml-2 shrink-0 hover:underline cursor-pointer"
                                    >
                                      {activeNote ? 'Edit Note' : '+ Note'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SECTION 4: STREAMING & MEDIA */}
                  {(bookmarkFilter === 'all' || bookmarkFilter === 'media') && mediaBookmarks.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        <Play className="w-4 h-4 text-rose-500" />
                        <span>Saved Media &amp; Streams ({mediaBookmarks.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {mediaBookmarks.map((media) => {
                          const activeNote = customNotes[media.id] || '';
                          const isEditing = editingNoteId === media.id;

                          return (
                            <div
                              key={media.id}
                              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-slate-800 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start gap-3.5">
                                <div className="relative shrink-0">
                                  <img
                                    src={media.thumbnail}
                                    alt={media.title}
                                    className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                                  />
                                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-slate-950/80 text-[9px] text-white font-bold rounded-md">
                                    {media.duration}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 rounded-md uppercase">
                                      {media.type}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeMediaBookmark(media.id)}
                                      className="text-slate-400 hover:text-rose-500 cursor-pointer p-1"
                                      title="Remove bookmark"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mt-1">{media.title}</h5>
                                  <p className="text-[11px] text-slate-500">{media.artist} • {media.views} views</p>
                                </div>
                              </div>

                              {/* Personal Note */}
                              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                                {isEditing ? (
                                  <div className="flex gap-1.5">
                                    <input
                                      type="text"
                                      value={tempNoteText}
                                      onChange={(e) => setTempNoteText(e.target.value)}
                                      placeholder="Add note on this media stream..."
                                      className="flex-1 text-xs px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => saveCustomNote(media.id, tempNoteText)}
                                      className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-indigo-700"
                                    >
                                      Save
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                                    <span className="truncate text-slate-600 dark:text-slate-300 text-[11px]">
                                      {activeNote ? `📝 "${activeNote}"` : 'No note added'}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingNoteId(media.id);
                                        setTempNoteText(activeNote);
                                      }}
                                      className="text-indigo-600 dark:text-indigo-400 font-bold text-[11px] ml-2 shrink-0 hover:underline cursor-pointer"
                                    >
                                      {activeNote ? 'Edit Note' : '+ Note'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          )}

          {/* TAB 5: PROFILE & SETTINGS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Profile &amp; Preferences</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Customize your fan presence, avatar identity, and display preferences.
                </p>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  Fandom Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  required
                />
              </div>

              {/* Avatar Preset Selection */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  Quick Avatar Selection
                </label>
                <div className="flex flex-wrap gap-3">
                  {AVATAR_PRESETS.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Avatar preset"
                      onClick={() => {
                        setSelectedAvatar(url);
                        setCustomAvatarUrl('');
                      }}
                      className={`w-14 h-14 rounded-2xl object-cover cursor-pointer transition-all ${
                        selectedAvatar === url && !customAvatarUrl
                          ? 'ring-4 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 scale-105 shadow-md'
                          : 'opacity-75 hover:opacity-100 hover:scale-102 border border-slate-200 dark:border-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <div className="pt-2">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Or paste a custom avatar image URL:
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all mt-1"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  Fandom Bio / Motto
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* SRS 1.6 Requirement: Categories of Interest */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Categories of Interest (SRS 1.6)
                  </label>
                  <span className="text-xs text-slate-400 font-medium">
                    {selectedInterests.length} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {FANDOM_CATEGORIES.map((cat) => {
                    const isSelected = selectedInterests.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedInterests((prev) =>
                            isSelected ? prev.filter((c) => c !== cat) : [...prev, cat]
                          );
                        }}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SRS 1.6 Requirement: Display Preferences */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  Display Preferences (SRS 1.6)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                      Theme Mode
                    </span>
                    <select
                      value={prefTheme}
                      onChange={(e) => setPrefTheme(e.target.value as any)}
                      aria-label="Theme Mode Preference"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="light">Light High-Contrast</option>
                      <option value="dark">Dark Cyberpunk</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                      Text Scale
                    </span>
                    <select
                      value={prefFontSize}
                      onChange={(e) => setPrefFontSize(e.target.value as any)}
                      aria-label="Text Scale Preference"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="standard">Standard (100%)</option>
                      <option value="large">Accessible Large (+12.5%)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                      Default Landing
                    </span>
                    <select
                      value={prefLanding}
                      onChange={(e) => setPrefLanding(e.target.value)}
                      aria-label="Default Fandom Preference"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="all">Universe Explorer (All)</option>
                      <option value="kpop">K-Pop Official Hub</option>
                      <option value="anime">Anime Sakuga Archive</option>
                      <option value="gaming">Gaming &amp; Esports</option>
                      <option value="manga">Manga Tankōbon</option>
                      <option value="movies">Cinema 70mm</option>
                      <option value="comics">Comics Pop-Art</option>
                      <option value="tv">TV Shows Y2K</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 active:scale-98 transition-all cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
