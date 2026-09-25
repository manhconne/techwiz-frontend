'use client';

import React, { useState } from 'react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { mockTourEvents } from '../data/mockData';
import { TourEvent } from '../types';
import { 
  MapPin, 
  Calendar, 
  Ticket, 
  Check, 
  X, 
  ExternalLink, 
  Sparkles, 
  Flame, 
  Radio, 
  ShieldCheck, 
  QrCode,
  ArrowUpRight
} from 'lucide-react';

const TOUR_MEDIA: Record<string, {
  image: string;
  artistAvatar: string;
  fandom: string;
  accent: string;
  perks: string[];
}> = {
  'BLACKPINK': {
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    artistAvatar: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=200&q=80',
    fandom: 'BLINK',
    accent: '#f43f5e',
    perks: ['Soundcheck Entry', 'Pink VIP Lanyard', 'Exclusive Photocard'],
  },
  'NewJeans': {
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    artistAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    fandom: 'Bunnies (Tokki)',
    accent: '#3b82f6',
    perks: ['Bunnies Camp Wristband', 'Y2K Sticker Pack', 'Lightstick Sync'],
  },
  'Stray Kids': {
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    artistAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    fandom: 'STAY',
    accent: '#ef4444',
    perks: ['Nachimbong Sync', 'Stray Kids Fan Badge', 'Soundcheck Floor'],
  },
  'aespa': {
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
    artistAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    fandom: 'MY',
    accent: '#8b5cf6',
    perks: ['ae-Avatar Hologram Pass', 'Synk Dive Floor', 'Photocard Tin'],
  },
  'BTS': {
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    artistAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    fandom: 'ARMY',
    accent: '#a855f7',
    perks: ['ARMY Bomb Ocean Sync', 'Soundcheck VIP Floor', 'Memorial Ticket'],
  },
};

const DEFAULT_MEDIA = {
  image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
  artistAvatar: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=200&q=80',
  fandom: 'FANDOM',
  accent: '#0f172a',
  perks: ['VIP Soundcheck', 'Official Commemorative Pass', 'Priority Entrance'],
};

import { useDomainTheme } from '../context/DomainContext';

