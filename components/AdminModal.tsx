'use client';

import React, { useState } from 'react';
import { mockAlbums } from '../data/mockData';
import { Album } from '../types';
import { ShieldCheck, X, TrendingUp, Users, ShoppingBag, MessageSquare, Plus, Trash2 } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [albums, setAlbums] = useState<Album[]>(mockAlbums);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('NewJeans');
  const [newPrice, setNewPrice] = useState(25);
  const [newStock, setNewStock] = useState(50);
  const [newTag, setNewTag] = useState<Album['tag']>('Pre-Order');

  if (!isOpen) return null;

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Album = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      artist: newArtist,
      artistId: newArtist.toLowerCase().replace(/\s+/g, ''),
      priceUSD: newPrice,
      priceVND: newPrice * 25000,
      coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80',
      galleryImages: [],
      type: 'Mini Album',
      releaseDate: new Date().toISOString().split('T')[0],
      tag: newTag,
      rating: 5.0,
      reviewCount: 1,
      popularityScore: 90,
      stock: newStock,
      description: `Official first-press release of ${newTitle} by ${newArtist}.`,
      versions: [{ id: 'std', name: 'Standard Edition', extraPriceUSD: 0 }],
      inclusions: ['Photobook', 'Photocard (1 of 4)', 'CD-R'],
      photocards: [],
      tracks: [{ id: 1, title: 'Title Track Comeback', duration: '3:15', isTitleTrack: true }],
      reviews: [],
    };

    setAlbums([created, ...albums]);
    setNewTitle('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setAlbums((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        style={{ borderRadius: '8px' }}
      >

        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-base font-bold">Fan Hub Plus Admin Control Center</h2>
              <p className="text-[11px] text-slate-300">Catalog drops, stock levels, and real-time sales telemetry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              className="p-3.5 border"
              style={{ backgroundColor: '#fafafa', borderColor: '#d4d4d4', borderRadius: '8px' }}
            >
              <div className="flex items-center gap-1.5 mb-1" style={{ color: '#000000' }}>
                <Users className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase">Active Fandom Members</span>
              </div>
              <div className="text-xl font-black text-slate-800">142,850</div>
              <div className="text-[10px] text-emerald-600 font-semibold">↑ +14.2% this week</div>
            </div>

            <div
              className="p-3.5 border"
              style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderRadius: '8px' }}
            >
              <div className="flex items-center gap-1.5 mb-1 text-slate-700">
                <ShoppingBag className="w-4 h-4 text-sky-600" />
                <span className="text-[11px] font-bold uppercase">Total Pre-Orders</span>
              </div>
              <div className="text-xl font-black text-slate-800">38,420</div>
              <div className="text-[10px] text-emerald-600 font-semibold">100% Hanteo synced</div>
            </div>

            <div
              className="p-3.5 border"
              style={{ backgroundColor: '#fafafa', borderColor: '#d4d4d4', borderRadius: '8px' }}
            >
              <div className="flex items-center gap-1.5 mb-1" style={{ color: '#000000' }}>
                <TrendingUp className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase">Global Page Views</span>
              </div>
              <div className="text-xl font-black text-slate-800">1.28M</div>
              <div className="text-[10px] text-slate-400 font-medium">Seoul & Global hubs</div>
            </div>

            <div
              className="p-3.5 border"
              style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0', borderRadius: '8px' }}
            >
              <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                <MessageSquare className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase">AI Queries Handled</span>
              </div>
              <div className="text-xl font-black text-slate-800">19,530</div>
              <div className="text-[10px] text-emerald-600 font-semibold">98.4% satisfaction</div>
            </div>
          </div>

          {/* Catalog Management Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800">
                Manage Album Releases & Drops
              </h3>
              <button
                onClick={() => setIsAdding(!isAdding)}
                className="px-3 py-1.5 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                style={{ backgroundColor: '#000000', borderRadius: '8px' }}
                type="button"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Album</span>
              </button>
            </div>

            {/* Add New Album Form */}
            {isAdding && (
              <form onSubmit={handleAddNew} className="bg-slate-50 p-4 border border-slate-200 mb-4 space-y-3" style={{ borderRadius: '8px' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Album Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Supernatural (Single)"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-200 focus:outline-none"
                      style={{ borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Artist</label>
                    <select
                      value={newArtist}
                      onChange={(e) => setNewArtist(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-200 focus:outline-none"
                      style={{ borderRadius: '8px' }}
                    >
                      <option value="NewJeans">NewJeans</option>
                      <option value="BLACKPINK">BLACKPINK</option>
                      <option value="BTS">BTS</option>
                      <option value="Stray Kids">Stray Kids</option>
                      <option value="IVE">IVE</option>
                      <option value="aespa">aespa</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Price ($ USD)</label>
                    <input
                      type="number"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full text-xs p-2 bg-white border border-slate-200 focus:outline-none"
                      style={{ borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Tag</label>
                    <select
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value as any)}
                      className="w-full text-xs p-2 bg-white border border-slate-200 focus:outline-none"
                      style={{ borderRadius: '8px' }}
                    >
                      <option value="Pre-Order">Pre-Order</option>
                      <option value="Limited Edition">Limited Edition</option>
                      <option value="Hot Seller">Hot Seller</option>
                      <option value="Restocked">Restocked</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
                    style={{ borderRadius: '8px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-white text-xs font-bold cursor-pointer"
                    style={{ backgroundColor: '#000000', borderRadius: '8px' }}
                  >
                    Save Album to Catalog
                  </button>
                </div>
              </form>
            )}

            {/* Inventory Table */}
            <div className="overflow-x-auto border border-slate-200" style={{ borderRadius: '8px' }}>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Album Title</th>
                    <th className="py-2.5 px-3">Artist</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">Stock Remaining</th>
                    <th className="py-2.5 px-3">Status Tag</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {albums.map((alb) => (
                    <tr key={alb.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {alb.title}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-sky-700">
                        {alb.artist}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        ${alb.priceUSD.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-emerald-600">
                          {alb.stock} units
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#f4f4f5', color: '#1c1c1c' }}
                        >
                          {alb.tag}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleDelete(alb.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Delete album"
                          type="button"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
