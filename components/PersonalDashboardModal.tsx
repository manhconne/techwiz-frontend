'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  X,
  Heart,
  Bookmark,
  Clock,
  Sparkles,
  Camera,
  Edit3,
  Check,
  LogOut,
  ExternalLink,
  Flame,
  Star,
  Calendar,
  Disc,
  Radio,
  Share2,
  Tv,
  Bell,
  Trash2,
  FileText,
  User as UserIcon,
  Play,
  Award,
  ChevronRight,
  Shield,
  Layers,
  Settings,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Palette,
  Film,
  Gamepad2,
  BookOpen,
  Scissors,
  Music,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { mockFeaturedArticles } from '../data/mockData';
import { INITIAL_MEDIA_ITEMS } from '../data/multimediaData';
import {
  getActiveFandomTheme,
  getFandomCategoryFromTheme,
  getFandomThemeKeyFromCategory,
  persistFandomTheme,
} from '../utils/fandomTheme';

interface PersonalDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  fandomThemeKey?: string;
  fandomCategory?: string;
}

export interface FandomOption {
  id: string;
  name: string;
  tag: string; // Category: 'K-Pop' | 'V-Pop' | 'Anime' | 'Manga' | 'Gaming' | 'Comics' | 'Movies' | 'TV Shows' | 'Cosplay'
  color: string;
  description?: string;
  isCustom?: boolean;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
];

export const CATEGORY_ITEMS = [
  { key: 'all', label: 'ALL UNIVERSE', icon: Sparkles },
  { key: 'kpop', label: 'K-POP', icon: Music },
  { key: 'manga', label: 'MANGA', icon: BookOpen },
  { key: 'anime', label: 'ANIME', icon: Flame },
  { key: 'gaming', label: 'GAMING', icon: Gamepad2 },
  { key: 'comics', label: 'COMICS', icon: ZapIcon },
  { key: 'cinema', label: 'MOVIES / CINEMA', icon: Film },
  { key: 'tv', label: 'TV SHOWS', icon: Tv },
  { key: 'cosplay', label: 'COSPLAY', icon: Scissors },
  { key: 'vpop', label: 'V-POP', icon: Star },
];

function ZapIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

