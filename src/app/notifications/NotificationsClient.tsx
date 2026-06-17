'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell, Check, CheckCheck, X, Trash2, ChevronLeft, ChevronRight,
  ExternalLink, AlertCircle, Loader2
} from 'lucide-react';
import { useNotifications, useMarkAsRead, useMarkAllAsRead, useDeleteNotification, useClearAllNotifications } from '@/hooks/useNotifications';
import { formatDate, cn } from '@/lib/utils';
import { getOptimizedUrl } from '@/lib/cdn';
import toast from 'react-hot-toast';

export function NotificationsClient() {
  const [page, setPage] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading, refetch } = useNotifications(page, 15);
  const { mutateAsync: markAsRead } = useMarkAsRead();
  const { mutateAsync: markAllAsRead } = useMarkAllAsRead();
  const { mutateAsync: deleteNotification } = useDeleteNotification();
  const { mutateAsync: clearAll } = useClearAllNotifications();

  const notifications = data?.content || [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const currentPage = data?.number ?? 0;

  // ─── Handlers ───────────────────────────────────────────────

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      await refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      await refetch();
      toast.success('All notifications marked as read');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to mark all as read');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this notification?')) return;
    setDeletingId(id);
    try {
      await deleteNotification(id);
      await refetch();
      toast.success('Notification deleted');
    } catch (err: any) {
      // Show specific error if available
      const msg = err?.response?.data?.message || 'Failed to delete notification';
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Delete all notifications? This cannot be undone.')) return;
    try {
      await clearAll();
      await refetch();
      toast.success('All notifications cleared');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to clear notifications');
    }
  };

  // ─── Helpers ────────────────────────────────────────────────

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      LEAD: 'bg-blue-100 text-blue-700',
      PROMOTION: 'bg-amber-100 text-amber-700',
      PAYMENT: 'bg-emerald-100 text-emerald-700',
      SYSTEM: 'bg-purple-100 text-purple-700',
      SECURITY: 'bg-red-100 text-red-700',
    };
    return colors[type] || 'bg-zinc-100 text-zinc-700';
  };

  const getImageUrl = (notification: any): string | null => {
    if (notification.image?.optimizedKey) {
      return getOptimizedUrl(notification.image.optimizedKey);
    }
    if (notification.imageUrl) {
      return notification.imageUrl;
    }
    if (notification.bannerImage?.optimizedKey) {
      return getOptimizedUrl(notification.bannerImage.optimizedKey);
    }
    return null;
  };

  // ─── Render  Header and more ──────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto pt-24 pb-12 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Notifications
          </h1>
          <p className="text-sm text-zinc-500">{totalElements} total</p>
        </div>
        <div className="flex gap-2">
          {notifications.some(n => !n.read) && (
            <button
              onClick={handleMarkAllAsRead}
              className="btn-secondary text-sm px-4 py-2"
            >
              <CheckCheck className="w-4 h-4" /> Mark all read
            </button>
          )}
          {totalElements > 0 && (
            <button
              onClick={handleClearAll}
              className="btn-secondary text-sm px-4 py-2 text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && totalElements === 0 && (
        <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
          <Bell className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-600 mb-4" />
          <p className="text-zinc-500 font-medium">No notifications</p>
          <p className="text-sm text-zinc-400">You're all caught up!</p>
        </div>
      )}

      {/* Notification list */}
      {!isLoading && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notification, idx) => {
            const imageUrl = getImageUrl(notification);
            const isDeleting = deletingId === notification.id;

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={cn(
                  'card-base p-4 flex items-start gap-4 transition-all',
                  !notification.read
                    ? 'border-brand-300/60 bg-brand-50/30 dark:bg-brand-950/10'
                    : 'hover:shadow-sm',
                  isDeleting && 'opacity-50 pointer-events-none'
                )}
              >
                {/* Type icon */}
                <div className={cn('p-2 rounded-lg flex-shrink-0', getTypeColor(notification.notificationType))}>
                  <AlertCircle className="w-4 h-4" />
                </div>

                {/* Image if exists */}
                {imageUrl && (
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={imageUrl}
                      alt="Notification"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {notification.title}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300">
                        {notification.message}
                      </p>
                    </div>
                    <span className="text-[10px] text-zinc-400 flex-shrink-0 whitespace-nowrap">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  {notification.redirectUrl && (
                    <a
                      href={notification.redirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-brand-500 hover:underline mt-2"
                    >
                      Open link <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    disabled={isDeleting}
                    className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-40"
                    title="Delete"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <span className="text-sm text-zinc-500">
            Page {currentPage + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="btn-secondary p-2 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={currentPage + 1 >= totalPages}
              className="btn-secondary p-2 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}