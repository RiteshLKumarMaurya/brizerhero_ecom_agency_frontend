// app/projects/ProjectsPageClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Store,
  TrendingUp,
} from 'lucide-react';
import { useProjects } from '@/hooks/useApi';
import { getThumbUrl } from '@/lib/cdn';
import { ContactCta } from '@/components/sections/ContactCta';
import type { ProjectResponse } from '@/types';
import { cn } from '@/lib/utils';

// ─── Industry label map (business language) ────────────────────────────
const INDUSTRY_LABELS: Record<string, { label: string; color: string }> = {
  GROCERY:      { label: 'Indian Grocery',   color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  ORGANIC:      { label: 'Organic Foods',    color: 'bg-lime-50 text-lime-700 dark:bg-lime-950/50 dark:text-lime-300 border-lime-200 dark:border-lime-800' },
  BAKERY:       { label: 'Bakery',           color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  DAIRY:        { label: 'Dairy Business',   color: 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border-sky-200 dark:border-sky-800' },
  PRODUCE:      { label: 'Produce Market',   color: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
};

// ─── Skeleton ──────────────────────────────────────────────────────────
function ProjectCardSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col animate-pulse" style={{ height: '540px' }}>
      <div className="h-64 bg-zinc-100 dark:bg-zinc-800 flex-shrink-0" />
      <div className="p-8 flex flex-col gap-4 flex-1">
        <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-24" />
        <div className="h-6 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-3/4" />
        <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-full" />
        <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-5/6" />
        <div className="mt-auto h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-40" />
      </div>
    </div>
  );
}

// ─── Premium Project Card ──────────────────────────────────────────────
function ProjectCard({
  project,
  index,
}: {
  project: ProjectResponse;
  index: number;
}) {
  const bundleName = project.projectBundle?.projectBundleName ?? '';
  const industryKey = bundleName.toUpperCase().split(' ')[0];
  const industry = INDUSTRY_LABELS[industryKey];

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 9) * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col transition-all duration-500 hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.5)] hover:-translate-y-1 hover:border-zinc-200 dark:hover:border-zinc-700"
      style={{ minHeight: '540px' }}
    >
      {/* Image container */}
      <div className="relative h-64 flex-shrink-0 overflow-hidden bg-zinc-50 dark:bg-zinc-800">
        {project.thumbImage ? (
          <Image
            src={getThumbUrl(project.thumbImage)}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center">
            <Store className="w-12 h-12 text-zinc-300 dark:text-zinc-600" />
          </div>
        )}

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-100 backdrop-blur-sm border border-white/50 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Featured Project
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-8 flex flex-col flex-1">
        {/* Industry chip */}
        {industry ? (
          <span className={cn(
            'self-start text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full border mb-4',
            industry.color
          )}>
            {industry.label}
          </span>
        ) : bundleName ? (
          <span className="self-start text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full border mb-4 bg-zinc-50 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700">
            {bundleName}
          </span>
        ) : null}

        {/* Title */}
        <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
          {project.title}
        </h3>

        {/* Short description */}
        <p className="text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1 line-clamp-3 mb-6">
          {project.shortDescription}
        </p>

        {/* Platform / deliverable type */}
        {project.projectDeliverableType && (
          <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-6">
            {project.projectDeliverableType.replace(/_/g, ' ')}
          </p>
        )}

        {/* CTA */}
        <Link
          href={`/projects/${project.slug ?? project.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 group/link"
          aria-label={`View case study for ${project.title}`}
        >
          <span className="underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-600 group-hover/link:decoration-brand-500 dark:group-hover/link:decoration-brand-400 transition-all">
            Read case study
          </span>
          <ArrowRight
            className="w-4 h-4 text-brand-500 transition-transform duration-300 group-hover/link:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </motion.article>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────
export function ProjectsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const initial = Number(searchParams.get('page')) || 0;
    setPage(initial);
    setIsHydrated(true);
  }, [searchParams]);

useEffect(() => {
  if (!isHydrated) return;

  const params = new URLSearchParams(searchParams.toString());

  if (page === 0) {
    params.delete('page');
  } else {
    params.set('page', page.toString());
  }

  const newUrl =
    `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;

  // Don't navigate if URL is already correct
  if (
    newUrl !==
    `${window.location.pathname}${window.location.search}`
  ) {
    router.replace(newUrl, { scroll: false });
  }
}, [page, isHydrated]);

  const { data, isLoading, error, refetch } = useProjects(page, 9);

  const projects = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const currentPage = data?.number ?? page;
  const isFirst = data?.first ?? currentPage === 0;
  const isLast = data?.last ?? currentPage >= totalPages - 1;

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-400" aria-hidden="true" />
          </div>
          <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Something went wrong
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-[15px]">
            {error.message || 'Unable to load projects right now. Please try again.'}
          </p>
          <button
            onClick={() => refetch()}
            className="btn-primary"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section
        className="pt-24 pb-24 bg-white dark:bg-zinc-950"
        aria-label="Page introduction"
      >
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold tracking-[0.18em] uppercase text-brand-600 dark:text-brand-400 mb-5"
            >
              Our Work
            </motion.p>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-zinc-50 leading-[1.05] tracking-tight mb-7"
            >
              Software built for{' '}
              <span className="text-brand-600 dark:text-brand-400">
                food businesses
              </span>{' '}
              like yours.
            </motion.h1>

            {/* Sub-copy */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl"
            >
              Every case study below is a real business that faced a real challenge.
              Grocery stores, bakeries, dairy brands, and produce markets — we build
              software that fits how you work, not the other way around.
            </motion.p>
          </motion.div>

          {/* Industry trust bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="flex flex-wrap gap-3 mt-12"
            aria-label="Industries we serve"
          >
            {Object.values(INDUSTRY_LABELS).map(({ label, color }) => (
              <span
                key={label}
                className={cn(
                  'text-xs font-semibold px-4 py-2 rounded-full border',
                  color
                )}
              >
                {label}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Divider ─────────────────────────────────────────────────── */}
      <div className="border-t border-zinc-100 dark:border-zinc-800" />

      {/* ─── Projects Grid ────────────────────────────────────────────── */}
      <section
        className="py-24 bg-zinc-50 dark:bg-zinc-950"
        aria-label="Case studies"
      >
        <div className="section-container">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                aria-busy="true"
                aria-label="Loading projects"
              >
                {Array(9).fill(0).map((_, i) => (
                  <ProjectCardSkeleton key={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="loaded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {projects.map((project: ProjectResponse, i: number) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={i}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {!isLoading && projects.length === 0 && (
            <div className="text-center py-24">
              <TrendingUp className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" aria-hidden="true" />
              <p className="text-zinc-400 text-lg">More case studies coming soon.</p>
            </div>
          )}

          {/* ─── Pagination ──────────────────────────────────────────── */}
          {totalPages > 1 && (
            <nav
              className="flex items-center justify-center gap-2 mt-16"
              aria-label="Project pages"
            >
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={isFirst}
                aria-label="Previous page"
                className={cn(
                  'w-10 h-10 rounded-full border flex items-center justify-center transition-all text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500',
                  isFirst && 'opacity-30 cursor-not-allowed pointer-events-none'
                )}
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="flex gap-1" role="list">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i;
                  } else if (currentPage < 2) {
                    pageNum = i;
                  } else if (currentPage > totalPages - 3) {
                    pageNum = totalPages - 5 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      role="listitem"
                      onClick={() => setPage(pageNum)}
                      aria-label={`Page ${pageNum + 1}`}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'w-10 h-10 rounded-full text-sm font-medium transition-all',
                        isActive
                          ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                          : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      )}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={isLast}
                aria-label="Next page"
                className={cn(
                  'w-10 h-10 rounded-full border flex items-center justify-center transition-all text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500',
                  isLast && 'opacity-30 cursor-not-allowed pointer-events-none'
                )}
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </nav>
          )}
        </div>
      </section>

      <ContactCta />
    </>
  );
}