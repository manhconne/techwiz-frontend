'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile;
  isLoggedIn: boolean;
  loginAs: (role: 'registered' | 'admin', customData?: { id?: string; name?: string; email?: string }) => void;
  logout: () => void;
  toggleFavoriteFandom: (fandom: string) => void;
}

const defaultGuestUser: UserProfile = {
  id: 'guest-1',
  name: 'K-Pop Fan',
  email: 'fan@fandomplus.com',
  role: 'visitor',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  favoriteFandoms: ['Bunnies', 'BLINK', 'ARMY'],
  memberSince: '2024',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(defaultGuestUser);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('kpop_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        setIsLoggedIn(parsed.role !== 'visitor');
      } catch {
        // ignore
      }
    }
  }, []);

  const loginAs = (role: 'registered' | 'admin', customData?: { id?: string; name?: string; email?: string }) => {
    const newUser: UserProfile = {
      id: customData?.id || (role === 'admin' ? 'admin-001' : 'user-777'),
      name: customData?.name || (role === 'admin' ? 'Fandom Director (Admin)' : 'Haerin Star ⭐'),
      email: customData?.email || (role === 'admin' ? 'admin@fanhubplus.com' : 'fan_tokki@gmail.com'),
      role,
      avatar:
        role === 'admin'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      favoriteFandoms: ['Bunnies', 'STAY', 'MY'],
      memberSince: '2024',
    };
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('kpop_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(defaultGuestUser);
    setIsLoggedIn(false);
    localStorage.removeItem('kpop_user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
  };

  const toggleFavoriteFandom = (fandom: string) => {
    setUser((prev) => {
      const exists = prev.favoriteFandoms.includes(fandom);
      const updated = exists
        ? prev.favoriteFandoms.filter((f) => f !== fandom)
        : [...prev.favoriteFandoms, fandom];
      const nextUser = { ...prev, favoriteFandoms: updated };
      localStorage.setItem('kpop_user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loginAs, logout, toggleFavoriteFandom }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
