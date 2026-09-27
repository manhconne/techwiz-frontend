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
  { id: 'act-1', title: 'Rated 5★ on NewJeans "Supernatural" Comeback MV trailer', type: 'media', timestamp: '10 mins ago', link: '/multimedia' },
  { id: 'act-2', title: 'Saved SEVENTEEN World Tour [RIGHT HERE] to calendar', type: 'event', timestamp: '1 hour ago', link: '/event' },
  { id: 'act-3', title: 'Added aespa "Whiplash" Mini Album to wishlist', type: 'bookmark', timestamp: 'Yesterday', link: '/#albums' },
  { id: 'act-4', title: 'Joined Bunnies community (NewJeans Official Fandom)', type: 'fandom', timestamp: '3 days ago', link: '/#artists' },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(defaultGuestUser);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activities, setActivities] = useState<UserActivity[]>(initialActivities);

  useEffect(() => {
    const fetchMe = async () => {
      let token = '';
      if (typeof window !== 'undefined') {
        const match = document.cookie.match(/access_token=([^;]+)/);
        if (match && match[1]) token = decodeURIComponent(match[1]);
        if (!token) token = localStorage.getItem('access_token') || localStorage.getItem('token') || '';
      }

      if (token) {
        try {
          const res = await fetch('/api/v1/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (res.ok && data.data) {
            const userData = data.data;
            const roles: string[] = Array.isArray(userData.roles) ? userData.roles : (userData.role ? [userData.role] : []);
            const isAdmin = roles.some((r: string) => String(r).toLowerCase() === 'admin') ||
              (userData.email && (userData.email.toLowerCase() === 'lumanhgioi.vn@gmail.com' || userData.email.toLowerCase().includes('admin')));
            const role = isAdmin ? 'admin' : 'registered';
            const loggedInUser: UserProfile = {
              id: userData.id,
              name: userData.fullName || (userData.firstName ? `${userData.firstName} ${userData.lastName || ''}`.trim() : userData.name) || 'K-Pop Fan',
              email: userData.email,
              role: role,
              avatar: userData.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
              favoriteFandoms: [],
              memberSince: '2024'
            };
            setUser(loggedInUser);
            setIsLoggedIn(true);
            localStorage.setItem('kpop_user', JSON.stringify(loggedInUser));
            return;
          }
        } catch {
          // If auth/me endpoint is offline, decode JWT token payload directly
          try {
            const parts = token.split('.');
            if (parts.length >= 2) {
              const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
              const payload = JSON.parse(decodeURIComponent(escape(atob(base64))));
              const emailClaim = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload['email'];
              const roleClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload['role'] || payload['roles'];
              const isAdmin = (Array.isArray(roleClaim) ? roleClaim.some((r: string) => String(r).toLowerCase() === 'admin') : String(roleClaim).toLowerCase() === 'admin') ||
                (emailClaim && (String(emailClaim).toLowerCase() === 'lumanhgioi.vn@gmail.com' || String(emailClaim).toLowerCase().includes('admin')));
              const nameClaim = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload['name'] || payload['fullName'];
              const idClaim = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload['sub'] || payload['id'];

              const fallbackUser: UserProfile = {
                id: idClaim || 'usr_jwt',
                name: nameClaim || 'K-Pop Fan',
                email: emailClaim || 'user@fanhub.com',
                role: isAdmin ? 'admin' : 'registered',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
                favoriteFandoms: [],
                memberSince: '2024'
              };
              setUser(fallbackUser);
              setIsLoggedIn(true);
              localStorage.setItem('kpop_user', JSON.stringify(fallbackUser));
              return;
            }
          } catch {}
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

    addActivity('Signed in successfully to Fan Hub Universe', 'fandom');
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
    addActivity(`${user.favoriteFandoms.includes(fandom) ? 'Unfollowed' : 'Followed fandom'} ${fandom}`, 'fandom');
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
      message: `Password reset verification code has been sent to ${email}. (Simulation demo token: ${token})`,
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
        return { success: false, message: 'Invalid verification token. Please double check.' };
      }
      if (Date.now() > parsed.expires) {
        return { success: false, message: 'Verification code has expired (exceeded 15 minutes).' };
      }
      localStorage.removeItem(`pwd_reset_${email}`);
      return { success: true, message: 'Your password has been successfully updated! Please sign in again.' };
    } catch {
      return { success: false, message: 'Authentication verification error.' };
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
