'use client';

import React, { useState } from 'react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { Trash2, ShoppingCart, Edit3, Check } from 'lucide-react';

export const WishlistModal: React.FC = () => {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist, updateWishlistNote, addToCart, formatPrice } = useCartWishlist();
  
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  if (!isWishlistOpen) return null;

  const handleStartEditNote = (albumId: string, currentNote?: string) => {
    setEditingNoteId(albumId);
    setTempNote(currentNote || '');
  };

  const handleSaveNote = (albumId: string) => {
    updateWishlistNote(albumId, tempNote);
    setEditingNoteId(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
      <div 
        style={{ borderRadius: '0px' }}
        className="bg-white max-w-lg w-full max-h-[85vh] flex flex-col shadow-[8px_8px_0px_#000000] border-3 border-black overflow-hidden"
      >
        
        {/* Header Bar */}
        <div className="px-5 py-3 border-b-3 border-black flex items-center justify-between bg-[#ffd60a] select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#ff2e93] border border-black" />
            <h3 className="text-sm font-black text-black uppercase tracking-wider">
              ★ COLLECTOR WISHLIST &amp; NOTES
            </h3>
            <span className="text-[11px] font-black px-2 py-0.5 bg-[#ff2e93] text-white border border-black shadow-[1px_1px_0px_#000]">
              {wishlist.length} SAVED
            </span>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            style={{ borderRadius: '0px' }}
            className="px-2 py-0.5 bg-white text-black hover:bg-[#ff2e93] hover:text-white border-2 border-black text-xs font-black cursor-pointer shadow-[1px_1px_0px_#000] transition-colors"
            type="button"
          >
            [✕]
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 bg-[#fdfbf7]">
          {wishlist.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 space-y-3 font-mono">
              <div className="text-4xl">💖</div>
              <p className="text-xs font-bold uppercase">YOUR WISHLIST IS EMPTY.</p>
              <p className="text-[11px] text-neutral-400">Bookmark dream albums and photocard wishlist from the catalog!</p>
            </div>
          ) : (
            wishlist.map(({ album, note }) => (
              <div
                key={album.id}
                style={{ borderRadius: '0px' }}
                className="p-4 bg-white border-2 border-black space-y-3 shadow-[3px_3px_0px_#000]"
              >
                <div className="flex gap-3">
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    style={{ borderRadius: '0px', width: '64px', height: '64px' }}
                    className="object-cover border-2 border-black shrink-0 shadow-[2px_2px_0px_#000]"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-black text-black truncate uppercase font-sans">
                        {album.title}
                      </h4>
                      <button
                        onClick={() => toggleWishlist(album)}
                        className="text-neutral-400 hover:text-[#ff2e93] transition-colors cursor-pointer"
                        title="Remove from wishlist"
                        type="button"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] font-bold text-neutral-700">{album.artist}</p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-black text-[#ff2e93]">
                        {formatPrice(album.priceUSD, album.priceVND)}
                      </span>

                      <button
                        onClick={() => {
                          addToCart(album, album.versions[0]?.name);
                          toggleWishlist(album);
                        }}
                        style={{ borderRadius: '0px' }}
                        className="px-3 py-1.5 bg-[#ffd60a] hover:bg-[#ff2e93] hover:text-white text-black text-[11px] font-black uppercase flex items-center gap-1.5 transition-colors cursor-pointer border-2 border-black shadow-[2px_2px_0px_#000]"
                        type="button"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>MOVE TO BAG</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Personal Fandom Collector Note */}
                <div className="pt-2 border-t border-black/20">
                  {editingNoteId === album.id ? (
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={tempNote}
                        onChange={(e) => setTempNote(e.target.value)}
                        placeholder="Add personal note (e.g. Need Haerin photocard)..."
                        style={{ borderRadius: '0px' }}
                        className="flex-1 text-xs p-1.5 bg-white border-2 border-black focus:outline-none focus:border-[#ff2e93]"
                      />
                      <button
                        onClick={() => handleSaveNote(album.id)}
                        style={{ borderRadius: '0px' }}
                        className="px-3 py-1 bg-[#ff2e93] text-white text-xs font-black uppercase flex items-center gap-1 cursor-pointer border-2 border-black shadow-[2px_2px_0px_#000]"
                        type="button"
                      >
                        <Check className="w-3 h-3" />
                        <span>SAVE</span>
                      </button>
                    </div>
                  ) : (
                    <div 
                      style={{ borderRadius: '0px' }}
                      className="flex items-center justify-between text-[11px] text-black bg-[#ecfeff] p-2 border-2 border-black font-mono shadow-[1px_1px_0px_#000]"
                    >
                      <span className="truncate font-semibold">
                        {note ? `📝 NOTE: "${note}"` : 'NO CUSTOM NOTE ADDED'}
                      </span>
                      <button
                        onClick={() => handleStartEditNote(album.id, note)}
                        className="font-black text-[#ff2e93] hover:underline flex items-center gap-0.5 ml-2 shrink-0 cursor-pointer"
                        type="button"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{note ? '[EDIT]' : '[+ NOTE]'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

