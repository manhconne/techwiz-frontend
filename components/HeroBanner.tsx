'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useDomainTheme } from '../context/DomainContext';
import { filterAlbumsByDomain } from '../utils/domainFilters';
import { mockAlbums } from '../data/mockData';
import { Play, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { playTrack, currentAlbum, isPlaying } = usePlayer();
  const { addToCart, formatPrice } = useCartWishlist();
  const { currentDomain, activeSubCategory, activeConfig } = useDomainTheme();

  const domainFilteredAlbums = useMemo(() => {
    const filtered = filterAlbumsByDomain(mockAlbums, currentDomain, activeSubCategory);
    return filtered.length >= 2 ? filtered : mockAlbums;
  }, [currentDomain, activeSubCategory]);

  const bgColors = ['#EAF3FD', '#FDF0F6', '#F3F5F8', '#FEF9EC', '#F5F3FF', '#ECFDF5'];

  const slides = useMemo(() => {
    return domainFilteredAlbums.slice(0, 5).map((alb, index) => ({
      album: alb,
      badgeText: alb.tag || 'FEATURED SELECTION',
      headline: alb.title,
      subheadline: `${alb.artist.toUpperCase()}  •  ${alb.type.toUpperCase()}`,
      description: alb.description,
      bgColor: bgColors[index % bgColors.length],
      inclusions: alb.inclusions?.slice(0, 2).join('  •  ') || 'Sealed Official Package',
    }));
  }, [domainFilteredAlbums]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAlbumHovered, setIsAlbumHovered] = useState(false);

  // Reset index when domain/slides change
  useEffect(() => {
    setActiveIndex(0);
  }, [currentDomain, activeSubCategory]);

  useEffect(() => {
    if (isPaused || slides.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const current = slides[activeIndex] || slides[0];
  const album = current?.album || mockAlbums[0];
  const isThisPlaying = isPlaying && currentAlbum?.id === album.id;

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section
      className="relative w-full overflow-hidden transition-colors duration-700 ease-in-out min-h-[480px] md:min-h-[580px] flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${current.bgColor} 0%, #ffffff 82%)`,
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Artistic Watermark Typography */}
      <div
        style={{
          position: 'absolute',
          right: '4%',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 'clamp(110px, 14vw, 190px)',
          fontWeight: 900,
          fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: 'italic',
          color: 'rgba(0, 0, 0, 0.035)',
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          zIndex: 0,
        }}
      >
        {current.headline}
      </div>

      <div
        className="relative z-10 w-full max-w-[1440px] mx-auto py-8 sm:py-12 px-4 sm:px-9 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 min-h-auto md:min-h-[520px]"
      >
        {/* Left Side: Artistic Typography & Clean Layout */}
        <div className="flex-1 w-full max-w-[620px] flex flex-col items-start justify-center">
          {/* Eyebrow Badge */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
            <span
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
                padding: '5px 12px',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderRadius: '9999px',
              }}
            >
              {current.badgeText}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>
              100% Certified Hanteo &amp; Circle Chart
            </span>
          </div>

          {/* Subheadline with Wide Letter Spacing */}
          <h2
            style={{
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#475569',
              margin: '0 0 8px 0'
            }}
          >
            {current.subheadline}
          </h2>

          {/* Main Title - Artistic Editorial Display Headline */}
          <h1
            style={{
              fontFamily: activeConfig.fontFamily,
              fontSize: 'clamp(28px, 6vw, 76px)',
              fontWeight: 800,
              fontStyle: 'italic',
              textTransform: 'uppercase',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: '#0f172a',
              margin: '0 0 14px 0',
            }}
          >
            {current.headline}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: '14px',
              color: '#475569',
              lineHeight: 1.6,
              maxWidth: '520px',
              margin: '0 0 16px 0',
              fontWeight: 500
            }}
            className="line-clamp-3 md:line-clamp-none"
          >
            {current.description}
          </p>

          {/* Minimalist inclusions metadata text */}
          <div
            style={{
              fontSize: '13px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '22px',
              minHeight: '24px',
              flexWrap: 'wrap'
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
                paddingBottom: '1px'
              }}
            >
              INCLUDES:
            </span>
            <span style={{ fontWeight: 600, color: '#334155' }}>{current.inclusions}</span>
          </div>

          {/* Price display */}
          <div className="flex items-baseline gap-2.5 sm:gap-3 mb-5 sm:mb-7 min-h-[36px] sm:min-h-[44px] flex-wrap">
            <span
              style={{
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.02em'
              }}
              className="text-2xl sm:text-4xl"
            >
              {formatPrice(album.priceUSD, album.priceVND)}
            </span>
            {album.originalPriceUSD && (
              <span className="text-sm sm:text-base text-slate-400 line-through font-semibold">
                {formatPrice(album.originalPriceUSD, (album.priceVND || 600000) * 1.2)}
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
                letterSpacing: '0.06em'
              }}
            >
              SPECIAL FAN PRICE
            </span>
          </div>

          {/* 2 Clean Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-3.5 mb-6 sm:mb-9 flex-wrap">
            <button
              onClick={() => addToCart(album, album.versions[0]?.name)}
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
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
              className="hover:opacity-90 hover:scale-105 active:scale-95"
              type="button"
            >
              <ShoppingCart size={16} />
              <span>Pre-Order</span>
            </button>

            <button
              onClick={() => playTrack(album)}
              style={{
                backgroundColor: isThisPlaying ? '#000000' : 'transparent',
                color: isThisPlaying ? '#ffffff' : '#000000',
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
              <Play size={16} style={{ fill: isThisPlaying ? '#ffffff' : '#000000' }} />
              <span>{isThisPlaying ? 'Playing' : 'Listen'}</span>
            </button>
          </div>

          {/* Minimalist Carousel Pagination (Numbers + Progress Bars + Arrows) */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.05em' }}>
              0{activeIndex + 1} <span style={{ color: '#cbd5e1' }}>/</span> 0{slides.length}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {slides.map((_, idx) => (
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
                  transition: 'background-color 0.15s ease, color 0.15s ease'
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
                  transition: 'background-color 0.15s ease, color 0.15s ease'
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

        {/* Right Side: Elegant Album Showcase (ROTATES on hover, NO scale / phóng to) */}
        <div
          className="flex-1 w-full max-w-[320px] sm:max-w-[400px] md:max-w-[460px] min-h-[260px] sm:min-h-[360px] md:min-h-[440px] flex justify-center items-center relative mt-3 md:mt-0"
          onMouseEnter={() => setIsAlbumHovered(true)}
          onMouseLeave={() => setIsAlbumHovered(false)}
        >
          {/* Card Container with responsive square sizing */}
          <div
            className="relative w-full max-w-[240px] sm:max-w-[320px] md:max-w-[380px] aspect-square flex items-center justify-center cursor-pointer"
          >
            {/* Ambient Lighting Glow Behind Album */}
            <div
              style={{
                position: 'absolute',
                inset: '-20px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${current.bgColor} 0%, transparent 70%)`,
                filter: 'blur(30px)',
                opacity: 0.8,
                zIndex: 0,
                pointerEvents: 'none',
              }}
            />

            {/* Vinyl Record: Concealed inside/behind album, slides out to the right and spins on hover */}
            <div
              style={{
                position: 'absolute',
                top: '5%',
                bottom: '5%',
                width: '90%',
                height: '90%',
                borderRadius: '50%',
                backgroundColor: '#0f172a',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                border: '1px solid #1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
                right: '0px',
                transform: isAlbumHovered
                  ? 'translateX(45px) rotate(180deg)'
                  : 'translateX(0px) rotate(0deg)',
                opacity: isAlbumHovered ? 1 : 0,
                transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease',
                pointerEvents: 'none',
              }}
              className={isThisPlaying ? 'animate-spin' : ''}
            >
              {/* Vinyl grooves */}
              <div
                style={{
                  width: '34%',
                  height: '34%',
                  borderRadius: '50%',
                  backgroundColor: current.bgColor,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: '14px', height: '14px', backgroundColor: '#ffffff', borderRadius: '50%' }} />
              </div>
              <div style={{ position: 'absolute', inset: '10px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.06)' }} />
              <div style={{ position: 'absolute', inset: '28px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.06)' }} />
              <div style={{ position: 'absolute', inset: '52px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.06)' }} />
            </div>

            {/* Album Cover Card: ROTATES gracefully on hover */}
            <div
              style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                boxShadow: isAlbumHovered
                  ? '0 30px 60px -12px rgba(0, 0, 0, 0.38)'
                  : '0 20px 40px -10px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                transform: isAlbumHovered ? 'rotate(-7deg)' : 'rotate(0deg)',
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease',
                transformOrigin: 'center center',
              }}
            >
              <img
                key={album.id}
                src={album.coverImage}
                alt={album.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
