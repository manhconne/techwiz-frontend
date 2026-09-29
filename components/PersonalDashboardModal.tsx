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
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { checkIsAdmin } from '../utils/authUtils';

interface PersonalDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  fandomThemeKey?: string;
  fandomCategory?: string;
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

const CATEGORY_OPTIONS = ['K-POP', 'MANGA', 'ANIME', 'GAMING', 'COMICS', 'MOVIES', 'TV SHOWS', 'COSPLAY', 'V-POP'];

export const PersonalDashboardModal: React.FC<PersonalDashboardModalProps> = ({ isOpen, onClose }) => {
  const { user, logout, updateProfile, toggleFavoriteFandom, activities } = useAuth();
  const { wishlist } = useCartWishlist();

  const [activeTab, setActiveTab] = useState<'overview' | 'fandoms' | 'activities' | 'bookmarks' | 'profile'>('overview');

  // Profile edit form
  const [editName, setEditName] = useState(user.name);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [editBio, setEditBio] = useState('Music lover, photocard collector, and passionate concert enthusiast!');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['K-POP', 'MANGA', 'ANIME']);
  const [saveToast, setSaveToast] = useState(false);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

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
        <div 
          style={{ flexShrink: 0 }}
          className="bg-[#ffd60a] text-black p-5 sm:p-6 relative border-b-3 border-black select-none shrink-0"
        >
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
            <div className="relative group shrink-0">
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
            <div className="text-center sm:text-left flex-1 min-w-0 space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#ff2e93] text-white border-2 border-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000]">
                <Sparkles className="w-3 h-3 text-white" />
                <span>{user.role === 'admin' ? 'SYSTEM ADMINISTRATOR (ADMIN)' : '★ FANDOM ELITE VIP MEMBER ✦'}</span>
              </div>

              {/* Tên & Nút Đăng Xuất cạnh nhau */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5">
                <h2 className="text-xl sm:text-2xl font-black text-black uppercase font-sans">
                  {greeting.text}, {user.name}! 🌟
                </h2>

                {/* LOGOUT BUTTON NEXT TO NAME */}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  style={{ borderRadius: '0px' }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ef4444] hover:bg-red-700 text-white text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer transition-all active:translate-y-0.5 shrink-0"
                  title="Sign out / Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>LOGOUT</span>
                </button>
              </div>

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

              {checkIsAdmin(user) && (
                <div className="pt-2 flex justify-center sm:justify-start">
                  <Link
                    href="/admin"
                    onClick={onClose}
                    style={{ borderRadius: '0px' }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000] transition-all active:scale-95 no-underline"
                  >
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>ACCESS ADMIN DASHBOARD</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. NAVIGATION TABS BAR                                    */}
        {/* ========================================================= */}
        <div 
          style={{ flexShrink: 0 }}
          className="px-4 sm:px-6 border-b-2 border-black bg-[#ecfeff] flex items-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-none py-3 shrink-0"
        >
          {[
            { id: 'overview', label: 'OVERVIEW', icon: Sparkles },
            { id: 'fandoms', label: 'FAVORITE FANDOMS', icon: Heart, count: user.favoriteFandoms.length },
            { id: 'activities', label: 'RECENT ACTIVITY', icon: Clock, count: activities.length },
            { id: 'bookmarks', label: 'BOOKMARKS', icon: Bookmark, count: wishlist.length },
            { id: 'profile', label: 'PROFILE & SETTINGS', icon: Edit3 },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{ borderRadius: '0px', flexShrink: 0 }}
                className={`flex items-center gap-2 py-2 px-3.5 text-xs font-black uppercase border-2 transition-all whitespace-nowrap cursor-pointer shrink-0 ${isActive
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
            style={{ borderRadius: '0px', flexShrink: 0 }}
            className="mx-6 mt-4 p-3 bg-[#ccff00] border-2 border-black text-black text-xs font-black flex items-center gap-2 shadow-[3px_3px_0px_#000] shrink-0"
          >
            <Check className="w-4 h-4 text-black" />
            <span>★ YOUR PROFILE HAS BEEN SUCCESSFULLY SYNCHRONIZED!</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. TAB CONTENT VIEWS                                      */}
        {/* ========================================================= */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 min-h-0 space-y-8 bg-[#fdfbf7]">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Stat Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-1 mb-8">
                <div style={{ borderRadius: '0px' }} className="p-4 bg-white border-2 border-black text-center shadow-[4px_4px_0px_#000]">
                  <span className="text-[10px] font-black text-neutral-600 uppercase">Fandoms Followed</span>
                  <div className="text-2xl font-black text-black mt-1 font-sans">{user.favoriteFandoms.length}</div>
                  <span className="text-[10px] text-[#ff2e93] font-bold">Official communities</span>
                </div>
                <div style={{ borderRadius: '0px' }} className="p-4 bg-white border-2 border-black text-center shadow-[4px_4px_0px_#000]">
                  <span className="text-[10px] font-black text-neutral-600 uppercase">Saved Items</span>
                  <div className="text-2xl font-black text-black mt-1 font-sans">{wishlist.length}</div>
                  <span className="text-[10px] text-cyan-600 font-bold">In your wishlist</span>
                </div>
                <div style={{ borderRadius: '0px' }} className="p-4 bg-white border-2 border-black text-center shadow-[4px_4px_0px_#000]">
                  <span className="text-[10px] font-black text-neutral-600 uppercase">Interaction History</span>
                  <div className="text-2xl font-black text-black mt-1 font-sans">{activities.length}</div>
                  <span className="text-[10px] text-emerald-600 font-bold">Reviews &amp; streams</span>
                </div>
                <div style={{ borderRadius: '0px' }} className="p-4 bg-white border-2 border-black text-center shadow-[4px_4px_0px_#000]">
                  <span className="text-[10px] font-black text-neutral-600 uppercase">Contribution Points</span>
                  <div className="text-2xl font-black text-black mt-1 font-sans">2,450</div>
                  <span className="text-[10px] bg-[#ffd60a] px-1 border border-black font-black">Diamond Tier ⭐</span>
                </div>
              </div>

              {/* Fandom Highlight Row */}
              <div className="mt-8 mb-8 space-y-4">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-black">
                  <h4 className="text-xs font-black uppercase text-black tracking-wider flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#ff2e93] fill-[#ff2e93]" />
                    <span>YOUR SUBSCRIBED FANDOMS ({user.favoriteFandoms.length})</span>
                  </h4>
                  <button
                    onClick={() => setActiveTab('fandoms')}
                    className="text-xs font-black text-[#ff2e93] hover:underline cursor-pointer"
                  >
                    [+ CREATE FANDOM // BROWSE ALL]
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 py-1">
                  {user.favoriteFandoms.map((fandom, idx) => (
                    <span
                      key={idx}
                      style={{ borderRadius: '0px' }}
                      className="px-4 py-2.5 bg-[#fdf2f8] text-[#ff2e93] border-2 border-black text-xs font-black flex items-center gap-2 shadow-[2px_2px_0px_#000]"
                    >
                      <Heart className="w-3.5 h-3.5 fill-[#ff2e93] text-[#ff2e93]" />
                      {fandom}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Activity Snapshot */}
              <div className="mt-8 mb-4 space-y-4">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-black">
                  <h4 className="text-xs font-black uppercase text-black tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neutral-600" />
                    <span>RECENT ACTIVITY</span>
                  </h4>
                  <button
                    onClick={() => setActiveTab('activities')}
                    className="text-xs font-black text-[#ff2e93] hover:underline cursor-pointer"
                  >
                    [VIEW ALL ({activities.length}) →]
                  </button>
                </div>

                <div className="space-y-3.5">
                  {activities.slice(0, 4).map((act) => (
                    <div
                      key={act.id}
                      style={{ borderRadius: '0px' }}
                      className="p-4 bg-white border-2 border-black flex items-center justify-between text-xs shadow-[3px_3px_0px_#000] hover:translate-x-1 transition-transform"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 bg-[#ff2e93] border border-black flex-shrink-0" />
                        <span className="font-bold text-black">{act.title}</span>
                      </div>
                      <span className="text-[11px] text-neutral-600 font-mono whitespace-nowrap ml-4">
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
            <div className="space-y-6">
              <div className="pb-3 border-b-2 border-black">
                <h4 className="text-sm font-black text-black uppercase">CHOOSE YOUR FAVORITE FANDOMS</h4>
                <p className="text-xs text-neutral-600 font-medium mt-1">
                  Click on fandoms to toggle following. Your newsfeed, recommendations, and interface will prioritize content from fandoms you follow.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                {ALL_FANDOM_OPTIONS.map((item) => {
                  const isFollowed = user.favoriteFandoms.includes(item.name);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleFavoriteFandom(item.name)}
                      style={{ borderRadius: '0px' }}
                      className={`p-4 border-2 border-black transition-all cursor-pointer flex items-center justify-between ${isFollowed
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
            <div className="space-y-6">
              <div className="pb-3 border-b-2 border-black">
                <h4 className="text-sm font-black text-black uppercase">YOUR ACTIVITY HISTORY</h4>
                <p className="text-xs text-neutral-600 font-medium mt-1">
                  Complete record of your interactions: trailer reviews, saved concert events, playlist additions, and community feedback.
                </p>
              </div>

              <div className="space-y-3.5 py-2">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    style={{ borderRadius: '0px' }}
                    className="p-4 sm:p-5 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between text-xs hover:translate-x-1 transition-transform"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-3.5 h-3.5 bg-[#ffd60a] border-2 border-black flex-shrink-0 shadow-[1px_1px_0px_#000]" />
                      <div>
                        <p className="font-bold text-black text-xs sm:text-sm">{act.title}</p>
                        <span className="text-[10px] text-neutral-500 font-mono mt-1 inline-block">{act.timestamp}</span>
                      </div>
                    </div>
                    {act.link && (
                      <Link
                        href={act.link}
                        onClick={onClose}
                        style={{ borderRadius: '0px' }}
                        className="text-[11px] font-black text-black bg-[#ffd60a] px-3.5 py-1.5 border-2 border-black hover:bg-[#ff2e93] hover:text-white flex items-center gap-1.5 shadow-[2px_2px_0px_#000] transition-colors ml-4 shrink-0"
                      >
                        <span>OPEN</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BOOKMARKS */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-5 my-2">
              <div>
                <h4 className="text-sm font-black text-black uppercase">SAVED ITEMS &amp; MEDIA</h4>
                <p className="text-xs text-neutral-600 font-medium">
                  Albums, photobooks, lightsticks, and media you have saved to track or prepare for pre-order.
                </p>
              </div>

              {wishlist.length === 0 ? (
                <div style={{ borderRadius: '0px' }} className="py-12 my-4 text-center bg-white border-2 border-black p-6 space-y-2 shadow-[3px_3px_0px_#000]">
                  <Bookmark className="w-8 h-8 text-neutral-400 mx-auto" />
                  <p className="text-xs font-bold text-black uppercase">NO SAVED ITEMS YET</p>
                  <p className="text-[11px] text-neutral-500">Click the bookmark button on products and trailers to save them here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                  {wishlist.map((item) => (
                    <div
                      key={item.album.id}
                      style={{ borderRadius: '0px' }}
                      className="p-3.5 my-1 border-2 border-black flex items-center gap-3 bg-white shadow-[3px_3px_0px_#000]"
                    >
                      <img
                        src={item.album.coverImage}
                        alt={item.album.title}
                        style={{ borderRadius: '0px', width: '56px', height: '56px' }}
                        className="object-cover border border-black shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-black text-[#ff2e93] block uppercase">{item.album.artist}</span>
                        <h5 className="text-xs font-bold text-black truncate uppercase font-sans">{item.album.title}</h5>
                        <span className="text-[11px] font-mono font-black text-black mt-0.5 block">
                          ${item.album.priceUSD} USD
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PROFILE & SETTINGS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6 my-2">
              <div>
                <h4 className="text-sm font-black text-black uppercase">Profile & Preferences</h4>
                <p className="text-xs text-neutral-600 font-medium">
                  Customize your fan presence, avatar identity, and display preferences.
                </p>
              </div>

              {/* Name */}
              <div className="space-y-1.5 my-3">
                <label className="text-xs font-black uppercase text-black">FANDOM DISPLAY NAME</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ borderRadius: '0px' }}
                  className="w-full px-3 py-2 border-2 border-black text-xs bg-white focus:outline-none focus:border-[#ff2e93] shadow-[1px_1px_0px_#000]"
                  required
                />
              </div>

              {/* Avatar Preset Selection */}
              <div className="space-y-2 my-3">
                <label className="text-xs font-black uppercase text-black">QUICK AVATAR SELECTION</label>
                <div className="flex flex-wrap gap-2.5 my-1.5">
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

                <div className="pt-2 my-2">
                  <label className="text-[11px] font-bold text-neutral-600">OR PASTE CUSTOM AVATAR URL:</label>
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    style={{ borderRadius: '0px' }}
                    className="w-full px-3 py-2 border-2 border-black text-xs bg-white focus:outline-none focus:border-[#ff2e93] mt-1 shadow-[1px_1px_0px_#000]"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5 my-3">
                <label className="text-xs font-black uppercase text-black">FANDOM BIO / MOTTO</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  style={{ borderRadius: '0px' }}
                  className="w-full px-3 py-2 border-2 border-black text-xs bg-white focus:outline-none focus:border-[#ff2e93] shadow-[1px_1px_0px_#000]"
                />
              </div>

              {/* Categories of Interest */}
              <div className="space-y-2 my-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-black">CATEGORIES OF INTEREST</label>
                  <span className="text-[11px] font-mono text-neutral-600 font-bold">{selectedCategories.length} selected</span>
                </div>
                <div className="flex flex-wrap gap-2 my-2">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        style={{ borderRadius: '0px' }}
                        className={`px-3 py-1.5 text-xs font-black uppercase border-2 transition-all cursor-pointer ${isSelected
                            ? 'bg-[#ff2e93] text-white border-black shadow-[2px_2px_0px_#000]'
                            : 'bg-white text-black border-black hover:bg-[#fff9db] shadow-[1px_1px_0px_#000]'
                          }`}
                      >
                        {isSelected ? `✓ ${cat}` : `+ ${cat}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-between border-t-2 border-black my-3">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  style={{ borderRadius: '0px' }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase text-white bg-[#ef4444] border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer hover:bg-red-700 active:translate-y-0.5 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>SIGN OUT</span>
                </button>

                <button
                  type="submit"
                  style={{ borderRadius: '0px' }}
                  className="px-6 py-2.5 bg-[#ff2e93] hover:bg-[#e11d48] text-white text-xs font-black uppercase tracking-wider cursor-pointer border-2 border-black shadow-[3px_3px_0px_#000] active:translate-y-0.5 transition-all"
                >
                  SAVE PROFILE CHANGES
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
