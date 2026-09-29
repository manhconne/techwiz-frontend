'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Lock, RefreshCw, User } from 'lucide-react';
import { checkIsAdmin, getAccessToken } from '../../utils/authUtils';
import { useAuth } from '../../context/AuthContext';
import { isBypassAdminEnabled } from '../../config/adminConfig';

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const verifyAccess = () => {
      const hasToken = !!getAccessToken();
      const isAdmin = checkIsAdmin(user);
      setIsAuthorized(isAdmin);
      setIsChecking(false);
    };

    verifyAccess();
  }, [user]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-slate-800">
        <div
          style={{ borderRadius: '0px' }}
          className="w-12 h-12 bg-white border border-slate-300 flex items-center justify-center shadow-md mb-3"
        >
          <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
        </div>
        <p className="text-xs font-bold tracking-wide text-slate-600 font-mono">Authenticating Administrator privileges...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 text-slate-900 relative">
        {/* Clean Client-Matching Square White Card */}
        <div
          style={{ borderRadius: '0px' }}
          className="relative max-w-md w-full bg-white border-2 border-slate-900 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900"
        >
          {/* Top accent bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-rose-600" />

          {/* Header Section */}
          <div className="flex flex-col items-center text-center space-y-3.5 pt-2">
            {/* Square Icon Badge */}
            <div
              style={{ borderRadius: '0px' }}
              className="w-14 h-14 bg-rose-50 border-2 border-rose-600 flex items-center justify-center text-rose-600 shadow-xs relative"
            >
              <ShieldAlert className="w-7 h-7 text-rose-600" />
            </div>

            {/* Status Tag */}
            <div
              style={{ borderRadius: '0px' }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-300 text-rose-700 text-[11px] font-mono font-bold tracking-wider uppercase"
            >
              <Lock className="w-3.5 h-3.5 text-rose-600" />
              <span>403 FORBIDDEN · ACCESS RESTRICTED</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Restricted Administrator Portal
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                Bạn không có quyền truy cập vào Cổng Quản trị FanHub. Khu vực này chỉ dành riêng cho Quản trị viên được cấp phép.
              </p>
            </div>
          </div>

          {/* Square Account Info Card */}
          <div
            style={{ borderRadius: '0px' }}
            className="bg-slate-50 border border-slate-200 p-4 space-y-3 my-4"
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wider pb-2 border-b border-slate-200">
              <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Current Account
              </span>
              <span
                style={{ borderRadius: '0px' }}
                className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-700 border border-slate-300 font-mono font-bold"
              >
                SESSION
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-slate-500 font-semibold">Email:</div>
              <div
                style={{ borderRadius: '0px' }}
                className="text-xs font-mono font-bold text-slate-900 truncate bg-white px-3 py-2 border border-slate-300"
              >
                {user?.email || 'Chưa đăng nhập (Not Signed In)'}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500 font-semibold">Vai trò (Role):</span>
              <span
                style={{ borderRadius: '0px' }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold uppercase bg-amber-50 text-amber-800 border border-amber-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {user?.role || 'visitor'}
              </span>
            </div>
          </div>

          {/* Action Button: Return to Homepage ONLY (No border radius, visible text & button) */}
          <div className="pt-2">
            <Link
              href="/"
              style={{
                borderRadius: '0px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: '2px solid #0f172a',
              }}
              className="w-full py-3 px-5 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm hover:bg-slate-800 no-underline cursor-pointer active:scale-[0.99]"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
              <span style={{ color: '#ffffff' }}>Về trang chủ (Return to Homepage)</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isBypassAdminEnabled() && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-300 px-4 py-2 text-xs font-mono flex items-center justify-between z-50 relative">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>
              <strong>[DEV MODE]</strong> Chế độ Bypass Kiểm Tra Admin đang <strong>BẬT</strong> (<code className="bg-amber-950/60 px-1 py-0.5 rounded text-amber-200">config/adminConfig.ts</code> = <code className="text-emerald-400 font-bold">'on'</code>)
            </span>
          </div>
          <span className="text-[11px] text-amber-400/80 hidden sm:inline">Truy cập tất cả trang Quản trị không cần Token/Role API</span>
        </div>
      )}
      {children}
    </>
  );
};
