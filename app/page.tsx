'use client';

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { EventHeroBanner } from '../components/EventHeroBanner';

import { UpcomingReleasesAndArticles } from '../components/UpcomingReleasesAndArticles';
import { AlbumGrid } from '../components/AlbumGrid';
import { MultimediaTeaserSection } from '../components/MultimediaTeaserSection';
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
import { Y2KTickerTape } from '../components/Y2KTickerTape';
import { MangaHandDrawnView } from '../components/MangaHandDrawnView';
import { AnimeNeoBrutalView } from '../components/AnimeNeoBrutalView';
import { ComicsPopArtView } from '../components/ComicsPopArtView';
import { CinemaSwissView } from '../components/CinemaSwissView';
import { TvShowsY2KView } from '../components/TvShowsY2KView';
import { SitemapSection } from '../components/SitemapSection';
// import { TestConnection } from '../components/TestConnection';
import { Album, FandomCategoryKey } from '../types';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useActiveFandom } from '../utils/fandomTheme';

export default function Home({ initialCategory = 'all' }: { initialCategory?: FandomCategoryKey | 'all' } = {}) {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtistFilter, setSelectedArtistFilter] = useState('all');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const { setIsCartOpen, setIsWishlistOpen } = useCartWishlist();
  const { themeKey, category, changeFandom } = useActiveFandom(
    initialCategory !== 'all' ? initialCategory : undefined
  );

  const selectedFandomCategory = category as FandomCategoryKey | 'all';
  const fandomThemeKey = themeKey;

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
          onSelectCategory={(cat) => changeFandom(cat)}
        />

        {selectedFandomCategory === 'Manga' ? (
          /* =========================================================================
             DEDICATED HAND-DRAWN MANGA SKETCHBOOK & TANKŌBON LAYOUT
          ========================================================================= */
          <MangaHandDrawnView />
        ) : selectedFandomCategory === 'Anime' ? (
          /* =========================================================================
             DEDICATED ANIME NEO-BRUTALIST SAKUGA & ARCHIVE LAYOUT
          ========================================================================= */
          <AnimeNeoBrutalView />
        ) : selectedFandomCategory === 'Comics' ? (
          /* =========================================================================
             DEDICATED COMICS POP-ART HEROIC & BEN-DAY DOT LAYOUT
          ========================================================================= */
          <ComicsPopArtView />
        ) : selectedFandomCategory === 'Movies' ? (
          /* =========================================================================
             DEDICATED SWISS INTERNATIONAL TYPOGRAPHIC CINEMA ARCHIVE
          ========================================================================= */
          <CinemaSwissView />
        ) : selectedFandomCategory === 'TV Shows' ? (
          /* =========================================================================
             DEDICATED TV SHOWS Y2K POP SHOWCASE (K-POP AESTHETIC)
          ========================================================================= */
          <TvShowsY2KView />
        ) : (
          <>
            {/* Y2K Marquee Ticker 01 */}
            <Y2KTickerTape />

            {/* 2. Character & Idol Group Profiles (Encyclopedic Archive, Characters & Lore) */}
            <IdolProfiles 
              onSelectArtist={handleSelectArtistFromProfiles} 
              fandomCategory={selectedFandomCategory}
            />

            {/* 3. Fandom Content Explorer & Official Album Drops with Multi-Filters & Search */}
            <AlbumGrid
              onSelectAlbum={(album) => setSelectedAlbum(album)}
              searchQuery={searchQuery}
              selectedArtistFilter={selectedArtistFilter}
              setSelectedArtistFilter={setSelectedArtistFilter}
              fandomCategory={selectedFandomCategory}
            />

            {/* 4. Multimedia Center Spotlight & Teaser Showcase */}
            <MultimediaTeaserSection />

            {/* 5. Trending Articles & Upcoming Drops / Release Calendar */}
            <div id="upcoming-releases">
              <UpcomingReleasesAndArticles 
                initialCategory={selectedFandomCategory}
                fandomCategory={selectedFandomCategory}
                onSelectCategory={(cat) => changeFandom(cat)}
              />
            </div>

            {/* 6. World Tour & Stadium Arenas Showcase */}
            <WorldTourShowcase />

            {/* Y2K Marquee Ticker 02 (Inverted Obsidian) */}
            <Y2KTickerTape inverted />

            {/* 7. Fan Community Social Feed */}
            <FanCommunityFeed />
          </>
        )}
      </main>

      {/* SRS 1.9 Mandatory Deliverable: Fan Hub Plus Sitemap & Directory */}
      <SitemapSection
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      {/* Interactive Modals and Drawers */}
      <AlbumDetailModal
        album={selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
      />

      <CartDrawer fandomCategory={selectedFandomCategory} fandomThemeKey={fandomThemeKey} />
      <WishlistModal fandomCategory={selectedFandomCategory} fandomThemeKey={fandomThemeKey} />
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