// Full theme presets for each category
export const CATEGORY_THEMES: Record<string, {
  name: string;
  categoryLabel: string;
  fontFamily: string;
  modalClass: string;
  headerClass: string;
  headerGlow1: string;
  headerGlow2: string;
  accentHex: string;
  accentTextClass: string;
  roleBadgeClass: string;
  roleBadgeText: string;
  cardClass: string;
  cardInnerClass: string;
  tabActiveClass: string;
  tabInactiveClass: string;
  actionBtnClass: string;
  fandomPillClass: string;
  tabBarClass: string;
  contentBgClass: string;
  tapeDecor?: boolean;
  closeBtnClass?: string;
  headerSubtitle?: string;
  inputClass?: string;
  borderRadius?: string;
}> = {
  all: {
    name: 'all',
    categoryLabel: 'Universe Explorer',
    fontFamily: "'Outfit', sans-serif",
    modalClass: 'rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900',
    headerClass: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white border-b border-indigo-900/40',
    headerGlow1: 'bg-pink-500/20',
    headerGlow2: 'bg-indigo-500/20',
    accentHex: '#6366f1',
    accentTextClass: 'text-indigo-600 dark:text-indigo-400',
    roleBadgeClass: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    roleBadgeText: '★ UNIVERSE EXPLORER VIP ✦',
    cardClass: 'rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-slate-800 shadow-xs hover:shadow-md',
    cardInnerClass: 'bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-800',
    tabActiveClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20',
    tabInactiveClass: 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800',
    actionBtnClass: 'rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white shadow-md shadow-indigo-600/20',
    fandomPillClass: 'rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800',
    tabBarClass: 'bg-slate-100/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/60',
    contentBgClass: 'bg-white dark:bg-slate-900',
    tapeDecor: false,
    closeBtnClass: 'w-9 h-9 rounded-full bg-black/25 hover:bg-black/45 text-white backdrop-blur-md border border-white/20',
    headerSubtitle: 'Universe Explorer & Cross-Fandom Hub',
    inputClass: 'w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500',
  },
  kpop: {
    name: 'kpop',
    categoryLabel: 'K-Pop Official Hub',
    fontFamily: "'Outfit', sans-serif",
    modalClass: 'rounded-3xl border-3 border-pink-500/40 shadow-2xl shadow-pink-500/10 bg-white dark:bg-slate-900',
    headerClass: 'bg-gradient-to-br from-purple-950 via-slate-900 to-pink-950 text-white border-b border-pink-500/40',
    headerGlow1: 'bg-pink-500/25',
    headerGlow2: 'bg-cyan-500/20',
    accentHex: '#ff2e93',
    accentTextClass: 'text-pink-600 dark:text-pink-400',
    roleBadgeClass: 'bg-pink-500/20 text-pink-300 border border-pink-500/40',
    roleBadgeText: '★ K-POP FANDOM ELITE VIP ✦',
    cardClass: 'rounded-2xl border border-pink-200/80 dark:border-pink-900/40 bg-white dark:bg-slate-800 shadow-xs hover:shadow-pink-500/10',
    cardInnerClass: 'bg-pink-50/50 dark:bg-pink-950/30 rounded-xl border border-pink-100 dark:border-pink-900/50',
    tabActiveClass: 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-600/25',
    tabInactiveClass: 'text-slate-600 dark:text-slate-300 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-slate-800',
    actionBtnClass: 'rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-md shadow-pink-600/25',
    fandomPillClass: 'rounded-xl bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800',
    tabBarClass: 'bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 dark:from-pink-950/40 dark:via-purple-950/30 dark:to-pink-950/40 border-b-2 border-pink-300/60 dark:border-pink-800/60',
    contentBgClass: 'bg-gradient-to-b from-pink-50/30 to-white dark:from-pink-950/20 dark:to-slate-900',
    tapeDecor: false,
    closeBtnClass: 'w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 hover:scale-105',
    headerSubtitle: 'Official Hanteo Certified Member Gate & Photocard Vault',
    inputClass: 'w-full px-3.5 py-2.5 rounded-xl border-2 border-pink-300 dark:border-pink-800 text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500',
  },
  manga: {
    name: 'manga',
    categoryLabel: 'Manga Tankōbon Guild',
    fontFamily: "'Kalam', cursive, sans-serif",
    modalClass: 'border-3 border-[#2d2d2d] shadow-[8px_8px_0px_#2d2d2d] bg-[#fdfbf7]',
    borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
    headerClass: 'bg-[#fdfbf7] text-[#2d2d2d] border-b-3 border-[#2d2d2d] relative',
    headerGlow1: 'bg-red-400/15',
    headerGlow2: 'bg-amber-300/15',
    accentHex: '#ff4d4d',
    accentTextClass: 'text-[#ff4d4d]',
    roleBadgeClass: 'bg-[#ff4d4d] text-white border-2 border-[#2d2d2d]',
    roleBadgeText: '★ MANGA GUILD // TANKŌBON COLLECTOR ✦',
    cardClass: 'rounded-xl border-2 border-[#2d2d2d] bg-white shadow-[3px_3px_0px_#2d2d2d]',
    cardInnerClass: 'bg-[#fdfbf7] rounded-lg border border-[#2d2d2d]/30',
    tabActiveClass: 'bg-[#ff4d4d] text-white border-2 border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d]',
    tabInactiveClass: 'text-[#2d2d2d] hover:bg-[#fff0f0] border-2 border-transparent',
    actionBtnClass: 'rounded-lg bg-[#ff4d4d] hover:bg-[#e03a3a] text-white border-2 border-[#2d2d2d] shadow-[3px_3px_0px_#2d2d2d]',
    fandomPillClass: 'rounded-lg bg-[#fff0f0] text-[#ff4d4d] border-2 border-[#2d2d2d] shadow-[1px_1px_0px_#2d2d2d]',
    tabBarClass: 'bg-[#fdfbf7] border-b-3 border-[#2d2d2d] text-[#2d2d2d]',
    contentBgClass: 'bg-[#fdfbf7] text-[#2d2d2d]',
    tapeDecor: true,
    closeBtnClass: 'w-8 h-8 rounded-none bg-white hover:bg-neutral-100 text-black border-2 border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d]',
    headerSubtitle: 'Mangaka & Tankōbon Collector Sign-In',
    inputClass: 'w-full px-3.5 py-2.5 rounded-none border-2 border-[#2d2d2d] text-xs bg-white text-[#2d2d2d] focus:outline-none font-["Kalam"]',
  },
  anime: {
    name: 'anime',
    categoryLabel: 'Anime Sakuga Vault',
    fontFamily: "'Space Grotesk', monospace, sans-serif",
    modalClass: 'rounded-none border-3 border-black shadow-[10px_10px_0px_#ccff00] bg-white',
    headerClass: 'bg-[#ffd60a] text-black border-b-3 border-black',
    headerGlow1: 'bg-[#ccff00]/40',
    headerGlow2: 'bg-[#00f0ff]/30',
    accentHex: '#ccff00',
    accentTextClass: 'text-black font-black',
    roleBadgeClass: 'bg-black text-[#ccff00] border-2 border-black font-black',
    roleBadgeText: '★ SAKUGA VAULT // OTAKU ARCHIVE ✦',
    cardClass: 'rounded-none border-2 border-black bg-white shadow-[4px_4px_0px_#000000]',
    cardInnerClass: 'bg-[#fefce8] rounded-none border border-black',
    tabActiveClass: 'bg-[#ccff00] text-black border-2 border-black shadow-[2px_2px_0px_#000] font-black',
    tabInactiveClass: 'text-black hover:bg-[#fefce8] border-2 border-transparent font-bold',
    actionBtnClass: 'rounded-none bg-[#ccff00] hover:bg-[#b8e600] text-black border-2 border-black shadow-[3px_3px_0px_#000] font-black',
    fandomPillClass: 'rounded-none bg-[#ccff00]/30 text-black border-2 border-black shadow-[2px_2px_0px_#000] font-bold',
    tabBarClass: 'bg-[#ffd60a] border-b-3 border-black text-black',
    contentBgClass: 'bg-[#fffef5] text-black',
    tapeDecor: false,
    closeBtnClass: 'w-8 h-8 rounded-none bg-black hover:bg-[#ccff00] text-white hover:text-black border-2 border-black shadow-[2px_2px_0px_#000000]',
    headerSubtitle: 'High-Framerate Collector & Otaku Authentication',
    inputClass: 'w-full px-3.5 py-2.5 rounded-none border-2 border-black text-xs bg-[#fefce8] text-black focus:outline-none font-["Space_Grotesk"]',
  },
  gaming: {
    name: 'gaming',
    categoryLabel: 'Gaming & Esports Arena',
    fontFamily: "'JetBrains Mono', monospace",
    modalClass: 'rounded-none border-4 border-black shadow-[8px_8px_0px_#000000] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100',
    headerClass: 'bg-black text-white border-b-4 border-black',
    headerGlow1: 'bg-cyan-500/25',
    headerGlow2: 'bg-emerald-500/20',
    accentHex: '#06b6d4',
    accentTextClass: 'text-cyan-400 font-mono font-bold',
    roleBadgeClass: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-mono',
    roleBadgeText: '★ GAMING ARENA // MEMBER GATE ✦',
    cardClass: 'rounded-none border-2 border-black dark:border-cyan-500/40 bg-white dark:bg-slate-900 shadow-[3px_3px_0px_#000000] text-slate-900 dark:text-slate-100',
    cardInnerClass: 'bg-slate-50 dark:bg-slate-950/80 rounded-none border border-black/20 dark:border-cyan-500/20',
    tabActiveClass: 'bg-black text-white dark:bg-cyan-500 dark:text-black font-extrabold shadow-[2px_2px_0px_#000]',
    tabInactiveClass: 'text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-slate-900',
    actionBtnClass: 'rounded-none bg-black hover:bg-neutral-800 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-black border-2 border-black font-extrabold shadow-[3px_3px_0px_#000]',
    fandomPillClass: 'rounded-none bg-slate-100 dark:bg-cyan-950/80 text-black dark:text-cyan-300 border-2 border-black shadow-[1px_1px_0px_#000]',
    tabBarClass: 'bg-neutral-100 dark:bg-slate-950 border-b-4 border-black text-black dark:text-white',
    contentBgClass: 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100',
    tapeDecor: false,
    closeBtnClass: 'w-8 h-8 rounded-none bg-black hover:bg-neutral-800 text-white border-2 border-black shadow-[2px_2px_0px_#000000]',
    headerSubtitle: 'Official Soundtracks & Collector Archive',
    inputClass: 'w-full px-3.5 py-2.5 rounded-none border-2 border-black text-xs bg-white dark:bg-slate-900 text-black dark:text-white focus:outline-none font-mono',
  },
  comics: {
    name: 'comics',
    categoryLabel: 'Comics Pop-Art Hero Archive',
    fontFamily: "'Bangers', 'Kalam', cursive, sans-serif",
    modalClass: 'rounded-none border-4 border-black shadow-[10px_10px_0px_#ef4444] bg-[#fffdf0]',
    headerClass: 'bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-black border-b-4 border-black',
    headerGlow1: 'bg-red-500/30',
    headerGlow2: 'bg-yellow-400/30',
    accentHex: '#ef4444',
    accentTextClass: 'text-red-600 font-black',
    roleBadgeClass: 'bg-black text-[#ffd60a] border-2 border-black font-bold tracking-wider',
    roleBadgeText: '★ HERO ARCHIVE // VARIANT SECRET IDENTITY ✦',
    cardClass: 'rounded-none border-3 border-black bg-white shadow-[4px_4px_0px_#000000]',
    cardInnerClass: 'bg-[#fffdf0] rounded-none border-2 border-black/30',
    tabActiveClass: 'bg-[#ef4444] text-white border-2 border-black shadow-[3px_3px_0px_#000] font-black',
    tabInactiveClass: 'text-black hover:bg-amber-100 border-2 border-transparent font-bold',
    actionBtnClass: 'rounded-none bg-[#ffd60a] hover:bg-amber-400 text-black border-3 border-black shadow-[3px_3px_0px_#ef4444] font-black',
    fandomPillClass: 'rounded-none bg-[#fee2e2] text-red-700 border-2 border-black shadow-[2px_2px_0px_#000] font-bold',
    tabBarClass: 'bg-gradient-to-r from-amber-100 via-yellow-100 to-red-100 border-b-3 border-black text-black',
    contentBgClass: 'bg-[#fffdf0] text-black',
    tapeDecor: false,
    closeBtnClass: 'w-8 h-8 rounded-none bg-white hover:bg-[#ffd60a] text-black border-3 border-black shadow-[3px_3px_0px_#000000]',
    headerSubtitle: 'Unlock Exclusive Variant Pulls & Omnibuses',
    inputClass: 'w-full px-3.5 py-2.5 rounded-none border-2 border-black text-xs bg-white text-black focus:outline-none',
  },
  cinema: {
    name: 'cinema',
    categoryLabel: 'Cinema 70mm Swiss Archive',
    fontFamily: "'Playfair Display', Georgia, serif",
    modalClass: 'rounded-none border-2 border-[rgba(212,175,55,0.6)] shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-[#0d0d0f] text-zinc-100',
    headerClass: 'bg-gradient-to-br from-[#0d0d0f] via-zinc-950 to-neutral-900 text-white border-b border-amber-500/30',
    headerGlow1: 'bg-amber-500/20',
    headerGlow2: 'bg-yellow-600/15',
    accentHex: '#d4af37',
    accentTextClass: 'text-amber-400 font-bold',
    roleBadgeClass: 'bg-amber-400/15 text-amber-300 border border-amber-400/40',
    roleBadgeText: '★ CINEMA 70MM // PATRON CRITERION GUILD ✦',
    cardClass: 'rounded-none border border-amber-500/25 bg-zinc-900/90 shadow-[0_4px_20px_rgba(0,0,0,0.5)] text-zinc-100',
    cardInnerClass: 'bg-black/60 rounded-none border border-amber-500/20',
    tabActiveClass: 'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]',
    tabInactiveClass: 'text-zinc-400 hover:text-amber-300 hover:bg-zinc-800/60',
    actionBtnClass: 'rounded-none bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black border border-amber-400/60 font-bold shadow-[0_2px_15px_rgba(212,175,55,0.3)]',
    fandomPillClass: 'rounded-none bg-amber-950/40 text-amber-300 border border-amber-500/40 shadow-[0_0_8px_rgba(212,175,55,0.15)]',
    tabBarClass: 'bg-gradient-to-r from-zinc-950 via-amber-950/40 to-zinc-950 border-b border-amber-500/30 text-zinc-100',
    contentBgClass: 'bg-[#0d0d0f] text-zinc-100',
    tapeDecor: false,
    closeBtnClass: 'w-8 h-8 rounded-none bg-[#0d0d0f] hover:bg-amber-500/20 text-[#d4af37] border border-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.3)]',
    headerSubtitle: 'Cannes & Criterion Guild Member Portal',
    inputClass: 'w-full px-3.5 py-2.5 rounded-none border border-[rgba(212,175,55,0.5)] text-xs bg-[#18181b] text-[#fafaf9] focus:outline-none',
  },
  tv: {
    name: 'tv',
    categoryLabel: 'TV Shows Y2K Broadcast',
    fontFamily: "'Outfit', sans-serif",
    modalClass: 'rounded-none border-3 border-black shadow-[8px_8px_0px_#8b5cf6] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100',
    headerClass: 'bg-gradient-to-br from-slate-950 via-purple-950 to-violet-900 text-white border-b-3 border-black',
    headerGlow1: 'bg-purple-500/25',
    headerGlow2: 'bg-fuchsia-500/20',
    accentHex: '#8b5cf6',
    accentTextClass: 'text-purple-600 dark:text-purple-400 font-bold',
    roleBadgeClass: 'bg-purple-500/20 text-purple-300 border border-purple-400/40',
    roleBadgeText: '★ TV BROADCAST // SUBSCRIBER ACCESS ✦',
    cardClass: 'rounded-none border-2 border-black bg-white dark:bg-slate-900 shadow-[3px_3px_0px_#8b5cf6] text-slate-900 dark:text-slate-100',
    cardInnerClass: 'bg-[#faf5ff] dark:bg-slate-950/80 rounded-none border border-black/20 dark:border-purple-500/20',
    tabActiveClass: 'bg-[#8b5cf6] text-white border-2 border-black shadow-[2px_2px_0px_#000] font-bold',
    tabInactiveClass: 'text-slate-700 dark:text-slate-300 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-slate-900',
    actionBtnClass: 'rounded-none bg-[#8b5cf6] hover:bg-[#7c3aed] text-white border-2 border-black shadow-[3px_3px_0px_#000] font-bold',
    fandomPillClass: 'rounded-none bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 border-2 border-black shadow-[1px_1px_0px_#8b5cf6]',
    tabBarClass: 'bg-[#faf5ff] dark:bg-slate-950 border-b-3 border-black text-black dark:text-white',
    contentBgClass: 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100',
    tapeDecor: false,
    closeBtnClass: 'w-8 h-8 rounded-none bg-purple-900 hover:bg-purple-800 text-white border-2 border-black shadow-[3px_3px_0px_#8b5cf6]',
    headerSubtitle: 'Binge Series & K-Drama Streaming Access',
    inputClass: 'w-full px-3.5 py-2.5 rounded-none border-2 border-black text-xs bg-[#faf5ff] text-black focus:outline-none',
  },
  cosplay: {
    name: 'cosplay',
    categoryLabel: 'Cosplay & Vanguard Atelier',
    fontFamily: "'Space Grotesk', sans-serif",
    modalClass: 'rounded-none border-3 border-black shadow-[8px_8px_0px_#D02020] bg-white text-black',
    headerClass: 'bg-black text-white border-b-3 border-black',
    headerGlow1: 'bg-red-500/25',
    headerGlow2: 'bg-neutral-500/20',
    accentHex: '#D02020',
    accentTextClass: 'text-[#D02020] font-bold',
    roleBadgeClass: 'bg-[#D02020] text-white border border-black font-bold',
    roleBadgeText: '★ VANGUARD ATELIER // CONSTRUCTIVIST ✦',
    cardClass: 'rounded-none border-2 border-black bg-white shadow-[3px_3px_0px_#D02020] text-black',
    cardInnerClass: 'bg-neutral-50 rounded-none border border-black/30',
    tabActiveClass: 'bg-[#D02020] text-white border-2 border-black shadow-[2px_2px_0px_#000] font-bold',
    tabInactiveClass: 'text-black hover:text-[#D02020] hover:bg-neutral-100',
    actionBtnClass: 'rounded-none bg-[#D02020] hover:bg-red-700 text-white border-2 border-black shadow-[3px_3px_0px_#000] font-bold',
    fandomPillClass: 'rounded-none bg-red-50 text-[#D02020] border-2 border-black shadow-[1px_1px_0px_#000]',
    tabBarClass: 'bg-white border-b-3 border-black text-black',
    contentBgClass: 'bg-white text-black',
    tapeDecor: false,
    closeBtnClass: 'w-8 h-8 rounded-none bg-black hover:bg-[#D02020] text-white border-2 border-black shadow-[2px_2px_0px_#000000]',
    headerSubtitle: 'Constructivist Costuming & Runway Guild',
    inputClass: 'w-full px-3.5 py-2.5 rounded-none border-2 border-black text-xs bg-white text-black focus:outline-none',
  },
  vpop: {
    name: 'vpop',
    categoryLabel: 'V-Pop Stadium Live',
    fontFamily: "'Outfit', sans-serif",
    modalClass: 'rounded-2xl border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.25)] bg-slate-950 text-slate-100',
    headerClass: 'bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-900 text-white border-b border-emerald-500/40',
    headerGlow1: 'bg-emerald-500/25',
    headerGlow2: 'bg-teal-500/20',
    accentHex: '#10b981',
    accentTextClass: 'text-emerald-400',
    roleBadgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40',
    roleBadgeText: '★ V-POP STADIUM // SAYHI LIVE VIP ✦',
    cardClass: 'rounded-xl border border-emerald-500/30 bg-slate-900/90 shadow-[0_0_15px_rgba(16,185,129,0.15)] text-slate-100',
    cardInnerClass: 'bg-slate-950/80 rounded-lg border border-emerald-500/20',
    tabActiveClass: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]',
    tabInactiveClass: 'text-slate-300 hover:text-emerald-300 hover:bg-slate-900',
    actionBtnClass: 'rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/30',
    fandomPillClass: 'rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]',
    tabBarClass: 'bg-gradient-to-r from-slate-950 via-emerald-950/50 to-slate-950 border-b border-emerald-500/40 text-slate-100',
    contentBgClass: 'bg-slate-950 text-slate-100',
    tapeDecor: false,
    closeBtnClass: 'w-9 h-9 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 shadow-sm',
    headerSubtitle: 'SayHi Live VIP & Vietnam Stadium Concert Hall',
    inputClass: 'w-full px-3.5 py-2.5 rounded-xl border border-emerald-500/40 text-xs bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500',
  },
};

