'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Star, StarOff, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useAdminServices } from '@/hooks/useApi';
import { adminApi } from '@/services/api';
import { getOptimizedUrl } from '@/lib/cdn';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminServicesPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useAdminServices(page);
  const qc = useQueryClient();

  const handleToggleActive = async (id: number, active: boolean) => {
    try {
      if (active) await adminApi.disableService(id);
      else await adminApi.enableService(id);
      toast.success(active ? 'Service disabled' : 'Service enabled');
      qc.invalidateQueries({ queryKey: ['admin', 'services'] });
    } catch { toast.error('Failed to update'); }
  };

  const handleToggleFeatured = async (id: number, featured: boolean) => {
    try {
      if (featured) await adminApi.unfeatureService(id);
      else await adminApi.featureService(id);
      toast.success(featured ? 'Removed from featured' : 'Marked as featured');
      qc.invalidateQueries({ queryKey: ['admin', 'services'] });
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100">Services</h1>
        <p className="text-sm text-zinc-500 mt-1">{data?.totalElements ?? '—'} total services</p>
      </div>

      <div className="card-base p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                {['', 'Name', 'Slug', 'Features', 'Technologies', 'Featured', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {isLoading
                ? Array(6).fill(0).map((_, i) => (
                    <tr key={i}>{Array(8).fill(0).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>
                    ))}</tr>
                  ))
                : data?.content.map((service) => (
                    <motion.tr key={service.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center">
                          {service.iconImage
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={getOptimizedUrl(service.iconImage)} alt={service.name} className="w-5 h-5 object-contain" />
                            : <span className="text-brand-600 dark:text-brand-400 text-xs font-bold">{service.name?.charAt(0)}</span>
                          }
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{service.name}</p>
                        <p className="text-xs text-zinc-400 truncate max-w-[180px]">{service.shortDescription}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500 font-mono">{service.slug}</td>
                      <td className="px-4 py-3 text-sm text-zinc-500">{service.features?.length ?? 0}</td>
                      <td className="px-4 py-3 text-sm text-zinc-500">{service.technologies?.length ?? 0}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleToggleFeatured(service.id, service.featured)}
                          className={cn('p-1.5 rounded-lg transition-colors',
                            service.featured ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20' : 'text-zinc-300 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                          )}>
                          {service.featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold',
                          service.active ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                        )}>
                          {service.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link href={`/services/${service.slug}`} target="_blank"
                            className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950/20 text-zinc-400 hover:text-brand-600 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleToggleActive(service.id, service.active)}
                            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors">
                            {service.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
