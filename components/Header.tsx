'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGoogleLanguage } from './GoogleTranslate';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useAuth } from '../context/AuthContext';
import { useDomainTheme } from '../context/DomainContext';
import {
  Menu,
  Search,
  User,
  ShoppingBag,
  FileText,
  Globe,
  Sun,
  Moon,
  X,
  ShieldCheck,
  Sparkles,
  Disc,
  Users,
  Calendar,
  Map,
  MessageSquare,
  Building2,
  CheckCircle2,
  Palette,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  ArrowRight,
  Phone,
  Loader2,
} from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  onOpenFeedback: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const extractApiError = (data: any, fallbackMsg: string): string => {
  if (!data) return fallbackMsg;
  if (typeof data.message === 'string' && data.message.trim()) return data.message;
  if (data.errors && typeof data.errors === 'object') {
    const messages: string[] = [];
    for (const key of Object.keys(data.errors)) {
      const val = data.errors[key];
      if (Array.isArray(val)) {
        messages.push(...val);
      } else if (typeof val === 'string' && val.trim()) {
        messages.push(val);
      }
    }
    if (messages.length > 0) return messages.join('. ');
  }
  if (typeof data.title === 'string' && data.title.trim()) return data.title;
  if (typeof data.error === 'string' && data.error.trim()) return data.error;
  return fallbackMsg;
};

