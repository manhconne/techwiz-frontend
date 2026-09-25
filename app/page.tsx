'use client';

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { EventHeroBanner } from '../components/EventHeroBanner';
import { AlbumGrid } from '../components/AlbumGrid';
import { FanCommunityFeed } from '../components/FanCommunityFeed';
import { AlbumDetailModal } from '../components/AlbumDetailModal';
import { IdolProfiles } from '../components/IdolProfiles';
import { CartDrawer } from '../components/CartDrawer';
import { WishlistModal } from '../components/WishlistModal';
import { ChatbotModal } from '../components/ChatbotModal';
import { AudioPlayer } from '../components/AudioPlayer';
import { AdminModal } from '../components/AdminModal';
import { FeedbackModal } from '../components/FeedbackModal';

import { Footer } from '../components/Footer';
// import { TestConnection } from '../components/TestConnection';
import { Album } from '../types';
import { useCartWishlist } from '../context/CartWishlistContext';

export default function Home() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtistFilter, setSelectedArtistFilter] = useState('all');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const { setIsCartOpen } = useCartWishlist();

  const handleSelectArtistFromProfiles = (artistId: string) => {
    setSelectedArtistFilter(artistId);
    const albumsEl = document.getElementById('albums');
    if (albumsEl) {
      albumsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFilterArtistFromBot = (artistId: string) => {
    setSelectedArtistFilter(artistId);
    const albumsEl = document.getElementById('albums');
    if (albumsEl) {
      albumsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-body">
      {/* Navigation Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Sections */}
      <main className="flex-1">

        {/* 1. Global Fandom Events Showcase Carousel Banner (Top of Homepage) */}
        <EventHeroBanner />

        {/* 2. Fandom Content Explorer & Official Album Drops with Embedded Category Spotlight Banner */}
        <AlbumGrid
          onSelectAlbum={(album) => setSelectedAlbum(album)}
          searchQuery={searchQuery}
          selectedArtistFilter={selectedArtistFilter}
          setSelectedArtistFilter={setSelectedArtistFilter}
        />

        {/* 4. Character & Idol Group Profiles */}
        <IdolProfiles onSelectArtist={handleSelectArtistFromProfiles} />

        {/* 5. Fan Community Social Feed */}
        <FanCommunityFeed />


      </main>

      {/* Interactive Modals and Drawers */}
      <AlbumDetailModal
        album={selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
      />

      <CartDrawer />
      <WishlistModal />
      <AudioPlayer />

      {/* AI-Powered Chatbot Assistant */}
      <ChatbotModal
        onFilterArtist={handleFilterArtistFromBot}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Admin Control Panel Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Dynamic Feedback Modal */}
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
