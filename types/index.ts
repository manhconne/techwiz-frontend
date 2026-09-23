export type Language = 'en' | 'vi';

export type AlbumType = 'Full Album' | 'Mini Album' | 'Single' | 'Limited Kit' | 'Lightstick';

export interface Track {
  id: number;
  title: string;
  duration: string;
  isTitleTrack?: boolean;
  previewUrl?: string;
}

export interface Review {
  id: string;
  userName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  fandomTag: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  priceUSD: number;
  priceVND: number;
  originalPriceUSD?: number;
  coverImage: string;
  galleryImages: string[];
  type: AlbumType;
  releaseDate: string;
  tag: 'Limited Edition' | 'Pre-Order' | 'Hot Seller' | 'Restocked' | 'Collector Special';
  rating: number;
  reviewCount: number;
  popularityScore: number;
  stock: number;
  descriptionEn: string;
  descriptionVi: string;
  versions: {
    id: string;
    name: string;
    extraPriceUSD: number;
  }[];
  inclusionsEn: string[];
  inclusionsVi: string[];
  photocards: {
    member: string;
    image: string;
  }[];
  tracks: Track[];
  reviews: Review[];
  musicVideoUrl?: string;
}

export interface Artist {
  id: string;
  name: string;
  koreanName: string;
  agency: string;
  fandomName: string;
  debutYear: number;
  members: string[];
  image: string;
  bioEn: string;
  bioVi: string;
  totalAlbums: number;
  bannerImage: string;
}

export interface TourEvent {
  id: string;
  artistName: string;
  tourName: string;
  cityEn: string;
  cityVi: string;
  countryEn: string;
  countryVi: string;
  venue: string;
  date: string;
  status: 'Available' | 'Selling Fast' | 'Sold Out' | 'Presale Soon';
  ticketPriceFromUSD: number;
  ticketPriceFromVND: number;
  mapQuery: string;
}

export interface CartItem {
  album: Album;
  selectedVersion: string;
  quantity: number;
}

export interface WishlistItem {
  album: Album;
  addedAt: string;
  note?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'filter_artist' | 'view_album' | 'open_cart';
    payload: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'visitor' | 'registered' | 'admin';
  avatar: string;
  favoriteFandoms: string[];
  memberSince: string;
}
