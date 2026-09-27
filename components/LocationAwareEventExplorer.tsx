'use client';

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';

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

export const LocationAwareEventExplorer: React.FC = () => {
  const { formatPrice } = useCartWishlist();

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
  const [rsvpName, setRsvpName] = useState<string>('Nguyen Anh Tu');
  const [rsvpEmail, setRsvpEmail] = useState<string>('fan.anhtu@gmail.com');
  const [rsvpPhone, setRsvpPhone] = useState<string>('0912345678');
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
        let msg = 'Unable to retrieve GPS coordinates. Please grant location permissions in your browser.';
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
      className="py-14 sm:py-20 w-full bg-slate-50/70 border-t border-b border-slate-200/90"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* ==================== 1. Editorial Section Header ==================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 text-[11px] font-bold uppercase tracking-wider mb-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <LocateFixed size={12} className="text-blue-600" />
              <span>Location-Aware Event Radar &amp; GPS Discovery</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight uppercase font-sans m-0">
              Discover Events <span className="text-blue-600">&amp; Meetups Near You</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl font-normal leading-relaxed">
              Automatically scan with GPS to find premier stadium concerts, idol cup sleeve birthday celebrations, manga cosplay conventions, and official photocard trading events near you.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200/90 shadow-2xs self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Navigation size={13} />
              <span>GPS Map</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CalendarIcon size={13} />
              <span>Event Calendar</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users size={13} />
              <span>List View ({filteredEvents.length})</span>
            </button>
          </div>
        </div>

        {/* ==================== 2. GPS Locator Bar & City Pills ==================== */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* GPS Auto-Detect Button & Current Coordinates indicator */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleDetectGps}
              disabled={isLocating}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs ${
                userLocation.isGpsActive
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
              }`}
            >
              <LocateFixed size={14} className={isLocating ? 'animate-spin' : ''} />
              <span>
                {isLocating ? 'Scanning satellite GPS...' : userLocation.isGpsActive ? '✓ Using live GPS' : 'Enable GPS Near Me'}
              </span>
            </button>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100/90 border border-slate-200 text-xs font-medium text-slate-700">
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
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
            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
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
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  maxRadiusKm === r.val
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Event Category Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs text-xs">
              {[
                { id: 'all', label: 'All Types' },
                { id: 'stadium_concert', label: 'Concert' },
                { id: 'cup_sleeve_cafe', label: 'Cafe Meetup' },
                { id: 'photocard_trade', label: 'Trade Card' },
                { id: 'anime_expo', label: 'Manga / Cosplay' },
                { id: 'gaming_arena', label: 'Gaming' },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedType(t.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedType === t.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Keyword Search */}
            <div className="relative min-w-[220px]">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search venues, tour names, artists..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs font-sans"
              />
            </div>
          </div>

        </div>

        {/* ==================== 4. MAIN INTERACTIVE CONTENT AREA ==================== */}

        {/* --- VIEW MODE 1: INTERACTIVE GPS RADAR MAP + SPLIT LIST --- */}
        {viewMode === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 7 Columns: High-Tech GPS Interactive Map Canvas / Radar */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl relative min-h-[460px] sm:min-h-[540px] flex flex-col justify-between">
              
              {/* Map Top Overlay HUD: GPS Status & Stats */}
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-3 pointer-events-none">
                <div className="pointer-events-auto px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-white flex items-center gap-2 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] font-mono font-bold tracking-wider uppercase">
                    GPS Satellite Radar: {filteredEvents.length} Event Locations
                  </span>
                </div>

                <div className="pointer-events-auto flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-slate-300 text-[10px] font-mono">
                    Coordinates: {userLocation.lat.toFixed(2)}°N, {userLocation.lng.toFixed(2)}°E
                  </span>
                </div>
              </div>

              {/* Interactive Vector Radar Grid (Simulated Topographic GPS Map with Pins) */}
              <div className="relative w-full h-[460px] sm:h-[540px] overflow-hidden bg-radial from-slate-900 via-slate-950 to-black flex items-center justify-center">
                
                {/* Concentric Radar Rings & Crosshairs */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
                  <div className="w-[180px] h-[180px] rounded-full border border-blue-500/40" />
                  <div className="w-[320px] h-[320px] rounded-full border border-blue-500/30 border-dashed" />
                  <div className="w-[460px] h-[460px] rounded-full border border-blue-500/20" />
                  <div className="w-[600px] h-[600px] rounded-full border border-blue-500/10" />
                  <div className="absolute w-full h-[1px] bg-blue-500/20" />
                  <div className="absolute h-full w-[1px] bg-blue-500/20" />
                </div>

                {/* Radar Sweep Effect */}
                <div className="absolute w-[460px] h-[460px] rounded-full bg-conic from-blue-500/10 via-transparent to-transparent animate-spin pointer-events-none" style={{ animationDuration: '8s' }} />

                {/* USER LOCATION CENTER PIN */}
                <div className="absolute z-30 flex flex-col items-center pointer-events-none">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping" />
                    <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-[0_0_15px_rgba(37,99,235,0.8)] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  </div>
                  <span className="mt-1 px-2 py-0.5 rounded bg-blue-900/90 text-white text-[9px] font-mono font-bold tracking-wider border border-blue-400/50 shadow-md">
                    YOU ARE HERE
                  </span>
                </div>

                {/* EVENT LOCATION PINS PLACED ON MAP */}
                {filteredEvents.map((ev, index) => {
                  const isSelected = activeEvent?.id === ev.id;
                  
                  // Generate relative normalized cartesian coordinates from lat/lng offset
                  const latDiff = (ev.lat - userLocation.lat);
                  const lngDiff = (ev.lng - userLocation.lng);
                  
                  // Scale dynamically for canvas placement
                  const scale = maxRadiusKm > 100 ? 12 : 280;
                  const xOffset = Math.max(-180, Math.min(180, lngDiff * scale));
                  const yOffset = Math.max(-180, Math.min(180, -latDiff * scale));

                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => setSelectedEventId(ev.id)}
                      style={{
                        transform: `translate(${xOffset}px, ${yOffset}px)`,
                      }}
                      className={`absolute z-20 group cursor-pointer transition-transform duration-300 ${
                        isSelected ? 'scale-125 z-40' : 'hover:scale-115'
                      }`}
                    >
                      <div className="relative flex flex-col items-center">
                        
                        {/* Pin Head with Category Icon */}
                        <div className={`px-2 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border transition-all ${
                          isSelected
                            ? 'bg-rose-600 text-white border-white ring-4 ring-rose-500/40'
                            : ev.freeEntry
                            ? 'bg-pink-600 text-white border-pink-300'
                            : 'bg-slate-900 text-white border-slate-600 group-hover:border-blue-400'
                        }`}>
                          {ev.type === 'stadium_concert' && <Ticket size={11} className="text-amber-300" />}
                          {ev.type === 'cup_sleeve_cafe' && <Coffee size={11} className="text-pink-300" />}
                          {ev.type === 'photocard_trade' && <Sparkles size={11} className="text-purple-300" />}
                          {ev.type === 'anime_expo' && <Layers size={11} className="text-rose-300" />}
                          {ev.type === 'gaming_arena' && <Radio size={11} className="text-emerald-300" />}
                          <span className="text-[10px] font-bold font-mono">
                            {ev.distanceKm < 1000 ? `${ev.distanceKm} km` : `${(ev.distanceKm / 1000).toFixed(1)}k km`}
                          </span>
                        </div>

                        {/* Pin Pointer Tail */}
                        <div className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] -mt-0.5 ${
                          isSelected ? 'border-t-rose-600' : 'border-t-slate-900'
                        }`} />

                        {/* Title Tooltip on hover/selected */}
                        <div className={`mt-1 px-2 py-0.5 rounded bg-black/90 text-white text-[9px] font-sans font-bold max-w-[130px] truncate border border-white/20 transition-opacity ${
                          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}>
                          {ev.title}
                        </div>

                      </div>
                    </button>
                  );
                })}

              </div>

              {/* Map Bottom Legend / Compass Bar */}
              <div className="p-3.5 bg-slate-950/90 border-t border-slate-800 text-slate-300 text-xs flex items-center justify-between flex-wrap gap-2 z-10">
                <div className="flex items-center gap-3 text-[11px] font-medium flex-wrap">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> You
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Concert
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-400" /> Cafe Meetup
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
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
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-all cursor-pointer"
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
                <div className="rounded-2xl bg-white border-2 border-blue-600/90 shadow-lg p-5 sm:p-6 relative overflow-hidden transition-all">
                  
                  {/* Category Pill & Distance Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 shadow-2xs ${getEventTypeBadge(activeEvent.type).color}`}>
                      <Radio size={11} className="animate-pulse" />
                      <span>{getEventTypeBadge(activeEvent.type).label}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">
                      <LocateFixed size={12} className="text-emerald-600" />
                      <span>Within {activeEvent.distanceKm} km of you</span>
                    </span>
                  </div>

                  {/* Image & Title */}
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-slate-100 border border-slate-200">
                    <img 
                      src={activeEvent.coverImage} 
                      alt={activeEvent.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold block mb-0.5">
                        {activeEvent.artistOrHost}
                      </span>
                      <h3 className="text-base sm:text-lg font-black leading-tight text-white m-0">
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
                        <CalendarIcon size={13} className="text-blue-600" />
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
                        <span key={pIdx} className="text-[10.5px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
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
                      <div className="text-base sm:text-lg font-black text-slate-950">
                        {activeEvent.freeEntry ? (
                          <span className="text-emerald-600">Free Entry (RSVP)</span>
                        ) : (
                          formatPrice(activeEvent.priceUSD, activeEvent.priceVND)
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleShare(activeEvent)}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
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
                          backgroundColor: '#000000',
                          color: '#ffffff',
                        }}
                        className="px-4 py-2.5 rounded-xl hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                      >
                        <Ticket size={13} style={{ color: '#ffffff' }} />
                        <span>{activeEvent.freeEntry ? 'RSVP Now' : 'Book Tickets'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                  No events found within the selected radius. Try increasing the radius or choosing another city.
                </div>
              )}

              {/* Quick Scrollable Nearby Events List Below Spotlight */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block px-1">
                  Other nearby events ({filteredEvents.length}):
                </span>
                {filteredEvents.map(ev => {
                  const isCurrent = ev.id === activeEvent?.id;
                  return (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedEventId(ev.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isCurrent 
                          ? 'bg-blue-50/80 border-blue-400 shadow-2xs' 
                          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
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
                        <span className="text-[11px] font-mono font-bold text-blue-600 block">
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
          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase">
                  Fandom Event Calendar by Date
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select a date to quickly filter concerts, offline meetups, and anime exhibitions.
                </p>
              </div>

              {selectedDate && (
                <button
                  type="button"
                  onClick={() => setSelectedDate('')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
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
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer min-w-[100px] shrink-0 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                    }`}
                  >
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                      {new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="text-base font-black block my-0.5">
                      {dateStr.split('-').slice(1).join('/')}
                    </span>
                    <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full inline-block ${
                      isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {count} events
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
                  className="rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between p-5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getEventTypeBadge(ev.type).color}`}>
                        {getEventTypeBadge(ev.type).label}
                      </span>
                      <span className="text-xs font-mono font-bold text-blue-600">
                        {ev.distanceKm} km away
                      </span>
                    </div>

                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-slate-100">
                      <img src={ev.coverImage} alt={ev.title} className="w-full h-full object-cover" />
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 font-bold block uppercase mb-1">
                      {ev.artistOrHost}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 line-clamp-1 mb-2">
                      {ev.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                      {ev.venue} • {ev.address}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">From</span>
                      <strong className="text-sm font-black text-slate-900">
                        {ev.freeEntry ? 'Free' : formatPrice(ev.priceUSD, ev.priceVND)}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => setBookingEvent(ev)}
                      style={{ backgroundColor: '#000000', color: '#ffffff' }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-slate-800 transition-colors"
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
          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {filteredEvents.map(ev => (
                <div
                  key={ev.id}
                  className="p-4 sm:p-6 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <img
                      src={ev.coverImage}
                      alt={ev.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold uppercase ${getEventTypeBadge(ev.type).color}`}>
                          {getEventTypeBadge(ev.type).label}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          {ev.distanceKm} km away
                        </span>
                        <span className="text-xs text-slate-400">• {ev.date} ({ev.time})</span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 leading-snug">
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
                      <strong className="text-base font-black text-slate-900">
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
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Google Maps Directions"
                      >
                        <Compass size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setBookingEvent(ev)}
                        style={{ backgroundColor: '#000000', color: '#ffffff' }}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 transition-all cursor-pointer shrink-0"
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

      {/* ==================== 5. MODAL: DIRECT TICKET BOOKING & RSVP MEETUP ==================== */}
      {bookingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setBookingEvent(null);
                setBookingCompleted(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {!bookingCompleted ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getEventTypeBadge(bookingEvent.type).color}`}>
                    {getEventTypeBadge(bookingEvent.type).label}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    📍 {bookingEvent.city} {bookingEvent.distanceKm ? `(${bookingEvent.distanceKm} km away)` : ''}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase pr-8 mb-2">
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
                          className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            selectedTierIndex === idx
                              ? 'bg-blue-50 border-blue-600 shadow-2xs'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="tier"
                                checked={selectedTierIndex === idx}
                                onChange={() => setSelectedTierIndex(idx)}
                                className="accent-blue-600"
                              />
                              <span className="text-xs font-bold text-slate-900">{tier.name}</span>
                            </div>
                            <span className="text-[11px] text-slate-500 block pl-5 mt-0.5">
                              {tier.perks.join(' • ')} ({tier.availableSeats} seats remaining)
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-sm font-black text-slate-900">
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
                          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold text-slate-900 w-6 text-center">{ticketQuantity}</span>
                        <button
                          type="button"
                          onClick={() => setTicketQuantity(Math.min(4, ticketQuantity + 1))}
                          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Free Meetup RSVP Form */
                  <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block font-mono">
                      Attendee Information (Free RSVP):
                    </span>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={rsvpName}
                        onChange={e => setRsvpName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
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
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={rsvpPhone}
                          onChange={e => setRsvpPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Total & Submit Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Total Payment</span>
                    <strong className="text-lg font-black text-slate-950">
                      {bookingEvent.freeEntry
                        ? '0 USD (Free)'
                        : formatPrice(
                            (bookingEvent.seatTiers?.[selectedTierIndex]?.priceUSD || bookingEvent.priceUSD) * ticketQuantity,
                            (bookingEvent.seatTiers?.[selectedTierIndex]?.priceVND || bookingEvent.priceVND) * ticketQuantity
                          )}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => setBookingCompleted(true)}
                    style={{ backgroundColor: '#000000', color: '#ffffff' }}
                    className="px-6 py-3 rounded-xl hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    {bookingEvent.freeEntry ? 'Confirm RSVP Registration' : 'Confirm & Issue Tickets'}
                  </button>
                </div>
              </div>
            ) : (
              /* Success Confirmation with Barcode & Google Maps Direction Link */
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                  <CheckCircle2 size={32} />
                </div>

                <h3 className="text-2xl font-black text-slate-900 uppercase mb-1">
                  {bookingEvent.freeEntry ? 'Registration Successful!' : 'Event Ticket Booking Confirmed!'}
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mb-6">
                  Your electronic pass has been securely generated and emailed to you. Please present the QR code/barcode at the venue gate.
                </p>

                {/* Digital Ticket Mock Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto mb-6 text-left relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      FAN HUB PLUS VERIFIED PASS
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {bookingEvent.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {bookingEvent.venue} • {bookingEvent.date}
                  </p>

                  {/* Barcode Simulation */}
                  <div className="mt-4 pt-3 border-t border-dashed border-slate-300 text-center">
                    <div className="font-mono text-2xl tracking-[0.25em] text-slate-800 font-bold select-all">
                      ||| | |||| | ||| || |||
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 block mt-1">
                      PASS ID: FHP-2025-{Math.floor(100000 + Math.random() * 900000)}
                    </span>
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
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase transition-all shadow-sm cursor-pointer"
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
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold uppercase transition-all cursor-pointer"
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
