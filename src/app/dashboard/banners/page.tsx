'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { useAdminBanners } from '@/hooks/useApi';
import { adminApi } from '@/services/api';
import { getOptimizedUrl } from '@/lib/cdn';
import { formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminBannersPage() {
  const { data: banners, isLoading } = useAdminBanners();
  const qc = useQueryClient();

  const handleToggle = async (id: number, active: boolean) => {
    try {
      if (active) await adminApi.disableBanner(id);
      else await adminApi.enableBanner(id);
      toast.success(active ? 'Banner disabled' : 'Banner enabled');
      qc.invalidateQueries({ queryKey: ['admin', 'banners'] });
    } catch { toast.error('Failed to update banner'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this banner? This cannot be undone.')) return;
    try {
      await adminApi.deleteBanner(id);
      toast.success('Banner deleted');
      qc.invalidateQueries({ queryKey: ['admin', 'banners'] });
    } catch { toast.error('Failed to delete banner'); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100">Banners</h1>
        <p className="text-sm text-zinc-500 mt-1">{banners?.length ?? '—'} total banners</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array(6).fill(0).map((_, i) => (
              <div key={i} className="card-base animate-pulse">
                <div className="skeleton w-full aspect-video rounded-xl mb-3" />
                <div className="skeleton h-4 w-1/2 rounded mb-2" />
                <div className="skeleton h-3 w-1/3 rounded" />
              </div>
            ))
          : banners?.map((banner) => (
              <motion.div key={banner.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="card-base overflow-hidden p-0">
                <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800">
                  {banner.bannerImage
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={getOptimizedUrl(banner.bannerImage)} alt={`Banner ${banner.id}`} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">No image</div>
                  }
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold backdrop-blur-sm',
                      banner.active ? 'bg-emerald-500/90 text-white' : 'bg-zinc-500/90 text-white'
                    )}>
                      {banner.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Banner #{banner.id}</p>
                      <p className="text-xs text-zinc-500">{banner.type} · Priority {banner.priority}</p>
                    </div>
                  </div>
                  {banner.redirectUrl && (
                    <p className="text-xs text-brand-500 truncate mb-3">{banner.redirectUrl}</p>
                  )}
                  {banner.startAt && (
                    <p className="text-xs text-zinc-400 mb-3">
                      {formatDate(banner.startAt)} → {banner.endAt ? formatDate(banner.endAt) : 'No end'}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => handleToggle(banner.id, banner.active)}
                      className={cn('flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-colors',
                        banner.active
                          ? 'border-amber-200 dark:border-amber-900/30 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                          : 'border-emerald-200 dark:border-emerald-900/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                      )}>
                      {banner.active ? <><EyeOff className="w-3.5 h-3.5" /> Disable</> : <><Eye className="w-3.5 h-3.5" /> Enable</>}
                    </button>
                    <button onClick={() => handleDelete(banner.id)}
                      className="px-3 py-2 rounded-lg text-xs font-medium border border-red-200 dark:border-red-900/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
        }
        {!isLoading && (!banners || banners.length === 0) && (
          <div className="col-span-3 text-center py-12 text-zinc-400">
            <p className="text-sm">No banners found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
