'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Eye, EyeOff, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useAdminProjects, useDeleteProject } from '@/hooks/useApi';
import { adminApi } from '@/services/api';
import { getThumbUrl } from '@/lib/cdn';
import { formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminProjectsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useAdminProjects(page);
  const { mutateAsync: deleteProject } = useDeleteProject();
  const qc = useQueryClient();

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete project "${title}"? This cannot be undone.`)) return;
    try {
      await deleteProject(id);
      toast.success('Project deleted');
    } catch { toast.error('Failed to delete project'); }
  };

  const handleToggle = async (id: number, active: boolean) => {
    try {
      if (active) await adminApi.disableProject(id);
      else await adminApi.enableProject(id);
      toast.success(active ? 'Project disabled' : 'Project enabled');
      qc.invalidateQueries({ queryKey: ['admin', 'projects'] });
    } catch { toast.error('Failed to update project'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100">Projects</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {data?.totalElements ?? '—'} total projects
          </p>
        </div>
      </div>

      <div className="card-base p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                {['', 'Title', 'Type', 'Technologies', 'Featured', 'Status', 'Created', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider first:w-12">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {isLoading
                ? Array(8).fill(0).map((_, i) => (
                    <tr key={i}>
                      {Array(8).fill(0).map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>
                      ))}
                    </tr>
                  ))
                : data?.content.map((project) => (
                    <motion.tr
                      key={project.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                          {project.thumbImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={getThumbUrl(project.thumbImage)} alt={project.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-bold">
                              {project.title?.charAt(0)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 max-w-xs truncate">{project.title}</p>
                        <p className="text-xs text-zinc-400 truncate max-w-xs">{project.shortDescription}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          {project.projectDeliverableType || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[140px]">
                          {project.technologies?.slice(0, 2).map((t) => (
                            <span key={t.id} className="text-xs px-1.5 py-0.5 rounded bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400">
                              {t.name}
                            </span>
                          ))}
                          {(project.technologies?.length ?? 0) > 2 && (
                            <span className="text-xs text-zinc-400">+{project.technologies.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {project.featured ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 font-semibold">Featured</span>
                        ) : (
                          <span className="text-xs text-zinc-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full font-semibold',
                          project.active
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                        )}>
                          {project.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-400">
                        {project.createdAt ? formatDate(project.createdAt) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/projects/${project.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950/20 text-zinc-400 hover:text-brand-600 transition-colors"
                            title="View public page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleToggle(project.id, project.active)}
                            className={cn(
                              'p-1.5 rounded-lg transition-colors',
                              project.active
                                ? 'hover:bg-amber-50 dark:hover:bg-amber-950/20 text-zinc-400 hover:text-amber-600'
                                : 'hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-zinc-400 hover:text-emerald-600'
                            )}
                            title={project.active ? 'Disable' : 'Enable'}
                          >
                            {project.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(project.id, project.title)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-400 hover:text-red-600 transition-colors"
                            title="Delete"
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
              Page {(data.page ?? 0) + 1} of {data.totalPages} · {data.totalElements} total
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={(data.page ?? 0) === 0}
                className={cn('btn-secondary p-2', (data.page ?? 0) === 0 && 'opacity-40 cursor-not-allowed')}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={data.last}
                className={cn('btn-secondary p-2', data.last && 'opacity-40 cursor-not-allowed')}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
