'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, LogOut, Lock, RefreshCw } from 'lucide-react';
import { checkIsAdmin, getAccessToken } from '../../utils/authUtils';
import { useAuth } from '../../context/AuthContext';

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const verifyAccess = () => {
      const hasToken = !!getAccessToken();
      const isAdmin = checkIsAdmin(user);

      if (hasToken && isAdmin) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
      setIsChecking(false);
    };

    verifyAccess();
  }, [user]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mb-3" />
        <p className="text-sm font-bold text-slate-300">Đang xác thực quyền Quản trị viên...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>403 Forbidden · Quyền truy cập bị từ chối</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Khu Vực Quản Trị Viên (Admin)
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bạn không có quyền truy cập vào hệ thống Admin Dashboard. Trang này chỉ dành riêng cho tài khoản được cấp quyền Administrator.
            </p>
          </div>

          {user && user.email && (
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-400 text-left space-y-1 font-mono">
              <div className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">Tài khoản hiện tại:</div>
              <div className="text-white font-semibold truncate">{user.email}</div>
              <div className="text-amber-400 text-[11px]">Vai trò: {user.role || 'Người dùng thông thường'}</div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              href="/"
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-black transition-colors flex items-center justify-center gap-2 no-underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại trang chủ</span>
            </Link>

            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              type="button"
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Đổi tài khoản</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
