'use client';

import React from 'react';
import { useGoogleLanguage } from './GoogleTranslate';
import { Heart, Globe, Music, ShoppingBag, Users, Headphones, ChevronRight } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenFeedback: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenFeedback }) => {
  const { language, toggleLanguage } = useGoogleLanguage();

  const footerLinks = [
    {
      heading: 'Shop',
      icon: <ShoppingBag size={13} />,
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
      icon: <Users size={13} />,
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
      icon: <Headphones size={13} />,
      links: [
        { label: 'World Tour Calendar', href: '#tours' },
        { label: 'Artist Profiles', href: '#artists' },
        { label: 'Fan Community', href: '#community' },
        { label: 'Audio Previews', href: '#albums' },
        { label: 'New Releases', href: '#albums' },
      ],
    },
    {
      heading: 'Support',
      icon: <Music size={13} />,
      links: [
        { label: 'Worldwide Shipping', href: '#' },
        { label: 'Tour Schedule Guide', href: '#tours' },
        { label: 'Send Feedback', href: '#', onClick: onOpenFeedback },
        { label: 'Admin Panel', href: '#', onClick: onOpenAdmin, highlight: true },
      ],
    },
  ];

  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        color: '#0f172a',
      }}
    >
      {/* Top Section */}
      <div
        className="max-w-[1440px] mx-auto px-4 sm:px-9 py-10 sm:py-16"
      >
        <div
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 items-start"
        >

          {/* Brand Column */}
          <div
            className="flex flex-col gap-5 col-span-2 md:col-span-1"
          >
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
            <p
              style={{
                fontSize: '13px',
                color: '#64748b',
                lineHeight: 1.7,
                maxWidth: '280px',
              }}
            >
              Official destination for global K-pop fans. Certified direct imports from Seoul with guaranteed Hanteo &amp; Circle chart counts.
            </p>

            {/* Chart Badges */}
            <div
              className="notranslate"
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignSelf: 'flex-start',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#334155',
                  border: '1px solid #e2e8f0',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  backgroundColor: '#f8fafc',
                }}
              >
                Hanteo Chart Official
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignSelf: 'flex-start',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#334155',
                  border: '1px solid #e2e8f0',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  backgroundColor: '#f8fafc',
                }}
              >
                Circle Chart Verified
              </span>
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((col) => (
            <div
              key={col.heading}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* Column Heading */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ color: '#94a3b8' }}>{col.icon}</span>
                <h4
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    margin: 0,
                    color: '#0f172a',
                  }}
                >
                  {col.heading}
                </h4>
              </div>

              {/* Links */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.onClick ? (
                      <button
                        onClick={link.onClick}
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 500,
                          color: link.highlight ? '#d97706' : '#64748b',
                          textAlign: 'left',
                          transition: 'color 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                        className={link.highlight ? 'hover:text-amber-500' : 'hover:text-slate-900'}
                      >
                        {link.highlight && <ChevronRight size={11} />}
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          color: '#64748b',
                          textDecoration: 'none',
                          transition: 'color 0.15s ease',
                          display: 'block',
                        }}
                        className="hover:text-slate-900"
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

        {/* Divider */}
        <div
          style={{
            height: '1px',
            backgroundColor: '#e2e8f0',
            margin: '48px 0 28px',
          }}
        />

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Copyright */}
          <p
            style={{
              fontSize: '12px',
              color: '#94a3b8',
              margin: 0,
            }}
          >
            © 2026 Fan Hub Plus. All Rights Reserved. Official Charts Sync Partner.
          </p>

          {/* Center: Crafted with */}
          <span
            style={{
              fontSize: '12px',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            Crafted with <Heart size={11} style={{ color: '#f43f5e', fill: '#f43f5e' }} /> for K-Pop Fans
          </span>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            type="button"
            className="notranslate hover:border-slate-400 transition-colors"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#475569',
              backgroundColor: 'transparent',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            <Globe size={13} style={{ color: '#3b82f6' }} />
            {language === 'en' ? 'English (EN)' : 'Tiếng Việt (VI)'}
          </button>
        </div>

      </div>
    </footer>
  );
};
