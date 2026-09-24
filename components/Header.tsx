'use client';

import React, { useState } from 'react';
import { useGoogleLanguage } from './GoogleTranslate';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  Search,
  User,
  ShoppingBag,
  FileText,
  Globe,
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

export const Header: React.FC<HeaderProps> = ({
  onOpenAdmin,
  onOpenFeedback,
  searchQuery,
  setSearchQuery,
}) => {
  const { language, toggleLanguage } = useGoogleLanguage();
  const { cartCount, wishlistCount, setIsCartOpen, setIsWishlistOpen, currency, toggleCurrency } = useCartWishlist();
  const { user, isLoggedIn, loginAs, logout } = useAuth();

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
    { label: 'EVENT', action: () => scrollToSection('tours') },
    { label: 'CD&DVD', action: () => scrollToSection('albums') },
    { label: 'MD', action: () => scrollToSection('albums') },
    { label: "ALL MD SEASON'S GREETINGS", action: () => scrollToSection('albums') },
    { label: 'CUSTOM ZONE', action: () => { setIsAllMdDropdownOpen(false); setIsCustomZoneOpen(true); } },
    { label: 'DUCKJIL ZONE', action: () => scrollToSection('artists') },
    { label: 'ALLMD BEAUTY', action: () => scrollToSection('albums') },
    { label: 'CONTACT FOR BULK ORDER', action: () => { setIsAllMdDropdownOpen(false); setIsB2BModalOpen(true); } },
    { label: 'ALLMD TV', action: () => { setIsAllMdDropdownOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200">

      {/* Top slim announcement bar */}
      <div
        className="text-white text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2"
        style={{ backgroundColor: '#0284c7' }}
      >
        <span style={{ fontSize: '14px', padding: "4px" }}>Worldwide Shipping Available! Pre-Order Official K-Pop Albums & Win Exclusive Fansign Slots!</span>
      </div>

      {/* Main Bar exactly matching user design */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between gap-4">

        {/* LEFT: Menu Button + Horizontal Logo */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Circular Hamburger Menu Button - Also toggles the exact category dropdown */}
          <button
            onClick={() => setIsAllMdDropdownOpen(!isAllMdDropdownOpen)}
            className="rounded-full flex items-center justify-center transition-colors cursor-pointer text-white"
            style={{
              backgroundColor: '#1e293b',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              flexShrink: 0
            }}
            title="Menu Categories"
            type="button"
          >
            <Menu style={{ width: '18px', height: '18px' }} />
          </button>

          {/* Horizontal Logo */}
          <a href="#" className="flex items-center notranslate">
            <img
              src="/logo.png"
              alt="Fan Hub Plus"
              style={{ height: '34px', width: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </a>
        </div>

        {/* CENTER: Minimalist Underline Search Bar - ONLY ONE SINGLE SEARCH BAR */}
        <div
          className="flex-1 mx-4"
          style={{ maxWidth: '460px', minWidth: '180px' }}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input
              type="text"
              placeholder="Search album, OST, anime, game (e.g. Demon Slayer, Genshin, NewJeans, Dune)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 36px 6px 4px',
                fontSize: '13px',
                border: 'none',
                borderBottom: '1.5px solid #0f172a',
                borderRadius: '0',
                outline: 'none',
                backgroundColor: 'transparent',
                color: '#0f172a'
              }}
            />
            <button
              type="button"
              style={{
                position: 'absolute',
                right: '2px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}
              title="Search"
            >
              <Search style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>

        {/* RIGHT: User Profile, Cart, Wishlist Doc, Language Pill */}
        <div className="flex items-center gap-3 shrink-0">

          {/* User Profile Icon */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="p-1.5 text-slate-700 hover:text-sky-600 transition-colors cursor-pointer"
            title={isLoggedIn ? user.name : 'Sign In'}
            type="button"
          >
            <User style={{ width: '20px', height: '20px', strokeWidth: 1.8 }} />
          </button>

          {/* Shopping Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-1.5 text-slate-700 hover:text-sky-600 transition-colors cursor-pointer"
            title="Cart"
            type="button"
            style={{ position: 'relative' }}
          >
            <ShoppingBag style={{ width: '20px', height: '20px', strokeWidth: 1.8 }} />
            {cartCount > 0 && (
              <span
                className="absolute text-white font-bold rounded-full flex items-center justify-center notranslate"
                style={{
                  backgroundColor: '#0284c7',
                  width: '16px',
                  height: '16px',
                  fontSize: '10px',
                  top: '-2px',
                  right: '-2px'
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Wishlist / Document Icon */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-1.5 text-slate-700 hover:text-sky-600 transition-colors cursor-pointer"
            title="Wishlist"
            type="button"
            style={{ position: 'relative' }}
          >
            <FileText style={{ width: '20px', height: '20px', strokeWidth: 1.8 }} />
            {wishlistCount > 0 && (
              <span
                className="absolute text-white font-bold rounded-full flex items-center justify-center notranslate"
                style={{
                  backgroundColor: '#0284c7',
                  width: '16px',
                  height: '16px',
                  fontSize: '10px',
                  top: '-2px',
                  right: '-2px'
                }}
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
            className="notranslate"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 800,
              border: '1.5px solid #0f172a',
              borderRadius: '9999px',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              cursor: 'pointer',
              height: '32px'
            }}
          >
            <Globe style={{ width: '15px', height: '15px', color: '#0f172a' }} />
            <span>{language === 'en' ? 'EN' : 'VI'}</span>
          </button>

          {/* Admin shortcut if admin */}
          {user.role === 'admin' && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 rounded"
              title="Admin Portal"
              type="button"
            >
              <ShieldCheck style={{ width: '14px', height: '14px', color: '#d97706' }} />
              <span>Admin</span>
            </button>
          )}

        </div>

      </div>

      {/* SECONDARY CATEGORY NAVIGATION BAR (EXACTLY MATCHING USER'S SCREENSHOT) */}
      <div
        className="w-full bg-white border-t border-slate-200"
        style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', overflow: 'visible', position: 'relative' }}
      >
        <div
          className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between"
          style={{ overflow: 'visible', position: 'relative' }}
        >

          {/* [ ≡ ALL MD ] Black Button with Exact Dropdown */}
          <div className="relative shrink-0 py-1.5" style={{ overflow: 'visible', zIndex: 60 }}>
            <button
              onClick={() => setIsAllMdDropdownOpen(!isAllMdDropdownOpen)}
              type="button"
              className="flex items-center gap-2.5 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-opacity cursor-pointer hover:opacity-90"
              style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                height: '40px',
                borderRadius: '0px',
                letterSpacing: '0.05em'
              }}
            >
              <Menu style={{ width: '15px', height: '15px' }} />
              <span>ALL MD</span>
            </button>

            {/* Dropdown Menu matching User's Image Exactly */}
            {isAllMdDropdownOpen && (
              <>
                {/* Backdrop to close on click outside */}
                <div
                  className="fixed inset-0 bg-transparent"
                  style={{ zIndex: 9990 }}
                  onClick={() => setIsAllMdDropdownOpen(false)}
                />

                <div
                  className="absolute left-0 top-full mt-2.5 bg-white animate-in fade-in zoom-in-95 duration-100"
                  style={{
                    width: '260px',
                    maxWidth: '90vw',
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #71717a',
                    borderRadius: '0px',
                    padding: '24px 22px',
                    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.2)',
                    zIndex: 9999,
                    display: 'block',
                    visibility: 'visible',
                    opacity: 1
                  }}
                >
                  {/* Top pointer caret triangle pointing UP matching user screenshot */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '52px',
                      width: 0,
                      height: 0,
                      borderLeft: '9px solid transparent',
                      borderRight: '9px solid transparent',
                      borderBottom: '10px solid #71717a',
                      zIndex: 10000
                    }}
                  />

                  {/* Exact 9 Menu Items from User Screenshot */}
                  <div className="flex flex-col space-y-3.5">
                    {allMdItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={item.action}
                        className="text-left font-black text-[13px] text-black hover:text-sky-600 transition-colors uppercase cursor-pointer"
                        style={{
                          letterSpacing: '0.03em',
                          background: 'none',
                          border: 'none',
                          padding: '3px 0',
                          lineHeight: '1.25',
                          display: 'block',
                          width: '100%',
                        }}
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

          {/* Horizontal Links: ARTIST, EVENT, CD/DVD/BOOK, MD, B2B/BULK */}
          <div className="flex items-center gap-8 sm:gap-12 lg:gap-16 ml-6 sm:ml-12 overflow-x-auto whitespace-nowrap">
            <a
              href="#artists"
              className="text-xs sm:text-[13px] font-extrabold tracking-wide text-slate-900 hover:text-sky-600 transition-colors uppercase py-2.5"
            >
              ARTIST
            </a>
            <a
              href="#tours"
              className="text-xs sm:text-[13px] font-extrabold tracking-wide text-slate-900 hover:text-sky-600 transition-colors uppercase py-2.5"
            >
              EVENT
            </a>
            <a
              href="#albums"
              className="text-xs sm:text-[13px] font-extrabold tracking-wide text-slate-900 hover:text-sky-600 transition-colors uppercase py-2.5"
            >
              CD/DVD/BOOK
            </a>
            <a
              href="#albums"
              className="text-xs sm:text-[13px] font-extrabold tracking-wide text-slate-900 hover:text-sky-600 transition-colors uppercase py-2.5"
            >
              MD
            </a>
            <button
              onClick={() => setIsB2BModalOpen(true)}
              className="text-xs sm:text-[13px] font-extrabold tracking-wide text-slate-900 hover:text-sky-600 transition-colors uppercase py-2.5 cursor-pointer"
              type="button"
            >
              B2B/BULK
            </button>
          </div>
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
              <Palette style={{ width: '22px', height: '22px', color: '#0284c7' }} />
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
              style={{ backgroundColor: '#0284c7' }}
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
                  style={{ backgroundColor: '#f0f9ff', borderColor: '#bae6fd', borderRadius: '8px' }}
                >
                  📦 Inquiries reflect 100% on official Hanteo & Circle Charts.
                </div>
                <button
                  onClick={() => {
                    setIsB2BModalOpen(false);
                    setB2bSubmitted(false);
                  }}
                  className="mt-4 px-6 py-2 text-white text-xs font-bold cursor-pointer"
                  style={{ backgroundColor: '#0284c7', borderRadius: '8px' }}
                  type="button"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 style={{ width: '20px', height: '20px', color: '#0284c7' }} />
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
                    style={{ backgroundColor: '#0284c7', borderRadius: '8px' }}
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
                    src="/logo.png"
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
                          setAuthError(data.message || `Lỗi ${response.status}: Đăng nhập thất bại.`);
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
                        <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)' }}>
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
                        backgroundColor: 'var(--color-primary)',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 700,
                        borderRadius: 'var(--radius)',
                        border: 'none',
                        cursor: isLoadingAuth ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: 'var(--shadow-sm)',
                        opacity: isLoadingAuth ? 0.7 : 1,
                        transition: 'all var(--transition-fast)'
                      }}
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
                            password: signupPassword,
                            full_name: signupName,
                            confirmPassword: signupConfirmPassword,
                            phoneNumber: signupPhone,
                          }),
                        });

                        const data = await response.json().catch(() => ({}));

                        if (response.status === 201) {
                          setAuthNotification(data.message || 'Đăng ký thành công');
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
                          // Any status other than 201 is treated as error
                          setAuthError(data.message || 'Registration failed. Please try again.');
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
                        backgroundColor: 'var(--color-primary)',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 700,
                        borderRadius: 'var(--radius)',
                        border: 'none',
                        cursor: isLoadingAuth ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: 'var(--shadow-sm)',
                        opacity: isLoadingAuth ? 0.7 : 1,
                        transition: 'all var(--transition-fast)'
                      }}
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

                {/* Bottom Switch Link - Removes top tab buttons */}
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                  {authMode === 'signin' ? (
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                      {"Don't have an account?"}{' '}
                      <button
                        type="button"
                        onClick={() => { setAuthMode('signup'); setAuthNotification(null); }}
                        style={{ fontWeight: 800, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
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
                        style={{ fontWeight: 800, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
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
