'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { TourCalendar } from '../../components/TourCalendar';
import { AlbumDetailModal } from '../../components/AlbumDetailModal';
import { CartDrawer } from '../../components/CartDrawer';
import { WishlistModal } from '../../components/WishlistModal';
import { ChatbotModal } from '../../components/ChatbotModal';
import { AudioPlayer } from '../../components/AudioPlayer';
import { AdminModal } from '../../components/AdminModal';
import { FeedbackModal } from '../../components/FeedbackModal';
import { Footer } from '../../components/Footer';
import { Album } from '../../types';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { Ticket, MapPin, Calendar, ShieldCheck, Flame, Radio, Award, HelpCircle } from 'lucide-react';

export default function EventPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { setIsCartOpen } = useCartWishlist();

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
        {/* Dedicated Event Page Hero Banner */}
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
              <span style={{ color: '#ffffff', fontWeight: 800 }}>WORLD TOURS & ARENA EVENTS</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
              <div style={{ maxWidth: '780px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#1e293b', color: '#10b981', fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <Radio style={{ width: '12px', height: '12px' }} />
                  <span>Certified Box Office · 2026-2027 Schedules</span>
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
                  World Stadium Tours <em style={{ fontWeight: 400, color: '#94a3b8', fontStyle: 'italic' }}>& Arena Fan Meetings</em>
                </h1>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, margin: 0, fontWeight: 300 }}>
                  Official verified ticket reservations, VIP soundcheck floor packages, and stadium stage locations. Directly authorized by global promoters including HYBE, YG Entertainment, SM Entertainment, and JYP Entertainment.
                </p>
              </div>

              {/* Box Office Metrics */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ padding: '14px 20px', backgroundColor: '#0f172a', border: '1px solid #334155', minWidth: '140px' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>GLOBAL CITIES</span>
                  <span style={{ fontSize: '26px', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>5 CITIES</span>
                </div>
                <div style={{ padding: '14px 20px', backgroundColor: '#0f172a', border: '1px solid #334155', minWidth: '140px' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>PRIORITY PASS</span>
                  <span style={{ fontSize: '26px', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>VIP TIER</span>
                </div>
                <div style={{ padding: '14px 20px', backgroundColor: '#0f172a', border: '1px solid #334155', minWidth: '140px' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>TICKET AUTH</span>
                  <span style={{ fontSize: '26px', fontWeight: 900, fontFamily: 'monospace', color: '#10b981' }}>100%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tour Calendar Component with VIP Passes */}
        <TourCalendar />

        {/* Global Stadium Ticket Guide & FAQ */}
        <section style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '64px 28px' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#94a3b8' }}>
                FAN PASS PROTOCOL
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '8px 0 0 0' }}>
                Official Ticket & Stadium Guidelines
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div style={{ backgroundColor: '#ffffff', padding: '24px', border: '1.5px solid #000000' }}>
                <ShieldCheck style={{ width: '28px', height: '28px', color: '#000000', marginBottom: '12px' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>
                  100% Anti-Scalping Protection
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  Every ticket pass issued by Fan Hub Plus is linked to verified user identity and encrypted barcode technology, eliminating unauthorized scalper re-sales.
                </p>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '24px', border: '1.5px solid #000000' }}>
                <Flame style={{ width: '28px', height: '28px', color: '#000000', marginBottom: '12px' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>
                  Fanclub Priority Pre-Sale
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  Enter code <strong>FANHUB-VIP-99</strong> during checkout to unlock first-access soundcheck floor reservations ahead of general public release.
                </p>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '24px', border: '1.5px solid #000000' }}>
                <Award style={{ width: '28px', height: '28px', color: '#000000', marginBottom: '12px' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>
                  Lightstick Stadium Sync
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  All stadium passes include wireless Bluetooth pairing zones at the gate for central lighting console sync (ARMY Bomb, Nachimbong, Binky Bong, etc.).
                </p>
              </div>
            </div>
          </div>
        </section>
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
        onFilterArtist={() => {}}
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
