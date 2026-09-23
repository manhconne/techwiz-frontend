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
        <span>Worldwide Shipping Available! Pre-Order Official K-Pop Albums & Win Exclusive Fansign Slots!</span>
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
              placeholder="Search album, artist (e.g. NewJeans, BTS, Stray Kids)..."
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

      {/* User Login / Auth Modal */}
      {isAuthModalOpen && (
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
              maxWidth: '380px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setIsAuthModalOpen(false)}
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

            <div className="text-center mb-6">
              <div 
                className="bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ width: '48px', height: '48px', borderRadius: '50%' }}
              >
                <User style={{ width: '24px', height: '24px' }} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                {isLoggedIn ? `Welcome back, ${user.name}` : 'Fan Hub Plus Member Sign In'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isLoggedIn
                  ? `Logged in as ${user.role.toUpperCase()}`
                  : 'Select a persona to test the TechWiz 7 user privileges:'}
              </p>
            </div>

            {isLoggedIn ? (
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1.5" style={{ borderRadius: '8px' }}>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-semibold text-slate-700">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Favorite Fandoms:</span>
                    <span className="font-semibold text-sky-600">
                      {user.favoriteFandoms.join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Privilege:</span>
                    <span className="font-semibold text-slate-800 uppercase">{user.role}</span>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 shadow"
                    style={{ borderRadius: '8px', cursor: 'pointer' }}
                    type="button"
                  >
                    <ShieldCheck style={{ width: '16px', height: '16px' }} />
                    Open Admin Control Panel
                  </button>
                )}

                <button
                  onClick={() => {
                    logout();
                    setIsAuthModalOpen(false);
                  }}
                  className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs font-bold border border-red-200 transition-colors"
                  style={{ borderRadius: '8px', cursor: 'pointer' }}
                  type="button"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    loginAs('registered');
                    setIsAuthModalOpen(false);
                  }}
                  className="w-full p-3 text-white rounded text-xs font-bold transition-all text-left flex items-center justify-between shadow-xs cursor-pointer"
                  style={{ backgroundColor: '#0284c7', borderRadius: '8px' }}
                  type="button"
                >
                  <div>
                    <div className="font-bold text-sm">Demo: Registered Fan User</div>
                    <div className="text-[11px] opacity-90">Access bookmarks, ratings, and checkout perks</div>
                  </div>
                  <Sparkles style={{ width: '20px', height: '20px', color: '#e0f2fe' }} />
                </button>

                <button
                  onClick={() => {
                    loginAs('admin');
                    setIsAuthModalOpen(false);
                  }}
                  className="w-full p-3 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 transition-all text-left flex items-center justify-between shadow-xs cursor-pointer"
                  style={{ borderRadius: '8px' }}
                  type="button"
                >
                  <div>
                    <div className="font-bold text-sm">Demo: Platform Administrator</div>
                    <div className="text-[11px] text-slate-300">Manage catalog drops, stock, and live analytics</div>
                  </div>
                  <ShieldCheck style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </header>
  );
};
