'use client';

import QRCode from 'react-qr-code';
import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
const RealGpsMap = dynamic(() => import('./RealGpsMap'), { ssr: false, loading: () => <div className="w-full h-[460px] flex items-center justify-center bg-slate-100 text-slate-400 rounded-xl">Loading Map...</div> });

const Map = dynamic(() => import('./Map'), { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-xl">Loading Map...</div> });
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Calendar as CalendarIcon, 
  Clock, 
  Ticket, 
  ExternalLink, 
  Radio, 
  Users, 
  Check, 
  X, 
  Search, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  Coffee, 
  Heart, 
  Globe, 
  LocateFixed, 
  Eye, 
  Share2, 
  Layers,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  QrCode,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { 
  LocationEvent, 
  CITIES_CONFIG, 
  mockLocationEvents, 
  calculateDistanceKm 
} from '../data/locationEventsData';
import { useActiveFandom } from '../utils/fandomTheme';

interface LocationAwareEventExplorerProps {
  fandomCategory?: string;
}

export const LocationAwareEventExplorer: React.FC<LocationAwareEventExplorerProps> = ({ fandomCategory: propFandomCategory }) => {
  const { formatPrice } = useCartWishlist();
  const { themeKey, category } = useActiveFandom();
  const effectiveCategory = propFandomCategory || category;
  const isComics = themeKey === 'comics' || effectiveCategory?.toLowerCase().includes('comic');
  const isManga = themeKey === 'manga' || effectiveCategory?.toLowerCase().includes('manga');
  const isAnime = themeKey === 'anime' || effectiveCategory?.toLowerCase().includes('anime');
  const isGaming = themeKey === 'gaming' || effectiveCategory?.toLowerCase().includes('gaming') || effectiveCategory?.toLowerCase().includes('game');
  const isCosplay = themeKey === 'cosplay' || effectiveCategory?.toLowerCase().includes('cosplay');

  // User location state
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
    isGpsActive: boolean;
  }>({
    lat: 21.0285,
    lng: 105.8542,
    name: 'Hanoi, Vietnam',
    isGpsActive: false,
  });

  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Filter states
  const [selectedCity, setSelectedCity] = useState<string>('Hanoi');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(50); // 10, 35, 100, 500, 5000 (all)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'map' | 'calendar' | 'list'>('map');

  // Selected event for detail inspection and modal
  const [selectedEventId, setSelectedEventId] = useState<string>(mockLocationEvents[0].id);
  const [bookingEvent, setBookingEvent] = useState<LocationEvent | null>(null);
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(0);
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [rsvpName, setRsvpName] = useState<string>('Alex Morgan');
  const [rsvpEmail, setRsvpEmail] = useState<string>('fanhub.fan@gmail.com');
  const [rsvpPhone, setRsvpPhone] = useState<string>('+1 (555) 019-2834');
  const [bookingCompleted, setBookingCompleted] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Calendar specific state
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Auto-detect GPS Location handler
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Your browser does not support HTML5 Geolocation.');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
          name: `Your GPS Location (${latitude.toFixed(3)}°, ${longitude.toFixed(3)}°)`,
          isGpsActive: true,
        });
        setIsLocating(false);
        // Find nearest city
        let nearestCity = CITIES_CONFIG[0];
        let minD = Infinity;
        CITIES_CONFIG.forEach(c => {
          const d = calculateDistanceKm(latitude, longitude, c.lat, c.lng);
          if (d < minD) {
            minD = d;
            nearestCity = c;
          }
        });
        setSelectedCity(nearestCity.id);
        setMaxRadiusKm(100); // broaden radius to catch local events
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Unable to acquire GPS coordinates. Please grant location permissions in your browser.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied. Please select a city manually below.';
        }
        setGpsError(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // City preset switch handler
  const handleSelectCityPreset = (cityId: string) => {
    const target = CITIES_CONFIG.find(c => c.id === cityId);
    if (target) {
      setSelectedCity(cityId);
      setUserLocation({
        lat: target.lat,
        lng: target.lng,
        name: `${target.name} (${target.flag})`,
        isGpsActive: false,
      });
      setGpsError(null);
    }
  };

  // Calculate distance for all events and sort / filter
  const eventsWithDistance = useMemo(() => {
    return mockLocationEvents.map(ev => {
      const distance = calculateDistanceKm(userLocation.lat, userLocation.lng, ev.lat, ev.lng);
      return {
        ...ev,
        distanceKm: distance
      };
    });
  }, [userLocation]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return eventsWithDistance.filter(ev => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = ev.title.toLowerCase().includes(q);
        const matchVenue = ev.venue.toLowerCase().includes(q);
        const matchArtist = ev.artistOrHost.toLowerCase().includes(q);
        const matchAddress = ev.address.toLowerCase().includes(q);
        if (!matchTitle && !matchVenue && !matchArtist && !matchAddress) return false;
      }

      // Event Type
      if (selectedType !== 'all' && ev.type !== selectedType) {
        return false;
      }

      // Category
      if (selectedCategory !== 'all' && ev.category !== selectedCategory) {
        return false;
      }

      // Radius filter: only apply if not 'All / 5000km'
      if (maxRadiusKm < 5000 && ev.distanceKm > maxRadiusKm) {
        return false;
      }

      // Date filter
      if (selectedDate && ev.date !== selectedDate) {
        return false;
      }

      return true;
    }).sort((a, b) => a.distanceKm - b.distanceKm); // Closest first
  }, [eventsWithDistance, searchQuery, selectedType, selectedCategory, maxRadiusKm, selectedDate]);

  // Selected event object
  const activeEvent = useMemo(() => {
    return eventsWithDistance.find(e => e.id === selectedEventId) || filteredEvents[0] || eventsWithDistance[0];
  }, [eventsWithDistance, selectedEventId, filteredEvents]);

  // Keep selectedEventId synced if filtered list changes
  useEffect(() => {
    if (filteredEvents.length > 0 && !filteredEvents.some(e => e.id === selectedEventId)) {
      setSelectedEventId(filteredEvents[0].id);
    }
  }, [filteredEvents, selectedEventId]);

  // Dates present in events for calendar
  const eventDates = useMemo(() => {
    const dates = new Set<string>();
    mockLocationEvents.forEach(e => dates.add(e.date));
    return Array.from(dates).sort();
  }, []);

  const handleShare = (event: LocationEvent) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/event#${event.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getEventTypeBadge = (type: LocationEvent['type']) => {
    if (isComics) {
      switch (type) {
        case 'stadium_concert':
          return { label: 'Concert & Stadium Tour', icon: Ticket, color: 'bg-[#ef4444] text-white border-2 border-black font-bold' };
        case 'cup_sleeve_cafe':
          return { label: 'Cup Sleeve & Birthday Cafe', icon: Coffee, color: 'bg-[#ec4899] text-white border-2 border-black font-bold' };
        case 'photocard_trade':
          return { label: 'Photocard Trade Lounge', icon: Sparkles, color: 'bg-[#8b5cf6] text-white border-2 border-black font-bold' };
        case 'anime_expo':
          return { label: 'Manga & Cosplay Expo', icon: Layers, color: 'bg-[#ffd60a] text-black border-2 border-black font-bold' };
        case 'gaming_arena':
          return { label: 'Gaming Arena Live Watch', icon: Radio, color: 'bg-[#00f0ff] text-black border-2 border-black font-bold' };
        default:
          return { label: 'Comic Fandom Event', icon: Compass, color: 'bg-[#ef4444] text-white border-2 border-black font-bold' };
      }
    }
    switch (type) {
      case 'stadium_concert':
        return { label: 'Concert & Stadium Tour', icon: Ticket, color: 'bg-blue-600 text-white border-blue-500' };
      case 'cup_sleeve_cafe':
        return { label: 'Cup Sleeve & Birthday Cafe', icon: Coffee, color: 'bg-pink-600 text-white border-pink-500' };
      case 'photocard_trade':
        return { label: 'Photocard Trade Lounge', icon: Sparkles, color: 'bg-purple-600 text-white border-purple-500' };
      case 'anime_expo':
        return { label: 'Manga & Cosplay Expo', icon: Layers, color: 'bg-rose-600 text-white border-rose-500' };
      case 'gaming_arena':
        return { label: 'Gaming Arena Live Watch', icon: Radio, color: 'bg-emerald-600 text-white border-emerald-500' };
      default:
        return { label: 'Fandom Event', icon: Compass, color: 'bg-slate-900 text-white border-slate-700' };
    }
  };

  return (
    <section 
      id="location-events"
      style={{ scrollMarginTop: '100px' }}
      className={`py-16 sm:py-24 w-full border-t border-b ${
        isComics ? 'bg-transparent border-black' : 'bg-slate-50/70 border-slate-200/90'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* ==================== 1. Editorial Section Header ==================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-2.5 ${
              isComics 
                ? 'bg-[#ffd60a] text-black border-2 border-black font-mono shadow-[2px_2px_0px_#000000] rounded-none' 
                : 'bg-blue-50 text-blue-700 border border-blue-200/80 rounded-full'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isComics ? 'bg-[#ef4444]' : 'bg-blue-600'} animate-ping`} />
              <LocateFixed size={12} className={isComics ? 'text-black' : 'text-blue-600'} />
              <span>Location-Aware Event Radar &amp; GPS Discovery</span>
            </div>

            <h2 
              style={{ fontFamily: isComics ? "var(--font-bangers), 'Bangers', cursive, sans-serif" : undefined }}
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase m-0 ${
                isComics ? 'text-black tracking-wide' : 'text-slate-900 font-sans'
              }`}
            >
              Discover Events <span className={isComics ? 'text-[#ef4444]' : 'text-blue-600'}>&amp; Meetups Near You</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl font-normal leading-relaxed">
              Live GPS radar automatically locates stadium concert tours, birthday cup-sleeve cafes, manga and cosplay expos, and official photocard trading meetups near you.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className={`flex items-center gap-1.5 p-1 self-start md:self-auto shrink-0 ${
            isComics 
              ? 'bg-white border-2 border-black shadow-[3px_3px_0px_#000000] rounded-none' 
              : 'rounded-xl bg-white border border-slate-200/90 shadow-2xs'
          }`}>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isComics
                  ? viewMode === 'map'
                    ? 'bg-[#ef4444] text-white border-2 border-black shadow-[2px_2px_0px_#000000] rounded-none font-bold'
                    : 'text-black hover:bg-[#fef9c3] rounded-none font-bold'
                  : viewMode === 'map'
                    ? 'bg-slate-900 text-white shadow-xs rounded-lg'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg'
              }`}
            >
              <Navigation size={13} />
              <span>GPS Map</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isComics
                  ? viewMode === 'calendar'
                    ? 'bg-[#ef4444] text-white border-2 border-black shadow-[2px_2px_0px_#000000] rounded-none font-bold'
                    : 'text-black hover:bg-[#fef9c3] rounded-none font-bold'
                  : viewMode === 'calendar'
                    ? 'bg-slate-900 text-white shadow-xs rounded-lg'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg'
              }`}
            >
              <CalendarIcon size={13} />
              <span>Event Calendar</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isComics
                  ? viewMode === 'list'
                    ? 'bg-[#ef4444] text-white border-2 border-black shadow-[2px_2px_0px_#000000] rounded-none font-bold'
                    : 'text-black hover:bg-[#fef9c3] rounded-none font-bold'
                  : viewMode === 'list'
                    ? 'bg-slate-900 text-white shadow-xs rounded-lg'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg'
              }`}
            >
              <Users size={13} />
              <span>List View ({filteredEvents.length})</span>
            </button>
          </div>
        </div>

        {/* ==================== 2. GPS Locator Bar & City Pills ==================== */}
        <div className={`p-4 sm:p-5 mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 ${
          isComics 
            ? 'bg-white border-3 border-black shadow-[4px_4px_0px_#000000] rounded-none' 
            : 'rounded-2xl bg-white border border-slate-200/90 shadow-sm'
        }`}>
          
          {/* GPS Auto-Detect Button & Current Coordinates indicator */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleDetectGps}
              disabled={isLocating}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isComics
                  ? userLocation.isGpsActive
                    ? 'bg-[#10b981] text-white border-2 border-black shadow-[3px_3px_0px_#000000] rounded-none'
                    : 'bg-[#ef4444] hover:bg-[#dc2626] text-white border-2 border-black shadow-[3px_3px_0px_#000000] rounded-none'
                  : userLocation.isGpsActive
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 rounded-xl shadow-xs'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 rounded-xl shadow-xs'
              }`}
            >
              <LocateFixed size={14} className={isLocating ? 'animate-spin' : ''} />
              <span>
                {isLocating ? 'Scanning satellite GPS...' : userLocation.isGpsActive ? '✓ Using Live GPS' : 'Enable GPS Near Me'}
              </span>
            </button>

            <div className={`flex items-center gap-2 px-3 py-2 text-xs font-medium ${
              isComics 
                ? 'rounded-none bg-[#fffdf0] border-2 border-black text-black font-mono font-bold' 
                : 'rounded-xl bg-slate-100/90 border border-slate-200 text-slate-700'
            }`}>
              <MapPin size={13} className="text-rose-500 shrink-0" />
              <span className="truncate max-w-[240px] sm:max-w-none">
                {userLocation.name}
              </span>
            </div>

            {gpsError && (
              <span className="text-[11.5px] text-amber-600 font-medium bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                ⚠️ {gpsError}
              </span>
            )}
          </div>

          {/* Quick City Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-[11px] font-bold uppercase text-slate-400 font-mono shrink-0 mr-1">
              City:
            </span>
            {CITIES_CONFIG.map(city => {
              const isActive = selectedCity === city.id && !userLocation.isGpsActive;
              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleSelectCityPreset(city.id)}
                  className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                    isComics
                      ? isActive
                        ? 'bg-[#ffd60a] text-black border-2 border-black shadow-[2px_2px_0px_#000000] rounded-none'
                        : 'bg-white text-black border border-black hover:bg-[#fef9c3] rounded-none'
                      : isActive
                        ? 'bg-slate-900 text-white shadow-2xs rounded-lg'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900 rounded-lg'
                  }`}
                >
                  <span>{city.flag}</span>
                  <span>{city.name}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* ==================== 3. Filter Controls: Radius, Type, Search ==================== */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 flex-wrap">
          
          {/* Radius Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            <span className={`text-[10.5px] font-mono font-bold uppercase tracking-wider shrink-0 mr-1 ${
              isComics ? 'text-black' : 'text-slate-400'
            }`}>
              Radius:
            </span>
            {[
              { val: 15, label: '< 15 km' },
              { val: 35, label: '< 35 km' },
              { val: 150, label: '< 150 km' },
              { val: 5000, label: 'Global (All)' },
            ].map(r => (
              <button
                key={r.val}
                type="button"
                onClick={() => setMaxRadiusKm(r.val)}
                className={`px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  isComics
                    ? maxRadiusKm === r.val
                      ? 'bg-[#ef4444] text-white border-2 border-black shadow-[2px_2px_0px_#000000] rounded-none font-bold'
                      : 'bg-white border-2 border-black text-black hover:bg-[#fef9c3] rounded-none font-bold'
                    : maxRadiusKm === r.val
                      ? 'bg-blue-600 text-white shadow-2xs rounded-full'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 rounded-full'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Event Category Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className={`flex items-center gap-1 ${
              isComics ? 'bg-white p-1 rounded-none border-2 border-black shadow-[2px_2px_0px_#000000]' : 'bg-white p-1 rounded-xl border border-slate-200 shadow-2xs'
            } text-xs`}>
              {[
                { id: 'all', label: 'All Types' },
                { id: 'stadium_concert', label: 'Concert' },
                { id: 'cup_sleeve_cafe', label: 'Cafe Meetup' },
                { id: 'photocard_trade', label: 'Trade Lounge' },
                { id: 'anime_expo', label: 'Manga / Cosplay' },
                { id: 'gaming_arena', label: 'Gaming' },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedType(t.id)}
                  className={`px-2.5 py-1 font-bold transition-all cursor-pointer ${
                    isComics
                      ? selectedType === t.id
                        ? 'bg-[#ffd60a] text-black border-2 border-black rounded-none shadow-[1px_1px_0px_#000000]'
                        : 'text-black hover:bg-[#fef9c3] rounded-none'
                      : selectedType === t.id
                        ? 'bg-slate-900 text-white rounded-lg'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Keyword Search */}
            <div className="relative min-w-[220px]">
              <Search size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isComics ? 'text-black' : 'text-slate-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search venue, artist, tour..."
                className={`w-full pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-2xs font-sans ${
                  isComics
                    ? 'bg-white border-2 border-black rounded-none shadow-[2px_2px_0px_#000000] focus:border-[#ef4444] text-black font-medium'
                    : 'bg-white border border-slate-200 rounded-xl focus:border-blue-500'
                }`}
              />
            </div>
          </div>

        </div>

        {/* ==================== 4. MAIN INTERACTIVE CONTENT AREA ==================== */}

        {/* --- VIEW MODE 1: INTERACTIVE GPS RADAR MAP + SPLIT LIST --- */}
        {viewMode === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 7 Columns: High-Tech GPS Interactive Map Canvas / Radar */}
            <div className={`lg:col-span-7 overflow-hidden relative min-h-[460px] sm:min-h-[540px] flex flex-col justify-between ${
              isComics
                ? 'rounded-none bg-slate-900 border-3 border-black shadow-[6px_6px_0px_#000000]'
                : 'rounded-2xl bg-slate-900 border border-slate-800 shadow-xl'
            }`}>
              
              {/* Map Top Overlay HUD: GPS Status & Stats */}
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-3 pointer-events-none">
                <div className={`pointer-events-auto px-3 py-1.5 flex items-center gap-2 ${
                  isComics
                    ? 'rounded-none bg-black border-2 border-white text-white font-mono shadow-[2px_2px_0px_#ef4444]'
                    : 'rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-white shadow-lg'
                }`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${isComics ? 'bg-[#ffd60a]' : 'bg-emerald-400'} animate-ping`} />
                  <span className="text-[11px] font-mono font-bold tracking-wider uppercase">
                    Satellite GPS Radar: {filteredEvents.length} Active Venues
                  </span>
                </div>

                <div className="pointer-events-auto flex items-center gap-2">
                  <span className={`px-2.5 py-1 text-[10px] font-mono ${
                    isComics
                      ? 'rounded-none bg-black border-2 border-white text-white'
                      : 'rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-slate-300'
                  }`}>
                    Coordinates: {userLocation.lat.toFixed(2)}°N, {userLocation.lng.toFixed(2)}°E
                  </span>
                </div>
              </div>

              {/* REAL LEAFLET GPS MAP OVERLAY */}
              <div className={`relative w-full h-[460px] sm:h-[540px] z-10 overflow-hidden shadow-inner ${
                isComics ? 'rounded-none border-b-2 border-black' : 'rounded-xl border border-slate-200'
              }`}>
                <RealGpsMap 
                  events={filteredEvents}
                  activeEvent={activeEvent}
                  onEventClick={(ev) => setSelectedEventId(ev.id)}
                />
              </div>

              {/* Map Bottom Legend / Compass Bar */}
              <div className={`p-3.5 border-t text-xs flex items-center justify-between flex-wrap gap-2 z-10 ${
                isComics
                  ? 'bg-black border-black text-white'
                  : 'bg-slate-950/90 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center gap-3 text-[11px] font-medium flex-wrap">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> You
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Concert
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-400" /> Cafe Meetup
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Manga/Cosplay
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeEvent) {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${activeEvent.lat},${activeEvent.lng}`;
                        window.open(url, '_blank');
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                      isComics
                        ? 'bg-[#ef4444] hover:bg-[#dc2626] text-white border-2 border-black shadow-[2px_2px_0px_#000000] rounded-none'
                        : 'bg-blue-600 hover:bg-blue-700 text-white rounded-lg'
                    }`}
                  >
                    <Compass size={12} />
                    <span>Google Maps Directions</span>
                    <ArrowUpRight size={11} />
                  </button>
                </div>
              </div>

            </div>

            {/* Right 5 Columns: Active Event Spotlight Card & Quick List */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              
              {/* Highlight Card for Active Selected Pin */}
              {activeEvent ? (
                <div className={`p-5 sm:p-6 relative overflow-hidden transition-all ${
                  isComics
                    ? 'rounded-none bg-white border-3 border-black shadow-[6px_6px_0px_#000000]'
                    : 'rounded-2xl bg-white border-2 border-blue-600/90 shadow-lg'
                }`}>
                  
                  {/* Category Pill & Distance Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                      isComics
                        ? 'rounded-none border-2 border-black shadow-[2px_2px_0px_#000000]'
                        : 'rounded-full shadow-2xs'
                    } ${getEventTypeBadge(activeEvent.type).color}`}>
                      <Radio size={11} className="animate-pulse" />
                      <span>{getEventTypeBadge(activeEvent.type).label}</span>
                    </span>

                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-mono font-bold ${
                      isComics
                        ? 'rounded-none bg-[#ffd60a] text-black border-2 border-black shadow-[2px_2px_0px_#000000]'
                        : 'rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      <LocateFixed size={12} className={isComics ? 'text-black' : 'text-emerald-600'} />
                      <span>{activeEvent.distanceKm} km away</span>
                    </span>
                  </div>

                  {/* Image & Title */}
                  <div className={`relative aspect-[16/9] overflow-hidden mb-4 bg-slate-100 ${
                    isComics ? 'rounded-none border-2 border-black' : 'rounded-xl border border-slate-200'
                  }`}>
                    <img 
                      src={activeEvent.coverImage} 
                      alt={activeEvent.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className={`text-[10px] font-mono uppercase tracking-widest font-bold block mb-0.5 ${
                        isComics ? 'text-[#ffd60a]' : 'text-amber-300'
                      }`}>
                        {activeEvent.artistOrHost}
                      </span>
                      <h3 
                        className={`text-base sm:text-lg font-black leading-tight text-white m-0 ${
                          isComics ? 'tracking-wide' : ''
                        }`}
                        style={{
                          fontFamily: isComics ? "var(--font-bangers), 'Bangers', cursive, sans-serif" : undefined
                        }}
                      >
                        {activeEvent.title}
                      </h3>
                    </div>
                  </div>

                  {/* Details: Venue, Date, Time */}
                  <div className="space-y-2 mb-4 text-xs">
                    <div className="flex items-start gap-2 text-slate-700">
                      <MapPin size={14} className="text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block font-bold">{activeEvent.venue}</strong>
                        <span className="text-slate-500 text-[11.5px] leading-tight block">{activeEvent.address}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon size={13} className={isComics ? 'text-[#ef4444]' : 'text-blue-600'} />
                        <span className="font-semibold text-slate-900">{activeEvent.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-amber-600" />
                        <span>{activeEvent.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description Excerpt */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {activeEvent.description}
                  </p>

                  {/* Perks chips */}
                  {activeEvent.perks && activeEvent.perks.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mb-5">
                      {activeEvent.perks.slice(0, 2).map((p, pIdx) => (
                        <span key={pIdx} className={`text-[10.5px] font-medium px-2 py-0.5 ${
                          isComics
                            ? 'rounded-none bg-[#fef9c3] text-black border border-black font-bold'
                            : 'rounded bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          ✓ {p}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Row: Price & Booking */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider block">
                        {activeEvent.freeEntry ? 'Admission' : 'Tickets From'}
                      </span>
                      <div className="text-base sm:text-lg font-black text-slate-950 font-mono">
                        {activeEvent.freeEntry ? (
                          <span className={isComics ? 'text-[#ef4444]' : 'text-emerald-600'}>Free Admission (RSVP)</span>
                        ) : (
                          formatPrice(activeEvent.priceUSD, activeEvent.priceVND)
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleShare(activeEvent)}
                        className={`p-2.5 transition-colors cursor-pointer ${
                          isComics
                            ? 'rounded-none border-2 border-black bg-white hover:bg-[#fef9c3] shadow-[2px_2px_0px_#000000] text-black'
                            : 'rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                        title="Share event link"
                      >
                        {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setBookingEvent(activeEvent);
                          setBookingCompleted(false);
                        }}
                        style={{
                          backgroundColor: isComics ? '#ffd60a' : '#000000',
                          color: isComics ? '#000000' : '#ffffff',
                          border: isComics ? '2px solid #000000' : 'none',
                          boxShadow: isComics ? '3px 3px 0px #000000' : 'none',
                          borderRadius: isComics ? '0px' : '12px',
                        }}
                        className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer font-mono"
                      >
                        <Ticket size={13} style={{ color: isComics ? '#000000' : '#ffffff' }} />
                        <span>{activeEvent.freeEntry ? 'RSVP Now' : 'Book Tickets'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                <div className={`p-8 text-center text-sm ${
                  isComics
                    ? 'rounded-none bg-white border-2 border-black text-black'
                    : 'rounded-2xl bg-white border border-slate-200 text-slate-500'
                }`}>
                  No events found within the selected radius. Try expanding your radius or selecting another city.
                </div>
              )}

              {/* Quick Scrollable Nearby Events List Below Spotlight */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                <span className={`text-[11px] font-bold uppercase tracking-wider font-mono block px-1 ${
                  isComics ? 'text-black' : 'text-slate-400'
                }`}>
                  Other nearby venues ({filteredEvents.length}):
                </span>
                {filteredEvents.map(ev => {
                  const isCurrent = ev.id === activeEvent?.id;
                  return (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedEventId(ev.id)}
                      className={`p-3 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isComics
                          ? isCurrent 
                            ? 'bg-[#ffd60a] border-2 border-black shadow-[3px_3px_0px_#000000] rounded-none text-black' 
                            : 'bg-white border-2 border-black hover:bg-[#fef9c3] rounded-none text-black shadow-[1px_1px_0px_#000000]'
                          : isCurrent 
                            ? 'bg-blue-50/80 border-blue-400 shadow-2xs rounded-xl' 
                            : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 rounded-xl'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 ${
                            isComics
                              ? 'bg-black text-white rounded-none'
                              : 'rounded bg-slate-100 text-slate-700'
                          }`}>
                            {ev.city}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate block">
                            {ev.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                          {ev.venue}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[11px] font-mono font-bold block ${
                          isComics ? 'text-[#ef4444]' : 'text-blue-600'
                        }`}>
                          {ev.distanceKm} km
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {ev.date}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        )}

        {/* --- VIEW MODE 2: CALENDAR VIEW --- */}
        {viewMode === 'calendar' && (
          <div className={`p-6 sm:p-8 ${
            isComics
              ? 'rounded-none bg-white border-3 border-black shadow-[6px_6px_0px_#000000]'
              : 'rounded-2xl bg-white border border-slate-200/90 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 
                  className="text-lg sm:text-xl font-black text-slate-900 uppercase"
                  style={{ fontFamily: isComics ? "var(--font-bangers), 'Bangers', cursive, sans-serif" : undefined }}
                >
                  Fandom Event Schedule by Date
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select a date to filter stadium concerts, offline meetups, and anime expos.
                </p>
              </div>

              {selectedDate && (
                <button
                  type="button"
                  onClick={() => setSelectedDate('')}
                  className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                    isComics
                      ? 'rounded-none bg-[#ef4444] text-white border-2 border-black shadow-[2px_2px_0px_#000000]'
                      : 'rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  ✕ Clear date filter ({selectedDate})
                </button>
              )}
            </div>

            {/* Horizontal Timeline Date Picker */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none mb-6">
              {eventDates.map(dateStr => {
                const count = mockLocationEvents.filter(e => e.date === dateStr).length;
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDate(isSelected ? '' : dateStr)}
                    className={`p-3 text-center transition-all cursor-pointer min-w-[100px] shrink-0 ${
                      isComics
                        ? isSelected
                          ? 'rounded-none bg-[#ffd60a] text-black border-2 border-black shadow-[3px_3px_0px_#000000] font-bold'
                          : 'rounded-none bg-white border-2 border-black hover:bg-[#fef9c3] text-black'
                        : isSelected
                          ? 'rounded-xl bg-slate-900 text-white border-slate-900 shadow-md'
                          : 'rounded-xl bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                    }`}
                  >
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                      {new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="text-base font-black block my-0.5">
                      {dateStr.split('-').slice(1).join('/')}
                    </span>
                    <span className={`text-[9.5px] font-bold px-1.5 py-0.5 inline-block ${
                      isComics
                        ? isSelected ? 'bg-black text-white rounded-none' : 'bg-[#fffdf0] border border-black text-black rounded-none'
                        : isSelected ? 'bg-blue-500 text-white rounded-full' : 'bg-slate-100 text-slate-700 rounded-full'
                    }`}>
                      {count} {count === 1 ? 'event' : 'events'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Event Grid for Calendar Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(ev => (
                <div
                  key={ev.id}
                  className={`overflow-hidden bg-white transition-all flex flex-col justify-between p-5 ${
                    isComics
                      ? 'rounded-none border-2 border-black shadow-[4px_4px_0px_#000000] hover:translate-y-[-2px]'
                      : 'rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        isComics ? 'rounded-none border border-black shadow-[1px_1px_0px_#000000]' : 'rounded-full'
                      } ${getEventTypeBadge(ev.type).color}`}>
                        {getEventTypeBadge(ev.type).label}
                      </span>
                      <span className={`text-xs font-mono font-bold ${isComics ? 'text-[#ef4444]' : 'text-blue-600'}`}>
                        {ev.distanceKm} km away
                      </span>
                    </div>

                    <div className={`relative aspect-[16/10] overflow-hidden mb-3 bg-slate-100 ${
                      isComics ? 'rounded-none border-2 border-black' : 'rounded-xl'
                    }`}>
                      <img src={ev.coverImage} alt={ev.title} className="w-full h-full object-cover" />
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 font-bold block uppercase mb-1">
                      {ev.artistOrHost}
                    </span>
                    <h4 
                      className="text-base font-bold text-slate-900 line-clamp-1 mb-2"
                      style={{ fontFamily: isComics ? "var(--font-bangers), 'Bangers', cursive, sans-serif" : undefined }}
                    >
                      {ev.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                      {ev.venue} • {ev.address}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">From</span>
                      <strong className="text-sm font-black text-slate-900 font-mono">
                        {ev.freeEntry ? 'Free' : formatPrice(ev.priceUSD, ev.priceVND)}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => setBookingEvent(ev)}
                      style={{
                        backgroundColor: isComics ? '#ffd60a' : '#000000',
                        color: isComics ? '#000000' : '#ffffff',
                        border: isComics ? '2px solid #000000' : 'none',
                        boxShadow: isComics ? '2px 2px 0px #000000' : 'none',
                        borderRadius: isComics ? '0px' : '12px',
                      }}
                      className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer font-mono"
                    >
                      {ev.freeEntry ? 'RSVP' : 'Get Tickets'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* --- VIEW MODE 3: FULL LIST VIEW --- */}
        {viewMode === 'list' && (
          <div className={`overflow-hidden ${
            isComics
              ? 'rounded-none bg-white border-3 border-black shadow-[6px_6px_0px_#000000]'
              : 'rounded-2xl bg-white border border-slate-200/90 shadow-sm'
          }`}>
            <div className={`divide-y ${isComics ? 'divide-black' : 'divide-slate-100'}`}>
              {filteredEvents.map(ev => (
                <div
                  key={ev.id}
                  className={`p-4 sm:p-6 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    isComics ? 'hover:bg-[#fef9c3]/50' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <img
                      src={ev.coverImage}
                      alt={ev.title}
                      className={`w-20 h-20 object-cover shrink-0 ${
                        isComics ? 'rounded-none border-2 border-black' : 'rounded-xl border border-slate-200'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`px-2 py-0.5 text-[9.5px] font-bold uppercase ${
                          isComics ? 'rounded-none border border-black' : 'rounded'
                        } ${getEventTypeBadge(ev.type).color}`}>
                          {getEventTypeBadge(ev.type).label}
                        </span>
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 ${
                          isComics ? 'rounded-none bg-[#ffd60a] text-black border border-black' : 'rounded text-emerald-600 bg-emerald-50'
                        }`}>
                          {ev.distanceKm} km away
                        </span>
                        <span className="text-xs text-slate-400">• {ev.date} ({ev.time})</span>
                      </div>

                      <h4 
                        className="text-base font-bold text-slate-900 leading-snug"
                        style={{ fontFamily: isComics ? "var(--font-bangers), 'Bangers', cursive, sans-serif" : undefined }}
                      >
                        {ev.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin size={12} className="text-rose-500 shrink-0" />
                        <span>{ev.venue} — {ev.address}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 font-mono uppercase block">Tickets</span>
                      <strong className="text-base font-black text-slate-900 font-mono">
                        {ev.freeEntry ? 'Free RSVP' : formatPrice(ev.priceUSD, ev.priceVND)}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const url = `https://www.google.com/maps/dir/?api=1&destination=${ev.lat},${ev.lng}`;
                          window.open(url, '_blank');
                        }}
                        className={`p-2.5 transition-colors cursor-pointer ${
                          isComics
                            ? 'rounded-none border-2 border-black bg-white hover:bg-[#fef9c3] text-black shadow-[2px_2px_0px_#000000]'
                            : 'rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                        title="Google Maps Directions"
                      >
                        <Compass size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setBookingEvent(ev)}
                        style={{
                          backgroundColor: isComics ? '#ffd60a' : '#000000',
                          color: isComics ? '#000000' : '#ffffff',
                          border: isComics ? '2px solid #000000' : 'none',
                          boxShadow: isComics ? '3px 3px 0px #000000' : 'none',
                          borderRadius: isComics ? '0px' : '12px',
                        }}
                        className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 font-mono"
                      >
                        {ev.freeEntry ? 'RSVP Now' : 'Book Tickets'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ==================== 5. MODAL: TICKETS & MEETUP RSVP ==================== */}
      {bookingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className={`max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative ${
            isComics
              ? 'rounded-none bg-[#fffdf0] border-4 border-black shadow-[10px_10px_0px_#000000]'
              : 'bg-white rounded-3xl shadow-2xl border border-slate-200'
          }`}>
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setBookingEvent(null);
                setBookingCompleted(false);
              }}
              className={`absolute top-5 right-5 p-2 transition-colors cursor-pointer ${
                isComics
                  ? 'rounded-none border-2 border-black bg-white hover:bg-black hover:text-white text-black'
                  : 'rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900'
              }`}
            >
              <X size={18} />
            </button>

            {!bookingCompleted ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                    isComics ? 'rounded-none border border-black' : 'rounded-full'
                  } ${getEventTypeBadge(bookingEvent.type).color}`}>
                    {getEventTypeBadge(bookingEvent.type).label}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    📍 {bookingEvent.city} {bookingEvent.distanceKm ? `(${bookingEvent.distanceKm} km away)` : ''}
                  </span>
                </div>

                <h3 
                  className="text-xl sm:text-2xl font-black text-slate-900 uppercase pr-8 mb-2"
                  style={{ fontFamily: isComics ? "var(--font-bangers), 'Bangers', cursive, sans-serif" : undefined }}
                >
                  {bookingEvent.title}
                </h3>
                <p className="text-xs text-slate-500 mb-6 flex items-center gap-1.5">
                  <MapPin size={13} className="text-rose-500" />
                  <span>{bookingEvent.venue} — {bookingEvent.address}</span>
                </p>

                {/* Event Form: Concert Tickets vs Free RSVP */}
                {!bookingEvent.freeEntry && bookingEvent.seatTiers && bookingEvent.seatTiers.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block font-mono">
                      Select Ticket Tier &amp; Seating:
                    </span>
                    <div className="space-y-2">
                      {bookingEvent.seatTiers.map((tier, idx) => (
                        <label
                          key={idx}
                          onClick={() => setSelectedTierIndex(idx)}
                          className={`p-3.5 border flex items-center justify-between cursor-pointer transition-all ${
                            isComics
                              ? selectedTierIndex === idx
                                ? 'rounded-none bg-[#ffd60a] border-2 border-black shadow-[2px_2px_0px_#000000]'
                                : 'rounded-none bg-white border-2 border-black hover:bg-[#fef9c3]'
                              : selectedTierIndex === idx
                                ? 'rounded-xl bg-blue-50 border-blue-600 shadow-2xs'
                                : 'rounded-xl bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="tier"
                                checked={selectedTierIndex === idx}
                                onChange={() => setSelectedTierIndex(idx)}
                                className={isComics ? 'accent-[#ef4444]' : 'accent-blue-600'}
                              />
                              <span className="text-xs font-bold text-slate-900">{tier.name}</span>
                            </div>
                            <span className="text-[11px] text-slate-500 block pl-5 mt-0.5">
                              {tier.perks.join(' • ')} ({tier.availableSeats} seats remaining)
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-sm font-black text-slate-900 font-mono">
                              {formatPrice(tier.priceUSD, tier.priceVND)}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>

                    {/* Quantity Picker */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-700">Ticket Quantity:</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                          className={`w-8 h-8 flex items-center justify-center font-bold cursor-pointer ${
                            isComics
                              ? 'rounded-none border-2 border-black bg-white hover:bg-black hover:text-white text-black'
                              : 'rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          -
                        </button>
                        <span className="text-sm font-bold text-slate-900 w-6 text-center font-mono">{ticketQuantity}</span>
                        <button
                          type="button"
                          onClick={() => setTicketQuantity(Math.min(4, ticketQuantity + 1))}
                          className={`w-8 h-8 flex items-center justify-center font-bold cursor-pointer ${
                            isComics
                              ? 'rounded-none border-2 border-black bg-white hover:bg-black hover:text-white text-black'
                              : 'rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Free Meetup RSVP Form */
                  <div className={`space-y-3 mb-6 p-4 border ${
                    isComics
                      ? 'rounded-none bg-white border-2 border-black shadow-[2px_2px_0px_#000000]'
                      : 'rounded-2xl bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block font-mono">
                      Attendee Information (Free RSVP):
                    </span>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={rsvpName}
                        onChange={e => setRsvpName(e.target.value)}
                        className={`w-full px-3 py-2 text-xs text-slate-900 focus:outline-none ${
                          isComics
                            ? 'rounded-none bg-white border-2 border-black focus:border-[#ef4444]'
                            : 'rounded-xl bg-white border border-slate-200 focus:border-blue-500'
                        }`}
                        placeholder="Alex Morgan"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Email for QR Ticket</label>
                        <input
                          type="email"
                          value={rsvpEmail}
                          onChange={e => setRsvpEmail(e.target.value)}
                          className={`w-full px-3 py-2 text-xs text-slate-900 focus:outline-none ${
                            isComics
                              ? 'rounded-none bg-white border-2 border-black focus:border-[#ef4444]'
                              : 'rounded-xl bg-white border border-slate-200 focus:border-blue-500'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Phone / WhatsApp</label>
                        <input
                          type="text"
                          value={rsvpPhone}
                          onChange={e => setRsvpPhone(e.target.value)}
                          className={`w-full px-3 py-2 text-xs text-slate-900 focus:outline-none ${
                            isComics
                              ? 'rounded-none bg-white border-2 border-black focus:border-[#ef4444]'
                              : 'rounded-xl bg-white border border-slate-200 focus:border-blue-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Total & Submit Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Total Due</span>
                    <strong className="text-lg font-black text-slate-950 font-mono">
                      {bookingEvent.freeEntry
                        ? '$0.00 (Free)'
                        : formatPrice(
                            (bookingEvent.seatTiers?.[selectedTierIndex]?.priceUSD || bookingEvent.priceUSD) * ticketQuantity,
                            (bookingEvent.seatTiers?.[selectedTierIndex]?.priceVND || bookingEvent.priceVND) * ticketQuantity
                          )}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => setBookingCompleted(true)}
                    style={{
                      backgroundColor: isComics ? '#ffd60a' : '#000000',
                      color: isComics ? '#000000' : '#ffffff',
                      border: isComics ? '2px solid #000000' : 'none',
                      boxShadow: isComics ? '4px 4px 0px #000000' : 'none',
                      borderRadius: isComics ? '0px' : '12px',
                    }}
                    className="px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-mono"
                  >
                    {bookingEvent.freeEntry ? 'Confirm Free RSVP' : 'Confirm & Issue Ticket'}
                  </button>
                </div>
              </div>
            ) : (
              /* Success Confirmation with Barcode & Google Maps Direction Link */
              <div className="text-center py-4">
                <div className={`w-16 h-16 flex items-center justify-center mx-auto mb-4 border ${
                  isComics
                    ? 'rounded-none bg-[#ffd60a] text-black border-2 border-black shadow-[3px_3px_0px_#000000]'
                    : 'rounded-full bg-emerald-100 text-emerald-600 border-emerald-200'
                }`}>
                  <CheckCircle2 size={32} />
                </div>

                <h3 
                  className="text-2xl font-black text-slate-900 uppercase mb-1"
                  style={{ fontFamily: isComics ? "var(--font-bangers), 'Bangers', cursive, sans-serif" : undefined }}
                >
                  {bookingEvent.freeEntry ? 'RSVP Registration Confirmed!' : 'Ticket Order Successful!'}
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mb-6">
                  Your digital pass has been cryptographically verified and sent to your email. Please present the QR code at the event gate.
                </p>

                {/* Digital Ticket Mock Card */}
                <div className={`p-5 max-w-sm mx-auto mb-6 text-left relative overflow-hidden ${
                  isComics
                    ? 'rounded-none bg-white border-3 border-black shadow-[5px_5px_0px_#000000]'
                    : 'rounded-2xl bg-slate-50 border border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      FAN HUB PLUS VERIFIED PASS
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 ${
                      isComics
                        ? 'rounded-none bg-[#ffd60a] text-black border border-black'
                        : 'rounded text-emerald-600 bg-emerald-100'
                    }`}>
                      ACTIVE
                    </span>
                  </div>

                  <h4 
                    className="text-sm font-bold text-slate-900 truncate"
                    style={{ fontFamily: isComics ? "var(--font-bangers), 'Bangers', cursive, sans-serif" : undefined }}
                  >
                    {bookingEvent.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {bookingEvent.venue} • {bookingEvent.date}
                  </p>

                  {/* Blockchain QR Code Simulation */}
                  <div className="mt-4 pt-4 border-t border-slate-200 border-dashed flex flex-col items-center">
                    <div className={`p-2 bg-white ${
                      isComics ? 'rounded-none border-2 border-black' : 'rounded-xl shadow-sm border border-slate-200'
                    }`}>
                      <QRCode 
                        value={`https://sepolia.etherscan.io/tx/0x90703192ff97553566b2cd6bf73f916c6b57687d569898a63f161ce47be49aa`} 
                        size={100} 
                        style={{ height: "auto", maxWidth: "100px", width: "100%" }}
                        viewBox={`0 0 100 100`}
                      />
                    </div>
                  </div>
                  
                  <div className={`mt-4 text-left p-3 ${
                    isComics ? 'bg-black rounded-none border-2 border-white' : 'bg-slate-900 rounded-lg'
                  }`}>
                    <div className="text-[10px] text-slate-400 font-mono uppercase mb-1 flex items-center justify-between">
                      <span>Blockchain Ticket</span>
                      <span className="text-emerald-400 font-bold">MINTED</span>
                    </div>
                    <div className="text-[11px] text-white font-mono break-all leading-tight">
                      TxHash: <span className="text-blue-300">0x90703192ff97553566b2cd6bf73f916c6b57687d569898a63f161ce47be49aa</span>
                    </div>
                    <div className="text-[11px] text-white font-mono mt-1">
                      TokenID: <span className="text-pink-400">#7077</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${bookingEvent.lat},${bookingEvent.lng}`;
                      window.open(url, '_blank');
                    }}
                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase transition-all cursor-pointer font-mono ${
                      isComics
                        ? 'bg-[#ef4444] hover:bg-[#dc2626] text-white border-2 border-black shadow-[2px_2px_0px_#000000] rounded-none'
                        : 'rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    }`}
                  >
                    <Compass size={14} />
                    <span>Open Google Maps Directions</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBookingEvent(null);
                      setBookingCompleted(false);
                    }}
                    className={`px-4 py-2.5 text-xs font-bold uppercase transition-all cursor-pointer font-mono ${
                      isComics
                        ? 'rounded-none border-2 border-black bg-white hover:bg-[#fef9c3] text-black shadow-[2px_2px_0px_#000000]'
                        : 'rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
