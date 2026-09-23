'use client';

import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { mockAlbums } from '../data/mockData';
import { 
  Play, 
  ShoppingCart, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Award,
  Flame,
  ArrowRight
} from 'lucide-react';

interface BannerSlide {
  album: typeof mockAlbums[0];
  badgeText: string;
  headline: string;
  subheadline: string;
  description: string;
  releaseHighlight: string;
  discountPercent: number;
}

export const HeroBanner: React.FC = () => {
  const { playTrack } = usePlayer();
  const { addToCart } = useCartWishlist();

  // Curated slides with rich, spacious promotional data
  const slides: BannerSlide[] = [
    {
      album: mockAlbums[0], // NewJeans - Get Up
      badgeText: 'OFFICIAL COMEBACK SPOTLIGHT',
      headline: 'NewJeans 2nd EP [Get Up]',
      subheadline: 'Exclusive Bunny Beach Bag & Hologram Photocard Edition',
      description: 'Experience the global viral comeback featuring "Super Shy", "ETA", and "Cool With You". Every pre-order includes full 5-member collectible photocards and official poster.',
      releaseHighlight: 'Counted 100% on Hanteo & Circle Chart',
      discountPercent: 17,
    },
    {
      album: mockAlbums[1], // BLACKPINK - BORN PINK
      badgeText: 'WORLD TOUR SPECIAL EDITION',
      headline: 'BLACKPINK 2nd Album [BORN PINK]',
      subheadline: 'Deluxe 80-Page Photobook & Official Pre-Order Benefit',
      description: 'The historic record-breaking studio album featuring global hits "Pink Venom" and "Shut Down". Includes official YG entertainment hologram seal and VIP packaging.',
      releaseHighlight: 'Official YG Entertainment Certified',
      discountPercent: 15,
    },
    {
      album: mockAlbums[2], // BTS - PROOF
      badgeText: 'HISTORIC COLLECTOR ANTHOLOGY',
      headline: 'BTS Anthology Album [Proof]',
      subheadline: '3-CD Collector Set with Unreleased Member Demos',
      description: 'The definitive 9-year anniversary anthology celebrating BTS music history. Features 3 brand-new master tracks, special 7-member photo folio, and deluxe outer hardcase.',
      releaseHighlight: '100% Genuine BIGHIT MUSIC Seal',
      discountPercent: 12,
    },
    {
      album: mockAlbums[3], // Stray Kids - 5-STAR
      badgeText: 'BILLBOARD 200 #1 RELEASE',
      headline: 'Stray Kids 3rd Album [5-STAR]',
      subheadline: 'Special Limited Version with OOU Photobook',
      description: 'Explosive energy and self-produced masterpieces including "S-Class". Comes with mini poster, lyric postcard, cartoon postcard, and random store selfie photocard.',
      releaseHighlight: 'JYP Entertainment Verified First-Press',
      discountPercent: 20,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide every 6 seconds unless user is hovering
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const current = slides[activeIndex];
  const album = current.album;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section 
      className="w-full"
      style={{ backgroundColor: '#f8fafc' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Banner Showcase Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        
        {/* Main Stage Banner Box */}
        <div 
          className="relative bg-white border border-slate-200 shadow-sm overflow-hidden"
          style={{ borderRadius: '12px' }}
        >
          {/* Main Slide Content: 2-Column Balanced Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] items-stretch">
            
            {/* Left Content Area: Airy, Spacious & High Fashion */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
              
              {/* Top Eyebrow Section */}
              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                  {/* Clean Badge */}
                  <span 
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider"
                    style={{ 
                      backgroundColor: '#0284c7', 
                      color: '#ffffff',
                      borderRadius: '4px'
                    }}
                  >
                    <Flame style={{ width: '13px', height: '13px' }} />
                    <span>{current.badgeText}</span>
                  </span>

                  <span 
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100"
                    style={{ borderRadius: '4px' }}
                  >
                    <Sparkles style={{ width: '12px', height: '12px', color: '#0284c7' }} />
                    <span>{album.type}</span>
                  </span>

                  <span className="text-xs text-slate-400 font-medium ml-auto hidden sm:inline-block">
                    Release: {album.releaseDate}
                  </span>
                </div>

                {/* Artist Name Label - Clear & Elegant */}
                <div 
                  className="font-bold text-sm sm:text-base uppercase tracking-widest text-slate-500 mb-1"
                  style={{ letterSpacing: '0.12em' }}
                >
                  {album.artist}
                </div>

                {/* Big Clean Headline with Generous Spacing */}
                <h1 
                  className="font-extrabold text-slate-900"
                  style={{ 
                    fontSize: 'clamp(26px, 3.2vw, 38px)', 
                    lineHeight: '1.25',
                    letterSpacing: '-0.01em',
                    marginBottom: '12px'
                  }}
                >
                  {current.headline}
                </h1>

                {/* Subheadline */}
                <h2 
                  className="font-semibold text-sm sm:text-base text-sky-700 mb-3"
                  style={{ lineHeight: '1.4' }}
                >
                  {current.subheadline}
                </h2>

                {/* Description with Open Line Height */}
                <p 
                  className="text-slate-600 text-xs sm:text-sm"
                  style={{ 
                    lineHeight: '1.7', 
                    maxWidth: '560px',
                    marginBottom: '20px'
                  }}
                >
                  {current.description}
                </p>

                {/* Key Spec Feature Callout */}
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50 border border-sky-100 text-xs font-semibold text-sky-800 mb-6"
                  style={{ borderRadius: '6px' }}
                >
                  <CheckCircle2 style={{ width: '14px', height: '14px', color: '#0284c7' }} />
                  <span>{current.releaseHighlight}</span>
                </div>
              </div>

              {/* Bottom Actions & Price Row */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                
                {/* Price Display */}
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    ${album.priceUSD.toFixed(2)}
                  </span>
                  {album.originalPriceUSD && (
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      ${album.originalPriceUSD.toFixed(2)}
                    </span>
                  )}
                  <span 
                    className="px-2 py-0.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200"
                    style={{ borderRadius: '4px' }}
                  >
                    SAVE {current.discountPercent}%
                  </span>
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => addToCart(album, album.versions[0]?.name)}
                    className="font-bold text-xs sm:text-sm text-white flex items-center gap-2 transition-all cursor-pointer shadow hover:brightness-105 active:scale-95"
                    style={{ 
                      backgroundColor: '#0284c7', 
                      borderRadius: '8px', 
                      padding: '12px 24px',
                      border: 'none'
                    }}
                    type="button"
                  >
                    <ShoppingCart style={{ width: '16px', height: '16px' }} />
                    <span>Pre-Order Now</span>
                  </button>

                  <button
                    onClick={() => playTrack(album)}
                    className="font-bold text-xs sm:text-sm text-slate-700 flex items-center gap-2 transition-all cursor-pointer bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:scale-95"
                    style={{ 
                      borderRadius: '8px', 
                      padding: '12px 18px'
                    }}
                    type="button"
                  >
                    <Play style={{ width: '14px', height: '14px', fill: '#0284c7', color: '#0284c7' }} />
                    <span>Teaser</span>
                  </button>
                </div>

              </div>

            </div>

            {/* Right Showcase Area: High-Res Album Art Showcase */}
            <div 
              className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-slate-200 flex items-center justify-center p-6 sm:p-10"
              style={{ backgroundColor: '#f0f9ff' }}
            >
              <div className="w-full max-w-sm flex flex-col items-center">
                
                {/* Visual Album Card Frame */}
                <div 
                  className="relative w-full aspect-square bg-white border border-slate-200 shadow-md overflow-hidden group"
                  style={{ borderRadius: '10px' }}
                >
                  <img
                    key={album.id}
                    src={album.coverImage}
                    alt={album.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Corner Badge */}
                  <div 
                    className="absolute top-3 left-3 text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 text-white shadow-sm"
                    style={{ backgroundColor: '#0f172a', borderRadius: '4px' }}
                  >
                    {album.tag || 'Official MD'}
                  </div>

                  {/* Quick Play Audio Overlay on Image */}
                  <button
                    onClick={() => playTrack(album)}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/95 text-slate-800 text-xs font-bold shadow-md hover:bg-white transition-all cursor-pointer"
                    style={{ borderRadius: '20px' }}
                    type="button"
                  >
                    <Play style={{ width: '12px', height: '12px', fill: '#0284c7', color: '#0284c7' }} />
                    <span>Preview Audio</span>
                  </button>
                </div>

                {/* Stock Status Pill */}
                <div className="w-full flex items-center justify-between mt-3 text-xs text-slate-600 px-1">
                  <span className="font-semibold text-slate-700 truncate max-w-[200px]">
                    {album.versions.length} Album Versions Available
                  </span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {album.stock} Units Left
                  </span>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Tabs Carousel Switcher (Real K-Pop Store Style) */}
          <div 
            className="border-t border-slate-200 bg-white grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200"
          >
            {slides.map((s, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <button
                  key={s.album.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`p-3 sm:p-4 text-left transition-all cursor-pointer relative ${
                    isSelected ? 'bg-sky-50/70' : 'hover:bg-slate-50'
                  }`}
                  type="button"
                >
                  {/* Top indicator bar for active tab */}
                  {isSelected && (
                    <div 
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ backgroundColor: '#0284c7' }}
                    />
                  )}

                  <div className="flex items-center justify-between">
                    <span 
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isSelected ? 'text-sky-700' : 'text-slate-400'
                      }`}
                    >
                      0{idx + 1}. {s.album.artist}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      ${s.album.priceUSD.toFixed(2)}
                    </span>
                  </div>

                  <div 
                    className={`text-xs font-bold truncate mt-0.5 ${
                      isSelected ? 'text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    {s.album.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Left / Right Nav Arrows */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 -translate-y-1/2 left-2 z-10 w-9 h-9 rounded-full bg-white/90 border border-slate-300 text-slate-700 flex items-center justify-center shadow hover:bg-white transition-all cursor-pointer hidden sm:flex"
            aria-label="Previous Slide"
            type="button"
          >
            <ChevronLeft style={{ width: '18px', height: '18px' }} />
          </button>

          <button
            onClick={handleNext}
            className="absolute top-1/2 -translate-y-1/2 right-2 z-10 w-9 h-9 rounded-full bg-white/90 border border-slate-300 text-slate-700 flex items-center justify-center shadow hover:bg-white transition-all cursor-pointer hidden sm:flex"
            aria-label="Next Slide"
            type="button"
          >
            <ChevronRight style={{ width: '18px', height: '18px' }} />
          </button>

        </div>

      </div>

      {/* 3-Column Official Store Guarantee Bar Underneath */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div 
          className="bg-white border border-slate-200 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200"
          style={{ borderRadius: '8px' }}
        >
          {/* Perk 1 */}
          <div className="p-3.5 sm:p-4 flex items-center gap-3.5">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}
            >
              <Award style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                100% Chart Reflected
              </div>
              <div className="text-xs text-slate-500">
                All album sales directly count on Hanteo & Circle Charts.
              </div>
            </div>
          </div>

          {/* Perk 2 */}
          <div className="p-3.5 sm:p-4 flex items-center gap-3.5">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}
            >
              <ShieldCheck style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                100% Official & Authentic
              </div>
              <div className="text-xs text-slate-500">
                Directly licensed by HYBE, YG, SM & JYP Entertainment.
              </div>
            </div>
          </div>

          {/* Perk 3 */}
          <div className="p-3.5 sm:p-4 flex items-center gap-3.5">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}
            >
              <Truck style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                Express Worldwide Delivery
              </div>
              <div className="text-xs text-slate-500">
                Carefully bubble-wrapped with tracking from Seoul.
              </div>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
