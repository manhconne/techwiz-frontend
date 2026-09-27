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
  { id: 'act-1', title: 'Đã đánh giá 5★ trailer NewJeans "Supernatural" Comeback MV', type: 'media', timestamp: '10 phút trước', link: '/multimedia' },
  { id: 'act-2', title: 'Đã lưu sự kiện SEVENTEEN World Tour [RIGHT HERE] vào lịch', type: 'event', timestamp: '1 giờ trước', link: '/event' },
  { id: 'act-3', title: 'Đã thêm aespa "Whiplash" Mini Album vào danh sách yêu thích', type: 'bookmark', timestamp: 'Hôm qua', link: '/#albums' },
  { id: 'act-4', title: 'Đã tham gia cộng đồng Bunnies (NewJeans Official Fandom)', type: 'fandom', timestamp: '3 ngày trước', link: '/#artists' },
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

    addActivity('Đăng nhập thành công vào hệ thống Fan Hub Universe', 'fandom');
    
    // Simulate New Device Login Notification
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('fanhub_local_push', {
        detail: {
          type: 'system',
          title: 'Cảnh Báo Bảo Mật',
          message: 'Tài khoản của bạn vừa đăng nhập từ thiết bị mới (Chrome - Windows).',
        }
      }));
    }, 2000);
    
    // Simulate Registration Welcome Notification
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('fanhub_local_push', {
        detail: {
          type: 'social',
          title: 'Chào mừng gia nhập FanHub!',
          message: 'Đăng ký tài khoản thành công. Hãy khám phá các sự kiện đang diễn ra nhé.',
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
    addActivity('Đã cập nhật thông tin hồ sơ và sở thích fandom', 'fandom');
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
    addActivity(`Đã ${user.favoriteFandoms.includes(fandom) ? 'bỏ theo dõi' : 'theo dõi fandom'} ${fandom}`, 'fandom');
  };

  const addActivity = (title: string, type: UserActivity['type'], link?: string) => {
    const newAct: UserActivity = {
      id: `act-${Date.now()}`,
      title,
      type,
      timestamp: 'Vừa xong',
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
      message: `Mã xác thực đặt lại mật khẩu đã được gửi tới email ${email}. (Mã thử nghiệm mô phỏng: ${token})`,
    };
  };

  const resetPasswordWithToken = (email: string, token: string, newPass: string) => {
    const stored = localStorage.getItem(`pwd_reset_${email}`);
    if (!stored) {
      return { success: false, message: 'Yêu cầu đặt lại mật khẩu không tồn tại hoặc đã hết hạn.' };
    }
    try {
      const parsed = JSON.parse(stored);
      if (parsed.token !== token.trim().toUpperCase()) {
        return { success: false, message: 'Mã xác thực token không chính xác. Vui lòng kiểm tra lại.' };
      }
      if (Date.now() > parsed.expires) {
        return { success: false, message: 'Mã xác thực đã hết hạn (quá 15 phút).' };
      }
      localStorage.removeItem(`pwd_reset_${email}`);
      return { success: true, message: 'Mật khẩu của bạn đã được cập nhật thành công! Hãy đăng nhập lại.' };
    } catch {
      return { success: false, message: 'Lỗi xử lý xác thực.' };
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
