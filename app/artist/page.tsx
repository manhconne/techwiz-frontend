'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { IdolProfiles } from '../../components/IdolProfiles';
import { AlbumDetailModal } from '../../components/AlbumDetailModal';
import { CartDrawer } from '../../components/CartDrawer';
import { WishlistModal } from '../../components/WishlistModal';
import { ChatbotModal } from '../../components/ChatbotModal';
import { AudioPlayer } from '../../components/AudioPlayer';
import { AdminModal } from '../../components/AdminModal';
import { FeedbackModal } from '../../components/FeedbackModal';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Footer } from '../../components/Footer';
import { Album } from '../../types';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { Sparkles, Users, ArrowRight, ShieldCheck, Disc } from 'lucide-react';

import { useActiveFandom } from '../../utils/fandomTheme';

export default function ArtistPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { setIsCartOpen } = useCartWishlist();
  const { themeKey, category } = useActiveFandom();

  const isManga = themeKey === 'manga';
  const isAnime = themeKey === 'anime';
  const isCosplay = themeKey === 'cosplay';
  const isGaming = themeKey === 'gaming';
  const isComics = themeKey === 'comics';
  const isCinema = themeKey === 'cinema';
  const isTv = themeKey === 'tv';

  const handleSelectArtist = (artistId: string) => {
    // Navigate to albums page with artist filter
    window.location.href = `/cd-dvd-book?artist=${artistId}&fandom=${themeKey}`;
  };

  return (
    <div 
      className={`min-h-screen flex flex-col fandom-theme-${themeKey} transition-colors duration-500`}
      data-fandom-theme={themeKey}
    >
      {/* Navigation Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        fandomThemeKey={themeKey}
        fandomCategory={category}
      />

      <main className="flex-1">
        {/* Unified Breadcrumbs Navigation */}
        <div className="bg-slate-50 border-b border-slate-200">
          <Breadcrumbs
            items={[
              { label: 'Artist Dossiers & Character Lore', isActive: true }
            ]}
          />
        </div>

        {/* Dedicated Artist Page Hero Banner - Dynamically Styled per Fandom */}
        <section 
          style={{
            backgroundColor: isCinema ? '#0d0d0f' : isManga ? '#fdfbf7' : isGaming ? '#09090b' : '#000000',
            color: isManga ? '#2d2d2d' : '#ffffff',
            padding: '48px 28px',
            borderBottom: isCinema ? '2px solid #d4af37' : isManga ? '3px solid #2d2d2d' : isAnime ? '3px solid #ccff00' : isCosplay ? '3px solid #D02020' : '1px solid #1e293b',
          }}
        >
          <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: isGaming ? 'var(--font-mono)' : isManga ? "'Kalam', cursive" : 'monospace', color: isManga ? '#71717a' : '#94a3b8', textTransform: 'uppercase', marginBottom: '16px' }}>
              <Link href="/" className="hover:underline transition-colors">{category}</Link>
              <span>/</span>
              <span style={{ color: isCinema ? '#d4af37' : isAnime ? '#ccff00' : isCosplay ? '#D02020' : isManga ? '#ff4d4d' : '#ffffff', fontWeight: 800 }}>
                {category.toUpperCase()} CREATORS &amp; DOSSIERS
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
              <div style={{ maxWidth: '780px' }}>
                <div 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    padding: '4px 10px', 
                    backgroundColor: isCinema ? '#27272a' : isGaming ? '#000000' : isManga ? '#ffe4e6' : '#1e293b', 
                    color: isCinema ? '#d4af37' : isGaming ? '#00f0ff' : isAnime ? '#a3e635' : isManga ? '#e11d48' : '#38bdf8', 
                    fontSize: '10px', 
                    fontFamily: isGaming ? 'var(--font-mono)' : 'monospace', 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    marginBottom: '12px', 
                    border: `1px solid ${isCinema ? '#d4af37' : isGaming ? '#00f0ff' : isManga ? '#e11d48' : 'rgba(56,189,248,0.3)'}` 
                  }}
                >
                  <Users style={{ width: '12px', height: '12px' }} />
                  <span>{category} Canonical Universes &amp; Character Lore</span>
                </div>
                <h1 
                  style={{
                    fontFamily: isManga ? "'Kalam', cursive" : isCinema ? "'Playfair Display', Georgia, serif" : isComics ? "'Bangers', cursive" : "'Space Grotesk', sans-serif",
                    fontSize: 'clamp(32px, 4vw, 56px)',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: isManga ? '0.02em' : '-0.02em',
                    margin: '0 0 12px 0',
                    color: isManga ? '#2d2d2d' : '#ffffff',
                  }}
                >
                  {isGaming ? (
                    <>Gaming Arena <em style={{ fontWeight: 400, color: '#00f0ff', fontStyle: 'normal' }}>// Esports Champions &amp; OST Composers</em></>
                  ) : isManga ? (
                    <>Manga Guild <em style={{ fontWeight: 400, color: '#ff4d4d', fontStyle: 'italic' }}>&amp; Legendary Mangaka Dossiers</em></>
                  ) : isAnime ? (
                    <>Sakuga Anime <em style={{ fontWeight: 400, color: '#ccff00', fontStyle: 'normal' }}>// Directors, Seiyuu &amp; Studio MAPPA</em></>
                  ) : isCosplay ? (
                    <>Bauhaus Atelier <em style={{ fontWeight: 400, color: '#D02020', fontStyle: 'italic' }}>&amp; Costume Constructors</em></>
                  ) : isComics ? (
                    <>Comics Multiverse <em style={{ fontWeight: 400, color: '#ffd60a', fontStyle: 'normal' }}>// Superhero Lore &amp; Variant Covers</em></>
                  ) : isCinema ? (
                    <>70mm Cinema Archive <em style={{ fontWeight: 400, color: '#d4af37', fontStyle: 'italic' }}>&amp; Visionary Auteurs</em></>
                  ) : isTv ? (
                    <>Television Binge Vault <em style={{ fontWeight: 400, color: '#c084fc', fontStyle: 'normal' }}>&amp; Ensemble Cast Lore</em></>
                  ) : (
                    <>All Artists, Groups <em style={{ fontWeight: 400, color: '#ff2e93', fontStyle: 'italic' }}>&amp; Character Lore</em></>
                  )}
                </h1>
                <p style={{ fontSize: '14px', color: isManga ? '#52525b' : '#94a3b8', lineHeight: 1.6, margin: 0, fontWeight: 300 }}>
                  {isGaming 
                    ? 'Dive into comprehensive dossiers of legendary League of Legends World Champions (T1 & Faker), HoYo-MiX orchestral composers, and Elden Ring dark fantasy demigods.'
                    : isManga
                    ? 'Explore original hand-drawn manuscripts, Weekly Shonen Jump mangaka masterclasses, Oda Eiichiro archives, and first-print tankōbon milestones.'
                    : isAnime
                    ? 'Delve into award-winning animation studios like ufotable and Studio MAPPA, official seiyuu voice talents, and high-octane anime lore.'
                    : isCosplay
                    ? 'Constructivist design portfolios, aerodynamic polymer costume guides, and living geometry stage performances.'
                    : isCinema
                    ? 'Director-approved monographs for Christopher Nolan, Denis Villeneuve, uncompressed IMAX reference scores, and physical 70mm cell specimens.'
                    : 'Discover canonical era timelines, member personality matrices, official fan club perks, and complete discography archives.'}
                </p>
              </div>

              {/* Quick Stat Badges */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ padding: '14px 20px', backgroundColor: isCinema ? '#18181b' : isGaming ? '#000000' : isManga ? '#ffffff' : '#0f172a', border: `1px solid ${isCinema ? '#d4af37' : isGaming ? '#00f0ff' : isManga ? '#2d2d2d' : '#334155'}`, minWidth: '140px' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', color: isManga ? '#71717a' : '#94a3b8', textTransform: 'uppercase', display: 'block' }}>CATEGORY</span>
                  <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: isCinema ? '#d4af37' : isGaming ? '#00f0ff' : isManga ? '#ff4d4d' : '#ffffff' }}>{category.toUpperCase()}</span>
                </div>
                <div style={{ padding: '14px 20px', backgroundColor: isCinema ? '#18181b' : isGaming ? '#000000' : isManga ? '#ffffff' : '#0f172a', border: `1px solid ${isCinema ? '#d4af37' : isGaming ? '#00f0ff' : isManga ? '#2d2d2d' : '#334155'}`, minWidth: '140px' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', color: isManga ? '#71717a' : '#94a3b8', textTransform: 'uppercase', display: 'block' }}>DOSSIERS</span>
                  <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: isManga ? '#2d2d2d' : '#ffffff' }}>100% CANON</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Complete Idol Profiles Component with Fandom Category Filter */}
        <IdolProfiles onSelectArtist={handleSelectArtist} fandomCategory={category} />
      </main>

      {/* Modals & Drawers */}
      <AlbumDetailModal
        album={selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
      />

      <CartDrawer />
      <WishlistModal />
      <AudioPlayer />

      <ChatbotModal
        onFilterArtist={handleSelectArtist}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />
    </div>
  );
}
