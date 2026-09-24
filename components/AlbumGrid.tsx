'use client';

import React, { useState, useMemo } from 'react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { usePlayer } from '../context/PlayerContext';
import { mockAlbums, mockArtists } from '../data/mockData';
import { Album } from '../types';
import { 
  Heart, 
  ShoppingCart, 
  Play, 
  Star, 
  Filter, 
  Eye, 
  Disc,
  Sparkles
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

  const filteredArtists = useMemo(() => {
    if (activeCategory === 'all') return mockArtists;
    return mockArtists.filter((artist) => artist.category === activeCategory);
  }, [activeCategory]);

  const filteredAlbums = useMemo(() => {
    return mockAlbums.filter((album) => {
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
  }, [activeCategory, activeArtist, activeType, activeSort, inStockOnly, searchQuery]);

  const getTagClass = (tag: Album['tag']) => {
    switch (tag) {
      case 'Limited Edition':
        return 'badge-limited';
      case 'Pre-Order':
        return 'badge-preorder';
      case 'Hot Seller':
        return 'badge-hot';
      case 'Collector Special':
        return 'badge-collector';
      case 'Restocked':
        return 'badge-restocked';
      default:
        return 'badge-limited';
    }
  };

  return (
    <section id="albums" className="py-12 px-4 lg:px-8 max-w-7xl mx-auto">
      
      {/* Frameless Modern Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Official Merch & Catalog
            </h2>
            <span 
              className="px-2.5 py-0.5 text-xs font-extrabold rounded-full"
              style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}
            >
              {filteredAlbums.length} Items
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Official K-Pop comeback albums, Anime soundtracks, Movie OST vinyls, and Gaming drops.
          </p>
        </div>

        {/* Controls: Sort & Stock Toggle */}
        <div className="flex items-center gap-4 self-start sm:self-auto">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              style={{ width: '15px', height: '15px', accentColor: '#0284c7' }}
            />
            <span>In Stock Only</span>
          </label>

          <span className="text-slate-300">|</span>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400">Sort:</span>
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value as any)}
              className="text-xs font-bold bg-transparent border border-slate-200 px-2.5 py-1 text-slate-700 focus:outline-none cursor-pointer"
              style={{ borderRadius: '6px' }}
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest Release</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Category Tabs (No Card Background, Underline Navigation) */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 mb-4 scrollbar-none">
        {[
          { id: 'all', label: 'All Universes' },
          { id: 'K-Pop', label: 'K-Pop' },
          { id: 'Anime', label: 'Anime' },
          { id: 'Movie', label: 'Cinema & OST' },
          { id: 'Gaming', label: 'Gaming & OST' },
        ].map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className="px-4 py-2.5 text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap relative"
              style={{
                color: isActive ? '#0284c7' : '#64748b',
                borderBottom: isActive ? '2px solid #0284c7' : '2px solid transparent',
              }}
              type="button"
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Artist & Franchise Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none flex-wrap">
        <button
          onClick={() => handleArtistChange('all')}
          className="px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer"
          style={{
            backgroundColor: activeArtist === 'all' ? '#0f172a' : '#f1f5f9',
            color: activeArtist === 'all' ? '#ffffff' : '#475569',
            borderRadius: '9999px',
          }}
          type="button"
        >
          All Artists
        </button>
        {filteredArtists.map((artist) => (
          <button
            key={artist.id}
            onClick={() => handleArtistChange(artist.id)}
            className="px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer"
            style={{
              backgroundColor: activeArtist === artist.id ? '#0f172a' : '#f1f5f9',
              color: activeArtist === artist.id ? '#ffffff' : '#475569',
              borderRadius: '9999px',
            }}
            type="button"
          >
            {artist.name}
          </button>
        ))}
      </div>

      {/* Sub-types Row */}
      <div className="flex flex-wrap items-center gap-1.5 pb-2 mb-8">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3 text-sky-600" /> Formats:
        </span>
        {['all', 'Full Album', 'Mini Album', 'OST & Vinyl', 'Collector Box', 'Limited Kit', 'Lightstick'].map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className="px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer"
            style={{
              backgroundColor: activeType === type ? '#e0f2fe' : '#ffffff',
              color: activeType === type ? '#0284c7' : '#64748b',
              border: activeType === type ? '1px solid #bae6fd' : '1px solid #e2e8f0',
              borderRadius: '6px',
            }}
            type="button"
          >
            {type === 'all' ? 'All Types' : type}
          </button>
        ))}
      </div>

      {/* Album Cards Grid - Clean Unboxed Layout matching reference screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
        {filteredAlbums.map((album) => {
          const isFav = isWishlisted(album.id);

          return (
            <div
              key={album.id}
              className="group flex flex-col justify-between cursor-pointer transition-all"
              onClick={() => onSelectAlbum(album)}
            >
              {/* Cover Image Box with Rounded Corners & Hover Action Buttons */}
              <div 
                className="relative overflow-hidden w-full aspect-square mb-3 shadow-xs hover:shadow-md transition-all"
                style={{ borderRadius: '16px', backgroundColor: '#f8fafc' }}
              >
                <img
                  src={album.coverImage}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Wishlist Button Top-Right */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(album);
                  }}
                  className="absolute top-3 right-3 z-10 flex items-center justify-center transition-all shadow-xs cursor-pointer"
                  style={{
                    backgroundColor: isFav ? '#0284c7' : 'rgba(255, 255, 255, 0.92)',
                    color: isFav ? '#ffffff' : '#334155',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                  }}
                  title="Wishlist"
                  type="button"
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                </button>

                {/* Hover Circle Buttons (Add to cart, Play Teaser, Quick view) */}
                <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 gap-2.5 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(album, album.versions[0]?.name);
                    }}
                    disabled={album.stock <= 0}
                    className="w-9 h-9 rounded-full bg-white hover:bg-sky-600 text-slate-800 hover:text-white flex items-center justify-center shadow-md transition-all cursor-pointer disabled:opacity-50"
                    title="Add to Cart"
                    type="button"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playTrack(album);
                    }}
                    className="w-9 h-9 rounded-full bg-white hover:bg-sky-600 text-slate-800 hover:text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                    title="Play Teaser"
                    type="button"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAlbum(album);
                    }}
                    className="w-9 h-9 rounded-full bg-white hover:bg-sky-600 text-slate-800 hover:text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                    title="Quick Details"
                    type="button"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Text Meta Under Cover (Title, Release Date, Price, Badges) */}
              <div className="flex flex-col gap-1 px-0.5">
                {/* Title Line */}
                <h3 
                  className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-sky-600 transition-colors uppercase"
                  title={album.title}
                >
                  {album.artist} - {album.title}
                </h3>

                {/* Release Date Line */}
                <p className="text-[11px] text-slate-400 font-medium">
                  release date : {album.releaseDate ? album.releaseDate.replaceAll('-', '.') : '2026.11.02'}
                </p>

                {/* Price Line */}
                <div className="text-base font-extrabold text-slate-900 mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  {formatPrice(album.priceUSD, album.priceVND)}
                </div>

                {/* Bottom Status Tags */}
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-black uppercase text-purple-600 tracking-wider">NEW</span>
                  <span className="text-xs font-black uppercase text-sky-500 tracking-wider">PRE</span>
                  {album.stock <= 0 && (
                    <span className="text-xs font-bold text-red-500 uppercase tracking-wider ml-auto">Sold Out</span>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
