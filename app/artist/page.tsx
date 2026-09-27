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

export default function ArtistPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { setIsCartOpen } = useCartWishlist();

  const handleSelectArtist = (artistId: string) => {
    // Navigate to albums page with artist filter
    window.location.href = `/cd-dvd-book?artist=${artistId}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
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

        {/* Dedicated Artist Page Hero Banner */}
        <section 
          style={{
            backgroundColor: '#000000',
            color: '#ffffff',
            padding: '48px 28px',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px' }}>
              <Link href="/" className="hover:text-white transition-colors">HOME</Link>
              <span>/</span>
              <span style={{ color: '#ffffff', fontWeight: 800 }}>ARTISTS & CHARACTER UNIVERSES</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
              <div style={{ maxWidth: '780px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#1e293b', color: '#38bdf8', fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', border: '1px solid rgba(56,189,248,0.3)' }}>
                  <Users style={{ width: '12px', height: '12px' }} />
                  <span>Encyclopedic Archive · 14 Canonical Universes</span>
                </div>
                <h1 
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(32px, 4vw, 56px)',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    margin: '0 0 12px 0',
                  }}
                >
                  All Artists, Groups <em style={{ fontWeight: 400, color: '#94a3b8', fontStyle: 'italic' }}>& Character Lore</em>
                </h1>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, margin: 0, fontWeight: 300 }}>
                  Dive into comprehensive dossiers of legendary K-Pop groups, Anime protagonists, and Gaming franchises. Discover canonical era timelines, member personality matrices, official fan club perks, and complete discography archives.
                </p>
              </div>

              {/* Quick Stat Badges */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ padding: '14px 20px', backgroundColor: '#0f172a', border: '1px solid #334155', minWidth: '140px' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>TOTAL ARTISTS</span>
                  <span style={{ fontSize: '26px', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>14+</span>
                </div>
                <div style={{ padding: '14px 20px', backgroundColor: '#0f172a', border: '1px solid #334155', minWidth: '140px' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>CHARACTER DOSSIERS</span>
                  <span style={{ fontSize: '26px', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>48+</span>
                </div>
                <div style={{ padding: '14px 20px', backgroundColor: '#0f172a', border: '1px solid #334155', minWidth: '140px' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>CHART RELEASES</span>
                  <span style={{ fontSize: '26px', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>100%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Complete Idol Profiles Component */}
        <IdolProfiles onSelectArtist={handleSelectArtist} />
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
