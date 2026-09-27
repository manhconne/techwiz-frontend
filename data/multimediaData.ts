export type MediaType = 'trailer' | 'video' | 'podcast' | 'livestream' | 'soundtrack';
export type FandomCategory = 'K-Pop' | 'V-Pop' | 'Anime' | 'Gaming' | 'Cinema';

export interface LiveChatMessage {
  id: string;
  user: string;
  avatar: string;
  badge?: string;
  badgeColor?: string;
  message: string;
  timestamp: string;
}

export interface ChapterMark {
  time: string;
  seconds: number;
  title: string;
}

export interface MediaRating {
  average: number;
  count: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  thumbsUp: number;
  thumbsDown: number;
  userRating?: number | null;
  userVote?: 'up' | 'down' | null;
}

export interface MediaItem {
  id: string;
  title: string;
  subtitle?: string;
  artist: string;
  agency?: string;
  type: MediaType;
  category: FandomCategory;
  thumbnailUrl: string;
  embedUrl?: string; // YouTube embed or custom video stream
  audioUrl?: string; // Audio track preview
  duration: string;
  durationSeconds: number;
  views: number;
  releaseDate: string;
  description: string;
  rating: MediaRating;
  isLive?: boolean;
  liveViewers?: number;
  liveStatusText?: string;
  chatMessages?: LiveChatMessage[];
  chapters?: ChapterMark[];
  tags: string[];
  qualityBadge?: string;
  soundtrackMeta?: {
    albumName: string;
    trackNumber: number;
    totalTracks: number;
    bitrate: string;
    composer?: string;
    lyricsSnippet?: string;
  };
  podcastMeta?: {
    host: string;
    season: number;
    episode: number;
    topics: string[];
  };
  trailerMeta?: {
    premiereDate?: string;
    productionStudio: string;
    aspectRatio: string;
  };
}

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  // 1. TRAILER: NewJeans - Supernatural Official MV
  {
    id: 'media-trailer-1',
    title: "NewJeans (뉴진스) 'Supernatural' Official Comeback MV",
    subtitle: 'Official Comeback Music Video & Visual Teaser',
    artist: 'NewJeans',
    agency: 'ADOR / HYBE Labels',
    type: 'trailer',
    category: 'K-Pop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/ZncbtRo7RXs?autoplay=1&mute=0',
    duration: '03:42',
    durationSeconds: 222,
    views: 18450200,
    releaseDate: '24/06/2024',
    description: "NewJeans summer blockbuster collaboration with music icon Pharrell Williams, infusing nostalgic 90s New Jack Swing beats. Brilliant 4K HDR visuals with authentic retro Y2K aesthetic and energetic choreography.",
    qualityBadge: '4K ULTRA HD • DOLBY ATMOS',
    rating: {
      average: 4.9,
      count: 24890,
      distribution: {
        5: 86,
        4: 10,
        3: 3,
        2: 1,
        1: 0,
      },
      thumbsUp: 312000,
      thumbsDown: 1420,
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'Intro Y2K Nostalgia' },
      { time: '00:45', seconds: 45, title: 'Chorus Hook Dance' },
      { time: '01:50', seconds: 110, title: 'Pharrell Williams Sample' },
      { time: '02:40', seconds: 160, title: 'Special Dance Break' },
      { time: '03:20', seconds: 200, title: 'Outro Scene & Credits' }
    ],
    tags: ['NewJeans', 'Supernatural', 'K-Pop', 'MV 4K', 'ADOR', 'Pharrell Williams'],
    trailerMeta: {
      premiereDate: 'June 24, 2024',
      productionStudio: 'ADOR Visual Team & Shin Woo-seok',
      aspectRatio: '16:9 DCI 4K'
    }
  },

  // 2. LIVESTREAM: SEVENTEEN World Tour [RIGHT HERE]
  {
    id: 'media-live-1',
    title: '🔴 [LIVE NOW] SEVENTEEN World Tour [RIGHT HERE] in Goyang Stadium',
    subtitle: 'Broadcasting live from Goyang Stadium • Multi-View 4K',
    artist: 'SEVENTEEN',
    agency: 'PLEDIS Entertainment',
    type: 'livestream',
    category: 'K-Pop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/zSQ48zyWZrY?autoplay=1&mute=1',
    duration: 'LIVE',
    durationSeconds: 0,
    views: 489200,
    releaseDate: 'Today',
    description: 'Opening kickoff concert for SEVENTEEN world tour with all 13 members in front of 50,000 fans. Real-time Bluetooth Caratbong lightstick syncing enabled.',
    qualityBadge: '4K MULTI-VIEW 60FPS',
    isLive: true,
    liveViewers: 38450,
    liveStatusText: '38,450 CARATs tuning in live right now',
    rating: {
      average: 5.0,
      count: 42100,
      distribution: {
        5: 94,
        4: 5,
        3: 1,
        2: 0,
        1: 0,
      },
      thumbsUp: 540000,
      thumbsDown: 820,
    },
    chatMessages: [
      { id: 'c1', user: 'MinGyu_Stan_VN', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80', badge: 'CARAT VIP', badgeColor: '#f43f5e', message: 'The sound system is insane! Mingyu visual is out of this world 🔥🔥🔥', timestamp: '11:58' },
      { id: 'c2', user: 'Seoul_Vibe_Hoshi', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', badge: 'TIGER HORANGI', badgeColor: '#f59e0b', message: 'HORANGHAE!! The Super choreography is unreal!', timestamp: '11:58' },
      { id: 'c3', user: 'MaiAnh_KpopFan', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80', badge: 'TOP FAN', badgeColor: '#10b981', message: 'Does anyone have the official ticketing link for Bangkok in December?', timestamp: '11:59' },
      { id: 'c4', user: 'Joshua_Guitar_Hero', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80', badge: 'SUPER CHAT $10', badgeColor: '#6366f1', message: 'Sending love from Vietnam to all 13 members! Stay healthy! ❤️', timestamp: '11:59' },
    ],
    tags: ['SEVENTEEN', 'RIGHT HERE', 'Livestream', 'Concert 4K', 'CARAT', 'Live Stage']
  },

  // 3. VIDEO: Say Hi All-Stars - Grand Finale Stage & Backstage Fancam 4K
  {
    id: 'media-video-1',
    title: 'Say Hi All-Stars Finale: Stage Performance & Behind-The-Scenes 4K',
    subtitle: 'Special Episode: Full Performance, Multi-angle Dance & Behind The Stage',
    artist: 'HIEUTHUHAI, Anh Tu Atus, JSOL, Erik, Quang Hung MasterD',
    agency: 'VieON / Vie Channel',
    type: 'video',
    category: 'V-Pop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/hT_nvWreIhg?autoplay=1&mute=0',
    duration: '28:15',
    durationSeconds: 1695,
    views: 8940000,
    releaseDate: '15/09/2024',
    description: 'Explosive live stage performance from Say Hi All-Stars with emotional and funny backstage moments at the monumental 25,000-seat stadium concert.',
    qualityBadge: 'FULL HD 1080P60',
    rating: {
      average: 4.8,
      count: 18760,
      distribution: {
        5: 82,
        4: 13,
        3: 3,
        2: 1,
        1: 1,
      },
      thumbsUp: 285000,
      thumbsDown: 3100,
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'Backstage choreography rehearsal' },
      { time: '06:12', seconds: 372, title: 'Exclusive backstage artist interview' },
      { time: '12:45', seconds: 765, title: 'Live Stage: Brand new audio mix' },
      { time: '21:30', seconds: 1290, title: 'Trophy ceremony & grand finale' }
    ],
    tags: ['Say Hi All-Stars', 'HIEUTHUHAI', 'V-Pop', 'Concert 2024', 'Fancam 4K']
  },

  // 4. PODCAST: Daebak Show w/ Eric Nam & aespa Karina
  {
    id: 'media-podcast-1',
    title: 'Daebak Show Ep. 165: aespa Karina & Winter on "Whiplash" & Cyberpunk Tour',
    subtitle: 'Fandom Audio Talkshow • Exclusive in-depth interview on music and creative drive',
    artist: 'Eric Nam ft. Karina & Winter (aespa)',
    agency: 'DIVE Studios',
    type: 'podcast',
    category: 'K-Pop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    embedUrl: 'https://www.youtube-nocookie.com/embed/jWQx2f-CErU?autoplay=1&mute=0',
    duration: '45:20',
    durationSeconds: 2720,
    views: 1250000,
    releaseDate: '02/10/2024',
    description: 'Special podcast episode featuring Karina & Winter sharing unreleased stories: vocal training for the Cyberpunk "Whiplash" concept, dorm life, and appreciation for global MYs.',
    qualityBadge: 'HI-RES PODCAST • STEREO MASTER',
    rating: {
      average: 4.9,
      count: 9840,
      distribution: {
        5: 89,
        4: 8,
        3: 2,
        2: 1,
        1: 0,
      },
      thumbsUp: 142000,
      thumbsDown: 640,
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'Welcoming Karina & Winter to DIVE Studio' },
      { time: '08:30', seconds: 510, title: 'The origin of the Cyberpunk concept in Whiplash' },
      { time: '22:15', seconds: 1335, title: 'Favorite food habits & trainee day memories' },
      { time: '37:40', seconds: 2260, title: 'Special heartfelt message to global MY fandom' }
    ],
    podcastMeta: {
      host: 'Eric Nam',
      season: 4,
      episode: 165,
      topics: ['K-Pop Life', 'aespa Comeback', 'Mental Health in Idol Life', 'Future Tours']
    },
    tags: ['Podcast', 'aespa', 'Karina', 'Winter', 'Eric Nam', 'DIVE Studios']
  },

  // 5. SOUNDTRACK: Queen of Tears OST - BSS (SEVENTEEN)
  {
    id: 'media-ost-1',
    title: 'Queen of Tears OST: "The Reasons of My Smiles" (자꾸만 웃게 돼) - BSS (SEVENTEEN)',
    subtitle: 'Official Original Soundtrack • Lossless 24-bit / 96kHz Hi-Res Studio Master',
    artist: 'BSS (Seungkwan, DK, Hoshi - SEVENTEEN)',
    agency: 'Studio Dragon / Genie Music',
    type: 'soundtrack',
    category: 'Cinema',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    embedUrl: 'https://www.youtube-nocookie.com/embed/kXpLzU9_kQ4?autoplay=1&mute=0',
    duration: '03:34',
    durationSeconds: 214,
    views: 34200000,
    releaseDate: '10/03/2024',
    description: 'The pan-Asian hit soundtrack from record-shattering television drama "Queen of Tears". Heartwarming vocals by SEVENTEEN subunit BSS delivering deep emotional resonance.',
    qualityBadge: 'FLAC 24-BIT / 96KHZ LOSSLESS',
    rating: {
      average: 5.0,
      count: 36500,
      distribution: {
        5: 95,
        4: 4,
        3: 1,
        2: 0,
        1: 0,
      },
      thumbsUp: 720000,
      thumbsDown: 1100,
    },
    soundtrackMeta: {
      albumName: 'Queen of Tears (Original Television Soundtrack) Pt.1',
      trackNumber: 1,
      totalTracks: 12,
      bitrate: 'FLAC 24-bit / 96kHz Lossless Studio Master',
      composer: 'Nam Hye-seung, Kim Kyung-hee',
      lyricsSnippet: 'Even through stormy rain and wind, your smile remains the only reason I want to return home...'
    },
    tags: ['Soundtrack', 'Queen of Tears', 'BSS', 'SEVENTEEN', 'K-Drama OST', 'Lossless']
  },

  // 6. TRAILER: Demon Slayer: Kimetsu no Yaiba - Infinity Castle Arc Movie Trilogy
  {
    id: 'media-trailer-2',
    title: 'Demon Slayer: Kimetsu no Yaiba "Infinity Castle" - Official 4K Movie Trailer',
    subtitle: 'Blockbuster movie trailer for the Infinity Castle Trilogy • Ufotable',
    artist: 'Ufotable & Aniplex',
    agency: 'Ufotable Animation Studio',
    type: 'trailer',
    category: 'Anime',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/f9X6GkHnS9E?autoplay=1&mute=0',
    duration: '02:48',
    durationSeconds: 168,
    views: 42100000,
    releaseDate: '2024/2025',
    description: 'Official theatrical trailer for the Infinity Castle arc: the final climactic war between the Demon Slayer Corps Hashira and Demon King Muzan Kibutsuji. Breathtaking 3D CGI visuals by Ufotable.',
    qualityBadge: 'IMAX CINEMA 4K HDR',
    rating: {
      average: 5.0,
      count: 51200,
      distribution: {
        5: 96,
        4: 3,
        3: 1,
        2: 0,
        1: 0,
      },
      thumbsUp: 1250000,
      thumbsDown: 2300,
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'The doors of the Infinity Castle unfold' },
      { time: '00:52', seconds: 52, title: 'The Hashira assemble: Giyu, Sanemi, Gyomei' },
      { time: '01:45', seconds: 105, title: 'Upper Rank One Kokushibo appears' },
      { time: '02:20', seconds: 140, title: 'Tanjiro & Sun Breathing awakening' }
    ],
    tags: ['Demon Slayer', 'Kimetsu no Yaiba', 'Anime', 'Trailer 4K', 'Ufotable', 'Infinity Castle'],
    trailerMeta: {
      premiereDate: '2025 (Worldwide Theatrical Release)',
      productionStudio: 'Ufotable & Shueisha',
      aspectRatio: '2.39:1 CinemaScope'
    }
  },

  // 7. SOUNDTRACK: Solo Leveling OST - "Dark Aria" by Hiroyuki Sawano
  {
    id: 'media-ost-2',
    title: 'Solo Leveling Season 2 OST: "Dark Aria" (Arise Anthem) - Hiroyuki Sawano',
    subtitle: 'Transformation Anthem & Shadow Monarch theme • Full Symphony Orchestra',
    artist: 'Hiroyuki Sawano ft. XAI',
    agency: 'A-1 Pictures / Sony Music Japan',
    type: 'soundtrack',
    category: 'Anime',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    embedUrl: 'https://www.youtube-nocookie.com/embed/8t3X32_1YkU?autoplay=1&mute=0',
    duration: '04:12',
    durationSeconds: 252,
    views: 19800000,
    releaseDate: '05/01/2024',
    description: 'Monumental orchestral epic by master composer Hiroyuki Sawano. Brass fanfares, operatic choral chants, and thunderous drums accompanying the legendary "Arise" moment.',
    qualityBadge: 'HI-RES AUDIO 24-BIT DSD',
    rating: {
      average: 4.9,
      count: 27900,
      distribution: {
        5: 91,
        4: 7,
        3: 2,
        2: 0,
        1: 0,
      },
      thumbsUp: 490000,
      thumbsDown: 1800,
    },
    soundtrackMeta: {
      albumName: 'Solo Leveling Original Soundtrack Vol.1',
      trackNumber: 2,
      totalTracks: 18,
      bitrate: 'Lossless Hi-Res 24-bit / 192kHz',
      composer: 'Hiroyuki Sawano',
      lyricsSnippet: 'Rise from the shadows, claim the throne that was written in your blood...'
    },
    tags: ['Solo Leveling', 'Hiroyuki Sawano', 'Dark Aria', 'Anime OST', 'Arise']
  },

  // 8. LIVESTREAM: League of Legends Worlds Championship Fan Watchalong & Concert
  {
    id: 'media-live-2',
    title: '🔴 [LIVESTREAM] LoL World Championship 2024: Opening Ceremony & Fan Watch Party',
    subtitle: 'Live opening ceremony stage featuring Linkin Park & NewJeans',
    artist: 'Riot Games Music, Linkin Park, Faker & T1',
    agency: 'Riot Games',
    type: 'livestream',
    category: 'Gaming',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/C3GouGa0noM?autoplay=1&mute=1',
    duration: 'LIVE',
    durationSeconds: 0,
    views: 1250000,
    releaseDate: 'Today',
    description: 'Live broadcast of the premier esports spectacle at the O2 Arena in London. 3D holographic augmented stage and the anthem "Heavy Is The Crown".',
    qualityBadge: '4K ULTRA LOW LATENCY',
    isLive: true,
    liveViewers: 62400,
    liveStatusText: '62,400 gamers and fans watching live right now',
    rating: {
      average: 4.9,
      count: 38200,
      distribution: {
        5: 88,
        4: 9,
        3: 2,
        2: 1,
        1: 0,
      },
      thumbsUp: 810000,
      thumbsDown: 3500,
    },
    chatMessages: [
      { id: 'c11', user: 'Faker_God_VN', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80', badge: 'T1 FANDOM', badgeColor: '#ef4444', message: 'T1 Champions! The 5th trophy for the Unkillable Demon King Faker!', timestamp: '12:01' },
      { id: 'c12', user: 'LinkinPark_Soldier', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', badge: 'VIP SUB', badgeColor: '#3b82f6', message: 'Heavy is the Crown live is unbelievable!! Emily vocals are crazy good!', timestamp: '12:02' },
      { id: 'c13', user: 'Hanoi_Esports_Fan', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80', badge: 'TOP FAN', badgeColor: '#10b981', message: '4K live stream is crystal clear with zero buffering, amazing broadcast!', timestamp: '12:02' },
    ],
    tags: ['LMHT', 'Worlds 2024', 'Faker', 'T1', 'Linkin Park', 'Gaming']
  },

  // 9. VIDEO: BTS Run BTS! Special Episode - Telepathy Challenge
  {
    id: 'media-video-2',
    title: 'Run BTS! 2024 Special Edition: "Telepathy Challenge" (Full 1080p60)',
    subtitle: 'Exclusive episode with multi-language subtitles and member individual cams',
    artist: 'BTS (RM, Jin, SUGA, j-hope, Jimin, V, Jung Kook)',
    agency: 'BIGHIT MUSIC / HYBE',
    type: 'video',
    category: 'K-Pop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/gdZLi9oWNZg?autoplay=1&mute=0',
    duration: '34:10',
    durationSeconds: 2050,
    views: 29500000,
    releaseDate: '18/07/2024',
    description: 'Legendary BTS variety show episode where the 7 members must reunite at the same location purely guided by shared memories after a decade together. Filled with heartfelt humor.',
    qualityBadge: 'FULL HD 1080P60 • MULTI-SUB',
    rating: {
      average: 5.0,
      count: 68900,
      distribution: {
        5: 97,
        4: 2,
        3: 1,
        2: 0,
        1: 0,
      },
      thumbsUp: 1450000,
      thumbsDown: 1200,
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'Intro & Telepathy Game Rules' },
      { time: '08:15', seconds: 495, title: 'The memory site linked to 2013 debut day' },
      { time: '18:40', seconds: 1120, title: 'Emotional reunion moment by the Han River' },
      { time: '29:10', seconds: 1750, title: 'BBQ dinner and heartfelt message to ARMY' }
    ],
    tags: ['BTS', 'Run BTS', 'ARMY', 'BIGHIT', 'K-Pop Show', 'Variety']
  },

  // 10. PODCAST: Fandom Radio Night - Late Night Stories With Fans
  {
    id: 'media-podcast-2',
    title: 'Fandom Radio Night #42: "A Decade of Fandom - First Concert Tickets & Cherished Memories"',
    subtitle: 'Late night fandom radio talk with Host Minh Anh & Listener letters',
    artist: 'Minh Anh & Fandom Community Guests',
    agency: 'FanHub Global Studios',
    type: 'podcast',
    category: 'V-Pop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    embedUrl: 'https://www.youtube-nocookie.com/embed/5NV6Rdv1a3I?autoplay=1&mute=0',
    duration: '52:10',
    durationSeconds: 3130,
    views: 450000,
    releaseDate: '12/10/2024',
    description: 'Reflective late-night podcast dedicated to global fandom stories. Looking back on growing up with idols, overnight ticket camping, and the joy of live arena concerts.',
    qualityBadge: 'WARM ANALOG RADIO 320KBPS',
    rating: {
      average: 4.9,
      count: 5340,
      distribution: {
        5: 89,
        4: 8,
        3: 2,
        2: 1,
        1: 0,
      },
      thumbsUp: 76000,
      thumbsDown: 310,
    },
    podcastMeta: {
      host: 'Minh Anh (FanHub Community)',
      season: 2,
      episode: 42,
      topics: ['Concert Ticketing Stories', 'Fandom Culture in VN', 'Lightstick Memories', 'Growing Up With Idols']
    },
    tags: ['Podcast', 'Radio', 'Fandom Stories', 'Late Night', 'Concert Experience']
  },

  // 11. TRAILER: Black Myth: Wukong - Cinematic Story & Orchestral Trailer
  {
    id: 'media-trailer-3',
    title: 'Black Myth: Wukong - Official Cinematic Story Trailer & Folk Symphony 4K',
    subtitle: 'Action RPG Masterpiece inspired by Journey to the West • Game Science',
    artist: 'Game Science Music Ensemble',
    agency: 'Game Science',
    type: 'trailer',
    category: 'Gaming',
    thumbnailUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/pnSsgrjpC88?autoplay=1&mute=0',
    duration: '04:30',
    durationSeconds: 270,
    views: 31200000,
    releaseDate: '20/08/2024',
    description: 'Cinematic trailer featuring an 80-piece symphony orchestra with traditional pipa and war drums. Highlighting Eastern mythology rendered in state-of-the-art Unreal Engine 5.',
    qualityBadge: '4K RAY TRACING • DOLBY CINEMA',
    rating: {
      average: 5.0,
      count: 44200,
      distribution: {
        5: 95,
        4: 4,
        3: 1,
        2: 0,
        1: 0,
      },
      thumbsUp: 980000,
      thumbsDown: 1400,
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'Pipa melodies over Mount Huaguo' },
      { time: '01:15', seconds: 75, title: 'Confrontation with Elder Jinchi' },
      { time: '02:40', seconds: 160, title: 'Climactic orchestral crescendo' },
      { time: '03:50', seconds: 230, title: 'The golden staff awakes' }
    ],
    tags: ['Black Myth Wukong', 'Gaming', 'Trailer 4K', 'Unreal Engine 5', 'Orchestra']
  },

  // 12. SOUNDTRACK: Bruno Mars & Lady Gaga - "Die With A Smile" (Acoustic Vinyl Edition)
  {
    id: 'media-ost-3',
    title: 'Lady Gaga & Bruno Mars - "Die With A Smile" (Official Acoustic Vinyl Master)',
    subtitle: 'Acoustic Guitar & Vintage Grand Piano • 24-bit Studio Master Edition',
    artist: 'Lady Gaga & Bruno Mars',
    agency: 'Interscope / Atlantic Records',
    type: 'soundtrack',
    category: 'Cinema',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    embedUrl: 'https://www.youtube-nocookie.com/embed/kPa7bsKwL-8?autoplay=1&mute=0',
    duration: '04:11',
    durationSeconds: 251,
    views: 56000000,
    releaseDate: '16/08/2024',
    description: 'Timeless Billboard Hot 100 #1 ballad. Two legendary music icons uniting their powerhouse vocals with warm acoustic guitar and grand piano arrangements.',
    qualityBadge: 'VINYL MASTER 24-BIT / 96KHZ',
    rating: {
      average: 5.0,
      count: 73400,
      distribution: {
        5: 96,
        4: 3,
        3: 1,
        2: 0,
        1: 0,
      },
      thumbsUp: 1620000,
      thumbsDown: 1900,
    },
    soundtrackMeta: {
      albumName: 'Die With A Smile - Acoustic Studio Sessions',
      trackNumber: 1,
      totalTracks: 2,
      bitrate: 'Vinyl Master Hi-Res 24-bit',
      composer: 'Bruno Mars, Lady Gaga, Andrew Watt, D’Mile',
      lyricsSnippet: 'If the world was ending, I’d wanna be next to you...'
    },
    tags: ['Die With A Smile', 'Bruno Mars', 'Lady Gaga', 'Vinyl Master', 'Acoustic']
  }
];