const DEFAULT_FANDOM_OPTIONS: FandomOption[] = [
  // K-Pop
  { id: 'bunnies', name: 'Bunnies (NewJeans)', tag: 'K-Pop', color: '#ff2e93', description: 'Official NewJeans Tokki Club & Y2K aesthetic universe' },
  { id: 'blink', name: 'BLINK (BLACKPINK)', tag: 'K-Pop', color: '#ec4899', description: 'Born Pink Stadium Worldwide Fandom' },
  { id: 'army', name: 'A.R.M.Y (BTS)', tag: 'K-Pop', color: '#8b5cf6', description: 'Global 21st-Century Pop Icon Fanbase' },
  { id: 'carat', name: 'CARAT (SEVENTEEN)', tag: 'K-Pop', color: '#06b6d4', description: 'Diamond Stage & Right Here World Tour Stan' },
  { id: 'stay', name: 'STAY (Stray Kids)', tag: 'K-Pop', color: '#84cc16', description: 'Dominate World Tour & 5-STAR Worldwide Stan' },
  { id: 'my', name: 'MY (aespa)', tag: 'K-Pop', color: '#6366f1', description: 'Kwangya & Synk Metaverse Explorers' },
  { id: 'dive', name: 'DIVE (IVE)', tag: 'K-Pop', color: '#f97316', description: 'Show What I Have World Tour Community' },

  // V-Pop
  { id: 'sayhi', name: 'SayHi Believers (Anh Trai Say Hi)', tag: 'V-Pop', color: '#10b981', description: 'Sold-out stadium live concert phenomenon' },
  { id: 'chonggai', name: 'Chong Gai Fandom Club (Anh Trai Vuot Ngan Chong Gai)', tag: 'V-Pop', color: '#f43f5e', description: 'Fire & Heritage Vietnam Stadium Tour' },
  { id: 'sky', name: 'SKY (Son Tung M-TP)', tag: 'V-Pop', color: '#3b82f6', description: 'Top-tier V-Pop icon Sky Tour arena fanbase' },

  // Anime
  { id: 'demon-slayer', name: 'Demon Slayer Corps (Kimetsu no Yaiba)', tag: 'Anime', color: '#ef4444', description: 'Hashira Training & Infinity Castle Arc' },
  { id: 'jjk', name: 'Jujutsu Sorcerers (Jujutsu Kaisen)', tag: 'Anime', color: '#6366f1', description: 'MAPPA Tokyo Jujutsu High Alliance' },
  { id: 'conan', name: 'Conan Global Fanclub (Detective Conan)', tag: 'Anime', color: '#0284c7', description: 'Black Iron Submarine & Detective League' },

  // Manga
  { id: 'straw-hats', name: 'Straw Hat Pirates (One Piece)', tag: 'Manga', color: '#eab308', description: 'Grand Line & Egghead Island Nakama (Eiichiro Oda)' },
  { id: 'survey-corps', name: 'Survey Corps (Attack on Titan)', tag: 'Manga', color: '#15803d', description: 'Wings of Freedom & Eren Yeager Legacy' },
  { id: 'hunter-assoc', name: 'Hunter Association (Hunter x Hunter)', tag: 'Manga', color: '#059669', description: 'Nen Masters & Dark Continent Explorers' },

  // Gaming
  { id: 't1', name: 'T1 Fandom & Faker (LoL)', tag: 'Gaming', color: '#dc2626', description: '5-Time World Champions & Unkillable Demon King' },
  { id: 'teyvat', name: 'Travelers of Teyvat (Genshin Impact)', tag: 'Gaming', color: '#06b6d4', description: 'HoYoverse & Symphony of Teyvat' },
  { id: 'sentinels', name: 'Sentinels & VCT Champions (Valorant)', tag: 'Gaming', color: '#f43f5e', description: 'Tactical FPS Champions & Esports Guild' },

  // Comics
  { id: 'web-heads', name: 'Web-Heads & Marvel Multiverse', tag: 'Comics', color: '#e11d48', description: 'Spider-Man, Miles Morales & Marvel Comics' },
  { id: 'gotham', name: 'Gotham Knights & Bat-Family (DC)', tag: 'Comics', color: '#1e293b', description: 'Detective Comics & Dark Knight Legends' },
  { id: 'avengers', name: 'Avengers Initiative (Marvel)', tag: 'Comics', color: '#2563eb', description: 'Earth Mightiest Heroes & Secret Wars' },

  // Movies
  { id: 'cinephiles', name: 'Auteur Cinephiles & 70mm Purists', tag: 'Movies', color: '#d97706', description: 'Christopher Nolan, Hans Zimmer & IMAX 70mm' },
  { id: 'fremen', name: 'Dune Fremen Brotherhood', tag: 'Movies', color: '#ca8a04', description: 'Denis Villeneuve Arrakis Desert Alliance' },
  { id: 'ghibli', name: 'Studio Ghibli Dreamers', tag: 'Movies', color: '#14b8a6', description: 'Hayao Miyazaki & Spirited Fantasy Lovers' },

  // TV Shows
  { id: 'hellfire', name: 'The Hellfire Club (Stranger Things)', tag: 'TV Shows', color: '#ef4444', description: 'Hawkins 1980s D&D Campaign & Upside Down' },
  { id: 'dragon-loyalists', name: 'House of the Dragon Loyalists', tag: 'TV Shows', color: '#7f1d1d', description: 'Targaryen Blood & Fire Westeros Faction' },
  { id: 'continental', name: 'The Continental Guild (John Wick)', tag: 'TV Shows', color: '#475569', description: 'High Table & Neo-Noir Cinema Fandom' },

  // Cosplay
  { id: 'constructivists', name: 'Constructivists (Bauhaus Modernist)', tag: 'Cosplay', color: '#ea580c', description: 'Avant-Garde Theatrical Cosplay Atelier' },
  { id: 'cyberpunk-cos', name: 'Cyberpunk Street Runners', tag: 'Cosplay', color: '#06b6d4', description: 'Neo-Tokyo LED & High-Tech Armor Crafters' },
  { id: 'harajuku', name: 'Harajuku Gothic & Lolita League', tag: 'Cosplay', color: '#be185d', description: 'Tokyo Street Fashion & Themed Subculture' },
];

