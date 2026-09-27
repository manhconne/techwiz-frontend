'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { MultimediaCenter } from '../../components/MultimediaCenter';
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
import { Tv, Radio, Sparkles, Volume2 } from 'lucide-react';

export default function MultimediaPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { setIsCartOpen } = useCartWishlist();

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      {/* Navigation Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1">
        {/* Unified Breadcrumbs Navigation */}
        <div className="bg-white border-b-2 border-black">
          <Breadcrumbs 
            items={[
              { label: 'Cinematheque & Sound Lab (Multimedia Streaming Hub)', isActive: true }
            ]} 
          />
        </div>

        {/* Dedicated Y2K Multimedia Category Hero Banner */}
        <section 
          className="bg-black text-white px-4 sm:px-8 py-10 sm:py-14 border-b-4 border-black relative overflow-hidden"
        >
          {/* Subtle Cyber Grid Background */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          <div className="max-w-[1440px] mx-auto relative z-10">
            {/* Breadcrumb Path */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 uppercase tracking-widest mb-4">
              <Link href="/" className="hover:text-[#ffd60a] transition-colors">HOME</Link>
              <span>/</span>
              <span className="text-[#ffd60a] font-bold">MULTIMEDIA STREAMING HUB</span>
            </div>

            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-8">
              <div className="max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff2e93] text-white border-2 border-white font-mono text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_#ffffff]">
                  <Tv className="w-3.5 h-3.5" />
                  <span>SECTION 04 ARCHIVE // 4K BROADCAST &amp; LOSSLESS 24-BIT SOUND LAB</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-tight tracking-tight">
                  Cinematheque &amp;{' '}
                  <em className="font-serif italic font-normal text-[#00f0ff]">
                    Sound Lab
                  </em>
                </h1>

                <p className="font-serif text-xs sm:text-sm text-neutral-300 leading-relaxed font-light max-w-2xl">
                  Official audio-visual archive: 4K HDR cinematic trailers, backstage footage, 24-bit audiophile Lossless soundstage, studio podcasts, and interactive real-time teletext live streams.
                </p>
              </div>

              {/* Specification Stamps */}
              <div className="flex gap-3 sm:gap-4 flex-wrap font-mono">
                <div 
                  style={{ borderRadius: '0px' }}
                  className="p-3 sm:p-4 bg-neutral-900 border-2 border-white min-w-[130px] shadow-[3px_3px_0px_#ffd60a]"
                >
                  <span className="text-[9px] text-neutral-400 uppercase tracking-widest block font-bold">RESOLUTION</span>
                  <span className="text-lg font-black text-[#ffd60a] flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-[#ffd60a]" />
                    4K HDR
                  </span>
                </div>

                <div 
                  style={{ borderRadius: '0px' }}
                  className="p-3 sm:p-4 bg-neutral-900 border-2 border-white min-w-[130px] shadow-[3px_3px_0px_#00f0ff]"
                >
                  <span className="text-[9px] text-neutral-400 uppercase tracking-widest block font-bold">AUDIO CODEC</span>
                  <span className="text-lg font-black text-[#00f0ff] flex items-center gap-1">
                    <Volume2 className="w-4 h-4 text-[#00f0ff]" />
                    24-BIT/96K
                  </span>
                </div>

                <div 
                  style={{ borderRadius: '0px' }}
                  className="p-3 sm:p-4 bg-neutral-900 border-2 border-white min-w-[130px] shadow-[3px_3px_0px_#ff2e93]"
                >
                  <span className="text-[9px] text-neutral-400 uppercase tracking-widest block font-bold">TELETEXT</span>
                  <span className="text-lg font-black text-[#ff2e93] flex items-center gap-1">
                    <Radio className="w-4 h-4 text-[#ff2e93]" />
                    REALTIME
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full Interactive Multimedia Center */}
        <MultimediaCenter />
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

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />
    </div>
  );
}
