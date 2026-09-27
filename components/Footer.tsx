'use client';

import React from 'react';
import { useGoogleLanguage } from './GoogleTranslate';
import { Globe, Music, ShoppingBag, Users, Headphones, ChevronRight } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenFeedback: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenFeedback }) => {
  const { language, toggleLanguage } = useGoogleLanguage();

  const footerLinks = [
    {
      heading: 'Shop',
      badgeColor: 'bg-[#ff2e93] text-white',
      icon: <ShoppingBag size={13} strokeWidth={2} />,
      links: [
        { label: 'K-Pop Albums', href: '#albums' },
        { label: 'Anime OSTs', href: '#albums' },
        { label: 'Game Soundtracks', href: '#albums' },
        { label: 'Limited Editions', href: '#albums' },
        { label: 'Pre-Orders', href: '#albums' },
      ],
    },
    {
      heading: 'Fandom',
      badgeColor: 'bg-[#00f0ff] text-black',
      icon: <Users size={13} strokeWidth={2} />,
      links: [
        { label: 'Bunnies (NewJeans)', href: '#artists' },
        { label: 'BLINK (BLACKPINK)', href: '#artists' },
        { label: 'A.R.M.Y (BTS)', href: '#artists' },
        { label: 'STAY (Stray Kids)', href: '#artists' },
        { label: 'DIVE (IVE) & MY (aespa)', href: '#artists' },
      ],
    },
    {
      heading: 'Discover',
      badgeColor: 'bg-[#ffd60a] text-black',
      icon: <Headphones size={13} strokeWidth={2} />,
      links: [
        { label: 'Lossless Streaming Center', href: '#multimedia' },
        { label: 'World Tour Stadium Radar', href: '#tours' },
        { label: 'Nearby Events Radar', href: '/event#location-events' },
        { label: 'Idol & Hero Dossiers', href: '#artists' },
        { label: 'Fan Lore Wire Feed', href: '#community' },
        { label: 'Audio Teaser Previews', href: '#albums' },
        { label: 'Scheduled Drops Calendar', href: '#upcoming-releases' },
      ],
    },
    {
      heading: 'Support & Admin',
      badgeColor: 'bg-[#ccff00] text-black',
      icon: <Music size={13} strokeWidth={2} />,
      links: [
        { label: 'Global DHL Courier Dispatch', href: '#' },
        { label: 'Official Ticketing Verification', href: '#tours' },
        { label: '★ Send User Feedback', href: '#', onClick: onOpenFeedback },
        { label: '⚡ Admin Control Panel', href: '#', onClick: onOpenAdmin, highlight: true },
      ],
    },
  ];

  return (
    <footer
      style={{
        backgroundColor: '#fdfbf7',
        borderTop: '4px solid #000000',
        color: '#000000',
      }}
    >
      {/* Top Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-9 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 items-start">

          {/* Brand Column */}
          <div className="flex flex-col gap-5 col-span-2 md:col-span-1">
            {/* Logo */}
            <div className="notranslate">
              <img
                src="/logo-dark.png?v=2"
                alt="Fan Hub Plus"
                style={{
                  height: '38px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>

            {/* Tagline */}
            <p className="font-sans font-semibold text-xs text-neutral-700 leading-relaxed max-w-[280px]">
              The official pop-cyber editorial sanctuary for global fandom. Direct certified imports from Seoul with guaranteed Hanteo, Circle &amp; Oricon chart reflections.
            </p>

            {/* Chart Badges (Vibrant Y2K Pop stickers) */}
            <div className="notranslate flex flex-wrap gap-2 font-mono">
              <span
                style={{
                  borderRadius: '0px',
                  border: '2px solid #000000',
                  padding: '4px 10px',
                  fontSize: '10px',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  backgroundColor: '#ffd60a',
                  color: '#000000',
                  boxShadow: '2px 2px 0px #000000',
                }}
              >
                ★ Hanteo Official
              </span>
              <span
                style={{
                  borderRadius: '0px',
                  border: '2px solid #000000',
                  padding: '4px 10px',
                  fontSize: '10px',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  backgroundColor: '#00f0ff',
                  color: '#000000',
                  boxShadow: '2px 2px 0px #000000',
                }}
              >
                ✦ Circle Verified
              </span>
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4 font-mono">
              {/* Column Heading */}
              <div className="flex items-center gap-2 pb-2 border-b-2 border-black">
                <span className={`px-2 py-0.5 text-[10px] font-black uppercase border border-black shadow-[1px_1px_0px_#000] ${col.badgeColor}`}>
                  {col.heading}
                </span>
              </div>

              {/* Links */}
              <ul className="list-none p-0 m-0 flex flex-col gap-2.5 font-sans">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.onClick ? (
                      <button
                        onClick={link.onClick}
                        type="button"
                        className={`text-xs text-left cursor-pointer transition-colors duration-100 flex items-center gap-1.5 p-1 bg-white border border-black shadow-[2px_2px_0px_#000] hover:bg-[#fff9db] font-mono ${
                          link.highlight 
                            ? 'font-black bg-[#ffd60a] text-black' 
                            : 'font-bold text-neutral-900 hover:text-black'
                        }`}
                      >
                        {link.highlight && <ChevronRight size={12} className="text-[#ff2e93]" />}
                        <span>{link.label}</span>
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        className="text-xs font-semibold text-neutral-700 hover:text-[#ff2e93] hover:translate-x-1 transition-all duration-100 block no-underline"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Divider (Heavy rule) */}
        <div className="h-[3px] bg-black my-10" />

        {/* Bottom bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 font-mono text-xs">
          {/* Copyright */}
          <p className="text-black font-bold m-0 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#ff2e93] border border-black inline-block" />
            <span>© 2026 FAN HUB PLUS • SRS VER 1.0 CERTIFIED • ALL RIGHTS RESERVED</span>
          </p>

          {/* Center */}
          <span className="bg-[#ccff00] text-black border-2 border-black px-3 py-1 font-black uppercase tracking-widest text-[10px] shadow-[2px_2px_0px_#000]">
            ★ VIBRANT POP Y2K CYBER EDITION ★
          </span>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            type="button"
            style={{ borderRadius: '0px' }}
            className="notranslate flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider text-black bg-[#00f0ff] hover:bg-[#38bdf8] border-2 border-black px-4 py-2 cursor-pointer shadow-[3px_3px_0px_#000000] active:translate-y-0.5 transition-all"
          >
            <Globe size={14} strokeWidth={2} />
            <span>ENGLISH (GLOBAL)</span>
          </button>
        </div>

      </div>
    </footer>
  );
};