const PRESET_COLOR_SWATCHES = [
  '#ff2e93',
  '#ec4899',
  '#8b5cf6',
  '#6366f1',
  '#3b82f6',
  '#06b6d4',
  '#10b981',
  '#84cc16',
  '#eab308',
  '#f97316',
  '#ef4444',
  '#1e293b',
];

const CATEGORY_OPTIONS = ['K-POP', 'MANGA', 'ANIME', 'GAMING', 'COMICS', 'MOVIES', 'TV SHOWS', 'COSPLAY', 'V-POP'];

export const PersonalDashboardModal: React.FC<PersonalDashboardModalProps> = ({
  isOpen,
  onClose,
  fandomThemeKey,
  fandomCategory,
}) => {
  const { user, logout, updateProfile, toggleFavoriteFandom, activities } = useAuth();
  const { wishlist } = useCartWishlist();

  const [activeTab, setActiveTab] = useState<'overview' | 'fandoms' | 'activities' | 'bookmarks' | 'profile'>('overview');

  // Dynamic Category Theme Key: Inherited directly from outside (Header / active category)
  const [activeThemeKey, setActiveThemeKey] = useState<string>(() => {
    return getActiveFandomTheme(fandomThemeKey, fandomCategory) || 'kpop';
  });

  // Profile edit form
  const [editName, setEditName] = useState(user.name);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [editBio, setEditBio] = useState('Music lover, photocard collector, and passionate concert enthusiast!');
  const [saveToast, setSaveToast] = useState(false);

  // Personalized Greeting calculation
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', sub: 'Wishing you a high-energy day filled with great music and fandom drops!' };
    if (hour < 18) return { text: 'Good afternoon', sub: 'Explore the latest events, albums, and universe comebacks!' };
    return { text: 'Good evening', sub: 'Unwind with your favorite podcasts, tracks, and live stages after a long day!' };
  }, []);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAvatar = customAvatarUrl.trim() || selectedAvatar;
    updateProfile({
      name: editName.trim() || user.name,
      avatar: finalAvatar,
    });
    try {
      localStorage.setItem('fanhub_user_interests', JSON.stringify(selectedInterests));
      localStorage.setItem('fanhub_user_pref_theme', prefTheme);
      localStorage.setItem('fanhub_user_pref_font', prefFontSize);
      localStorage.setItem('fanhub_user_pref_landing', prefLanding);
    } catch { }
    setSaveToast({ message: 'Profile and display preferences have been successfully updated!' });
    setTimeout(() => setSaveToast(null), 3000);
  };

  const totalBookmarks = wishlist.length + articleBookmarks.length + characterBookmarks.length + mediaBookmarks.length;

  return (
    <div
      style={{ fontFamily: currentTheme.fontFamily }}
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        className={`max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 transition-all ${currentTheme.modalClass}`}
        style={currentTheme.borderRadius ? { borderRadius: currentTheme.borderRadius } : undefined}
        role="dialog"
        aria-modal="true"
      >

        {/* ========================================================= */}
        {/* 1. DYNAMIC CATEGORY STYLE HEADER & PERSONAL GREETING      */}
        {/* ========================================================= */}
        <div className={`relative p-6 sm:p-8 overflow-hidden select-none transition-all duration-300 ${currentTheme.headerClass}`}>
          {/* Top Tape for Manga */}
          {currentTheme.tapeDecor && (
            <div
              style={{
                position: 'absolute',
                top: '-12px',
                left: '40px',
                width: '110px',
                height: '24px',
                backgroundColor: '#e5e0d8',
                opacity: 0.95,
                zIndex: 20,
                transform: 'rotate(-2deg)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Subtle Ambient Glow Effects */}
          <div className={`absolute -right-16 -top-16 w-72 h-72 rounded-full blur-3xl pointer-events-none ${currentTheme.headerGlow1}`} />
          <div className={`absolute left-1/3 -bottom-20 w-80 h-80 rounded-full blur-3xl pointer-events-none ${currentTheme.headerGlow2}`} />

          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-5 right-5 z-20 transition-all cursor-pointer flex items-center justify-center ${currentTheme.closeBtnClass || 'w-9 h-9 rounded-full bg-black/25 hover:bg-black/45 text-white backdrop-blur-md border border-white/20'}`}
            title="Close Dashboard"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-7">
            {/* User Avatar with Edit Trigger */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ring-4 ring-white/25 shadow-2xl overflow-hidden bg-slate-800">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <button
                onClick={() => setActiveTab('profile')}
                style={{ backgroundColor: currentTheme.accentHex }}
                className="absolute -bottom-1 -right-1 p-2 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-slate-900"
                title="Change avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* User Info & Personalized Greeting */}
            <div className="text-center sm:text-left flex-1 min-w-0 space-y-3">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide backdrop-blur-md transition-all ${currentTheme.roleBadgeClass}`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{user.role === 'admin' ? 'SYSTEM ADMINISTRATOR' : currentTheme.roleBadgeText}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-black uppercase font-sans">
                  {greeting.text}, {user.name}! 🌟
                </h2>
                <p className="text-xs text-neutral-800 font-medium">
                  {greeting.sub}
                </p>

                <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-neutral-800 font-bold">
                  <span>EMAIL: <strong className="text-black bg-white px-1 border border-black">{user.email}</strong></span>
                  <span>•</span>
                  <span>SINCE: <strong className="text-black">{user.memberSince || '2024'}</strong></span>
                  <span>•</span>
                  <span className="bg-[#ccff00] text-black px-1.5 py-0.2 border border-black font-black">DIAMOND STAN ⭐</span>
                </div>

                {checkIsAdmin(user) && (
                <div className="pt-3 flex justify-center sm:justify-start">
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 no-underline"
                  >
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Vào Bảng Điều Khiển Admin (Dashboard)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-black/25 backdrop-blur-md border border-white/15 flex items-center gap-1.5">
                  <span className="opacity-70 font-medium">SINCE:</span>
                  <span className="font-semibold">{user.memberSince || '2024'}</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-slate-950" />
                  <span>DIAMOND STAN</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. NAVIGATION TABS BAR — Dynamically styled per category  */}
        {/* ========================================================= */}
        <div className="px-6 border-b-2 border-black bg-[#ecfeff] flex items-center gap-2 overflow-x-auto scrollbar-none py-2">
          {[
            { id: 'overview', label: 'OVERVIEW', icon: Sparkles },
            { id: 'fandoms', label: 'FAVORITE FANDOMS', icon: Heart, count: user.favoriteFandoms.length },
            { id: 'activities', label: 'RECENT ACTIVITY', icon: Clock, count: activities.length },
            { id: 'bookmarks', label: 'BOOKMARKS', icon: Bookmark, count: wishlist.length },
            { id: 'profile', label: 'PROFILE & SETTINGS', icon: Edit3 },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{ borderRadius: '0px' }}
                className={`flex items-center gap-2 py-2 px-3 text-xs font-black uppercase border-2 transition-all whitespace-nowrap cursor-pointer ${isActive
                  ? 'bg-[#ff2e93] text-white border-black shadow-[3px_3px_0px_#000] -translate-y-0.5'
                  : 'bg-white text-black border-black hover:bg-[#fff9db] shadow-[1px_1px_0px_#000]'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${isActive
                        ? 'bg-black/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toast alert */}
      {saveToast && (
        <div className="mx-6 sm:mx-8 mt-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-2xl flex items-center gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{saveToast.message}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. TAB CONTENT VIEWS                                      */}
      {/* ========================================================= */}
      <div className={`p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 sm:space-y-8 transition-all duration-300 ${currentTheme.contentBgClass}`}>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stat Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div style={{ borderRadius: '0px' }} className="p-4 bg-white border-2 border-black text-center shadow-[4px_4px_0px_#000]">
                <span className="text-[10px] font-black text-neutral-600 uppercase">Fandoms Followed</span>
                <div className="text-2xl font-black text-black mt-1">{user.favoriteFandoms.length}</div>
                <span className="text-[10px] text-[#ff2e93] font-bold">Official communities</span>
              </div>
              <div style={{ borderRadius: '0px' }} className="p-4 bg-white border-2 border-black text-center shadow-[4px_4px_0px_#000]">
                <span className="text-[10px] font-black text-neutral-600 uppercase">Saved Items</span>
                <div className="text-2xl font-black text-black mt-1">{wishlist.length}</div>
                <span className="text-[10px] text-cyan-600 font-bold">In your wishlist</span>
              </div>
              <div style={{ borderRadius: '0px' }} className="p-4 bg-white border-2 border-black text-center shadow-[4px_4px_0px_#000]">
                <span className="text-[10px] font-black text-neutral-600 uppercase">Interaction History</span>
                <div className="text-2xl font-black text-black mt-1">{activities.length}</div>
                <span className="text-[10px] text-emerald-600 font-bold">Reviews &amp; streams</span>
              </div>
              <div style={{ borderRadius: '0px' }} className="p-4 bg-white border-2 border-black text-center shadow-[4px_4px_0px_#000]">
                <span className="text-[10px] font-black text-neutral-600 uppercase">Contribution Points</span>
                <div className="text-2xl font-black text-black mt-1">2,450</div>
                <span className="text-[10px] bg-[#ffd60a] px-1 border border-black font-black">Diamond Tier ⭐</span>
              </div>

              <div className={`p-5 sm:p-6 transition-all hover:translate-y-[-2px] flex flex-col justify-between min-h-[125px] ${currentTheme.cardClass}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold opacity-75 uppercase tracking-wider">Wishlist</span>
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Bookmark className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-black my-2">
                  {wishlist.length}
                </div>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold block">
                  Saved merch &amp; items
                </span>
              </div>

              {/* Fandom Highlight Row */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-black tracking-wider flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#ff2e93] fill-[#ff2e93]" /> Your Fandoms
                  </h4>
                  <button
                    onClick={() => setActiveTab('fandoms')}
                    className="text-xs font-black text-[#ff2e93] hover:underline cursor-pointer"
                  >
                    [MANAGE // + ADD FANDOM]
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {user.favoriteFandoms.map((fandom, idx) => (
                    <span
                      key={idx}
                      style={{ borderRadius: '0px' }}
                      className="px-3 py-1.5 bg-[#fdf2f8] text-[#ff2e93] border-2 border-black text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000]"
                    >
                      <Heart className="w-3 h-3 fill-[#ff2e93] text-[#ff2e93]" />
                      {fandom}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Activity Snapshot */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-black tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-600" /> Recent Activity
                  </h4>
                  <button
                    onClick={() => setActiveTab('activities')}
                    className={`text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${currentTheme.accentTextClass}`}
                  >
                    [VIEW ALL ({activities.length})]
                  </button>
                </div>

                <div className="space-y-2">
                  {activities.slice(0, 3).map((act) => (
                    <div
                      key={act.id}
                      style={{ borderRadius: '0px' }}
                      className="p-3 bg-white border-2 border-black flex items-center justify-between text-xs shadow-[2px_2px_0px_#000]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 bg-[#ff2e93] border border-black" />
                        <span className="font-bold text-black">{act.title}</span>
                      </div>
                      <span className="text-[11px] text-neutral-600 font-mono whitespace-nowrap ml-2">
                        {act.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

            {/* TAB 2: FANDOMS MANAGEMENT & CREATION BY CATEGORY */}
            {activeTab === 'fandoms' && (
              <div className="space-y-5">
                {/* Header and Create Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h4 className="text-base font-extrabold flex items-center gap-2">
                      <span>Fandom Hub by Category</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700">
                        {allFandomsList.length} Fandoms
                      </span>
                    </h4>
                    <p className="text-xs opacity-70 mt-0.5">
                      Click any category to switch styling, or create custom fandoms for any category!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {ALL_FANDOM_OPTIONS.map((item) => {
                      const isFollowed = user.favoriteFandoms.includes(item.name);
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleFavoriteFandom(item.name)}
                          style={{ borderRadius: '0px' }}
                          className={`p-3.5 border-2 border-black transition-all cursor-pointer flex items-center justify-between ${isFollowed
                            ? 'bg-[#ecfeff] shadow-[3px_3px_0px_#000] -translate-y-0.5'
                            : 'bg-white hover:bg-[#fff9db] shadow-[1px_1px_0px_#000]'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 border border-black flex-shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <div>
                              <h5 className="text-xs font-black text-black">{item.name}</h5>
                              <span className="text-[10px] text-neutral-600 font-bold">{item.tag}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            style={{ borderRadius: '0px' }}
                            className={`px-3 py-1 text-xs font-black border-2 border-black uppercase transition-colors ${isFollowed
                              ? 'bg-[#ff2e93] text-white shadow-[1px_1px_0px_#000]'
                              : 'bg-white text-black hover:bg-[#ffd60a]'
                              }`}
                          >
                            {isFollowed ? '✓ FOLLOWING' : '+ FOLLOW'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
          )}

                {/* TAB 3: ACTIVITIES TIMELINE */}
                {activeTab === 'activities' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-extrabold">Your Activity History</h4>
                      <p className="text-xs opacity-70 mt-1 leading-relaxed">
                        Complete record of your interactions: reviews, saved concert events, playlist additions, and community feedback.
                      </p>
                    </div>

                    <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-1 before:bg-black">
                      {activities.map((act) => (
                        <div key={act.id} className="relative group">
                          <span className="absolute -left-6 top-1.5 w-3.5 h-3.5 bg-[#ffd60a] border-2 border-black shadow-[1px_1px_0px_#000]" />
                          <div
                            style={{ borderRadius: '0px' }}
                            className="p-3.5 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between"
                          >
                            <div>
                              <p className="text-xs sm:text-sm font-bold">{sanitizeActivity(act.title)}</p>
                              <span className="text-[11px] opacity-60 font-medium mt-1 inline-block">{sanitizeActivity(act.timestamp)}</span>
                            </div>
                            {act.link && (
                              <Link
                                href={act.link}
                                onClick={onClose}
                                className={`text-xs font-bold px-3 py-1.5 flex items-center gap-1.5 transition-colors shadow-2xs ${currentTheme.cardInnerClass}`}
                              >
                                <span>Open</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: CENTRALIZED BOOKMARKS & NOTES */}
                {activeTab === 'bookmarks' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-black text-black uppercase">SAVED ITEMS &amp; MEDIA</h4>
                      <p className="text-xs text-neutral-600 font-medium">
                        Albums, photobooks, lightsticks, and media you have saved to track or prepare for pre-order.
                      </p>
                    </div>

                    {wishlist.length === 0 ? (
                      <div style={{ borderRadius: '0px' }} className="py-12 text-center bg-white border-2 border-black p-6 space-y-2 shadow-[3px_3px_0px_#000]">
                        <Bookmark className="w-8 h-8 text-neutral-400 mx-auto" />
                        <p className="text-xs font-bold text-black uppercase">NO SAVED ITEMS YET</p>
                        <p className="text-[11px] text-neutral-500">Click the bookmark button on products and trailers to save them here.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {wishlist.map((item) => (
                          <div
                            key={item.album.id}
                            style={{ borderRadius: '0px' }}
                            className="p-3 border-2 border-black flex items-center gap-3 bg-white shadow-[3px_3px_0px_#000]"
                          >
                            <img
                              src={item.album.coverImage}
                              alt={item.album.title}
                              style={{ borderRadius: '0px', width: '56px', height: '56px' }}
                              className="object-cover border border-black shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-black text-[#ff2e93] block uppercase">{item.album.artist}</span>
                              <h5 className="text-xs font-bold text-black truncate uppercase font-sans">{item.album.title}</h5>
                              <span className="text-[11px] font-mono font-black text-black mt-0.5 block">
                                ${item.album.priceUSD} USD
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 5: PROFILE & SETTINGS */}
                {activeTab === 'profile' && (
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div>
                      <h4 className="text-sm font-black text-black uppercase">MANAGE PERSONAL PROFILE</h4>
                      <p className="text-xs text-neutral-600 font-medium">
                        Update your display name, avatar, and fandom motto.
                      </p>
                    </div>

                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-black">FANDOM DISPLAY NAME:</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={{ borderRadius: '0px' }}
                        className="w-full px-3 py-2 border-2 border-black text-xs bg-white focus:outline-none focus:border-[#ff2e93]"
                        required
                      />
                    </div>

                    {/* Avatar Preset Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-black">QUICK AVATAR SELECTION:</label>
                      <div className="flex flex-wrap gap-2.5">
                        {AVATAR_PRESETS.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt="Avatar preset"
                            onClick={() => {
                              setSelectedAvatar(url);
                              setCustomAvatarUrl('');
                            }}
                            style={{ borderRadius: '0px' }}
                            className={`w-12 h-12 object-cover cursor-pointer transition-all border-2 ${selectedAvatar === url && !customAvatarUrl
                              ? 'border-[#ff2e93] shadow-[3px_3px_0px_#000] scale-105'
                              : 'border-black opacity-70 hover:opacity-100'
                              }`}
                          />
                        ))}
                      </div>

                      <div className="pt-2">
                        <label className="text-[11px] font-bold text-neutral-600">OR PASTE CUSTOM AVATAR URL:</label>
                        <input
                          type="url"
                          placeholder="https://example.com/avatar.jpg"
                          value={customAvatarUrl}
                          onChange={(e) => setCustomAvatarUrl(e.target.value)}
                          style={{ borderRadius: '0px' }}
                          className="w-full px-3 py-2 border-2 border-black text-xs bg-white focus:outline-none focus:border-[#ff2e93] mt-1"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-black">FANDOM BIO / MOTTO:</label>
                      <textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        rows={2}
                        style={{ borderRadius: '0px' }}
                        className="w-full px-3 py-2 border-2 border-black text-xs bg-white focus:outline-none focus:border-[#ff2e93]"
                      />
                    </div>

                    {/* Submit Buttons */}
                    <div className="pt-3 flex items-center justify-between border-t-2 border-black">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          onClose();
                        }}
                        style={{ borderRadius: '0px' }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black uppercase text-white bg-[#ef4444] border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer hover:bg-red-700"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>

                      <button
                        type="submit"
                        className={`px-6 py-2.5 text-xs font-bold cursor-pointer transition-all ${currentTheme.actionBtnClass}`}
                      >
                        [SAVE PROFILE CHANGES]
                      </button>
                    </div>

                  </form>
                )}

              </div>

      </div>
    </div >
      );
};
