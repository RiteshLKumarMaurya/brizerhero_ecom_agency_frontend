'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Eye, EyeOff, Phone, Lock, User, Loader2, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/api';
import { cn } from '@/lib/utils';
import { getFCMToken } from '@/lib/firebase'; // ✅ ADDED

export function RegisterPageClient() {
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber || !password || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // 🔥 1. Get FCM token
      const fcmToken = await getFCMToken();

      // 2. Register request with fcmToken & device
      const { data } = await authApi.register({
        fullName,
        phoneNumber: phoneNumber.replace(/\s/g, ''),
        countryCode,
        password,
        roleName: 'ROLE_CLIENT',
        fcmToken: fcmToken || undefined,
        device: 'web',
      });

      const user = data.data.userProfileResponse;
      const tokens = data.data.tokenResponse;
      if (user && tokens) {
        setAuth(user, tokens.accessToken, tokens.refreshToken);
        toast.success('Account created! Welcome.');
        router.push('/');
      } else {
        toast.success('Account created! Please sign in.');
        router.push('/login');
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
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
        

        {/* Glass Card */}
        <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 shadow-2xl shadow-zinc-200/50 dark:shadow-zinc-950/50 rounded-3xl p-8 space-y-8">
          <div className="text-center space-y-1">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Create account
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Join the community in seconds
            </p>
          </div>

          {/* Google Button */}
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest text-center mb-3">
              Get started with
            </p>
            <div className="w-full">
              <GoogleSignInButton redirectTo="/" />
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200/70 dark:border-zinc-700/70" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-zinc-400">
                or register with phone
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10 pointer-events-none flex-shrink-0" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
                Phone number
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-24 flex-shrink-0 px-3 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+65">🇸🇬 +65</option>
                  <option value="+61">🇦🇺 +61</option>
                </select>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10 pointer-events-none flex-shrink-0" />
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10 pointer-events-none flex-shrink-0" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                  autoComplete="new-password"
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

            <div>
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10 pointer-events-none flex-shrink-0" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                  autoComplete="new-password"
                />
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
                <><Loader2 className="w-4 h-4 animate-spin flex-shrink-0" /> Creating account…</>
              ) : (
                <>Create account <ArrowRight className="w-4 h-4 flex-shrink-0" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline hover:underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}