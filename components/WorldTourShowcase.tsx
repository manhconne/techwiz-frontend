'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  Ticket, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Radio, 
  ExternalLink,
  Flame,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { mockTourEvents } from '../data/mockData';
import { useCartWishlist } from '../context/CartWishlistContext';
import { TourEvent } from '../types';

interface WorldTourShowcaseProps {
  onSelectEvent?: (event: TourEvent) => void;
}

export const WorldTourShowcase: React.FC<WorldTourShowcaseProps> = ({ onSelectEvent }) => {
  const { formatPrice } = useCartWishlist();
  const [activeCity, setActiveCity] = useState<string>('all');

  // Featured stadium concerts
  const featuredTours = useMemo(() => {
    const ids = ['tour-bp-hanoi', 'tour-bts-wembley', 'tour-atsh-hn', 'tour-conan-m27', 'tour-atvncg-hanoi', 'tour-ive-world'];
    let items = mockTourEvents.filter(e => ids.includes(e.id));
    if (items.length < 3) items = mockTourEvents.slice(0, 4);

    if (activeCity !== 'all') {
      return items.filter(e => e.city.toLowerCase() === activeCity.toLowerCase());
    }
    return items.slice(0, 3);
  }, [activeCity]);

  const cities = [
    { id: 'all', label: 'All Arenas' },
    { id: 'hanoi', label: 'Hanoi (My Dinh)' },
    { id: 'london', label: 'London (Wembley)' },
    { id: 'tokyo', label: 'Tokyo (Dome)' },
  ];

  return (
    <section 
      id="tours"
      className="w-full py-16 md:py-24 bg-slate-50/70 border-t border-b border-slate-200/80 relative overflow-hidden transition-colors duration-500"
    >
      {/* Subtle ambient background glow */}
      <div 
        className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-10 border-b border-slate-200/90 gap-6 flex-wrap">
          <div>
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10.5px] font-mono font-bold uppercase tracking-wider mb-3 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>STADIUM TOUR CALENDAR · LIVE STAGE ACCESS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase text-slate-900 font-sans m-0">
              World Tour &amp; Stadium Arenas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl font-normal leading-relaxed">
              Official live concert passes, soundcheck priority access, and anti-scalp encrypted tickets guaranteed direct from global partner networks.
            </p>
          </div>

          {/* City filter tabs & View All Button */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-white border border-slate-200/90 shadow-2xs">
              {cities.map((c) => {
                const isActive = activeCity === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveCity(c.id)}
                    type="button"
                    style={{
                      color: isActive ? '#ffffff' : '#475569',
                      backgroundColor: isActive ? '#0f172a' : 'transparent',
                    }}
                    className={`px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                      isActive 
                        ? 'shadow-xs' 
                        : 'hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            <Link
              href="/event#location-events"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider transition-all shadow-2xs group cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
              <span>Sự Kiện Gần Bạn (GPS)</span>
            </Link>

            <Link
              href="/event"
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full hover:bg-slate-800 text-xs font-bold uppercase tracking-wider transition-all shadow-sm group cursor-pointer"
            >
              <span style={{ color: '#ffffff' }}>Full Tour Schedule</span>
              <ArrowRight size={13} style={{ color: '#ffffff' }} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 3-Card Stadium Tour Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredTours.map((tour) => {
            return (
              <div
                key={tour.id}
                className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-sm hover:border-blue-500/50 hover:shadow-[0_20px_45px_-8px_rgba(37,99,235,0.14)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={tour.coverImage}
                    alt={tour.tourTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

                  {/* Top-Left Category Badge */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold uppercase tracking-wider text-white shadow-xs">
                    <Sparkles size={11} className="text-amber-400" />
                    <span>{tour.badgeText || tour.category}</span>
                  </div>

                  {/* Top-Right Status Badge */}
                  <div className="absolute top-3 right-3 z-10 px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-mono font-black uppercase tracking-wider shadow-sm">
                    {tour.status === 'Sold Out' ? 'VIP ALLOCATION' : tour.status}
                  </div>

                  {/* Floating Venue Pin */}
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-xs text-white font-medium">
                    <span className="inline-flex items-center gap-1.5 text-white font-bold truncate max-w-[70%]">
                      <MapPin size={13} className="text-blue-400 shrink-0" />
                      <span className="truncate">{tour.venue}</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-300 shrink-0">
                      {tour.city}, {tour.country}
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Date and Time Line */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-semibold mb-2">
                      <span className="flex items-center gap-1.5 text-amber-600 font-bold">
                        <Calendar size={12} />
                        <span>{tour.date} · {tour.time}</span>
                      </span>
                      <span className="text-slate-400">100% Guaranteed</span>
                    </div>

                    {/* Tour Title */}
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-2.5">
                      {tour.tourName}
                    </h3>

                    {/* Artist and Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {tour.description}
                    </p>

                    {/* Perks preview chips */}
                    {tour.perks && tour.perks.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap mb-4">
                        {tour.perks.slice(0, 2).map((perk, pIdx) => (
                          <span
                            key={pIdx}
                            className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 truncate max-w-[190px]"
                          >
                            ✓ {perk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Pricing & Action */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block uppercase font-bold tracking-wider">
                        Ticket Price From
                      </span>
                      <div className="text-base sm:text-lg font-black text-slate-950">
                        {formatPrice(tour.ticketPriceFromUSD, tour.ticketPriceFromVND)}
                      </div>
                    </div>

                    <Link
                      href="/event"
                      style={{
                        backgroundColor: '#000000',
                        color: '#ffffff',
                      }}
                      className="px-4 py-2.5 rounded-xl hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0"
                    >
                      <Ticket size={13} style={{ color: '#ffffff' }} />
                      <span style={{ color: '#ffffff' }}>Book Pass</span>
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-12 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/80">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Anti-Scalper Security
              </div>
              <div className="text-[11.5px] text-slate-500 mt-0.5">
                Encrypted identity barcode directly bound to your Weverse / Global ID
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/80">
              <Radio size={22} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Soundcheck Priority
              </div>
              <div className="text-[11.5px] text-slate-500 mt-0.5">
                Early arena admission &amp; soundcheck pass for verified club members
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/80">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Wireless Sync Gates
              </div>
              <div className="text-[11.5px] text-slate-500 mt-0.5">
                Bluetooth pairing desk at venue gates for synchronized stadium lightsticks
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
