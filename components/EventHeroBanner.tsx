'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { TourEvent, FandomCategoryKey } from '../types';
import { mockTourEvents } from '../data/mockData';
import { useCartWishlist } from '../context/CartWishlistContext';

export type HeroBannerCategory = FandomCategoryKey | 'all';

export interface EventHeroBannerProps {
  onSelectEvent?: (event: TourEvent) => void;
  activeCategory?: HeroBannerCategory;
  onSelectCategory?: (category: HeroBannerCategory) => void;
}

export interface GraphicBannerSlide {
  id: string;
  category: HeroBannerCategory;
  categoryLabel: string;
  heroWord: string;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  badge: string;
  dateText: string;
  locationText: string;
  priceText?: string;
  ctaText: string;
  secondaryCtaText: string;
  targetAnchor: string;
  eventRefId?: string;
}

export const EventHeroBanner: React.FC<EventHeroBannerProps> = ({
  onSelectEvent,
  activeCategory: propActiveCategory,
  onSelectCategory,
}) => {
  const { formatPrice } = useCartWishlist();
  const [internalCategory, setInternalCategory] = useState<HeroBannerCategory>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentCategory = propActiveCategory !== undefined ? propActiveCategory : internalCategory;
  const isGaming = currentCategory === 'Gaming';

  // 5 Masterpiece Graphic Banners - Minimalist Monochrome with Oversized Typography
  const BANNER_SLIDES: GraphicBannerSlide[] = [
    {
      id: 'slide-stadium-live',
      category: 'all',
      categoryLabel: 'All Fandoms',
      heroWord: 'STADIUM',
      title: 'Say Hi All-Stars Live Stadium Tour',
      subtitle: 'Monumental 30,000-seat stadium concert with pyrotechnics, laser displays & 100% verified soundcheck passes.',
      tag: 'STADIUM TOUR // LIVE ARENA',
      image: '/banners/banner_stadium_live.jpg',
      badge: 'OFFICIAL STADIUM PASS',
      dateText: 'DECEMBER 07 - 09, 2026',
      locationText: 'National Stadium, Hanoi',
      priceText: 'From $32.00',
      ctaText: 'Get Official Tickets',
      secondaryCtaText: 'Explore Stadium Passes',
      targetAnchor: 'tours',
      eventRefId: 'tour-atsh-hn',
    },
    {
      id: 'slide-pixel-game',
      category: 'K-Pop',
      categoryLabel: 'K-Pop',
      heroWord: 'EDITION',
      title: 'ACT:TOMORROW in Tokyo • Game Start',
      subtitle: 'Y2K collector edition pass. Tokyo Dome 55,000 fan support stage with unreleased hologram photocards.',
      tag: 'COLLECTOR EDITION // TOKYO DOME',
      image: '/banners/banner_pixel_game.jpg',
      badge: 'TOKYO DOME 2026',
      dateText: 'JANUARY 21 & 22, 2026',
      locationText: 'Tokyo Dome, Japan',
      priceText: 'Official Kit $42.00',
      ctaText: 'Claim Stage Pass',
      secondaryCtaText: 'View Album Drops',
      targetAnchor: 'upcoming-releases',
      eventRefId: 'tour-bts-wembley',
    },
    {
      id: 'slide-graffiti-hud',
      category: 'Gaming',
      categoryLabel: 'Gaming Arena',
      heroWord: 'ARCHIVE',
      title: 'Monochrome Arena // High-Contrast Audio & Editorial Vinyl',
      subtitle: 'Austere high-fidelity sound laboratory, architectural precision, editorial monograph releases & limited black vinyl boxsets.',
      tag: 'EDITORIAL MONOGRAPH // SOUND LAB',
      image: '/banners/banner_graffiti_hud.jpg',
      badge: 'MONOCHROME VAULT',
      dateText: 'SEASON 2026 GLOBAL',
      locationText: 'Makuhari Messe & Tokyo Arena',
      priceText: 'Vinyl Boxset $48.00',
      ctaText: 'Explore Archive',
      secondaryCtaText: 'Browse Catalog',
      targetAnchor: 'albums',
      eventRefId: 'tour-bp-hanoi',
    },
    {
      id: 'slide-manga-tankobon',
      category: 'Manga',
      categoryLabel: 'Manga & Tankōbon Vault',
      heroWord: 'MANGA',
      title: 'TOKYO TANKŌBON ARCHIVE • Weekly Shonen Jump & Kodansha',
      subtitle: 'Authentic Japanese tankōbon releases, mangaka G-Pen manuscripts, screen-tone artwork & limited collector prints.',
      tag: 'MANGA ARCHIVE // TANKŌBON EDITION',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=85',
      badge: 'OFFICIAL MANGA VAULT',
      dateText: 'TANKŌBON 2026',
      locationText: 'Jimbocho & Akihabara, Tokyo, Japan',
      priceText: 'Tankōbon from $11.99',
      ctaText: 'Browse Manga Catalog',
      secondaryCtaText: 'Explore Mangaka Studio',
      targetAnchor: 'manga-catalog',
      eventRefId: 'tour-atvncg-hanoi',
    },
    {
      id: 'slide-monochrome-king',
      category: 'Cosplay',
      categoryLabel: 'Streetwear & Cosplay',
      heroWord: 'VOGUE',
      title: 'K-Pop Fandom Streetwear Collection Vol. 01',
      subtitle: 'Monochrome dark urban style, postage stamp stickers, cat doodles, tape labels & tactical gear collection.',
      tag: 'STREETWEAR AESTHETIC // VOL. 01',
      image: '/banners/banner_monochrome_king.jpg',
      badge: 'LIMITED EDITION DROP',
      dateText: 'WINTER COLLECTION 2026',
      locationText: 'Harajuku & Hongdae Pop-up',
      priceText: 'Street Wear Kit $54.00',
      ctaText: 'Shop Streetwear Drop',
      secondaryCtaText: 'Explore All MD',
      targetAnchor: 'albums',
      eventRefId: 'tour-ive-world',
    },
  ];

  // All 9 Fandom Categories mapped to sharp rectangular dock
  const FANDOM_TABS: { id: HeroBannerCategory; label: string }[] = [
    { id: 'all', label: 'All Fandoms' },
    { id: 'K-Pop', label: 'K-Pop' },
    { id: 'Gaming', label: 'Gaming Arena' },
    { id: 'Manga', label: 'Manga' },
    { id: 'Cosplay', label: 'Cosplay & Street' },
    { id: 'Anime', label: 'Anime' },
    { id: 'Comics', label: 'Comics' },
    { id: 'Movies', label: 'Cinema' },
    { id: 'TV Shows', label: 'TV Shows' },
  ];

  // Filter slides by active category if selected, otherwise show all
  const filteredSlides = useMemo(() => {
    if (currentCategory === 'all') return BANNER_SLIDES;
    if (currentCategory === 'Gaming') {
      const gamingSlide = BANNER_SLIDES.find(s => s.category === 'Gaming');
      const otherSlides = BANNER_SLIDES.filter(s => s.category !== 'Gaming');
      return gamingSlide ? [gamingSlide, ...otherSlides] : BANNER_SLIDES;
    }
    if (currentCategory === 'K-Pop') {
      const kpopSlide = BANNER_SLIDES.find(s => s.category === 'K-Pop');
      const otherSlides = BANNER_SLIDES.filter(s => s.category !== 'K-Pop');
      return kpopSlide ? [kpopSlide, ...otherSlides] : BANNER_SLIDES;
    }
    const matched = BANNER_SLIDES.filter(s => s.category === currentCategory);
    return matched.length > 0 ? matched : BANNER_SLIDES;
  }, [currentCategory]);

  // Adjust activeIndex if filteredSlides length changes
  useEffect(() => {
    setActiveIndex(0);
  }, [currentCategory]);

  // Auto-play timer
  useEffect(() => {
    if (isPaused || filteredSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % filteredSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, filteredSlides.length]);

  const currentSlide = filteredSlides[activeIndex] || filteredSlides[0];

  const handleSelectTab = (cat: HeroBannerCategory) => {
    setInternalCategory(cat);
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
  };

  const handleNext = () => setActiveIndex(prev => (prev + 1) % filteredSlides.length);
  const handlePrev = () => setActiveIndex(prev => (prev - 1 + filteredSlides.length) % filteredSlides.length);

  const handleScrollToTarget = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMainCta = () => {
    if (currentSlide.eventRefId && onSelectEvent) {
      const foundEvent = mockTourEvents.find(e => e.id === currentSlide.eventRefId);
      if (foundEvent) {
        onSelectEvent(foundEvent);
        return;
      }
    }
    handleScrollToTarget(currentSlide.targetAnchor || 'upcoming-releases');
  };

  return (
    <section
      id="hero-banner"
      className="relative w-full select-none bg-black text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* =========================================================================
          1. EDITORIAL FULL-BLEED HERO BANNER - TO MAX (82vh+ cinema scale)
      ========================================================================= */}
      <div className="relative w-full h-[620px] sm:h-[720px] md:h-[820px] lg:h-[890px] xl:h-[940px] min-h-[82vh] overflow-hidden bg-neutral-900 group border-b-4 border-black">
        {filteredSlides.map((slide, idx) => {
          const isVisible = slide.id === currentSlide.id;
          return (
            <div
              key={slide.id}
              onClick={handleMainCta}
              className={`absolute inset-0 w-full h-full transition-opacity duration-300 ease-linear cursor-pointer ${isVisible
                ? 'opacity-100 pointer-events-auto z-10'
                : 'opacity-0 pointer-events-none z-0'
                }`}
            >
              {/* Full-bleed background graphic banner - VIBRANT FULL COLOR */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center contrast-105 group-hover:scale-[1.01] transition-transform duration-300"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />

              {/* High-contrast Y2K Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

              {/* Cyber Grid Texture overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-15"
                style={{
                  backgroundImage: 'radial-gradient(#00f0ff 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
            </div>
          );
        })}

        {/* Minimalist Monochrome Hero Caption - PRESERVED EXACTLY AS ORIGINAL */}
        <div className="absolute left-6 sm:left-12 lg:left-20 bottom-10 sm:bottom-14 z-20 max-w-3xl text-white pointer-events-none">
          <div className="pointer-events-auto flex flex-col gap-4">

            {/* Tag & Metadata Bar */}
            <div className="flex items-center gap-3 flex-wrap font-mono">
              <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 ${isGaming ? 'bg-black text-white border-2 border-white shadow-none' : 'bg-[#ff2e93] text-white border-2 border-black shadow-[3px_3px_0px_#000000]'} text-[11px] font-black uppercase tracking-widest`}>
                <span>★</span>
                <span>{currentSlide.tag}</span>
              </span>

              <span className={`text-[11px] font-bold tracking-wider ${isGaming ? 'bg-white text-black border-2 border-black shadow-none' : 'bg-[#00f0ff] text-black border-2 border-black shadow-[3px_3px_0px_#000000]'} flex items-center gap-1.5 px-3 py-1.5`}>
                <span className="text-black font-black font-mono">LOC //</span>
                <span>{currentSlide.locationText}</span>
              </span>

              {currentSlide.priceText && (
                <span className={`text-[11px] font-black px-3.5 py-1.5 ${isGaming ? 'bg-black text-white border-2 border-white shadow-none' : 'bg-[#ffd60a] text-black border-2 border-black shadow-[3px_3px_0px_#000000]'} tracking-widest uppercase`}>
                  {currentSlide.priceText}
                </span>
              )}
            </div>

            {/* Oversized Headline - Playfair Display Hero */}
            <div className="space-y-1">
              <div className={`font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter uppercase leading-none select-none ${isGaming ? 'text-white/60 opacity-60' : 'text-[#ffd60a] opacity-40 drop-shadow-[2px_2px_0px_#000]'}`}>
                {currentSlide.heroWord}
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal italic tracking-tight text-white leading-tight -mt-4 sm:-mt-6 drop-shadow-[2px_2px_0px_#000]">
                {currentSlide.title}
              </h1>
            </div>

            {/* Editorial Rule with Visual Punctuation Box */}
            <div className="flex items-center gap-2 max-w-md my-1">
              <div className={`w-2.5 h-2.5 border-2 border-black shrink-0 ${isGaming ? 'bg-white' : 'bg-[#ff2e93]'}`} />
              <div className={`flex-1 h-[2px] ${isGaming ? 'bg-white' : 'bg-[#00f0ff]'}`} />
              <div className={`w-2.5 h-2.5 border-2 border-black shrink-0 ${isGaming ? 'bg-white' : 'bg-[#ffd60a]'}`} />
            </div>

            {/* Subtitle (Source Serif) */}
            <p className="font-serif text-sm sm:text-base text-neutral-200 leading-relaxed font-normal max-w-xl line-clamp-2 drop-shadow-[1px_1px_0px_#000]">
              {currentSlide.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-2 flex-wrap font-mono">
              <button
                type="button"
                onClick={handleMainCta}
                className={`px-8 sm:px-12 py-3.5 sm:py-4 min-w-[200px] sm:min-w-[240px] justify-center ${isGaming ? 'bg-black text-white hover:bg-white hover:text-black border-2 border-white shadow-none' : 'bg-[#ff2e93] text-white hover:bg-[#ff007f] border-2 border-black shadow-[4px_4px_0px_#000000]'} text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors duration-100 select-none whitespace-nowrap active:translate-x-[2px] active:translate-y-[2px]`}
                style={{ borderRadius: '0px' }}
              >
                <span>{currentSlide.ctaText}</span>
                <span className="font-mono text-sm">→</span>
              </button>

              <button
                type="button"
                onClick={() => handleScrollToTarget(currentSlide.targetAnchor || 'albums')}
                className={`px-10 sm:px-14 py-3.5 sm:py-4 min-w-[240px] sm:min-w-[280px] justify-center ${isGaming ? 'bg-white text-black hover:bg-black hover:text-white border-2 border-black shadow-none' : 'bg-[#00f0ff] text-black hover:bg-[#38bdf8] border-2 border-black shadow-[4px_4px_0px_#000000]'} text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors duration-100 select-none whitespace-nowrap active:translate-x-[2px] active:translate-y-[2px]`}
                style={{ borderRadius: '0px' }}
              >
                <span>{currentSlide.secondaryCtaText}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Side Prev / Next Navigation Arrows */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className={`absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 ${isGaming ? 'bg-white hover:bg-black text-black hover:text-white border-2 border-black shadow-none' : 'bg-[#ffd60a] hover:bg-white text-black border-2 border-black shadow-[3px_3px_0px_#000]'} flex items-center justify-center transition-colors duration-100 cursor-pointer active:translate-x-[2px] active:translate-y-[2px]`}
          style={{ borderRadius: '0px' }}
          title="Previous Slide"
        >
          <span className="font-mono text-base font-black">←</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className={`absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 ${isGaming ? 'bg-white hover:bg-black text-black hover:text-white border-2 border-black shadow-none' : 'bg-[#ffd60a] hover:bg-white text-black border-2 border-black shadow-[3px_3px_0px_#000]'} flex items-center justify-center transition-colors duration-100 cursor-pointer active:translate-x-[2px] active:translate-y-[2px]`}
          style={{ borderRadius: '0px' }}
          title="Next Slide"
        >
          <span className="font-mono text-base font-black">→</span>
        </button>

        {/* Bottom Right Slide Counter & Square Indicator Box */}
        <div
          style={{ borderRadius: '0px' }}
          className={`absolute right-6 sm:right-12 bottom-8 sm:bottom-12 z-30 flex items-center gap-3 bg-white px-4 py-2 border-2 border-black ${isGaming ? 'shadow-none' : 'shadow-[3px_3px_0px_#000]'} text-xs font-mono text-black font-bold`}
        >
          <span className={`font-black text-sm ${isGaming ? 'text-black' : 'text-[#ff2e93]'}`}>0{activeIndex + 1}</span>
          <span className="text-neutral-400">/</span>
          <span className="text-neutral-700">0{filteredSlides.length}</span>

          <div className="flex items-center gap-1.5 ml-2">
            {filteredSlides.map((s, idx) => (
              <button
                key={s.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(idx);
                }}
                className={`w-3 h-3 transition-colors duration-100 cursor-pointer border border-black ${idx === activeIndex
                  ? (isGaming ? 'bg-black' : 'bg-[#ff2e93]')
                  : (isGaming ? 'bg-neutral-200 hover:bg-black' : 'bg-neutral-200 hover:bg-[#ffd60a]')
                  }`}
                style={{ borderRadius: '0px' }}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPaused(!isPaused);
            }}
            className={`transition-colors ml-2 p-1 cursor-pointer font-mono text-xs font-black ${isGaming ? 'text-black hover:opacity-60' : 'text-black hover:text-[#ff2e93]'}`}
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? '▶' : '❚❚'}
          </button>
        </div>

      </div>

      {/* =========================================================================
          2. DEDICATED FANDOM CATEGORY DOCK
      ========================================================================= */}
      <div className={`w-full ${isGaming ? 'bg-white' : 'bg-[#fdfbf7]'} border-b-4 border-black py-4 px-4 sm:px-8`}>
        <div className="max-w-[1440px] mx-auto flex items-center justify-center overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {FANDOM_TABS.map((tab) => {
              const isActive = currentCategory === tab.id;

              // Color per tab when active
              let activeBgClass = 'bg-[#ffd60a] text-black';
              if (tab.id === 'Gaming') activeBgClass = 'bg-black text-white';
              else if (tab.id === 'K-Pop') activeBgClass = 'bg-[#ff2e93] text-white';
              else if (tab.id === 'Manga') activeBgClass = 'bg-[#fff9c4] text-[#2d2d2d]';
              else if (tab.id === 'Cosplay') activeBgClass = 'bg-[#fb923c] text-black';
              else if (tab.id === 'Anime') activeBgClass = 'bg-[#f43f5e] text-white';
              else if (tab.id === 'Comics') activeBgClass = 'bg-[#38bdf8] text-black';
              else if (tab.id === 'Movies') activeBgClass = 'bg-[#ffd60a] text-black';
              else if (tab.id === 'TV Shows') activeBgClass = 'bg-[#a3e635] text-black';

              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  type="button"
                  style={{ borderRadius: '0px' }}
                  className={`px-4 sm:px-5 py-2.5 text-xs font-mono font-black tracking-widest uppercase transition-colors duration-100 cursor-pointer flex items-center gap-2 whitespace-nowrap border-2 border-black ${isActive
                    ? `${activeBgClass} ${isGaming ? 'shadow-none' : 'shadow-[3px_3px_0px_#000000]'}`
                    : `bg-white text-black hover:bg-neutral-100 ${isGaming ? 'shadow-none' : 'shadow-[2px_2px_0px_#000000]'}`
                    }`}
                >
                  {isActive && <span>★</span>}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
