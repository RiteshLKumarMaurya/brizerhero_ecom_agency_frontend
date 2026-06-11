'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Zap, Loader2, ArrowRight, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/api';
import { cn } from '@/lib/utils';

export function LoginPageClient() {
  const [fullPhone, setFullPhone] = useState('');   // e.g. +918651600737
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullPhone || !password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const { data } = await authApi.phoneLogin({
        fullPhoneNumber: fullPhone.startsWith('+') ? fullPhone : `+${fullPhone}`,
        password,
      });
      // Backend returns PhonePasswordLoginResponse: userProfileResponse + tokenResponse
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
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-16">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-glow-sm">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100">
              Brizer<span className="text-brand-500">Hero</span>
            </span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Welcome back</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Sign in to your account to continue</p>
        </div>

        <div className="card-base p-8 space-y-6">
          {/* Primary: Google */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3 text-center">Recommended</p>
            <GoogleSignInButton redirectTo={redirectTo} />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white dark:bg-zinc-900 text-zinc-400">or continue with phone</span>
            </div>
          </div>

          {/* Secondary: Phone + Password */}
          <form onSubmit={handlePhoneLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 block">
                Full Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="tel"
                  placeholder="+919876543210"
                  value={fullPhone}
                  onChange={(e) => setFullPhone(e.target.value)}
                  className="input-base pl-9"
                  autoComplete="tel"
                />
              </div>
              <p className="text-xs text-zinc-400 mt-1">Include country code, e.g. +91xxxxxxxxxx</p>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-base pl-9 pr-10"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn('btn-primary w-full justify-center py-3', loading && 'opacity-60 cursor-not-allowed')}
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
