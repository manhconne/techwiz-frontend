import { Album, Artist, TourEvent, FeaturedArticle, UpcomingRelease } from '../types';

export const mockArtists: Artist[] = [
  // ==================== V-POP ARTISTS & SHOWS ====================
  {
    id: 'anh-trai-say-hi',
    name: 'Anh Trai "Say Hi"',
    koreanName: 'Anh Trai Say Hi',
    agency: 'Vie Channel / DatVietVAC',
    category: 'V-Pop',
    fandomName: 'SayHi Believers',
    debutYear: 2024,
    members: ['HIEUTHUHAI', 'Rhyder', 'Isaac', 'Soobin', 'ERIK', 'Quang Hung MasterD', 'Duc Phuc', 'Anh Tu Atus'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/04/HIEUTHUHAI_Rapper.jpg',
    bannerImage: 'https://upload.wikimedia.org/wikipedia/vi/7/7e/AnhTraiSayHiOpening.jpg',
    bio: 'The biggest breakthrough live concert phenomenon of 2024 with consecutive sold-out stadium shows at My Dinh National Stadium and Ho Chi Minh City.',
    totalAlbums: 3,
  },
  {
    id: 'anh-trai-vuot-ngan-chong-gai',
    name: 'Anh Trai Vuot Ngan Chong Gai',
    koreanName: 'Call Me By Fire Vietnam',
    agency: 'YAE Entertainment / VTV3',
    category: 'V-Pop',
    fandomName: 'Chong Gai Fandom Club',
    debutYear: 2024,
    members: ['Bang Kieu', 'Tu Long', 'Soobin Hoang Son', 'Cuong Seven', 'Jun Pham', 'S.T Son Thach', 'BB Tran', 'RHYDER'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/43/SOOBIN_ATVNCG2024.jpg',
    bannerImage: 'https://upload.wikimedia.org/wikipedia/commons/4/43/SOOBIN_ATVNCG2024.jpg',
    bio: 'A landmark cultural reality show gathering 33 master artists, blending traditional heritage with contemporary music across massive red-ocean stadium concerts.',
    totalAlbums: 2,
  },
  {
    id: 'sontungmtp',
    name: 'Son Tung M-TP',
    koreanName: 'Son Tung M-TP',
    agency: 'M-TP Entertainment',
    category: 'V-Pop',
    fandomName: 'SKY',
    debutYear: 2012,
    members: ['Son Tung M-TP'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Son_Tung_M-TP_1_%282017%29.png',
    bannerImage: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Son_Tung_M-TP_5_%282017%29.jpg',
    bio: 'Top-tier V-Pop icon holding multiple YouTube streaming records, monumental Sky Tour arena runs, and chart-topping international collaborations.',
    totalAlbums: 4,
  },

  // ==================== K-POP ARTISTS (PROFILES) ====================
  {
    id: 'blackpink',
    name: 'BLACKPINK',
    koreanName: '블랙핑크',
    agency: 'YG Entertainment',
    category: 'K-Pop',
    fandomName: 'BLINK',
    debutYear: 2016,
    members: ['Jisoo', 'Jennie', 'Rose', 'Lisa'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/18/20240809_Blackpink_Pink_Carpet_09.png',
    bannerImage: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Blackpink_Born_Pink_Tour_Hanoi_01.jpg',
    bio: 'Global supergroup that set historic stadium attendance records with two unforgettable BORN PINK World Tour nights at My Dinh National Stadium.',
    totalAlbums: 6,
  },
  {
    id: 'newjeans',
    name: 'NewJeans',
    koreanName: '뉴진스',
    agency: 'ADOR / HYBE',
    category: 'K-Pop',
    fandomName: 'Bunnies (Tokki)',
    debutYear: 2022,
    members: ['Minji', 'Hanni', 'Danielle', 'Haerin', 'Hyein'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/15/NewJeans_240903.jpg',
    bannerImage: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/NewJeans_230905.jpg',
    bio: 'Y2K retro pop revolution taking the global music world by storm with nostalgic beats, record-breaking streaming numbers, and trendsetting style.',
    totalAlbums: 4,
  },
  {
    id: 'bts',
    name: 'BTS',
    koreanName: '방탄소년단',
    agency: 'BIGHIT MUSIC / HYBE',
    category: 'K-Pop',
    fandomName: 'A.R.M.Y',
    debutYear: 2013,
    members: ['RM', 'Jin', 'SUGA', 'j-hope', 'Jimin', 'V', 'Jung Kook'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/73/BTS_during_a_White_House_press_conference_May_31%2C_2022_%28cropped%29.jpg',
    bannerImage: 'https://upload.wikimedia.org/wikipedia/commons/7/71/BTS_in_concert_at_Wembley_Stadium%2C_2_June_2019_01.jpg',
    bio: '21st-century pop icons connecting millions of A.R.M.Y worldwide through historic stadium world tours and inspirational chart-topping anthems.',
    totalAlbums: 9,
  },

  // ==================== ANIME & CINEMA ====================
  {
    id: 'conan',
    name: 'Detective Conan Movie',
    koreanName: '名探偵コナン',
    agency: 'TMS Entertainment / Toho',
    category: 'Anime',
    fandomName: 'Conan Global Fanclub',
    debutYear: 1996,
    members: ['Edogawa Conan', 'Kudo Shinichi', 'Ran Mouri', 'Kaito Kid', 'Heiji Hattori'],
    image: 'https://upload.wikimedia.org/wikipedia/vi/9/9d/Conan_Movie_27.jpg',
    bannerImage: 'https://upload.wikimedia.org/wikipedia/vi/9/9d/Conan_Movie_27.jpg',
    bio: 'Legendary anime mystery franchise consistently shattering summer box office records across IMAX and cinema chains worldwide.',
    totalAlbums: 5,
  },
  {
    id: 'demon-slayer',
    name: 'Demon Slayer: Kimetsu no Yaiba',
    koreanName: '鬼滅の刃',
    agency: 'ufotable / Aniplex',
    category: 'Anime',
    fandomName: 'Demon Slayer Corps',
    debutYear: 2019,
    members: ['Tanjiro', 'Nezuko', 'Zenitsu', 'Inosuke', 'Rengoku'],
    image: 'https://upload.wikimedia.org/wikipedia/vi/e/ed/Thanh_G%C6%B0%C6%A1m_Di%E1%BB%87t_Qu%E1%BB%B7_Chuy%E1%BA%BFn_T%C3%A0u_V%C3%B4_T%E1%BA%ADn_Poster.jpg',
    bannerImage: 'https://upload.wikimedia.org/wikipedia/vi/e/ed/Thanh_G%C6%B0%C6%A1m_Di%E1%BB%87t_Qu%E1%BB%B7_Chuy%E1%BA%BFn_T%C3%A0u_V%C3%B4_T%E1%BA%ADn_Poster.jpg',
    bio: 'Cinematic anime masterpiece that holds the all-time international box office record with world-class animation by ufotable.',
    totalAlbums: 3,
  },
  {
    id: 'bauhaus-atelier',
    name: 'Bauhaus Modernist Atelier',
    koreanName: '바우하우스 코스프레 아틀리에',
    agency: 'Bauhaus Dessau / Vanguard Costumes',
    category: 'Cosplay',
    fandomName: 'Constructivists',
    debutYear: 2024,
    members: ['Walter G.', 'Wassily K.', 'Oskar S.'],
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    bio: 'Pioneering theatrical costume atelier transforming pure geometry (circles, squares, triangles) and primary color theory into iconic living architectural cosplay experiences.',
    totalAlbums: 2,
  }
];

export const mockAlbums: Album[] = [
  // ---------------- V-Pop & Special Events ----------------
  {
    id: 'anh-trai-say-hi-album',
    title: 'Anh Trai "Say Hi" - Official Concert Photobook & Boxset',
    artist: 'Anh Trai "Say Hi"',
    artistId: 'anh-trai-say-hi',
    category: 'V-Pop',
    priceUSD: 25.0,
    priceVND: 620000,
    originalPriceUSD: 28.0,
    coverImage: 'https://upload.wikimedia.org/wikipedia/vi/7/7e/AnhTraiSayHiOpening.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/0/04/HIEUTHUHAI_Rapper.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/8/83/Hieuthuhai_1.jpg'
    ],
    type: 'Full Album & Merch Box',
    releaseDate: '2024-09-28',
    tag: 'Stadium Sold-Out Edition',
    rating: 4.98,
    reviewCount: 3400,
    popularityScore: 100,
    stock: 120,
    description:
      'Complete collector boxset commemorating the blockbuster Live Concert series with official 30-track CD, 140-page backstage photobook, and exclusive hologram photocards.',
    versions: [
      { id: 'sayhi-hanoi', name: 'Hanoi Stadium (My Dinh) Ver.', extraPriceUSD: 0 },
      { id: 'sayhi-hcm', name: 'Ho Chi Minh City Ver.', extraPriceUSD: 0 }
    ],
    inclusions: [
      'Deluxe Official Magnetic Hardcover Box',
      'Live Concert Photobook (140 pages, D1/D2/D3)',
      'Random Artist Metallic Photocard (2 of 30)',
      'Official Synchronized LED Concert Wristband',
      'Official CD Album featuring 30 hit tracks'
    ],
    photocards: [
      {
        member: 'HIEUTHUHAI',
        image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Hieuthuhai_1.jpg'
      }
    ],
    tracks: [
      { id: 1, title: 'Ngao Ngo (HIEUTHUHAI, Atus, Erik, JJS)', duration: '3:45', isTitleTrack: true },
      { id: 2, title: 'Catch Me If You Can', duration: '3:20', isTitleTrack: true },
      { id: 3, title: 'Bao Dong Do', duration: '3:30', isTitleTrack: false }
    ],
    reviews: [
      {
        id: 'rev-sayhi-1',
        userName: 'SayHi_Believer_Global',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/04/HIEUTHUHAI_Rapper.jpg',
        rating: 5,
        comment: 'Attended the My Dinh stadium night and immediately ordered this boxset! The printing quality and HIEUTHUHAI card are immaculate.',
        date: '2024-10-05',
        fandomTag: 'SayHi Believers'
      }
    ]
  },

  // ---------------- K-Pop Official Album Covers ----------------
  {
    id: 'bp-bornpink-hanoi',
    title: 'BLACKPINK BORN PINK World Tour Hanoi Official Souvenir Box',
    artist: 'BLACKPINK',
    artistId: 'blackpink',
    category: 'K-Pop',
    priceUSD: 35.0,
    priceVND: 880000,
    originalPriceUSD: 40.0,
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Blackpink_Born_Pink_Tour_Hanoi_02.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/e/ec/Blackpink_Born_Pink_Tour_Hanoi_01.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/bf/Blackpink_Born_Pink_Tour_Hanoi_03.jpg'
    ],
    type: 'Concert Merchandise Box',
    releaseDate: '2023-07-29',
    tag: 'Born Pink Stadium Edition',
    rating: 5.0,
    reviewCount: 4500,
    popularityScore: 100,
    stock: 40,
    description:
      'Official commemorative boxset celebrating two historic sold-out stadium nights of BORN PINK World Tour. Includes live concert photos, exclusive photocard set, and commemorative memorabilia.',
    versions: [
      { id: 'hanoi-stadium-ver', name: 'My Dinh Stadium Photo Edition', extraPriceUSD: 0 }
    ],
    inclusions: [
      'Hardcover Concert Photobook (100 pages)',
      'Exclusive 4-Member Conical Hat Hologram Photocard Set',
      'Official Commemorative Concert Wristband',
      'BORN PINK World Tour Commemorative Metallic Poster'
    ],
    photocards: [
      {
        member: 'BLACKPINK Live Stage',
        image: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Blackpink_Born_Pink_Tour_Hanoi_03.jpg'
      }
    ],
    tracks: [
      { id: 1, title: 'How You Like That (Live Stage Edition)', duration: '3:00', isTitleTrack: true },
      { id: 2, title: 'See Tinh Special Dance Performance', duration: '2:15', isTitleTrack: true },
      { id: 3, title: 'Pink Venom (Live Stadium Mix)', duration: '3:12', isTitleTrack: false }
    ],
    reviews: [
      {
        id: 'rev-hn-bp',
        userName: 'Blink_Global_VIP',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/1/18/20240809_Blackpink_Pink_Carpet_09.png',
        rating: 5,
        comment: 'The unforgettable stadium energy captured in a premium boxset. The photocards with traditional conical hats are historic collectibles!',
        date: '2023-08-02',
        fandomTag: 'BLINK World'
      }
    ]
  },
  {
    id: 'bp-black-in-your-area',
    title: 'BLACKPINK - Black In Your Area Deluxe Edition',
    artist: 'BLACKPINK',
    artistId: 'blackpink',
    category: 'K-Pop',
    priceUSD: 29.99,
    priceVND: 750000,
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/1/18/20240809_Blackpink_Pink_Carpet_09.png',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/1/18/20240809_Blackpink_Pink_Carpet_09.png'
    ],
    type: 'Full Album',
    releaseDate: '2018-12-05',
    tag: 'Official CD Edition',
    rating: 4.95,
    reviewCount: 1820,
    popularityScore: 98,
    stock: 50,
    description: 'The iconic studio album featuring high-energy signature hits with original album packaging and collectible member photocard.',
    versions: [
      { id: 'standard-edition', name: 'Standard CD Edition', extraPriceUSD: 0 }
    ],
    inclusions: [
      'Official CD Disc Album',
      '64-Page Lyric & Concept Photobook',
      'Random Hologram Photocard (1 of 4 members)'
    ],
    photocards: [],
    tracks: [
      { id: 1, title: 'DDU-DU DDU-DU', duration: '3:29', isTitleTrack: true },
      { id: 2, title: 'Forever Young', duration: '3:57', isTitleTrack: true }
    ],
    reviews: []
  },
  {
    id: 'nj-get-up-ep',
    title: "NewJeans - 2nd EP 'Get Up' (Beach Bag Ver.)",
    artist: 'NewJeans',
    artistId: 'newjeans',
    category: 'K-Pop',
    priceUSD: 24.50,
    priceVND: 590000,
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/1/15/NewJeans_240903.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/1/15/NewJeans_240903.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/b6/NewJeans_230905.jpg'
    ],
    type: 'Mini EP',
    releaseDate: '2023-07-21',
    tag: 'Y2K Retro Edition',
    rating: 4.98,
    reviewCount: 3200,
    popularityScore: 99,
    stock: 75,
    description: "The viral Y2K aesthetic EP packed in an official collectible beach bag with 84-page photobook, lyric book, and 5-member hologram card set.",
    versions: [
      { id: 'beach-bag-pink', name: 'Beach Bag Edition (Pink)', extraPriceUSD: 0 }
    ],
    inclusions: [
      'Official Transparent Beach Bag Packaging',
      '3-Booklet Photobook & Lyric Set (84p each)',
      '5-Member Complete Hologram Photocard Pack',
      'NewJeans Y2K Sticker Pack'
    ],
    photocards: [],
    tracks: [
      { id: 1, title: 'Super Shy', duration: '2:34', isTitleTrack: true },
      { id: 2, title: 'ETA', duration: '2:31', isTitleTrack: true }
    ],
    reviews: []
  },
  {
    id: 'bts-proof-collector',
    title: 'BTS - Anthology Album PROOF (Collector 3-CD Box)',
    artist: 'BTS',
    artistId: 'bts',
    category: 'K-Pop',
    priceUSD: 49.99,
    priceVND: 1250000,
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/7/71/BTS_in_concert_at_Wembley_Stadium%2C_2_June_2019_01.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/7/71/BTS_in_concert_at_Wembley_Stadium%2C_2_June_2019_01.jpg'
    ],
    type: 'Collector Boxset',
    releaseDate: '2022-06-10',
    tag: 'Official Anthology',
    rating: 5.0,
    reviewCount: 9400,
    popularityScore: 100,
    stock: 45,
    description: "Historic 3-CD anthology encapsulating BTS's 9-year discography, unreleased demo tracks, and 132-page hardcover archival art book.",
    versions: [
      { id: 'standard-3cd', name: 'Standard 3-CD Edition', extraPriceUSD: 0 }
    ],
    inclusions: [
      '3-CD Complete Anthology Disc Set',
      'The Art of Proof Hardcover Book (132p)',
      '7-Member Special Photocard Set (A & B Ver.)',
      'Epilogue Poster & Commemorative Lyric Book'
    ],
    photocards: [],
    tracks: [
      { id: 1, title: 'Yet To Come (The Most Beautiful Moment)', duration: '3:13', isTitleTrack: true },
      { id: 2, title: 'Run BTS', duration: '3:25', isTitleTrack: true }
    ],
    reviews: []
  },

  // ---------------- Anime Cinema Collector Sets ----------------
  {
    id: 'conan-movie27-box',
    title: 'Detective Conan Movie 27 - CGV Official Cinema Ticket Box',
    artist: 'Detective Conan Movie',
    artistId: 'conan',
    category: 'Anime',
    priceUSD: 18.0,
    priceVND: 450000,
    coverImage: 'https://upload.wikimedia.org/wikipedia/vi/9/9d/Conan_Movie_27.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/vi/9/9d/Conan_Movie_27.jpg',
      'https://upload.wikimedia.org/wikipedia/vi/5/58/Conan_-_The_Black_Iron_Submarine_-_Vietnam_poster.jpg'
    ],
    type: 'Cinema Limited Boxset',
    releaseDate: '2024-08-02',
    tag: 'Cinema Exclusive',
    rating: 4.92,
    reviewCount: 1100,
    popularityScore: 95,
    stock: 60,
    description:
      'Official collector boxset commemorating the premiere of Detective Conan: The Million-dollar Pentagram in major cinema circuits.',
    versions: [
      { id: 'kid-ver', name: 'Kaito Kid Edition', extraPriceUSD: 0 },
      { id: 'conan-ver', name: 'Conan Edogawa Edition', extraPriceUSD: 0 }
    ],
    inclusions: [
      'Commemorative Metallized Movie Ticket',
      'Licensed Kaito Kid x Conan Acrylic Keychain',
      'Official IMAX High-Gloss Cinema Poster',
      'Limited Character Foil Card Set'
    ],
    photocards: [],
    tracks: [
      { id: 1, title: 'Main Theme Detective Conan Cinema Mix', duration: '3:15', isTitleTrack: true }
    ],
    reviews: []
  },
  {
    id: 'demon-slayer-mugen-soundtrack',
    title: 'Demon Slayer: Kimetsu no Yaiba - Mugen Train Symphonic OST & Shonen Streetwear Collector Box',
    artist: 'Demon Slayer: Kimetsu no Yaiba',
    artistId: 'demon-slayer',
    category: 'Anime',
    priceUSD: 42.0,
    priceVND: 1050000,
    originalPriceUSD: 48.0,
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'
    ],
    type: 'OST & Vinyl',
    releaseDate: '2026-02-15',
    tag: 'Acid Lime Halftone Edition',
    rating: 4.97,
    reviewCount: 2890,
    popularityScore: 99,
    stock: 70,
    description:
      'Complete orchestral soundtrack boxset featuring Go Shiina & Yuki Kajiura master compositions, Acid Lime manga halftone artbook, and Harajuku Shonen graphic streetwear kit.',
    versions: [
      { id: 'ds-acid-lime', name: 'Acid Lime Halftone Ver.', extraPriceUSD: 0 },
      { id: 'ds-flame-black', name: 'Flame Black Edition', extraPriceUSD: 4 }
    ],
    inclusions: [
      'Deluxe 3-CD Uncut Symphonic Master Score',
      'Acid Lime Screentone 84-Page Artbook',
      'Flame Hashira Nichirin Blade Metal Bookmark',
      'Shonen Streetwear Oversized Graphic Tee Drop'
    ],
    photocards: [
      {
        member: 'Tanjiro',
        image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'
      }
    ],
    tracks: [
      { id: 1, title: 'Homura - Symphonic Orchestra Cut (LiSA)', duration: '4:35', isTitleTrack: true },
      { id: 2, title: 'Mugen Train Overture', duration: '3:50', isTitleTrack: false }
    ],
    reviews: []
  },
  {
    id: 'anime-shonen-streetwear-box',
    title: 'Pedido Street Shonen - Acid Lime Halftone Harajuku Drop & Cassette Vault',
    artist: 'Detective Conan Movie',
    artistId: 'conan',
    category: 'Anime',
    priceUSD: 36.0,
    priceVND: 900000,
    originalPriceUSD: 40.0,
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
    ],
    type: 'Figure & Merch',
    releaseDate: '2026-02-20',
    tag: 'Pedido Harajuku Drop',
    rating: 4.94,
    reviewCount: 1650,
    popularityScore: 97,
    stock: 55,
    description:
      'High-impact Harajuku techwear drop combining manga halftone screentone aesthetics, acid lime accents, heavy boxy drop-shoulder hoodie, and exclusive audio cassette mixtape.',
    versions: [
      { id: 'hoodie-lime', name: 'Acid Lime Manga Hoodie', extraPriceUSD: 0 },
      { id: 'hoodie-black', name: 'Onyx Black Screentone', extraPriceUSD: 0 }
    ],
    inclusions: [
      'Harajuku Heavyweight 420GSM Drop-Shoulder Hoodie',
      'Exclusive Acid Lime Audio Cassette Mixtape',
      'Manga Screentone Vinyl Sticker Pack',
      'Shonen Streetwear Certificate of Authenticity'
    ],
    photocards: [],
    tracks: [
      { id: 1, title: 'Tokyo Underground Halftone Beat', duration: '3:10', isTitleTrack: true }
    ],
    reviews: []
  },
  {
    id: 'album-bauhaus-cosplay-atelier',
    title: 'Bauhaus Master Modernist Atelier - 1926 Constructivist Stage Robe & Helmet Boxset',
    artist: 'Bauhaus Modernist Atelier',
    artistId: 'bauhaus-atelier',
    category: 'Cosplay',
    priceUSD: 54.0,
    priceVND: 1350000,
    originalPriceUSD: 62.0,
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
    ],
    type: 'Figure & Merch',
    releaseDate: '2026-03-01',
    tag: 'Bauhaus Limited Edition',
    rating: 4.96,
    reviewCount: 1420,
    popularityScore: 98,
    stock: 85,
    description:
      'Official Bauhaus Constructivist Atelier costume boxset with primary red, blue and yellow geometric panels, architectural metallic mask, and commemorative hand-bound design manual.',
    versions: [
      { id: 'bh-primary-red', name: 'Primary Red Edition', extraPriceUSD: 0 },
      { id: 'bh-ultramarine', name: 'Ultramarine Blue Edition', extraPriceUSD: 5 }
    ],
    inclusions: [
      'Deluxe Magnetic Geometric Box with Hard Foil Emboss',
      'Constructivist Architectural Helmet Prop',
      'Primary Color Block Cape with Modular Fasteners',
      'Triadic Form 80-Page Collector Manual',
      'Numbered Certificate of Bauhaus Authenticity'
    ],
    photocards: [
      {
        member: 'Walter G.',
        image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
      }
    ],
    tracks: [
      { id: 1, title: 'Triadic Overture in Primary Colors', duration: '4:12', isTitleTrack: true }
    ],
    reviews: []
  },
  {
    id: 'album-bauhaus-geometric-prop-kit',
    title: 'Triadic Ballet Living Geometry - Geometric Prop Kit & Primary Visor',
    artist: 'Bauhaus Modernist Atelier',
    artistId: 'bauhaus-atelier',
    category: 'Cosplay',
    priceUSD: 38.0,
    priceVND: 950000,
    originalPriceUSD: 44.0,
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
    ],
    type: 'Collector Box',
    releaseDate: '2026-02-28',
    tag: 'Atelier First Press',
    rating: 4.92,
    reviewCount: 960,
    popularityScore: 94,
    stock: 110,
    description:
      'Inspired by Oskar Schlemmer Triadic Ballet: full modular geometric prop components crafted from lightweight aerodynamic polymers with bold Bauhaus color theory.',
    versions: [
      { id: 'bh-triadic-std', name: 'Standard Modular Kit', extraPriceUSD: 0 }
    ],
    inclusions: [
      'Hard Black Stenciled Box (4px Heavy Border)',
      '3x Geometric Primary Props (Circle, Square, Triangle)',
      'Reflective Bauhaus Visor Lens',
      'Stage Assembly Blueprint'
    ],
    photocards: [],
    tracks: [
      { id: 1, title: 'Mechanical Rhythm No. 3', duration: '3:45', isTitleTrack: true }
    ],
    reviews: []
  },

];export const mockTourEvents: TourEvent[] = [
  {
    id: 'tour-cosplay-bauhaus-expo',
    artistId: 'bauhaus-atelier',
    artistName: 'Bauhaus Modernist Atelier',
    tourTitle: 'Bauhaus Living Geometry: International Cosplay & Design Expo 2026',
    tourName: 'Bauhaus Living Geometry: International Cosplay & Design Expo 2026',
    venue: 'Berlin Modernist Exhibition Hall & Arena',
    city: 'Berlin',
    country: 'Germany',
    date: '2026-04-18',
    time: '18:00',
    ticketPriceUSD: 48,
    ticketPriceFromUSD: 48,
    ticketPriceVND: 1200000,
    ticketPriceFromVND: 1200000,
    status: 'Selling Fast',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    seatMapImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    mapQuery: 'Berlin Exhibition Hall Germany',
    category: 'Cosplay',
    badgeText: 'BAUHAUS EXPO ARENA',
    description:
      'The definitive international gathering of avant-garde cosplayers, architects, and costume sculptors celebrating constructivist Bauhaus stage design.',
    perks: ['VIP Constructivist Pass', 'Signed Bauhaus Geometric Catalog', 'Exclusive Red-Ocean Prop Case']
  },

  {
    id: 'tour-atsh-hn',
    artistId: 'anh-trai-say-hi',
    artistName: 'Anh Trai "Say Hi"',
    tourTitle: 'Anh Trai "Say Hi" Live Concert Stadium Tour',
    tourName: 'Anh Trai "Say Hi" Live Concert Stadium Tour',
    venue: 'My Dinh National Stadium',
    city: 'Hanoi',
    country: 'Vietnam',
    date: '2024-12-07',
    time: '19:00',
    ticketPriceUSD: 32,
    ticketPriceFromUSD: 32,
    ticketPriceVND: 800000,
    ticketPriceFromVND: 800000,
    status: 'Sold Out',
    coverImage: 'https://upload.wikimedia.org/wikipedia/vi/7/7e/AnhTraiSayHiOpening.jpg',
    bannerImage: 'https://upload.wikimedia.org/wikipedia/vi/7/7e/AnhTraiSayHiOpening.jpg',
    seatMapImage: 'https://upload.wikimedia.org/wikipedia/commons/0/04/HIEUTHUHAI_Rapper.jpg',
    mapQuery: 'My Dinh National Stadium Hanoi',
    category: 'V-Pop',
    badgeText: 'STADIUM ARENA TOUR',
    description:
      'The blockbuster Live Concert with 30,000 screaming fans packing My Dinh National Stadium with unforgettable fireworks and hit performances.',
    perks: ['Official LED Wristband', 'Commemorative Stadium Pass', 'Fast-Track Gate Entry']
  },
  {
    id: 'tour-atvncg-hanoi',
    artistId: 'anh-trai-vuot-ngan-chong-gai',
    artistName: 'Call Me By Fire Concert',
    tourTitle: 'Call Me By Fire Vietnam 2024 Concert',
    tourName: 'Call Me By Fire Vietnam 2024 Concert',
    venue: 'Vinhomes Ocean Park 3 Grand Stage',
    city: 'Hanoi',
    country: 'Vietnam',
    date: '2024-12-14',
    time: '19:00',
    ticketPriceUSD: 35,
    ticketPriceFromUSD: 35,
    ticketPriceVND: 850000,
    ticketPriceFromVND: 850000,
    status: 'Sold Out',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/4/43/SOOBIN_ATVNCG2024.jpg',
    bannerImage: 'https://upload.wikimedia.org/wikipedia/commons/4/43/SOOBIN_ATVNCG2024.jpg',
    seatMapImage: 'https://upload.wikimedia.org/wikipedia/commons/4/43/SOOBIN_ATVNCG2024.jpg',
    mapQuery: 'Ocean Park 3 Hanoi',
    category: 'V-Pop',
    badgeText: 'NATIONAL ARENA CONCERT',
    description:
      'A masterclass music celebration featuring 33 veteran artists merging traditional folk instruments with modern rock and pop orchestration.',
    perks: ['Commemorative Scarf', 'Hologram Red-Ocean Badge', 'Collector Ticket Case']
  },
  {
    id: 'tour-bp-hanoi',
    artistId: 'blackpink',
    artistName: 'BLACKPINK',
    tourTitle: 'BLACKPINK WORLD TOUR [BORN PINK] HANOI',
    tourName: 'BLACKPINK WORLD TOUR [BORN PINK] HANOI',
    venue: 'My Dinh National Stadium',
    city: 'Hanoi',
    country: 'Vietnam',
    date: '2023-07-29',
    time: '19:30',
    ticketPriceUSD: 50,
    ticketPriceFromUSD: 50,
    ticketPriceVND: 1200000,
    ticketPriceFromVND: 1200000,
    status: 'Sold Out',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Blackpink_Born_Pink_Tour_Hanoi_03.jpg',
    bannerImage: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Blackpink_Born_Pink_Tour_Hanoi_01.jpg',
    seatMapImage: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Blackpink_Born_Pink_Tour_Hanoi_02.jpg',
    mapQuery: 'My Dinh National Stadium Hanoi',
    category: 'K-Pop',
    badgeText: 'STADIUM WORLD TOUR',
    description:
      'Historic 2-night stadium run drawing over 60,000 fans across the region, featuring legendary live band arrangements and iconic solos.',
    perks: ['VIP Soundcheck Access', 'Exclusive Tour Lanyard', 'Special VIP Merch Line']
  },
  {
    id: 'tour-bts-wembley',
    artistId: 'bts',
    artistName: 'BTS',
    tourTitle: "BTS WORLD TOUR 'LOVE YOURSELF: SPEAK YOURSELF'",
    tourName: "BTS WORLD TOUR 'LOVE YOURSELF: SPEAK YOURSELF'",
    venue: 'Wembley Stadium',
    city: 'London',
    country: 'United Kingdom',
    date: '2024-10-24',
    time: '18:00',
    ticketPriceUSD: 25,
    ticketPriceFromUSD: 25,
    ticketPriceVND: 600000,
    ticketPriceFromVND: 600000,
    status: 'Sold Out',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/7/71/BTS_in_concert_at_Wembley_Stadium%2C_2_June_2019_01.jpg',
    bannerImage: 'https://upload.wikimedia.org/wikipedia/commons/7/71/BTS_in_concert_at_Wembley_Stadium%2C_2_June_2019_01.jpg',
    seatMapImage: 'https://upload.wikimedia.org/wikipedia/commons/7/73/BTS_during_a_White_House_press_conference_May_31%2C_2022_%28cropped%29.jpg',
    mapQuery: 'Wembley Stadium London',
    category: 'K-Pop',
    badgeText: 'LEGENDARY STADIUM LIVE',
    description:
      'Historic BTS live stage at Wembley Stadium connecting millions of A.R.M.Y worldwide with an iconic stadium sea of purple lights.',
    perks: ['Official Livestream Replay', 'Digital Photocard Set', 'Global A.R.M.Y Badge']
  },
  {
    id: 'tour-conan-m27',
    artistId: 'conan',
    artistName: 'Detective Conan Movie',
    tourTitle: 'Detective Conan: The Million-dollar Pentagram Gala',
    tourName: 'Detective Conan: The Million-dollar Pentagram Gala',
    venue: 'CGV & IMAX Nationwide Circuits',
    city: 'Hanoi & HCMC',
    country: 'Vietnam',
    date: '2024-08-02',
    time: '18:30',
    ticketPriceUSD: 8,
    ticketPriceFromUSD: 8,
    ticketPriceVND: 180000,
    ticketPriceFromVND: 180000,
    status: 'Available',
    coverImage: 'https://upload.wikimedia.org/wikipedia/vi/9/9d/Conan_Movie_27.jpg',
    bannerImage: 'https://upload.wikimedia.org/wikipedia/vi/9/9d/Conan_Movie_27.jpg',
    seatMapImage: 'https://upload.wikimedia.org/wikipedia/vi/5/58/Conan_-_The_Black_Iron_Submarine_-_Vietnam_poster.jpg',
    mapQuery: 'CGV Vincom Center Ba Trieu Hanoi',
    category: 'Anime',
    badgeText: 'PREMIERE CINEMA EVENT',
    description:
      'Exclusive theatrical premiere for the record-breaking anime feature featuring Kaito Kid and Heiji Hattori in Hokkaido.',
    perks: ['Collector Metallized Ticket', 'Character Art Postcard', 'Popcorn Combo Discount']
  },
  {
    id: 'tour-demonslayer',
    artistId: 'demon-slayer',
    artistName: 'Demon Slayer: Kimetsu no Yaiba',
    tourTitle: 'Demon Slayer: Mugen Train - IMAX Special Showcase',
    tourName: 'Demon Slayer: Mugen Train - IMAX Special Showcase',
    venue: 'IMAX Laser Theatres',
    city: 'Hanoi & HCMC',
    country: 'Vietnam',
    date: '2024-09-15',
    time: '20:00',
    ticketPriceUSD: 10,
    ticketPriceFromUSD: 10,
    ticketPriceVND: 220000,
    ticketPriceFromVND: 220000,
    status: 'Available',
    coverImage: 'https://upload.wikimedia.org/wikipedia/vi/e/ed/Thanh_G%C6%B0%C6%A1m_Di%E1%BB%87t_Qu%E1%BB%B7_Chuy%E1%BA%BFn_T%C3%A0u_V%C3%B4_T%E1%BA%ADn_Poster.jpg',
    bannerImage: 'https://upload.wikimedia.org/wikipedia/vi/e/ed/Thanh_G%C6%B0%C6%A1m_Di%E1%BB%87t_Qu%E1%BB%B7_Chuy%E1%BA%BFn_T%C3%A0u_V%C3%B4_T%E1%BA%ADn_Poster.jpg',
    seatMapImage: 'https://upload.wikimedia.org/wikipedia/vi/e/ed/Thanh_G%C6%B0%C6%A1m_Di%E1%BB%87t_Qu%E1%BB%B7_Chuy%E1%BA%BFn_T%C3%A0u_V%C3%B4_T%E1%BA%ADn_Poster.jpg',
    mapQuery: 'Landmark 81 Cinema HCMC',
    category: 'Anime',
    badgeText: 'IMAX 70MM SPECIAL',
    description:
      'Experience the pulse-pounding battle between Kyojuro Rengoku and Akaza on massive IMAX screens with bone-shaking surround audio.',
    perks: ['A3 Foil Poster', 'Flame Hashira Acrylic Board', 'Exclusive Ticket Sleeve']
  },
  {
    id: 'tour-genshin-concert',
    artistId: 'genshin',
    artistName: 'HoYo-MiX & Genshin Impact',
    tourTitle: 'Genshin Concert Tour: Melodies of an Endless Journey',
    tourName: 'Genshin Concert Tour: Melodies of an Endless Journey',
    venue: 'National Convention Centre Arena',
    city: 'Hanoi',
    country: 'Vietnam',
    date: '2024-11-20',
    time: '19:30',
    ticketPriceUSD: 45,
    ticketPriceFromUSD: 45,
    ticketPriceVND: 1100000,
    ticketPriceFromVND: 1100000,
    status: 'Available',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Genshin_Concert_January_2024.jpg',
    bannerImage: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Genshin_Concert_January_2024.jpg',
    seatMapImage: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Genshin_Concert_January_2024.jpg',
    mapQuery: 'National Convention Centre Hanoi',
    category: 'Gaming',
    badgeText: 'GAMING SYMPHONY TOUR',
    description:
      'Live orchestral performance of beloved musical suites from Mondstadt, Liyue, Inazuma, Sumeru, and Fontaine conducted by a world-class symphony orchestra.',
    perks: ['In-game Wind Glider Code', 'Concert Hologram Commemorative Ticket', 'Official Symphony Artbook']
  }
];

