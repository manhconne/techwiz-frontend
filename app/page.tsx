'use client';

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { EventHeroBanner } from '../components/EventHeroBanner';

import { UpcomingReleasesAndArticles } from '../components/UpcomingReleasesAndArticles';
import { AlbumGrid } from '../components/AlbumGrid';
import { MultimediaCenter } from '../components/MultimediaCenter';
import { FanCommunityFeed } from '../components/FanCommunityFeed';
import { WorldTourShowcase } from '../components/WorldTourShowcase';
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
import { Album, FandomCategoryKey } from '../types';
import { useCartWishlist } from '../context/CartWishlistContext';

export default function Home() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtistFilter, setSelectedArtistFilter] = useState('all');
  const [selectedFandomCategory, setSelectedFandomCategory] = useState<FandomCategoryKey | 'all'>('all');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const { setIsCartOpen } = useCartWishlist();

  // Map selectedFandomCategory to theme attribute key
  const fandomThemeKey = React.useMemo(() => {
    switch (selectedFandomCategory) {
      case 'K-Pop': return 'kpop';
      case 'Anime': return 'anime';
      case 'Cosplay': return 'cosplay';
      case 'Gaming': return 'gaming';
      case 'Comics': return 'comics';
      case 'Manga': return 'manga';
      case 'Movies': return 'cinema';
      case 'TV Shows': return 'tv';
      default: return 'all';
    }
  }, [selectedFandomCategory]);

  // Synchronize full-page DOM theme attributes when fandom category changes
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-fandom-theme', fandomThemeKey);
      document.body.setAttribute('data-fandom-theme', fandomThemeKey);
    }
  }, [fandomThemeKey]);

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
    <div 
      className={`min-h-screen flex flex-col bg-body fandom-theme-${fandomThemeKey} transition-colors duration-500`}
      data-fandom-theme={fandomThemeKey}
    >
      {/* Navigation Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        fandomThemeKey={fandomThemeKey}
        fandomCategory={selectedFandomCategory}
      />

      {/* Main Content Sections */}
      <main className="flex-1">

        {/* 1. Global Fandom Events Showcase Carousel Banner (Top of Homepage with Category Dock) */}
        <EventHeroBanner 
          activeCategory={selectedFandomCategory}
          onSelectCategory={(cat) => setSelectedFandomCategory(cat)}
        />


        {/* 3. Bài Viết / Nội Dung Nổi Bật Mới Nhất & Lịch Phát Hành Sắp Tới (Upcoming Releases) */}
        <div id="upcoming-releases">
          <UpcomingReleasesAndArticles 
            initialCategory={selectedFandomCategory}
            onSelectCategory={(cat) => setSelectedFandomCategory(cat)}
          />
        </div>

        {/* 4. Fandom Content Explorer & Official Album Drops with Embedded Category Spotlight Banner */}
        <AlbumGrid
          onSelectAlbum={(album) => setSelectedAlbum(album)}
          searchQuery={searchQuery}
          selectedArtistFilter={selectedArtistFilter}
          setSelectedArtistFilter={setSelectedArtistFilter}
          fandomCategory={selectedFandomCategory}
        />

        {/* 4. Character & Idol Group Profiles */}
        <IdolProfiles 
          onSelectArtist={handleSelectArtistFromProfiles} 
          fandomCategory={selectedFandomCategory}
        />

        {/* 5. Multimedia Center (Trailers, Videos, Podcasts, Livestreams, Soundtracks & Dual Ratings) */}
        <MultimediaCenter />

        {/* 6. World Tour & Stadium Arenas Showcase */}
        <WorldTourShowcase />

        {/* 6. Fan Community Social Feed */}
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
