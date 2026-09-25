'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { CartDrawer } from '../../components/CartDrawer';
import { WishlistModal } from '../../components/WishlistModal';
import { ChatbotModal } from '../../components/ChatbotModal';
import { AudioPlayer } from '../../components/AudioPlayer';
import { AdminModal } from '../../components/AdminModal';
import { FeedbackModal } from '../../components/FeedbackModal';
import { Footer } from '../../components/Footer';
import { Album } from '../../types';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  Check, 
  Search, 
  SlidersHorizontal, 
  Flame, 
  ShieldCheck, 
  Radio, 
  Tag, 
  Zap,
  Eye
} from 'lucide-react';

interface MerchItem {
  id: string;
  name: string;
  artist: string;
  category: 'Lightstick' | 'Apparel' | 'Collectibles' | 'Accessories';
  priceUSD: number;
  priceVND: number;
  image: string;
  stock: number;
  badge?: string;
  description: string;
  features: string[];
}

const mockMerchList: MerchItem[] = [
  {
    id: 'md-aespa-ls',
    name: 'aespa Official Lightstick Ver. 2',
    artist: 'aespa',
    category: 'Lightstick',
    priceUSD: 55.0,
    priceVND: 1375000,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    stock: 14,
    badge: 'Synk Bluetooth Sync',
    description: 'Central concert control Bluetooth lightstick with 4 interchangeable ae-Avatar emblem caps and holographic strap.',
    features: ['Bluetooth 5.2 Stadium Pairing', '4 ae-Member Emblems', 'Holographic Wrist Strap'],
  },
  {
    id: 'md-bts-ls',
    name: 'BTS Official Light Stick: MAP OF THE SOUL SPECIAL EDITION',
    artist: 'BTS',
    category: 'Lightstick',
    priceUSD: 62.0,
    priceVND: 1550000,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
    stock: 9,
    badge: 'ARMY Bomb Verified',
    description: 'The iconic stadium lightstick with 5 stage flash modes, seat-pairing technology, and 7 exclusive photo cards.',
    features: ['7 Special Photocard Set', 'Wireless Central Stage Sync', 'Micro USB Rechargeable'],
  },
  {
    id: 'md-nj-ls',
    name: 'NewJeans Official Lightstick (Binky Bong Special Pack)',
    artist: 'NewJeans',
    category: 'Lightstick',
    priceUSD: 52.0,
    priceVND: 1300000,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    stock: 18,
    badge: 'Tokki Limited Edition',
    description: 'Adorable Binky Bong featuring interchangeable colored bunny ears, Y2K retro sticker decals, and canvas pouch.',
    features: ['Interchangeable Bunny Ears', 'Custom Y2K Sticker Sheet', 'Dedicated Canvas Carry Bag'],
  },
  {
    id: 'md-skz-ls',
    name: 'Stray Kids Official Light Stick Ver. 2',
    artist: 'Stray Kids',
    category: 'Lightstick',
    priceUSD: 58.0,
    priceVND: 1450000,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    stock: 11,
    badge: 'Nachimbong OLED',
    description: 'Upgraded Nachimbong with integrated digital OLED compass display screen and custom team rhythm sensor.',
    features: ['Digital OLED Front Screen', 'Custom Compass Gyro Sensor', 'Live Concert Rhythm Mode'],
  },
  {
    id: 'md-bp-ls',
    name: 'BLACKPINK Official Lightstick Ver. 2 Limited Edition',
    artist: 'BLACKPINK',
    category: 'Lightstick',
    priceUSD: 56.0,
    priceVND: 1400000,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    stock: 15,
    badge: 'Pyongbong Sound React',
    description: 'Features soft silicone hammer heads that squeak on impact, reactive audio sound mode, and dual pink glow.',
    features: ['Audio Reaction Mode', 'Soft Squeaking Silicone Heads', 'Adjustable Dimmer Control'],
  },
  {
    id: 'md-nj-hoodie',
    name: 'NewJeans "Get Up" Y2K Heavyweight Tour Hoodie',
    artist: 'NewJeans',
    category: 'Apparel',
    priceUSD: 68.0,
    priceVND: 1700000,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    stock: 22,
    badge: 'Official Tour Apparel',
    description: '450gsm heavyweight brushed cotton fleece hoodie with embroidered Powerpuff bunnies chest patch and raw hems.',
    features: ['450gsm Premium Cotton Fleece', 'Embroidered Chest Patch', 'Custom Metal Aglet Drawstrings'],
  },
  {
    id: 'md-aespa-jacket',
    name: 'aespa "Armageddon" Cyberpunk Reflective Windbreaker',
    artist: 'aespa',
    category: 'Apparel',
    priceUSD: 84.0,
    priceVND: 2100000,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80',
    stock: 8,
    badge: 'Limited Run 500 Pcs',
    description: 'Water-resistant nylon technical jacket with 3M reflective typography and detachable holographic tactical strap.',
    features: ['3M Scotchlite Reflective Ink', 'Waterproof Technical Shell', 'Tactical Modular Keyring'],
  },
  {
    id: 'md-ds-diorama',
    name: 'Demon Slayer Tanjiro & Rengoku Acrylic Flame Diorama',
    artist: 'Anime',
    category: 'Collectibles',
    priceUSD: 34.0,
    priceVND: 850000,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    stock: 20,
    badge: 'ufotable Certified',
    description: 'Multi-layered 3D acrylic display diorama capturing the monumental climax battle with transparent flame effects.',
    features: ['4-Layer Laser Cut Acrylic', 'Gold Foil Embellished Base', 'Original Keyframe Art'],
  },
  {
    id: 'md-op-pass',
    name: 'One Piece Film: Red Uta World Diva Concert Pass & Lanyard',
    artist: 'Anime',
    category: 'Collectibles',
    priceUSD: 22.0,
    priceVND: 550000,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    stock: 35,
    badge: 'Toei Animation Official',
    description: 'Replica metal VIP laminate pass from Elegia concert island with rainbow woven lanyard and Uta music badge.',
    features: ['Solid Metal Core Pass', 'Holographic Front Foil', 'Heavy Woven Neck Lanyard'],
  },
  {
    id: 'md-er-map',
    name: 'Elden Ring Lands Between Heavy Canvas Cloth Map (24x36")',
    artist: 'Gaming',
    category: 'Collectibles',
    priceUSD: 28.0,
    priceVND: 700000,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    stock: 16,
    badge: 'FromSoftware Official',
    description: 'High-definition archival pigment print on weathered canvas fabric showing all Erdtree sites, dungeons, and runes.',
    features: ['100% Archival Canvas Fabric', 'Fray-Resistant Stitching', 'Display Leather Binding Cord'],
  },
  {
    id: 'md-ff-sword',
    name: 'Final Fantasy VII Die-cast Buster Sword Desktop Display',
    artist: 'Gaming',
    category: 'Collectibles',
    priceUSD: 42.0,
    priceVND: 1050000,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    stock: 12,
    badge: 'Square Enix Prop',
    description: 'Precision zinc alloy miniature replica with dual Materia slots, weathering details, and weighted display pediment.',
    features: ['Heavy Zinc Alloy Die-Cast', 'Dual Translucent Materia Gems', 'Solid Slate Display Stand'],
  },
  {
    id: 'md-pc-binder',
    name: 'Fan Hub Plus Holographic Photocard Binder (360 Pockets)',
    artist: 'Accessories',
    category: 'Accessories',
    priceUSD: 26.0,
    priceVND: 650000,
    image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=600&q=80',
    stock: 40,
    badge: 'Acid-Free Archival',
    description: '9-pocket side-loading binder with rainbow holographic hardcover and acid-free non-PVC protective card sleeves.',
    features: ['360 Total Card Capacity', 'Acid-Free Archival Safe', 'Heavy Duty Zipper Closure'],
  },
];