// =========================================================================
// FEATURED ARTICLES & FAN EDITORIALS (100% ENGLISH)
// Custom styled to match visual DNA of each fandom
// =========================================================================
export const mockFeaturedArticles: FeaturedArticle[] = [
  {
    id: 'art-kpop-y2k-game-start',
    title: 'GAME START: TXT & Soobin Electrify Tokyo Dome With Nostalgic 8-Bit Pixel Stage',
    excerpt: 'Over 55,000 MOA flooded Tokyo Dome in a high-octane celebration blending nostalgic Y2K Game Boy graphics with futuristic idol stagecraft.',
    category: 'K-Pop',
    author: {
      name: 'ForeverKookie_',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'Tokyo Dome Fandom Dispatch'
    },
    date: '2026-01-22',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
    tags: ['Y2K Pixel', 'Tokyo Dome', 'TXT Soobin', 'Game Boy Style'],
    isHot: true,
    likes: 3840,
    commentsCount: 420,
    badgeText: '★ GAME START EXCLUSIVE',
    accentQuote: 'ACT:TOMORROW IN TOKYO - FAN SUPPORT BY FOREVERKOOKIE_'
  },
  {
    id: 'art-cosplay-bauhaus-constructivism',
    title: 'Bauhaus Constructivism in Cosplay: When Pure Geometry Meets Living Character Design',
    excerpt: 'Red #D02020, Blue #1040C0, Yellow #F0C020 and stark architectural silhouettes: how global cosplayers are recreating theatrical Bauhaus modernist costumes for the next generation.',
    category: 'Cosplay',
    author: {
      name: 'Elena Bauhaus',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'Avant-Garde Costume Designer'
    },
    date: '2026-02-16',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
    tags: ['Bauhaus', 'Constructivism', 'Primary Colors', 'Geometric Cosplay'],
    isHot: true,
    likes: 3890,
    commentsCount: 342,
    badgeText: '★ BAUHAUS ATELIER',
    accentQuote: 'FORM FOLLOWS FUNCTION · ARCHITECTURAL COSPLAY EXPO'
  },
  {
    id: 'art-anime-streetwear-halftone',
    title: 'Streetwear x Anime Revolution: When Manga Screentone Meets Harajuku Techwear',
    excerpt: 'From acid-lime neon halftones to oversized boxy drop-shoulder graphics, the Pedido Street Shonen aesthetic is captivating fashion-forward youth worldwide.',
    category: 'Anime',
    author: {
      name: 'Adm Lyan',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      role: 'Harajuku Fashion Editor'
    },
    date: '2026-02-05',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80',
    tags: ['Acid Lime', 'Manga Halftone', 'Streetwear', 'Tokyo Vibe'],
    isTrending: true,
    likes: 2950,
    commentsCount: 310,
    badgeText: 'PEDIDO STREET STYLE',
    accentQuote: 'INSPO IN OURLYSIE · STREETWEAR REVOLUTION'
  },
  {
    id: 'art-gaming-cyber-lightning',
    title: 'Arena Grand Finals 2026: Cyberpunk Lightning & Heavy Bass Ignite World Championship',
    excerpt: 'Electric violet strobes, holographic battle stats, and deafening roars fill the arena as top esports squads clash for the ultimate world trophy.',
    category: 'Gaming',
    author: {
      name: 'CyberViper',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: 'Championship Pro Analyst'
    },
    date: '2026-02-10',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
    tags: ['Cyber Lightning', 'Esports Arena', 'Neon Violet', 'Championship'],
    isHot: true,
    likes: 4210,
    commentsCount: 512,
    badgeText: '⚡ ARENA GRAND FINALS',
    accentQuote: 'HIGH VOLTAGE SPEED & GRAFFITI BATTLE'
  },
  {
    id: 'art-manga-estatica-monochrome',
    title: 'ESTATICA: The Pinnacle of Raw Ink Wash & Torn Paper Aesthetics in Modern Shonen',
    excerpt: 'Inside the craft of creating underground monochrome manga pages: merging gas-mask cyberpunk symbolism with raw traditional brushwork.',
    category: 'Manga',
    author: {
      name: 'Kenshi Ink',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      role: 'Master Manga Inker'
    },
    date: '2026-02-14',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80',
    tags: ['ESTATICA', 'Torn Paper', 'Black & White', 'Ink Master'],
    isTrending: true,
    likes: 3120,
    commentsCount: 280,
    badgeText: '✦ ESTATICA INK ART',
    accentQuote: 'WEBGADOS DISCORD · MONOCHROME STREET MANGA'
  },
  {
    id: 'art-comics-vintage-popart',
    title: 'The Golden Age of Comic Art: Ben-Day Dots & High-Impact Action Splash Panels',
    excerpt: 'How vintage print screen-dots and iconic sound-effect bursts like POW! continue to define superhero multiverse storytelling.',
    category: 'Comics',
    author: {
      name: 'Stan Collector',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      role: 'Vintage Comic Curator'
    },
    date: '2026-02-18',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80',
    tags: ['Ben-Day Dots', 'Pop-Art', 'Vintage Comic', 'POW! Action'],
    isHot: false,
    likes: 2180,
    commentsCount: 195,
    badgeText: '💥 POP-ART ACTION PANEL',
    accentQuote: 'CLASSIC INK & VINTAGE PULP PRINT'
  },
  {
    id: 'art-movies-imax-masterpiece',
    title: 'The 70mm IMAX Feast: Golden Hour Spotlight & The Neo-Noir Cinematic Standard',
    excerpt: 'Why master filmmakers continue to shoot on genuine 70mm chemical film reels, delivering an unmatched atmospheric depth that digital cannot replicate.',
    category: 'Movies',
    author: {
      name: 'CinePhile Pro',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      role: 'Senior Cinema Critic'
    },
    date: '2026-02-20',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80',
    tags: ['IMAX 70mm', 'Cinema Noir', 'Box Office', 'Golden Light'],
    isHot: true,
    likes: 3670,
    commentsCount: 380,
    badgeText: '🎬 CINEMA MASTERPIECE',
    accentQuote: 'DARK OBSIDIAN & AMBER GLOW SPOTLIGHT'
  }
];

