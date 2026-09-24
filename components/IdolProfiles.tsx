'use client';

import React from 'react';
import { mockArtists } from '../data/mockData';
import { Sparkles, Disc } from 'lucide-react';

interface IdolProfilesProps {
  onSelectArtist: (artistId: string) => void;
}

export const IdolProfiles: React.FC<IdolProfilesProps> = ({ onSelectArtist }) => {
  return (
    <section id="artists" className="py-14 px-4 lg:px-8 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div 
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1"
            style={{ backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '8px' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Fandom Universe Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Featured Artists, Anime & Gaming Franchises
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Get closer to your favorite idols and universes. Explore key characters, fandom lore, and catalog collections.
          </p>
        </div>

        {/* Idol Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockArtists.map((artist) => {
            return (
              <div
                key={artist.id}
                className="bg-white overflow-hidden flex flex-col justify-between border border-slate-200 shadow-sm hover:shadow-md transition-all"
                style={{ borderRadius: '8px' }}
              >
                {/* Banner & Avatar */}
                <div className="relative w-full h-32 bg-slate-800 overflow-hidden" style={{ minHeight: '130px' }}>
                  <img
                    src={artist.bannerImage}
                    alt={artist.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(15, 23, 42, 0.45)'
                    }} 
                  />
                  
                  <div className="absolute bottom-2 left-4 flex items-end gap-3 z-10">
                    <div 
                      className="overflow-hidden border-2 border-white shadow-md bg-slate-200 shrink-0"
                      style={{ width: '64px', height: '64px', borderRadius: '8px' }}
                    >
                      <img
                        src={artist.image}
                        alt={artist.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{artist.name}</span>
                          <span className="text-xs text-slate-400 font-normal">({artist.koreanName})</span>
                        </h3>
                        <p className="text-xs font-semibold" style={{ color: '#0284c7' }}>{artist.agency}</p>
                      </div>
                      <span 
                        className="text-[11px] font-bold px-2 py-0.5"
                        style={{ backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '8px' }}
                      >
                        {artist.totalAlbums} Albums
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                      {artist.bio}
                    </p>

                    {/* Metadata Badges */}
                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Fandom:</span>
                        <span className="font-bold" style={{ color: '#0284c7' }}>{artist.fandomName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Debut Year:</span>
                        <span className="font-bold text-slate-700">{artist.debutYear}</span>
                      </div>
                    </div>

                    {/* Members List */}
                    <div className="mt-3">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Members:</span>
                      <div className="flex flex-wrap gap-1">
                        {artist.members.map((m) => (
                          <span
                            key={m}
                            className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Filter albums by this artist */}
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => onSelectArtist(artist.id)}
                      className="w-full py-2 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      style={{ backgroundColor: '#0284c7', borderRadius: '8px' }}
                      type="button"
                    >
                      <Disc className="w-3.5 h-3.5" />
                      <span>Explore Discography</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
