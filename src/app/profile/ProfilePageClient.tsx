'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Edit2, Save, X, Loader2, Shield, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useMe, useUpdateMe } from '@/hooks/useApi';
import { authApi } from '@/services/api';
import { getThumbUrl } from '@/lib/cdn';
import { cn } from '@/lib/utils';

export function ProfilePageClient() {
  const router = useRouter();
  const { user: storeUser, isAuthenticated, setUser, clearAuth } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login?redirect=/profile');
  }, [isAuthenticated, router]);

  const { data: profile, isLoading } = useMe();
  const { mutateAsync: updateMe, isPending: saving } = useUpdateMe();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setUser(profile);
    }
  }, [profile, setUser]);

  const handleSave = async () => {
    try {
      const updated = await updateMe({ fullName });
      setUser(updated.data.data);
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = async () => {
    try { await authApi.logout({}); } catch {}
    clearAuth();
    toast.success('Logged out');
    router.push('/');
  };

  if (!isAuthenticated) return null;

  const displayUser = profile || storeUser;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-16">
      <div className="section-container max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-zinc-900 dark:text-zinc-100">My Profile</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your account settings</p>
          </div>

          {/* Avatar + name card */}
          <div className="card-base p-6 mb-5">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                {displayUser?.mediaProfile ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getThumbUrl(displayUser.mediaProfile)} alt={displayUser.fullName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                )}
              </div>
              <div className="flex-1">
                {isLoading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="skeleton h-5 w-40" />
                    <div className="skeleton h-4 w-56" />
                  </div>
                ) : (
                  <>
                    {editing ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="input-base text-base font-semibold"
                          autoFocus
                        />
                        <button onClick={handleSave} disabled={saving} className="btn-primary p-2.5">
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setEditing(false)} className="btn-secondary p-2.5">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h2 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-100">
                          {displayUser?.fullName || 'No name set'}
                        </h2>
                        <button onClick={() => setEditing(true)} className="text-zinc-400 hover:text-brand-500 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 mt-1">
                      <Shield className="w-3.5 h-3.5 text-brand-500" />
                      <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                        {displayUser?.roleName?.replace('ROLE_', '') || 'CLIENT'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="card-base p-6 mb-5 space-y-4">
            <h3 className="font-display font-bold text-zinc-900 dark:text-zinc-100 mb-4">Contact Information</h3>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Mail className="w-4 h-4 text-zinc-500" />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-medium">Email</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {displayUser?.email || '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Phone className="w-4 h-4 text-zinc-500" />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-medium">Phone</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {displayUser?.phone || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Account status */}
          <div className="card-base p-6 mb-5">
            <h3 className="font-display font-bold text-zinc-900 dark:text-zinc-100 mb-4">Account Status</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Account status</span>
              <span className={cn(
                'text-xs font-semibold px-2.5 py-1 rounded-full',
                displayUser?.blocked
                  ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400'
                  : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
              )}>
                {displayUser?.blocked ? 'Suspended' : 'Active'}
              </span>
            </div>
          </div>

          {/* Sign out */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-sm font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
}