export const Header: React.FC<HeaderProps> = ({
  onOpenAdmin,
  onOpenFeedback,
  searchQuery,
  setSearchQuery,
}) => {
  const pathname = usePathname();
  const { language, toggleLanguage } = useGoogleLanguage();
  const { cartCount, wishlistCount, setIsCartOpen, setIsWishlistOpen, currency, toggleCurrency } = useCartWishlist();
  const { user, isLoggedIn, loginAs, logout } = useAuth();
  const { themeMode, toggleThemeMode } = useDomainTheme();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [isLargeFont, setIsLargeFont] = useState(false);

  // Form & Tab State for Auth Modal
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authNotification, setAuthNotification] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Sub-header navigation dropdown (Exact matching user's image)
  const [isAllMdDropdownOpen, setIsAllMdDropdownOpen] = useState(false);
  const [isB2BModalOpen, setIsB2BModalOpen] = useState(false);
  const [isCustomZoneOpen, setIsCustomZoneOpen] = useState(false);
  const [b2bSubmitted, setB2bSubmitted] = useState(false);
  const [b2bOrg, setB2bOrg] = useState('');
  const [b2bContact, setB2bContact] = useState('');
  const [b2bQty, setB2bQty] = useState('50');
  const [b2bArtist, setB2bArtist] = useState('NewJeans');

  const toggleFontSize = () => {
    setIsLargeFont(!isLargeFont);
    if (!isLargeFont) {
      document.documentElement.classList.add('font-accessible-large');
    } else {
      document.documentElement.classList.remove('font-accessible-large');
    }
  };

  const scrollToSection = (id: string) => {
    setIsAllMdDropdownOpen(false);
    setIsMenuDrawerOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const allMdItems = [
    { label: 'EVENT', action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/event'; } },
    { label: 'CD&DVD', action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/cd-dvd-book'; } },
    { label: 'MD', action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/md'; } },
    { label: "ALL MD SEASON'S GREETINGS", action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/cd-dvd-book'; } },
    { label: 'CUSTOM ZONE', action: () => { setIsAllMdDropdownOpen(false); setIsCustomZoneOpen(true); } },
    { label: 'DUCKJIL ZONE', action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/artist'; } },
    { label: 'ALLMD BEAUTY', action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/md'; } },
    { label: 'CONTACT FOR BULK ORDER', action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/b2b'; } },
    { label: 'ALLMD TV', action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/'; } },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200">

      {/* Main Bar - Large, spacious & prominent matching reference */}
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '20px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          backgroundColor: '#ffffff',
        }}
      >
        {/* LEFT: Menu button & Large Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
          <button
            onClick={() => setIsAllMdDropdownOpen(!isAllMdDropdownOpen)}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: '#000000',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: 'none',
              transition: 'opacity 0.15s ease',
              flexShrink: 0,
            }}
            className="hover:opacity-90"
            title="Menu Categories"
            type="button"
          >
            <Menu style={{ width: '22px', height: '22px' }} />
          </button>

          <Link href="/" style={{ display: 'flex', alignItems: 'center' }} className="notranslate">
            <img
              src="/logo-dark.png?v=2"
              alt="Fan Hub Plus"
              style={{ height: '46px', width: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </Link>
        </div>

        {/* CENTER: Wide Underline Search Bar (Matching Reference Image 2) */}
        <div style={{ flex: 1, maxWidth: '640px', margin: '0 32px' }}>
          <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search album, OST, anime, game (e.g. Demon Slayer, NewJeans)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 48px 10px 4px',
                fontSize: '15px',
                fontWeight: 500,
                border: 'none',
                borderBottom: '2px solid #000000',
                borderRadius: '0px',
                outline: 'none',
                backgroundColor: 'transparent',
                color: '#000000',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '38px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Clear"
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            )}
            <button
              type="button"
              style={{
                position: 'absolute',
                right: '4px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                color: '#000000',
              }}
              title="Search"
            >
              <Search style={{ width: '22px', height: '22px', strokeWidth: 2 }} />
            </button>
          </div>
        </div>

        {/* RIGHT: User Profile, Cart, Wishlist Doc, Language Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
          {/* User Profile Icon */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            className="hover:bg-slate-100"
            title={isLoggedIn ? user.name : 'Sign In'}
            type="button"
          >
            <User style={{ width: '22px', height: '22px', strokeWidth: 1.8 }} />
          </button>

          {/* Shopping Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background-color 0.15s ease',
            }}
            className="hover:bg-slate-100"
            title="Cart"
            type="button"
          >
            <ShoppingBag style={{ width: '22px', height: '22px', strokeWidth: 1.8 }} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  fontSize: '10px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #ffffff',
                }}
                className="notranslate"
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Wishlist / Document Icon */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background-color 0.15s ease',
            }}
            className="hover:bg-slate-100"
            title="Wishlist"
            type="button"
          >
            <FileText style={{ width: '22px', height: '22px', strokeWidth: 1.8 }} />
            {wishlistCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  fontSize: '10px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #ffffff',
                }}
                className="notranslate"
              >
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Language Switcher Pill [ 🌐 VI / EN ] */}
          <button
            onClick={toggleLanguage}
            title={language === 'en' ? 'Translate to Vietnamese (Google Translate)' : 'Chuyển sang Tiếng Anh'}
            type="button"
            className="notranslate hover:bg-slate-900 hover:text-white"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              fontSize: '14px',
              fontWeight: 800,
              border: '2px solid #000000',
              borderRadius: '9999px',
              backgroundColor: '#ffffff',
              color: '#000000',
              cursor: 'pointer',
              height: '40px',
              marginLeft: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <Globe style={{ width: '17px', height: '17px' }} />
            <span>{language === 'en' ? 'EN' : 'VI'}</span>
          </button>

          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleThemeMode}
            title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            type="button"
            className="notranslate hover:bg-slate-100 hover:scale-105"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: themeMode === 'dark' ? '#f59e0b' : '#000000',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              marginLeft: '2px',
            }}
          >
            {themeMode === 'dark' ? (
              <Sun style={{ width: '22px', height: '22px', strokeWidth: 2 }} />
            ) : (
              <Moon style={{ width: '22px', height: '22px', strokeWidth: 2 }} />
            )}
          </button>

          {/* Admin shortcut if admin */}
          {user.role === 'admin' && (
            <Link
              href="/admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: 800,
                backgroundColor: '#fef3c7',
                color: '#92400e',
                border: '1px solid #fcd34d',
                borderRadius: '6px',
                cursor: 'pointer',
                height: '40px',
                marginLeft: '4px',
                textDecoration: 'none',
              }}
              title="Admin Portal"
            >
              <ShieldCheck style={{ width: '16px', height: '16px', color: '#d97706' }} />
              <span>Admin</span>
            </Link>
          )}
        </div>
      </div>

      {/* SECONDARY CATEGORY NAVIGATION BAR - Wide, tall, prominently spaced */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
          position: 'relative',
          zIndex: 30,
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '0 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '54px',
            position: 'relative',
          }}
        >
          {/* [ ≡ ALL MD ] Black Button with Exact Dropdown */}
          <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', zIndex: 60 }}>
            <button
              onClick={() => setIsAllMdDropdownOpen(!isAllMdDropdownOpen)}
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0 28px',
                fontSize: '13px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#ffffff',
                backgroundColor: '#000000',
                border: 'none',
                height: '44px',
                borderRadius: '0px',
                cursor: 'pointer',
                transition: 'opacity 0.15s ease',
              }}
              className="hover:opacity-90"
            >
              <Menu style={{ width: '16px', height: '16px' }} />
              <span>ALL MD</span>
            </button>

            {/* Dropdown Menu */}
            {isAllMdDropdownOpen && (
              <>
                {/* Backdrop to close on click outside */}
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 9990, backgroundColor: 'transparent' }}
                  onClick={() => setIsAllMdDropdownOpen(false)}
                />

                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '100%',
                    marginTop: '8px',
                    width: '260px',
                    maxWidth: '90vw',
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #000000',
                    borderRadius: '0px',
                    padding: '22px 22px',
                    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.15)',
                    zIndex: 9999,
                    display: 'block',
                  }}
                >
                  {/* Top pointer caret triangle */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      left: '46px',
                      width: 0,
                      height: 0,
                      borderLeft: '7px solid transparent',
                      borderRight: '7px solid transparent',
                      borderBottom: '8px solid #000000',
                      zIndex: 10000,
                    }}
                  />

                  {/* 9 Menu Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {allMdItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={item.action}
                        style={{
                          textAlign: 'left',
                          fontWeight: 800,
                          fontSize: '13px',
                          color: '#000000',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                          background: 'none',
                          border: 'none',
                          padding: '2px 0',
                          cursor: 'pointer',
                          transition: 'color 0.15s ease',
                          display: 'block',
                          width: '100%',
                        }}
                        className="hover:text-slate-500"
                        type="button"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Horizontal Links: Prominently spaced across bar matching reference image */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '64px',
              flexWrap: 'nowrap',
              height: '100%',
            }}
          >
            <Link
              href="/artist"
              style={{
                fontSize: '14px',
                fontWeight: 900,
                letterSpacing: '0.06em',
                color: '#000000',
                textTransform: 'uppercase',
                padding: '14px 6px',
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                borderBottom: pathname?.startsWith('/artist') ? '2.5px solid #000000' : '2.5px solid transparent',
                textDecoration: 'none',
              }}
              className="hover:opacity-60"
            >
              ARTIST
            </Link>
            <Link
              href="/event"
              style={{
                fontSize: '14px',
                fontWeight: 900,
                letterSpacing: '0.06em',
                color: '#000000',
                textTransform: 'uppercase',
                padding: '14px 6px',
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                borderBottom: pathname?.startsWith('/event') ? '2.5px solid #000000' : '2.5px solid transparent',
                textDecoration: 'none',
              }}
              className="hover:opacity-60"
            >
              EVENT
            </Link>
            <Link
              href="/cd-dvd-book"
              style={{
                fontSize: '14px',
                fontWeight: 900,
                letterSpacing: '0.06em',
                color: '#000000',
                textTransform: 'uppercase',
                padding: '14px 6px',
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                borderBottom: pathname === '/cd-dvd-book' ? '2.5px solid #000000' : '2.5px solid transparent',
                textDecoration: 'none',
              }}
              className="hover:opacity-60"
            >
              CD/DVD/BOOK
            </Link>
            <Link
              href="/md"
              style={{
                fontSize: '14px',
                fontWeight: 900,
                letterSpacing: '0.06em',
                color: '#000000',
                textTransform: 'uppercase',
                padding: '14px 6px',
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                borderBottom: pathname === '/md' ? '2.5px solid #000000' : '2.5px solid transparent',
                textDecoration: 'none',
              }}
              className="hover:opacity-60"
            >
              MD
            </Link>
            <Link
              href="/b2b"
              style={{
                fontSize: '14px',
                fontWeight: 900,
                letterSpacing: '0.06em',
                color: '#000000',
                textTransform: 'uppercase',
                padding: '14px 6px',
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                borderBottom: pathname?.startsWith('/b2b') ? '2.5px solid #000000' : '2.5px solid transparent',
                textDecoration: 'none',
              }}
              className="hover:opacity-60"
            >
              B2B/BULK
            </Link>
          </nav>
        </div>
      </div>

      {/* CUSTOM ZONE MODAL */}
      {isCustomZoneOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              maxWidth: '440px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setIsCustomZoneOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
              type="button"
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Palette style={{ width: '22px', height: '22px', color: '#000000' }} />
              <h3 className="text-base font-bold text-slate-900">
                CUSTOM ZONE - Fan DIY Studio
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Personalize your bias lightstick, holographic toploader binders, and custom photocard sleeves.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Holographic Toploader Deco Kit</div>
                  <div className="text-[11px] text-slate-500">Stickers, charms, and protective UV sleeves</div>
                </div>
                <span className="font-bold text-sky-600">$12.00</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Lightstick Custom Dome Decals</div>
                  <div className="text-[11px] text-slate-500">NewJeans, BLACKPINK, BTS strap & decal sets</div>
                </div>
                <span className="font-bold text-sky-600">$9.50</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Custom Bias NFC Keychain Card</div>
                  <div className="text-[11px] text-slate-500">Taps on smartphone to play idol voice note</div>
                </div>
                <span className="font-bold text-sky-600">$15.00</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCustomZoneOpen(false);
                scrollToSection('albums');
              }}
              className="mt-5 w-full py-2.5 text-white text-xs font-bold rounded cursor-pointer"
              style={{ backgroundColor: '#000000' }}
              type="button"
            >
              Explore Official Custom Kits in Catalog
            </button>
          </div>
        </div>
      )}

      {/* B2B / Bulk Order Modal (From Image 2 & Dropdown CONTACT FOR BULK ORDER) */}
      {isB2BModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              maxWidth: '460px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => {
                setIsB2BModalOpen(false);
                setB2bSubmitted(false);
              }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
              type="button"
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>

            {b2bSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div
                  className="bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto"
                  style={{ width: '48px', height: '48px', borderRadius: '50%' }}
                >
                  <CheckCircle2 style={{ width: '28px', height: '28px' }} />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  B2B Group Order Request Received!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Thank you! Our Global Wholesale & Group Order department will send tier-discount quotations to your contact within 2 hours.
                </p>
                <div
                  className="p-3 border text-xs text-sky-800"
                  style={{ backgroundColor: '#fafafa', borderColor: '#d4d4d4', borderRadius: '8px' }}
                >
                  📦 Inquiries reflect 100% on official Hanteo & Circle Charts.
                </div>
                <button
                  onClick={() => {
                    setIsB2BModalOpen(false);
                    setB2bSubmitted(false);
                  }}
                  className="mt-4 px-6 py-2 text-white text-xs font-bold cursor-pointer"
                  style={{ backgroundColor: '#000000', borderRadius: '8px' }}
                  type="button"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 style={{ width: '20px', height: '20px', color: '#000000' }} />
                  <h3 className="text-base font-bold text-slate-900">
                    B2B & Fandom Group Orders (GO)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Wholesale discounts for fan clubs, international group order managers, and retailers. 100% Hanteo Chart counted.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!b2bOrg.trim() || !b2bContact.trim()) return;
                    setB2bSubmitted(true);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Fanbase / Business Organization
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bunnies Global Fandom, Seoul K-Store"
                      value={b2bOrg}
                      onChange={(e) => setB2bOrg(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 focus:outline-none"
                      style={{ borderRadius: '8px' }}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Email / WhatsApp Contact
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. fandom_order@gmail.com / +84 912 345 678"
                      value={b2bContact}
                      onChange={(e) => setB2bContact(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 focus:outline-none"
                      style={{ borderRadius: '8px' }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Target Artist
                      </label>
                      <select
                        value={b2bArtist}
                        onChange={(e) => setB2bArtist(e.target.value)}
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 focus:outline-none"
                        style={{ borderRadius: '8px' }}
                      >
                        <option value="NewJeans">NewJeans</option>
                        <option value="BLACKPINK">BLACKPINK</option>
                        <option value="BTS">BTS</option>
                        <option value="Stray Kids">Stray Kids</option>
                        <option value="IVE">IVE</option>
                        <option value="aespa">aespa</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Quantity (Copies)
                      </label>
                      <input
                        type="number"
                        min="20"
                        step="10"
                        required
                        value={b2bQty}
                        onChange={(e) => setB2bQty(e.target.value)}
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 focus:outline-none"
                        style={{ borderRadius: '8px' }}
                      />
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 text-[11px] text-slate-600 rounded space-y-1">
                    <p className="font-semibold text-slate-800">Perks for Group Order Managers:</p>
                    <p>✓ Custom photocard sorting service</p>
                    <p>✓ Direct EMS / DHL Express shipping from Seoul</p>
                    <p>✓ Official Hanteo Chart authentication barcode</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white text-xs py-2.5 font-bold cursor-pointer shadow-xs mt-2"
                    style={{ backgroundColor: '#000000', borderRadius: '8px' }}
                  >
                    Submit B2B Quotation Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Login / Auth Modal - Clean Root Styled Sign In & Sign Up */}
      {isAuthModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg, 16px)',
              maxWidth: '430px',
              width: '100%',
              padding: '28px 24px',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative',
              border: '1px solid var(--border-color)'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setIsAuthModalOpen(false);
                setAuthNotification(null);
              }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-body)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '1px solid var(--border-color)',
                transition: 'all var(--transition-fast)'
              }}
              type="button"
              title="Close"
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>

            {isLoggedIn ? (
              /* LOGGED IN USER PROFILE CARD */
              <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      margin: '0 auto 12px auto',
                      objectFit: 'cover',
                      border: '3px solid var(--color-primary)',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  />
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                    {user.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600, margin: 0 }}>
                    {user.email}
                  </p>
                </div>

                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: 'var(--bg-body)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border-color)',
                    fontSize: '12px',
                    marginBottom: '20px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Vai trò:</span>
                    <span style={{ fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                      {user.role}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Fandom:</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {user.favoriteFandoms.join(', ')}
                    </span>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      onOpenAdmin();
                    }}
                    style={{
                      width: '100%',
                      padding: '11px',
                      backgroundColor: 'var(--color-gold)',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 700,
                      borderRadius: 'var(--radius)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginBottom: '10px'
                    }}
                    type="button"
                  >
                    <ShieldCheck style={{ width: '16px', height: '16px' }} />
                    Mở Bảng Quản Trị Admin
                  </button>
                )}

                <button
                  onClick={() => {
                    logout();
                    setIsAuthModalOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '11px',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    fontSize: '13px',
                    fontWeight: 700,
                    borderRadius: 'var(--radius)',
                    border: '1px solid #fecaca',
                    cursor: 'pointer'
                  }}
                  type="button"
                >
                  Đăng Xuất Tài Khoản
                </button>
              </div>
            ) : (
              /* SIGN IN / SIGN UP FORM MODAL */
              <div>
                {/* Brand Logo Header */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <img
                    src="/logo-dark.png?v=2"
                    alt="Fan Hub Plus Logo"
                    style={{ height: '40px', width: 'auto', margin: '0 auto 12px auto', objectFit: 'contain' }}
                  />
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 4px 0' }}>
                    {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    {authMode === 'signin'
                      ? 'Welcome back to Fan Hub Plus'
                      : 'Join now for exclusive fan perks & pre-order access'}
                  </p>
                </div>

                {authNotification && (
                  <div
                    style={{
                      marginBottom: '16px',
                      padding: '10px 12px',
                      backgroundColor: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      color: '#047857',
                      fontSize: '12px',
                      fontWeight: 700,
                      borderRadius: 'var(--radius)',
                      textAlign: 'center'
                    }}
                  >
                    {authNotification}
                  </div>
                )}

                {authError && (
                  <div
                    style={{
                      marginBottom: '16px',
                      padding: '10px 12px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#b91c1c',
                      fontSize: '12px',
                      fontWeight: 700,
                      borderRadius: 'var(--radius)',
                      textAlign: 'center'
                    }}
                  >
                    {authError}
                  </div>
                )}

                {/* SIGN IN FORM */}
                {authMode === 'signin' && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setAuthError(null);
                      setAuthNotification(null);
                      setIsLoadingAuth(true);

                      try {
                        const response = await fetch('/api/v1/auth/login', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            email: loginEmail,
                            password: loginPassword,
                          }),
                        });

                        const data = await response.json().catch(() => ({}));

                        if (response.status === 200 || response.status === 201) {
                          // Save access_token to cookie
                          if (data.access_token) {
                            document.cookie = `access_token=${data.access_token}; path=/; max-age=604800; SameSite=Lax`;
                            localStorage.setItem('access_token', data.access_token);
                          }
                          if (data.refresh_token) {
                            document.cookie = `refresh_token=${data.refresh_token}; path=/; max-age=2592000; SameSite=Lax`;
                            localStorage.setItem('refresh_token', data.refresh_token);
                          }

                          const userInfo = data.user_info || {};
                          const userRole = (userInfo.role || loginEmail).toLowerCase().includes('admin') ? 'admin' : 'registered';

                          setAuthNotification(data.message || 'Đăng nhập thành công!');
                          loginAs(userRole, {
                            id: userInfo.id || data.user_id || 'usr_' + Date.now(),
                            name: userInfo.full_name || userInfo.name || data.full_name || loginEmail.split('@')[0],
                            email: userInfo.email || loginEmail,
                          });

                          setTimeout(() => {
                            setIsAuthModalOpen(false);
                            setAuthNotification(null);
                            setAuthError(null);
                          }, 1000);
                        } else {
                          setAuthError(extractApiError(data, `Lỗi ${response.status}: Đăng nhập thất bại.`));
                        }
                      } catch (err: any) {
                        setAuthError(err.message || 'Không thể kết nối tới server /api/v1/auth/login');
                      } finally {
                        setIsLoadingAuth(false);
                      }
                    }}
                  >
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Email Address
                      </label>
                      <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                        <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        <input
                          type="email"
                          required
                          placeholder="e.g. user@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          style={{
                            width: '100%',
                            paddingLeft: '38px',
                            paddingRight: '14px',
                            paddingTop: '10px',
                            paddingBottom: '10px',
                            fontSize: '13px',
                            backgroundColor: 'var(--bg-body)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius)',
                            outline: 'none',
                            color: 'var(--text-primary)',
                            transition: 'all var(--transition-fast)'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          Password
                        </label>
                        <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: '11px', fontWeight: 700, color: '#000000' }} className="dark:text-white hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                        <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          style={{
                            width: '100%',
                            paddingLeft: '38px',
                            paddingRight: '38px',
                            paddingTop: '10px',
                            paddingBottom: '10px',
                            fontSize: '13px',
                            backgroundColor: 'var(--bg-body)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius)',
                            outline: 'none',
                            color: 'var(--text-primary)',
                            transition: 'all var(--transition-fast)'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4px'
                          }}
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoadingAuth}
                      style={{
                        width: '100%',
                        padding: '11px',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 700,
                        borderRadius: 'var(--radius)',
                        border: '1px solid #000000',
                        cursor: isLoadingAuth ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: 'var(--shadow-sm)',
                        opacity: isLoadingAuth ? 0.7 : 1,
                        transition: 'all var(--transition-fast)'
                      }}
                      className="dark:bg-white dark:text-black dark:border-white"
                    >
                      {isLoadingAuth ? (
                        <>
                          <Loader2 className="animate-spin" style={{ width: '16px', height: '16px' }} />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight style={{ width: '16px', height: '16px' }} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* SIGN UP FORM */}
                {authMode === 'signup' && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setAuthError(null);
                      setAuthNotification(null);

                      if (signupPassword !== signupConfirmPassword) {
                        setAuthError('Confirm password does not match');
                        return;
                      }

                      setIsLoadingAuth(true);

                      try {
                        const response = await fetch('/api/v1/auth/register', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            email: signupEmail,
                            Email: signupEmail,
                            password: signupPassword,
                            Password: signupPassword,
                            fullName: signupName,
                            full_name: signupName,
                            FullName: signupName,
                            confirmPassword: signupConfirmPassword,
                            confirm_password: signupConfirmPassword,
                            ConfirmPassword: signupConfirmPassword,
                            phoneNumber: signupPhone,
                            phone_number: signupPhone,
                            PhoneNumber: signupPhone,
                            phone: signupPhone,
                          }),
                        });

                        const data = await response.json().catch(() => ({}));

                        if (response.ok || response.status === 200 || response.status === 201) {
                          if (data.access_token) {
                            document.cookie = `access_token=${data.access_token}; path=/; max-age=604800; SameSite=Lax`;
                            localStorage.setItem('access_token', data.access_token);
                          }
                          if (data.refresh_token) {
                            document.cookie = `refresh_token=${data.refresh_token}; path=/; max-age=2592000; SameSite=Lax`;
                            localStorage.setItem('refresh_token', data.refresh_token);
                          }

                          setAuthNotification(data.message || 'Đăng ký thành công!');
                          loginAs('registered', {
                            id: data.user_id || 'usr_' + Date.now(),
                            name: signupName,
                            email: signupEmail,
                          });
                          setTimeout(() => {
                            setIsAuthModalOpen(false);
                            setAuthNotification(null);
                            setAuthError(null);
                          }, 1200);
                        } else {
                          setAuthError(extractApiError(data, 'Registration failed. Please try again.'));
                        }
                      } catch (err: any) {
                        setAuthError(err.message || 'Unable to connect to auth server (/api/v1/auth/register)');
                      } finally {
                        setIsLoadingAuth(false);
                      }
                    }}
                  >
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                        Full Name
                      </label>
                      <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                        <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Nguyễn Văn A"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          style={{
                            width: '100%',
                            paddingLeft: '38px',
                            paddingRight: '14px',
                            paddingTop: '9px',
                            paddingBottom: '9px',
                            fontSize: '13px',
                            backgroundColor: 'var(--bg-body)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius)',
                            outline: 'none',
                            color: 'var(--text-primary)',
                            transition: 'all var(--transition-fast)'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                        Email Address
                      </label>
                      <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                        <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        <input
                          type="email"
                          required
                          placeholder="user@example.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          style={{
                            width: '100%',
                            paddingLeft: '38px',
                            paddingRight: '14px',
                            paddingTop: '9px',
                            paddingBottom: '9px',
                            fontSize: '13px',
                            backgroundColor: 'var(--bg-body)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius)',
                            outline: 'none',
                            color: 'var(--text-primary)',
                            transition: 'all var(--transition-fast)'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                        Phone Number
                      </label>
                      <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                        <Phone style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        <input
                          type="tel"
                          placeholder="e.g. 0912345678"
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value)}
                          style={{
                            width: '100%',
                            paddingLeft: '38px',
                            paddingRight: '14px',
                            paddingTop: '9px',
                            paddingBottom: '9px',
                            fontSize: '13px',
                            backgroundColor: 'var(--bg-body)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius)',
                            outline: 'none',
                            color: 'var(--text-primary)',
                            transition: 'all var(--transition-fast)'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                        Password
                      </label>
                      <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                        <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Min 6 characters"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          style={{
                            width: '100%',
                            paddingLeft: '38px',
                            paddingRight: '38px',
                            paddingTop: '9px',
                            paddingBottom: '9px',
                            fontSize: '13px',
                            backgroundColor: 'var(--bg-body)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius)',
                            outline: 'none',
                            color: 'var(--text-primary)',
                            transition: 'all var(--transition-fast)'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4px'
                          }}
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                        </button>
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                        Confirm Password
                      </label>
                      <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                        <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Repeat password"
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          style={{
                            width: '100%',
                            paddingLeft: '38px',
                            paddingRight: '14px',
                            paddingTop: '9px',
                            paddingBottom: '9px',
                            fontSize: '13px',
                            backgroundColor: 'var(--bg-body)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius)',
                            outline: 'none',
                            color: 'var(--text-primary)',
                            transition: 'all var(--transition-fast)'
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoadingAuth}
                      style={{
                        width: '100%',
                        padding: '11px',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 700,
                        borderRadius: 'var(--radius)',
                        border: '1px solid #000000',
                        cursor: isLoadingAuth ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: 'var(--shadow-sm)',
                        opacity: isLoadingAuth ? 0.7 : 1,
                        transition: 'all var(--transition-fast)'
                      }}
                      className="dark:bg-white dark:text-black dark:border-white"
                    >
                      {isLoadingAuth ? (
                        <>
                          <Loader2 className="animate-spin" style={{ width: '16px', height: '16px' }} />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <UserCheck style={{ width: '16px', height: '16px' }} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Bottom Switch Link */}
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                  {authMode === 'signin' ? (
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                      {"Don't have an account?"}{' '}
                      <button
                        type="button"
                        onClick={() => { setAuthMode('signup'); setAuthNotification(null); }}
                        style={{ fontWeight: 800, color: '#000000', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        className="dark:text-white hover:underline"
                      >
                        Sign up now
                      </button>
                    </p>
                  ) : (
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => { setAuthMode('signin'); setAuthNotification(null); }}
                        style={{ fontWeight: 800, color: '#000000', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        className="dark:text-white hover:underline"
                      >
                        Sign in now
                      </button>
                    </p>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      )}

    </header>
  );
};
