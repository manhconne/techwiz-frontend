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
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
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

      {/* Main Bar - Responsive Header Bar */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 md:px-9 py-2.5 sm:py-4 flex items-center justify-between gap-3 md:gap-6 bg-white">
        {/* LEFT: Menu button & Logo */}
        <div className="flex items-center gap-2.5 sm:gap-4 md:gap-5 shrink-0">
          <button
            onClick={() => setIsMenuDrawerOpen(true)}
            className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-black text-white flex items-center justify-center cursor-pointer hover:opacity-90 shrink-0 border-0"
            title="Menu Sidebar"
            type="button"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center notranslate shrink-0">
            <img
              src="/logo-dark.png?v=2"
              alt="Fan Hub Plus"
              className="h-8 sm:h-9 md:h-11 w-auto object-contain block"
            />
          </Link>
        </div>

        {/* CENTER: Wide Underline Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-[640px] mx-4 lg:mx-8">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              placeholder="Search album, OST, anime, game (e.g. Demon Slayer, NewJeans)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pr-12 pl-1 text-[15px] font-medium border-0 border-b-2 border-black rounded-none outline-none bg-transparent text-black"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-9 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black p-1 border-0 bg-transparent cursor-pointer"
                title="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-black p-1 border-0 bg-transparent cursor-pointer"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* RIGHT: Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* Mobile Search Icon Button -> Opens Dedicated Mobile Search Modal */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="mobile-search-btn w-9 h-9 sm:w-10 sm:h-10 rounded-full items-center justify-center text-black hover:bg-slate-100 cursor-pointer border-0 bg-transparent transition-colors"
            title="Search"
            type="button"
          >
            <Search style={{ width: '20px', height: '20px', strokeWidth: 1.8 }} />
          </button>

          {/* User Profile Icon */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-black hover:bg-slate-100 cursor-pointer border-0 bg-transparent transition-colors"
            title={isLoggedIn ? user.name : 'Sign In'}
            type="button"
          >
            <User style={{ width: '20px', height: '20px', strokeWidth: 1.8 }} />
          </button>

          {/* Shopping Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-black hover:bg-slate-100 cursor-pointer border-0 bg-transparent relative transition-colors"
            title="Cart"
            type="button"
          >
            <ShoppingBag style={{ width: '20px', height: '20px', strokeWidth: 1.8 }} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '1px',
                  right: '1px',
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
            className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full items-center justify-center text-black hover:bg-slate-100 cursor-pointer border-0 bg-transparent relative transition-colors"
            title="Wishlist"
            type="button"
          >
            <FileText style={{ width: '20px', height: '20px', strokeWidth: 1.8 }} />
            {wishlistCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '1px',
                  right: '1px',
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
            className="hidden sm:flex notranslate hover:bg-slate-900 hover:text-white items-center gap-1.5 px-3 py-1 text-xs font-black border-2 border-black rounded-full bg-white text-black h-8 sm:h-9 cursor-pointer transition-all"
          >
            <Globe style={{ width: '15px', height: '15px' }} />
            <span>{language === 'en' ? 'EN' : 'VI'}</span>
          </button>

          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleThemeMode}
            title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            type="button"
            className="hidden sm:flex notranslate hover:bg-slate-100 w-9 h-9 rounded-full items-center justify-center text-black border-0 bg-transparent cursor-pointer transition-transform"
          >
            {themeMode === 'dark' ? (
              <Sun style={{ width: '20px', height: '20px', strokeWidth: 2, color: '#f59e0b' }} />
            ) : (
              <Moon style={{ width: '20px', height: '20px', strokeWidth: 2 }} />
            )}
          </button>

          {/* Admin shortcut if admin */}
          {user.role === 'admin' && (
            <Link
              href="/admin"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 rounded-md cursor-pointer h-8 text-decoration-none"
              title="Admin Portal"
            >
              <ShieldCheck style={{ width: '15px', height: '15px', color: '#d97706' }} />
              <span className="hidden md:inline">Admin</span>
            </Link>
          )}
        </div>
      </div>

      {/* SECONDARY CATEGORY NAVIGATION BAR */}
      <div className="w-full bg-white border-t border-b border-slate-200 relative z-30">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-9 flex items-center justify-between h-11 sm:h-[54px] relative gap-4">
          {/* [ ≡ ALL MD ] Black Button with Exact Dropdown */}
          <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', zIndex: 60 }}>
            <button
              onClick={() => setIsAllMdDropdownOpen(!isAllMdDropdownOpen)}
              type="button"
              className="flex items-center gap-2 px-3.5 sm:px-7 text-xs sm:text-[13px] font-black uppercase tracking-wider text-white bg-black h-8 sm:h-11 hover:opacity-90 border-0 cursor-pointer shrink-0"
            >
              <Menu style={{ width: '15px', height: '15px' }} />
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

          {/* Horizontal Links */}
          <nav className="flex items-center gap-6 sm:gap-10 lg:gap-14 flex-nowrap h-full shrink-0 overflow-x-auto scrollbar-none pl-3 sm:pl-0">
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

      {/* ========================================================================= */}
      {/* MOBILE SIDEBAR DRAWER (Bấm bars mở sidebar, chứa danh mục & ALL MD) */}
      {/* ========================================================================= */}
      {isMenuDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMenuDrawerOpen(false)}
          />

          {/* Drawer content sliding from left */}
          <div className="relative w-[310px] sm:w-[350px] max-w-[85vw] h-full bg-white flex flex-col shadow-2xl z-10 overflow-hidden animate-in slide-in-from-left duration-300">
            {/* Top Bar with Brand & Close */}
            <div className="p-4 flex items-center justify-between border-b border-slate-200 bg-slate-50">
              <Link
                href="/"
                onClick={() => setIsMenuDrawerOpen(false)}
                className="flex items-center notranslate"
              >
                <img
                  src="/logo-dark.png?v=2"
                  alt="Fan Hub Plus"
                  className="h-8 w-auto object-contain block"
                />
              </Link>
              <button
                type="button"
                onClick={() => setIsMenuDrawerOpen(false)}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-black cursor-pointer shadow-xs transition-colors"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search trigger button in Drawer */}
            <div className="p-3.5 border-b border-slate-100 bg-white">
              <button
                type="button"
                onClick={() => {
                  setIsMenuDrawerOpen(false);
                  setIsSearchModalOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg text-xs font-semibold cursor-pointer border-0 transition-colors"
              >
                <Search className="w-4 h-4 text-slate-600" />
                <span>Tìm kiếm album, nghệ sĩ, OST...</span>
              </button>
            </div>

            {/* Scrollable Nav Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
              {/* 1. Main Navigation Links */}
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 px-1">
                  Điều hướng chính / Main Menu
                </div>
                <div className="space-y-1">
                  <Link
                    href="/artist"
                    onClick={() => setIsMenuDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-black" />
                      ARTIST
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link
                    href="/event"
                    onClick={() => setIsMenuDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-black" />
                      EVENT
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link
                    href="/cd-dvd-book"
                    onClick={() => setIsMenuDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Disc className="w-4 h-4 text-black" />
                      CD / DVD / BOOK
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link
                    href="/md"
                    onClick={() => setIsMenuDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-black" />
                      MD (Official Merchandise)
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </div>
              </div>

              {/* 2. ALL MD Collection Categories */}
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center justify-between">
                  <span>ALL MD CATEGORIES</span>
                  <span className="bg-black text-white text-[9px] px-1.5 py-0.5 rounded font-bold">9 MỤC</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 space-y-1">
                  {allMdItems.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setIsMenuDrawerOpen(false);
                        item.action();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-white hover:text-black hover:shadow-xs transition-all flex items-center justify-between border-0 cursor-pointer bg-transparent"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Quick Section Jumps */}
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 px-1">
                  Khám phá nhanh / Sections
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection('albums')}
                    className="p-2.5 text-left bg-white border border-slate-200 rounded-lg hover:border-black text-xs font-bold text-slate-800 cursor-pointer"
                  >
                    🎵 Album Drops
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('artists')}
                    className="p-2.5 text-left bg-white border border-slate-200 rounded-lg hover:border-black text-xs font-bold text-slate-800 cursor-pointer"
                  >
                    ⭐ Hồ sơ Idol
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('tours')}
                    className="p-2.5 text-left bg-white border border-slate-200 rounded-lg hover:border-black text-xs font-bold text-slate-800 cursor-pointer"
                  >
                    🎫 World Tour
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('community')}
                    className="p-2.5 text-left bg-white border border-slate-200 rounded-lg hover:border-black text-xs font-bold text-slate-800 cursor-pointer"
                  >
                    💬 Fandom Feed
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Footer Actions inside Drawer */}
            <div className="p-3.5 border-t border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>{language === 'en' ? 'English (EN)' : 'Tiếng Việt (VI)'}</span>
                </button>
                <button
                  type="button"
                  onClick={toggleThemeMode}
                  className="w-10 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-800 hover:bg-slate-100 cursor-pointer"
                  title="Đổi giao diện Sáng / Tối"
                >
                  {themeMode === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-700" />
                  )}
                </button>
              </div>

              {isLoggedIn ? (
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block truncate max-w-[170px]">{user.name}</span>
                    <span className="text-[10px] text-slate-500 block truncate max-w-[170px]">{user.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsMenuDrawerOpen(false);
                    }}
                    className="text-xs font-bold text-red-600 hover:underline bg-transparent border-0 cursor-pointer p-1"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuDrawerOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-black text-white text-xs font-black uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-neutral-800 border-0"
                >
                  <User className="w-4 h-4" />
                  <span>Đăng nhập / Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DEDICATED SEARCH MODAL (Nút tìm kiếm mở modal tìm kiếm riêng trên mobile) */}
      {/* ========================================================================= */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-start">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsSearchModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full bg-white shadow-2xl z-10 border-b border-slate-200 animate-in slide-in-from-top-4 duration-200">
            {/* Modal Header */}
            <div className="max-w-[800px] mx-auto px-4 pt-4 pb-3 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-black">
                <Search className="w-4 h-4 text-black" />
                <span>Tìm kiếm / Search</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer border-0 transition-colors"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Input Form */}
            <div className="max-w-[800px] mx-auto px-4 py-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSearchModalOpen(false);
                  const albumsEl = document.getElementById('albums');
                  if (albumsEl) albumsEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  autoFocus
                  placeholder="Nhập tên album, nghệ sĩ, bài hát, OST..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 pl-3 pr-24 text-base font-semibold border-b-2 border-black rounded-none outline-none bg-transparent text-black placeholder:text-slate-400"
                />
                <div className="absolute right-0 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1.5 text-slate-400 hover:text-black bg-transparent border-0 cursor-pointer"
                      title="Xóa"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-black text-white text-xs font-bold uppercase rounded-md cursor-pointer hover:bg-neutral-800 border-0 flex items-center gap-1"
                  >
                    <span>Tìm</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Trending keywords */}
              <div className="mt-4 pb-2">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                  🔥 Gợi ý tìm kiếm phổ biến
                </div>
                <div className="flex flex-wrap gap-2">
                  {['BTS', 'NewJeans', 'BLACKPINK', 'Stray Kids', 'Demon Slayer', 'Limited Kit', 'Vinyl', 'OST'].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setSearchQuery(term);
                        setIsSearchModalOpen(false);
                        const albumsEl = document.getElementById('albums');
                        if (albumsEl) albumsEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-black hover:text-white text-slate-700 text-xs font-semibold rounded-full border-0 cursor-pointer transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