export default function MdPage() {
  const { formatPrice, addToCart, setIsCartOpen } = useCartWishlist();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const categories = [
    { id: 'All', label: 'All MD', count: mockMerchList.length },
    { id: 'Lightstick', label: 'Lightsticks', count: mockMerchList.filter(m => m.category === 'Lightstick').length },
    { id: 'Apparel', label: 'Apparel & Hoodies', count: mockMerchList.filter(m => m.category === 'Apparel').length },
    { id: 'Collectibles', label: 'Collectibles & Figures', count: mockMerchList.filter(m => m.category === 'Collectibles').length },
    { id: 'Accessories', label: 'Photocard Supplies', count: mockMerchList.filter(m => m.category === 'Accessories').length },
  ];

  const filteredMerch = mockMerchList.filter((item) => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q || item.name.toLowerCase().includes(q) || item.artist.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  const handleAddMerchToCart = (item: MerchItem) => {
    // Adapt to Cart Album interface so it seamlessly integrates into the cart system
    const fakeAlbum: Album = {
      id: item.id,
      title: item.name,
      artist: item.artist,
      artistId: item.artist.toLowerCase().replace(/\s+/g, '-'),
      priceUSD: item.priceUSD,
      priceVND: item.priceVND,
      coverImage: item.image,
      galleryImages: [item.image],
      type: item.category === 'Lightstick' ? 'Lightstick' : 'Figure & Merch',
      releaseDate: '2026-01-01',
      tag: item.stock <= 10 ? 'Limited Edition' : 'Hot Seller',
      rating: 5.0,
      reviewCount: 95,
      popularityScore: 99,
      stock: item.stock,
      description: item.description,
      versions: [{ id: 'standard', name: 'Standard Edition', extraPriceUSD: 0 }],
      inclusions: item.features,
      photocards: [],
      tracks: [],
      reviews: [],
    };

    addToCart(fakeAlbum, 'Standard Edition', 1);
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1">
        {/* Dedicated MD Hero Banner */}
        <section 
          style={{
            backgroundColor: '#000000',
            color: '#ffffff',
            padding: '48px 28px',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px' }}>
              <Link href="/" className="hover:text-white transition-colors">HOME</Link>
              <span>/</span>
              <span style={{ color: '#ffffff', fontWeight: 800 }}>OFFICIAL MD & FANDOM GOODS</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
              <div style={{ maxWidth: '780px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#1e293b', color: '#a855f7', fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', border: '1px solid rgba(168,85,247,0.3)' }}>
                  <Sparkles style={{ width: '12px', height: '12px' }} />
                  <span>Certified Authentic Merchandise · Direct Agency Imports</span>
                </div>
                <h1 
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(32px, 4vw, 56px)',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    margin: '0 0 12px 0',
                  }}
                >
                  Official Fandom Goods, Lightsticks <em style={{ fontWeight: 400, color: '#94a3b8', fontStyle: 'italic' }}>& Apparel</em>
                </h1>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, margin: 0, fontWeight: 300 }}>
                  Explore 100% authentic group lightsticks with Bluetooth stadium sync, official concert tour hoodies, limited acrylic character dioramas, and archival photocard storage binders.
                </p>
              </div>

              {/* Stat badges */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ padding: '14px 20px', backgroundColor: '#0f172a', border: '1px solid #334155', minWidth: '140px' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>AUTHENTIC GOODS</span>
                  <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>100% REAL</span>
                </div>
                <div style={{ padding: '14px 20px', backgroundColor: '#0f172a', border: '1px solid #334155', minWidth: '140px' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>LIGHTSTICKS</span>
                  <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>BT 5.2 SYNC</span>
                </div>
                <div style={{ padding: '14px 20px', backgroundColor: '#0f172a', border: '1px solid #334155', minWidth: '140px' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>EXPRESS SHIP</span>
                  <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: '#10b981' }}>GLOBAL</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MD Content Section */}
        <section className="py-14 px-4 sm:px-7 max-w-[1440px] mx-auto">
          {/* Header & Filter row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9', marginBottom: '28px', gap: '20px', flexWrap: 'wrap' }}>
            
            {/* Category tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', overflowX: 'auto' }}>
              {categories.map((c) => {
                const isActive = selectedCategory === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    type="button"
                    style={{
                      padding: '0 0 8px 0',
                      fontSize: '11px',
                      fontWeight: isActive ? 800 : 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: isActive ? '#0f172a' : '#94a3b8',
                      background: 'none',
                      border: 'none',
                      borderBottom: isActive ? '2px solid #0f172a' : '2px solid transparent',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span>{c.label}</span>
                    <span style={{ fontSize: '10px', fontFamily: 'monospace', color: isActive ? '#000000' : '#cbd5e1', fontWeight: 700 }}>
                      ({c.count})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick search */}
            <div style={{ position: 'relative', width: '260px' }}>
              <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search lightstick, hoodie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: '36px',
                  paddingLeft: '32px',
                  paddingRight: '12px',
                  fontSize: '11px',
                  fontFamily: 'inherit',
                  border: '1.5px solid #000000',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMerch.map((item) => {
              const isItemAdded = addedItem === item.id;

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  className="hover:border-black hover:shadow-xl group"
                >
                  <div>
                    {/* Image Box */}
                    <div style={{ position: 'relative', width: '100%', height: '230px', backgroundColor: '#0f172a', overflow: 'hidden' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        className="group-hover:scale-105"
                      />
                      
                      {/* Top Badges */}
                      <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
                        <span style={{ fontSize: '9px', fontFamily: 'monospace', fontWeight: 800, padding: '3px 8px', backgroundColor: '#000000', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                          {item.artist}
                        </span>
                        {item.badge && (
                          <span style={{ fontSize: '9px', fontFamily: 'monospace', fontWeight: 800, padding: '3px 8px', backgroundColor: '#ffffff', color: '#000000', border: '1px solid #000000', textTransform: 'uppercase' }}>
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Stock Pill */}
                      <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 10 }}>
                        <span style={{ fontSize: '9px', fontFamily: 'monospace', fontWeight: 700, padding: '2px 6px', backgroundColor: 'rgba(0,0,0,0.75)', color: item.stock <= 10 ? '#fca5a5' : '#86efac', border: '1px solid rgba(255,255,255,0.2)' }}>
                          ● {item.stock <= 10 ? `Only ${item.stock} left in stock` : 'In Stock'}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div style={{ padding: '16px 18px 8px 18px' }}>
                      <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '2px' }}>
                        OFFICIAL MD · {item.category}
                      </span>
                      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                        {item.name}
                      </h3>
                      <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5, margin: '0 0 10px 0' }} className="line-clamp-2">
                        {item.description}
                      </p>

                      {/* Features bullets */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                        {item.features.slice(0, 2).map((f, i) => (
                          <span key={i} style={{ fontSize: '9px', fontFamily: 'monospace', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 5px', color: '#475569' }}>
                            ✦ {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Price & Action Footer */}
                  <div style={{ padding: '12px 18px', borderTop: '1px solid #f1f5f9', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '8px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>OFFICIAL PRICE</span>
                      <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                        {formatPrice(item.priceUSD, item.priceVND)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddMerchToCart(item)}
                      style={{
                        height: '36px',
                        padding: '0 14px',
                        backgroundColor: isItemAdded ? '#10b981' : '#000000',
                        color: '#ffffff',
                        border: '1.5px solid',
                        borderColor: isItemAdded ? '#10b981' : '#000000',
                        fontSize: '11px',
                        fontWeight: 800,
                        fontFamily: 'monospace',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                      }}
                      className="hover:bg-neutral-800"
                    >
                      {isItemAdded ? (
                        <>
                          <Check style={{ width: '13px', height: '13px' }} />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag style={{ width: '13px', height: '13px' }} />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Modals & Drawers */}
      <CartDrawer />
      <WishlistModal />
      <AudioPlayer />

      <ChatbotModal
        onFilterArtist={() => {}}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />
    </div>
  );
}
