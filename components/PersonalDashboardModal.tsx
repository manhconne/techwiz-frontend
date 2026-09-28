'use client';

import React, { useState, useMemo } from 'react';
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
  { id: 'blink', name: 'BLINK (BLACKPINK)', tag: 'K-Pop', color: '#ffd60a' },
  { id: 'army', name: 'A.R.M.Y (BTS)', tag: 'K-Pop', color: '#c084fc' },
  { id: 'carat', name: 'CARAT (SEVENTEEN)', tag: 'K-Pop', color: '#00f0ff' },
  { id: 'stay', name: 'STAY (Stray Kids)', tag: 'K-Pop', color: '#ccff00' },
  { id: 'my', name: 'MY (aespa)', tag: 'K-Pop', color: '#818cf8' },
  { id: 'dive', name: 'DIVE (IVE)', tag: 'K-Pop', color: '#ff6b4a' },
  { id: 'vpop', name: 'FC Anh Trai Say Hi', tag: 'V-Pop', color: '#10b981' },
  { id: 'anime', name: 'Demon Slayer & Anime Otaku', tag: 'Anime', color: '#ef4444' },
  { id: 'gaming', name: 'T1 & League of Legends', tag: 'Gaming', color: '#00f0ff' },
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
  React.useEffect(() => {
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

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-mono">
      <div
        style={{ borderRadius: '0px' }}
        className="bg-white max-w-4xl w-full shadow-[10px_10px_0px_#000000] border-3 border-black overflow-hidden flex flex-col max-h-[92vh]"
      >

        {/* ========================================================= */}
        {/* 1. DASHBOARD HEADER & PERSONAL GREETING                   */}
        {/* ========================================================= */}
        <div className="bg-[#ffd60a] text-black p-6 relative border-b-3 border-black select-none">
          <button
            onClick={onClose}
            style={{ borderRadius: '0px' }}
            className="absolute top-4 right-4 px-2.5 py-1 bg-white text-black hover:bg-[#ff2e93] hover:text-white border-2 border-black text-xs font-black cursor-pointer shadow-[1px_1px_0px_#000] transition-colors"
            title="Close Dashboard"
          >
            [✕]
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* User Avatar with Badge */}
            <div className="relative group">
              <img
                src={user.avatar}
                alt={user.name}
                style={{ borderRadius: '0px' }}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover border-3 border-black shadow-[4px_4px_0px_#000]"
              />
              <button
                onClick={() => setActiveTab('profile')}
                style={{ borderRadius: '0px' }}
                className="absolute -bottom-2 -right-2 p-1.5 bg-[#00f0ff] text-black border-2 border-black hover:scale-110 transition-transform shadow-[2px_2px_0px_#000] cursor-pointer"
                title="Change avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* User Info & Personalized Greeting */}
            <div className="text-center sm:text-left flex-1 space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#ff2e93] text-white border-2 border-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000]">
                <Sparkles className="w-3 h-3 text-white" />
                <span>{user.role === 'admin' ? 'SYSTEM ADMINISTRATOR (ADMIN)' : '★ FANDOM ELITE VIP MEMBER ✦'}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-black uppercase font-sans">
                {greeting.text}, {user.name}! 🌟
              </h2>
              <p className="text-xs text-neutral-800 font-medium">
                {greeting.sub}
              </p>

              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-neutral-800 font-bold">
                <span>EMAIL: <strong className="text-black bg-white px-1 border border-black">{user.email}</strong></span>
                <span>•</span>
                <span>SINCE: <strong className="text-black">{user.memberSince || '2024'}</strong></span>
                <span>•</span>
                <span className="bg-[#ccff00] text-black px-1.5 py-0.2 border border-black font-black">DIAMOND STAN ⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. NAVIGATION TABS BAR                                    */}
        {/* ========================================================= */}
        <div className="px-6 border-b-2 border-black bg-[#ecfeff] flex items-center gap-2 overflow-x-auto scrollbar-none py-2">
          {[
            { id: 'overview', label: 'OVERVIEW', icon: Sparkles },
            { id: 'fandoms', label: 'FAVORITE FANDOMS', icon: Heart, count: user.favoriteFandoms.length },
            { id: 'activities', label: 'RECENT ACTIVITY', icon: Clock, count: activities.length },
            { id: 'bookmarks', label: 'BOOKMARKS & NOTES', icon: Bookmark, count: wishlist.length + articleBookmarks.length + characterBookmarks.length + mediaBookmarks.length },
            { id: 'profile', label: 'PROFILE & SETTINGS', icon: Edit3 },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{ borderRadius: '0px' }}
                className={`flex items-center gap-2 py-2 px-3 text-xs font-black uppercase border-2 transition-all whitespace-nowrap cursor-pointer ${isActive
                    ? 'bg-[#ff2e93] text-white border-black shadow-[3px_3px_0px_#000] -translate-y-0.5'
                    : 'bg-white text-black border-black hover:bg-[#fff9db] shadow-[1px_1px_0px_#000]'
                  }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 text-[10px] font-mono border border-black ${isActive ? 'bg-[#ffd60a] text-black' : 'bg-[#ecfeff] text-black'
                    }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Toast alert */}
        {saveToast && (
          <div
            style={{ borderRadius: '0px' }}
            className="mx-6 mt-4 p-3 bg-[#ccff00] border-2 border-black text-black text-xs font-black flex items-center gap-2 shadow-[3px_3px_0px_#000]"
          >
            <Check className="w-4 h-4 text-black" />
            <span>★ YOUR PROFILE HAS BEEN SUCCESSFULLY SYNCHRONIZED!</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. TAB CONTENT VIEWS                                      */}
        {/* ========================================================= */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-[#fdfbf7]">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stat Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div style={{ borderRadius: '0px' }} className="p-4 bg-white border-2 border-black text-center shadow-[4px_4px_0px_#000]">
                  <span className="text-[10px] font-black text-neutral-600 uppercase">Fandoms Followed</span>
                  <div className="text-2xl font-black text-black mt-1">{user.favoriteFandoms.length}</div>
                  <span className="text-[10px] text-[#ff2e93] font-bold">Official communities</span>
                </div>
                <div style={{ borderRadius: '0px' }} className="p-4 bg-white border-2 border-black text-center shadow-[4px_4px_0px_#000]">
                  <span className="text-[10px] font-black text-neutral-600 uppercase">Saved Items</span>
                  <div className="text-2xl font-black text-black mt-1">{wishlist.length}</div>
                  <span className="text-[10px] text-cyan-600 font-bold">In your wishlist</span>
                </div>
                <div style={{ borderRadius: '0px' }} className="p-4 bg-white border-2 border-black text-center shadow-[4px_4px_0px_#000]">
                  <span className="text-[10px] font-black text-neutral-600 uppercase">Interaction History</span>
                  <div className="text-2xl font-black text-black mt-1">{activities.length}</div>
                  <span className="text-[10px] text-emerald-600 font-bold">Reviews &amp; streams</span>
                </div>
                <div style={{ borderRadius: '0px' }} className="p-4 bg-white border-2 border-black text-center shadow-[4px_4px_0px_#000]">
                  <span className="text-[10px] font-black text-neutral-600 uppercase">Contribution Points</span>
                  <div className="text-2xl font-black text-black mt-1">2,450</div>
                  <span className="text-[10px] bg-[#ffd60a] px-1 border border-black font-black">Diamond Tier ⭐</span>
                </div>
              </div>

              {/* Fandom Highlight Row */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-black tracking-wider flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#ff2e93] fill-[#ff2e93]" /> Your Fandoms
                  </h4>
                  <button
                    onClick={() => setActiveTab('fandoms')}
                    className="text-xs font-black text-[#ff2e93] hover:underline cursor-pointer"
                  >
                    [MANAGE // + ADD FANDOM]
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {user.favoriteFandoms.map((fandom, idx) => (
                    <span
                      key={idx}
                      style={{ borderRadius: '0px' }}
                      className="px-3 py-1.5 bg-[#fdf2f8] text-[#ff2e93] border-2 border-black text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000]"
                    >
                      <Heart className="w-3 h-3 fill-[#ff2e93] text-[#ff2e93]" />
                      {fandom}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Activity Snapshot */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-black tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-600" /> Recent Activity
                  </h4>
                  <button
                    onClick={() => setActiveTab('activities')}
                    className="text-xs font-black text-[#ff2e93] hover:underline cursor-pointer"
                  >
                    [VIEW ALL ({activities.length})]
                  </button>
                </div>

                <div className="space-y-2">
                  {activities.slice(0, 3).map((act) => (
                    <div
                      key={act.id}
                      style={{ borderRadius: '0px' }}
                      className="p-3 bg-white border-2 border-black flex items-center justify-between text-xs shadow-[2px_2px_0px_#000]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 bg-[#ff2e93] border border-black" />
                        <span className="font-bold text-black">{act.title}</span>
                      </div>
                      <span className="text-[11px] text-neutral-600 font-mono whitespace-nowrap ml-2">
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
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-black text-black uppercase">CHOOSE YOUR FAVORITE FANDOMS</h4>
                <p className="text-xs text-neutral-600 font-medium">
                  Click on fandoms to toggle following. Your newsfeed, recommendations, and interface will prioritize content from fandoms you follow.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {ALL_FANDOM_OPTIONS.map((item) => {
                  const isFollowed = user.favoriteFandoms.includes(item.name);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleFavoriteFandom(item.name)}
                      style={{ borderRadius: '0px' }}
                      className={`p-3.5 border-2 border-black transition-all cursor-pointer flex items-center justify-between ${isFollowed
                          ? 'bg-[#ecfeff] shadow-[3px_3px_0px_#000] -translate-y-0.5'
                          : 'bg-white hover:bg-[#fff9db] shadow-[1px_1px_0px_#000]'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 border border-black flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <div>
                          <h5 className="text-xs font-black text-black">{item.name}</h5>
                          <span className="text-[10px] text-neutral-600 font-bold">{item.tag}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        style={{ borderRadius: '0px' }}
                        className={`px-3 py-1 text-xs font-black border-2 border-black uppercase transition-colors ${isFollowed
                            ? 'bg-[#ff2e93] text-white shadow-[1px_1px_0px_#000]'
                            : 'bg-white text-black hover:bg-[#ffd60a]'
                          }`}
                      >
                        {isFollowed ? '✓ FOLLOWING' : '+ FOLLOW'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ACTIVITIES TIMELINE */}
          {activeTab === 'activities' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-black text-black uppercase">YOUR ACTIVITY HISTORY</h4>
                <p className="text-xs text-neutral-600 font-medium">
                  Complete record of your interactions: trailer reviews, saved concert events, playlist additions, and community feedback.
                </p>
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-1 before:bg-black">
                {activities.map((act) => (
                  <div key={act.id} className="relative group">
                    <span className="absolute -left-6 top-1.5 w-3.5 h-3.5 bg-[#ffd60a] border-2 border-black shadow-[1px_1px_0px_#000]" />
                    <div
                      style={{ borderRadius: '0px' }}
                      className="p-3.5 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-black">{act.title}</p>
                        <span className="text-[10px] text-neutral-500 font-mono mt-0.5 inline-block">{act.timestamp}</span>
                      </div>
                      {act.link && (
                        <Link
                          href={act.link}
                          onClick={onClose}
                          style={{ borderRadius: '0px' }}
                          className="text-[11px] font-black text-black bg-[#ffd60a] px-2 py-0.5 border border-black hover:bg-[#ff2e93] hover:text-white flex items-center gap-1 shadow-[1px_1px_0px_#000]"
                        >
                          <span>OPEN</span>
                          <ExternalLink className="w-3 h-3" />
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
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-black">
                <div>
                  <h4 className="text-sm font-black text-black uppercase">
                    ★ CENTRALIZED BOOKMARKS &amp; COLLECTOR NOTES
                  </h4>
                  <p className="text-xs text-neutral-600 font-medium">
                    Bookmark any article, character profile, video, or merchandise item with personal notes (SRS 1.6).
                  </p>
                </div>

                {/* Sub-Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                  {[
                    { id: 'all', label: `ALL (${wishlist.length + articleBookmarks.length + characterBookmarks.length + mediaBookmarks.length})` },
                    { id: 'albums', label: `MERCH (${wishlist.length})` },
                    { id: 'media', label: `STREAMS & MEDIA (${mediaBookmarks.length})` },
                    { id: 'articles', label: `ARTICLES (${articleBookmarks.length})` },
                    { id: 'characters', label: `CHARACTERS (${characterBookmarks.length})` },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setBookmarkFilter(filter.id as any)}
                      style={{ borderRadius: '0px' }}
                      className={`px-2.5 py-1 text-[11px] font-mono font-black uppercase border-2 border-black transition-colors cursor-pointer whitespace-nowrap ${
                        bookmarkFilter === filter.id
                          ? 'bg-[#ff2e93] text-white shadow-[2px_2px_0px_#000]'
                          : 'bg-white hover:bg-neutral-100 text-black shadow-[1px_1px_0px_#000]'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* No items fallback */}
              {wishlist.length === 0 && articleBookmarks.length === 0 && characterBookmarks.length === 0 && mediaBookmarks.length === 0 ? (
                <div style={{ borderRadius: '0px' }} className="py-12 text-center bg-white border-2 border-black p-6 space-y-2 shadow-[3px_3px_0px_#000]">
                  <Bookmark className="w-8 h-8 text-neutral-400 mx-auto" />
                  <p className="text-xs font-bold text-black uppercase">NO BOOKMARKS SAVED YET</p>
                  <p className="text-[11px] text-neutral-500">
                    Click the bookmark button on any album, featured article, media stream, or character dossier to save them here with personal notes!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* SECTION 1: ALBUMS & MERCH */}
                  {(bookmarkFilter === 'all' || bookmarkFilter === 'albums') && wishlist.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-black">
                        <Disc className="w-4 h-4 text-cyan-600" />
                        <span>OFFICIAL ALBUMS &amp; MERCHANDISE ({wishlist.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {wishlist.map(({ album, note }) => {
                          const activeNote = customNotes[album.id] !== undefined ? customNotes[album.id] : (note || '');
                          const isEditing = editingNoteId === album.id;

                          return (
                            <div
                              key={album.id}
                              style={{ borderRadius: '0px' }}
                              className="p-3 border-2 border-black bg-white shadow-[3px_3px_0px_#000] flex flex-col justify-between space-y-2"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={album.coverImage}
                                  alt={album.title}
                                  style={{ borderRadius: '0px', width: '56px', height: '56px' }}
                                  className="object-cover border border-black shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <span className="text-[10px] font-black text-[#ff2e93] block uppercase">{album.artist}</span>
                                  <h5 className="text-xs font-bold text-black truncate uppercase font-sans">{album.title}</h5>
                                  <span className="text-[11px] font-mono font-black text-black mt-0.5 block">
                                    ${album.priceUSD} USD
                                  </span>
                                </div>
                              </div>

                              {/* Personal Note */}
                              <div className="pt-2 border-t border-black/15 text-[11px] font-mono">
                                {isEditing ? (
                                  <div className="flex gap-1">
                                    <input
                                      type="text"
                                      value={tempNoteText}
                                      onChange={(e) => setTempNoteText(e.target.value)}
                                      placeholder="Add note (e.g. Waiting for restock)..."
                                      style={{ borderRadius: '0px' }}
                                      className="flex-1 text-xs p-1 bg-white border border-black focus:outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => saveCustomNote(album.id, tempNoteText)}
                                      className="px-2 py-1 bg-[#ff2e93] text-white text-[10px] font-bold border border-black"
                                    >
                                      SAVE
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between bg-[#ecfeff] p-1.5 border border-black/30">
                                    <span className="truncate text-neutral-800">
                                      {activeNote ? `📝 "${activeNote}"` : 'No note added'}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingNoteId(album.id);
                                        setTempNoteText(activeNote);
                                      }}
                                      className="text-[#ff2e93] font-bold text-[10px] ml-1 shrink-0 hover:underline cursor-pointer"
                                    >
                                      {activeNote ? '[EDIT NOTE]' : '[+ NOTE]'}
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
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-black">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span>BOOKMARKED ARTICLES &amp; DISPATCHES ({articleBookmarks.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {articleBookmarks.map((art) => {
                          const activeNote = customNotes[art.id] || '';
                          const isEditing = editingNoteId === art.id;

                          return (
                            <div
                              key={art.id}
                              style={{ borderRadius: '0px' }}
                              className="p-3 border-2 border-black bg-white shadow-[3px_3px_0px_#000] flex flex-col justify-between space-y-2"
                            >
                              <div className="flex items-start gap-3">
                                <img
                                  src={art.image}
                                  alt={art.title}
                                  style={{ borderRadius: '0px', width: '56px', height: '56px' }}
                                  className="object-cover border border-black shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black px-1.5 py-0.2 bg-[#ffd60a] text-black border border-black uppercase font-mono">
                                      {art.category}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeArticleBookmark(art.id)}
                                      className="text-neutral-400 hover:text-rose-600 cursor-pointer"
                                      title="Remove bookmark"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <h5 className="text-xs font-bold text-black line-clamp-1 font-sans mt-1">{art.title}</h5>
                                  <p className="text-[10px] text-neutral-500 font-mono">By {art.author?.name || 'Contributor'}</p>
                                </div>
                              </div>

                              {/* Personal Note */}
                              <div className="pt-2 border-t border-black/15 text-[11px] font-mono">
                                {isEditing ? (
                                  <div className="flex gap-1">
                                    <input
                                      type="text"
                                      value={tempNoteText}
                                      onChange={(e) => setTempNoteText(e.target.value)}
                                      placeholder="Add personal thoughts on this dispatch..."
                                      style={{ borderRadius: '0px' }}
                                      className="flex-1 text-xs p-1 bg-white border border-black focus:outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => saveCustomNote(art.id, tempNoteText)}
                                      className="px-2 py-1 bg-[#ff2e93] text-white text-[10px] font-bold border border-black"
                                    >
                                      SAVE
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between bg-[#fefce8] p-1.5 border border-black/30">
                                    <span className="truncate text-neutral-800">
                                      {activeNote ? `📝 "${activeNote}"` : 'No note added'}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingNoteId(art.id);
                                        setTempNoteText(activeNote);
                                      }}
                                      className="text-[#ff2e93] font-bold text-[10px] ml-1 shrink-0 hover:underline cursor-pointer"
                                    >
                                      {activeNote ? '[EDIT NOTE]' : '[+ NOTE]'}
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
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-black">
                        <UserIcon className="w-4 h-4 text-purple-600" />
                        <span>CHARACTER DOSSIERS ({characterBookmarks.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {characterBookmarks.map((char) => {
                          const activeNote = customNotes[char.id] || '';
                          const isEditing = editingNoteId === char.id;

                          return (
                            <div
                              key={char.id}
                              style={{ borderRadius: '0px' }}
                              className="p-3 border-2 border-black bg-white shadow-[3px_3px_0px_#000] flex flex-col justify-between space-y-2"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#ff2e93] text-white font-bold uppercase">
                                      {char.artistName || 'Universe'}
                                    </span>
                                    <span className="text-[10px] font-mono text-neutral-500 uppercase">{char.role}</span>
                                  </div>
                                  <h5 className="text-sm font-black text-black font-sans mt-0.5">{char.name}</h5>
                                  <p className="text-[11px] text-neutral-600 line-clamp-1 italic">"{char.personality}"</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeCharacterBookmark(char.id)}
                                  className="text-neutral-400 hover:text-rose-600 cursor-pointer shrink-0"
                                  title="Remove bookmark"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Personal Note */}
                              <div className="pt-2 border-t border-black/15 text-[11px] font-mono">
                                {isEditing ? (
                                  <div className="flex gap-1">
                                    <input
                                      type="text"
                                      value={tempNoteText}
                                      onChange={(e) => setTempNoteText(e.target.value)}
                                      placeholder="Add note on character traits, lore..."
                                      style={{ borderRadius: '0px' }}
                                      className="flex-1 text-xs p-1 bg-white border border-black focus:outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => saveCustomNote(char.id, tempNoteText)}
                                      className="px-2 py-1 bg-[#ff2e93] text-white text-[10px] font-bold border border-black"
                                    >
                                      SAVE
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between bg-[#f3e8ff] p-1.5 border border-black/30">
                                    <span className="truncate text-neutral-800">
                                      {activeNote ? `📝 "${activeNote}"` : 'No note added'}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingNoteId(char.id);
                                        setTempNoteText(activeNote);
                                      }}
                                      className="text-[#ff2e93] font-bold text-[10px] ml-1 shrink-0 hover:underline cursor-pointer"
                                    >
                                      {activeNote ? '[EDIT NOTE]' : '[+ NOTE]'}
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
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-black">
                        <Play className="w-4 h-4 text-rose-600" />
                        <span>SAVED MEDIA &amp; STREAMS ({mediaBookmarks.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {mediaBookmarks.map((media) => {
                          const activeNote = customNotes[media.id] || '';
                          const isEditing = editingNoteId === media.id;

                          return (
                            <div
                              key={media.id}
                              style={{ borderRadius: '0px' }}
                              className="p-3 border-2 border-black bg-white shadow-[3px_3px_0px_#000] flex flex-col justify-between space-y-2"
                            >
                              <div className="flex items-start gap-3">
                                <div className="relative shrink-0">
                                  <img
                                    src={media.thumbnail}
                                    alt={media.title}
                                    style={{ borderRadius: '0px', width: '56px', height: '56px' }}
                                    className="object-cover border border-black"
                                  />
                                  <span className="absolute bottom-0.5 right-0.5 px-1 bg-black/80 text-[8px] text-white font-mono font-bold">
                                    {media.duration}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black px-1.5 py-0.2 bg-[#ffd60a] text-black border border-black uppercase font-mono">
                                      {media.type}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeMediaBookmark(media.id)}
                                      className="text-neutral-400 hover:text-rose-600 cursor-pointer"
                                      title="Remove bookmark"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <h5 className="text-xs font-bold text-black line-clamp-1 font-sans mt-1">{media.title}</h5>
                                  <p className="text-[10px] text-neutral-500 font-mono">{media.artist} • {media.views} views</p>
                                </div>
                              </div>

                              {/* Personal Note */}
                              <div className="pt-2 border-t border-black/15 text-[11px] font-mono">
                                {isEditing ? (
                                  <div className="flex gap-1">
                                    <input
                                      type="text"
                                      value={tempNoteText}
                                      onChange={(e) => setTempNoteText(e.target.value)}
                                      placeholder="Add note on this media stream..."
                                      style={{ borderRadius: '0px' }}
                                      className="flex-1 text-xs p-1 bg-white border border-black focus:outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => saveCustomNote(media.id, tempNoteText)}
                                      className="px-2 py-1 bg-[#ff2e93] text-white text-[10px] font-bold border border-black"
                                    >
                                      SAVE
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between bg-[#fefce8] p-1.5 border border-black/30">
                                    <span className="truncate text-neutral-800">
                                      {activeNote ? `📝 "${activeNote}"` : 'No note added'}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingNoteId(media.id);
                                        setTempNoteText(activeNote);
                                      }}
                                      className="text-[#ff2e93] font-bold text-[10px] ml-1 shrink-0 hover:underline cursor-pointer"
                                    >
                                      {activeNote ? '[EDIT NOTE]' : '[+ NOTE]'}
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
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <h4 className="text-sm font-black text-black uppercase">MANAGE PERSONAL PROFILE</h4>
                <p className="text-xs text-neutral-600 font-medium">
                  Update your display name, avatar, and fandom motto.
                </p>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-black">FANDOM DISPLAY NAME:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ borderRadius: '0px' }}
                  className="w-full px-3 py-2 border-2 border-black text-xs bg-white focus:outline-none focus:border-[#ff2e93]"
                  required
                />
              </div>

              {/* Avatar Preset Selection */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-black">QUICK AVATAR SELECTION:</label>
                <div className="flex flex-wrap gap-2.5">
                  {AVATAR_PRESETS.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Avatar preset"
                      onClick={() => {
                        setSelectedAvatar(url);
                        setCustomAvatarUrl('');
                      }}
                      style={{ borderRadius: '0px' }}
                      className={`w-12 h-12 object-cover cursor-pointer transition-all border-2 ${selectedAvatar === url && !customAvatarUrl
                          ? 'border-[#ff2e93] shadow-[3px_3px_0px_#000] scale-105'
                          : 'border-black opacity-70 hover:opacity-100'
                        }`}
                    />
                  ))}
                </div>

                <div className="pt-2">
                  <label className="text-[11px] font-bold text-neutral-600">OR PASTE CUSTOM AVATAR URL:</label>
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    style={{ borderRadius: '0px' }}
                    className="w-full px-3 py-2 border-2 border-black text-xs bg-white focus:outline-none focus:border-[#ff2e93] mt-1"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-black">FANDOM BIO / MOTTO:</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  style={{ borderRadius: '0px' }}
                  className="w-full px-3 py-2 border-2 border-black text-xs bg-white focus:outline-none focus:border-[#ff2e93]"
                />
              </div>

              {/* SRS 1.6 Requirement: Categories of Interest */}
              <div className="space-y-2 pt-2 border-t-2 border-dashed border-neutral-300">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-black">
                    ★ CATEGORIES OF INTEREST (SRS 1.6 SPEC):
                  </label>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {selectedInterests.length} SELECTED
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
                        style={{ borderRadius: '0px' }}
                        className={`px-2.5 py-1 text-xs font-bold border-2 border-black transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#ff2e93] text-white shadow-[2px_2px_0px_#000]'
                            : 'bg-white text-black hover:bg-neutral-100'
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
              <div className="space-y-3 pt-2 border-t-2 border-dashed border-neutral-300">
                <label className="text-xs font-black uppercase text-black block">
                  ★ DISPLAY PREFERENCES (SRS 1.6 SPEC):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-neutral-600 uppercase block">THEME MODE:</span>
                    <select
                      value={prefTheme}
                      onChange={(e) => setPrefTheme(e.target.value as any)}
                      style={{ borderRadius: '0px' }}
                      className="w-full px-2 py-1.5 border-2 border-black text-xs bg-white font-mono cursor-pointer"
                    >
                      <option value="light">Light High-Contrast</option>
                      <option value="dark">Dark Cyberpunk</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-neutral-600 uppercase block">TEXT SCALE:</span>
                    <select
                      value={prefFontSize}
                      onChange={(e) => setPrefFontSize(e.target.value as any)}
                      style={{ borderRadius: '0px' }}
                      className="w-full px-2 py-1.5 border-2 border-black text-xs bg-white font-mono cursor-pointer"
                    >
                      <option value="standard">Standard (100%)</option>
                      <option value="large">Accessible Large (+12.5%)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-neutral-600 uppercase block">DEFAULT FANDOM:</span>
                    <select
                      value={prefLanding}
                      onChange={(e) => setPrefLanding(e.target.value)}
                      style={{ borderRadius: '0px' }}
                      className="w-full px-2 py-1.5 border-2 border-black text-xs bg-white font-mono cursor-pointer"
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
              <div className="pt-3 flex items-center justify-between border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  style={{ borderRadius: '0px' }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black uppercase text-white bg-[#ef4444] border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer hover:bg-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span>SIGN OUT</span>
                </button>

                <button
                  type="submit"
                  style={{ borderRadius: '0px' }}
                  className="px-6 py-2.5 bg-[#ff2e93] hover:bg-[#e11d48] text-white text-xs font-black uppercase tracking-wider cursor-pointer border-2 border-black shadow-[3px_3px_0px_#000] active:translate-y-0.5 transition-all"
                >
                  [SAVE PROFILE CHANGES]
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};

