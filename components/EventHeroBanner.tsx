'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { mockTourEvents } from '../data/mockData';
import { TourEvent, FandomCategoryKey } from '../types';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Flame, 
  Trophy, 
  Compass,
  ArrowUpRight,
  BookOpen,
  Film,
  Zap,
  PenTool,
  Shirt,
  Tv
} from 'lucide-react';

export type HeroBannerCategory = FandomCategoryKey | 'all';

interface EventHeroBannerProps {
  onSelectEvent?: (event: TourEvent) => void;
  activeCategory?: HeroBannerCategory;
  onSelectCategory?: (category: HeroBannerCategory) => void;
}

export const EventHeroBanner: React.FC<EventHeroBannerProps> = ({ 
  onSelectEvent,
  activeCategory: propActiveCategory,
  onSelectCategory
}) => {
  const { formatPrice } = useCartWishlist();
  const [internalCategory, setInternalCategory] = useState<HeroBannerCategory>('all');

  // Unified active category from props or internal state
  const currentCategory = propActiveCategory !== undefined ? propActiveCategory : internalCategory;

  const handleSelectTab = (cat: HeroBannerCategory) => {
    setInternalCategory(cat);
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
  };

  // Distinct Authentic Visual Style DNA for each category (Inspired by user's images 1-5)
  const themeStyles = useMemo(() => {
    switch (currentCategory) {
      case 'K-Pop':
        return {
          id: 'kpop',
          label: 'K-Pop Universe',
          bgGradient: 'linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 50%, #f8fafc 100%)',
          watermark: 'K-POP GLOBAL UNIVERSE • STADIUM WORLD TOUR • OFFICIAL MERCH',
          glow: 'rgba(37, 99, 235, 0.25)',
          accentPillBg: '#2563eb',
          accentPillText: '#ffffff',
          tagline: 'HYBE · YG · SM · JYP · WEVERSE · WORLD TOUR ARENA',
          taglineColor: '#1d4ed8',
          cornerBadge: 'bg-blue-950 text-blue-200 border-blue-400/50',
          accentDot: '#2563eb',
          activeTabIconColor: '#2563eb',
          primaryBtnBg: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
          primaryBtnBorder: '1px solid rgba(255, 255, 255, 0.25)',
          primaryBtnColor: '#ffffff',
          primaryBtnShadow: '0 8px 24px -2px rgba(37, 99, 235, 0.4)',
          primaryBtnHoverShadow: '0 12px 28px 0px rgba(37, 99, 235, 0.6)',
          primaryBtnIconColor: '#ffffff',
          slideActiveColor: '#2563eb',
          slideGlowColor: 'rgba(37, 99, 235, 0.35)',
          mainBtnBg: '#2563eb',
          fontStyle: "'Plus Jakarta Sans', sans-serif",
          isPixel: false,
          isHalftone: false,
          isCyber: false,
          isComic: false,
          isManga: false,
          isCinema: false,
          isTv: false,
        };
      case 'Anime':
        return {
          id: 'anime',
          label: 'Anime Streetwear',
          bgGradient: 'linear-gradient(135deg, #f7fee7 0%, #ecfccb 40%, #ffffff 85%)',
          watermark: 'SHONEN JUMP • HALFTONE MANGA • PEDIDO STREETWEAR',
          glow: 'rgba(132, 204, 22, 0.35)',
          accentPillBg: '#84cc16',
          accentPillText: '#000000',
          tagline: 'UFOTABLE · ANIPLEX · TOEI · STUDIO GHIBLI · HARAJUKU',
          taglineColor: '#4d7c0f',
          cornerBadge: 'bg-black text-lime-400 border-lime-500',
          accentDot: '#84cc16',
          activeTabIconColor: '#84cc16',
          primaryBtnBg: '#000000',
          primaryBtnBorder: '2px solid #84cc16',
          primaryBtnColor: '#a3e635',
          primaryBtnShadow: '3px 3px 0px #84cc16',
          primaryBtnHoverShadow: '5px 5px 0px #84cc16',
          primaryBtnIconColor: '#a3e635',
          slideActiveColor: '#84cc16',
          slideGlowColor: 'rgba(132, 204, 22, 0.5)',
          mainBtnBg: '#000000',
          fontStyle: "'Plus Jakarta Sans', sans-serif",
          isPixel: false,
          isHalftone: true,
          isCyber: false,
          isComic: false,
          isManga: false,
          isCinema: false,
          isTv: false,
        };
      case 'Cosplay':
        return {
          id: 'cosplay',
          label: 'Cosplay World',
          bgGradient: 'linear-gradient(135deg, #09090b 0%, #18181b 45%, #052e16 85%)',
          watermark: 'COSPLAY EXPO 2026 • HARAJUKU SHINOBI • PROP CRAFT',
          glow: 'rgba(57, 255, 20, 0.38)',
          accentPillBg: '#10b981',
          accentPillText: '#000000',
          tagline: 'TACTICAL LED ARMOR · PROP FABRICATION · COSPLAY EXPO',
          taglineColor: '#34d399',
          cornerBadge: 'bg-black text-emerald-300 border-emerald-500',
          accentDot: '#39ff14',
          activeTabIconColor: '#39ff14',
          primaryBtnBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          primaryBtnBorder: '1.5px solid #34d399',
          primaryBtnColor: '#000000',
          primaryBtnShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
          primaryBtnHoverShadow: '0 0 28px rgba(16, 185, 129, 0.7)',
          primaryBtnIconColor: '#000000',
          slideActiveColor: '#10b981',
          slideGlowColor: 'rgba(16, 185, 129, 0.5)',
          mainBtnBg: '#10b981',
          fontStyle: "'Plus Jakarta Sans', sans-serif",
          isPixel: false,
          isHalftone: false,
          isCyber: false,
          isComic: false,
          isManga: false,
          isCinema: false,
          isTv: false,
        };
      case 'Gaming':
        return {
          id: 'gaming',
          label: 'Gaming Arena',
          bgGradient: 'linear-gradient(135deg, #090314 0%, #1e1035 50%, #0d192c 100%)',
          watermark: 'CYBERPUNK // ESPORTS ARENA // HIGH VOLTAGE',
          glow: 'rgba(168, 85, 247, 0.45)',
          accentPillBg: '#a855f7',
          accentPillText: '#ffffff',
          tagline: 'HOYOVERSE · RIOT GAMES · MAKUHARI MESSE · TOKYO GAME SHOW',
          taglineColor: '#c084fc',
          cornerBadge: 'bg-purple-950 text-cyan-300 border-cyan-400',
          accentDot: '#00f0ff',
          activeTabIconColor: '#00f0ff',
          primaryBtnBg: 'linear-gradient(135deg, #090e17 0%, #170d2c 50%, #050b14 100%)',
          primaryBtnBorder: '2px solid #00f0ff',
          primaryBtnColor: '#ffffff',
          primaryBtnShadow: '0 0 22px rgba(0, 240, 255, 0.45), inset 0 0 12px rgba(168, 85, 247, 0.25)',
          primaryBtnHoverShadow: '0 0 32px rgba(0, 240, 255, 0.7), inset 0 0 16px rgba(168, 85, 247, 0.4)',
          primaryBtnIconColor: '#00f0ff',
          slideActiveColor: '#00f0ff',
          slideGlowColor: 'rgba(0, 240, 255, 0.5)',
          mainBtnBg: '#0f172a',
          fontStyle: "'Fira Code', monospace",
          isPixel: false,
          isHalftone: false,
          isCyber: true,
          isComic: false,
          isManga: false,
          isCinema: false,
          isTv: false,
        };
      case 'Comics':
        return {
          id: 'comics',
          label: 'Comic Books',
          bgGradient: 'linear-gradient(135deg, #fef9c3 0%, #fef08a 40%, #fee2e2 85%)',
          watermark: 'POW! • VARIANT ISSUE • BEN-DAY DOTS • COMIC VAULT',
          glow: 'rgba(239, 68, 68, 0.35)',
          accentPillBg: '#ef4444',
          accentPillText: '#ffffff',
          tagline: 'DC · MARVEL · DARK HORSE · IMAGE · VINTAGE COMIC VAULT',
          taglineColor: '#b91c1c',
          cornerBadge: 'bg-red-950 text-yellow-300 border-red-500',
          accentDot: '#ef4444',
          activeTabIconColor: '#ef4444',
          primaryBtnBg: '#ef4444',
          primaryBtnBorder: '3px solid #000000',
          primaryBtnColor: '#ffffff',
          primaryBtnShadow: '4px 4px 0px #000000',
          primaryBtnHoverShadow: '6px 6px 0px #000000',
          primaryBtnIconColor: '#facc15',
          slideActiveColor: '#ef4444',
          slideGlowColor: 'rgba(239, 68, 68, 0.4)',
          mainBtnBg: '#ef4444',
          fontStyle: "'Bangers', cursive, sans-serif",
          isPixel: false,
          isHalftone: false,
          isCyber: false,
          isComic: true,
          isManga: false,
          isCinema: false,
          isTv: false,
        };
      case 'Manga':
        return {
          id: 'manga',
          label: 'Manga Archive',
          bgGradient: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
          watermark: 'SHONEN JUMP+ • MANGA ARCHIVE • MONOCHROME SCREENTONE',
          glow: 'rgba(15, 23, 42, 0.25)',
          accentPillBg: '#0f172a',
          accentPillText: '#ffffff',
          tagline: 'SHONEN JUMP+ ARCHIVE · LIMITED TANKOBON · JAPANESE RAW INK',
          taglineColor: '#0f172a',
          cornerBadge: 'bg-black text-white border-black',
          accentDot: '#e11d48',
          activeTabIconColor: '#e11d48',
          primaryBtnBg: '#0f172a',
          primaryBtnBorder: '1.5px solid #0f172a',
          primaryBtnColor: '#ffffff',
          primaryBtnShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
          primaryBtnHoverShadow: '0 6px 20px rgba(225, 29, 72, 0.35)',
          primaryBtnIconColor: '#ffffff',
          slideActiveColor: '#0f172a',
          slideGlowColor: 'rgba(15, 23, 42, 0.25)',
          mainBtnBg: '#0f172a',
          fontStyle: "'Plus Jakarta Sans', sans-serif",
          isPixel: false,
          isHalftone: false,
          isCyber: false,
          isComic: false,
          isManga: true,
          isCinema: false,
          isTv: false,
        };
      case 'Movies':
        return {
          id: 'movies',
          label: 'Cinema Noir',
          bgGradient: 'linear-gradient(135deg, #050811 0%, #0B0F19 50%, #1a1528 100%)',
          watermark: 'IMAX 70MM • BOX OFFICE • CINEMA NOIR • 2026',
          glow: 'rgba(245, 158, 11, 0.38)',
          accentPillBg: '#f59e0b',
          accentPillText: '#000000',
          tagline: 'WARNER BROS · A24 · IMAX 70MM · BOX OFFICE MASTERPIECE',
          taglineColor: '#fbbf24',
          cornerBadge: 'bg-black/90 text-amber-300 border-amber-500/50',
          accentDot: '#f59e0b',
          activeTabIconColor: '#f59e0b',
          primaryBtnBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          primaryBtnBorder: '1.5px solid rgba(245, 158, 11, 0.6)',
          primaryBtnColor: '#000000',
          primaryBtnShadow: '0 8px 24px -2px rgba(245, 158, 11, 0.45)',
          primaryBtnHoverShadow: '0 12px 28px 0px rgba(245, 158, 11, 0.6)',
          primaryBtnIconColor: '#000000',
          slideActiveColor: '#f59e0b',
          slideGlowColor: 'rgba(245, 158, 11, 0.4)',
          mainBtnBg: '#f59e0b',
          fontStyle: "'Playfair Display', Georgia, serif",
          isPixel: false,
          isHalftone: false,
          isCyber: false,
          isComic: false,
          isManga: false,
          isCinema: true,
          isTv: false,
        };
      case 'TV Shows':
        return {
          id: 'tv',
          label: 'TV Series & Binge',
          bgGradient: 'linear-gradient(135deg, #090d16 0%, #171728 50%, #0d131f 100%)',
          watermark: 'GOLDEN HOUR STREAMING • BINGE WATCH NO.1 • ARCANE',
          glow: 'rgba(234, 179, 8, 0.4)',
          accentPillBg: '#eab308',
          accentPillText: '#000000',
          tagline: 'NETFLIX · HBO ORIGINALS · CRUNCHYROLL · DISNEY+ STREAMING',
          taglineColor: '#facc15',
          cornerBadge: 'bg-black/90 text-amber-300 border-amber-500/50',
          accentDot: '#eab308',
          activeTabIconColor: '#eab308',
          primaryBtnBg: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
          primaryBtnBorder: '1.5px solid #fde047',
          primaryBtnColor: '#000000',
          primaryBtnShadow: '0 8px 24px -2px rgba(234, 179, 8, 0.45)',
          primaryBtnHoverShadow: '0 12px 28px 0px rgba(234, 179, 8, 0.65)',
          primaryBtnIconColor: '#000000',
          slideActiveColor: '#eab308',
          slideGlowColor: 'rgba(234, 179, 8, 0.4)',
          mainBtnBg: '#eab308',
          fontStyle: "'Plus Jakarta Sans', sans-serif",
          isPixel: false,
          isHalftone: false,
          isCyber: false,
          isComic: false,
          isManga: false,
          isCinema: false,
          isTv: true,
        };
      default:
        return {
          id: 'all',
          label: 'All Fandoms',
          bgGradient: 'linear-gradient(135deg, #EAF3FD 0%, #FDF0F6 50%, #ffffff 85%)',
          watermark: 'GLOBAL FANDOM UNIVERSE • ALL-ACCESS PASS',
          glow: 'rgba(15, 23, 42, 0.18)',
          accentPillBg: '#000000',
          accentPillText: '#ffffff',
          tagline: 'GLOBAL FANDOM UNIVERSE · CONCERTS · FANSIGNS · CONVENTIONS',
          taglineColor: '#475569',
          cornerBadge: 'bg-black/85 text-white border-white/20',
          accentDot: '#38bdf8',
          activeTabIconColor: '#ffffff',
          primaryBtnBg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          primaryBtnBorder: '1.5px solid rgba(255, 255, 255, 0.25)',
          primaryBtnColor: '#ffffff',
          primaryBtnShadow: '0 8px 24px -2px rgba(15, 23, 42, 0.35)',
          primaryBtnHoverShadow: '0 12px 28px -2px rgba(15, 23, 42, 0.5)',
          primaryBtnIconColor: '#ffffff',
          slideActiveColor: '#0f172a',
          slideGlowColor: 'rgba(15, 23, 42, 0.2)',
          mainBtnBg: '#000000',
          fontStyle: "'Playfair Display', Georgia, serif",
          isPixel: false,
          isHalftone: false,
          isCyber: false,
          isComic: false,
          isManga: false,
          isCinema: false,
          isTv: false,
        };
    }
  }, [currentCategory]);

  // All 8 Categories from the bottom grid, represented 1:1 on the top bar + All Fandoms
  const FANDOM_TABS: { id: HeroBannerCategory; label: string; icon: any }[] = [
    { id: 'all', label: 'All Fandoms', icon: Compass },
    { id: 'K-Pop', label: 'K-Pop', icon: Sparkles },
    { id: 'Anime', label: 'Anime', icon: Flame },
    { id: 'Cosplay', label: 'Cosplay', icon: Shirt },
    { id: 'Gaming', label: 'Gaming Arena', icon: Trophy },
    { id: 'Comics', label: 'Comic Books', icon: BookOpen },
    { id: 'Manga', label: 'Manga', icon: PenTool },
    { id: 'Movies', label: 'Cinema Noir', icon: Film },
    { id: 'TV Shows', label: 'TV Series', icon: Tv },
  ];

  // Filter events based on active category
  const categoryEvents = useMemo(() => {
    let list = mockTourEvents;
    if (currentCategory !== 'all') {
      if (currentCategory === 'Comics') {
        const sub = mockTourEvents.filter(e => e.category === 'Anime' || e.category === 'Comics');
        list = sub.length > 0 ? sub : mockTourEvents;
      } else if (currentCategory === 'Manga') {
        const sub = mockTourEvents.filter(e => e.category === 'Anime');
        list = sub.length > 0 ? sub : mockTourEvents;
      } else if (currentCategory === 'Cosplay') {
        const sub = mockTourEvents.filter(e => e.category === 'Anime' || e.category === 'Gaming');
        list = sub.length > 0 ? sub : mockTourEvents;
      } else if (currentCategory === 'Movies' || currentCategory === 'TV Shows') {
        const sub = mockTourEvents.filter(e => e.category === 'Anime');
        list = sub.length > 0 ? sub : mockTourEvents;
      } else {
        const sub = mockTourEvents.filter(e => e.category === currentCategory);
        list = sub.length > 0 ? sub : mockTourEvents;
      }
    }
    return list.slice(0, 6);
  }, [currentCategory]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isPrimaryHovered, setIsPrimaryHovered] = useState(false);
  const [isSecondaryHovered, setIsSecondaryHovered] = useState(false);

  // Reset index when category changes
  useEffect(() => {
    setActiveIndex(0);
  }, [currentCategory]);

  // Auto-play interval (6 seconds)
  useEffect(() => {
    if (isPaused || categoryEvents.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % categoryEvents.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, categoryEvents.length]);

  const currentEvent = categoryEvents[activeIndex] || categoryEvents[0] || mockTourEvents[0];

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % categoryEvents.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + categoryEvents.length) % categoryEvents.length);

  const scrollToTours = () => {
    const el = document.getElementById('tours') || document.getElementById('upcoming-releases') || document.getElementById('albums');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/event';
    }
  };

  const handleMainAction = () => {
    if (onSelectEvent) {
      onSelectEvent(currentEvent);
    } else {
      scrollToTours();
    }
  };

  // Badge tagline helper
  const badgeTagline = useMemo(() => {
    if (currentEvent.sourcePlatform === 'Withmuu') return 'Withmuu Official POB · Hologram Photocard';
    if (currentEvent.sourcePlatform === 'Mubeat') return 'MBC Official Chart · 100% Live Vote Impact';
    if (currentCategory === 'K-Pop') return 'Tokyo Dome Arena · Official Stage Pass';
    if (currentCategory === 'Anime') return 'Anime Expo Certified · Official Studio Cast';
    if (currentCategory === 'Cosplay') return 'Harajuku Shinobi Expo · Tactical Prop Access';
    if (currentCategory === 'Gaming') return 'Makuhari Messe Tokyo · High Voltage Stage';
    if (currentCategory === 'Comics') return 'Multiverse Comic Vault · Foil Variant Exclusive';
    if (currentCategory === 'Manga') return 'Estatica Ink Workshop · Screentone Print';
    if (currentCategory === 'Movies') return '70mm IMAX Premiere · Collector Steelbook';
    if (currentCategory === 'TV Shows') return 'Golden Hour Streamer · Exclusive Canvas Print';
    return '100% Certified Box Office · Scalper Protection';
  }, [currentEvent, currentCategory]);

  if (!currentEvent) return null;

  return (
    <section
      id="hero-banner"
      className="relative w-full overflow-hidden transition-all duration-700 ease-in-out min-h-[520px] md:min-h-[620px] flex items-center justify-center border-b border-slate-200"
      style={{
        background: themeStyles.bgGradient,
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Pattern Overlays matching category style */}
      {themeStyles.isPixel && (
        <div className="absolute inset-0 pixel-grid-pattern opacity-40 pointer-events-none z-0" />
      )}
      {themeStyles.isHalftone && (
        <div className="absolute inset-0 halftone-lime-pattern opacity-30 pointer-events-none z-0" />
      )}
      {themeStyles.isComic && (
        <div className="absolute inset-0 bended-dots-pattern opacity-25 pointer-events-none z-0" />
      )}
      {themeStyles.isManga && (
        <div className="absolute inset-0 screentone-dot-pattern opacity-20 pointer-events-none z-0" />
      )}

      {/* Background Artistic Watermark Typography (Exact match with user's image) */}
      <div
        style={{
          position: 'absolute',
          right: '2%',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 'clamp(80px, 11vw, 160px)',
          fontWeight: 900,
          fontFamily: themeStyles.fontStyle,
          fontStyle: 'italic',
          color: themeStyles.isCyber || themeStyles.id === 'cosplay' || themeStyles.id === 'movies' || themeStyles.id === 'tv' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          zIndex: 0,
        }}
      >
        {themeStyles.watermark}
      </div>

      <div
        className="relative z-10 w-full max-w-[1440px] mx-auto py-8 sm:py-12 md:py-16 px-4 sm:px-8 lg:px-12 flex flex-col items-center"
      >
        {/* ==================== TOP FANDOM CAPSULE BAR (Spans Full Width - Fits all 9 Fandom Categories Comfortably) ==================== */}
        <div className="w-full flex justify-center mb-8 sm:mb-10 overflow-x-auto no-scrollbar py-1">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '5px',
              backgroundColor: themeStyles.isCyber || themeStyles.id === 'cosplay' || themeStyles.id === 'movies' || themeStyles.id === 'tv' ? 'rgba(15, 23, 42, 0.92)' : '#ffffff',
              borderRadius: '9999px',
              border: themeStyles.isCyber ? '1.5px solid rgba(0, 240, 255, 0.4)' : (themeStyles.isComic ? '2.5px solid #000000' : '1px solid #e2e8f0'),
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              maxWidth: '100%',
              flexWrap: 'nowrap',
            }}
            className="hero-capsule-bar select-none backdrop-blur-md"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexWrap: 'nowrap' }}>
              {FANDOM_TABS.map(tab => {
                const isActive = currentCategory === tab.id;
                const IconComp = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectTab(tab.id)}
                    type="button"
                    style={{
                      backgroundColor: isActive ? '#0f172a' : 'transparent',
                      color: isActive ? '#ffffff' : (themeStyles.isCyber || themeStyles.id === 'cosplay' || themeStyles.id === 'movies' || themeStyles.id === 'tv' ? '#94a3b8' : '#64748b'),
                      padding: '7px 13px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      border: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      whiteSpace: 'nowrap',
                      boxShadow: isActive ? '0 2px 8px rgba(15, 23, 42, 0.25)' : 'none',
                    }}
                    className={isActive ? '' : 'hover:bg-slate-100/20 hover:text-slate-900'}
                  >
                    <IconComp
                      size={13}
                      style={{
                        color: isActive ? themeStyles.activeTabIconColor : (themeStyles.isCyber ? '#64748b' : '#94a3b8'),
                        transition: 'color 0.2s ease',
                      }}
                    />
                    <span style={{ fontSize: '11px', fontWeight: isActive ? 800 : 700 }}>{tab.label}</span>
                    {isActive && (
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor: themeStyles.accentDot,
                          boxShadow: `0 0 8px ${themeStyles.accentDot}`,
                          marginLeft: '2px',
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2-Column Split: Category Content & Showcase Card */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-14 lg:gap-16 min-h-auto md:min-h-[480px]">
          {/* Left Side: Category Content & Distinct Styling */}
          <div className="flex-1 w-full max-w-[660px] flex flex-col items-start justify-center">

            {/* ==================== CATEGORY SIGNATURE VISUAL ELEMENTS ==================== */}

          {/* 1. K-POP: Y2K Game Boy Badge & Tokyo Dome Notes Box */}
          {themeStyles.isPixel && (
            <div className="w-full mb-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="pixel-note-box p-3 mb-2.5 text-[11px] text-blue-950 font-bold max-w-[440px] bg-white/95 border-2 border-blue-400 rounded-lg shadow-sm">
                <div className="flex items-center justify-between border-b border-blue-200 pb-1 mb-1 font-mono text-[10px] text-blue-800">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-600 inline-block animate-pulse" />
                    ★ GAME START: TOKYO DOME LIVE
                  </span>
                  <span>STAGE PASS // Y2K</span>
                </div>
                <div className="font-mono text-[9.5px] leading-relaxed text-blue-900">
                  ▶ VENUE: TOKYO DOME STADIUM<br />
                  ▶ TICKETING: 100% VERIFIED FAN ALLOCATION
                </div>
              </div>
            </div>
          )}

          {/* 2. ANIME: Acid Lime Streetwear Tag */}
          {themeStyles.isHalftone && (
            <div className="flex items-center gap-2 mb-3 flex-wrap animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="text-[11px] font-black italic tracking-wider text-black bg-lime-300 px-3 py-1 border-2 border-black rounded-xs shadow-[3px_3px_0px_#000]">
                #PEDIDO_ENTREGUE // SHONEN
              </div>
              <div className="streetwear-tag text-[10px]">
                INSPO IN OURLYSIE
              </div>
            </div>
          )}

          {/* 3. COSPLAY: Tactical Harajuku HUD */}
          {currentCategory === 'Cosplay' && (
            <div className="flex items-center gap-2 mb-3 flex-wrap animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="px-3 py-1 bg-black text-emerald-400 border border-emerald-400 rounded-sm font-mono text-[10px] font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(57,255,20,0.3)]">
                ★ COSPLAY EXPO 2026 // TACTICAL GEAR
              </span>
            </div>
          )}

          {/* 4. GAMING: Cyberpunk Lightning & Arena HUD */}
          {themeStyles.isCyber && (
            <div className="flex items-center gap-2 mb-3 flex-wrap animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="gaming-hud-badge flex items-center gap-1.5 bg-black/90 text-lime-400 border border-lime-400 px-3 py-1 rounded text-[10px] font-mono font-bold shadow-[0_0_14px_rgba(16,185,129,0.4)]">
                <Zap size={12} className="text-lime-400 fill-current animate-pulse" />
                <span>⚡ ARENA READY: HIGH VOLTAGE SPEED</span>
              </div>
              <span className="text-purple-300 font-mono text-[10px] font-bold bg-purple-950/80 px-2 py-0.5 border border-purple-500 rounded">
                [CYBER GRAFFITI SHARD]
              </span>
            </div>
          )}

          {/* 5. COMICS: POW! Variant Issue Burst Badge */}
          {themeStyles.isComic && (
            <div className="flex items-center gap-2 mb-3 flex-wrap animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="comic-burst-tag text-xs px-3.5 py-1">
                <span>💥 POW! VARIANT ISSUE</span>
              </div>
              <span className="bangers-font text-base text-red-600 tracking-wider">
                POP-ART ACTION PANEL
              </span>
            </div>
          )}

          {/* 6. MANGA: Sleek Monochrome Screentone Badge */}
          {themeStyles.isManga && (
            <div className="flex items-center gap-2 mb-3 flex-wrap animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="text-xs font-bold px-3.5 py-1 bg-black text-white rounded-full tracking-wider flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>✦ MANGA ARCHIVE</span>
              </div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-800 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                SHONEN JUMP+ &amp; TANKOBON
              </span>
            </div>
          )}

          {/* 7. CINEMA NOIR: IMAX 70mm Gold Badge */}
          {themeStyles.isCinema && (
            <div className="flex items-center gap-2 mb-3 flex-wrap animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="cinema-badge flex items-center gap-1.5 px-3 py-1 bg-black text-amber-400 border border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <Film size={12} />
                <span>🎬 BOX OFFICE HIT // IMAX 70MM MASTERPIECE</span>
              </div>
            </div>
          )}

          {/* 8. TV SERIES: Binge Watch No.1 Streaming Badge */}
          {themeStyles.isTv && (
            <div className="flex items-center gap-2 mb-3 flex-wrap animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="cinema-badge flex items-center gap-1.5 px-3 py-1 bg-black text-yellow-400 border border-yellow-400/60 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                <Tv size={12} />
                <span>📺 BINGE WATCH NO.1 // GOLDEN HOUR STREAMING</span>
              </div>
            </div>
          )}

          {/* Eyebrow Badge & Verification Tagline */}
          <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 flex-wrap">
            <span
              style={{
                backgroundColor: themeStyles.accentPillBg,
                color: themeStyles.accentPillText,
                padding: '4px 11px',
                fontSize: '10.5px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderRadius: '9999px',
                boxShadow: `0 2px 8px ${themeStyles.glow}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#ffffff', opacity: 0.9 }} className="animate-pulse" />
              <span>{currentEvent.badgeText || 'OFFICIAL EVENT PASS'}</span>
            </span>
            <span 
              style={{ 
                fontSize: '11px', 
                fontWeight: 600, 
                color: themeStyles.isCyber || themeStyles.id === 'cosplay' || themeStyles.id === 'movies' || themeStyles.id === 'tv' ? '#94a3b8' : '#64748b', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '5px' 
              }}
            >
              <MapPin size={12} className="text-slate-400" />
              <span>{badgeTagline}</span>
            </span>
          </div>

          {/* Subheadline with Wide Letter Spacing */}
          <h2
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: themeStyles.taglineColor,
              margin: '0 0 10px 0',
            }}
          >
            {currentEvent.artistName.toUpperCase()}  •  {(currentEvent.sourcePlatform || 'OFFICIAL').toUpperCase()}  •  {currentEvent.city.toUpperCase()}
          </h2>

          {/* Main Title - Artistic Editorial Display Headline (Responsive Fonts) */}
          <h1
            style={{
              fontFamily: themeStyles.isComic ? "'Bangers', cursive, sans-serif" : themeStyles.fontStyle,
              fontSize: themeStyles.isComic ? 'clamp(36px, 6vw, 76px)' : 'clamp(28px, 5.2vw, 68px)',
              fontWeight: 800,
              fontStyle: themeStyles.isComic ? 'normal' : 'italic',
              textTransform: 'uppercase',
              lineHeight: 1.05,
              letterSpacing: themeStyles.isComic ? '0.04em' : '-0.02em',
              color: themeStyles.isCyber || themeStyles.id === 'cosplay' || themeStyles.id === 'movies' || themeStyles.id === 'tv' ? '#ffffff' : '#0f172a',
              margin: '0 0 14px 0',
              textShadow: themeStyles.isComic ? '3px 3px 0px #000000' : (themeStyles.isCyber ? '0 0 20px rgba(0, 240, 255, 0.4)' : 'none'),
            }}
          >
            {currentEvent.tourName}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: '14px',
              color: themeStyles.isCyber || themeStyles.id === 'cosplay' || themeStyles.id === 'movies' || themeStyles.id === 'tv' ? '#cbd5e1' : '#475569',
              lineHeight: 1.6,
              maxWidth: '540px',
              margin: '0 0 16px 0',
              fontWeight: 500,
            }}
            className="line-clamp-3 md:line-clamp-none"
          >
            {currentEvent.description}
          </p>

          {/* Inclusions / Perks Metadata Text */}
          <div
            style={{
              fontSize: '12px',
              color: themeStyles.isCyber || themeStyles.id === 'cosplay' || themeStyles.id === 'movies' || themeStyles.id === 'tv' ? '#94a3b8' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
              minHeight: '24px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                color: themeStyles.isCyber || themeStyles.id === 'cosplay' || themeStyles.id === 'movies' || themeStyles.id === 'tv' ? '#ffffff' : '#0f172a',
                fontWeight: 800,
                letterSpacing: '0.12em',
                fontSize: '11px',
                textTransform: 'uppercase',
                borderBottom: '1.5px solid currentColor',
                paddingBottom: '1px',
              }}
            >
              DETAILS:
            </span>
            <span style={{ fontWeight: 600 }}>
              VENUE: {currentEvent.venue}  •  PERKS: {currentEvent.perks?.slice(0, 2).join('  •  ') || 'Official Commemorative Badge'}
            </span>
          </div>

          {/* Price / Entry Display */}
          <div className="flex items-baseline gap-2.5 sm:gap-3 mb-5 sm:mb-7 min-h-[36px] sm:min-h-[44px] flex-wrap">
            <span
              style={{
                fontWeight: 800,
                color: themeStyles.isCyber || themeStyles.id === 'cosplay' || themeStyles.id === 'movies' || themeStyles.id === 'tv' ? '#ffffff' : '#0f172a',
                letterSpacing: '-0.02em',
              }}
              className="text-2xl sm:text-4xl"
            >
              {currentEvent.eventType === 'voting'
                ? 'Free Live Vote'
                : currentEvent.ticketPriceFromUSD === 0
                  ? 'Free RSVP'
                  : formatPrice(currentEvent.ticketPriceFromUSD, currentEvent.ticketPriceFromVND)
              }
            </span>
            {currentEvent.ticketPriceFromUSD > 0 && (
              <span className="text-sm sm:text-base text-slate-400 line-through font-semibold">
                {formatPrice(currentEvent.ticketPriceFromUSD * 1.2, currentEvent.ticketPriceFromVND * 1.2)}
              </span>
            )}
            <span
              style={{
                backgroundColor: themeStyles.isCyber || themeStyles.id === 'cosplay' || themeStyles.id === 'movies' || themeStyles.id === 'tv' ? '#ffffff' : '#000000',
                color: themeStyles.isCyber || themeStyles.id === 'cosplay' || themeStyles.id === 'movies' || themeStyles.id === 'tv' ? '#000000' : '#ffffff',
                fontSize: '10px',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '4px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              SPECIAL FAN PRICE
            </span>
          </div>

          {/* Action Buttons & Interactions */}
          <div className="flex items-center gap-3.5 mb-6 sm:mb-8 flex-wrap">
            <button
              onClick={handleMainAction}
              onMouseEnter={() => setIsPrimaryHovered(true)}
              onMouseLeave={() => setIsPrimaryHovered(false)}
              style={{
                background: themeStyles.primaryBtnBg,
                color: themeStyles.primaryBtnColor,
                border: themeStyles.primaryBtnBorder,
                boxShadow: isPrimaryHovered ? themeStyles.primaryBtnHoverShadow : themeStyles.primaryBtnShadow,
                transform: isPrimaryHovered ? 'translateY(-2px) scale(1.02)' : 'translateY(0px) scale(1)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                padding: '13px 28px',
                borderRadius: themeStyles.isComic ? '6px' : '9999px',
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '9px',
                cursor: 'pointer',
              }}
              type="button"
            >
              <span
                style={{
                  color: themeStyles.primaryBtnIconColor,
                  display: 'inline-flex',
                  alignItems: 'center',
                  transform: isPrimaryHovered ? 'scale(1.15)' : 'scale(1)',
                  transition: 'transform 0.2s ease',
                }}
              >
                {currentCategory === 'K-Pop' ? (
                  <Sparkles size={16} />
                ) : currentCategory === 'Anime' ? (
                  <Flame size={16} />
                ) : currentCategory === 'Gaming' ? (
                  <Zap size={16} />
                ) : currentCategory === 'Comics' ? (
                  <BookOpen size={16} />
                ) : currentCategory === 'Manga' ? (
                  <PenTool size={16} />
                ) : currentCategory === 'TV Shows' ? (
                  <Tv size={16} />
                ) : (
                  <Ticket size={16} />
                )}
              </span>
              <span style={{ fontWeight: 800 }}>
                {currentCategory === 'K-Pop' 
                  ? 'Get Tokyo Dome Pass' 
                  : currentCategory === 'Anime' 
                  ? 'Get Expo Pass' 
                  : currentCategory === 'Gaming'
                  ? 'Book Arena Pass'
                  : currentCategory === 'Cosplay'
                  ? 'Claim Cosplay Badge'
                  : currentCategory === 'TV Shows'
                  ? 'Stream Season Pass'
                  : 'Get Official Tickets'}
              </span>
              <ArrowUpRight
                size={16}
                style={{
                  opacity: isPrimaryHovered ? 1 : 0.8,
                  transform: isPrimaryHovered ? 'translate(2px, -2px)' : 'none',
                  transition: 'transform 0.2s ease, opacity 0.2s ease',
                }}
              />
            </button>

            <button
              onClick={scrollToTours}
              onMouseEnter={() => setIsSecondaryHovered(true)}
              onMouseLeave={() => setIsSecondaryHovered(false)}
              style={{
                backgroundColor: isSecondaryHovered 
                  ? (themeStyles.isCyber || themeStyles.id === 'cosplay' || themeStyles.id === 'movies' || themeStyles.id === 'tv' ? '#ffffff' : '#0f172a') 
                  : 'transparent',
                color: isSecondaryHovered 
                  ? '#000000' 
                  : (themeStyles.isCyber || themeStyles.id === 'cosplay' || themeStyles.id === 'movies' || themeStyles.id === 'tv' ? '#ffffff' : '#0f172a'),
                border: themeStyles.isCyber 
                  ? '1.5px solid #00f0ff' 
                  : (themeStyles.isComic ? '3px solid #000000' : '1.5px solid currentColor'),
                boxShadow: isSecondaryHovered 
                  ? '0 6px 18px rgba(0, 0, 0, 0.2)' 
                  : 'none',
                transform: isSecondaryHovered ? 'translateY(-2px)' : 'translateY(0px)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                padding: '12px 24px',
                borderRadius: themeStyles.isComic ? '6px' : '9999px',
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
              type="button"
            >
              <Calendar size={16} />
              <span>Explore Categories</span>
            </button>
          </div>

          {/* Carousel Pagination Dock */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              padding: '6px 14px',
              backgroundColor: themeStyles.isCyber || themeStyles.id === 'cosplay' || themeStyles.id === 'movies' || themeStyles.id === 'tv' ? 'rgba(15, 23, 42, 0.85)' : '#ffffff',
              borderRadius: '9999px',
              border: themeStyles.isCyber ? '1px solid rgba(0, 240, 255, 0.3)' : '1.5px solid #e2e8f0',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
            }}
          >
            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: themeStyles.isCyber || themeStyles.id === 'cosplay' || themeStyles.id === 'movies' || themeStyles.id === 'tv' ? '#ffffff' : '#0f172a',
                letterSpacing: '0.06em',
                fontFamily: 'monospace',
              }}
            >
              0{activeIndex + 1} <span style={{ color: '#94a3b8', fontWeight: 400 }}>/</span> 0{categoryEvents.length}
            </span>

            <div style={{ height: '14px', width: '1px', backgroundColor: '#94a3b8', opacity: 0.3 }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {categoryEvents.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  style={{
                    width: activeIndex === idx ? '28px' : '8px',
                    height: '4px',
                    borderRadius: '9999px',
                    backgroundColor: activeIndex === idx ? themeStyles.slideActiveColor : '#94a3b8',
                    opacity: activeIndex === idx ? 1 : 0.4,
                    boxShadow: activeIndex === idx ? `0 0 8px ${themeStyles.slideGlowColor}` : 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  title={`Slide ${idx + 1}`}
                  type="button"
                />
              ))}
            </div>

            <div style={{ height: '14px', width: '1px', backgroundColor: '#94a3b8', opacity: 0.3 }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={handlePrev}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: themeStyles.isCyber || themeStyles.id === 'cosplay' || themeStyles.id === 'movies' || themeStyles.id === 'tv' ? '#1e293b' : '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: themeStyles.isCyber || themeStyles.id === 'cosplay' || themeStyles.id === 'movies' || themeStyles.id === 'tv' ? '#ffffff' : '#334155',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-95"
                title="Previous"
                type="button"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={handleNext}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: themeStyles.isCyber || themeStyles.id === 'cosplay' || themeStyles.id === 'movies' || themeStyles.id === 'tv' ? '#1e293b' : '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: themeStyles.isCyber || themeStyles.id === 'cosplay' || themeStyles.id === 'movies' || themeStyles.id === 'tv' ? '#ffffff' : '#334155',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-95"
                title="Next"
                type="button"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Elegant Visual Showcase Card (Styled to match each category) */}
        <div
          className="flex-1 w-full max-w-[340px] sm:max-w-[420px] md:max-w-[480px] flex justify-center items-center relative mt-4 md:mt-0"
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={() => setIsCardHovered(false)}
        >
          <div
            className="relative w-full max-w-[300px] sm:max-w-[380px] md:max-w-[440px] aspect-square flex items-center justify-center cursor-pointer group"
            onClick={handleMainAction}
          >
            {/* Ambient Lighting Glow Behind Card */}
            <div
              style={{
                position: 'absolute',
                inset: '-20px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${themeStyles.glow} 0%, transparent 70%)`,
                filter: 'blur(35px)',
                opacity: 0.95,
                zIndex: 0,
                pointerEvents: 'none',
              }}
            />

            {/* Subtle Vinyl Disc Peek Out on Right */}
            <div
              style={{
                position: 'absolute',
                right: isCardHovered ? '-22px' : '-8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '78%',
                height: '78%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #27272a 18%, #09090b 40%, #18181b 70%, #000000 100%)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                border: '3px solid #3f3f46',
                zIndex: 5,
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
              className="hidden sm:flex"
            >
              {/* Vinyl grooves */}
              <div
                style={{
                  width: '65%',
                  height: '65%',
                  borderRadius: '50%',
                  border: '1px dashed rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Vinyl Center Label */}
                <div
                  style={{
                    width: '38%',
                    height: '38%',
                    borderRadius: '50%',
                    backgroundColor: themeStyles.accentDot,
                    border: '2px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 12px rgba(0,0,0,0.4)',
                  }}
                  className={isCardHovered ? 'animate-spin' : ''}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000000' }} />
                </div>
              </div>
            </div>

            {/* Event Showcase Card */}
            <div
              style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                height: '100%',
                borderRadius: themeStyles.isComic ? '8px' : '18px',
                overflow: 'hidden',
                backgroundColor: '#000000',
                boxShadow: isCardHovered
                  ? '0 32px 64px -12px rgba(0, 0, 0, 0.55)'
                  : '0 20px 40px -10px rgba(0, 0, 0, 0.35)',
                border: themeStyles.isComic 
                  ? '4px solid #000000' 
                  : (themeStyles.isCyber ? '2px solid #00f0ff' : (themeStyles.isHalftone ? '2px solid #84cc16' : '1.5px solid rgba(255, 255, 255, 0.2)')),
                transform: isCardHovered ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
              }}
            >
              <img
                key={currentEvent.id}
                src={currentEvent.coverImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'}
                alt={currentEvent.tourName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className={isCardHovered ? 'scale-105' : 'scale-100'}
              />

              {/* Gradient overlay for text legibility */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)',
                }}
              />

              {/* Top-Left Floating Holographic Pass Pill */}
              <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg">
                <Sparkles size={11} className="text-amber-400" />
                <span>OFFICIAL VERIFIED PASS</span>
              </div>

              {/* Top-Right Corner Platform Tag */}
              <div 
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  backdropFilter: 'blur(8px)',
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: '1px solid',
                  zIndex: 20,
                }}
                className={themeStyles.cornerBadge}
              >
                {currentCategory !== 'all' ? currentCategory : (currentEvent.sourcePlatform || 'OFFICIAL')}
              </div>

              {/* Bottom Frosted Glass Metadata Overlay */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  right: '12px',
                  padding: '12px 14px',
                  backgroundColor: 'rgba(15, 23, 42, 0.82)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  zIndex: 20,
                }}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 font-bold uppercase tracking-wider mb-1">
                  <span className="flex items-center gap-1.5 text-emerald-400 truncate max-w-[65%]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="truncate">{currentEvent.city} · {currentEvent.venue}</span>
                  </span>
                  <span className="shrink-0">{currentEvent.date}</span>
                </div>
                <h4 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 800, 
                    color: '#ffffff',
                    margin: '2px 0 6px 0',
                    lineHeight: 1.2
                  }} 
                  className="truncate"
                >
                  {currentEvent.tourName}
                </h4>
                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/10 font-bold">
                  <span className="text-amber-300">
                    From {formatPrice(currentEvent.ticketPriceFromUSD, currentEvent.ticketPriceFromVND)}
                  </span>
                  <span className="text-[9.5px] uppercase font-mono px-2 py-0.5 rounded bg-white/15 text-white font-extrabold tracking-wider">
                    {currentEvent.status || 'Live Stage'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </section>
);
};
