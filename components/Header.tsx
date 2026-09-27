'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGoogleLanguage } from './GoogleTranslate';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useAuth } from '../context/AuthContext';
import { useDomainTheme } from '../context/DomainContext';
import { PersonalDashboardModal } from './PersonalDashboardModal';
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
  ChevronRight,
  Ticket,
  Gift,
  Tv,
  Heart,
  Compass,
} from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  onOpenFeedback: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fandomThemeKey?: string;
  fandomCategory?: string;
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
  fandomThemeKey = 'all',
  fandomCategory = 'all',
}) => {
  const pathname = usePathname();
  const { language, toggleLanguage } = useGoogleLanguage();
  const { cartCount, wishlistCount, setIsCartOpen, setIsWishlistOpen, currency, toggleCurrency } = useCartWishlist();
  const { user, isLoggedIn, loginAs, logout, requestPasswordReset, resetPasswordWithToken } = useAuth();
  const { themeMode, toggleThemeMode } = useDomainTheme();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLargeFont, setIsLargeFont] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fanhub_font_large');
      if (saved === 'true') {
        setIsLargeFont(true);
        document.documentElement.classList.add('font-accessible-large');
      }
    } catch {}
  }, []);

  const toggleFontSize = () => {
    const next = !isLargeFont;
    setIsLargeFont(next);
    try {
      localStorage.setItem('fanhub_font_large', String(next));
    } catch {}
    if (next) {
      document.documentElement.classList.add('font-accessible-large');
    } else {
      document.documentElement.classList.remove('font-accessible-large');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Form & Tab State for Auth Modal
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
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

  // Forgot password flow states
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotToken, setForgotToken] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [isResetTokenSent, setIsResetTokenSent] = useState(false);

  // Sub-header navigation dropdown (Exact matching user's image)
  const [isAllMdDropdownOpen, setIsAllMdDropdownOpen] = useState(false);
  const [isB2BModalOpen, setIsB2BModalOpen] = useState(false);
  const [isCustomZoneOpen, setIsCustomZoneOpen] = useState(false);
  const [b2bSubmitted, setB2bSubmitted] = useState(false);
  const [b2bOrg, setB2bOrg] = useState('');
  const [b2bContact, setB2bContact] = useState('');
  const [b2bQty, setB2bQty] = useState('50');
  const [b2bArtist, setB2bArtist] = useState('NewJeans');

  const scrollToSection = (id: string) => {
    setIsAllMdDropdownOpen(false);
    setIsMenuDrawerOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      if (id === 'tours') {
        window.location.href = '/event';
      } else {
        window.location.href = `/#${id}`;
      }
    }
  };

  const allMdItems = [
    { label: 'EVENT & TICKETS', icon: Ticket, action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/event'; } },
    { label: 'CD, DVD & VINYL', icon: Disc, action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/cd-dvd-book'; } },
    { label: 'OFFICIAL MD GOODS', icon: ShoppingBag, action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/md'; } },
    { label: "SEASON'S GREETINGS", icon: Gift, action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/cd-dvd-book'; } },
    { label: 'CUSTOM GOODS ZONE', icon: Palette, action: () => { setIsAllMdDropdownOpen(false); setIsCustomZoneOpen(true); } },
    { label: 'DUCKJIL FANDOM HUB', icon: Heart, action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/artist'; } },
    { label: 'ALLMD BEAUTY & CARE', icon: Sparkles, action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/md'; } },
    { label: 'B2B / BULK ORDER', icon: Building2, action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/b2b'; } },
    { label: 'MULTIMEDIA CENTER', icon: Tv, action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/multimedia'; } },
  ];

  return (
    <header 
      className={`sticky top-0 z-40 w-full header-root fandom-header-${fandomThemeKey} transition-all duration-300${isScrolled ? ' header-scrolled' : ''}`}
      data-fandom-theme={fandomThemeKey}
    >
      {/* Y2K System Status Ribbon */}
      <div className="w-full bg-black text-white px-4 sm:px-8 py-1 font-mono text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b border-black select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-white animate-pulse" />
            <span>PORTAL // READY</span>
          </span>
          <span className="hidden md:inline text-neutral-400">SYS.VER: 2026.1.0</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-neutral-400">HANTEO &amp; CIRCLE CERTIFIED</span>
          <span>TIME // 2026 UTC</span>
        </div>
      </div>

      {/* Main Bar - Responsive Header Bar */}
      <div className="header-inner max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-2.5 sm:py-3.5 flex items-center justify-between gap-4 md:gap-8 transition-colors duration-300">
        {/* LEFT: Menu button (Mobile only, hidden on PC) & Logo */}
        <div className="flex items-center gap-2.5 sm:gap-4 md:gap-5 shrink-0">
          <button
            onClick={() => setIsMenuDrawerOpen(true)}
            className="mobile-menu-btn header-action-btn px-3 py-1.5 bg-[#ff2e93] text-white items-center justify-center cursor-pointer hover:bg-[#ff007f] shrink-0 border-2 border-black font-mono text-xs font-black uppercase tracking-widest transition-transform active:scale-95 shadow-[2px_2px_0px_#000000]"
            style={{ borderRadius: '0px' }}
            title="Menu"
            type="button"
          >
            [MENU]
          </button>

          <Link href="/" className="flex items-center notranslate shrink-0">
            <img
              src="/logo-dark.png?v=2"
              alt="Fan Hub Plus"
              className="header-logo h-8 sm:h-9 md:h-11 w-auto object-contain block transition-all hover:scale-105"
            />
          </Link>
        </div>

        {/* CENTER: Wide Y2K Search Bar (Desktop) - Clean Flex Layout */}
        <div className="hidden md:flex flex-1 justify-center max-w-[560px] mx-4 lg:mx-8">
          <div
            className="header-search-bar"
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              border: '2px solid #000000',
              backgroundColor: '#ffffff',
              boxShadow: '3px 3px 0px #000000',
              padding: '6px 12px',
            }}
          >
            {/* Search prefix */}
            <span
              style={{
                fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                fontSize: '11px',
                fontWeight: 900,
                color: '#ff2e93',
                marginRight: '8px',
                userSelect: 'none',
              }}
            >
              [SEARCH//]
            </span>

            <input
              type="text"
              placeholder="ARTIST, ALBUM, ARCHIVE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const albumsEl = document.getElementById('albums');
                  if (albumsEl) albumsEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="header-search-input"
              style={{
                flex: 1,
                width: '100%',
                fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                color: '#000000',
                padding: '0px',
                textTransform: 'uppercase',
              }}
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="header-clear-btn hover:text-[#ff2e93] font-mono text-xs font-bold"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#000000',
                  padding: '2px 6px',
                }}
                title="Clear"
              >
                [×]
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Action Buttons (Vibrant Y2K Pop Neo-Brutalist Colors) */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 font-mono text-xs">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="mobile-search-btn header-action-btn px-2.5 py-1.5 items-center justify-center text-black border-2 border-black hover:bg-[#ffd60a] cursor-pointer bg-white transition-colors duration-100 font-bold shadow-[2px_2px_0px_#000000]"
            style={{ borderRadius: '0px' }}
            title="Search"
            type="button"
          >
            [?]
          </button>

          {/* User Profile Button (Lilac Purple) */}
          <button
            onClick={() => {
              if (isLoggedIn) {
                setIsDashboardOpen(true);
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            className="header-action-btn px-3 py-1.5 flex items-center justify-center text-black border-2 border-black bg-[#c084fc] hover:bg-[#d8b4fe] cursor-pointer font-black uppercase transition-all duration-100 h-8 sm:h-9 shadow-[2px_2px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px]"
            style={{ borderRadius: '0px' }}
            title={isLoggedIn ? `${user.name} - Dashboard` : 'Sign In'}
            type="button"
          >
            {isLoggedIn ? (
              <span className="truncate max-w-[80px]">{user.name.split(' ')[0]}</span>
            ) : (
              <span>[ID]</span>
            )}
          </button>

          {/* Shopping Cart Button (Lemon Yellow) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="header-action-btn px-3 py-1.5 flex items-center justify-center text-black border-2 border-black bg-[#ffd60a] hover:bg-[#fde047] cursor-pointer font-black uppercase transition-all duration-100 h-8 sm:h-9 shadow-[2px_2px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px]"
            style={{ borderRadius: '0px' }}
            title="Cart"
            type="button"
          >
            <span>BAG ({cartCount})</span>
          </button>

          {/* Wishlist Button (Cyber Cyan) */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="header-action-btn hidden sm:flex px-3 py-1.5 items-center justify-center text-black border-2 border-black bg-[#00f0ff] hover:bg-[#38bdf8] cursor-pointer font-black uppercase transition-all duration-100 h-8 sm:h-9 shadow-[2px_2px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px]"
            style={{ borderRadius: '0px' }}
            title="Wishlist"
            type="button"
          >
            <span>SAVED ({wishlistCount})</span>
          </button>

          {/* Language Switcher Button [ EN / VI ] */}
          <button
            onClick={toggleLanguage}
            title={language === 'en' ? 'Translate to Vietnamese' : 'Switch to English'}
            type="button"
            className="header-lang-btn hidden sm:flex notranslate hover:bg-neutral-100 items-center px-2.5 py-1 text-xs font-mono font-bold border-2 border-black bg-white text-black h-8 sm:h-9 cursor-pointer transition-colors duration-100 shadow-[2px_2px_0px_#000000]"
            style={{ borderRadius: '0px' }}
          >
            <span>[{language === 'en' ? 'EN' : 'VI'}]</span>
          </button>

          {/* Theme Mode Toggle Button */}
          <button
            onClick={toggleThemeMode}
            title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            type="button"
            className="header-action-btn hidden sm:flex notranslate hover:bg-neutral-100 px-2.5 py-1 items-center justify-center text-black border-2 border-black bg-white font-bold uppercase cursor-pointer transition-colors duration-100 h-8 sm:h-9 text-[11px] shadow-[2px_2px_0px_#000000]"
            style={{ borderRadius: '0px' }}
          >
            {themeMode === 'dark' ? '[LIGHT]' : '[DARK]'}
          </button>

          {/* Font Size Adjuster Button */}
          <button
            onClick={toggleFontSize}
            title={isLargeFont ? 'Standard Text Size' : 'Enlarge Text Size (+12.5%)'}
            type="button"
            className={`header-action-btn hidden sm:flex notranslate w-8 sm:w-9 h-8 sm:h-9 items-center justify-center border-2 border-black font-mono font-bold text-xs cursor-pointer transition-colors duration-100 shadow-[2px_2px_0px_#000000] ${
              isLargeFont 
                ? 'bg-[#ff2e93] text-white' 
                : 'hover:bg-neutral-100 text-black bg-white'
            }`}
            style={{ borderRadius: '0px' }}
          >
            <span>{isLargeFont ? 'A+' : 'A'}</span>
          </button>

          {/* Admin shortcut if admin */}
          {user.role === 'admin' && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-black bg-[#ff2e93] text-white border-2 border-black hover:bg-[#ff007f] transition-colors duration-100 cursor-pointer h-8 sm:h-9 text-decoration-none shadow-[2px_2px_0px_#000000]"
              style={{ borderRadius: '0px' }}
              title="Admin Portal"
            >
              <ShieldCheck style={{ width: '13px', height: '13px', strokeWidth: 2 }} />
              <span className="hidden md:inline">ADMIN</span>
            </Link>
          )}
        </div>
      </div>

      {/* SECONDARY CATEGORY NAVIGATION BAR (Desktop Only) */}
      <div className="desktop-subnav header-subnav w-full border-t border-black border-b-4 border-black relative z-30 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between h-11 sm:h-[50px] relative gap-4">
          {/* [ ≡ ALL MD ] Hot Pink Pop Button with Exact Dropdown */}
          <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', zIndex: 60 }}>
            <button
              onClick={() => setIsAllMdDropdownOpen(!isAllMdDropdownOpen)}
              type="button"
              className="header-allmd-btn hover:bg-[#ff007f] transition-all duration-100"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 18px',
                height: '36px',
                backgroundColor: '#ff2e93',
                color: '#ffffff',
                fontFamily: "var(--font-mono), monospace",
                fontSize: '11px',
                fontWeight: 900,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: '2px solid #000000',
                borderRadius: '0px',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '3px 3px 0px #000000',
              }}
            >
              <Menu style={{ width: '15px', height: '15px', flexShrink: 0, strokeWidth: 2.5 }} />
              <span style={{ whiteSpace: 'nowrap' }}>★ ALL MD</span>
            </button>

            {/* Dropdown Menu under [ ≡ ALL MD ] (Strictly 0px, pure monochrome, no shadow) */}
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
                    marginTop: '2px',
                    width: '340px',
                    maxWidth: '92vw',
                    backgroundColor: '#ffffff',
                    border: '2px solid #000000',
                    borderRadius: '0px',
                    padding: '14px',
                    boxShadow: 'none',
                    zIndex: 9999,
                    display: 'block',
                  }}
                  className="animate-in fade-in-0 duration-100"
                >
                  {/* Header Title */}
                  <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div
                        style={{ borderRadius: '0px' }}
                        className="w-5 h-5 bg-black text-white flex items-center justify-center"
                      >
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-black">
                        CATEGORIES &amp; FUNCTIONS
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAllMdDropdownOpen(false)}
                      style={{ borderRadius: '0px' }}
                      className="w-6 h-6 border border-black hover:bg-black hover:text-white text-black flex items-center justify-center bg-white cursor-pointer transition-colors duration-100"
                      title="Close"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Category Items with Library Icons */}
                  <div className="flex flex-col gap-1">
                    {allMdItems.map((item, idx) => {
                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setIsAllMdDropdownOpen(false);
                            item.action();
                          }}
                          style={{ borderRadius: '0px' }}
                          className="group w-full flex items-center justify-between px-3 py-2 border border-transparent hover:border-black hover:bg-black hover:text-white text-left bg-transparent cursor-pointer transition-colors duration-100"
                          type="button"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              style={{ borderRadius: '0px' }}
                              className="w-6 h-6 border border-black bg-white text-black group-hover:bg-white group-hover:text-black flex items-center justify-center shrink-0"
                            >
                              <ItemIcon className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-mono text-[12px] font-medium tracking-tight">
                              {item.label}
                            </span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white shrink-0" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Sections shortcut */}
                  <div className="pt-3 mt-3 border-t border-black">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500 block mb-2 px-1">
                      QUICK SHORTCUTS
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAllMdDropdownOpen(false);
                          scrollToSection('albums');
                        }}
                        style={{ borderRadius: '0px' }}
                        className="group flex items-center gap-2 p-2 bg-white hover:bg-black hover:text-white border border-black text-xs font-mono font-medium cursor-pointer transition-colors duration-100"
                      >
                        <div
                          style={{ borderRadius: '0px' }}
                          className="w-5 h-5 border border-black bg-black text-white flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors"
                        >
                          <Disc className="w-3 h-3" />
                        </div>
                        <span className="truncate">Album Drops</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsAllMdDropdownOpen(false);
                          scrollToSection('artists');
                        }}
                        style={{ borderRadius: '0px' }}
                        className="group flex items-center gap-2 p-2 bg-white hover:bg-black hover:text-white border border-black text-xs font-mono font-medium cursor-pointer transition-colors duration-100"
                      >
                        <div
                          style={{ borderRadius: '0px' }}
                          className="w-5 h-5 border border-black bg-black text-white flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors"
                        >
                          <Users className="w-3 h-3" />
                        </div>
                        <span className="truncate">Idol Profiles</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsAllMdDropdownOpen(false);
                          scrollToSection('tours');
                        }}
                        style={{ borderRadius: '0px' }}
                        className="group flex items-center gap-2 p-2 bg-white hover:bg-black hover:text-white border border-black text-xs font-mono font-medium cursor-pointer transition-colors duration-100"
                      >
                        <div
                          style={{ borderRadius: '0px' }}
                          className="w-5 h-5 border border-black bg-black text-white flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors"
                        >
                          <Calendar className="w-3 h-3" />
                        </div>
                        <span className="truncate">World Tour</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsAllMdDropdownOpen(false);
                          scrollToSection('community');
                        }}
                        style={{ borderRadius: '0px' }}
                        className="group flex items-center gap-2 p-2 bg-white hover:bg-black hover:text-white border border-black text-xs font-mono font-medium cursor-pointer transition-colors duration-100"
                      >
                        <div
                          style={{ borderRadius: '0px' }}
                          className="w-5 h-5 border border-black bg-black text-white flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors"
                        >
                          <MessageSquare className="w-3 h-3" />
                        </div>
                        <span className="truncate">Fandom Feed</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Horizontal Links with Clean Minimalist Monochrome Editorial Typography */}
          <nav className="flex items-center gap-6 sm:gap-8 lg:gap-10 xl:gap-12 flex-nowrap h-full shrink-0 overflow-x-auto scrollbar-none">
            <Link
              href="/artist"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: '12px',
                fontWeight: pathname?.startsWith('/artist') ? 700 : 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '12px 4px',
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                color: '#000000',
                transition: 'all 0.1s ease',
                borderBottom: pathname?.startsWith('/artist') ? '3px solid #000000' : '3px solid transparent',
                textDecoration: 'none',
              }}
              className="hover:opacity-60"
            >
              ARTIST
            </Link>
            <Link
              href="/event"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: '12px',
                fontWeight: pathname?.startsWith('/event') ? 700 : 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '12px 4px',
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                color: '#000000',
                transition: 'all 0.1s ease',
                borderBottom: pathname?.startsWith('/event') ? '3px solid #000000' : '3px solid transparent',
                textDecoration: 'none',
              }}
              className="hover:opacity-60"
            >
              EVENT
            </Link>
            <Link
              href="/multimedia"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: '12px',
                fontWeight: pathname?.startsWith('/multimedia') ? 700 : 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '12px 4px',
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                color: '#000000',
                transition: 'all 0.1s ease',
                borderBottom: pathname?.startsWith('/multimedia') ? '3px solid #000000' : '3px solid transparent',
                textDecoration: 'none',
              }}
              className="hover:opacity-60"
            >
              MULTIMEDIA
            </Link>
            <Link
              href="/cd-dvd-book"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: '12px',
                fontWeight: pathname === '/cd-dvd-book' ? 700 : 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '12px 4px',
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                color: '#000000',
                transition: 'all 0.1s ease',
                borderBottom: pathname === '/cd-dvd-book' ? '3px solid #000000' : '3px solid transparent',
                textDecoration: 'none',
              }}
              className="hover:opacity-60"
            >
              CD/DVD/BOOK
            </Link>
            <Link
              href="/md"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: '12px',
                fontWeight: pathname === '/md' ? 700 : 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '12px 4px',
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                color: '#000000',
                transition: 'all 0.1s ease',
                borderBottom: pathname === '/md' ? '3px solid #000000' : '3px solid transparent',
                textDecoration: 'none',
              }}
              className="hover:opacity-60"
            >
              MD
            </Link>
            <Link
              href="/b2b"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: '12px',
                fontWeight: pathname?.startsWith('/b2b') ? 700 : 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '12px 4px',
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                color: '#000000',
                transition: 'all 0.1s ease',
                borderBottom: pathname?.startsWith('/b2b') ? '3px solid #000000' : '3px solid transparent',
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
              borderRadius: '0px',
              maxWidth: '440px',
              width: '100%',
              padding: '24px',
              boxShadow: 'none',
              border: '2px solid #000000',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setIsCustomZoneOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                color: '#000000',
                cursor: 'pointer'
              }}
              type="button"
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Palette style={{ width: '22px', height: '22px', color: '#000000' }} />
              <h3 className="text-base font-bold text-black uppercase font-mono tracking-wide">
                CUSTOM ZONE - Fan DIY Studio
              </h3>
            </div>
            <p className="text-xs text-neutral-600 mb-4">
              Personalize your bias lightstick, holographic toploader binders, and custom photocard sleeves.
            </p>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 bg-white border border-black flex items-center justify-between">
                <div>
                  <div className="font-bold text-black">Holographic Toploader Deco Kit</div>
                  <div className="text-[11px] text-neutral-500">Stickers, charms, and protective UV sleeves</div>
                </div>
                <span className="font-bold text-black">$12.00</span>
              </div>

              <div className="p-3 bg-white border border-black flex items-center justify-between">
                <div>
                  <div className="font-bold text-black">Lightstick Custom Dome Decals</div>
                  <div className="text-[11px] text-neutral-500">NewJeans, BLACKPINK, BTS strap & decal sets</div>
                </div>
                <span className="font-bold text-black">$9.50</span>
              </div>

              <div className="p-3 bg-white border border-black flex items-center justify-between">
                <div>
                  <div className="font-bold text-black">Custom Bias NFC Keychain Card</div>
                  <div className="text-[11px] text-neutral-500">Taps on smartphone to play idol voice note</div>
                </div>
                <span className="font-bold text-black">$15.00</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCustomZoneOpen(false);
                scrollToSection('albums');
              }}
              className="mt-5 w-full py-3 text-white text-xs font-mono font-bold uppercase tracking-widest cursor-pointer bg-black border-2 border-black hover:bg-white hover:text-black transition-colors duration-100"
              style={{ borderRadius: '0px' }}
              type="button"
            >
              Explore Official Custom Kits
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
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0px',
              maxWidth: '460px',
              width: '100%',
              padding: '24px',
              boxShadow: 'none',
              border: '2px solid #000000',
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
                color: '#000000',
                cursor: 'pointer'
              }}
              type="button"
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>

            {b2bSubmitted ? (
              <div className="text-center py-6 space-y-3 font-mono">
                <div
                  className="bg-black text-white flex items-center justify-center mx-auto"
                  style={{ width: '48px', height: '48px', borderRadius: '0px' }}
                >
                  <CheckCircle2 style={{ width: '28px', height: '28px' }} />
                </div>
                <h3 className="text-base font-bold text-black uppercase tracking-wider">
                  B2B Group Order Request Received!
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed max-w-sm mx-auto">
                  Thank you! Our Global Wholesale & Group Order department will send tier-discount quotations to your contact within 2 hours.
                </p>
                <div
                  className="p-3 border border-black text-xs text-black"
                  style={{ backgroundColor: '#ffffff', borderRadius: '0px' }}
                >
                  📦 Inquiries reflect 100% on official Hanteo & Circle Charts.
                </div>
                <button
                  onClick={() => {
                    setIsB2BModalOpen(false);
                    setB2bSubmitted(false);
                  }}
                  className="mt-4 px-6 py-2.5 text-white text-xs font-mono font-bold uppercase tracking-widest cursor-pointer bg-black border-2 border-black hover:bg-white hover:text-black transition-colors duration-100"
                  style={{ borderRadius: '0px' }}
                  type="button"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 style={{ width: '20px', height: '20px', color: '#000000' }} />
                  <h3 className="text-base font-bold text-black uppercase font-mono tracking-wider">
                    B2B & Fandom Group Orders (GO)
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 mb-4">
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
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-black block mb-1">
                      Fanbase / Business Organization
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bunnies Global Fandom, Seoul K-Store"
                      value={b2bOrg}
                      onChange={(e) => setB2bOrg(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border-2 border-black focus:outline-none font-mono"
                      style={{ borderRadius: '0px' }}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-black block mb-1">
                      Email / WhatsApp Contact
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. fandom_order@gmail.com / +84 912 345 678"
                      value={b2bContact}
                      onChange={(e) => setB2bContact(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border-2 border-black focus:outline-none font-mono"
                      style={{ borderRadius: '0px' }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-black block mb-1">
                        Target Artist
                      </label>
                      <select
                        value={b2bArtist}
                        onChange={(e) => setB2bArtist(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border-2 border-black focus:outline-none font-mono"
                        style={{ borderRadius: '0px' }}
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
                      <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-black block mb-1">
                        Quantity (Copies)
                      </label>
                      <input
                        type="number"
                        min="20"
                        step="10"
                        required
                        value={b2bQty}
                        onChange={(e) => setB2bQty(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border-2 border-black focus:outline-none font-mono"
                        style={{ borderRadius: '0px' }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-black text-[11px] text-black font-mono space-y-1">
                    <p className="font-bold">Perks for Group Order Managers:</p>
                    <p>✓ Custom photocard sorting service</p>
                    <p>✓ Direct EMS / DHL Express shipping from Seoul</p>
                    <p>✓ Official Hanteo Chart authentication barcode</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white text-xs py-3 font-mono font-bold uppercase tracking-widest cursor-pointer bg-black border-2 border-black hover:bg-white hover:text-black transition-colors duration-100 mt-2"
                    style={{ borderRadius: '0px' }}
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
              backgroundColor: '#ffffff',
              borderRadius: '0px',
              maxWidth: '430px',
              width: '100%',
              padding: '28px 24px',
              boxShadow: 'none',
              position: 'relative',
              border: '2px solid #000000'
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
                color: '#000000',
                backgroundColor: '#ffffff',
                borderRadius: '0px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '1px solid #000000',
                transition: 'all 0.1s ease'
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
                    <span style={{ color: 'var(--text-muted)' }}>Role:</span>
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

                {/* Dashboard Button */}
                <button
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    setIsDashboardOpen(true);
                  }}
                  style={{
                    width: '100%',
                    padding: '11px',
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 800,
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
                  <Sparkles style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
                  Open Personal Dashboard (Activity & Fandom)
                </button>

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
                    Open Admin Dashboard
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
                  Sign Out
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

                          setAuthNotification(data.message || 'Login successful!');
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
                          setAuthError(extractApiError(data, `Error ${response.status}: Login failed.`));
                        }
                      } catch (err: any) {
                        setAuthError(err.message || 'Unable to connect to authentication server');
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

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot');
                          setAuthError(null);
                          setAuthNotification(null);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '12px',
                          color: '#2563eb',
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        Forgot password? (Reset via Token/Email)
                      </button>
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

                          setAuthNotification(data.message || 'Account created successfully!');
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
                          placeholder="e.g. Alex Morgan"
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

                {/* FORGOT PASSWORD FORM */}
                {authMode === 'forgot' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setAuthError(null);
                      setAuthNotification(null);

                      if (!isResetTokenSent) {
                        if (!forgotEmail.trim()) {
                          setAuthError('Please enter your email address.');
                          return;
                        }
                        const res = requestPasswordReset(forgotEmail);
                        setIsResetTokenSent(true);
                        setForgotToken(res.token);
                        setAuthNotification(res.message);
                      } else {
                        if (!forgotToken.trim() || !forgotNewPassword.trim()) {
                          setAuthError('Please enter both the token and your new password.');
                          return;
                        }
                        const res = resetPasswordWithToken(forgotEmail, forgotToken, forgotNewPassword);
                        if (res.success) {
                          setAuthNotification(res.message);
                          setTimeout(() => {
                            setAuthMode('signin');
                            setIsResetTokenSent(false);
                            setLoginEmail(forgotEmail);
                            setForgotToken('');
                            setForgotNewPassword('');
                          }, 1800);
                        } else {
                          setAuthError(res.message);
                        }
                      }
                    }}
                  >
                    {!isResetTokenSent ? (
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                          Registered Account Email
                        </label>
                        <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                          <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                          <input
                            type="email"
                            required
                            placeholder="fan@example.com"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
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
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                          We will send a 6-character verification token to securely reset your password.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                            Verification Token (Sent via email)
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Enter 6-digit token"
                            value={forgotToken}
                            onChange={(e) => setForgotToken(e.target.value.toUpperCase())}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              fontSize: '14px',
                              fontFamily: 'monospace',
                              fontWeight: 800,
                              letterSpacing: '0.15em',
                              textAlign: 'center',
                              backgroundColor: '#fef3c7',
                              border: '1.5px solid #f59e0b',
                              borderRadius: 'var(--radius)',
                              outline: 'none',
                              color: '#92400e'
                            }}
                          />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                            New Password
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="Minimum 6 characters"
                            value={forgotNewPassword}
                            onChange={(e) => setForgotNewPassword(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              fontSize: '13px',
                              backgroundColor: 'var(--bg-body)',
                              border: '1px solid var(--border-color)',
                              borderRadius: 'var(--radius)',
                              outline: 'none',
                              color: 'var(--text-primary)'
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '11px',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 700,
                        borderRadius: 'var(--radius)',
                        border: '1px solid #000000',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <span>{isResetTokenSent ? 'Confirm Password Reset' : 'Send Verification Token via Email'}</span>
                      <ArrowRight style={{ width: '16px', height: '16px' }} />
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
                  ) : authMode === 'signup' ? (
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
                  ) : (
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                      Remember your password?{' '}
                      <button
                        type="button"
                        onClick={() => { setAuthMode('signin'); setAuthNotification(null); setIsResetTokenSent(false); }}
                        style={{ fontWeight: 800, color: '#000000', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        className="dark:text-white hover:underline"
                      >
                        Back to Sign In
                      </button>
                    </p>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* PERSONAL USER DASHBOARD MODAL */}
      <PersonalDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
      />

      {/* ========================================================================= */}
      {/* MOBILE SIDEBAR DRAWER */}
      {/* ========================================================================= */}
      {isMenuDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
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
                title="Close"
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
                <span>Search albums, artists, OSTs...</span>
              </button>
            </div>

            {/* Scrollable Nav Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
              {/* 1. Main Navigation Links */}
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 px-1">
                  Main Navigation
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
                    href="/multimedia"
                    onClick={() => setIsMenuDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Tv className="w-4 h-4 text-black" />
                      MULTIMEDIA
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
                  <span className="bg-black text-white text-[9px] px-1.5 py-0.5 rounded font-bold">9 ITEMS</span>
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
                <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-2 px-1">
                  Quick Sections
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection('albums')}
                    style={{ borderRadius: '0px' }}
                    className="p-2.5 text-left bg-white border border-black hover:bg-black hover:text-white text-xs font-mono font-medium text-black cursor-pointer flex items-center gap-2 transition-colors duration-100"
                  >
                    <Disc className="w-3.5 h-3.5 shrink-0" />
                    <span>Album Drops</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('artists')}
                    style={{ borderRadius: '0px' }}
                    className="p-2.5 text-left bg-white border border-black hover:bg-black hover:text-white text-xs font-mono font-medium text-black cursor-pointer flex items-center gap-2 transition-colors duration-100"
                  >
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    <span>Idol Profiles</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('tours')}
                    style={{ borderRadius: '0px' }}
                    className="p-2.5 text-left bg-white border border-black hover:bg-black hover:text-white text-xs font-mono font-medium text-black cursor-pointer flex items-center gap-2 transition-colors duration-100"
                  >
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>World Tour</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('community')}
                    style={{ borderRadius: '0px' }}
                    className="p-2.5 text-left bg-white border border-black hover:bg-black hover:text-white text-xs font-mono font-medium text-black cursor-pointer flex items-center gap-2 transition-colors duration-100"
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span>Fandom Feed</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Footer Actions inside Drawer */}
            <div className="p-3.5 border-t border-black bg-white space-y-2">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  style={{ borderRadius: '0px' }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 bg-white border border-black text-xs font-mono font-bold text-black hover:bg-black hover:text-white cursor-pointer transition-colors duration-100"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'EN' : 'VI'}</span>
                </button>
                <button
                  type="button"
                  onClick={toggleThemeMode}
                  style={{ borderRadius: '0px' }}
                  className="w-10 h-9 flex items-center justify-center bg-white border border-black text-black hover:bg-black hover:text-white cursor-pointer transition-colors duration-100"
                  title="Theme toggle"
                >
                  {themeMode === 'dark' ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={toggleFontSize}
                  style={{ borderRadius: '0px' }}
                  className={`w-10 h-9 flex items-center justify-center border border-black text-xs font-mono font-bold cursor-pointer transition-colors duration-100 ${
                    isLargeFont
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-black hover:text-white'
                  }`}
                  title={isLargeFont ? 'Reduce font size' : 'Increase font size'}
                >
                  <span>{isLargeFont ? 'A+' : 'A'}</span>
                </button>
              </div>

              {isLoggedIn ? (
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs font-mono">
                    <span className="font-bold text-black block truncate max-w-[170px]">{user.name}</span>
                    <span className="text-[10px] text-neutral-500 block truncate max-w-[170px]">{user.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsMenuDrawerOpen(false);
                    }}
                    className="text-xs font-mono font-bold text-black underline hover:opacity-60 bg-transparent border-0 cursor-pointer p-1"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuDrawerOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  style={{ borderRadius: '0px' }}
                  className="w-full py-2.5 bg-black text-white text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer hover:bg-white hover:text-black border-2 border-black transition-colors duration-100"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In / Account</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DEDICATED SEARCH MODAL (Minimalist Monochrome - 0px sharp, pure black & white) */}
      {/* ========================================================================= */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-start items-center p-0 sm:p-6">
          {/* Smooth backdrop */}
          <div
            className="fixed inset-0 bg-black/60 transition-opacity duration-100"
            onClick={() => setIsSearchModalOpen(false)}
          />

          {/* Modal Card - 0px sharp, 2px solid black border, zero shadows */}
          <div
            style={{ borderRadius: '0px' }}
            className="relative w-full max-w-[680px] bg-white rounded-none shadow-none z-10 overflow-hidden border-2 border-black mt-8"
          >
            {/* Top Bar with Brand / Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b-2 border-black bg-white">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-black" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-black">
                  SEARCH &amp; EXPLORE
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 border border-black px-2 py-0.5 ml-2">
                  FANDOM ARCHIVE
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(false)}
                style={{ borderRadius: '0px' }}
                className="w-8 h-8 bg-white hover:bg-black hover:text-white border border-black flex items-center justify-center text-black cursor-pointer transition-colors duration-100"
                title="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Form Area */}
            <div className="p-6">
              {/* Sharp Monochrome Search Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSearchModalOpen(false);
                  const albumsEl = document.getElementById('albums');
                  if (albumsEl) albumsEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full mb-6"
              >
                <div
                  style={{
                    borderRadius: '0px',
                    backgroundColor: '#ffffff',
                    border: '2px solid #000000',
                  }}
                  className="w-full flex items-center pl-4 pr-1.5 py-1.5"
                >
                  <Search className="w-5 h-5 text-black shrink-0" />

                  <input
                    type="text"
                    autoFocus
                    placeholder="Search artist, album drops, tours (Playfair, BTS, NewJeans...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      backgroundColor: 'transparent',
                      color: '#000000',
                      fontFamily: 'var(--font-source-serif), serif',
                    }}
                    className="flex-1 min-w-0 px-3 py-2 text-base font-normal placeholder:text-neutral-400 placeholder:italic"
                  />

                  {/* Clear Button */}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{ borderRadius: '0px' }}
                      className="w-7 h-7 bg-white hover:bg-black hover:text-white border border-black text-black flex items-center justify-center cursor-pointer shrink-0 mr-2 transition-colors duration-100"
                      title="Clear text"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Submit Action Sharp Button */}
                  <button
                    type="submit"
                    style={{
                      borderRadius: '0px',
                      backgroundColor: '#000000',
                      color: '#ffffff',
                    }}
                    className="hover:bg-white hover:text-black border-2 border-black text-xs font-mono font-bold uppercase tracking-widest px-5 py-2.5 flex items-center gap-2 cursor-pointer shrink-0 transition-colors duration-100"
                  >
                    <span>SEARCH</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Real-time search status indicator if user is typing */}
              {searchQuery.trim() ? (
                <div
                  style={{ borderRadius: '0px' }}
                  className="flex items-center justify-between px-4 py-2.5 mb-6 bg-neutral-100 border border-black text-xs font-mono text-black"
                >
                  <span>
                    FILTER: <strong>"{searchQuery}"</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchModalOpen(false);
                      const albumsEl = document.getElementById('albums');
                      if (albumsEl) albumsEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="underline text-black font-bold uppercase cursor-pointer bg-transparent border-0"
                  >
                    VIEW RESULTS →
                  </button>
                </div>
              ) : null}

              {/* Trending Keywords / Top Searches */}
              <div className="mb-6">
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-3 px-1">
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>TRENDING KEYWORDS &amp; POPULAR SEARCHES</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'BTS', hot: true },
                    { label: 'NewJeans', hot: true },
                    { label: 'BLACKPINK', hot: true },
                    { label: 'Stray Kids', hot: false },
                    { label: 'Demon Slayer', hot: false },
                    { label: 'Limited Kit', hot: false },
                    { label: 'Vinyl LP', hot: false },
                    { label: 'OST Anime', hot: false },
                  ].map((item, idx) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setSearchQuery(item.label);
                        setIsSearchModalOpen(false);
                        const albumsEl = document.getElementById('albums');
                        if (albumsEl) albumsEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                      style={{
                        borderRadius: '0px',
                      }}
                      className="group flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-black text-black hover:text-white border border-black text-xs font-mono font-medium cursor-pointer transition-colors duration-100"
                    >
                      <span className="font-mono text-[10px] font-bold">
                        0{idx + 1}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Categories Navigation */}
              <div className="pt-4 border-t border-black">
                <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-3 px-1">
                  FEATURED CATEGORIES
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('Full Album');
                      setIsSearchModalOpen(false);
                      const albumsEl = document.getElementById('albums');
                      if (albumsEl) albumsEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{ borderRadius: '0px' }}
                    className="p-3 text-left bg-white hover:bg-black hover:text-white text-xs font-mono font-bold text-black border border-black cursor-pointer transition-colors duration-100 flex items-center gap-2 group"
                  >
                    <Disc className="w-3.5 h-3.5 shrink-0" />
                    <span>CD &amp; LP</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('Limited Kit');
                      setIsSearchModalOpen(false);
                      const albumsEl = document.getElementById('albums');
                      if (albumsEl) albumsEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{ borderRadius: '0px' }}
                    className="p-3 text-left bg-white hover:bg-black hover:text-white text-xs font-mono font-bold text-black border border-black cursor-pointer transition-colors duration-100 flex items-center gap-2 group"
                  >
                    <Gift className="w-3.5 h-3.5 shrink-0" />
                    <span>Limited</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchModalOpen(false);
                      const artistsEl = document.getElementById('artists');
                      if (artistsEl) artistsEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{ borderRadius: '0px' }}
                    className="p-3 text-left bg-white hover:bg-black hover:text-white text-xs font-mono font-bold text-black border border-black cursor-pointer transition-colors duration-100 flex items-center gap-2 group"
                  >
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    <span>Artists</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchModalOpen(false);
                      const toursEl = document.getElementById('tours');
                      if (toursEl) toursEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{ borderRadius: '0px' }}
                    className="p-3 text-left bg-white hover:bg-black hover:text-white text-xs font-mono font-bold text-black border border-black cursor-pointer transition-colors duration-100 flex items-center gap-2 group"
                  >
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>Tour</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
