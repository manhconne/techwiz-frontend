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
import { EventHeroBanner } from '../../components/EventHeroBanner';
import { 
  Ticket, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Flame, 
  Radio, 
  Award, 
  HelpCircle,
  Sparkles,
  Heart,
  Store,
  ExternalLink,
  ChevronRight,
  Layers,
  Vote
} from 'lucide-react';

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
        {/* Editorial Event Showcase Carousel Banner (Exact user requested layout) */}
        <EventHeroBanner />

        {/* Tour Calendar Component with VIP Passes, Fansigns & Voting */}
        <TourCalendar />

        {/* Global Fandom Guidelines & Ecosystem FAQ (Weverse, Withmuu, Mubeat) */}
        <section style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '64px 24px' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
              <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#94a3b8' }}>
                FANDOM ECOSYSTEM PROTOCOLS
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '30px', fontWeight: 800, color: '#0f172a', margin: '8px 0 0 0' }}>
                Official Event Verification &amp; Participation Guide
              </h2>
              <p className="text-xs text-slate-500 mt-2 max-w-xl mx-auto">
                Comprehensive step-by-step instructions on how ticketing, lucky draws, video calls, and voting work across our official partner networks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Protocol 1: Weverse Stadium Tours */}
              <div style={{ backgroundColor: '#ffffff', padding: '24px', border: '1.5px solid #000000', borderRadius: '4px' }}>
                <div className="flex items-center justify-between mb-3">
                  <Radio style={{ width: '28px', height: '28px', color: '#059669' }} />
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                    WEVERSE PROTOCOL
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>
                  Stadium Tours &amp; 4K Weverse Live
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                  Official tickets include encrypted barcodes with anti-scalping identity binding. Holders of verified Fanclub Memberships (ARMY, BLINK, CARAT, STAY, MY) gain priority presale soundcheck access with code <strong>FANHUB-VIP-99</strong>.
                </p>
                <ul className="text-[11px] text-slate-700 space-y-1 pl-4 list-disc font-medium">
                  <li>360-degree stadium soundcheck floor entry</li>
                  <li>Bluetooth wireless lightstick pairing at stadium gates</li>
                  <li>Simultaneous 4K multi-view live stream vouchers</li>
                </ul>
              </div>

              {/* Protocol 2: Withmuu Lucky Draws & Fansigns */}
              <div style={{ backgroundColor: '#ffffff', padding: '24px', border: '1.5px solid #000000', borderRadius: '4px' }}>
                <div className="flex items-center justify-between mb-3">
                  <Sparkles style={{ width: '28px', height: '28px', color: '#be185d' }} />
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-pink-100 text-pink-800 rounded">
                    WITHMUU PROTOCOL
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>
                  Unreleased Photocards &amp; Fansigns
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                  Each album purchased during the event application window equals 1 lottery entry for 1:1 Video Calls (영통 팬싸) or Face-to-Face sessions in Seoul/Busan, plus 1 guaranteed Withmuu unreleased hologram selfie photocard.
                </p>
                <ul className="text-[11px] text-slate-700 space-y-1 pl-4 list-disc font-medium">
                  <li>AK Plaza Hongdae mechanical lucky draw tokens</li>
                  <li>30 ~ 50 winners per session with personal name dedication</li>
                  <li>Direct passport identity verification for international fans</li>
                </ul>
              </div>

              {/* Protocol 3: Mubeat Music Core & Billboards */}
              <div style={{ backgroundColor: '#ffffff', padding: '24px', border: '1.5px solid #000000', borderRadius: '4px' }}>
                <div className="flex items-center justify-between mb-3">
                  <Heart style={{ width: '28px', height: '28px', color: '#7e22ce', fill: '#7e22ce' }} />
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded">
                    MUBEAT PROTOCOL
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>
                  Show! Music Core &amp; Billboard Ads
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                  Exchange collected Heart Beats for live voting tickets to crown your artist #1 on MBC Show! Music Core, or pool votes to unlock giant LED advertising billboards at Seoul Hongdae Station and New York Times Square.
                </p>
                <ul className="text-[11px] text-slate-700 space-y-1 pl-4 list-disc font-medium">
                  <li>100% verified broadcast chart calculation impact</li>
                  <li>Subway Exit 9 &amp; Broadway Times Square 15-day LED runs</li>
                  <li>Fandom leaderboards with donor credits on screen</li>
                </ul>
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
