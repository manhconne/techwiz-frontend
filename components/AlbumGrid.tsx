'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { usePlayer } from '../context/PlayerContext';
import { useDomainTheme } from '../context/DomainContext';
import { filterAlbumsByDomain, filterArtistsByDomain } from '../utils/domainFilters';
import { mockAlbums, mockArtists } from '../data/mockData';
import { Album } from '../types';
import { HeroBanner } from './HeroBanner';
import { 
  Heart, 
  ShoppingCart, 
  Play, 
  Eye, 
  Volume2,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';

interface AlbumGridProps {
  onSelectAlbum: (album: Album) => void;
  searchQuery: string;
  selectedArtistFilter?: string;
  setSelectedArtistFilter?: (artistId: string) => void;
}

export const AlbumGrid: React.FC<AlbumGridProps> = ({
  onSelectAlbum,
  searchQuery,
  selectedArtistFilter,
  setSelectedArtistFilter,
}) => {
  const { addToCart, toggleWishlist, isWishlisted, formatPrice } = useCartWishlist();
  const { playTrack, currentAlbum, isPlaying } = usePlayer();
  const { currentDomain, activeSubCategory, selectSubCategory, activeConfig } = useDomainTheme();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeArtist, setActiveArtist] = useState<string>(selectedArtistFilter || 'all');
  const [activeType, setActiveType] = useState<string>('all');
  const [activeSort, setActiveSort] = useState<'popular' | 'newest' | 'price-asc' | 'price-desc'>('popular');
  const [inStockOnly, setInStockOnly] = useState(false);

  React.useEffect(() => {
    if (selectedArtistFilter) {
      setActiveArtist(selectedArtistFilter);
    }
  }, [selectedArtistFilter]);

  const handleArtistChange = (id: string) => {
    setActiveArtist(id);
    if (setSelectedArtistFilter) setSelectedArtistFilter(id);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setActiveArtist('all');
    if (setSelectedArtistFilter) setSelectedArtistFilter('all');
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setActiveArtist('all');
    setActiveType('all');
    setInStockOnly(false);
    selectSubCategory('all');
    if (setSelectedArtistFilter) setSelectedArtistFilter('all');
  };

  // 1. First filter by Domain & Subcategory from DomainContext
  const domainFilteredAlbums = useMemo(() => {
    return filterAlbumsByDomain(mockAlbums, currentDomain, activeSubCategory);
  }, [currentDomain, activeSubCategory]);

  const domainFilteredArtists = useMemo(() => {
    return filterArtistsByDomain(mockArtists, currentDomain, activeSubCategory);
  }, [currentDomain, activeSubCategory]);

  const filteredArtists = useMemo(() => {
    if (activeCategory === 'all') return domainFilteredArtists;
    return domainFilteredArtists.filter((artist) => artist.category === activeCategory);
  }, [activeCategory, domainFilteredArtists]);

  const filteredAlbums = useMemo(() => {
    return domainFilteredAlbums.filter((album) => {
      if (activeCategory !== 'all' && album.category !== activeCategory) return false;
      if (activeArtist !== 'all' && album.artistId !== activeArtist) return false;
      if (activeType !== 'all' && album.type !== activeType) return false;
      if (inStockOnly && album.stock <= 0) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = album.title.toLowerCase().includes(query);
        const matchesArtist = album.artist.toLowerCase().includes(query);
        const matchesType = album.type.toLowerCase().includes(query);
        const matchesCategory = album.category ? album.category.toLowerCase().includes(query) : false;
        if (!matchesTitle && !matchesArtist && !matchesType && !matchesCategory) return false;
      }

      return true;
    }).sort((a, b) => {
      if (activeSort === 'popular') return b.popularityScore - a.popularityScore;
      if (activeSort === 'newest') return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      if (activeSort === 'price-asc') return a.priceUSD - b.priceUSD;
      if (activeSort === 'price-desc') return b.priceUSD - a.priceUSD;
      return 0;
    });
  }, [domainFilteredAlbums, activeCategory, activeArtist, activeType, activeSort, inStockOnly, searchQuery]);

  const hasActiveFilters = activeArtist !== 'all' || activeType !== 'all' || inStockOnly || activeCategory !== 'all' || activeSubCategory !== 'all';
  const selectedArtistObj = mockArtists.find((a) => a.id === activeArtist);

  const currentSubCatObj = activeConfig.subCategories.find((s) => s.id === activeSubCategory);
  const activeCategoryTitle = activeSubCategory === 'all' 
    ? (activeConfig.id === 'classic' ? 'All Products' : activeConfig.name)
    : (currentSubCatObj?.name || activeConfig.name);

  // Custom artist dropdown state
  const [artistDropdownOpen, setArtistDropdownOpen] = useState(false);
  const artistDropdownRef = useRef<HTMLDivElement>(null);

  // Custom sort dropdown state
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (artistDropdownRef.current && !artistDropdownRef.current.contains(e.target as Node)) {
        setArtistDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortLabels: Record<string, string> = {
    popular: 'Popular',
    newest: 'Newest',
    'price-asc': 'Price ↑',
    'price-desc': 'Price ↓',
  };

  return (
    <section 
      id="albums" 
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
      }}
      className="py-12 md:py-20 w-full"
    >
      <div 
        className="max-w-[1440px] mx-auto px-3.5 sm:px-7"
      >

        {/* ==================== 1. Premium Section Header ==================== */}
        <div style={{ marginBottom: '0' }}>
          {/* Top Row: Eyebrow + Categories */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            {/* Eyebrow label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px', height: '2px', backgroundColor: '#000', display: 'inline-block', borderRadius: '2px' }} />
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#94a3b8',
                }}
              >
                Official Store · Certified Charts
              </span>
            </div>

            {/* Universe Sub-Category Tabs — right-aligned, underline style */}
            <div className="flex items-center gap-4 sm:gap-5 overflow-x-auto scrollbar-none max-w-full pb-1">
              {activeConfig.subCategories.map((sub) => {
                const isActive = activeSubCategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => selectSubCategory(sub.id)}
                    type="button"
                    style={{
                      padding: '0 0 10px 0',
                      fontSize: '11px',
                      fontWeight: isActive ? 800 : 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: isActive ? '#0f172a' : '#94a3b8',
                      background: 'none',
                      border: 'none',
                      borderBottom: isActive ? '2px solid #0f172a' : '2px solid transparent',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                      fontFamily: activeConfig.fontFamily,
                    }}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Title */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              paddingBottom: '24px',
              borderBottom: '1px solid #f1f5f9',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <h2
              style={{
                fontFamily: activeConfig.fontFamily,
                fontSize: 'clamp(28px, 3.2vw, 48px)',
                lineHeight: 1.1,
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.025em',
                margin: 0,
              }}
            >
              {activeCategoryTitle}{' '}
              <em style={{ fontWeight: 400, color: '#94a3b8', fontStyle: 'italic', fontFamily: 'serif' }}>
                Collection
              </em>
            </h2>

            {/* Result count */}
            <span
              style={{
                fontSize: '13px',
                color: '#94a3b8',
                fontWeight: 600,
                flexShrink: 0,
                paddingBottom: '6px',
              }}
            >
              <strong style={{ color: '#0f172a', fontWeight: 800, fontSize: '18px' }}>
                {filteredAlbums.length}
              </strong>{' '}
              albums
            </span>
          </div>
        </div>

        {/* ==================== 1.5. Dynamic Category Spotlight Banner (NewJeans, BTS, Anime, Gaming, Art) ==================== */}
        <HeroBanner embedded />

        {/* ==================== 2. Premium Filter Toolbar ==================== */}
        <div
          className="flex items-center justify-between gap-3 p-2.5 sm:p-4 my-4 sm:my-8 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 flex-wrap"
        >
          {/* Left: Format Segments + Artist + In Stock */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap max-w-full">

            {/* Segmented Format Control */}
            <div
              className="flex items-center bg-white border border-slate-200 rounded-lg sm:rounded-xl p-1 gap-0.5 overflow-x-auto scrollbar-none max-w-full"
            >
              {[
                { value: 'all', label: 'All' },
                { value: 'Full Album', label: 'LP/CD' },
                { value: 'Mini Album', label: 'Mini EP' },
                { value: 'Limited Kit', label: 'Limited' },
                { value: 'OST & Vinyl', label: 'Vinyl' },
              ].map((fmt) => {
                const isActive = activeType === fmt.value;
                return (
                  <button
                    key={fmt.value}
                    type="button"
                    onClick={() => setActiveType(fmt.value)}
                    style={{
                      padding: '5px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.03em',
                      borderRadius: '7px',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      border: 'none',
                      backgroundColor: isActive ? '#0f172a' : 'transparent',
                      color: isActive ? '#ffffff' : '#64748b',
                      boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.18)' : 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {fmt.label}
                  </button>
                );
              })}
            </div>

            {/* Separator */}
            <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0', margin: '0 4px' }} />

            {/* Artist Custom Dropdown */}
            <div ref={artistDropdownRef} style={{ position: 'relative' }}>
              {/* Trigger Button */}
              <button
                type="button"
                onClick={() => setArtistDropdownOpen(!artistDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: activeArtist !== 'all' ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
                  backgroundColor: activeArtist !== 'all' ? '#0f172a' : '#ffffff',
                  color: activeArtist !== 'all' ? '#ffffff' : '#64748b',
                  outline: 'none',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{activeArtist !== 'all' ? selectedArtistObj?.name : 'Artist'}</span>
                <ChevronDown size={11} style={{ opacity: 0.6, transform: artistDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
              </button>

              {/* Dropdown Panel — ALL MD style */}
              {artistDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 40, backgroundColor: 'transparent' }}
                    onClick={() => setArtistDropdownOpen(false)}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '100%',
                      marginTop: '8px',
                      minWidth: '200px',
                      maxHeight: '320px',
                      overflowY: 'auto',
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #000000',
                      borderRadius: '0px',
                      padding: '18px 20px',
                      boxShadow: '0 16px 36px rgba(0,0,0,0.15)',
                      zIndex: 50,
                    }}
                  >
                    {/* Caret */}
                    <div style={{ position: 'absolute', top: '-8px', left: '30px', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '8px solid #000000', zIndex: 51 }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {/* All Artists */}
                      <button
                        type="button"
                        onClick={() => { handleArtistChange('all'); setArtistDropdownOpen(false); }}
                        style={{
                          textAlign: 'left',
                          fontWeight: activeArtist === 'all' ? 900 : 800,
                          fontSize: '13px',
                          color: activeArtist === 'all' ? '#000000' : '#000000',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                          background: 'none',
                          border: 'none',
                          padding: '2px 0',
                          cursor: 'pointer',
                          transition: 'color 0.15s ease',
                          display: 'block',
                          width: '100%',
                          textDecoration: activeArtist === 'all' ? 'underline' : 'none',
                          textDecorationThickness: '2px',
                        }}
                        className="hover:text-slate-500"
                      >
                        All Artists
                      </button>

                      {filteredArtists.map((artist) => {
                        const isSelected = activeArtist === artist.id;
                        return (
                          <button
                            key={artist.id}
                            type="button"
                            onClick={() => { handleArtistChange(artist.id); setArtistDropdownOpen(false); }}
                            style={{
                              textAlign: 'left',
                              fontWeight: isSelected ? 900 : 800,
                              fontSize: '13px',
                              color: '#000000',
                              textTransform: 'uppercase',
                              letterSpacing: '0.03em',
                              background: 'none',
                              border: 'none',
                              padding: '2px 0',
                              cursor: 'pointer',
                              transition: 'color 0.15s ease',
                              display: 'block',
                              width: '100%',
                              textDecoration: isSelected ? 'underline' : 'none',
                              textDecorationThickness: '2px',
                            }}
                            className="hover:text-slate-500"
                          >
                            {artist.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* In Stock Toggle */}
            <button
              type="button"
              onClick={() => setInStockOnly(!inStockOnly)}
              style={{
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.03em',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                border: inStockOnly ? '1.5px solid #15803d' : '1px solid #e2e8f0',
                backgroundColor: inStockOnly ? '#15803d' : '#ffffff',
                color: inStockOnly ? '#ffffff' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: inStockOnly ? '#bbf7d0' : '#cbd5e1',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              In Stock
            </button>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                type="button"
                style={{
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: '1px solid #fecaca',
                  backgroundColor: 'transparent',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.15s ease',
                }}
              >
                <X size={10} />
                Clear
              </button>
            )}
          </div>

          {/* Right: Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Sort — ALL MD style custom dropdown */}
            <div ref={sortDropdownRef} style={{ position: 'relative' }}>
              {/* Trigger */}
              <button
                type="button"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  outline: 'none',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{sortLabels[activeSort]}</span>
                <ChevronDown size={11} style={{ opacity: 0.6, transform: sortDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
              </button>

              {/* Sort Panel — ALL MD style */}
              {sortDropdownOpen && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 40, backgroundColor: 'transparent' }}
                    onClick={() => setSortDropdownOpen(false)}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      marginTop: '8px',
                      minWidth: '160px',
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #000000',
                      borderRadius: '0px',
                      padding: '18px 20px',
                      boxShadow: '0 16px 36px rgba(0,0,0,0.15)',
                      zIndex: 50,
                    }}
                  >
                    {/* Caret */}
                    <div style={{ position: 'absolute', top: '-8px', right: '24px', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '8px solid #000000', zIndex: 51 }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(['popular', 'newest', 'price-asc', 'price-desc'] as const).map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => { setActiveSort(val); setSortDropdownOpen(false); }}
                          style={{
                            textAlign: 'left',
                            fontWeight: activeSort === val ? 900 : 800,
                            fontSize: '13px',
                            color: '#000000',
                            textTransform: 'uppercase',
                            letterSpacing: '0.03em',
                            background: 'none',
                            border: 'none',
                            padding: '2px 0',
                            cursor: 'pointer',
                            transition: 'color 0.15s ease',
                            display: 'block',
                            width: '100%',
                            textDecoration: activeSort === val ? 'underline' : 'none',
                            textDecorationThickness: '2px',
                          }}
                          className="hover:text-slate-500"
                        >
                          {sortLabels[val]}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>



        {/* ==================== 3. Active Filters Indicator Pill Row ==================== */}
        {(activeArtist !== 'all' || activeType !== 'all') && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Filters:</span>
            {activeArtist !== 'all' && (
              <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span>{selectedArtistObj?.name || activeArtist}</span>
                <button 
                  onClick={() => handleArtistChange('all')}
                  className="hover:text-slate-300 cursor-pointer"
                  type="button"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {activeType !== 'all' && (
              <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span>{activeType}</span>
                <button 
                  onClick={() => setActiveType('all')}
                  className="hover:text-slate-300 cursor-pointer"
                  type="button"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* ==================== 4. Product Showcase Grid (2 Columns on Mobile, 4 on Desktop) ==================== */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-7">
          {filteredAlbums.map((album) => {
            const isFav = isWishlisted(album.id);
            const isCurrentPlaying = isPlaying && currentAlbum?.id === album.id;

            return (
              <div
                key={album.id}
                onClick={() => onSelectAlbum(album)}
                className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 p-2.5 sm:p-4 flex flex-col justify-between hover:shadow-xl hover:border-black hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
              >
                {/* 1. Cover Artwork Container */}
                <div>
                  <div className="relative w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-slate-100 mb-2 sm:mb-3.5 shadow-xs">
                    {/* Full Color Album Art with Gentle Hover Zoom */}
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />

                    {/* Top-Left Tag Pill Badge */}
                    <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-10">
                      <span className="bg-black/85 backdrop-blur-xs text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded sm:rounded-md shadow-xs">
                        {album.tag || 'Official'}
                      </span>
                    </div>

                    {/* Top-Right Wishlist Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(album);
                      }}
                      className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-sm flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                      title="Add to Wishlist"
                      type="button"
                    >
                      <Heart size={13} className={isFav ? 'fill-red-500 text-red-500' : ''} />
                    </button>

                    {/* Audio Playing Pill */}
                    {isCurrentPlaying && (
                      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-10 bg-black text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
                        <Volume2 size={10} className="animate-pulse" />
                        <span>Playing</span>
                      </div>
                    )}

                    {/* Hover Action Overlay: Quick Play Teaser & Details */}
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 sm:gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playTrack(album);
                        }}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-black text-black hover:text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                        title="Listen to Preview"
                        type="button"
                      >
                        <Play size={13} style={{ fill: isCurrentPlaying ? '#ffffff' : 'currentColor' }} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAlbum(album);
                        }}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-black text-black hover:text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                        title="View Details"
                        type="button"
                      >
                        <Eye size={13} />
                      </button>
                    </div>
                  </div>

                  {/* 2. Metadata Section */}
                  <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                    <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 truncate max-w-[70%]">
                      {album.artist}
                    </span>
                    <span className="text-[8px] sm:text-[10px] text-slate-400 font-semibold shrink-0">
                      {album.releaseDate.split('-')[0]}
                    </span>
                  </div>

                  {/* Album Title */}
                  <h4 
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    className="text-xs sm:text-base font-bold text-slate-900 group-hover:text-black line-clamp-1 leading-snug"
                    title={album.title}
                  >
                    {album.title}
                  </h4>

                  {/* Format & Highlights Tag */}
                  <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 line-clamp-1">
                    {album.type} • {album.inclusions?.[0] || 'Sealed Official Copy'}
                  </div>
                </div>

                {/* 3. Bottom Row: Price & Pre-Order Button */}
                <div className="flex items-center justify-between mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-100 gap-1.5">
                  <div className="min-w-0">
                    <div className="text-xs sm:text-base font-black text-slate-900 tracking-tight truncate">
                      {formatPrice(album.priceUSD, album.priceVND)}
                    </div>
                    {album.stock <= 0 ? (
                      <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-red-600 block">
                        Sold Out
                      </span>
                    ) : (
                      <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                        100% Certified
                      </span>
                    )}
                  </div>

                  {/* Direct Action Button on Card */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(album, album.versions[0]?.name);
                    }}
                    disabled={album.stock <= 0}
                    className="bg-black hover:opacity-85 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-full flex items-center gap-1 sm:gap-1.5 transition-opacity disabled:opacity-40 cursor-pointer shadow-xs shrink-0"
                    type="button"
                  >
                    <ShoppingCart size={12} />
                    <span className="hidden min-[420px]:inline">Pre-Order</span>
                    <span className="min-[420px]:hidden">+</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAlbums.length === 0 && (
          <div className="text-center py-20 px-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl mt-8">
            <p 
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-2xl font-bold text-slate-800 italic mb-2"
            >
              No albums match this filter.
            </p>
            <p className="text-xs text-slate-500 mb-6">
              Try resetting your category or artist filter.
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-black hover:opacity-90 text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full cursor-pointer"
              type="button"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
