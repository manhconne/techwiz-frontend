'use client';

import React from 'react';
import { useGoogleLanguage } from './GoogleTranslate';
import { Heart, Globe } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenFeedback: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenFeedback }) => {
  const { language, toggleLanguage } = useGoogleLanguage();

  return (
    <footer className="text-white pt-14 pb-8 border-t border-slate-800" style={{ backgroundColor: '#0f172a' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800" style={{ borderBottomColor: '#1e293b' }}>
          
          {/* Brand info with Horizontal Logo */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center notranslate">
              <img
                src="/logo.png"
                alt="Fan Hub Plus"
                style={{
                  height: '36px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  filter: 'brightness(1.2)',
                }}
              />
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Official destination for global K-pop fans. Certified direct imports from Seoul, guaranteed album charts count, and official pre-order photocards.
            </p>
            <div className="flex items-center gap-3 pt-2 flex-wrap notranslate">
              <span 
                className="text-[11px] font-bold px-2.5 py-1 rounded"
                style={{ backgroundColor: '#1e293b', color: '#7dd3fc', border: '1px solid #334155' }}
              >
                HANTEO CHART FAMILY MEMBER
              </span>
              <span 
                className="text-[11px] font-bold px-2.5 py-1 rounded"
                style={{ backgroundColor: '#1e293b', color: '#38bdf8', border: '1px solid #334155' }}
              >
                CIRCLE CHART VERIFIED
              </span>
            </div>
          </div>

          {/* Column 2: Fandom Circles */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Fandom Communities
            </h4>
            <ul className="space-y-2 text-xs text-slate-400" style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.4rem' }}><a href="#albums" className="hover:text-sky-400 transition-colors">Bunnies (NewJeans)</a></li>
              <li style={{ marginBottom: '0.4rem' }}><a href="#albums" className="hover:text-sky-400 transition-colors">BLINK (BLACKPINK)</a></li>
              <li style={{ marginBottom: '0.4rem' }}><a href="#albums" className="hover:text-sky-400 transition-colors">A.R.M.Y (BTS)</a></li>
              <li style={{ marginBottom: '0.4rem' }}><a href="#albums" className="hover:text-sky-400 transition-colors">STAY (Stray Kids)</a></li>
              <li style={{ marginBottom: '0.4rem' }}><a href="#albums" className="hover:text-sky-400 transition-colors">DIVE (IVE) & MY (aespa)</a></li>
            </ul>
          </div>

          {/* Column 3: Collector Care */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-slate-400" style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.4rem' }}><a href="#albums" className="hover:text-sky-400 transition-colors">Worldwide Shipping Policy</a></li>
              <li style={{ marginBottom: '0.4rem' }}><a href="#tours" className="hover:text-sky-400 transition-colors">Tour Schedule Guide</a></li>
              <li style={{ marginBottom: '0.4rem' }}>
                <button onClick={onOpenFeedback} className="hover:text-sky-400 transition-colors cursor-pointer text-left text-slate-400" type="button">
                  Send Feedback & Suggestions
                </button>
              </li>
              <li style={{ marginBottom: '0.4rem' }}>
                <button onClick={onOpenAdmin} className="hover:text-amber-300 font-semibold transition-colors cursor-pointer text-left" style={{ color: '#fbbf24' }} type="button">
                  Admin Control Panel
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Language & SRS Note */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Languages & System
            </h4>
            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-1.5 text-white transition-colors cursor-pointer notranslate"
                style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', alignSelf: 'flex-start' }}
                type="button"
              >
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>Current: {language === 'en' ? 'English (EN)' : 'Tiếng Việt (VI)'}</span>
              </button>
              <p className="text-[11px] text-slate-500 pt-1">
                TechWiz 7: Fan Hub Plus Official Web Template.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 Fan Hub Plus. All Rights Reserved. Official Charts Sync Partner.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-sky-500 fill-current" /> for K-Pop Fans
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
