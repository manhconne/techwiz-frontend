'use client';

import React, { useState } from 'react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { Heart, X, Trash2, ShoppingCart, Edit3, Check } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        style={{ borderRadius: '8px' }}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-sky-600 fill-current" />
            <h3 className="text-base font-bold text-slate-800">
              Collector Wishlist
            </h3>
            <span 
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#f4f4f5', color: '#1c1c1c' }}
            >
              {wishlist.length}
            </span>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {wishlist.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <Heart className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
              <p className="text-xs max-w-xs mx-auto leading-relaxed">
                Your wishlist is empty. Bookmark your dream albums and photocards!
              </p>
            </div>
          ) : (
            wishlist.map(({ album, note }) => (
              <div
                key={album.id}
                className="p-3.5 bg-slate-50 border border-slate-200 space-y-2.5"
                style={{ borderRadius: '8px' }}
              >
                <div className="flex gap-3">
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    className="object-cover border border-slate-200 shrink-0"
                    style={{ width: '56px', height: '56px', borderRadius: '8px' }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {album.title}
                      </h4>
                      <button
                        onClick={() => toggleWishlist(album)}
                        className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remove from wishlist"
                        type="button"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] font-semibold" style={{ color: '#000000' }}>{album.artist}</p>

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-extrabold text-slate-900">
                        {formatPrice(album.priceUSD, album.priceVND)}
                      </span>

                      <button
                        onClick={() => {
                          addToCart(album, album.versions[0]?.name);
                          toggleWishlist(album);
                        }}
                        className="px-2.5 py-1 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        style={{ backgroundColor: '#000000', borderRadius: '8px' }}
                        type="button"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Personal Fandom Collector Note */}
                <div className="pt-2 border-t border-slate-200">
                  {editingNoteId === album.id ? (
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={tempNote}
                        onChange={(e) => setTempNote(e.target.value)}
                        placeholder="Add personal note (e.g. Need Haerin photocard)..."
                        className="flex-1 text-xs p-1.5 bg-white border border-sky-300 focus:outline-none"
                        style={{ borderRadius: '8px' }}
                      />
                      <button
                        onClick={() => handleSaveNote(album.id)}
                        className="px-2.5 py-1 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                        style={{ backgroundColor: '#000000', borderRadius: '8px' }}
                        type="button"
                      >
                        <Check className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[11px] text-slate-500 bg-white p-2 border border-slate-100" style={{ borderRadius: '8px' }}>
                      <span className="italic truncate">
                        {note ? `📝 Note: "${note}"` : 'No custom note added'}
                      </span>
                      <button
                        onClick={() => handleStartEditNote(album.id, note)}
                        className="hover:underline flex items-center gap-0.5 ml-2 shrink-0 font-semibold cursor-pointer"
                        style={{ color: '#000000' }}
                        type="button"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{note ? 'Edit' : 'Add Note'}</span>
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
