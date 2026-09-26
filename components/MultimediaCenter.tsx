'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Radio, 
  Film, 
  Tv, 
  Mic, 
  Disc, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  Eye, 
  Calendar, 
  Sparkles, 
  Send, 
  Heart, 
  Flame, 
  PartyPopper, 
  MessageSquare, 
  Check, 
  RotateCcw, 
  RotateCw, 
  Sliders, 
  Maximize2, 
  Minimize2, 
  Search, 
  Filter, 
  ChevronRight, 
  Info, 
  ExternalLink,
  Music,
  BarChart2,
  Headphones,
  Award
} from 'lucide-react';
import { 
  MediaItem, 
  MediaType, 
  FandomCategory, 
  INITIAL_MEDIA_ITEMS, 
  LiveChatMessage 
} from '../data/multimediaData';

interface MultimediaCenterProps {
  initialMediaId?: string;
  defaultCategory?: string;
}

export const MultimediaCenter: React.FC<MultimediaCenterProps> = ({
  initialMediaId,
  defaultCategory,
}) => {
  // Media items state (allows persistent rating and thumbs updates in memory)
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA_ITEMS);

  // Active selected media item (defaults to first item or prop)
  const [activeMediaId, setActiveMediaId] = useState<string>(() => {
    if (initialMediaId) return initialMediaId;
    return INITIAL_MEDIA_ITEMS[0]?.id || 'media-trailer-1';
  });

  const activeMedia = useMemo(() => {
    return mediaList.find((m) => m.id === activeMediaId) || mediaList[0];
  }, [mediaList, activeMediaId]);

  // Filters & Search
  const [selectedFormat, setSelectedFormat] = useState<MediaType | 'all'>('all');
  const [selectedUniverse, setSelectedUniverse] = useState<FandomCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'views' | 'rating' | 'newest' | 'duration'>('views');

  // Cinema Mode / Lighting Dimmer
  const [isCinemaMode, setIsCinemaMode] = useState(false);

  // Audio Player State (for podcast and soundtrack formats)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0); // 0 to 100
  const [audioVolume, setAudioVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Rating States
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [ratingToast, setRatingToast] = useState<string | null>(null);
  const [showRatingBreakdown, setShowRatingBreakdown] = useState(false);

  // Bookmark / Watch Later
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Live Chat State
  const [liveChatList, setLiveChatList] = useState<LiveChatMessage[]>(() => {
    return activeMedia?.chatMessages || [];
  });
  const [newChatMessage, setNewChatMessage] = useState('');
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const nextReactionId = useRef(0);

  // Synchronize live chat when activeMedia changes
  useEffect(() => {
    if (activeMedia?.chatMessages) {
      setLiveChatList(activeMedia.chatMessages);
    } else {
      setLiveChatList([]);
    }
    // Pause audio when switching
    setIsPlayingAudio(false);
    setAudioProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [activeMediaId]);

  // Audio time update handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlayingAudio(false);
      setAudioProgress(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [activeMediaId]);

  // Handle Play/Pause for Audio
  const toggleAudioPlay = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlayingAudio(true);
    }
  };

  const handleAudioSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setAudioProgress(val);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
    }
  };

  const handleSkipTime = (deltaSeconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + deltaSeconds);
    }
  };

  const handleChangePlaybackSpeed = (speed: number) => {
    setAudioSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // Star Rating Handler
  const handleRateMedia = (stars: number) => {
    setMediaList((prev) =>
      prev.map((item) => {
        if (item.id === activeMedia.id) {
          const currentRating = item.rating;
          const isReRating = currentRating.userRating !== undefined && currentRating.userRating !== null;
          
          // Recompute distribution and average
          const newCount = isReRating ? currentRating.count : currentRating.count + 1;
          const newAvg = Number(
            (
              (currentRating.average * currentRating.count + stars - (isReRating ? (currentRating.userRating || 0) : 0)) /
              newCount
            ).toFixed(1)
          );

          return {
            ...item,
            rating: {
              ...currentRating,
              average: Math.min(5, Math.max(1, newAvg)),
              count: newCount,
              userRating: stars,
            },
          };
        }
        return item;
      })
    );

    setRatingToast(`Bạn đã đánh giá ${stars} sao cho "${activeMedia.title.slice(0, 32)}..."`);
    setTimeout(() => setRatingToast(null), 3500);
  };

  // Thumbs Up / Down Handler
  const handleVoteThumbs = (voteType: 'up' | 'down') => {
    setMediaList((prev) =>
      prev.map((item) => {
        if (item.id === activeMedia.id) {
          const currentRating = item.rating;
          let newUp = currentRating.thumbsUp;
          let newDown = currentRating.thumbsDown;
          let newVote: 'up' | 'down' | null = voteType;

          if (currentRating.userVote === voteType) {
            // Cancel vote
            newVote = null;
            if (voteType === 'up') newUp -= 1;
            if (voteType === 'down') newDown -= 1;
          } else {
            // Apply new vote
            if (voteType === 'up') {
              newUp += 1;
              if (currentRating.userVote === 'down') newDown -= 1;
            } else {
              newDown += 1;
              if (currentRating.userVote === 'up') newUp -= 1;
            }
          }

          return {
            ...item,
            rating: {
              ...currentRating,
              thumbsUp: Math.max(0, newUp),
              thumbsDown: Math.max(0, newDown),
              userVote: newVote,
            },
          };
        }
        return item;
      })
    );
  };

  // Bookmark toggle
  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Share Link Handler
  const handleShare = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/multimedia?id=${activeMedia.id}` : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setShareToast('Đã sao chép liên kết vào bộ nhớ tạm!');
    setTimeout(() => setShareToast(null), 3000);
  };

  // Add Live Chat comment
  const handleSendLiveComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;

    const newMsg: LiveChatMessage = {
      id: `chat-${Date.now()}`,
      user: 'Bạn (Fan Verified)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      badge: 'FAN TIÊU BIỂU ⭐',
      badgeColor: '#10b981',
      message: newChatMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setLiveChatList((prev) => [...prev, newMsg]);
    setNewChatMessage('');
  };

  // Trigger floating reaction animation
  const triggerReaction = (emoji: string) => {
    const id = nextReactionId.current++;
    const x = Math.floor(Math.random() * 80) + 10; // random 10% - 90%
    setFloatingReactions((prev) => [...prev, { id, emoji, x }]);

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2200);
  };

  // Filtered and Sorted Media List
  const filteredMediaList = useMemo(() => {
    return mediaList
      .filter((item) => {
        // Format filter
        if (selectedFormat !== 'all' && item.type !== selectedFormat) return false;
        // Universe filter
        if (selectedUniverse !== 'all' && item.category !== selectedUniverse) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchArtist = item.artist.toLowerCase().includes(q);
          const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchArtist && !matchTag) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'views') return b.views - a.views;
        if (sortBy === 'rating') return b.rating.average - a.rating.average;
        if (sortBy === 'duration') return b.durationSeconds - a.durationSeconds;
        return 0;
      });
  }, [mediaList, selectedFormat, selectedUniverse, searchQuery, sortBy]);

  // Format Helper Badge
  const getFormatBadge = (type: MediaType) => {
    switch (type) {
      case 'trailer':
        return { label: 'TRAILER / MV', icon: Film, color: '#f59e0b', bg: '#fef3c7', text: '#92400e' };
      case 'video':
        return { label: 'VIDEO / SHOW', icon: Tv, color: '#3b82f6', bg: '#dbeafe', text: '#1e40af' };
      case 'podcast':
        return { label: 'PODCAST RADIO', icon: Mic, color: '#8b5cf6', bg: '#ede9fe', text: '#5b21b6' };
      case 'livestream':
        return { label: 'LIVESTREAM', icon: Radio, color: '#ef4444', bg: '#fee2e2', text: '#991b1b' };
      case 'soundtrack':
        return { label: 'SOUNDTRACK OST', icon: Disc, color: '#10b981', bg: '#d1fae5', text: '#065f46' };
    }
  };

  const activeFormatInfo = getFormatBadge(activeMedia.type);

  // Ratio calculation
  const totalThumbs = activeMedia.rating.thumbsUp + activeMedia.rating.thumbsDown;
  const thumbsUpPercent = totalThumbs > 0 ? Math.round((activeMedia.rating.thumbsUp / totalThumbs) * 100) : 100;

  return (
    <section 
      id="multimedia" 
      className={`relative w-full py-12 px-4 md:px-8 transition-colors duration-300 ${
        isCinemaMode ? 'bg-slate-950 text-white' : 'bg-slate-50/70 text-slate-900'
      }`}
      style={{ minHeight: '850px' }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ========================================================= */}
        {/* 1. SECTION HEADER & MULTIMEDIA BRAND STATS                */}
        {/* ========================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-black uppercase tracking-wider mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>MULTIMEDIA CENTER & FANDOM BROADCAST</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Trung Tâm Đa Phương Tiện
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl mt-1.5 font-normal">
              Xem phát trailer 4K, video hậu trường độc quyền, nghe podcast radio, hòa mình vào các buổi livestream trực tiếp và thưởng thức album soundtrack lossless với tính năng chấm điểm rating tương tác.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCinemaMode(!isCinemaMode)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                isCinemaMode 
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20' 
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 shadow-sm'
              }`}
              title="Bật/Tắt chế độ rạp chiếu đèn tối"
            >
              {isCinemaMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span>{isCinemaMode ? 'Tắt Rạp Chiếu' : 'Chế Độ Rạp Chiếu'}</span>
            </button>
          </div>
        </div>

        {/* Rating & Action Toasts */}
        {ratingToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-2xl border border-slate-700 animate-bounce">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>{ratingToast}</span>
          </div>
        )}

        {shareToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-emerald-700 text-white text-sm font-semibold shadow-2xl border border-emerald-500">
            <Check className="w-5 h-5 text-white" />
            <span>{shareToast}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. HERO MASTER PLAYER STAGE (CINEMA & STUDIO SUITE)       */}
        {/* ========================================================= */}
        <div className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-xl ${
          isCinemaMode 
            ? 'bg-slate-900 border-slate-800 ring-2 ring-amber-400/20' 
            : 'bg-white border-slate-200/90'
        }`}>
          {/* Main Media Player Frame */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Screen View Area (9 columns or full) */}
            <div className={`${activeMedia.type === 'livestream' ? 'lg:col-span-8' : 'lg:col-span-8'} relative bg-black flex flex-col justify-center items-center overflow-hidden`}>
              
              {/* Media Format Type Switcher Rendering */}
              {activeMedia.type === 'trailer' || activeMedia.type === 'video' ? (
                /* Video / Trailer Player */
                <div className="relative w-full aspect-video bg-black">
                  {activeMedia.embedUrl ? (
                    <iframe
                      src={activeMedia.embedUrl}
                      title={activeMedia.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={activeMedia.thumbnailUrl}
                        alt={activeMedia.title}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 fill-white ml-1" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Quality & Format Watermark Badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
                    <span className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-amber-400 border border-amber-400/30 text-[11px] font-black tracking-wider uppercase">
                      {activeMedia.qualityBadge || '4K HDR'}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-white text-[11px] font-bold">
                      {activeMedia.category}
                    </span>
                  </div>
                </div>
              ) : activeMedia.type === 'livestream' ? (
                /* Livestream Video Screen */
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
                  <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black tracking-widest uppercase shadow-lg shadow-rose-600/40 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                        LIVE
                      </span>
                      <span className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-slate-200 text-xs font-semibold">
                        <Eye className="w-3.5 h-3.5 inline mr-1 text-rose-400" />
                        {activeMedia.liveViewers?.toLocaleString() || '38,450'} đang xem
                      </span>
                    </div>

                    <span className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-amber-300 text-xs font-mono font-bold">
                      BITRATE: 6000 KBPS • 60FPS
                    </span>
                  </div>
                </div>
              ) : (
                /* Podcast & Soundtrack Studio Player */
                <div className="relative w-full min-h-[420px] aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-8 overflow-hidden">
                  
                  {/* Subtle Background Art Blur */}
                  <div 
                    className="absolute inset-0 opacity-20 bg-cover bg-center filter blur-3xl pointer-events-none"
                    style={{ backgroundImage: `url(${activeMedia.thumbnailUrl})` }}
                  />

                  {/* Vinyl Record & Turntable Art */}
                  <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8 max-w-xl w-full">
                    
                    {/* Spinning Vinyl Disc */}
                    <div className="relative group">
                      <div className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-slate-700 bg-slate-950 shadow-2xl flex items-center justify-center relative ${isPlayingAudio ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
                        {/* Vinyl Grooves */}
                        <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-slate-800" />
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-slate-800" />
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-slate-600 bg-slate-900 overflow-hidden flex items-center justify-center">
                          <img
                            src={activeMedia.thumbnailUrl}
                            alt={activeMedia.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-4 h-4 rounded-full bg-slate-300 border-2 border-slate-900 z-10" />
                      </div>

                      {/* Format Badge Pill */}
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md">
                        {activeMedia.type === 'podcast' ? 'PODCAST' : 'VINYL MASTER'}
                      </span>
                    </div>

                    {/* Audio Metadata Information */}
                    <div className="flex-1 text-center sm:text-left space-y-2 text-white">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold">
                        <Headphones className="w-3.5 h-3.5" />
                        {activeMedia.qualityBadge || '24-BIT / 96KHZ LOSSLESS'}
                      </div>
                      <h3 className="text-xl font-black text-white line-clamp-2">
                        {activeMedia.title}
                      </h3>
                      <p className="text-sm font-semibold text-slate-300">
                        {activeMedia.artist}
                      </p>
                      {activeMedia.soundtrackMeta?.albumName && (
                        <p className="text-xs text-amber-300 font-mono">
                          Album: {activeMedia.soundtrackMeta.albumName} (Track #{activeMedia.soundtrackMeta.trackNumber})
                        </p>
                      )}
                      {activeMedia.soundtrackMeta?.lyricsSnippet && (
                        <p className="text-xs text-slate-400 italic line-clamp-2 border-l-2 border-amber-400/60 pl-2">
                          "{activeMedia.soundtrackMeta.lyricsSnippet}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Frequency Equalizer Visualizer Bars */}
                  <div className="relative z-10 w-full max-w-md mt-6 flex items-end justify-center gap-1.5 h-12">
                    {Array.from({ length: 32 }).map((_, idx) => {
                      const heights = [20, 45, 80, 60, 95, 30, 75, 90, 40, 100, 65, 35, 85, 50, 70, 90, 45, 80, 60, 95, 30, 75, 90, 40, 100, 65, 35, 85, 50, 70, 90, 40];
                      const height = isPlayingAudio ? `${heights[idx % heights.length]}%` : '15%';
                      return (
                        <div
                          key={idx}
                          className="w-1.5 rounded-full bg-gradient-to-t from-indigo-500 to-amber-400 transition-all duration-150"
                          style={{
                            height,
                            animation: isPlayingAudio ? `pulse ${(idx % 5) * 0.2 + 0.3}s infinite alternate` : 'none',
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* HTML5 Audio Element */}
                  <audio
                    ref={audioRef}
                    src={activeMedia.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'}
                    preload="metadata"
                  />

                  {/* Studio Audio Controls Console */}
                  <div className="relative z-10 w-full max-w-xl mt-6 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-4 space-y-3">
                    {/* Scrubber Timeline */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>
                          {audioRef.current?.currentTime
                            ? new Date(audioRef.current.currentTime * 1000).toISOString().slice(14, 19)
                            : '00:00'}
                        </span>
                        <span>{activeMedia.duration}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={audioProgress}
                        onChange={handleAudioSeek}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                      />
                    </div>

                    {/* Button Row */}
                    <div className="flex items-center justify-between">
                      {/* Playback Speed */}
                      <div className="flex items-center gap-1">
                        {[0.75, 1, 1.25, 1.5].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => handleChangePlaybackSpeed(speed)}
                            className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-colors ${
                              audioSpeed === speed
                                ? 'bg-amber-400 text-slate-950'
                                : 'text-slate-400 hover:text-white bg-slate-800'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>

                      {/* Main Center Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleSkipTime(-10)}
                          className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Lùi 10 giây"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>

                        <button
                          onClick={toggleAudioPlay}
                          className="w-11 h-11 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-amber-400/30"
                          title={isPlayingAudio ? 'Tạm dừng' : 'Phát âm thanh'}
                        >
                          {isPlayingAudio ? (
                            <Pause className="w-5 h-5 fill-slate-950" />
                          ) : (
                            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleSkipTime(10)}
                          className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Tới 10 giây"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Volume */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (audioRef.current) {
                              audioRef.current.muted = !isMuted;
                              setIsMuted(!isMuted);
                            }
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : audioVolume}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setAudioVolume(val);
                            setIsMuted(false);
                            if (audioRef.current) {
                              audioRef.current.volume = val;
                              audioRef.current.muted = false;
                            }
                          }}
                          className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Details & Live Chat Area (4 columns) */}
            <div className={`lg:col-span-4 flex flex-col border-t lg:border-t-0 lg:border-l ${
              isCinemaMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              
              {activeMedia.type === 'livestream' ? (
                /* LIVE CHAT STREAM FOR LIVESTREAMS */
                <div className="flex-1 flex flex-col h-full min-h-[460px]">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-rose-500" />
                      <h4 className="text-sm font-black uppercase tracking-wide">Trò Chuyện Trực Tiếp</h4>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Thời Gian Thực
                    </span>
                  </div>

                  {/* Messages Scroller */}
                  <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[340px] text-xs">
                    {liveChatList.map((msg) => (
                      <div key={msg.id} className="flex items-start gap-2.5">
                        <img
                          src={msg.avatar}
                          alt={msg.user}
                          className="w-7 h-7 rounded-full object-cover border border-slate-300 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900">{msg.user}</span>
                            {msg.badge && (
                              <span
                                className="text-[9px] font-black px-1.5 py-0.5 rounded text-white"
                                style={{ backgroundColor: msg.badgeColor || '#000000' }}
                              >
                                {msg.badge}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                          </div>
                          <p className="text-slate-700 mt-0.5 break-words font-medium">{msg.message}</p>
                        </div>
                      </div>
                    ))}

                    {/* Floating Reaction Bubbles Animation */}
                    {floatingReactions.map((r) => (
                      <div
                        key={r.id}
                        className="absolute bottom-20 pointer-events-none text-2xl animate-fade-in-up"
                        style={{
                          left: `${r.x}%`,
                          animation: 'floatUp 2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                        }}
                      >
                        {r.emoji}
                      </div>
                    ))}
                  </div>

                  {/* Live Reaction Bar */}
                  <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-around">
                    {['❤️', '🔥', '⭐', '🎉', '👏'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => triggerReaction(emoji)}
                        className="text-lg p-1.5 hover:scale-125 transition-transform"
                        title={`Thả cảm xúc ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSendLiveComment} className="p-3 border-t border-slate-200 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Gửi bình luận trực tiếp..."
                      value={newChatMessage}
                      onChange={(e) => setNewChatMessage(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                    />
                    <button
                      type="submit"
                      disabled={!newChatMessage.trim()}
                      className="p-2 rounded-xl bg-slate-900 text-white disabled:opacity-40 hover:bg-slate-800 transition-colors"
                      title="Gửi"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              ) : (
                /* CHAPTERS TIMELINE & METADATA FOR TRAILER / VIDEO / OST */
                <div className="flex-1 flex flex-col p-5 space-y-4 overflow-y-auto max-h-[460px]">
                  
                  {/* Category & Studio Pills */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5"
                        style={{ backgroundColor: activeFormatInfo.bg, color: activeFormatInfo.text }}
                      >
                        <activeFormatInfo.icon className="w-3.5 h-3.5" />
                        {activeFormatInfo.label}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {activeMedia.category}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-slate-400">
                      {activeMedia.duration}
                    </span>
                  </div>

                  {/* Title & Artist */}
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-snug">
                      {activeMedia.title}
                    </h3>
                    <p className="text-xs font-bold text-amber-600 mt-1">
                      Nghệ sĩ / Nhà sản xuất: {activeMedia.artist}
                    </p>
                    {activeMedia.agency && (
                      <p className="text-[11px] text-slate-500">
                        Đơn vị phát hành: {activeMedia.agency}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {activeMedia.description}
                  </p>

                  {/* Chapters List (If Available) */}
                  {activeMedia.chapters && activeMedia.chapters.length > 0 && (
                    <div className="pt-2 border-t border-slate-200">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        Mốc Thời Gian / Chương (Chapters)
                      </h4>
                      <div className="space-y-1.5">
                        {activeMedia.chapters.map((chap, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-xs cursor-pointer border border-slate-200/60"
                            onClick={() => {
                              if (audioRef.current) {
                                audioRef.current.currentTime = chap.seconds;
                                if (!isPlayingAudio) toggleAudioPlay();
                              }
                            }}
                          >
                            <span className="font-semibold text-slate-800 line-clamp-1">
                              {chap.title}
                            </span>
                            <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 ml-2">
                              {chap.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-1.5">
                    {activeMedia.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                </div>
              )}

            </div>
          </div>

          {/* ========================================================= */}
          {/* INTERACTIVE DUAL RATING & ACTION DOCK (5-STAR & THUMBS)   */}
          {/* ========================================================= */}
          <div className={`p-4 md:p-6 border-t flex flex-col md:flex-row items-center justify-between gap-6 ${
            isCinemaMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-slate-50/80 border-slate-200 text-slate-900'
          }`}>
            
            {/* Left: 5-Star Interactive Rating Widget */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex flex-col items-center justify-center font-black shadow-md flex-shrink-0">
                  <span className="text-base leading-none">{activeMedia.rating.average}</span>
                  <span className="text-[10px] uppercase font-bold leading-none mt-0.5">/ 5.0</span>
                </div>

                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((starNum) => {
                      const isFilled = (hoverRating !== null ? hoverRating : Math.round(activeMedia.rating.average)) >= starNum;
                      const isUserRated = activeMedia.rating.userRating === starNum;

                      return (
                        <button
                          key={starNum}
                          onMouseEnter={() => setHoverRating(starNum)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => handleRateMedia(starNum)}
                          className="p-1 hover:scale-125 transition-transform"
                          title={`Chấm ${starNum} sao`}
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              isFilled
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300 hover:text-amber-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-slate-700">
                      {activeMedia.rating.count.toLocaleString()} lượt đánh giá
                    </span>
                    {activeMedia.rating.userRating && (
                      <span className="text-[11px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                        Bạn đã cho: {activeMedia.rating.userRating}★
                      </span>
                    )}
                    <button
                      onClick={() => setShowRatingBreakdown(!showRatingBreakdown)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 underline ml-1"
                    >
                      {showRatingBreakdown ? 'Ẩn biểu đồ' : 'Xem biểu đồ'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Thumbs Up / Down Toggle Bar */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-center">
              {/* Thumbs Up Button */}
              <button
                onClick={() => handleVoteThumbs('up')}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border ${
                  activeMedia.rating.userVote === 'up'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${activeMedia.rating.userVote === 'up' ? 'fill-white' : ''}`} />
                <span>Thích</span>
                <span className="font-mono px-1.5 py-0.5 rounded bg-black/10 text-[11px]">
                  {activeMedia.rating.thumbsUp.toLocaleString()}
                </span>
              </button>

              {/* Thumbs Down Button */}
              <button
                onClick={() => handleVoteThumbs('down')}
                className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all border ${
                  activeMedia.rating.userVote === 'down'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <ThumbsDown className={`w-4 h-4 ${activeMedia.rating.userVote === 'down' ? 'fill-white' : ''}`} />
                <span className="font-mono px-1.5 py-0.5 rounded bg-black/10 text-[11px]">
                  {activeMedia.rating.thumbsDown.toLocaleString()}
                </span>
              </button>

              {/* Satisfaction Meter Indicator */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[11px] font-bold text-emerald-600">
                  {thumbsUpPercent}% Hài lòng
                </span>
                <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${thumbsUpPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right: Bookmark & Social Share Actions */}
            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
              <button
                onClick={() => toggleBookmark(activeMedia.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  bookmarkedIds.includes(activeMedia.id)
                    ? 'bg-rose-50 text-rose-700 border-rose-300'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {bookmarkedIds.includes(activeMedia.id) ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-rose-600" />
                    <span>Đã Lưu</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Lưu Xem Sau</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-all"
                title="Chia sẻ liên kết"
              >
                <Share2 className="w-4 h-4" />
                <span>Chia Sẻ</span>
              </button>
            </div>

          </div>

          {/* Star Distribution Breakdown Drawer */}
          {showRatingBreakdown && (
            <div className="p-5 bg-white border-t border-slate-200">
              <div className="max-w-md mx-auto space-y-2">
                <h5 className="text-xs font-black uppercase text-slate-800 tracking-wider text-center mb-3">
                  Bảng Phân Bố Đánh Giá 5 Sao ({activeMedia.rating.count.toLocaleString()} lượt)
                </h5>
                {[5, 4, 3, 2, 1].map((stars) => {
                  const percent = activeMedia.rating.distribution[stars as keyof typeof activeMedia.rating.distribution] || 0;
                  return (
                    <div key={stars} className="flex items-center gap-3 text-xs">
                      <span className="w-12 font-bold text-slate-700 flex items-center gap-0.5">
                        {stars} <Star className="w-3 h-3 text-amber-400 fill-amber-400 inline" />
                      </span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="w-10 text-right font-mono font-bold text-slate-600">
                        {percent}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* ========================================================= */}
        {/* 3. MULTIMEDIA FILTER DOCK & SEARCH CONTROLS               */}
        {/* ========================================================= */}
        <div className="space-y-4">
          
          {/* Format Tabs Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'Tất Cả Định Dạng', icon: Sparkles, count: mediaList.length },
              { id: 'trailer', label: 'Trailer & MV', icon: Film, count: mediaList.filter((m) => m.type === 'trailer').length },
              { id: 'video', label: 'Video & Show', icon: Tv, count: mediaList.filter((m) => m.type === 'video').length },
              { id: 'podcast', label: 'Podcast Radio', icon: Mic, count: mediaList.filter((m) => m.type === 'podcast').length },
              { id: 'livestream', label: 'Livestream Trực Tiếp', icon: Radio, count: mediaList.filter((m) => m.type === 'livestream').length, isLiveBadge: true },
              { id: 'soundtrack', label: 'Soundtrack (OST)', icon: Disc, count: mediaList.filter((m) => m.type === 'soundtrack').length },
            ].map((tab) => {
              const isActive = selectedFormat === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFormat(tab.id as any)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.isLiveBadge && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                  )}
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Universe Pills & Search Bar Row */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            
            {/* Universe Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <span className="text-xs font-black uppercase text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Vũ Trụ:
              </span>
              {[
                { id: 'all', label: 'Tất Cả' },
                { id: 'K-Pop', label: 'K-Pop' },
                { id: 'V-Pop', label: 'V-Pop' },
                { id: 'Anime', label: 'Anime & Manga' },
                { id: 'Gaming', label: 'Gaming & Esports' },
                { id: 'Cinema', label: 'Điện Ảnh OST' },
              ].map((uni) => {
                const isActive = selectedUniverse === uni.id;
                return (
                  <button
                    key={uni.id}
                    onClick={() => setSelectedUniverse(uni.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {uni.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input & Sort Dropdown */}
            <div className="flex items-center gap-3">
              {/* Search Box */}
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm MV, podcast, nghệ sĩ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="views">Lượt xem nhiều nhất</option>
                  <option value="rating">Đánh giá sao cao nhất</option>
                  <option value="duration">Thời lượng dài nhất</option>
                </select>
              </div>

            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* 4. MEDIA GALLERY GRID / PLAYLIST DISCOVERY                */}
        {/* ========================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span>Thư Viện Phát Sóng</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {filteredMediaList.length} mục
              </span>
            </h3>

            <p className="text-xs text-slate-500 hidden sm:block">
              Nhấp vào bất kỳ video hoặc soundtrack nào để phát ngay trên màn hình chính
            </p>
          </div>

          {filteredMediaList.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <Info className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">Không tìm thấy nội dung phù hợp</h4>
              <p className="text-xs text-slate-500">Hãy thử đổi từ khóa tìm kiếm hoặc bỏ bớt bộ lọc định dạng.</p>
              <button
                onClick={() => {
                  setSelectedFormat('all');
                  setSelectedUniverse('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Đặt lại tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredMediaList.map((item) => {
                const isSelected = item.id === activeMedia.id;
                const formatInfo = getFormatBadge(item.type);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActiveMediaId(item.id);
                      // Smooth scroll to top of media center if far down
                      const mediaSection = document.getElementById('multimedia');
                      if (mediaSection && window.scrollY > mediaSection.offsetTop + 400) {
                        mediaSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`group relative rounded-2xl bg-white border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400 shadow-lg'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    {/* Thumbnail Container */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Format Badge Overlay */}
                      <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1"
                          style={{ backgroundColor: formatInfo.bg, color: formatInfo.text }}
                        >
                          <formatInfo.icon className="w-3 h-3" />
                          {formatInfo.label}
                        </span>

                        {item.isLive && (
                          <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm animate-pulse">
                            LIVE
                          </span>
                        )}
                      </div>

                      {/* Duration Badge */}
                      <span className="absolute bottom-2.5 right-2.5 z-10 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-white text-[11px] font-mono font-bold">
                        {item.duration}
                      </span>

                      {/* Quick Play Hover Indicator */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                        </div>
                      </div>

                      {/* Active Currently Playing Pill */}
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 z-10 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                          ĐANG PHÁT
                        </div>
                      )}
                    </div>

                    {/* Card Content Area */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {/* Category & Artist */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mb-1">
                          <span className="text-amber-600 font-bold">{item.artist}</span>
                          <span>{item.category}</span>
                        </div>

                        {/* Title */}
                        <h4 className="text-sm font-black text-slate-900 line-clamp-2 group-hover:text-amber-600 transition-colors leading-snug">
                          {item.title}
                        </h4>
                      </div>

                      {/* Rating & Views Footer */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        {/* Rating Score */}
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-0.5 text-amber-500 font-black">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {item.rating.average}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            ({(item.rating.count / 1000).toFixed(1)}k)
                          </span>
                        </div>

                        {/* Views / Thumbs Count */}
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3 text-slate-400" />
                            {(item.rating.thumbsUp / 1000).toFixed(0)}k
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3 text-slate-400" />
                            {(item.views / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 5. MULTIMEDIA HIGHLIGHT PROTOCOL BANNER                   */}
        {/* ========================================================= */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              CHÍNH SÁCH BẢN QUYỀN & CHẤT LƯỢNG MASTER
            </div>
            <h3 className="text-xl md:text-2xl font-black">
              Âm Thanh Lossless Hi-Res & Video 4K HDR Được Cấp Phép Chính Thức
            </h3>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl font-normal">
              Toàn bộ trailer, show thực tế, podcast và soundtrack trên FanHub Multimedia Center đều được ký kết thỏa thuận phân phối bản quyền với các tập đoàn giải trí hàng đầu (HYBE, SM, YG, JYP, Ufotable, Riot Games Music).
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="#upcoming-releases"
              className="px-5 py-3 rounded-xl bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
            >
              Xem Lịch Phát Hành Tiếp Theo
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
