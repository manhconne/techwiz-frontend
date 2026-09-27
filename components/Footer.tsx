'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useGoogleLanguage } from './GoogleTranslate';
import {
  Globe,
  ShoppingBag,
  Users,
  Headphones,
  Settings,
  ChevronRight,
  Radio,
  Star,
  BookOpen,
} from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenFeedback: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenFeedback }) => {
  const pathname = usePathname();
  const { toggleLanguage } = useGoogleLanguage();
  const [isMangaTheme, setIsMangaTheme] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const themeAttr = document.documentElement.getAttribute('data-fandom-theme') || 
                        document.body.getAttribute('data-fandom-theme') ||
                        document.querySelector('[data-fandom-theme]')?.getAttribute('data-fandom-theme');
      setIsMangaTheme(pathname?.startsWith('/manga') || themeAttr === 'manga');
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['data-fandom-theme'] });
    return () => observer.disconnect();
  }, [pathname]);

  const footerLinks = isMangaTheme ? [
    {
      heading: 'Shop Manga',
      badgeColor: '#ff4d4d',
      badgeTextColor: '#ffffff',
      icon: <BookOpen size={12} strokeWidth={2.5} />,
      links: [
        { label: 'Tankōbon Releases', href: '/manga#manga-catalog' },
        { label: 'Shonen Jump+ Drops', href: '/manga#manga-catalog' },
        { label: 'Seinen Classics', href: '/manga#manga-catalog' },
        { label: 'Mangaka Artbooks', href: '/manga#manga-catalog' },
        { label: 'Limited Variants', href: '/manga#manga-catalog' },
      ],
    },
    {
      heading: 'Manga Fandoms',
      badgeColor: '#fff9c4',
      badgeTextColor: '#2d2d2d',
      icon: <Users size={12} strokeWidth={2.5} />,
      links: [
        { label: 'Straw Hat Crew (One Piece)', href: '/manga#manga-catalog' },
        { label: 'Jujutsu Sorcerers (JJK)', href: '/manga#manga-catalog' },
        { label: 'Devil Hunters (Chainsaw Man)', href: '/manga#manga-catalog' },
        { label: 'Band of the Hawk (Berserk)', href: '/manga#manga-catalog' },
        { label: 'Party of Heroes (Frieren)', href: '/manga#manga-catalog' },
      ],
    },
    {
      heading: 'Discover',
      badgeColor: '#ffd60a',
      badgeTextColor: '#000000',
      icon: <Headphones size={12} strokeWidth={2.5} />,
      links: [
        { label: 'Mangaka Drafting Desk', href: '/manga#mangaka-studio' },
        { label: 'Tankōbon Reader Notes', href: '/manga#manga-notes' },
        { label: 'Original G-Pen Drafts', href: '/manga#mangaka-studio' },
        { label: 'Tokyo Akihabara Vault', href: '/manga' },
        { label: 'Community Discussion Wall', href: '/manga#manga-notes' },
      ],
    },
    {
      heading: 'Support & Admin',
      badgeColor: '#ccff00',
      badgeTextColor: '#000000',
      icon: <Settings size={12} strokeWidth={2.5} />,
      links: [
        { label: 'Global DHL Courier Dispatch', href: '#' },
        { label: 'Authentic Import Guarantee', href: '/manga' },
        { label: '★ Send User Feedback', href: '#', onClick: onOpenFeedback },
        { label: '⚡ Admin Control Panel', href: '#', onClick: onOpenAdmin, highlight: true },
      ],
    },
  ] : [
    {
      heading: 'Shop',
      badgeColor: '#ff2e93',
      badgeTextColor: '#ffffff',
      icon: <ShoppingBag size={12} strokeWidth={2.5} />,
      links: [
        { label: 'K-Pop Albums', href: '/#albums' },
        { label: 'Anime OSTs', href: '/#albums' },
        { label: 'Game Soundtracks', href: '/#albums' },
        { label: 'Limited Editions', href: '/#albums' },
        { label: 'Pre-Orders', href: '/#upcoming-releases' },
      ],
    },
    {
      heading: 'Fandom',
      badgeColor: '#00f0ff',
      badgeTextColor: '#000000',
      icon: <Users size={12} strokeWidth={2.5} />,
      links: [
        { label: 'Bunnies (NewJeans)', href: '/#artists' },
        { label: 'BLINK (BLACKPINK)', href: '/#artists' },
        { label: 'A.R.M.Y (BTS)', href: '/#artists' },
        { label: 'STAY (Stray Kids)', href: '/#artists' },
        { label: 'DIVE (IVE) & MY (aespa)', href: '/#artists' },
      ],
    },
    {
      heading: 'Discover',
      badgeColor: '#ffd60a',
      badgeTextColor: '#000000',
      icon: <Headphones size={12} strokeWidth={2.5} />,
      links: [
        { label: 'Lossless Streaming Center', href: '/#multimedia' },
        { label: 'World Tour Stadium Radar', href: '/#tours' },
        { label: 'Nearby Events Radar', href: '/event#location-events' },
        { label: 'Idol & Hero Dossiers', href: '/#artists' },
        { label: 'Fan Lore Wire Feed', href: '/#community' },
        { label: 'Audio Teaser Previews', href: '/#albums' },
        { label: 'Scheduled Drops Calendar', href: '/#upcoming-releases' },
      ],
    },
    {
      heading: 'Support & Admin',
      badgeColor: '#ccff00',
      badgeTextColor: '#000000',
      icon: <Settings size={12} strokeWidth={2.5} />,
      links: [
        { label: 'Global DHL Courier Dispatch', href: '#' },
        { label: 'Official Ticketing Verification', href: '/#tours' },
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-12 items-start">

          {/* ── Brand Column ── */}
          <div className="flex flex-col gap-5 col-span-2 md:col-span-1">
            {/* Logo */}
            <div className="notranslate">
              <img
                src="/logo-dark.png?v=2"
                alt="Fan Hub Plus"
                style={{ height: '38px', width: 'auto', objectFit: 'contain', display: 'block' }}
              />
            </div>

            {/* Tagline */}
            <p
              style={{
                fontFamily: 'var(--font-sans), sans-serif',
                fontSize: '11px',
                fontWeight: 500,
                color: '#475569',
                lineHeight: 1.65,
                margin: 0,
                maxWidth: '260px',
              }}
            >
              The official pop-cyber editorial sanctuary for global fandom. Direct certified imports from Seoul with guaranteed Hanteo, Circle &amp; Oricon chart reflections.
            </p>

            {/* Chart Badges */}
            <div className="notranslate flex flex-wrap gap-2">
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  borderRadius: '0px',
                  border: '2px solid #000000',
                  padding: '4px 10px',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono), monospace',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  backgroundColor: '#ffd60a',
                  color: '#000000',
                  boxShadow: '2px 2px 0px #000000',
                }}
              >
                <Star size={10} />
                {isMangaTheme ? 'Shonen Jump+' : 'Hanteo Official'}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  borderRadius: '0px',
                  border: '2px solid #000000',
                  padding: '4px 10px',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono), monospace',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  backgroundColor: '#00f0ff',
                  color: '#000000',
                  boxShadow: '2px 2px 0px #000000',
                }}
              >
                <Radio size={10} />
                {isMangaTheme ? 'Kodansha Verified' : 'Circle Verified'}
              </span>
            </div>
          </div>

          {/* ── Link Columns ── */}
          {footerLinks.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              {/* Column heading badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  paddingBottom: '8px',
                  borderBottom: '2px solid #000000',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '3px 8px',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono), monospace',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    backgroundColor: col.badgeColor,
                    color: col.badgeTextColor,
                    border: '1.5px solid #000000',
                    boxShadow: '1.5px 1.5px 0px #000000',
                    borderRadius: '0px',
                  }}
                >
                  {col.icon}
                  {col.heading}
                </span>
              </div>

              {/* Links list */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.onClick ? (
                      <button
                        onClick={link.onClick}
                        type="button"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 8px',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono), monospace',
                          fontWeight: link.highlight ? 900 : 700,
                          color: '#000000',
                          backgroundColor: link.highlight ? '#ffd60a' : '#ffffff',
                          border: '1.5px solid #000000',
                          boxShadow: '2px 2px 0px #000000',
                          borderRadius: '0px',
                          cursor: 'pointer',
                          transition: 'background-color 0.1s ease',
                          textAlign: 'left',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget;
                          el.style.backgroundColor = link.highlight ? '#ff2e93' : '#ffd60a';
                          el.style.color = '#000000';
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget;
                          el.style.backgroundColor = link.highlight ? '#ffd60a' : '#ffffff';
                          el.style.color = '#000000';
                        }}
                      >
                        {link.highlight && <ChevronRight size={11} style={{ color: '#ff2e93', flexShrink: 0 }} />}
                        <span>{link.label}</span>
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '12px',
                          fontFamily: 'var(--font-sans), sans-serif',
                          fontWeight: 600,
                          color: '#374151',
                          textDecoration: 'none',
                          transition: 'color 0.1s ease',
                          lineHeight: 1.4,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#ff2e93';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#374151';
                        }}
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

        {/* ── Heavy divider ── */}
        <div style={{ height: '3px', backgroundColor: '#000000', margin: '40px 0' }} />

        {/* ── Bottom bar ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '11px',
          }}
        >
          {/* Copyright */}
          <p
            style={{
              margin: 0,
              color: '#000000',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#ff2e93',
                border: '1px solid #000000',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            © 2026 FAN HUB PLUS • SRS VER 1.0 CERTIFIED • ALL RIGHTS RESERVED
          </p>

          {/* Center edition badge */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#ccff00',
              color: '#000000',
              border: '2px solid #000000',
              padding: '4px 12px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontSize: '10px',
              boxShadow: '2px 2px 0px #000000',
            }}
          >
            ★ VIBRANT POP Y2K CYBER EDITION ★
          </span>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '11px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#000000',
              backgroundColor: '#00f0ff',
              border: '2px solid #000000',
              padding: '8px 16px',
              cursor: 'pointer',
              boxShadow: '3px 3px 0px #000000',
              borderRadius: '0px',
              transition: 'all 0.1s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ffd60a';
              e.currentTarget.style.boxShadow = '4px 4px 0px #000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#00f0ff';
              e.currentTarget.style.boxShadow = '3px 3px 0px #000000';
            }}
            className="notranslate"
          >
            <Globe size={14} strokeWidth={2} />
            <span>ENGLISH (GLOBAL)</span>
          </button>
        </div>

      </div>
    </footer>
  );
};
