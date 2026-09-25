'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type DomainThemeId = 'music' | 'tech' | 'art' | 'sports' | 'fandom' | 'classic';
export type ThemeMode = 'light' | 'dark';

export interface DomainThemeConfig {
  id: DomainThemeId;
  name: string;
  fontFamily: string;
  fontDisplayName: string;
  tagline: string;
  iconType: string;
  vibeText: string;
}

export const DOMAIN_THEMES: DomainThemeConfig[] = [
  {
    id: 'music',
    name: 'Music & Audio',
    fontFamily: "'Montserrat', sans-serif",
    fontDisplayName: 'Montserrat Bold',
    tagline: 'Âm nhạc & Sound Hub hiện đại.',
    iconType: 'music',
    vibeText: 'Synthwave & Electronic Beats',
  },
  {
    id: 'tech',
    name: 'Tech & Gaming',
    fontFamily: "'Fira Code', monospace",
    fontDisplayName: 'Fira Code Monospace',
    tagline: 'Công nghệ, máy tính & game thủ.',
    iconType: 'tech',
    vibeText: 'Monospace Developer Code',
  },
  {
    id: 'art',
    name: 'Art & Fashion',
    fontFamily: "'Playfair Display', Georgia, serif",
    fontDisplayName: 'Playfair Serif',
    tagline: 'Nghệ thuật, thiết kế & thời trang.',
    iconType: 'art',
    vibeText: 'Editorial High Fashion Serif',
  },
  {
    id: 'sports',
    name: 'Sports & Fitness',
    fontFamily: "'Oswald', sans-serif",
    fontDisplayName: 'Oswald Dynamic',
    tagline: 'Thể thao, vận động & thể hình.',
    iconType: 'sports',
    vibeText: 'High Energy Athletic Motion',
  },
  {
    id: 'fandom',
    name: 'K-Pop & Anime Fandom',
    fontFamily: "'Quicksand', sans-serif",
    fontDisplayName: 'Quicksand Rounded',
    tagline: 'Thế giới K-Pop Idol, Anime & Fandom.',
    iconType: 'fandom',
    vibeText: 'Pastel Idol Dreamland',
  },
  {
    id: 'classic',
    name: 'Tổng Hợp / Standard',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontDisplayName: 'Plus Jakarta Sans',
    tagline: 'Giao diện tiêu chuẩn tối giản.',
    iconType: 'classic',
    vibeText: 'Modern Sky Standard',
  },
];

interface DomainContextType {
  currentDomain: DomainThemeId;
  activeConfig: DomainThemeConfig;
  isModalOpen: boolean;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
  selectDomain: (id: DomainThemeId) => void;
  closeDomainModal: () => void;
}

const CACHE_KEY_DOMAIN = 'techwiz_user_domain_preference';
const CACHE_KEY_MODE = 'techwiz_user_theme_mode';

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDomain, setCurrentDomain] = useState<DomainThemeId>('classic');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const applyDomainThemeToDom = (domainId: DomainThemeId) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-domain', domainId);
      document.body.setAttribute('data-domain', domainId);
    }
  };

  const applyThemeModeToDom = (mode: ThemeMode) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', mode);
      document.body.setAttribute('data-theme', mode);
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }
  };

  useEffect(() => {
    // Check cached theme mode
    try {
      const cachedMode = localStorage.getItem(CACHE_KEY_MODE) as ThemeMode | null;
      if (cachedMode === 'dark' || cachedMode === 'light') {
        setThemeModeState(cachedMode);
        applyThemeModeToDom(cachedMode);
      } else {
        applyThemeModeToDom('light');
      }
    } catch (e) {
      applyThemeModeToDom('light');
    }

    // Check cached domain theme
    try {
      const cachedDomain = localStorage.getItem(CACHE_KEY_DOMAIN) as DomainThemeId | null;
      if (cachedDomain && DOMAIN_THEMES.some((t) => t.id === cachedDomain)) {
        setCurrentDomain(cachedDomain);
        applyDomainThemeToDom(cachedDomain);
      } else {
        applyDomainThemeToDom('classic');
        const timer = setTimeout(() => {
          setIsModalOpen(true);
        }, 400);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('LocalStorage error reading domain cache', e);
    }
  }, []);

  const selectDomain = (id: DomainThemeId) => {
    setCurrentDomain(id);
    applyDomainThemeToDom(id);
    try {
      localStorage.setItem(CACHE_KEY_DOMAIN, id);
    } catch (e) {
      console.warn('LocalStorage write error', e);
    }
  };

  const toggleThemeMode = () => {
    const newMode: ThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeModeState(newMode);
    applyThemeModeToDom(newMode);
    try {
      localStorage.setItem(CACHE_KEY_MODE, newMode);
    } catch (e) {
      console.warn('LocalStorage write error mode', e);
    }
  };

  const activeConfig = DOMAIN_THEMES.find((t) => t.id === currentDomain) || DOMAIN_THEMES[0];

  return (
    <DomainContext.Provider
      value={{
        currentDomain,
        activeConfig,
        isModalOpen,
        themeMode,
        toggleThemeMode,
        selectDomain,
        closeDomainModal: () => setIsModalOpen(false),
      }}
    >
      {children}
    </DomainContext.Provider>
  );
};

export const useDomainTheme = () => {
  const context = useContext(DomainContext);
  if (!context) {
    throw new Error('useDomainTheme must be used within a DomainProvider');
  }
  return context;
};
