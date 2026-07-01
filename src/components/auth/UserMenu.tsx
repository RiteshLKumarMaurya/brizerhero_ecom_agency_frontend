'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LayoutDashboard, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/hooks/useLogout';
import { getThumbUrl } from '@/lib/cdn';
import toast from 'react-hot-toast';

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  const handleLogout = async () => {
    await logout({ redirectTo: '/' });
    toast.success('Logged out successfully');
    setOpen(false);
  };

  const isAdmin = user?.roleName === 'ROLE_ADMIN' ;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <div className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center overflow-hidden">
          {user?.mediaProfile ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={getThumbUrl(user.mediaProfile)} alt={user.fullName} className="w-full h-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          )}
        </div>
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hidden sm:block">
          {user?.fullName?.split(' ')[0] || 'Account'}
        </span>
        <ChevronDown className="w-3 h-3 text-zinc-400" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-52 z-40 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-elevated overflow-hidden"
            >
              <div className="p-3 border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{user?.fullName}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user?.email || user?.phone}</p>
              </div>
              <div className="p-1.5">
                <Link href="/profile" onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                  <User className="w-4 h-4" /> Profile
                </Link>
                {isAdmin && (
                  <Link href="/dashboard" onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                  </Link>
                )}
                <Link href="/profile" onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
