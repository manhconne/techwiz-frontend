'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

export interface UserActivity {
  id: string;
  title: string;
  type: 'review' | 'bookmark' | 'media' | 'event' | 'fandom';
  timestamp: string;
  link?: string;
}

interface AuthContextType {
  user: UserProfile;
  isLoggedIn: boolean;
  activities: UserActivity[];
  loginAs: (role: 'registered' | 'admin', customData?: { id?: string; name?: string; email?: string }) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  toggleFavoriteFandom: (fandom: string) => void;
  requestPasswordReset: (email: string) => { success: boolean; token: string; message: string };
  resetPasswordWithToken: (email: string, token: string, newPass: string) => { success: boolean; message: string };
  addActivity: (title: string, type: UserActivity['type'], link?: string) => void;
}

const defaultGuestUser: UserProfile = {
  id: 'guest-1',
  name: 'K-Pop Fan',
  email: 'fan@fandomplus.com',
  role: 'visitor',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  favoriteFandoms: ['Bunnies (NewJeans)', 'BLINK (BLACKPINK)', 'ARMY (BTS)'],
  memberSince: '2024',
};

const initialActivities: UserActivity[] = [
  { id: 'act-1', title: 'Rated 5★ for NewJeans "Supernatural" Comeback MV', type: 'media', timestamp: '10 mins ago', link: '/multimedia' },
  { id: 'act-2', title: 'Saved SEVENTEEN World Tour [RIGHT HERE] to calendar', type: 'event', timestamp: '1 hour ago', link: '/event' },
  { id: 'act-3', title: 'Bookmarked aespa "Whiplash" Mini Album to favorites', type: 'bookmark', timestamp: 'Yesterday', link: '/#albums' },
  { id: 'act-4', title: 'Joined Bunnies (NewJeans Official Fandom) community', type: 'fandom', timestamp: '3 days ago', link: '/#artists' },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(defaultGuestUser);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activities, setActivities] = useState<UserActivity[]>(initialActivities);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const res = await fetch('/api/v1/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const text = await res.text();
          const data = text ? JSON.parse(text) : {};
          if (res.ok && data.data) {
            const userData = data.data;
            const role = (userData.roles && userData.roles.includes('Admin')) ? 'admin' : 'registered';
            const loggedInUser: UserProfile = {
              id: userData.id,
              name: userData.firstName + ' ' + userData.lastName,
              email: userData.email,
              role: role,
              avatar: userData.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
              favoriteFandoms: [],
              memberSince: '2024'
            };
            setUser(loggedInUser);
            setIsLoggedIn(true);
            return;
          }
        } catch (err) {
          console.error("Failed to fetch user profile", err);
        }
      }

      // Fallback to localStorage if no token or API failed
      const saved = localStorage.getItem('kpop_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUser(parsed);
          setIsLoggedIn(parsed.role !== 'visitor');
        } catch { }
      }
    };

    fetchMe();

    const savedActs = localStorage.getItem('kpop_user_activities');
    if (savedActs) {
      try {
        setActivities(JSON.parse(savedActs));
      } catch { }
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
      favoriteFandoms: ['Bunnies (NewJeans)', 'STAY (Stray Kids)', 'MY (aespa)'],
      memberSince: '2024',
    };
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('kpop_user', JSON.stringify(newUser));
    if (role === 'admin') {
      localStorage.setItem('access_token', 'mock_admin_token_srs_eval');
    }

    addActivity('Successfully signed into Fan Hub Universe', 'fandom');

    // Simulate New Device Login Notification
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('fanhub_local_push', {
        detail: {
          type: 'system',
          title: 'Security Alert',
          message: 'Your account was just logged in from a new device (Chrome - Windows).',
        }
      }));
    }, 2000);

    // Simulate Registration Welcome Notification
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('fanhub_local_push', {
        detail: {
          type: 'social',
          title: 'Welcome to FanHub!',
          message: 'Account created successfully. Explore all live fandom events now!',
        }
      }));
    }, 4000);
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

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem('kpop_user', JSON.stringify(updated));
      return updated;
    });
    addActivity('Updated profile information and fandom preferences', 'fandom');
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
    addActivity(`${user.favoriteFandoms.includes(fandom) ? 'Unfollowed' : 'Followed'} ${fandom} fandom`, 'fandom');
  };

  const addActivity = (title: string, type: UserActivity['type'], link?: string) => {
    const newAct: UserActivity = {
      id: `act-${Date.now()}`,
      title,
      type,
      timestamp: 'Just now',
      link,
    };
    setActivities((prev) => {
      const next = [newAct, ...prev.slice(0, 19)]; // keep 20 latest
      localStorage.setItem('kpop_user_activities', JSON.stringify(next));
      return next;
    });
  };

  const requestPasswordReset = (email: string) => {
    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    // Save to localStorage simulation
    localStorage.setItem(`pwd_reset_${email}`, JSON.stringify({ token, expires: Date.now() + 15 * 60 * 1000 }));
    return {
      success: true,
      token,
      message: `Password reset verification token has been dispatched to ${email}. (Demo token: ${token})`,
    };
  };

  const resetPasswordWithToken = (email: string, token: string, newPass: string) => {
    const stored = localStorage.getItem(`pwd_reset_${email}`);
    if (!stored) {
      return { success: false, message: 'Password reset request does not exist or has expired.' };
    }
    try {
      const parsed = JSON.parse(stored);
      if (parsed.token !== token.trim().toUpperCase()) {
        return { success: false, message: 'Invalid verification token. Please verify and try again.' };
      }
      if (Date.now() > parsed.expires) {
        return { success: false, message: 'Verification token has expired (exceeded 15 minutes).' };
      }
      localStorage.removeItem(`pwd_reset_${email}`);
      return { success: true, message: 'Your password has been successfully updated! Please sign in again.' };
    } catch {
      return { success: false, message: 'Authentication processing error.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        activities,
        loginAs,
        logout,
        updateProfile,
        toggleFavoriteFandom,
        requestPasswordReset,
        resetPasswordWithToken,
        addActivity,
      }}
    >
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
