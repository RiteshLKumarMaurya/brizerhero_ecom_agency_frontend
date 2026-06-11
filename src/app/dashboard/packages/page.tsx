'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useAdminPackages } from '@/hooks/useApi';
import { adminApi } from '@/services/api';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminPackagesPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useAdminPackages(page);
  const qc = useQueryClient();

  const handleToggle = async (id: number, active: boolean) => {
    try {
      if (active) await adminApi.disablePackage(id);
      else await adminApi.enablePackage(id);
      toast.success(active ? 'Package disabled' : 'Package enabled');
      qc.invalidateQueries({ queryKey: ['admin', 'packages'] });
    } catch { toast.error('Failed to update package'); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100">Packages</h1>
        <p className="text-sm text-zinc-500 mt-1">{data?.totalElements ?? '—'} total packages</p>
      </div>

      <div className="card-base p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                {['Name', 'Price', 'Services', 'Featured', 'Order', 'Status', 'Created', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {isLoading
                ? Array(5).fill(0).map((_, i) => (
                    <tr key={i}>{Array(8).fill(0).map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>)}</tr>
                  ))
                : data?.content.map((pkg) => (
                    <motion.tr key={pkg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{pkg.name}</p>
                        <p className="text-xs text-zinc-400 font-mono">{pkg.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                          {formatPrice(pkg.price, pkg.currencyCode)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-500">{pkg.services?.length ?? 0} services</td>
                      <td className="px-4 py-3">
                        {pkg.featured
                          ? <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-600 font-semibold">Featured</span>
                          : <span className="text-xs text-zinc-400">—</span>
                        }
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-500">{pkg.displayOrder}</td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold',
                          pkg.active ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                        )}>
                          {pkg.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-400">{pkg.createdAt ? formatDate(pkg.createdAt) : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link href={`/packages/${pkg.slug}`} target="_blank"
                            className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950/20 text-zinc-400 hover:text-brand-600 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleToggle(pkg.id, pkg.active)}
                            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors">
                            {pkg.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
            <span className="text-xs text-zinc-500">Page {(data.page ?? 0) + 1} of {data.totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={(data.page ?? 0) === 0} className={cn('btn-secondary p-2', (data.page ?? 0) === 0 && 'opacity-40 cursor-not-allowed')}><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setPage((p) => p + 1)} disabled={data.last} className={cn('btn-secondary p-2', data.last && 'opacity-40 cursor-not-allowed')}><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
