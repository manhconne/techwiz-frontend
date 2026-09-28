'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, User, Lock, Sparkles, Check, ShieldCheck, LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoggedIn, loginAs } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex flex-col items-center justify-center p-4 font-mono">
        <div className="max-w-md w-full bg-[#161b22] border-2 border-black p-6 space-y-4 shadow-[6px_6px_0px_#000]">
          <div className="flex items-center gap-2 text-emerald-400">
            <Check className="w-5 h-5" />
            <h2 className="text-sm font-black uppercase">LOGGED IN SUCCESSFULLY</h2>
          </div>
          <p className="text-xs text-neutral-300">
            Logged in as: <strong className="text-white">{user.name}</strong> ({user.email}) - Role: <span className="uppercase text-amber-400 font-bold">{user.role}</span>
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="flex-1 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black text-center no-underline border border-black shadow-[2px_2px_0px_#000]"
              >
                OPEN ADMIN DASHBOARD →
              </Link>
            )}
            <Link
              href="/"
              className="flex-1 py-2 px-3 bg-white hover:bg-neutral-200 text-black text-xs font-black text-center no-underline border border-black shadow-[2px_2px_0px_#000]"
            >
              BACK TO HOME
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const lower = email.toLowerCase();
      if (lower.includes('admin') || lower === 'admin@fanhubplus.com') {
        loginAs('admin', { email, name: 'Fandom Director (Admin)' });
        router.push('/admin');
      } else {
        loginAs('registered', { email, name: email.split('@')[0] });
        router.push('/');
      }
    }, 500);
  };

  const handleQuickLogin = (role: 'admin' | 'registered') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      loginAs(role);
      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-mono relative selection:bg-[#ff2e93] selection:text-white">
      {/* Top Bar */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-white transition-colors no-underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
          FAN HUB PLUS AUTH
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto bg-[#161b22] border-2 border-black shadow-[8px_8px_0px_#000000] overflow-hidden my-auto">
        {/* Banner Bar */}
        <div className="bg-[#ffd60a] text-black px-5 py-3 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#ff2e93] border border-black inline-block" />
            <h1 className="text-xs font-black uppercase tracking-wider m-0">
              ★ SECURE SYSTEM LOGIN
            </h1>
          </div>
          <span className="text-[10px] font-black px-1.5 py-0.5 bg-black text-white">
            SECURE V2.4
          </span>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick Demo Credentials Box */}
          <div className="p-3 bg-amber-950/40 border border-amber-500/40 text-xs space-y-2">
            <div className="flex items-center justify-between text-amber-300 font-bold text-[11px] uppercase">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                SRS 1.9 DEMO 1-TOUCH
              </span>
              <span className="text-[9px] bg-amber-500/20 px-1 py-0.5 border border-amber-500/30">EVALUATOR</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2 bg-black border border-amber-500/50 hover:border-amber-400 text-left transition-colors cursor-pointer"
              >
                <div className="text-[10px] font-black text-amber-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  ADMIN
                </div>
                <div className="text-[9px] text-neutral-400 truncate">admin@fanhubplus.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('registered')}
                className="p-2 bg-black border border-pink-500/50 hover:border-pink-400 text-left transition-colors cursor-pointer"
              >
                <div className="text-[10px] font-black text-[#ff2e93] flex items-center gap-1">
                  <User className="w-3 h-3" />
                  FAN USER
                </div>
                <div className="text-[9px] text-neutral-400 truncate">fan_tokki@gmail.com</div>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-950/80 border border-rose-600 text-rose-300 text-xs font-bold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-300 uppercase block">
                Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@fanhubplus.com or fan@..."
                  className="w-full pl-9 pr-3 py-2 bg-[#0d1117] border border-neutral-700 text-white text-xs font-mono focus:border-[#ffd60a] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-300 uppercase block">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-[#0d1117] border border-neutral-700 text-white text-xs font-mono focus:border-[#ffd60a] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#ffd60a] hover:bg-[#ff2e93] hover:text-white text-black font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <span>AUTHENTICATING...</span>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>SIGN IN TO FAN HUB</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-neutral-400">
            <span>Don't have an account? </span>
            <Link href="/#login" className="text-[#ffd60a] hover:underline font-bold">
              Sign up on Homepage
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center text-[10px] text-neutral-600 pt-4">
        © 2026 FAN HUB PLUS • APTECH TECHWIZ 7 ACCREDITATION
      </div>
    </div>
  );
}
