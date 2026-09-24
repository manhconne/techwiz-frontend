'use client';

import React from 'react';
import { Map, Disc, Users, Calendar, ShieldCheck } from 'lucide-react';

interface SiteLink {
  label: string;
  href: string;
  isAction?: boolean;
  onClick?: () => void;
}

interface SiteCategory {
  category: string;
  icon: React.ReactNode;
  links: SiteLink[];
}

interface SitemapSectionProps {
  onOpenAdmin: () => void;
  onOpenFeedback: () => void;
}

export const SitemapSection: React.FC<SitemapSectionProps> = ({ onOpenAdmin, onOpenFeedback }) => {
  const siteStructure: SiteCategory[] = [
    {
      category: 'Discovery & Catalog',
      icon: <Disc className="w-4 h-4 text-sky-600" />,
      links: [
        { label: 'Latest Comeback Drops', href: '#albums' },
        { label: 'Full Albums & Mini EPs', href: '#albums' },
        { label: 'Limited Editions & Kits', href: '#albums' },
        { label: 'Official Lightsticks & Merch', href: '#albums' },
        { label: 'Audio Teaser Previews', href: '#albums' },
      ],
    },
    {
      category: 'Fandom Universe',
      icon: <Users className="w-4 h-4 text-sky-600" />,
      links: [
        { label: 'Idol Group Profiles', href: '#artists' },
        { label: 'Debut History & Agency Info', href: '#artists' },
        { label: 'Official Fandom Fanclubs', href: '#artists' },
        { label: 'Group Discography Filter', href: '#artists' },
      ],
    },
    {
      category: 'World Tour & Events',
      icon: <Calendar className="w-4 h-4 text-sky-600" />,
      links: [
        { label: 'Global Concert Schedules', href: '#tours' },
        { label: 'Vietnam Stadium Stops (Hanoi/HCMC)', href: '#tours' },
        { label: 'Ticket Availability & Presale', href: '#tours' },
        { label: 'Venue GPS & Stadium Info', href: '#tours' },
      ],
    },
    {
      category: 'Fan Hub Services & SRS',
      icon: <ShieldCheck className="w-4 h-4 text-sky-600" />,
      links: [
        { label: 'Fandom AI Assistant (K-Bot)', href: '#', isAction: true },
        { label: 'Collector Wishlist & Notes', href: '#', isAction: true },
        { label: 'Admin Control Panel Preview', href: '#', onClick: onOpenAdmin },
        { label: 'Feedback & Bug Submission', href: '#', onClick: onOpenFeedback },
      ],
    },
  ];

  return (
    <section id="sitemap" className="py-14 px-4 lg:px-8 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div 
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1"
            style={{ backgroundColor: '#f4f4f5', color: '#1c1c1c', borderRadius: '8px' }}
          >
            <Map className="w-3.5 h-3.5 text-sky-600" />
            <span>SRS Section 1.9 Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Complete Website Architecture & Sitemap
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Explore all functional modules, catalog directories, and fandom portals.
          </p>
        </div>

        {/* Tree Map Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteStructure.map((cat, idx) => {
            return (
              <div
                key={idx}
                className="p-5 bg-slate-50 border border-slate-200 hover:border-sky-300 transition-colors"
                style={{ borderRadius: '8px' }}
              >
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
                  {cat.icon}
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                    {cat.category}
                  </h3>
                </div>

                <ul className="space-y-2.5 text-xs" style={{ listStyle: 'none', padding: 0 }}>
                  {cat.links.map((link, lIdx) => {
                    if (link.onClick) {
                      return (
                        <li key={lIdx} style={{ marginBottom: '0.5rem' }}>
                          <button
                            onClick={link.onClick}
                            className="hover:underline font-semibold transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                            style={{ color: '#000000' }}
                            type="button"
                          >
                            <span style={{ color: '#000000', fontWeight: 'bold' }}>→</span>
                            <span>{link.label}</span>
                          </button>
                        </li>
                      );
                    }

                    return (
                      <li key={lIdx} style={{ marginBottom: '0.5rem' }}>
                        <a
                          href={link.href}
                          className="text-slate-600 hover:text-sky-600 transition-colors flex items-center gap-1.5"
                        >
                          <span className="text-slate-400">↳</span>
                          <span>{link.label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
