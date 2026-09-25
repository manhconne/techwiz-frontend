'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Image as ImageIcon, 
  Flame, 
  Sparkles, 
  Users, 
  MessageSquare, 
  Send, 
  Check, 
  Smile, 
  TrendingUp,
  Tag
} from 'lucide-react';

interface Post {
  id: number;
  user: string;
  avatar: string;
  time: string;
  content: string;
  image: string | null;
  likes: number;
  comments: number;
  tag: string;
  fandomBadge: string;
  fandomColor: string;
  categories: string[];
  isLiked?: boolean;
}

const initialPosts: Post[] = [
  {
    id: 1,
    user: 'Bunnies_01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    time: '2 hours ago',
    content: 'Just received my Get Up album! The holo photocards are stunning ✨🐰',
    image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=800',
    likes: 342,
    comments: 45,
    tag: '#NewJeans',
    fandomBadge: 'Bunnies Verified',
    fandomColor: '#3b82f6',
    categories: ['Trending', 'Fan Art', 'Following'],
  },
  {
    id: 2,
    user: 'Blink_Forever',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    time: '5 hours ago',
    content: 'Who else is ready for the world tour? I already secured my VIP tickets! 🖤💗',
    image: null,
    likes: 890,
    comments: 120,
    tag: '#BLACKPINK',
    fandomBadge: 'BLINK VIP Passholder',
    fandomColor: '#f43f5e',
    categories: ['Trending', 'Discussions', 'Following'],
  },
  {
    id: 3,
    user: 'Stay_Max',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    time: '1 day ago',
    content: 'My fanart for the 5-STAR era! Took me 15 hours to draw this. Hope you guys like it! 🌟',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800',
    likes: 1205,
    comments: 88,
    tag: '#StrayKids',
    fandomBadge: 'STAY Verified Artist',
    fandomColor: '#ef4444',
    categories: ['Trending', 'Fan Art'],
  },
  {
    id: 4,
    user: 'Army_007',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    time: '2 days ago',
    content: "Stream PROOF! Let's break the record today. We are almost at the goal! 🔥💜",
    image: null,
    likes: 5430,
    comments: 320,
    tag: '#BTS',
    fandomBadge: 'ARMY Global Lead',
    fandomColor: '#a855f7',
    categories: ['Trending', 'Discussions', 'Following'],
  }
];

