'use client';

import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { mockAlbums } from '../data/mockData';
import { Play, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { playTrack, currentAlbum, isPlaying } = usePlayer();
  const { addToCart, formatPrice } = useCartWishlist();

  const slides = [
    {
      album: mockAlbums[0],
      badgeText: 'COMEBACK EXCLUSIVE',
      headline: 'GET UP',
      subheadline: 'NEWJEANS  •  2ND EP',
      description: 'Experience the global viral comeback featuring "Super Shy", "ETA", and "Cool With You". Packaged in nostalgic Y2K bag edition with complete photocard set.',
      bgColor: '#EAF3FD', // Elegant soft blue tint
      inclusions: '104p Photobook  •  CD-R  •  Selfie Photocard Set'
    },
    {
      album: mockAlbums[1],
      badgeText: 'WORLD TOUR SPECIAL',
      headline: 'BORN PINK',
      subheadline: 'BLACKPINK  •  2ND FULL ALBUM',
      description: 'The historic record-breaking studio album featuring global hits "Pink Venom" and "Shut Down". Includes official concert photobook and package box.',
      bgColor: '#FDF0F6', // Elegant soft pink tint
      inclusions: 'Special Package Box  •  CD-R  •  Random Holographic POB'
    },
    {
      album: mockAlbums[2],
      badgeText: 'ANNIVERSARY ANTHOLOGY',
      headline: 'PROOF',
      subheadline: 'BTS  •  ANTHOLOGY ALBUM',
      description: 'The definitive 9-year anniversary anthology celebrating BTS music history with unreleased demo tracks and exclusive member memoir booklet.',
      bgColor: '#F3F5F8', // Elegant soft slate tint
      inclusions: '3 CD Set  •  4 Thematic Booklets  •  Lenticular Card'
    },
    {
      album: mockAlbums[3],
      badgeText: 'BILLBOARD 200 #1',
      headline: '6-STAR',
      subheadline: 'STRAY KIDS  •  3RD ALBUM',
      description: 'Explosive energy and self-produced masterpieces including the global anthem "S-Class". Includes full 104-page photobook, cartoon postcard, mini poster, and limited edition sticker pack.',
      bgColor: '#FEF9EC', // Elegant soft warm tint
      inclusions: '104p Photobook  •  OOTD Poster  •  Random Selfie POB'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAlbumHovered, setIsAlbumHovered] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const current = slides[activeIndex];
  const album = current.album;
  const isThisPlaying = isPlaying && currentAlbum?.id === album.id;

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section
      className="relative w-full overflow-hidden transition-colors duration-700 ease-in-out"
      style={{
        background: `linear-gradient(135deg, ${current.bgColor} 0%, #ffffff 82%)`,
        minHeight: '580px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '48px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '48px',
          minHeight: '520px',
        }}
        className="flex-col md:flex-row"
      >

        {/* Left Side: Artistic Typography & Clean Layout */}
        <div
          style={{
            flex: '1 1 0%',
            maxWidth: '620px',
            minHeight: '440px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >

          {/* Eyebrow Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
                padding: '6px 14px',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderRadius: '9999px',
              }}
            >
              {current.badgeText}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
              100% Certified Hanteo &amp; Circle Chart
            </span>
          </div>

          {/* Subheadline with Wide Letter Spacing */}
          <h2
            style={{
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#475569',
              margin: '0 0 10px 0'
            }}
          >
            {current.subheadline}
          </h2>

          {/* Main Title - Artistic Editorial Display Headline */}
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(54px, 6.8vw, 82px)',
              fontWeight: 800,
              fontStyle: 'italic',
              textTransform: 'uppercase',
              lineHeight: 0.96,
              letterSpacing: '-0.02em',
              color: '#0f172a',
              margin: '0 0 16px 0',
              minHeight: '80px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {current.headline}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: '15px',
              color: '#475569',
              lineHeight: 1.7,
              maxWidth: '520px',
              minHeight: '76px',
              margin: '0 0 18px 0',
              fontWeight: 500
            }}
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
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '28px', minHeight: '44px' }}>
            <span
              style={{
                fontSize: '36px',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.02em'
              }}
            >
              {formatPrice(album.priceUSD, album.priceVND)}
            </span>
            {album.originalPriceUSD && (
              <span style={{ fontSize: '16px', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 600 }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '36px' }}>
            <button
              onClick={() => addToCart(album, album.versions[0]?.name)}
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
                padding: '14px 34px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                transition: 'opacity 0.15s ease, transform 0.15s ease',
              }}
              className="hover:opacity-90 hover:scale-105"
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
                padding: '14px 30px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1.5px solid #000000',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              className="hover:bg-black hover:text-white"
              type="button"
            >
              <Play size={16} style={{ fill: isThisPlaying ? '#ffffff' : '#000000' }} />
              <span>{isThisPlaying ? 'Playing' : 'Listen'}</span>
            </button>
          </div>

          {/* Minimalist Carousel Pagination (Numbers + Progress Bars + Arrows) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
          style={{
            flex: '1 1 0%',
            maxWidth: '460px',
            width: '100%',
            minHeight: '440px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}
          onMouseEnter={() => setIsAlbumHovered(true)}
          onMouseLeave={() => setIsAlbumHovered(false)}
        >
          {/* Card Container with fixed aspect ratio */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '380px',
              height: '380px',
              aspectRatio: '1 / 1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
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

            {/* Vinyl Record: Completely concealed inside/behind album, slides out to the right and spins on hover */}
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
                  ? 'translateX(70px) rotate(180deg)'
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

            {/* Album Cover Card: ROTATES gracefully on hover instead of zoom/scale */}
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
