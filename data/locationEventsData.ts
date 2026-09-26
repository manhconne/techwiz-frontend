export interface LocationEvent {
  id: string;
  title: string;
  artistOrHost: string;
  category: 'K-Pop' | 'V-Pop' | 'Anime' | 'Gaming' | 'Manga';
  type: 'stadium_concert' | 'cup_sleeve_cafe' | 'photocard_trade' | 'anime_expo' | 'gaming_arena';
  venue: string;
  address: string;
  city: 'Hanoi' | 'Ho Chi Minh' | 'Da Nang' | 'Seoul' | 'Tokyo' | 'London';
  country: string;
  lat: number;
  lng: number;
  date: string;
  time: string;
  status: 'Available' | 'Selling Fast' | 'Free RSVP' | 'Sold Out' | 'Presale Soon';
  priceVND: number;
  priceUSD: number;
  freeEntry: boolean;
  coverImage: string;
  description: string;
  perks: string[];
  attendeesCount: number;
  ticketUrl: string;
  organizer: string;
  verifiedOfficial: boolean;
  distanceKm?: number;
  seatTiers?: {
    name: string;
    priceVND: number;
    priceUSD: number;
    availableSeats: number;
    perks: string[];
  }[];
}

export const CITIES_CONFIG = [
  { id: 'Hanoi', name: 'Hà Nội', flag: '🇻🇳', lat: 21.0285, lng: 105.8542 },
  { id: 'Ho Chi Minh', name: 'TP. Hồ Chí Minh', flag: '🇻🇳', lat: 10.7769, lng: 106.7009 },
  { id: 'Da Nang', name: 'Đà Nẵng', flag: '🇻🇳', lat: 16.0544, lng: 108.2022 },
  { id: 'Seoul', name: 'Seoul', flag: '🇰🇷', lat: 37.5665, lng: 126.9780 },
  { id: 'Tokyo', name: 'Tokyo', flag: '🇯🇵', lat: 35.6762, lng: 139.6503 },
  { id: 'London', name: 'London', flag: '🇬🇧', lat: 51.5074, lng: -0.1278 },
];

