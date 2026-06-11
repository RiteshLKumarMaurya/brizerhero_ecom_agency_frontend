'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Trash2, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminTestimonials, useDeleteTestimonial } from '@/hooks/useApi';
import { adminApi } from '@/services/api';
import { getThumbUrl } from '@/lib/cdn';
import { formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminTestimonialsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useAdminTestimonials(page);
  const { mutateAsync: deleteTestimonial } = useDeleteTestimonial();
  const qc = useQueryClient();

  const handleToggle = async (id: number, active: boolean) => {
    try {
      if (active) await adminApi.disableTestimonial(id);
      else await adminApi.enableTestimonial(id);
      toast.success(active ? 'Testimonial disabled' : 'Testimonial enabled');
      qc.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete testimonial from "${name}"?`)) return;
    try {
      await deleteTestimonial(id);
      toast.success('Testimonial deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100">Testimonials</h1>
        <p className="text-sm text-zinc-500 mt-1">{data?.totalElements ?? '—'} total testimonials</p>
      </div>

      <div className="card-base p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                {['Client', 'Company', 'Rating', 'Review', 'Featured', 'Status', 'Created', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {isLoading
                ? Array(6).fill(0).map((_, i) => (
                    <tr key={i}>{Array(8).fill(0).map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>)}</tr>
                  ))
                : data?.content.map((t) => (
                    <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-brand-100 dark:bg-brand-900/30 flex-shrink-0">
                            {t.thumbImage
                              // eslint-disable-next-line @next/next/no-img-element
                              ? <img src={getThumbUrl(t.thumbImage)} alt={t.clientName} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-brand-700 dark:text-brand-400 text-xs font-bold">{t.clientName?.charAt(0)}</div>
                            }
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t.clientName}</p>
                            <p className="text-xs text-zinc-400">{t.designationType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-500">{t.companyName || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-0.5">
                          {Array(5).fill(0).map((_, i) => (
                            <Star key={i} className={cn('w-3.5 h-3.5', i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200 dark:text-zinc-700')} />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500 max-w-[200px] truncate">
                        {t.review}
                      </td>
                      <td className="px-4 py-3">
                        {t.featured
                          ? <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-600 font-semibold">Featured</span>
                          : <span className="text-xs text-zinc-400">—</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold',
                          t.active ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                        )}>
                          {t.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-400">{t.createdAt ? formatDate(t.createdAt) : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleToggle(t.id, t.active)}
                            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors">
                            {t.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button onClick={() => handleDelete(t.id, t.clientName)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-400 hover:text-red-600 transition-colors">
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