export const FanCommunityFeed: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Trending');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPostText, setNewPostText] = useState('');
  const [selectedTag, setSelectedTag] = useState('#NewJeans');
  const [attachImage, setAttachImage] = useState(false);
  const [copiedPostId, setCopiedPostId] = useState<number | null>(null);

  const tabs = [
    { id: 'Trending', label: 'Trending', count: posts.filter(p => p.categories.includes('Trending')).length },
    { id: 'Following', label: 'Following', count: posts.filter(p => p.categories.includes('Following')).length },
    { id: 'Fan Art', label: 'Fan Art', count: posts.filter(p => p.categories.includes('Fan Art')).length },
    { id: 'Discussions', label: 'Discussions', count: posts.filter(p => p.categories.includes('Discussions')).length },
  ];

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'Trending') return true;
    return post.categories.includes(activeTab);
  });

  const handleLike = (postId: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : p.likes - 1,
        };
      }
      return p;
    }));
  };

  const handleShare = (postId: number) => {
    setCopiedPostId(postId);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: Post = {
      id: Date.now(),
      user: 'You',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      time: 'Just now',
      content: newPostText,
      image: attachImage ? 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800' : null,
      likes: 1,
      comments: 0,
      tag: selectedTag,
      fandomBadge: 'Verified Fan Member',
      fandomColor: '#10b981',
      categories: ['Trending', 'Following', attachImage ? 'Fan Art' : 'Discussions'],
      isLiked: true,
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setAttachImage(false);
  };

  return (
    <section 
      id="community" 
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        scrollMarginTop: '110px',
      }}
      className="py-16 md:py-24 w-full border-t border-slate-100"
    >
      <div 
        className="max-w-[1440px] mx-auto px-3.5 sm:px-7"
      >
        
        {/* ==================== 1. Editorial Header ==================== */}
        <div style={{ marginBottom: '32px' }}>
          
          {/* Top Eyebrow Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px', height: '2px', backgroundColor: '#000000', display: 'inline-block', borderRadius: '2px' }} />
              <span 
                style={{ 
                  color: '#94a3b8',
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  letterSpacing: '0.22em',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                Community Hub
              </span>
            </div>

            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                fontSize: '10px',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              <span 
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 8px rgba(16,185,129,0.8)',
                  display: 'inline-block',
                }}
              />
              <span>14.8K Global Fans Active</span>
            </div>
          </div>

          {/* Heading Row: Playfair Serif + Tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              paddingBottom: '20px',
              borderBottom: '1px solid #f1f5f9',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h2 
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(28px, 3.2vw, 44px)',
                  lineHeight: 1.15,
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  textTransform: 'uppercase',
                }}
              >
                FAN FEED{' '}
                <em style={{ fontWeight: 400, color: '#94a3b8', fontStyle: 'italic', textTransform: 'none' }}>
                  & Fandom Archive
                </em>
              </h2>
              <p 
                style={{
                  fontSize: '13px',
                  color: '#64748b',
                  margin: '8px 0 0 0',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  maxWidth: '700px',
                }}
              >
                Connect, share fan art, discuss theories, and flex your collections with fans worldwide.
              </p>
            </div>

            {/* Filter Tabs - Editorial Underline Style */}
            <div 
              className="flex items-center gap-4 sm:gap-5 overflow-x-auto scrollbar-none max-w-full pb-1"
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
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
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span>{tab.label}</span>
                    <span 
                      style={{ 
                        fontSize: '10px', 
                        fontFamily: 'monospace',
                        color: isActive ? '#000000' : '#cbd5e1',
                        fontWeight: 700 
                      }}
                    >
                      ({tab.count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==================== 2. Interactive Post Composer ==================== */}
        <div 
          style={{
            maxWidth: '880px',
            margin: '0 auto 36px auto',
            backgroundColor: '#ffffff',
            border: '1.5px solid #000000',
            boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
            overflow: 'hidden',
          }}
        >
          {/* Composer Header Bar */}
          <div 
            style={{
              padding: '10px 16px',
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles style={{ width: '13px', height: '13px', color: '#000000' }} />
              <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                CREATE FAN DISPATCH
              </span>
            </div>
            
            {/* Tag Selection Chips */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none max-w-[200px] sm:max-w-none">
              {['#NewJeans', '#BLACKPINK', '#StrayKids', '#BTS', '#aespa'].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  style={{
                    fontSize: '9px',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    padding: '2px 8px',
                    border: '1px solid',
                    borderColor: selectedTag === tag ? '#000000' : '#e2e8f0',
                    backgroundColor: selectedTag === tag ? '#000000' : '#ffffff',
                    color: selectedTag === tag ? '#ffffff' : '#64748b',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Composer Body */}
          <form onSubmit={handleCreatePost} style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div 
                style={{
                  width: '42px',
                  height: '42px',
                  border: '1.5px solid #000000',
                  overflow: 'hidden',
                  flexShrink: 0,
                  backgroundColor: '#0f172a',
                }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                  alt="You" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <textarea 
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Share your thoughts, fan art, or collections..."
                  rows={2}
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '13px',
                    color: '#0f172a',
                    fontFamily: 'inherit',
                    resize: 'none',
                    lineHeight: 1.6,
                  }}
                />

                {attachImage && (
                  <div 
                    style={{
                      marginTop: '8px',
                      padding: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px dashed #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      color: '#475569',
                    }}
                  >
                    <span style={{ fontFamily: 'monospace' }}>📸 Sample Fan Art Attached (Y2K Concert Poster)</span>
                    <button 
                      type="button" 
                      onClick={() => setAttachImage(false)}
                      style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 700 }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Composer Footer Actions */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                marginTop: '8px',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                  type="button"
                  onClick={() => setAttachImage(!attachImage)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 12px',
                    backgroundColor: attachImage ? '#0f172a' : '#f8fafc',
                    color: attachImage ? '#ffffff' : '#64748b',
                    border: '1px solid #e2e8f0',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  title="Attach artwork or photo"
                >
                  <ImageIcon size={14} />
                  <span>{attachImage ? 'Image Attached' : 'Attach Photo'}</span>
                </button>
                <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>
                  {newPostText.length}/280
                </span>
              </div>

              <button 
                type="submit"
                disabled={!newPostText.trim()}
                style={{
                  height: '36px',
                  padding: '0 20px',
                  backgroundColor: newPostText.trim() ? '#000000' : '#e2e8f0',
                  color: newPostText.trim() ? '#ffffff' : '#94a3b8',
                  border: '1.5px solid',
                  borderColor: newPostText.trim() ? '#000000' : '#cbd5e1',
                  fontSize: '11px',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: newPostText.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
                className={newPostText.trim() ? "hover:bg-neutral-800" : ""}
              >
                <Send size={12} />
                <span>Post</span>
              </button>
            </div>
          </form>
        </div>

        {/* ==================== 3. Feed Grid ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {filteredPosts.map((post) => {
            const hasImage = Boolean(post.image);

            return (
              <div 
                key={post.id}
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
                className="hover:border-black hover:shadow-lg group"
              >
                {/* Card Top Header */}
                <div style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div 
                        style={{
                          width: '42px',
                          height: '42px',
                          border: '1.5px solid #000000',
                          backgroundColor: '#0f172a',
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}
                      >
                        <img 
                          src={post.avatar} 
                          alt={post.user} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>
                            {post.user}
                          </span>
                          <span 
                            style={{ 
                              width: '14px', 
                              height: '14px', 
                              backgroundColor: '#000000', 
                              color: '#ffffff', 
                              borderRadius: '50%', 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              fontSize: '8px', 
                              fontWeight: 900 
                            }}
                            title="Verified Member"
                          >
                            ✓
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>
                            {post.time}
                          </span>
                          <span style={{ fontSize: '10px', color: '#cbd5e1' }}>•</span>
                          <span 
                            style={{ 
                              fontSize: '9px', 
                              fontFamily: 'monospace', 
                              fontWeight: 700, 
                              color: post.fandomColor,
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em' 
                            }}
                          >
                            {post.fandomBadge}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => handleShare(post.id)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: copiedPostId === post.id ? '#10b981' : '#94a3b8', 
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                      }}
                      title="Share link"
                      className="hover:text-black transition-colors"
                    >
                      {copiedPostId === post.id ? (
                        <>
                          <Check size={14} />
                          <span>Copied</span>
                        </>
                      ) : (
                        <MoreHorizontal size={18} />
                      )}
                    </button>
                  </div>

                  {/* Post Content */}
                  <div 
                    style={{
                      borderLeft: !hasImage ? `3px solid ${post.fandomColor}` : 'none',
                      paddingLeft: !hasImage ? '12px' : '0',
                      backgroundColor: !hasImage ? '#f8fafc' : 'transparent',
                      padding: !hasImage ? '12px 14px' : '0',
                      marginBottom: '14px',
                    }}
                  >
                    <p 
                      style={{ 
                        fontSize: !hasImage ? '14px' : '13px', 
                        color: '#1e293b', 
                        lineHeight: 1.6, 
                        margin: 0,
                        fontStyle: !hasImage ? 'italic' : 'normal',
                        fontFamily: !hasImage ? "'Playfair Display', Georgia, serif" : 'inherit',
                      }}
                    >
                      {post.content}
                    </p>
                  </div>

                  {/* Post Image Preview */}
                  {post.image && (
                    <div 
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '240px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#0f172a',
                        overflow: 'hidden',
                        marginBottom: '4px',
                      }}
                    >
                      <img 
                        src={post.image} 
                        alt="Fan Content" 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease',
                        }}
                        className="group-hover:scale-102"
                      />
                    </div>
                  )}
                </div>

                {/* Card Bottom Meta & Interactive Stats */}
                <div 
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#fafafa',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Interactive Like Button */}
                    <button 
                      type="button"
                      onClick={() => handleLike(post.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: post.isLiked ? '#ef4444' : '#64748b',
                        transition: 'all 0.15s ease',
                        padding: '4px 6px',
                        borderRadius: '4px',
                      }}
                      className="hover:bg-rose-50"
                    >
                      <Heart 
                        size={15} 
                        style={{ 
                          fill: post.isLiked ? '#ef4444' : 'none', 
                          color: post.isLiked ? '#ef4444' : '#64748b' 
                        }} 
                      />
                      <span>{post.likes}</span>
                    </button>

                    {/* Comments Button */}
                    <button 
                      type="button"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: '#64748b',
                        padding: '4px 6px',
                        borderRadius: '4px',
                      }}
                      className="hover:bg-slate-100"
                    >
                      <MessageCircle size={15} />
                      <span>{post.comments}</span>
                    </button>

                    {/* Share Button */}
                    <button 
                      type="button"
                      onClick={() => handleShare(post.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: '#64748b',
                        padding: '4px 6px',
                        borderRadius: '4px',
                      }}
                      className="hover:bg-slate-100"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>

                  {/* Fandom Tag Pill */}
                  <span 
                    style={{
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      padding: '3px 8px',
                      border: '1px solid #000000',
                    }}
                  >
                    {post.tag}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
