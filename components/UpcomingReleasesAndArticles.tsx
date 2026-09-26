'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Heart, 
  MessageSquare, 
  Flame, 
  Bell, 
  Check, 
  ShoppingBag, 
  MapPin,
  Ticket,
  Sparkles,
} from 'lucide-react';
import { mockFeaturedArticles, mockUpcomingReleases } from '../data/mockData';
import { FandomCategoryKey, UpcomingRelease } from '../types';
import { useCartWishlist } from '../context/CartWishlistContext';

interface UpcomingReleasesAndArticlesProps {
  initialCategory?: FandomCategoryKey | 'all';
  onSelectCategory?: (category: FandomCategoryKey | 'all') => void;
}

export const UpcomingReleasesAndArticles: React.FC<UpcomingReleasesAndArticlesProps> = ({
  initialCategory = 'all',
  onSelectCategory,
}) => {
  const { addToCart, setIsCartOpen } = useCartWishlist();
  const [activeCategory, setActiveCategory] = useState<FandomCategoryKey | 'all'>(initialCategory);
  const [remindedItems, setRemindedItems] = useState<Record<string, boolean>>({});
  const [likedArticles, setLikedArticles] = useState<Record<string, number>>({});

  // Sync with initialCategory if parent changes
  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const handleCategoryClick = (cat: FandomCategoryKey | 'all') => {
    setActiveCategory(cat);
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
  };

  // Toggle Reminder Alert
  const toggleReminder = (id: string) => {
    setRemindedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle Like Article
  const toggleLike = (id: string, currentLikes: number) => {
    setLikedArticles(prev => ({
      ...prev,
      [id]: prev[id] ? prev[id] - 1 : (currentLikes + 1)
    }));
  };

  // Add Upcoming Release to Cart & Open Drawer
  const handlePreOrder = (rel: UpcomingRelease) => {
    addToCart({
      id: `upcoming-${rel.id}`,
      title: rel.title,
      artist: rel.creatorOrArtist,
      artistId: rel.creatorOrArtist.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category: rel.category,
      priceUSD: rel.priceUSD,
      priceVND: rel.priceVND,
      coverImage: rel.coverImage,
      galleryImages: [rel.coverImage],
      type: rel.type,
      releaseDate: rel.releaseDate,
      tag: rel.badgeText || 'Pre-Order Drop',
      rating: 5.0,
      reviewCount: 1,
      popularityScore: 95,
      stock: 50,
      description: `Official Scheduled Drop. Perks: ${rel.perks?.join(', ')}`,
      versions: [{ id: 'standard', name: 'Official Scheduled Drop', extraPriceUSD: 0 }],
      inclusions: rel.perks || ['Official Scheduled Drop'],
      photocards: [],
      tracks: [],
      reviews: []
    });
    setIsCartOpen(true);
  };

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    if (activeCategory === 'all') return mockFeaturedArticles;
    return mockFeaturedArticles.filter(art => art.category === activeCategory);
  }, [activeCategory]);

  // Filtered Upcoming Releases
  const filteredReleases = useMemo(() => {
    if (activeCategory === 'all') return mockUpcomingReleases;
    return mockUpcomingReleases.filter(rel => rel.category === activeCategory);
  }, [activeCategory]);

  const categories: (FandomCategoryKey | 'all')[] = [
    'all',
    'K-Pop',
    'Anime',
    'Gaming',
    'Manga',
    'Comics',
    'Movies',
    'TV Shows',
    'Cosplay'
  ];

  const isKpopTheme = activeCategory === 'K-Pop';
  const isAllFandoms = activeCategory === 'all';

  const categoryDotColor = (cat: string) => {
    switch (cat) {
      case 'K-Pop': return 'bg-blue-500';
      case 'Anime': return 'bg-lime-500';
      case 'Gaming': return 'bg-purple-500';
      case 'Comics': return 'bg-red-500';
      case 'Manga': return 'bg-slate-400';
      case 'Movies': return 'bg-amber-500';
      case 'TV Shows': return 'bg-yellow-500';
      case 'Cosplay': return 'bg-emerald-500';
      default: return 'bg-sky-500';
    }
  };

  return (
    <section 
      className="w-full py-16 md:py-24 transition-all duration-300 relative"
      style={{
        backgroundColor: 'transparent',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* ==================== 1. SECTION HEADER & DYNAMIC FILTER BAR ==================== */}
        <div>
          {/* Top Row: Eyebrow label + Unified Category Tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '32px',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-full bg-white/95 border border-slate-200/90 shadow-2xs">
              <span 
                style={{ 
                  width: '8px', 
                  height: '8px', 
                  backgroundColor: isKpopTheme ? '#2563eb' : '#0f172a', 
                  display: 'inline-block', 
                  borderRadius: '50%' 
                }} 
              />
              <span
                style={{
                  fontSize: '10.5px',
                  fontFamily: 'inherit',
                  fontWeight: 800,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: isKpopTheme ? '#1e40af' : '#334155',
                }}
              >
                {isKpopTheme ? 'K-Pop Fandom Radar · Tokyo Dome & Weverse Schedule' : 'Editorial Radar · Release Calendar'}
              </span>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-3.5 sm:gap-6 overflow-x-auto scrollbar-none max-w-full px-6 py-3 rounded-full bg-white/95 border border-slate-200/90 shadow-xs backdrop-blur-md">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    type="button"
                    style={{
                      padding: '4px 0 6px 0',
                      fontSize: '11.5px',
                      fontWeight: isSelected ? 800 : 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: isSelected ? (isKpopTheme ? '#1d4ed8' : '#0f172a') : '#64748b',
                      background: 'none',
                      border: 'none',
                      borderBottom: isSelected 
                        ? `2.5px solid ${isKpopTheme ? '#2563eb' : '#0f172a'}` 
                        : '2.5px solid transparent',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                    }}
                    className="hover:text-slate-900"
                  >
                    {cat === 'all' ? 'All Fandoms' : cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Title Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              paddingBottom: '28px',
              borderBottom: '1px solid #e2e8f0',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 'clamp(28px, 3.2vw, 46px)',
                  lineHeight: 1.15,
                  fontWeight: 900,
                  color: '#0f172a',
                  letterSpacing: '-0.025em',
                  margin: 0,
                }}
              >
                Trending Articles{' '}
                <em style={{ fontWeight: 400, color: '#64748b', fontStyle: 'italic', fontFamily: 'serif' }}>
                  &amp; Release Schedule
                </em>
              </h2>
            </div>

            <div className="px-4.5 py-2.5 rounded-full flex items-center gap-2.5 bg-white/95 border border-slate-200/90 shadow-2xs">
              <span style={{ fontSize: '12.5px', color: '#334155', fontWeight: 600 }}>
                <strong style={{ color: isKpopTheme ? '#1d4ed8' : '#0f172a', fontWeight: 900, fontSize: '15px' }}>
                  {filteredArticles.length}
                </strong>{' '}
                articles &nbsp;·&nbsp;{' '}
                <strong style={{ color: isKpopTheme ? '#1d4ed8' : '#0f172a', fontWeight: 900, fontSize: '15px' }}>
                  {filteredReleases.length}
                </strong>{' '}
                releases
              </span>
            </div>
          </div>
        </div>

        {/* ==================== 2. MAIN SPLIT CONTENT GRID ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mt-12 md:mt-16">
          
          {/* -------------------- COLUMN A: FEATURED ARTICLES (7 COLS) -------------------- */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <div className={`w-3.5 h-3.5 rounded-full ${isKpopTheme ? 'bg-blue-600 shadow-[0_0_10px_#2563eb]' : 'bg-red-500'} animate-pulse`} />
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                  Featured Articles &amp; Fandom Dispatches
                </h3>
              </div>
              <span 
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  isKpopTheme 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs' 
                    : 'bg-white/95 text-slate-700 border border-slate-200/90 shadow-2xs'
                }`}
              >
                {filteredArticles.length} Articles
              </span>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="p-8 text-center bg-white/90 rounded-2xl border border-dashed border-slate-300 text-slate-500 text-sm">
                No articles found in this category.
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {filteredArticles.map((art) => {
                  const likesCount = likedArticles[art.id] !== undefined ? likedArticles[art.id] : art.likes;

                  return (
                    <article
                      key={art.id}
                      className={`group rounded-2xl transition-all duration-300 overflow-hidden flex flex-col sm:flex-row ${
                        isKpopTheme 
                          ? 'bg-white border border-slate-200/90 hover:border-blue-500/50 hover:shadow-[0_16px_36px_-4px_rgba(37,99,235,0.12)] hover:-translate-y-1' 
                          : isAllFandoms
                          ? 'bg-white border border-slate-200/90 hover:border-slate-800 hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)] hover:-translate-y-1'
                          : art.category === 'Anime'
                          ? 'bg-white border border-lime-200 hover:border-lime-500 hover:shadow-lg'
                          : art.category === 'Gaming'
                          ? 'bg-white border border-purple-200 hover:border-purple-500 hover:shadow-lg'
                          : art.category === 'Manga'
                          ? 'bg-white border border-neutral-300 hover:border-black hover:shadow-lg'
                          : art.category === 'Comics'
                          ? 'bg-white border border-amber-200 hover:border-red-500 hover:shadow-lg'
                          : 'bg-white border border-slate-200 hover:border-amber-500 hover:shadow-lg'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="sm:w-[42%] relative min-h-[220px] sm:min-h-[280px] overflow-hidden bg-slate-900 shrink-0">
                        <img 
                          src={art.coverImage} 
                          alt={art.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden" />

                        {/* Top Category Badge */}
                        <div className="absolute top-3.5 left-3.5 z-10">
                          {isAllFandoms ? (
                            /* Clean Luxury All Fandoms Badge */
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                              <span className={`w-2 h-2 rounded-full ${categoryDotColor(art.category)}`} />
                              <span>{art.category}</span>
                            </span>
                          ) : isKpopTheme ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/95 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              <span>{art.badgeText || 'K-POP EXCLUSIVE'}</span>
                            </span>
                          ) : art.category === 'Anime' ? (
                            <span className="streetwear-tag text-[9px]">
                              {art.badgeText || 'ANIME STREET'}
                            </span>
                          ) : art.category === 'Gaming' ? (
                            <span className="gaming-hud-badge text-[9px] bg-black/80 text-lime-400 border-lime-400">
                              {art.badgeText || '⚡ GAMING'}
                            </span>
                          ) : art.category === 'Manga' ? (
                            <span className="manga-tag text-[9px]">
                              {art.badgeText || '✦ MANGA'}
                            </span>
                          ) : art.category === 'Comics' ? (
                            <span className="comic-burst-tag text-[9px]">
                              {art.badgeText || '💥 COMICS'}
                            </span>
                          ) : (
                            <span className="cinema-badge text-[9px] bg-black/80">
                              {art.badgeText || '🎬 CINEMA'}
                            </span>
                          )}
                        </div>

                        {art.isHot && (
                          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                            <Flame size={11} className="fill-current" />
                            <span>HOT</span>
                          </div>
                        )}
                      </div>

                      {/* Content Body */}
                      <div className="p-6 sm:p-7 md:p-8 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Author & Meta */}
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-3.5">
                            <div className="flex items-center gap-2">
                              <img 
                                src={art.author.avatar} 
                                alt={art.author.name}
                                className="w-6 h-6 rounded-full object-cover border border-slate-200" 
                              />
                              <span 
                                className="font-bold text-slate-900"
                                style={{ fontSize: '11.5px' }}
                              >
                                {art.author.name}
                              </span>
                            </div>
                            <div 
                              className="flex items-center gap-1.5 text-slate-500 font-semibold"
                              style={{ fontSize: '11px' }}
                            >
                              <Clock size={13} />
                              <span>{art.readTime}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h4 className="text-base sm:text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 mb-3">
                            {art.title.replace('GAME START: ', '')}
                          </h4>

                          {/* Excerpt */}
                          <p className="text-xs sm:text-sm text-slate-600 mb-3.5 line-clamp-3 font-normal leading-relaxed">
                            {art.excerpt}
                          </p>

                          {/* Event Data Panel or Quote */}
                          {isKpopTheme ? (
                            <div className="p-3.5 bg-gradient-to-r from-blue-50/90 via-sky-50/60 to-blue-50/90 border border-blue-200/80 rounded-xl my-3.5 text-xs shadow-2xs">
                              <div className="flex items-center justify-between border-b border-blue-200/60 pb-1.5 mb-2 font-bold text-blue-950">
                                <span className="flex items-center gap-1.5">
                                  <MapPin size={12} className="text-blue-600" />
                                  <span>Tokyo Dome Stadium · Live World Tour</span>
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[9px] font-bold uppercase tracking-wider">
                                  VIP STAGE PASS
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-blue-900 font-medium">
                                <div className="flex items-center gap-1.5">
                                  <Calendar size={11} className="text-blue-600" />
                                  <span>January 21 &amp; 22, 2026</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Ticket size={11} className="text-emerald-600" />
                                  <span className="text-emerald-700 font-bold">100% Certified Pass</span>
                                </div>
                                <div className="sm:col-span-2 text-slate-600 text-[10.5px]">
                                  Artist: <strong className="text-blue-950">TXT &amp; Soobin</strong> · Fan Support: <span className="font-mono text-blue-800 font-bold">ForeverKookie_</span>
                                </div>
                              </div>
                            </div>
                          ) : art.category === 'K-Pop' ? (
                            /* Modern Editorial Event Strip for All Fandoms */
                            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl my-3 text-xs">
                              <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5 mb-2 font-bold text-slate-800">
                                <span className="flex items-center gap-1.5">
                                  <MapPin size={12} className="text-blue-600" />
                                  <span>Tokyo Dome Stadium</span>
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                  STAGE PASS // 2026
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                                <div className="flex items-center gap-1.5">
                                  <Calendar size={11} className="text-slate-400" />
                                  <span>January 21 &amp; 22, 2026</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Ticket size={11} className="text-emerald-600" />
                                  <span className="text-emerald-700 font-semibold">100% Verified Pass</span>
                                </div>
                                <div className="sm:col-span-2 text-slate-500 text-[10.5px]">
                                  Artist: <strong className="text-slate-800">TXT &amp; Soobin</strong> · Fan Support: <span className="font-mono text-slate-700 font-medium">ForeverKookie_</span>
                                </div>
                              </div>
                            </div>
                          ) : art.accentQuote ? (
                            <div 
                              className="my-3.5"
                              style={{
                                fontSize: '11px',
                                fontWeight: '600',
                                color: '#475569',
                                borderLeft: isKpopTheme ? '2.5px solid #2563eb' : '2.5px solid #0f172a',
                                paddingLeft: '10px'
                              }}
                            >
                              {art.accentQuote}
                            </div>
                          ) : null}
                        </div>

                        {/* Tags & Action Stats */}
                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 flex-wrap">
                            {art.tags.slice(0, 2).map((t, i) => (
                              <span 
                                key={i} 
                                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-[11px] transition-colors"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleLike(art.id, art.likes)}
                              type="button"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-500 border border-slate-200/80 transition-all text-xs font-semibold cursor-pointer"
                              title="Like"
                            >
                              <Heart size={13} className={likedArticles[art.id] ? 'fill-red-500 text-red-500' : ''} />
                              <span className="text-xs font-bold text-slate-700">{likesCount}</span>
                            </button>

                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200/80 text-xs font-semibold">
                              <MessageSquare size={13} />
                              <span className="text-xs font-bold text-slate-700">{art.commentsCount}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* -------------------- COLUMN B: UPCOMING RELEASES (5 COLS) -------------------- */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <Calendar size={18} className={isKpopTheme ? 'text-blue-600' : 'text-amber-500'} />
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                  Upcoming Releases
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-800 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200/90 shadow-2xs font-mono">
                {filteredReleases.length} Scheduled Drops
              </span>
            </div>

            {filteredReleases.length === 0 ? (
              <div className="p-8 text-center bg-white/90 rounded-2xl border border-dashed border-slate-300 text-slate-500 text-sm">
                No upcoming drops scheduled in this category.
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {filteredReleases.map((rel) => {
                  const isReminded = remindedItems[rel.id];

                  return (
                    <div
                      key={rel.id}
                      className={`p-5 sm:p-6 md:p-7 flex flex-col gap-4 group relative overflow-hidden bg-white rounded-2xl border border-slate-200/90 hover:border-blue-500/50 hover:shadow-[0_16px_36px_-4px_rgba(37,99,235,0.12)] hover:-translate-y-1 transition-all duration-300`}
                    >
                      {/* Top Header: Badge & Days Countdown */}
                      <div className="flex items-center justify-between gap-2.5">
                        <span className={`px-3 py-1 text-[10.5px] font-mono font-extrabold uppercase rounded-full tracking-wider ${
                          isKpopTheme ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}>
                          {rel.badgeText || rel.status}
                        </span>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold">
                          <Clock size={12} className="text-amber-600" />
                          <span>{rel.daysRemaining} days left</span>
                        </div>
                      </div>

                      {/* Main Release Info */}
                      <div className="flex items-start gap-4 sm:gap-5">
                        <img 
                          src={rel.coverImage} 
                          alt={rel.title}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover shrink-0 group-hover:scale-105 transition-transform rounded-xl border border-slate-200" 
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            {rel.category} • {rel.type}
                          </span>
                          <h5 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                            {rel.title}
                          </h5>
                          <p className="text-xs text-slate-500 font-medium truncate mt-1">
                            By: {rel.creatorOrArtist}
                          </p>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-slate-950 text-base font-black">
                              ${rel.priceUSD}
                            </span>
                            <span 
                              className="text-slate-500 font-semibold"
                              style={{ fontFamily: "'Fira Code', monospace", fontSize: '12px' }}
                            >
                              ({rel.priceVND.toLocaleString('vi-VN')} ₫)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Inclusions / Perks */}
                      {rel.perks && rel.perks.length > 0 && (
                        <div className={`${isKpopTheme ? 'bg-blue-50/60 border-blue-100' : 'bg-slate-50/80 border-slate-100'} p-3.5 rounded-xl border text-xs text-slate-600 flex flex-col gap-1.5 my-1`}>
                          <div className="flex items-center justify-between text-[10.5px] font-bold uppercase tracking-wider">
                            <span className={isKpopTheme ? 'text-blue-900' : 'text-slate-500'}>INCLUSIONS &amp; PERKS:</span>
                            <span className={isKpopTheme ? 'text-blue-600 font-semibold' : 'text-slate-400 font-semibold'}>{rel.category} Official</span>
                          </div>
                          <div className="flex flex-col gap-1 text-[11.5px] text-slate-700 font-medium">
                            {(isKpopTheme ? [
                              'Collector Hologram Photocard Set (5ea)',
                              'Official Lightstick Keyring Charm',
                              '120-Page Stage Monograph & Deluxe Box',
                              'Exclusive Tokyo Dome Pass POB'
                            ] : rel.perks).slice(0, 4).map((perk, pIdx) => (
                              <div key={pIdx} className="flex items-center gap-2 truncate">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isKpopTheme ? 'bg-blue-600' : 'bg-slate-400'}`} />
                                <span className="truncate">{perk}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 pt-3.5 mt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handlePreOrder(rel)}
                          style={isKpopTheme ? {
                            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                            color: '#ffffff',
                          } : { 
                            backgroundColor: '#000000', 
                            color: '#ffffff' 
                          }}
                          className={`flex-1 py-3 px-4 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow-md ${
                            isKpopTheme 
                              ? 'hover:brightness-110' 
                              : 'hover:bg-slate-800'
                          }`}
                        >
                          <ShoppingBag size={14} style={{ color: '#ffffff' }} />
                          <span style={{ color: '#ffffff' }}>Pre-Order Now</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleReminder(rel.id)}
                          className={`p-3 rounded-xl border transition-colors cursor-pointer flex items-center justify-center ${
                            isReminded 
                              ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-xs' 
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                          title={isReminded ? 'Reminder set' : 'Remind me when dropped'}
                        >
                          {isReminded ? <Check size={16} strokeWidth={2.5} /> : <Bell size={16} strokeWidth={2} />}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick VIP Banner Alert */}
            <div 
              style={{
                background: isKpopTheme 
                  ? 'linear-gradient(135deg, #020617 0%, #0f172a 45%, #1e3a8a 100%)' 
                  : 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
              }}
              className="mt-8 p-6 rounded-2xl flex items-center justify-between shadow-lg text-white border border-blue-900/30"
            >
              <div>
                <span className={`text-[10.5px] font-mono font-bold uppercase tracking-wider block ${
                  isKpopTheme ? 'text-blue-400' : 'text-amber-400'
                }`}>
                  {isKpopTheme ? '★ FANDOM VIP MEMBERSHIP &amp; PRIORITY ALLOCATION' : '★ FANDOM VIP MEMBERSHIP'}
                </span>
                <h4 className="text-base font-extrabold leading-tight mt-1 text-white">
                  Get 24H Early Drop Access &amp; Priority Allocation
                </h4>
              </div>
              <button 
                type="button"
                onClick={() => alert('VIP membership pass claimed!')}
                style={isKpopTheme ? {
                  background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                } : {}}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
                  isKpopTheme 
                    ? 'hover:brightness-110 text-white' 
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                }`}
              >
                <span>JOIN VIP</span>
                <span>★</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
