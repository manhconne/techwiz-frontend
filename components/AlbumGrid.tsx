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
  Disc
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

  const filteredAlbums = useMemo(() => {
    return mockAlbums.filter((album) => {
      if (activeArtist !== 'all' && album.artistId !== activeArtist) return false;
      if (activeType !== 'all' && album.type !== activeType) return false;
      if (inStockOnly && album.stock <= 0) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = album.title.toLowerCase().includes(query);
        const matchesArtist = album.artist.toLowerCase().includes(query);
        const matchesType = album.type.toLowerCase().includes(query);
        if (!matchesTitle && !matchesArtist && !matchesType) return false;
      }

      return true;
    }).sort((a, b) => {
      if (activeSort === 'popular') return b.popularityScore - a.popularityScore;
      if (activeSort === 'newest') return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      if (activeSort === 'price-asc') return a.priceUSD - b.priceUSD;
      if (activeSort === 'price-desc') return b.priceUSD - a.priceUSD;
      return 0;
    });
  }, [activeArtist, activeType, activeSort, inStockOnly, searchQuery]);

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
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#0284c7' }}>
            <Disc className="w-4 h-4 text-sky-600" />
            <span>Fan Hub Plus Discography</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Official K-Pop Album Drops
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Explore official comeback albums, lightsticks, and collector kits certified on Hanteo & Circle Charts.
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Sort by:</span>
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value as any)}
            className="text-xs font-bold bg-white border border-slate-200 px-3 py-2 text-slate-700 focus:outline-none shadow-xs cursor-pointer"
            style={{ borderRadius: '8px' }}
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest Release</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs by Artist - Clean Solid Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none flex-wrap">
        <button
          onClick={() => handleArtistChange('all')}
          className="px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer"
          style={{
            backgroundColor: activeArtist === 'all' ? '#0284c7' : '#ffffff',
            color: activeArtist === 'all' ? '#ffffff' : '#334155',
            border: activeArtist === 'all' ? '1px solid #0284c7' : '1px solid #e2e8f0',
            borderRadius: '8px',
          }}
          type="button"
        >
          All Artists
        </button>
        {mockArtists.map((artist) => (
          <button
            key={artist.id}
            onClick={() => handleArtistChange(artist.id)}
            className="px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer"
            style={{
              backgroundColor: activeArtist === artist.id ? '#0284c7' : '#ffffff',
              color: activeArtist === artist.id ? '#ffffff' : '#334155',
              border: activeArtist === artist.id ? '1px solid #0284c7' : '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
            type="button"
          >
            {artist.name}
          </button>
        ))}
      </div>

      {/* Secondary Sub-filters */}
      <div 
        className="flex flex-wrap items-center justify-between gap-3 mb-8 p-3 border border-slate-200"
        style={{ backgroundColor: '#f0f9ff', borderColor: '#e0f2fe', borderRadius: '8px' }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-sky-600" /> Type:
          </span>
          {['all', 'Full Album', 'Mini Album', 'Limited Kit', 'Lightstick'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className="px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer"
              style={{
                backgroundColor: activeType === type ? '#0284c7' : '#ffffff',
                color: activeType === type ? '#ffffff' : '#334155',
                border: activeType === type ? '1px solid #0284c7' : '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
              type="button"
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: '#0284c7' }}
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* Album Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAlbums.map((album) => {
          const isFav = isWishlisted(album.id);
          const isThisPlaying = isPlaying && currentAlbum?.id === album.id;

          return (
            <div
              key={album.id}
              className="group flex flex-col justify-between overflow-hidden relative border border-slate-200 shadow-sm hover:shadow-md transition-all"
              style={{ minHeight: '430px', backgroundColor: '#ffffff', borderRadius: '8px' }}
            >
              {/* Album Cover Container */}
              <div 
                className="relative overflow-hidden bg-slate-100 cursor-pointer"
                style={{ height: '260px', width: '100%' }}
                onClick={() => onSelectAlbum(album)}
              >
                <img
                  src={album.coverImage}
                  alt={album.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />

                {/* Promo Tag */}
                <div className="absolute top-3 left-3 z-10">
                  <span className={`kpop-badge ${getTagClass(album.tag)} shadow-xs`}>
                    {album.tag}
                  </span>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(album);
                  }}
                  className="absolute top-3 right-3 z-10 flex items-center justify-center transition-all shadow-xs cursor-pointer"
                  style={{
                    backgroundColor: isFav ? '#0284c7' : 'rgba(255, 255, 255, 0.95)',
                    color: isFav ? '#ffffff' : '#334155',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                  }}
                  title="Wishlist"
                  type="button"
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                </button>

                {/* Audio Play Overlay Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playTrack(album);
                  }}
                  className="absolute bottom-3 left-3 z-10 px-2.5 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs text-white"
                  style={{
                    backgroundColor: isThisPlaying ? '#0284c7' : 'rgba(15, 23, 42, 0.85)',
                    borderRadius: '8px',
                  }}
                  title="Play Teaser"
                  type="button"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isThisPlaying ? 'Playing' : 'Teaser'}</span>
                </button>

                {/* Quick Detail View Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAlbum(album);
                  }}
                  className="absolute bottom-3 right-3 z-10 bg-white text-slate-700 flex items-center justify-center shadow-xs cursor-pointer"
                  style={{ borderRadius: '8px', width: '32px', height: '32px' }}
                  title="Quick View"
                  type="button"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Content Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-bold text-sky-700 uppercase tracking-wider text-[11px]">
                      {album.artist}
                    </span>
                    <span className="text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">
                      {album.type}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectAlbum(album)}
                    className="font-bold text-slate-900 text-sm hover:text-sky-600 cursor-pointer line-clamp-1 transition-colors"
                    title={album.title}
                  >
                    {album.title}
                  </h3>

                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{album.rating}</span>
                    <span className="text-[11px] text-slate-400">({album.reviewCount})</span>
                  </div>

                  <p 
                    className="text-[11px] text-slate-600 mt-2 p-1.5 rounded border"
                    style={{ backgroundColor: '#f0f9ff', borderColor: '#e0f2fe' }}
                  >
                    🎁 First-press photocard + POB included
                  </p>
                </div>

                {/* Price & Add to Cart */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-base font-extrabold" style={{ color: '#0284c7' }}>
                      {formatPrice(album.priceUSD, album.priceVND)}
                    </div>
                    <div className="text-[10px]">
                      {album.stock > 0 ? (
                        <span className="text-emerald-600 font-semibold">● In Stock ({album.stock})</span>
                      ) : (
                        <span className="text-red-500 font-semibold">● Out of Stock</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(album, album.versions[0]?.name)}
                    disabled={album.stock <= 0}
                    className="px-3.5 py-2 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                    style={{
                      backgroundColor: '#0284c7',
                      borderRadius: '8px',
                    }}
                    type="button"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
