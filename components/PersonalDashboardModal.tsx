'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  User, 
  X, 
  Heart, 
  Bookmark, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
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
  ArrowRight
} from 'lucide-react';
import { useAuth, UserActivity } from '../context/AuthContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { checkIsAdmin } from '../utils/authUtils';

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
  { id: 'bunnies', name: 'Bunnies (NewJeans)', tag: 'K-Pop', color: '#38bdf8' },
  { id: 'blink', name: 'BLINK (BLACKPINK)', tag: 'K-Pop', color: '#f43f5e' },
  { id: 'army', name: 'A.R.M.Y (BTS)', tag: 'K-Pop', color: '#a855f7' },
  { id: 'carat', name: 'CARAT (SEVENTEEN)', tag: 'K-Pop', color: '#fb923c' },
  { id: 'stay', name: 'STAY (Stray Kids)', tag: 'K-Pop', color: '#eab308' },
  { id: 'my', name: 'MY (aespa)', tag: 'K-Pop', color: '#6366f1' },
  { id: 'dive', name: 'DIVE (IVE)', tag: 'K-Pop', color: '#ec4899' },
  { id: 'vpop', name: 'FC Anh Trai Say Hi', tag: 'V-Pop', color: '#10b981' },
  { id: 'anime', name: 'Demon Slayer & Anime Otaku', tag: 'Anime', color: '#ef4444' },
  { id: 'gaming', name: 'T1 & League of Legends', tag: 'Gaming', color: '#06b6d4' },
];

