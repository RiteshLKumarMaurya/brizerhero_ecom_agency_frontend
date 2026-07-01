'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Loader2, ArrowRight, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/api';
import { cn } from '@/lib/utils';
import { getFCMToken } from '@/lib/firebase'; // ✅ ADDED

export function LoginPageClient() {
  const [fullPhone, setFullPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  // If the store rehydrates with an already-valid session (e.g. this tab
  // was opened directly to /login while another tab is logged in, or the
  // user hit back after signing in), send them straight through instead of
  // letting them re-submit the login form against a live session.
  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isHydrated, isAuthenticated, router, redirectTo]);

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullPhone || !password) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      // 🔥 1. Get FCM token (if available)
      const fcmToken = await getFCMToken();

      // 2. Login request with fcmToken & device
      const { data } = await authApi.phoneLogin({
        fullPhoneNumber: fullPhone.startsWith('+') ? fullPhone : `+${fullPhone}`,
        password,
        fcmToken: fcmToken || undefined,
        device: 'web',
      });

      const user = data.data.userProfileResponse;
      const tokens = data.data.tokenResponse;
      setAuth(user, tokens.accessToken, tokens.refreshToken);
      toast.success(`Welcome back, ${user.fullName?.split(' ')[0] || 'there'}!`);

      router.push(redirectTo);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Invalid credentials';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 px-4 py-16">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Logo
        <Link href="/" className="flex justify-center mb-8 transition-opacity hover:opacity-80">
          <Image
            src="/logo.svg"          // CHANGE TO YOUR LOGO
            alt="Your Brand Logo"
            width={180}
            height={52}
            priority
            className="h-12 w-auto"
          />
        </Link> */}

        {/* Glass Card */}
        <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 shadow-2xl shadow-zinc-200/50 dark:shadow-zinc-950/50 rounded-3xl p-8 space-y-8">
          <div className="text-center space-y-1">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Welcome back
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Sign in to your account to continue
            </p>
          </div>

          {/* Google Button */}
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest text-center mb-3">
              Continue with
            </p>
            <div className="w-full">
              <GoogleSignInButton redirectTo={redirectTo} />
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200/70 dark:border-zinc-700/70" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-zinc-400">
                or continue with phone
              </span>
            </div>
          </div>

          {/* Phone Login Form */}
          <form onSubmit={handlePhoneLogin} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
                Full Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10 pointer-events-none flex-shrink-0" />
                <input
                  type="tel"
                  placeholder="+919876543210"
                  value={fullPhone}
                  onChange={(e) => setFullPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                  autoComplete="tel"
                />
              </div>
              <p className="text-xs text-zinc-400 mt-1.5">Include country code, e.g. +91xxxxxxxxxx</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10 pointer-events-none flex-shrink-0" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition z-10"
                >
                  {showPass ? <EyeOff className="w-4 h-4 flex-shrink-0" /> : <Eye className="w-4 h-4 flex-shrink-0" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-200',
                loading && 'opacity-60 cursor-not-allowed'
              )}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin flex-shrink-0" /> Signing in…</>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4 flex-shrink-0" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline hover:underline-offset-2">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}