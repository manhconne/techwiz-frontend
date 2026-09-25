'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useDomainTheme } from '../context/DomainContext';
import { mockTourEvents } from '../data/mockData';
import { TourEvent } from '../types';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Heart, 
  Radio, 
  Flame, 
  Trophy, 
  Compass,
  ArrowUpRight
} from 'lucide-react';

interface EventHeroBannerProps {
  onSelectEvent?: (event: TourEvent) => void;
}

export const EventHeroBanner: React.FC<EventHeroBannerProps> = ({ onSelectEvent }) => {
  const { formatPrice } = useCartWishlist();
  const { activeSubCategory, selectSubCategory, activeConfig } = useDomainTheme();

  // Map activeSubCategory from DomainContext to Event Category
  const activeCategory = useMemo<'all' | 'K-Pop' | 'Anime' | 'Gaming'>(() => {
    if (activeSubCategory === 'kpop' || activeSubCategory === 'kpop_fandom') return 'K-Pop';
    if (activeSubCategory === 'anime' || activeSubCategory === 'anime_fandom' || activeSubCategory === 'ghibli') return 'Anime';
    if (activeSubCategory === 'gaming' || activeSubCategory === 'cyber' || activeSubCategory === 'hardware') return 'Gaming';
    return 'all';
  }, [activeSubCategory]);

  const handleSelectTab = (cat: 'all' | 'K-Pop' | 'Anime' | 'Gaming') => {
    if (cat === 'K-Pop') selectSubCategory('kpop');
    else if (cat === 'Anime') selectSubCategory('anime');
    else if (cat === 'Gaming') selectSubCategory('gaming');
    else selectSubCategory('all');
  };

  // Distinct theme styling per category
  const themeStyles = useMemo(() => {
    switch (activeCategory) {
      case 'K-Pop':
        return {
          id: 'kpop',
          label: 'K-Pop Fandom',
          bgGradient: 'linear-gradient(135deg, #FDF0F6 0%, #FAF5FF 45%, #ffffff 85%)',
          watermark: 'WORLD TOUR • 월드투어 • FANDOM LIVE',
          glow: 'rgba(236, 72, 153, 0.28)',
          accentPillBg: '#be185d',
          accentPillText: '#ffffff',
          tagline: 'HYBE · YG · SM · JYP · WEVERSE · WITHMUU · MUBEAT',
          taglineColor: '#be185d',
          cornerBadge: 'bg-pink-950/80 text-pink-200 border-pink-400/40',
          mainBtnBg: '#000000',
          mainBtnHover: 'hover:bg-neutral-800',
          mainBtnText: '#ffffff',
          fontStyle: "'Playfair Display', Georgia, serif",
        };
      case 'Anime':
        return {
          id: 'anime',
          label: 'Anime & Manga',
          bgGradient: 'linear-gradient(135deg, #FFF1F2 0%, #FEF3C7 50%, #ffffff 85%)',
          watermark: 'アニメ EXPO • 鬼滅の刃 • SHONEN JUMP',
          glow: 'rgba(239, 68, 68, 0.28)',
          accentPillBg: '#b91c1c',
          accentPillText: '#ffffff',
          tagline: 'UFOTABLE · ANIPLEX · TOEI · STUDIO GHIBLI · SHONEN JUMP',
          taglineColor: '#b91c1c',
          cornerBadge: 'bg-red-950/80 text-red-200 border-red-400/40',
          mainBtnBg: '#991b1b',
          mainBtnHover: 'hover:bg-red-900',
          mainBtnText: '#ffffff',
          fontStyle: "'Playfair Display', Georgia, serif",
        };
      case 'Gaming':
        return {
          id: 'gaming',
          label: 'Gaming & Tech',
          bgGradient: 'linear-gradient(135deg, #ECFEFF 0%, #F0FDF4 50%, #ffffff 85%)',
          watermark: 'CYBERPUNK // ESPORTS ARENA // TOKYO GAME SHOW',
          glow: 'rgba(6, 182, 212, 0.32)',
          accentPillBg: '#0891b2',
          accentPillText: '#ffffff',
          tagline: 'SQUARE ENIX · HOYOVERSE · MAKAHARI MESSE · TOKYO GAME SHOW',
          taglineColor: '#0e7490',
          cornerBadge: 'bg-cyan-950/80 text-cyan-200 border-cyan-400/40',
          mainBtnBg: '#0f172a',
          mainBtnHover: 'hover:bg-black',
          mainBtnText: '#38bdf8',
          fontStyle: "'Fira Code', monospace",
        };
      default:
        return {
          id: 'all',
          label: 'All Fandoms',
          bgGradient: 'linear-gradient(135deg, #EAF3FD 0%, #FDF0F6 50%, #ffffff 85%)',
          watermark: 'FANDOM UNIVERSE • ALL-ACCESS PASS',
          glow: 'rgba(15, 23, 42, 0.18)',
          accentPillBg: '#000000',
          accentPillText: '#ffffff',
          tagline: 'GLOBAL FANDOM UNIVERSE · CONCERTS · FANSIGNS · CONVENTIONS',
          taglineColor: '#475569',
          cornerBadge: 'bg-black/85 text-white border-white/20',
          mainBtnBg: '#000000',
          mainBtnHover: 'hover:bg-neutral-800',
          mainBtnText: '#ffffff',
          fontStyle: activeConfig.fontFamily || "'Playfair Display', Georgia, serif",
        };
    }
  }, [activeCategory, activeConfig]);

  // Filter events based on active category
  const categoryEvents = useMemo(() => {
    let list = mockTourEvents;
    if (activeCategory !== 'all') {
      list = mockTourEvents.filter(e => e.category === activeCategory);
    }
    return list.slice(0, 6);
  }, [activeCategory]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);

  // Reset index when category changes
  useEffect(() => {
    setActiveIndex(0);
  }, [activeCategory]);

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
    const el = document.getElementById('tours');
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
    if (currentEvent.category === 'Anime') return 'Anime Expo Certified · Official Studio Cast';
    if (currentEvent.category === 'Gaming') return 'Makuhari Messe Tokyo · Official Live Stage';
    return '100% Certified Box Office · Scalper Protection';
  }, [currentEvent]);

  if (!currentEvent) return null;

  return (
    <section
      className="relative w-full overflow-hidden transition-all duration-700 ease-in-out min-h-[490px] md:min-h-[580px] flex items-center justify-center border-b border-slate-200"
      style={{
        background: themeStyles.bgGradient,
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Artistic Watermark Typography (Exact match with user's image) */}
      <div
        style={{
          position: 'absolute',
          right: '3%',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 'clamp(85px, 12vw, 175px)',
          fontWeight: 900,
          fontFamily: themeStyles.fontStyle,
          fontStyle: 'italic',
          color: 'rgba(0, 0, 0, 0.038)',
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
        className="relative z-10 w-full max-w-[1440px] mx-auto py-8 sm:py-12 px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 min-h-auto md:min-h-[510px]"
      >
        {/* Left Side: Editorial Typography & Custom Domain Theme Content */}
        <div className="flex-1 w-full max-w-[640px] flex flex-col items-start justify-center">
          
          {/* Top Domain Switcher Tabs (K-Pop, Anime, Gaming, All) */}
          <div className="flex items-center gap-1.5 mb-3.5 flex-wrap">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Compass className="w-3 h-3 text-slate-400" />
              <span>UNIVERSE:</span>
            </span>
            {[
              { id: 'all', label: 'All Fandoms', icon: Compass },
              { id: 'K-Pop', label: 'K-Pop Universe', icon: Radio },
              { id: 'Anime', label: 'Anime & Manga', icon: Flame },
              { id: 'Gaming', label: 'Gaming Arena', icon: Trophy },
            ].map(tab => {
              const isActive = activeCategory === tab.id;
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id as any)}
                  type="button"
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-white/80 text-slate-600 border-slate-200 hover:bg-white hover:text-black'
                  }`}
                >
                  <IconComp className={`w-3 h-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Eyebrow Badge & Verification Tagline */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
            <span
              style={{
                backgroundColor: themeStyles.accentPillBg,
                color: themeStyles.accentPillText,
                padding: '5px 12px',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderRadius: '9999px',
              }}
              className="shadow-xs"
            >
              {currentEvent.badgeText || (currentEvent.eventType === 'voting' ? 'LIVE VOTE ACTIVE' : 'LIMITED ALLOCATION')}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>
              {badgeTagline}
            </span>
          </div>

          {/* Subheadline with Wide Letter Spacing */}
          <h2
            style={{
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: themeStyles.taglineColor,
              margin: '0 0 8px 0',
            }}
          >
            {currentEvent.artistName.toUpperCase()}  •  {(currentEvent.sourcePlatform || 'OFFICIAL').toUpperCase()}  •  {currentEvent.city.toUpperCase()}
          </h2>

          {/* Main Title - Artistic Editorial Display Headline (Exact match with user's image) */}
          <h1
            style={{
              fontFamily: themeStyles.fontStyle,
              fontSize: 'clamp(28px, 5.2vw, 68px)',
              fontWeight: 800,
              fontStyle: 'italic',
              textTransform: 'uppercase',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: '#0f172a',
              margin: '0 0 14px 0',
            }}
          >
            {currentEvent.tourName}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: '14px',
              color: '#475569',
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
              color: '#64748b',
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
                color: '#0f172a',
                fontWeight: 800,
                letterSpacing: '0.12em',
                fontSize: '11px',
                textTransform: 'uppercase',
                borderBottom: '1.5px solid #000000',
                paddingBottom: '1px',
              }}
            >
              DETAILS:
            </span>
            <span style={{ fontWeight: 600, color: '#334155' }}>
              VENUE: {currentEvent.venue}  •  PERKS: {currentEvent.perks?.slice(0, 2).join('  •  ') || 'Official Commemorative Badge'}
            </span>
          </div>

          {/* Price / Entry Display */}
          <div className="flex items-baseline gap-2.5 sm:gap-3 mb-5 sm:mb-7 min-h-[36px] sm:min-h-[44px] flex-wrap">
            <span
              style={{
                fontWeight: 800,
                color: '#0f172a',
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
                backgroundColor: '#000000',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '4px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {currentEvent.eventType === 'voting' ? 'HEART BEATS ONLY' : 'SPECIAL FAN PRICE'}
            </span>
          </div>

          {/* 2 Clean Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-3.5 mb-6 sm:mb-8 flex-wrap">
            <button
              onClick={handleMainAction}
              style={{
                backgroundColor: themeStyles.mainBtnBg,
                color: themeStyles.mainBtnText,
                padding: '13px 30px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
                transition: 'opacity 0.15s ease, transform 0.15s ease',
              }}
              className={`${themeStyles.mainBtnHover} hover:scale-105 active:scale-95`}
              type="button"
            >
              {currentEvent.eventType === 'voting' ? (
                <>
                  <Heart size={16} className="fill-current" />
                  <span>Vote with Beats</span>
                </>
              ) : currentEvent.eventType === 'luckydraw' ? (
                <>
                  <Sparkles size={16} />
                  <span>Enter Lucky Draw</span>
                </>
              ) : currentEvent.eventType === 'fansign' ? (
                <>
                  <Sparkles size={16} />
                  <span>Apply Fansign</span>
                </>
              ) : currentEvent.category === 'Anime' ? (
                <>
                  <Flame size={16} />
                  <span>Get Expo Pass</span>
                </>
              ) : currentEvent.category === 'Gaming' ? (
                <>
                  <Trophy size={16} />
                  <span>Book Arena Pass</span>
                </>
              ) : (
                <>
                  <Ticket size={16} />
                  <span>Get Tickets</span>
                </>
              )}
            </button>

            <button
              onClick={scrollToTours}
              style={{
                backgroundColor: 'transparent',
                color: '#000000',
                padding: '12px 28px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: '2px solid #000000',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              className="hover:bg-black hover:text-white active:scale-95"
              type="button"
            >
              <Calendar size={16} />
              <span>Full Schedule</span>
            </button>
          </div>

          {/* Minimalist Carousel Pagination (Numbers + Progress Bars + Arrows - Exact match with user's image) */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.05em', fontFamily: 'monospace' }}>
              0{activeIndex + 1} <span style={{ color: '#cbd5e1' }}>/</span> 0{categoryEvents.length}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {categoryEvents.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  style={{
                    width: activeIndex === idx ? '32px' : '12px',
                    height: '3px',
                    borderRadius: '2px',
                    backgroundColor: activeIndex === idx ? '#000000' : 'rgba(0, 0, 0, 0.15)',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  title={`Slide ${idx + 1}`}
                  type="button"
                />
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px' }}>
              <button
                onClick={handlePrev}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000000',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                }}
                className="hover:bg-black hover:text-white"
                title="Previous"
                type="button"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000000',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                }}
                className="hover:bg-black hover:text-white"
                title="Next"
                type="button"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Elegant Visual Showcase Card (Exact match with user's image) */}
        <div
          className="flex-1 w-full max-w-[320px] sm:max-w-[420px] md:max-w-[480px] flex justify-center items-center relative mt-3 md:mt-0"
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={() => setIsCardHovered(false)}
        >
          {/* Card Container with rounded corners matching user's image */}
          <div
            className="relative w-full max-w-[280px] sm:max-w-[360px] md:max-w-[420px] aspect-square flex items-center justify-center cursor-pointer"
          >
            {/* Ambient Lighting Glow Behind Card */}
            <div
              style={{
                position: 'absolute',
                inset: '-20px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${themeStyles.glow} 0%, transparent 70%)`,
                filter: 'blur(30px)',
                opacity: 0.9,
                zIndex: 0,
                pointerEvents: 'none',
              }}
            />

            {/* Event Showcase Card (Rounded corners, rich atmosphere) */}
            <div
              style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                height: '100%',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#000000',
                boxShadow: isCardHovered
                  ? '0 30px 60px -12px rgba(0, 0, 0, 0.4)'
                  : '0 20px 40px -10px rgba(0, 0, 0, 0.24)',
                border: '1.5px solid rgba(0, 0, 0, 0.08)',
                transform: isCardHovered ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
              }}
            >
              <img
                key={currentEvent.id}
                src={currentEvent.coverImage || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'}
                alt={currentEvent.tourName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              {/* Gradient overlay on bottom */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.85) 100%)',
                }}
              />

              {/* Top corner platform tag */}
              <div 
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  backdropFilter: 'blur(6px)',
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: '1px solid',
                }}
                className={themeStyles.cornerBadge}
              >
                {currentEvent.sourcePlatform || 'OFFICIAL'}
              </div>

              {/* Bottom label */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  color: '#ffffff',
                }}
              >
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#cbd5e1', fontWeight: 700, textTransform: 'uppercase' }}>
                  {currentEvent.city} • {currentEvent.date}
                </span>
                <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '2px 0 0 0', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }} className="truncate">
                  {currentEvent.tourName}
                </h4>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