export const mockLocationEvents: LocationEvent[] = [
  // -------------------- HÀ NỘI --------------------
  {
    id: 'ev-hn-atsh-stadium',
    title: 'Anh Trai "Say Hi" Live Concert 2025 Stadium Tour',
    artistOrHost: 'Anh Trai "Say Hi" All-Star Cast',
    category: 'V-Pop',
    type: 'stadium_concert',
    venue: 'Sân vận động Quốc gia Mỹ Đình',
    address: '1 Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm, Hà Nội',
    city: 'Hanoi',
    country: 'Vietnam',
    lat: 21.0205,
    lng: 105.7640,
    date: '2025-04-19',
    time: '19:00 - 23:00',
    status: 'Selling Fast',
    priceVND: 800000,
    priceUSD: 32,
    freeEntry: false,
    coverImage: 'https://upload.wikimedia.org/wikipedia/vi/7/7e/AnhTraiSayHiOpening.jpg',
    description: 'Đêm đại nhạc hội bùng nổ với 30.000 khán giả, hệ thống pháo hoa tiêu chuẩn quốc tế và dàn line-up 30 Anh Trai với các bản hit trending triệu views.',
    perks: ['Vòng tay LED phát sáng theo nhạc', 'Thẻ đeo sự kiện kỉ niệm Hologram', 'Cổng soát vé ưu tiên Fast-Track'],
    attendeesCount: 28400,
    ticketUrl: 'https://ticketbox.vn',
    organizer: 'Vie Channel & Fan Hub Plus Partner',
    verifiedOfficial: true,
    seatTiers: [
      { name: 'VIP Soundcheck Floor (Đứng gần sân khấu)', priceVND: 2200000, priceUSD: 88, availableSeats: 120, perks: ['Xem duyệt âm 45p', 'Bộ photocard độc quyền', 'Lối đi riêng'] },
      { name: 'Khán đài A Tầng 1 (Ghế ngồi trực diện)', priceVND: 1400000, priceUSD: 56, availableSeats: 350, perks: ['Tầm nhìn bao quát sân khấu', 'Poster A2 cán kim tuyến'] },
      { name: 'Khán đài B/C (Ghế tiêu chuẩn)', priceVND: 800000, priceUSD: 32, availableSeats: 580, perks: ['Vòng LED cổ tay', 'Bao đựng vé kỉ niệm'] },
    ]
  },
  {
    id: 'ev-hn-bunnies-cafe',
    title: 'NewJeans "Get Up" 2nd Anniversary Cup Sleeve & Photocard Trade',
    artistOrHost: 'Bunnies Vietnam Official Union',
    category: 'K-Pop',
    type: 'cup_sleeve_cafe',
    venue: 'The Coffee House - Hoàng Đạo Thúy',
    address: 'Tòa nhà 17T4 Hoàng Đạo Thúy, Cầu Giấy, Hà Nội',
    city: 'Hanoi',
    country: 'Vietnam',
    lat: 21.0076,
    lng: 105.8010,
    date: '2025-04-12',
    time: '09:00 - 18:00',
    status: 'Free RSVP',
    priceVND: 0,
    priceUSD: 0,
    freeEntry: true,
    coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    description: 'Sự kiện Offline miễn phí dành cho Bunnies Hà Nội! Tặng Cup sleeve kỷ niệm phiên bản giới hạn, sticker hologram và khu vực quầy bàn giao lưu, trao đổi Photocard chính hãng.',
    perks: ['Miễn phí Cup Sleeve & 3 Mini Photo', 'Rút thăm Lucky Draw Album Sealed', 'Giao lưu cộng đồng Bunnies'],
    attendeesCount: 650,
    ticketUrl: '#rsvp',
    organizer: 'Bunnies Hanoi Fanclub',
    verifiedOfficial: true,
  },
  {
    id: 'ev-hn-bts-army-meetup',
    title: 'BTS ARMY Purple Day Photocard Trade & Exhibition Lounge',
    artistOrHost: 'BTS ARMY Vietnam Universe',
    category: 'K-Pop',
    type: 'photocard_trade',
    venue: 'Highlands Coffee - Hàm Cá Mập Phố Đi Bộ',
    address: '1-3-5 Đinh Tiên Hoàng, Hàng Bạc, Hoàn Kiếm, Hà Nội',
    city: 'Hanoi',
    country: 'Vietnam',
    lat: 21.0315,
    lng: 105.8524,
    date: '2025-04-13',
    time: '14:00 - 21:00',
    status: 'Free RSVP',
    priceVND: 0,
    priceUSD: 0,
    freeEntry: true,
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    description: 'Gặp gỡ giao lưu ARMY Thủ Đô tại trung tâm Phố đi bộ Hồ Gươm. Trưng bày bộ sưu tập album hiếm, photocard Proof Era và quầy hướng dẫn voting Billboard / Mubeat.',
    perks: ['Thẻ check-in Purple Heart dập nổi', 'Photocard Fanmade hologram', 'Banner cầm tay cổ vũ'],
    attendeesCount: 1200,
    ticketUrl: '#rsvp',
    organizer: 'BTS ARMY Hanoi Chapter',
    verifiedOfficial: true,
  },
  {
    id: 'ev-hn-cosplay-winter-fest',
    title: 'Manga & Cosplay National Spring Expo 2025',
    artistOrHost: 'Vietnam Manga Federation & Shonen Jump VN',
    category: 'Anime',
    type: 'anime_expo',
    venue: 'Cung Điền Kinh Trong Nhà Hà Nội',
    address: 'Đường Trần Hữu Dực, Cầu Diễn, Nam Từ Liêm, Hà Nội',
    city: 'Hanoi',
    country: 'Vietnam',
    lat: 21.0289,
    lng: 105.7621,
    date: '2025-04-26',
    time: '08:30 - 18:30',
    status: 'Available',
    priceVND: 90000,
    priceUSD: 3.5,
    freeEntry: false,
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    description: 'Đại hội Cosplay & Manga quy mô 10.000m² với hơn 150 gian hàng artbook, figure chính hãng, khu vực chụp ảnh studio và cuộc thi Cosplay Championship.',
    perks: ['Vào cổng tự do cả ngày', 'Sticker độc quyền Manga Fest', 'Check-in Photobooth 360 độ'],
    attendeesCount: 4200,
    ticketUrl: 'https://ticketbox.vn',
    organizer: 'V-Cosplay Org',
    verifiedOfficial: true,
    seatTiers: [
      { name: 'Vé Thường Standard Entry', priceVND: 90000, priceUSD: 3.5, availableSeats: 1200, perks: ['Vào cổng tự do'] },
      { name: 'Vé VIP Fast-Pass + Goodies Bag', priceVND: 250000, priceUSD: 10, availableSeats: 180, perks: ['Cổng VIP không xếp hàng', 'Artbook bản đặc biệt', 'Poster A2 có chữ ký Khách mời'] },
    ]
  },

  // -------------------- TP. HỒ CHÍ MINH --------------------
  {
    id: 'ev-sg-atsh-encore',
    title: 'Anh Trai "Say Hi" Concert Mega Encore - Sài Gòn D-2',
    artistOrHost: 'Anh Trai "Say Hi" Cast & Guests',
    category: 'V-Pop',
    type: 'stadium_concert',
    venue: 'Sân vận động Quân Khu 7',
    address: '202 Hoàng Văn Thụ, Phường 9, Phú Nhuận, TP. Hồ Chí Minh',
    city: 'Ho Chi Minh',
    country: 'Vietnam',
    lat: 10.8012,
    lng: 106.6644,
    date: '2025-05-03',
    time: '19:00 - 23:30',
    status: 'Selling Fast',
    priceVND: 850000,
    priceUSD: 34,
    freeEntry: false,
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/4/43/SOOBIN_ATVNCG2024.jpg',
    description: 'Đêm diễn bế mạc hành trình Live Concert tại TP. Hồ Chí Minh với sân khấu xoay 360 độ cực đại, hệ thống âm thanh vòm Line-Array và các tiết mục collab chưa từng công bố.',
    perks: ['Vòng tay LED đồng bộ Bluetooth', 'Set Photocard 5 thành viên ngẫu nhiên', 'Lối vào phân làn tiện lợi'],
    attendeesCount: 29500,
    ticketUrl: 'https://ticketbox.vn',
    organizer: 'Vie Channel & Fan Hub Plus',
    verifiedOfficial: true,
    seatTiers: [
      { name: 'VIP Standing Arena A', priceVND: 2400000, priceUSD: 96, availableSeats: 85, perks: ['Cực sát sân khấu', 'Soundcheck priority', 'Quà tặng lưu niệm'] },
      { name: 'Khán đài A Trung tâm', priceVND: 1500000, priceUSD: 60, availableSeats: 290, perks: ['Ghế ngồi có đệm', 'Tầm nhìn chính diện visual'] },
      { name: 'Khán đài B/C Phổ thông', priceVND: 850000, priceUSD: 34, availableSeats: 620, perks: ['Vòng LED phát sáng', 'Bao vé độc quyền'] },
    ]
  },
  {
    id: 'ev-sg-aespa-cafe',
    title: 'aespa "Armageddon" Fan Party & Photocard Trade Lounge',
    artistOrHost: 'MY Vietnam Union',
    category: 'K-Pop',
    type: 'cup_sleeve_cafe',
    venue: 'Cheese Coffee - Sư Vạn Hạnh',
    address: '782 Sư Vạn Hạnh, Phường 12, Quận 10, TP. Hồ Chí Minh',
    city: 'Ho Chi Minh',
    country: 'Vietnam',
    lat: 10.7735,
    lng: 106.6698,
    date: '2025-04-20',
    time: '10:00 - 19:00',
    status: 'Free RSVP',
    priceVND: 0,
    priceUSD: 0,
    freeEntry: true,
    coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    description: 'Offline giao lưu fandom MY tại TP.HCM chào đón đợt comeback lịch sử. Trưng bày đĩa than vinyl, lightstick official và tặng set quà cup sleeve kim loại độc bản.',
    perks: ['Set 4 card bo góc Hologram', 'Cup sleeve kim tuyến', 'Voucher giảm 15% đồ uống'],
    attendeesCount: 820,
    ticketUrl: '#rsvp',
    organizer: 'MY Vietnam Sài Gòn Team',
    verifiedOfficial: true,
  },
  {
    id: 'ev-sg-manga-comic-con',
    title: 'Saigon Manga Comic Con & Gaming Arena 2025',
    artistOrHost: 'SMCC International Organization',
    category: 'Manga',
    type: 'anime_expo',
    venue: 'Trung tâm Triển lãm SECC Sài Gòn',
    address: '799 Nguyễn Văn Linh, Tân Phú, Quận 7, TP. Hồ Chí Minh',
    city: 'Ho Chi Minh',
    country: 'Vietnam',
    lat: 10.7308,
    lng: 106.7218,
    date: '2025-05-17',
    time: '09:00 - 20:00',
    status: 'Available',
    priceVND: 120000,
    priceUSD: 4.8,
    freeEntry: false,
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    description: 'Lễ hội truyện tranh và pop-culture lớn nhất miền Nam quy tụ hàng trăm họa sĩ manga, cosplayer quốc tế, triển lãm tượng mô hình tỷ lệ 1:1 và khu trải nghiệm game VR.',
    perks: ['Huy hiệu cài áo SMCC 2025', 'Túi tote vải Canvas giới hạn', 'Cơ hội ký tặng họa sĩ Manga Nhật'],
    attendeesCount: 8500,
    ticketUrl: 'https://ticketbox.vn',
    organizer: 'SMCC Group',
    verifiedOfficial: true,
    seatTiers: [
      { name: 'Vé 1 Ngày Vé Vào Cổng', priceVND: 120000, priceUSD: 4.8, availableSeats: 3500, perks: ['Tham gia toàn bộ gian hàng triển lãm'] },
      { name: 'Vé VIP 2 Ngày + Quà Tặng Độc Bản', priceVND: 380000, priceUSD: 15, availableSeats: 250, perks: ['Vé 2 ngày không giới hạn', 'Áo thun kỷ niệm', 'Gặp gỡ cosplayer VIP'] },
    ]
  },
  {
    id: 'ev-sg-gaming-vcs',
    title: 'League of Legends VCS Grand Finals Watch Party & Arena Live',
    artistOrHost: 'Riot Games & VNG Esports',
    category: 'Gaming',
    type: 'gaming_arena',
    venue: 'Kingdom Cyber Gaming Arena',
    address: '42 Nguyễn Thị Minh Khai, Đa Kao, Quận 1, TP. Hồ Chí Minh',
    city: 'Ho Chi Minh',
    country: 'Vietnam',
    lat: 10.7852,
    lng: 106.6985,
    date: '2025-04-27',
    time: '16:00 - 22:00',
    status: 'Selling Fast',
    priceVND: 70000,
    priceUSD: 2.8,
    freeEntry: false,
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    description: 'Trực tiếp trận chung kết tổng với màn hình LED 400-inch, bình luận trực tiếp cùng Caster nổi tiếng, minigame nhận trang phục giới hạn và bốc thăm gaming gear.',
    perks: ['Code trang phục độc quyền', 'Nước uống & Bỏng ngô miễn phí', 'Bốc thăm Bàn phím cơ & Chuột gaming'],
    attendeesCount: 450,
    ticketUrl: 'https://ticketbox.vn',
    organizer: 'VCS Community Hub',
    verifiedOfficial: true,
  },

  // -------------------- ĐÀ NẴNG --------------------
  {
    id: 'ev-dn-kwave',
    title: 'Da Nang K-Wave Music & Fandom Beach Festival',
    artistOrHost: 'Global K-Pop Artists & V-Pop Stars',
    category: 'K-Pop',
    type: 'stadium_concert',
    venue: 'Cung Thể Thao Tiên Sơn',
    address: 'Phan Đăng Lưu, Hòa Cường Bắc, Hải Châu, Đà Nẵng',
    city: 'Da Nang',
    country: 'Vietnam',
    lat: 16.0368,
    lng: 108.2245,
    date: '2025-06-14',
    time: '18:30 - 22:30',
    status: 'Available',
    priceVND: 650000,
    priceUSD: 26,
    freeEntry: false,
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    description: 'Đại nhạc hội quy mô biển miền Trung kết hợp các nghệ sĩ thần tượng Hàn Quốc và ngôi sao âm nhạc Việt Nam. Trải nghiệm âm thanh sân khấu ngoài trời rực rỡ.',
    perks: ['Vòng tay dạ quang', 'Áo thun lễ hội', 'Water-cannon cooling system'],
    attendeesCount: 15000,
    ticketUrl: 'https://ticketbox.vn',
    organizer: 'Da Nang Culture Center',
    verifiedOfficial: true,
  },

  // -------------------- SEOUL --------------------
  {
    id: 'ev-kr-bts-gocheok',
    title: 'BTS 2025 Reunion World Tour Kick-Off Stadium Night',
    artistOrHost: 'BTS (Bangtan Sonyeondan)',
    category: 'K-Pop',
    type: 'stadium_concert',
    venue: 'Gocheok Sky Dome',
    address: '430 Gyeongin-ro, Guro-gu, Seoul',
    city: 'Seoul',
    country: 'South Korea',
    lat: 37.4982,
    lng: 126.8671,
    date: '2025-07-11',
    time: '18:00 KST',
    status: 'Presale Soon',
    priceVND: 2900000,
    priceUSD: 115,
    freeEntry: false,
    coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
    description: 'Đêm diễn mở màn tour diễn thế giới hội tụ trọn vẹn 7 thành viên BTS sau thời gian hoàn thành nghĩa vụ. Độc quyền liên kết vé điện tử Weverse Identity.',
    perks: ['Weverse Global Sync Lightstick', 'Official Tour Commemorative Program', 'Soundcheck Presale Draw'],
    attendeesCount: 25000,
    ticketUrl: 'https://weverse.io',
    organizer: 'BIGHIT MUSIC / HYBE',
    verifiedOfficial: true,
  },
  {
    id: 'ev-kr-withmuu-lounge',
    title: 'Withmuu Flagship Photocard Trade & Lucky Draw Lounge',
    artistOrHost: 'Withmuu & Global K-Pop Groups',
    category: 'K-Pop',
    type: 'photocard_trade',
    venue: 'Withmuu Hongdae Flagship Store',
    address: 'Yanghwa-ro, Mapo-gu, Seoul',
    city: 'Seoul',
    country: 'South Korea',
    lat: 37.5552,
    lng: 126.9234,
    date: '2025-05-01',
    time: '10:30 - 21:00 KST',
    status: 'Free RSVP',
    priceVND: 0,
    priceUSD: 0,
    freeEntry: true,
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    description: 'Khu phức hợp chính hãng Withmuu dành cho fan quốc tế: trải nghiệm máy quay Lucky Draw tự động, photobooth idol và góc giao lưu trao đổi photocard unreleased.',
    perks: ['Máy quay Lucky Draw chính hãng', 'Thẻ quà tặng Hongdae Special Card', 'Khu nghỉ ngơi sạc điện thoại & wifi free'],
    attendeesCount: 1800,
    ticketUrl: '#rsvp',
    organizer: 'Withmuu Korea',
    verifiedOfficial: true,
  },

  // -------------------- TOKYO --------------------
  {
    id: 'ev-jp-tokyodome-live',
    title: 'K-Pop Super Stage at Tokyo Dome',
    artistOrHost: 'NewJeans, aespa, LE SSERAFIM',
    category: 'K-Pop',
    type: 'stadium_concert',
    venue: 'Tokyo Dome (東京ドーム)',
    address: '1-3-61 Koraku, Bunkyo City, Tokyo',
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.7056,
    lng: 139.7514,
    date: '2025-06-28',
    time: '17:30 JST',
    status: 'Selling Fast',
    priceVND: 2600000,
    priceUSD: 105,
    freeEntry: false,
    coverImage: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=800&q=80',
    description: 'Sân khấu huyền thoại 55.000 khán giả tại Mái vòm Tokyo Dome quy tụ các nhóm nữ hàng đầu thế hệ mới với công nghệ visual 3D hoành tráng.',
    perks: ['Glow-stick Tokyo Dome Edition', 'Lanyard đeo thẻ thẻ nhớ kỉ niệm', 'CD Single Live Exclusive'],
    attendeesCount: 55000,
    ticketUrl: 'https://l-tike.com',
    organizer: 'Lawson Ticket & Universal Music Japan',
    verifiedOfficial: true,
  },
  {
    id: 'ev-jp-akihabara-manga',
    title: 'Akihabara Manga & Anime Masterpieces Gallery 2025',
    artistOrHost: 'Shueisha & Shonen Jump Studio',
    category: 'Manga',
    type: 'anime_expo',
    venue: 'Akihabara UDX Gallery Hall',
    address: '4-14-1 Sotokanda, Chiyoda City, Tokyo',
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.7000,
    lng: 139.7719,
    date: '2025-05-10',
    time: '10:00 - 20:00 JST',
    status: 'Available',
    priceVND: 350000,
    priceUSD: 14,
    freeEntry: false,
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    description: 'Triển lãm bản thảo truyện tranh gốc Shonen Jump, các trang vẽ mực tay nguyên bản của các tác giả huyền thoại và gian hàng bán Goods độc quyền.',
    perks: ['Tấm Shikishi có chữ ký in', 'Bookmark kim loại mạ vàng', 'Catalogue triển lãm bản in đầu'],
    attendeesCount: 3200,
    ticketUrl: 'https://eplus.jp',
    organizer: 'Shueisha Exhibition Committee',
    verifiedOfficial: true,
  },

  // -------------------- LONDON --------------------
  {
    id: 'ev-uk-wembley-bts',
    title: 'BTS World Stadium Run - Wembley Historic Weekend',
    artistOrHost: 'BTS',
    category: 'K-Pop',
    type: 'stadium_concert',
    venue: 'Wembley Stadium',
    address: 'Wembley, London HA9 0WS, United Kingdom',
    city: 'London',
    country: 'United Kingdom',
    lat: 51.5560,
    lng: -0.2795,
    date: '2025-08-02',
    time: '18:30 BST',
    status: 'Available',
    priceVND: 3200000,
    priceUSD: 128,
    freeEntry: false,
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    description: 'Chuyến lưu diễn sân vận động quốc tế huyền thoại tại Wembley, London thu hút hơn 80.000 người hâm mộ từ khắp châu Âu với màn trình diễn âm nhạc đẳng cấp cao.',
    perks: ['Wembley Commemorative Wristband', 'Official Tour Hologram Pass', 'Priority Fast Lane Entry'],
    attendeesCount: 82000,
    ticketUrl: 'https://ticketmaster.co.uk',
    organizer: 'Live Nation UK',
    verifiedOfficial: true,
  }
];

/**
 * Calculate distance in km between two GPS coordinates using Haversine formula
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
