'use client';

import React from 'react';
import { MediaItem, LiveChatMessage } from '../../data/multimediaData';

interface MultimediaLiveChatProps {
  activeMedia: MediaItem;
  isCinemaMode: boolean;
  liveChatList: LiveChatMessage[];
  newChatMessage: string;
  floatingReactions: { id: number; text: string; x: number }[];
  onNewChatMessageChange: (val: string) => void;
  onSendChatMessage: (e: React.FormEvent) => void;
  onTriggerReaction: (text: string) => void;
}

export const MultimediaLiveChat: React.FC<MultimediaLiveChatProps> = ({
  activeMedia,
  isCinemaMode,
  liveChatList,
  newChatMessage,
  floatingReactions,
  onNewChatMessageChange,
  onSendChatMessage,
  onTriggerReaction,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
      {/* 1. Livestream Screen (8 columns) */}
      <div className="lg:col-span-8 relative bg-black flex flex-col justify-center items-center overflow-hidden border-b lg:border-b-0 lg:border-r-2 border-black">
        <div className="relative w-full aspect-video bg-black">
          {activeMedia.embedUrl ? (
            <iframe
              src={activeMedia.embedUrl}
              title={activeMedia.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <img
              src={activeMedia.thumbnailUrl}
              alt={activeMedia.title}
              className="w-full h-full object-cover"
            />
          )}

          {/* Live Status Overlay Header */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none font-mono">
            <div className="flex items-center gap-2">
              <span 
                style={{ borderRadius: '0px' }}
                className="px-2.5 py-1 bg-[#ef4444] text-white border-2 border-black text-[10px] font-black tracking-widest uppercase shadow-[2px_2px_0px_#000] animate-pulse"
              >
                ● LIVE BROADCAST
              </span>
              <span 
                style={{ borderRadius: '0px' }}
                className="px-2 py-1 bg-black text-[#ffd60a] border-2 border-black text-[10px] font-black shadow-[2px_2px_0px_#000]"
              >
                {activeMedia.liveViewers?.toLocaleString() || '38,450'} VIEWERS
              </span>
            </div>

            <span 
              style={{ borderRadius: '0px' }}
              className="px-2 py-1 bg-black text-[#00f0ff] text-[10px] font-mono font-black border-2 border-black shadow-[2px_2px_0px_#000]"
            >
              BITRATE: 6000 KBPS
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Teletext Live Chat (4 columns) */}
      <div 
        className={`lg:col-span-4 flex flex-col font-mono text-xs ${
          isCinemaMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-black'
        }`}
      >
        <div className="flex-1 flex flex-col h-full min-h-[460px]">
          {/* Chat Header */}
          <div className="p-4 border-b-2 border-black flex items-center justify-between bg-[#fefce8] text-black">
            <div>
              <h4 className="font-mono font-black text-xs uppercase tracking-wider text-black">
                LIVE CHAT TELETEXT
              </h4>
              <span className="text-[10px] text-neutral-600 font-bold">
                SYNCED CHRONO FEED
              </span>
            </div>
            <span 
              style={{ borderRadius: '0px' }}
              className="text-[9px] font-black border-2 border-black px-2 py-0.5 bg-[#ffd60a] text-black shadow-[1px_1px_0px_#000]"
            >
              ● REALTIME
            </span>
          </div>

          {/* Messages Scroller */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[340px] text-[11px] relative">
            {liveChatList.map((msg) => (
              <div key={msg.id} className="border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <div className="flex items-center justify-between text-neutral-500 mb-0.5 text-[10px]">
                  <span className="font-black text-[#ff2e93]">{msg.user}</span>
                  <span className="font-mono font-bold text-neutral-400">{msg.timestamp}</span>
                </div>
                <p className="leading-snug font-sans font-medium text-black dark:text-neutral-200">
                  {msg.message}
                </p>
              </div>
            ))}

            {/* Floating Reaction Text Animation */}
            {floatingReactions.map((r) => (
              <div
                key={r.id}
                style={{
                  borderRadius: '0px',
                  left: `${r.x}%`,
                }}
                className="absolute bottom-16 pointer-events-none text-xs font-mono font-black border-2 border-black px-2.5 py-1 bg-[#ffd60a] text-black shadow-[3px_3px_0px_#000000] animate-bounce z-20"
              >
                {r.text}
              </div>
            ))}
          </div>

          {/* Live Reaction Stickers Bar */}
          <div className="px-4 py-2 border-t-2 border-black flex items-center justify-between text-[11px] font-mono font-black bg-[#ecfeff]">
            <span className="text-[10px] text-neutral-500 mr-2">REACTIONS:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {['[🔥 FIRE]', '[★ VIBE]', '[✦ ENCORE]', '[⚡ HYPED]'].map((txt) => (
                <button
                  key={txt}
                  type="button"
                  onClick={() => onTriggerReaction(txt)}
                  style={{ borderRadius: '0px' }}
                  className="px-2 py-0.5 bg-white hover:bg-[#ffd60a] text-black border border-black text-[10px] cursor-pointer shadow-[1px_1px_0px_#000] transition-colors"
                >
                  {txt}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Message Input Form */}
          <form 
            onSubmit={onSendChatMessage} 
            className="p-3 border-t-2 border-black flex items-center gap-2 bg-neutral-50 dark:bg-neutral-900"
          >
            <input
              type="text"
              placeholder="ENTER BROADCAST MESSAGE..."
              value={newChatMessage}
              onChange={(e) => onNewChatMessageChange(e.target.value)}
              style={{ borderRadius: '0px' }}
              className="flex-1 px-3 py-2 text-xs border-2 border-black bg-white dark:bg-black font-mono focus:outline-none focus:ring-2 focus:ring-[#ff2e93]"
            />
            <button
              type="submit"
              disabled={!newChatMessage.trim()}
              style={{ borderRadius: '0px' }}
              className="px-4 py-2 bg-[#ff2e93] hover:bg-[#e11d48] text-white font-mono text-xs font-black uppercase tracking-wider disabled:opacity-40 cursor-pointer border-2 border-black shadow-[2px_2px_0px_#000] transition-all"
            >
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
