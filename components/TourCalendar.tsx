'use client';

import React, { useState } from 'react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { mockTourEvents } from '../data/mockData';
import { TourEvent } from '../types';
import { MapPin, Calendar, Ticket, Check, X } from 'lucide-react';

export const TourCalendar: React.FC = () => {
  const { formatPrice } = useCartWishlist();

  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [bookedTour, setBookedTour] = useState<TourEvent | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const cities = [
    { id: 'all', name: 'All Cities' },
    { id: 'Hanoi', name: 'Hanoi' },
    { id: 'Ho Chi Minh City', name: 'Ho Chi Minh City' },
    { id: 'Seoul', name: 'Seoul' },
    { id: 'Tokyo', name: 'Tokyo' },
    { id: 'Los Angeles', name: 'Los Angeles' },
  ];

  const filteredTours = mockTourEvents.filter((ev) => {
    if (selectedCity === 'all') return true;
    return ev.city === selectedCity;
  });

  const getStatusBadge = (status: TourEvent['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'Selling Fast':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Sold Out':
        return 'bg-red-100 text-red-600 border-red-300';
      case 'Presale Soon':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const handleBookTicket = (event: TourEvent) => {
    setBookedTour(event);
    setBookingSuccess(true);
  };

  return (
    <section id="tours" className="py-14 px-4 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#000000' }}>
            <Ticket className="w-4 h-4 text-sky-600" />
            <span>Global Stadium & Arena Schedules</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Upcoming World Tours & Fan Meetings
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Check official tour dates, arena venues, ticket availability, and priority fanclub pre-sale bookings.
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none flex-wrap">
          {cities.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCity(c.id)}
              className="px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer"
              style={{
                backgroundColor: selectedCity === c.id ? '#000000' : '#ffffff',
                color: selectedCity === c.id ? '#ffffff' : '#334155',
                border: selectedCity === c.id ? '1px solid #000000' : '1px solid #e2e8f0',
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
              }}
              type="button"
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tour Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTours.map((tour) => {
          return (
            <div
              key={tour.id}
              className="bg-white p-5 border border-slate-200 flex flex-col justify-between group hover:border-sky-300 shadow-sm hover:shadow-md transition-all"
              style={{ minHeight: '240px', borderRadius: '8px' }}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 border ${getStatusBadge(tour.status)}`} style={{ borderRadius: '8px' }}>
                    {tour.status}
                  </span>
                  <span 
                    className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{ backgroundColor: '#f4f4f5', color: '#1c1c1c' }}
                  >
                    {tour.artistName}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base mt-3 group-hover:text-sky-600 transition-colors">
                  {tour.tourName}
                </h3>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="font-semibold text-slate-800">{tour.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>{tour.venue}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500 pl-6">
                    <span>{tour.city}, {tour.country}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Starting From</span>
                  <span className="text-base font-extrabold" style={{ color: '#000000' }}>
                    {formatPrice(tour.ticketPriceFromUSD, tour.ticketPriceFromVND)}
                  </span>
                </div>

                <button
                  onClick={() => handleBookTicket(tour)}
                  disabled={tour.status === 'Sold Out'}
                  className="px-3.5 py-2 text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
                  style={{
                    backgroundColor: tour.status === 'Sold Out' ? '#cbd5e1' : '#000000',
                    borderRadius: '8px',
                    padding: '0.5rem 1.1rem',
                  }}
                  type="button"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Get Tickets</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulated Ticket Booking Confirmation Modal */}
      {bookingSuccess && bookedTour && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center relative" style={{ borderRadius: '8px' }}>
            <button
              onClick={() => setBookingSuccess(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>

            <div 
              className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ width: '48px', height: '48px', borderRadius: '50%' }}
            >
              <Check className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Concert Ticket Portal Connected!
            </h3>
            <p className="text-xs text-slate-600 mt-2">
              You are reserved for <strong>{bookedTour.tourName}</strong> in <strong>{bookedTour.city}</strong> ({bookedTour.venue}) on {bookedTour.date}.
            </p>

            <div 
              className="mt-4 p-3 text-xs border"
              style={{ backgroundColor: '#fafafa', borderColor: '#d4d4d4', color: '#1c1c1c', borderRadius: '8px' }}
            >
              🎫 Official Fan Club Pre-sale Priority code: <strong>FANHUB-VIP-99</strong>
            </div>

            <button
              onClick={() => setBookingSuccess(false)}
              className="mt-5 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
              style={{ borderRadius: '8px' }}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