// =========================================================================
// UPCOMING RELEASES & EXCLUSIVE DROPS (100% ENGLISH)
// =========================================================================
export const mockUpcomingReleases: UpcomingRelease[] = [
  {
    id: 'rel-kpop-txt-tokyo-box',
    title: 'ACT:TOMORROW in Tokyo - Game Boy Pixel Special Limited Kit',
    creatorOrArtist: 'TXT & BIGHIT MUSIC',
    category: 'K-Pop',
    type: 'Album & Lightstick Kit',
    releaseDate: '2026-03-05',
    daysRemaining: 7,
    priceVND: 950000,
    priceUSD: 38,
    status: 'Pre-Order',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    perks: ['8-Bit Hologram Pixel Photocard Set', 'Tokyo Dome LED Lightstick', '120-Page Backstage Photobook'],
    badgeText: '★ GAME START PRE-ORDER',
    platformOrVenue: 'Tokyo Dome Official Store'
  },
  {
    id: 'rel-anime-demonslayer-bluray',
    title: 'Demon Slayer: Hashira Training Arc - 4K Ultra HD Steelbook Box',
    creatorOrArtist: 'ufotable & Aniplex',
    category: 'Anime',
    type: 'Collector Boxset',
    releaseDate: '2026-03-12',
    daysRemaining: 14,
    priceVND: 1250000,
    priceUSD: 50,
    status: 'Special Edition',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    perks: ['9 Hashira Acrylic Standee Set', 'Director-Signed Premium Artbook', 'Original Symphony Soundtrack CD'],
    badgeText: '🔥 JAPAN LIMITED EDITION',
    platformOrVenue: 'SECC Expo & Cinema Centers'
  },
  {
    id: 'rel-gaming-genshin-natlan-vinyl',
    title: 'Genshin Impact: Symphony of Natlan - 3LP Colored Vinyl Boxset',
    creatorOrArtist: 'HoYo-MiX & London Philharmonic',
    category: 'Gaming',
    type: 'OST & Vinyl',
    releaseDate: '2026-03-20',
    daysRemaining: 22,
    priceVND: 1600000,
    priceUSD: 64,
    status: 'Limited Drop',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    perks: ['3 Flame-Colored Heavyweight LPs', 'In-Game 1600 Primogems Giftcode', 'Laser-Etched Certificate of Authenticity'],
    badgeText: '⚡ ONLY 500 COPIES',
    platformOrVenue: 'HoYoverse Arena Store'
  },
  {
    id: 'rel-manga-estatica-vol1',
    title: 'ESTATICA Monolith Vol. 1 - Raw Torn-Paper Limited First Print',
    creatorOrArtist: 'Webgados Studio',
    category: 'Manga',
    type: 'Manga Volume',
    releaseDate: '2026-03-08',
    daysRemaining: 10,
    priceVND: 320000,
    priceUSD: 13,
    status: 'Pre-Order',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    perks: ['Raw Torn-Paper Jacket Finish', 'Gasmask Metallic Foil Postcard', 'Engraved Metal Bookmark'],
    badgeText: '✦ MANGA PRE-ORDER',
    platformOrVenue: 'Manga Fandom Vault'
  },
  {
    id: 'rel-comics-multiverse-foil',
    title: 'The Multiverse Infinity #1 - Ben-Day Dots Gold Foil Variant',
    creatorOrArtist: 'Dynamic Comics Press',
    category: 'Comics',
    type: 'Comic Issue',
    releaseDate: '2026-03-25',
    daysRemaining: 27,
    priceVND: 450000,
    priceUSD: 18,
    status: 'Coming Soon',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    perks: ['Gold-Foil Embossed Cover', '3D Pop-Up Centerfold Battle Scene', 'Protective CGC-Grade Acrylic Slab'],
    badgeText: '💥 POP-ART COMIC DROP',
    platformOrVenue: 'Comic Book Central'
  },
  {
    id: 'rel-cosplay-shinobi-neon',
    title: 'Bauhaus Constructivist Atelier - Geometric Cosplay Robe & Primary Mask',
    creatorOrArtist: 'Bauhaus Modernist Atelier',
    category: 'Cosplay',
    type: 'Figure & Merch',
    releaseDate: '2026-03-15',
    daysRemaining: 17,
    priceVND: 2600000,
    priceUSD: 104,
    status: 'Limited Drop',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    perks: ['Pure Primary Colorblocking Cloak', 'Geometric Constructivist Mask Prop', 'Hand-Numbered Bauhaus Certificate'],
    badgeText: '★ BAUHAUS DROP',
    platformOrVenue: 'Dessau Modernist Expo'
  },
  {
    id: 'rel-movies-dune-steelbook',
    title: 'Dune Cinema Collection - IMAX 70mm Collector Steelbook',
    creatorOrArtist: 'Warner Bros & Legendary Cinema',
    category: 'Movies',
    type: 'Cinema Limited Boxset',
    releaseDate: '2026-03-28',
    daysRemaining: 30,
    priceVND: 1450000,
    priceUSD: 58,
    status: 'Pre-Order',
    coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    perks: ['Embossed Sand-Gold Steelbook Case', 'Genuine 35mm Film Cell Strip', 'Behind-the-Scenes Desert Artbook'],
    badgeText: '🎬 CINEMA STEELBOOK',
    platformOrVenue: 'CGV & IMAX Theatres'
  },
  {
    id: 'rel-tv-arcane-season2-vinyl',
    title: 'Arcane Season 2 - Deluxe Soundtrack Vinyl & Canvas Art',
    creatorOrArtist: 'Riot Games & Fortiche Animation',
    category: 'TV Shows',
    type: 'Collector Box',
    releaseDate: '2026-03-18',
    daysRemaining: 20,
    priceVND: 1850000,
    priceUSD: 74,
    status: 'Special Edition',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    perks: ['Jinx & Vi Fine-Art Canvas (40x60cm)', '2LP Shimmer-Purple Vinyl', 'Solid Enamel Zaun Crest Pin'],
    badgeText: '📺 BINGE WATCH DROP',
    platformOrVenue: 'Netflix & Riot Official Store'
  }
];
