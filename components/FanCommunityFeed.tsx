'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon, Flame } from 'lucide-react';

const mockPosts = [
  {
    id: 1,
    user: 'Bunnies_01',
    avatar: 'https://i.pravatar.cc/150?u=bunnies',
    time: '2 hours ago',
    content: 'Just received my Get Up album! The holo photocards are stunning ✨🐰',
    image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=800',
    likes: 342,
    comments: 45,
    tag: '#NewJeans',
  },
  {
    id: 2,
    user: 'Blink_Forever',
    avatar: 'https://i.pravatar.cc/150?u=blink',
    time: '5 hours ago',
    content: 'Who else is ready for the world tour? I already secured my VIP tickets! 🖤💗',
    image: null,
    likes: 890,
    comments: 120,
    tag: '#BLACKPINK',
  },
  {
    id: 3,
    user: 'Stay_Max',
    avatar: 'https://i.pravatar.cc/150?u=stay',
    time: '1 day ago',
    content: 'My fanart for the 5-STAR era! Took me 15 hours to draw this. Hope you guys like it! 🌟',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800',
    likes: 1205,
    comments: 88,
    tag: '#StrayKids',
  },
  {
    id: 4,
    user: 'Army_007',
    avatar: 'https://i.pravatar.cc/150?u=army',
    time: '2 days ago',
    content: 'Stream PROOF! Let\'s break the record today. We are almost at the goal! 🔥💜',
    image: null,
    likes: 5430,
    comments: 320,
    tag: '#BTS',
  }
];

export const FanCommunityFeed: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Trending');

  return (
    <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 mt-12">
      <div className="flex flex-col items-center text-center justify-center mb-12">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 block">
          Community Hub
        </span>
        <h2 
          className="font-black uppercase text-slate-900 leading-[0.85] tracking-tighter mb-4"
          style={{ fontSize: 'clamp(40px, 6vw, 70px)' }}
        >
          FAN FEED
        </h2>
        <p className="text-slate-500 max-w-xl text-sm md:text-base leading-relaxed">
          Connect, share fan art, discuss theories, and flex your collections with fans worldwide.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 mb-10">
        {['Trending', 'Following', 'Fan Art', 'Discussions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === tab 
                ? 'bg-black text-white shadow-lg' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Post Composer */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-10 max-w-3xl mx-auto flex items-start gap-4">
        <img src="https://i.pravatar.cc/150?u=guest" alt="You" className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1">
          <textarea 
            placeholder="Share your thoughts, fan art, or collections..."
            className="w-full bg-transparent resize-none outline-none text-sm text-slate-900 placeholder:text-slate-400 min-h-[60px]"
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
            <button className="text-slate-400 hover:text-black transition-colors p-2 rounded-full hover:bg-slate-100">
              <ImageIcon size={18} />
            </button>
            <button className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-slate-800 transition-colors">
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Masonry-like Grid for Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {mockPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-bold text-sm text-slate-900">{post.user}</div>
                  <div className="text-[11px] text-slate-400">{post.time}</div>
                </div>
              </div>
              <button className="text-slate-400 hover:text-black transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>
            
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              {post.content}
            </p>

            {post.image && (
              <div className="rounded-xl overflow-hidden mb-4 aspect-video bg-slate-100">
                <img src={post.image} alt="Fan Content" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors text-xs font-semibold">
                  <Heart size={16} /> {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-500 transition-colors text-xs font-semibold">
                  <MessageCircle size={16} /> {post.comments}
                </button>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-2 py-1 rounded-md">
                {post.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
