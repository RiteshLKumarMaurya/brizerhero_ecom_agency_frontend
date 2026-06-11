'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldOff, Shield, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useAdminUsers, useAdminBlockUser } from '@/hooks/useApi';
import { adminApi } from '@/services/api';
import { formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminUsersPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useAdminUsers(page);
  const { mutateAsync: blockUser } = useAdminBlockUser();
  const qc = useQueryClient();

  const handleBlock = async (id: number, blocked: boolean, name: string) => {
    const action = blocked ? 'Unblock' : 'Block';
    if (!confirm(`${action} user "${name}"?`)) return;
    try {
      await blockUser({ id, block: !blocked });
      toast.success(`User ${blocked ? 'unblocked' : 'blocked'}`);
    } catch { toast.error('Failed to update user'); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Permanently delete user "${name}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteUser(id);
      toast.success('User deleted');
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
    } catch { toast.error('Failed to delete user'); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100">Users</h1>
        <p className="text-sm text-zinc-500 mt-1">{data?.totalElements ?? '—'} total users</p>
      </div>

      <div className="card-base p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                {['User', 'Phone', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {isLoading
                ? Array(10).fill(0).map((_, i) => (
                    <tr key={i}>{Array(6).fill(0).map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>)}</tr>
                  ))
                : data?.content.map((user) => (
                    <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-700 dark:text-brand-400 text-xs font-bold flex-shrink-0">
                            {user.fullName?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{user.fullName || 'Unknown'}</p>
                            <p className="text-xs text-zinc-400 truncate max-w-[160px]">{user.email || 'No email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-500">{user.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold',
                          user.roleName?.includes('ADMIN')
                            ? 'bg-brand-50 dark:bg-brand-950/20 text-brand-700 dark:text-brand-400'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                        )}>
                          {user.roleName?.replace('ROLE_', '') || 'CLIENT'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold',
                          user.blocked
                            ? 'bg-red-50 dark:bg-red-950/20 text-red-600'
                            : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600'
                        )}>
                          {user.blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-400">
                        {user.createdAt ? formatDate(user.createdAt) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleBlock(user.id, user.blocked, user.fullName)}
                            title={user.blocked ? 'Unblock user' : 'Block user'}
                            className={cn(
                              'p-1.5 rounded-lg transition-colors',
                              user.blocked
                                ? 'hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-zinc-400 hover:text-emerald-600'
                                : 'hover:bg-amber-50 dark:hover:bg-amber-950/20 text-zinc-400 hover:text-amber-600'
                            )}
                          >
                            {user.blocked ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(user.id, user.fullName)}
                            title="Delete user"
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200 dark:border-zinc-800">
            <span className="text-xs text-zinc-500">
              Page {(data.page ?? 0) + 1} of {data.totalPages} · {data.totalElements} users
            </span>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={(data.page ?? 0) === 0}
                className={cn('btn-secondary p-2', (data.page ?? 0) === 0 && 'opacity-40 cursor-not-allowed')}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage((p) => p + 1)} disabled={data.last}
                className={cn('btn-secondary p-2', data.last && 'opacity-40 cursor-not-allowed')}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
