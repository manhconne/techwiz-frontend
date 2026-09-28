'use client';

import React from 'react';
import { MediaType, FandomCategory, MediaItem } from '../../data/multimediaData';

interface MultimediaFilterBarProps {
  selectedFormat: MediaType | 'all';
  selectedUniverse: FandomCategory | 'all';
  searchQuery: string;
  sortBy: 'views' | 'rating' | 'newest' | 'duration';
  mediaList: MediaItem[];
  onSelectFormat: (fmt: MediaType | 'all') => void;
  onSelectUniverse: (cat: FandomCategory | 'all') => void;
  onSearchChange: (q: string) => void;
  onSortChange: (sort: 'views' | 'rating' | 'newest' | 'duration') => void;
}

export const MultimediaFilterBar: React.FC<MultimediaFilterBarProps> = ({
  selectedFormat,
  selectedUniverse,
  searchQuery,
  sortBy,
  mediaList,
  onSelectFormat,
  onSelectUniverse,
  onSearchChange,
  onSortChange,
}) => {
  const formatTabs = [
    { id: 'all' as const, label: 'ALL MEDIA', count: mediaList.length },
    { id: 'trailer' as const, label: 'TRAILERS & MV', count: mediaList.filter((m) => m.type === 'trailer').length },
    { id: 'video' as const, label: 'ORIGINAL SHOWS', count: mediaList.filter((m) => m.type === 'video').length },
    { id: 'podcast' as const, label: 'PODCAST RADIO', count: mediaList.filter((m) => m.type === 'podcast').length },
    { id: 'livestream' as const, label: 'LIVESTREAMS', count: mediaList.filter((m) => m.type === 'livestream').length },
    { id: 'soundtrack' as const, label: 'SOUNDTRACK OST', count: mediaList.filter((m) => m.type === 'soundtrack').length },
  ];

  const universeChips: { id: FandomCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'ALL SECTORS' },
    { id: 'Gaming', label: 'GAMING ARENA' },
    { id: 'Manga', label: 'MANGA GUILD' },
    { id: 'Anime', label: 'SAKUGA ANIME' },
    { id: 'Cosplay', label: 'COSPLAY ATELIER' },
    { id: 'Comics', label: 'COMICS' },
    { id: 'Cinema', label: 'CINEMA 70MM' },
    { id: 'TV Shows', label: 'TV SHOWS' },
    { id: 'K-Pop', label: 'K-POP' },
    { id: 'V-Pop', label: 'V-POP' },
  ];

  return (
    <div className="flex flex-col gap-8 sm:gap-10 font-mono text-xs">
      {/* Section Divider with Accent */}
      <div className="flex items-center gap-3 pb-4 border-b-4 border-black dark:border-[#2a364f]">
        <span className="w-3 h-3 bg-[#ff2e93] border-2 border-black dark:border-[#2a364f]" />
        <span className="w-10 h-[3px] bg-[#00f0ff]" />
        <span className="w-3 h-3 bg-[#ffd60a] border-2 border-black dark:border-[#2a364f]" />
        <span className="font-mono font-black uppercase tracking-widest text-black dark:text-[#f8fafc] text-[11px]">
          MULTI-FORMAT FILTER CONTROL STATION
        </span>
      </div>

      {/* 1. Format Tabs Bar */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {formatTabs.map((tab) => {
          const isActive = selectedFormat === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectFormat(tab.id)}
              style={{ borderRadius: '0px' }}
              className={`px-4 py-2.5 font-mono text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border-2 border-black dark:border-[#334155] ${
                isActive
                  ? 'bg-[#ff2e93] text-white shadow-[3px_3px_0px_#000000] dark:shadow-none translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-white text-black hover:bg-[#fefce8] dark:bg-[#1e293b] dark:text-[#f8fafc] dark:hover:bg-[#2a364f] shadow-[2px_2px_0px_#000000] dark:shadow-none'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-2 px-1.5 py-0.2 border border-black dark:border-[#334155] text-[10px] ${
                isActive ? 'bg-black text-[#ffd60a] dark:bg-black dark:text-[#ffd60a]' : 'bg-[#ffd60a] text-black'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Universe Category Pills & Search Bar */}
      <div 
        style={{ borderRadius: '0px' }}
        className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 sm:p-5 border-2 border-black dark:border-[#2a364f] bg-white text-black dark:bg-[#131b2e] dark:text-[#f8fafc] shadow-[4px_4px_0px_#000000] dark:shadow-none"
      >
        {/* Sector Universe Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="font-mono font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mr-1 text-[11px]">
            SECTOR //
          </span>
          {universeChips.map((uni) => {
            const isActive = selectedUniverse === uni.id;
            return (
              <button
                key={uni.id}
                type="button"
                onClick={() => onSelectUniverse(uni.id)}
                style={{ borderRadius: '0px' }}
                className={`px-3 py-1 font-mono text-[11px] font-black uppercase tracking-wider cursor-pointer border-2 transition-all ${
                  isActive
                    ? 'bg-black text-[#ffd60a] border-black dark:border-[#ffd60a] shadow-[2px_2px_0px_#000000] dark:shadow-none'
                    : 'bg-white text-black border-neutral-300 hover:border-black hover:bg-[#fefce8] dark:bg-[#1e293b] dark:text-[#f8fafc] dark:border-[#334155] dark:hover:bg-[#2a364f]'
                }`}
              >
                {uni.label}
              </button>
            );
          })}
        </div>

        {/* Search Input & Sort Dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="[//] SEARCH ARCHIVE..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ borderRadius: '0px' }}
              aria-label="Search multimedia archive"
              className="w-full px-3 py-1.5 border-2 border-black dark:border-[#334155] text-xs font-mono font-bold uppercase bg-white dark:bg-[#0f172a] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff2e93] shadow-[2px_2px_0px_#000000] dark:shadow-none"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            style={{ borderRadius: '0px' }}
            aria-label="Sort multimedia clips"
            className="border-2 border-black dark:border-[#334155] bg-white dark:bg-[#0f172a] text-black dark:text-white px-3 py-1.5 text-xs font-mono font-black uppercase cursor-pointer focus:outline-none shadow-[2px_2px_0px_#000000] dark:shadow-none hover:bg-[#fefce8] dark:hover:bg-[#1e293b]"
          >
            <option value="views">MOST VIEWED</option>
            <option value="rating">HIGHEST RATED</option>
            <option value="duration">LONGEST PLAY</option>
          </select>
        </div>
      </div>
    </div>
  );
};