export const PersonalDashboardModal: React.FC<PersonalDashboardModalProps> = ({ isOpen, onClose }) => {
  const { user, isLoggedIn, logout, updateProfile, toggleFavoriteFandom, activities } = useAuth();
  const { wishlist } = useCartWishlist();

  const [activeTab, setActiveTab] = useState<'overview' | 'fandoms' | 'activities' | 'bookmarks' | 'profile'>('overview');
  
  // Profile edit form
  const [editName, setEditName] = useState(user.name);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [editBio, setEditBio] = useState('Yêu âm nhạc, mê săn photocard và cháy hết mình cùng concert thần tượng!');
  const [saveToast, setSaveToast] = useState(false);

  // Personalized Greeting calculation
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Chào buổi sáng', sub: 'Chúc bạn một ngày tràn đầy năng lượng cùng âm nhạc!' };
    if (hour < 18) return { text: 'Chào buổi chiều', sub: 'Cùng khám phá những sự kiện và sản phẩm comeback mới nhất!' };
    return { text: 'Chào buổi tối', sub: 'Thư giãn cùng podcast và bản nhạc yêu thích sau một ngày dài!' };
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
      >
        
        {/* ========================================================= */}
        {/* 1. DASHBOARD HEADER & PERSONAL GREETING                   */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Đóng Dashboard"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* User Avatar with Badge */}
            <div className="relative group">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-3 border-amber-400 shadow-xl"
              />
              <button
                onClick={() => setActiveTab('profile')}
                className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-lg bg-amber-400 text-slate-950 hover:scale-110 transition-transform shadow-md"
                title="Thay đổi ảnh đại diện"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* User Info & Personalized Greeting */}
            <div className="text-center sm:text-left flex-1 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{user.role === 'admin' ? 'CHỦ NHIỆM HỆ THỐNG (ADMIN)' : 'FANDOM ELITE VIP MEMBER'}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white">
                {greeting.text}, {user.name}! 🌟
              </h2>
              <p className="text-xs text-slate-300 font-normal">
                {greeting.sub}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 font-medium">
                <span>Email: <strong className="text-slate-200">{user.email}</strong></span>
                <span>•</span>
                <span>Thành viên từ: <strong className="text-slate-200">{user.memberSince || '2024'}</strong></span>
                <span>•</span>
                <span className="text-amber-400 font-bold">Cấp độ: Diamond Stan ⭐</span>
              </div>

              {checkIsAdmin(user) && (
                <div className="pt-3 flex justify-center sm:justify-start">
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 no-underline"
                  >
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Vào Bảng Điều Khiển Admin (Dashboard)</span>
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
        <div className="px-6 border-b border-slate-200 bg-slate-50 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Tổng Quan', icon: Sparkles },
            { id: 'fandoms', label: 'Fandom Yêu Thích', icon: Heart, count: user.favoriteFandoms.length },
            { id: 'activities', label: 'Hoạt Động Gần Đây', icon: Clock, count: activities.length },
            { id: 'bookmarks', label: 'Đã Bookmark', icon: Bookmark, count: wishlist.length },
            { id: 'profile', label: 'Hồ Sơ & Cài Đặt', icon: Edit3 },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-slate-950 text-slate-950 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                    isActive ? 'bg-slate-950 text-white' : 'bg-slate-200 text-slate-600'
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
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Thông tin hồ sơ và sở thích fandom của bạn đã được cập nhật thành công!</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. TAB CONTENT VIEWS                                      */}
        {/* ========================================================= */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stat Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[11px] font-black text-slate-500 uppercase">Fandom Theo Dõi</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{user.favoriteFandoms.length}</div>
                  <span className="text-[10px] text-amber-600 font-semibold">Cộng đồng chính thức</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[11px] font-black text-slate-500 uppercase">Vật Phẩm Đã Lưu</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{wishlist.length}</div>
                  <span className="text-[10px] text-sky-600 font-semibold">Trong danh sách ước</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[11px] font-black text-slate-500 uppercase">Lịch Sử Tương Tác</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{activities.length}</div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Đánh giá & phát sóng</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[11px] font-black text-slate-500 uppercase">Điểm Cống Hiến</span>
                  <div className="text-2xl font-black text-purple-600 mt-1">2,450</div>
                  <span className="text-[10px] text-purple-600 font-semibold">Hạng Kim Cương ⭐</span>
                </div>
              </div>

              {/* Fandom Highlight Row */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Fandom Của Bạn
                  </h4>
                  <button
                    onClick={() => setActiveTab('fandoms')}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700"
                  >
                    Quản lý (+ Thêm fandom)
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {user.favoriteFandoms.map((fandom, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      {fandom}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Activity Snapshot */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> Hoạt Động Gần Đây Nhất
                  </h4>
                  <button
                    onClick={() => setActiveTab('activities')}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700"
                  >
                    Xem toàn bộ ({activities.length})
                  </button>
                </div>

                <div className="space-y-2">
                  {activities.slice(0, 3).map((act) => (
                    <div
                      key={act.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="font-semibold text-slate-800">{act.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap ml-2">
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
                <h4 className="text-sm font-black text-slate-900">Chọn Fandom Yêu Thích Của Bạn</h4>
                <p className="text-xs text-slate-500">
                  Nhấp vào các fandom để bật hoặc tắt theo dõi. Bảng tin, sản phẩm gợi ý và giao diện sẽ tự động ưu tiên nội dung thuộc fandom bạn yêu mến.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {ALL_FANDOM_OPTIONS.map((item) => {
                  const isFollowed = user.favoriteFandoms.includes(item.name);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleFavoriteFandom(item.name)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isFollowed
                          ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-300 shadow-sm'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">{item.name}</h5>
                          <span className="text-[10px] text-slate-500 font-semibold">{item.tag}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          isFollowed
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isFollowed ? 'Đang Theo Dõi ✓' : '+ Theo Dõi'}
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
                <h4 className="text-sm font-black text-slate-900">Lịch Sử Hoạt Động Của Bạn</h4>
                <p className="text-xs text-slate-500">
                  Toàn bộ các hành động tương tác: đánh giá trailer, lưu sự kiện concert, thêm vào playlist và phản hồi cộng đồng.
                </p>
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activities.map((act) => (
                  <div key={act.id} className="relative group">
                    <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-amber-400 border-2 border-white ring-2 ring-amber-400/30" />
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-xs flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{act.title}</p>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 inline-block">{act.timestamp}</span>
                      </div>
                      {act.link && (
                        <Link
                          href={act.link}
                          onClick={onClose}
                          className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                        >
                          <span>Mở</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BOOKMARKS */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-black text-slate-900">Danh Sách Vật Phẩm & Nội Dung Đã Lưu</h4>
                <p className="text-xs text-slate-500">
                  Các album, photobook, lightstick và nội dung bạn đã bấm lưu để theo dõi hoặc chuẩn bị đặt trước.
                </p>
              </div>

              {wishlist.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-2">
                  <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Chưa có vật phẩm nào được lưu</p>
                  <p className="text-[11px] text-slate-500">Hãy nhấn biểu tượng trái tim hoặc nút bookmark trên các sản phẩm và trailer để lưu vào đây.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {wishlist.map((item) => (
                    <div key={item.album.id} className="p-3 rounded-xl border border-slate-200 flex items-center gap-3 bg-white hover:border-slate-300">
                      <img
                        src={item.album.coverImage}
                        alt={item.album.title}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-amber-600 block">{item.album.artist}</span>
                        <h5 className="text-xs font-black text-slate-900 truncate">{item.album.title}</h5>
                        <span className="text-[11px] font-mono font-bold text-slate-700 mt-0.5 block">
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
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <h4 className="text-sm font-black text-slate-900">Quản Lý Hồ Sơ Cá Nhân</h4>
                <p className="text-xs text-slate-500">
                  Cập nhật tên hiển thị, hình đại diện và tiểu sử fandom của bạn.
                </p>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tên Hiển Thị Fandom:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              {/* Avatar Preset Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Chọn Ảnh Đại Diện Nhanh:</label>
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
                      className={`w-12 h-12 rounded-xl object-cover cursor-pointer transition-all ${
                        selectedAvatar === url && !customAvatarUrl
                          ? 'border-2 border-amber-500 ring-2 ring-amber-400/40 scale-105'
                          : 'border border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>

                <div className="pt-2">
                  <label className="text-[11px] font-bold text-slate-500">Hoặc dán URL ảnh đại diện tùy chỉnh:</label>
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 mt-1"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tiểu Sử / Khẩu Hiệu Fandom:</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng Xuất Tài Khoản</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-md"
                >
                  Lưu Thay Đổi Hồ Sơ
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