export const TourCalendar: React.FC = () => {
  const { formatPrice } = useCartWishlist();
  const { activeConfig } = useDomainTheme();

  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [bookedTour, setBookedTour] = useState<TourEvent | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('VIP Soundcheck Floor');

  const cities = [
    { id: 'all', name: 'All Cities', count: mockTourEvents.length },
    { id: 'Hanoi', name: 'Hanoi', count: mockTourEvents.filter(e => e.city === 'Hanoi').length },
    { id: 'Ho Chi Minh City', name: 'Ho Chi Minh City', count: mockTourEvents.filter(e => e.city === 'Ho Chi Minh City').length },
    { id: 'Seoul', name: 'Seoul', count: mockTourEvents.filter(e => e.city === 'Seoul').length },
    { id: 'Tokyo', name: 'Tokyo', count: mockTourEvents.filter(e => e.city === 'Tokyo').length },
    { id: 'Los Angeles', name: 'Los Angeles', count: mockTourEvents.filter(e => e.city === 'Los Angeles').length },
  ];

  const filteredTours = mockTourEvents.filter((ev) => {
    if (selectedCity === 'all') return true;
    return ev.city === selectedCity;
  });

  const handleBookTicket = (event: TourEvent) => {
    setBookedTour(event);
    setBookingSuccess(true);
  };

  const parseDateParts = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        return {
          month: months[d.getMonth()],
          day: String(d.getDate()).padStart(2, '0'),
          year: d.getFullYear(),
          dayOfWeek: days[d.getDay()],
        };
      }
    } catch {
      // fallback
    }
    const parts = dateStr.split('-');
    return {
      month: parts[1] ? `M${parts[1]}` : 'DATE',
      day: parts[2] || '01',
      year: parts[0] || '2026',
      dayOfWeek: 'TOUR',
    };
  };

  return (
    <section 
      id="tours" 
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        scrollMarginTop: '110px',
      }}
      className="py-16 md:py-24 w-full border-t border-slate-100"
    >
      <div 
        className="max-w-[1440px] mx-auto px-3.5 sm:px-7"
      >
        
        {/* ==================== 1. Editorial Section Header ==================== */}
        <div style={{ marginBottom: '32px' }}>
          
          {/* Eyebrow + Live Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px', height: '2px', backgroundColor: '#000000', display: 'inline-block', borderRadius: '2px' }} />
              <div 
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" 
                style={{ 
                  color: '#94a3b8',
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  letterSpacing: '0.2em'
                }}
              >
                <Ticket className="w-3.5 h-3.5 text-black" />
                <span>Global Stadium & Arena Schedules</span>
              </div>
            </div>

            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                fontSize: '10px',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              <span 
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 8px rgba(16,185,129,0.8)',
                  display: 'inline-block',
                }}
              />
              <span>Official Global Box Office</span>
            </div>
          </div>

          {/* Heading Row: Serif Title + City Tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              paddingBottom: '20px',
              borderBottom: '1px solid #f1f5f9',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h2 
                style={{
                  fontFamily: activeConfig.fontFamily,
                  fontSize: 'clamp(28px, 3.2vw, 44px)',
                  lineHeight: 1.15,
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                Upcoming World Tours{' '}
                <em style={{ fontWeight: 400, color: '#94a3b8', fontStyle: 'italic', fontFamily: 'serif' }}>
                  & Fan Meetings
                </em>
              </h2>
              <p 
                style={{
                  fontSize: '13px',
                  color: '#64748b',
                  margin: '8px 0 0 0',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  maxWidth: '700px',
                }}
              >
                Check official tour dates, arena venues, ticket availability, and priority fanclub pre-sale bookings.
              </p>
            </div>

            {/* City Filter Tabs - High-End Underline Editorial Style */}
            <div 
              className="flex items-center gap-4 sm:gap-5 overflow-x-auto scrollbar-none max-w-full pb-1"
            >
              {cities.map((c) => {
                const isActive = selectedCity === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCity(c.id)}
                    type="button"
                    style={{
                      padding: '0 0 8px 0',
                      fontSize: '11px',
                      fontWeight: isActive ? 800 : 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: isActive ? '#0f172a' : '#94a3b8',
                      background: 'none',
                      border: 'none',
                      borderBottom: isActive ? '2px solid #0f172a' : '2px solid transparent',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span>{c.name}</span>
                    <span 
                      style={{ 
                        fontSize: '10px', 
                        fontFamily: 'monospace',
                        color: isActive ? '#000000' : '#cbd5e1',
                        fontWeight: 700 
                      }}
                    >
                      ({c.count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==================== 2. Tour Events Grid (VIP Ticket Pass Aesthetic) ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => {
            const media = TOUR_MEDIA[tour.artistName] || DEFAULT_MEDIA;
            const dateParts = parseDateParts(tour.date);
            const isSoldOut = tour.status === 'Sold Out';

            // High-End Status Badge styling
            let statusBg = '#ffffff';
            let statusColor = '#0f172a';
            let statusBorder = '#e2e8f0';
            let statusDot = '#10b981';

            if (tour.status === 'Selling Fast') {
              statusBg = '#fff7ed';
              statusColor = '#c2410c';
              statusBorder = '#fdba74';
              statusDot = '#ea580c';
            } else if (tour.status === 'Sold Out') {
              statusBg = '#fef2f2';
              statusColor = '#b91c1c';
              statusBorder = '#fca5a5';
              statusDot = '#dc2626';
            } else if (tour.status === 'Presale Soon') {
              statusBg = '#f0f9ff';
              statusColor = '#0369a1';
              statusBorder = '#7dd3fc';
              statusDot = '#0284c7';
            }

            return (
              <div
                key={tour.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
                className="hover:border-black hover:shadow-xl group"
              >
                {/* ---------- TOP SECTION: Concert Atmosphere Banner ---------- */}
                <div>
                  <div 
                    style={{
                      position: 'relative',
                      height: '160px',
                      backgroundColor: '#0f172a',
                      overflow: 'hidden',
                    }}
                  >
                    <img 
                      src={media.image}
                      alt={tour.tourName}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.85,
                        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      className="group-hover:scale-105"
                    />
                    
                    {/* Rich Dark Vignette Overlay */}
                    <div 
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(15,23,42,0.4) 0%, rgba(15,23,42,0.2) 40%, rgba(15,23,42,0.95) 100%)',
                      }} 
                    />

                    {/* Top Overlay Badges: Status + Artist Fandom */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        right: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        zIndex: 10,
                      }}
                    >
                      <span 
                        style={{
                          fontSize: '10px',
                          fontFamily: 'monospace',
                          fontWeight: 800,
                          padding: '3px 8px',
                          backgroundColor: statusBg,
                          color: statusColor,
                          border: `1px solid ${statusBorder}`,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <span 
                          style={{ 
                            width: '5px', 
                            height: '5px', 
                            borderRadius: '50%', 
                            backgroundColor: statusDot,
                            display: 'inline-block',
                          }} 
                        />
                        <span>{tour.status}</span>
                      </span>

                      <span 
                        style={{
                          fontSize: '10px',
                          fontFamily: 'monospace',
                          fontWeight: 800,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          padding: '3px 8px',
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          color: '#ffffff',
                          border: '1px solid rgba(255,255,255,0.3)',
                        }}
                      >
                        {tour.artistName}
                      </span>
                    </div>

                    {/* Bottom Overlay Info: Avatar + Tour Name */}
                    <div 
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '14px',
                        right: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        zIndex: 10,
                      }}
                    >
                      <div 
                        style={{
                          width: '46px',
                          height: '46px',
                          border: '2px solid #ffffff',
                          backgroundColor: '#000000',
                          overflow: 'hidden',
                          flexShrink: 0,
                          boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                        }}
                      >
                        <img 
                          src={media.artistAvatar}
                          alt={tour.artistName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>

                      <div style={{ overflow: 'hidden' }}>
                        <span 
                          style={{ 
                            fontSize: '9px', 
                            fontFamily: 'monospace', 
                            color: '#cbd5e1', 
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            display: 'block',
                            marginBottom: '2px',
                          }}
                        >
                          OFFICIAL WORLD TOUR
                        </span>
                        <h3 
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: '17px',
                            fontWeight: 800,
                            color: '#ffffff',
                            margin: 0,
                            letterSpacing: '-0.01em',
                            lineHeight: 1.2,
                            textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                          }}
                          className="truncate group-hover:text-amber-200 transition-colors"
                        >
                          {tour.tourName}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* ---------- TICKET STUB PERFORATED DIVIDER ---------- */}
                  <div 
                    style={{
                      position: 'relative',
                      height: '18px',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* Left & Right Semicircular Ticket Notches */}
                    <div 
                      style={{
                        position: 'absolute',
                        left: '-9px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #e2e8f0',
                        boxShadow: 'inset -2px 0 3px rgba(0,0,0,0.06)',
                        zIndex: 10,
                      }} 
                    />
                    <div 
                      style={{
                        position: 'absolute',
                        right: '-9px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #e2e8f0',
                        boxShadow: 'inset 2px 0 3px rgba(0,0,0,0.06)',
                        zIndex: 10,
                      }} 
                    />
                    {/* Perforated Dashed Line */}
                    <div 
                      style={{
                        width: '100%',
                        margin: '0 16px',
                        borderTop: '1.5px dashed #cbd5e1',
                      }} 
                    />
                  </div>

                  {/* ---------- MIDDLE SECTION: Date, Venue, Perks ---------- */}
                  <div style={{ padding: '4px 20px 16px 20px' }}>
                    
                    {/* Date Block + Venue Info Row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                      
                      {/* Bold Calendar Stamp */}
                      <div 
                        style={{
                          width: '54px',
                          border: '1.5px solid #000000',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          flexShrink: 0,
                          textAlign: 'center',
                        }}
                      >
                        <span 
                          style={{
                            width: '100%',
                            backgroundColor: '#000000',
                            color: '#ffffff',
                            fontSize: '9px',
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            letterSpacing: '0.1em',
                            padding: '2px 0',
                          }}
                        >
                          {dateParts.month}
                        </span>
                        <span 
                          style={{
                            fontSize: '20px',
                            fontWeight: 900,
                            fontFamily: 'monospace',
                            lineHeight: 1.1,
                            padding: '4px 0 2px 0',
                            color: '#0f172a',
                          }}
                        >
                          {dateParts.day}
                        </span>
                        <span 
                          style={{
                            fontSize: '8px',
                            fontFamily: 'monospace',
                            color: '#64748b',
                            paddingBottom: '2px',
                          }}
                        >
                          {dateParts.year}
                        </span>
                      </div>

                      {/* Venue & Location Description */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                          <Calendar style={{ width: '12px', height: '12px', color: '#0f172a', flexShrink: 0 }} />
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
                            {tour.date}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', marginBottom: '2px' }}>
                          <MapPin style={{ width: '12px', height: '12px', color: '#0f172a', flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
                            {tour.venue}
                          </span>
                        </div>

                        <div style={{ fontSize: '11px', color: '#64748b', paddingLeft: '17px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{tour.city}, {tour.country}</span>
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tour.mapQuery)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ 
                              color: '#94a3b8', 
                              display: 'inline-flex', 
                              alignItems: 'center',
                              textDecoration: 'none',
                            }}
                            title="Open Google Maps"
                            className="hover:text-black transition-colors"
                          >
                            <ArrowUpRight style={{ width: '11px', height: '11px' }} />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* VIP Inclusions Micro-badges */}
                    <div 
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #f1f5f9',
                        padding: '8px 10px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                      }}
                    >
                      {media.perks.map((perk, idx) => (
                        <span 
                          key={idx}
                          style={{
                            fontSize: '9px',
                            fontFamily: 'monospace',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            padding: '2px 6px',
                            color: '#475569',
                            fontWeight: 600,
                          }}
                        >
                          ✦ {perk}
                        </span>
                      ))}
                    </div>

                  </div>
                </div>

                {/* ---------- BOTTOM SECTION: Pricing & Ticket CTA ---------- */}
                <div 
                  style={{
                    padding: '14px 20px',
                    borderTop: '1px solid #f1f5f9',
                    backgroundColor: '#fafafa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div>
                    <span 
                      style={{
                        fontSize: '9px',
                        fontFamily: 'monospace',
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        display: 'block',
                      }}
                    >
                      Starting From
                    </span>
                    <span 
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: '18px',
                        fontWeight: 800,
                        color: '#0f172a',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {formatPrice(tour.ticketPriceFromUSD, tour.ticketPriceFromVND)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookTicket(tour)}
                    disabled={isSoldOut}
                    type="button"
                    style={{
                      height: '38px',
                      padding: '0 16px',
                      backgroundColor: isSoldOut ? '#e2e8f0' : '#000000',
                      color: isSoldOut ? '#94a3b8' : '#ffffff',
                      border: isSoldOut ? '1.5px solid #cbd5e1' : '1.5px solid #000000',
                      fontSize: '11px',
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: isSoldOut ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}
                    className={!isSoldOut ? "hover:bg-neutral-800 active:scale-95" : ""}
                  >
                    <Ticket style={{ width: '13px', height: '13px' }} />
                    <span>{isSoldOut ? 'Sold Out' : 'Get Tickets'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* ==================== 3. High-End VIP Ticket Pass Modal ==================== */}
        {bookingSuccess && bookedTour && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
            onClick={() => setBookingSuccess(false)}
          >
            <div 
              style={{
                backgroundColor: '#ffffff',
                maxWidth: '460px',
                width: '100%',
                border: '2px solid #000000',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Banner */}
              <div 
                style={{
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1.5px solid #000000',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck style={{ width: '16px', height: '16px', color: '#10b981' }} />
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    VIP CONCERT PASS DISPATCH
                  </span>
                </div>
                <button
                  onClick={() => setBookingSuccess(false)}
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  className="hover:text-white"
                  aria-label="Close modal"
                >
                  <X style={{ width: '16px', height: '16px' }} />
                </button>
              </div>

              {/* Modal Body: Ticket Pass */}
              <div style={{ padding: '24px' }}>
                
                {/* Status Indicator */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div 
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px auto',
                      borderRadius: '50%',
                    }}
                  >
                    <Check style={{ width: '24px', height: '24px' }} />
                  </div>
                  <h3 
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '20px',
                      fontWeight: 800,
                      color: '#0f172a',
                      margin: '0 0 6px 0',
                    }}
                  >
                    Concert Ticket Portal Connected!
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                    You are reserved for <strong>{bookedTour.tourName}</strong> in <strong>{bookedTour.city}</strong> ({bookedTour.venue}) on {bookedTour.date}.
                  </p>
                </div>

                {/* Simulated Ticket Stub Preview */}
                <div 
                  style={{
                    border: '1.5px solid #000000',
                    backgroundColor: '#f8fafc',
                    padding: '16px',
                    marginBottom: '18px',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0', marginBottom: '10px' }}>
                    <div>
                      <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>ARTIST / TOUR</span>
                      <h4 style={{ fontSize: '13px', fontWeight: 800, margin: 0, color: '#0f172a' }}>{bookedTour.artistName}</h4>
                    </div>
                    <span style={{ fontSize: '10px', fontFamily: 'monospace', backgroundColor: '#000', color: '#fff', padding: '2px 6px', fontWeight: 800 }}>
                      PASS #{bookedTour.id.toUpperCase()}-2026
                    </span>
                  </div>

                  {/* Tier Selection */}
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                      SELECT SEATING TIER:
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                      {['VIP Floor', 'Tier 1 Lower', 'General Adm'].map((tier) => (
                        <button
                          key={tier}
                          onClick={() => setSelectedTier(tier)}
                          type="button"
                          style={{
                            padding: '6px 4px',
                            fontSize: '10px',
                            fontFamily: 'monospace',
                            fontWeight: selectedTier === tier ? 800 : 600,
                            border: '1px solid #000',
                            backgroundColor: selectedTier === tier ? '#000' : '#fff',
                            color: selectedTier === tier ? '#fff' : '#000',
                            cursor: 'pointer',
                          }}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority Code Callout */}
                  <div 
                    style={{
                      padding: '10px 12px',
                      backgroundColor: '#fffbeb',
                      border: '1px solid #fde68a',
                      fontSize: '11px',
                      color: '#92400e',
                    }}
                  >
                    🎫 Official Fan Club Pre-sale Priority code: <strong>FANHUB-VIP-99</strong>
                  </div>

                  {/* Barcode Simulation */}
                  <div style={{ marginTop: '12px', textAlign: 'center', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '15px', letterSpacing: '4px', color: '#000', fontWeight: 900 }}>
                      ||| | || |||| | ||| || |||||| | ||
                    </div>
                    <span style={{ fontSize: '8px', fontFamily: 'monospace', color: '#94a3b8' }}>
                      OFFICIAL ENCRYPTED BARCODE · VERIFIED BY FAN HUB PLUS
                    </span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setBookingSuccess(false)}
                  type="button"
                  style={{
                    width: '100%',
                    height: '42px',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    border: '1.5px solid #000000',
                    fontSize: '11px',
                    fontWeight: 800,
                    fontFamily: 'monospace',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                  className="hover:bg-neutral-800"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
