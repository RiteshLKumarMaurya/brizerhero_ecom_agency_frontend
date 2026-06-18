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
  X,
  Calendar,
  Layers,
} from 'lucide-react';
import { useProjects } from '@/hooks/useApi';
import { getOptimizedUrl, getThumbUrl } from '@/lib/cdn';
import { ContactCta } from '@/components/sections/ContactCta';
import type { ProjectResponse } from '@/types';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

// ─── Skeleton ──────────────────────────────────────────────────────────────
function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col h-full animate-pulse">
      <div className="aspect-video bg-zinc-200 dark:bg-zinc-800" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Premium Project Card ──────────────────────────────────────────────
function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: ProjectResponse;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 9) * 0.06, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      className="group cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:border-brand-400/50"
    >
      {/* Thumbnail Banner */}
      <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-brand-500/20 to-purple-500/20">
        {project.thumbImage ? (
          <Image
            src={getThumbUrl(project.thumbImage)}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-900/30 to-purple-900/20" />
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {project.featured && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/90 text-amber-950 backdrop-blur-sm">
              Featured
            </span>
          )}
          {project.projectDeliverableType && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
              {project.projectDeliverableType.replace(/_/g, ' ')}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          {project.projectBundle && (
            <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
              {project.projectBundle.projectBundleName}
            </span>
          )}
          {project.createdAt && (
            <span className="text-xs text-zinc-400 whitespace-nowrap">
              {formatDate(project.createdAt)}
            </span>
          )}
        </div>

        <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-brand-600 transition-colors">
          {project.title}
        </h3>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1 mb-4 line-clamp-2">
          {project.shortDescription}
        </p>

        {/* Technology stack pills */}
        {project.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 4).map((t) => (
              <span
                key={t.id}
                className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                {t.technology.name}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 group-hover:gap-3 transition-all">
          View Case Study <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.article>
  );
}

// ─── Modal (Quick Preview) ─────────────────────────────────────────────
function ProjectModal({
  project,
  onClose,
}: {
  project: ProjectResponse;
  onClose: () => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const bannerImages = project.bannerImages?.sort((a, b) => a.displayOrder - b.displayOrder) || [];

  const nextImage = () => {
    if (bannerImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length);
  };
  const prevImage = () => {
    if (bannerImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 md:p-8">
            <div className="mb-6">
              {project.projectBundle && (
                <span className="inline-block text-xs font-semibold text-brand-600 bg-brand-50 dark:bg-brand-950/30 px-2 py-1 rounded mb-2">
                  {project.projectBundle.projectBundleName}
                </span>
              )}
              <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {project.title}
              </h2>
              {project.projectDeliverableType && (
                <p className="text-sm text-zinc-500 mt-1">
                  Deliverable: {project.projectDeliverableType.replace('_', ' ')}
                </p>
              )}
            </div>

            {/* Gallery Carousel */}
            {bannerImages.length > 0 && (
              <div className="mb-6">
                <div className="relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <div className="aspect-video relative">
                    {bannerImages[currentImageIndex]?.media?.optimizedKey && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getOptimizedUrl(bannerImages[currentImageIndex].media)}
                        alt={`${project.title} screenshot`}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  {bannerImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Short description */}
            <p className="text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
              {project.shortDescription}
            </p>

            {/* Full description */}
            {project.fullDescription && (
              <div className="mb-4">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Project Details</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                  {project.fullDescription}
                </p>
              </div>
            )}

            {/* Tech stack */}
            {project.technologies?.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Technologies</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {project.technologies.map((t) => (
                    <span
                      key={t.id}
                      className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    >
                      {t.technology.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* External Links */}
            {project.externalLinks && project.externalLinks.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Links</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {project.externalLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition"
                    >
                      {link.name || 'Link'}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Footer with link to full case study */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex justify-between items-center">
              <Link
                href={`/projects/${project.slug}`}
                className="text-brand-600 hover:underline text-sm flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                Read full case study <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-xs text-zinc-400">Project ID: {project.id}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────
export function ProjectsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);

  useEffect(() => {
    const initial = Number(searchParams.get('page')) || 0;
    setPage(initial);
    setIsHydrated(true);
  }, [searchParams]);

  useEffect(() => {
    if (!isHydrated) return;
    const params = new URLSearchParams(searchParams);
    if (page === 0) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ''}`;
    router.replace(newUrl, { scroll: false });
  }, [page, router, searchParams, isHydrated]);

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
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">Failed to load projects</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            {error.message || 'Something went wrong. Please try again.'}
          </p>
          <button onClick={() => refetch()} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="section-container">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="eyebrow"
            >
              Case Studies
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-5"
            >
              Ecommerce Solutions That <span className="gradient-text">Ship and Scale</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed"
            >
              Every project is a complete ecosystem built for real business growth. Browse our case studies to see how we transform ideas into thriving ecommerce platforms.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding">
        <div className="section-container">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {Array(9)
                  .fill(0)
                  .map((_, i) => (
                    <ProjectCardSkeleton key={i} />
                  ))}
              </motion.div>
            ) : (
              <motion.div
                key="loaded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {projects.map((project: ProjectResponse, i: number) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={i}
                    onClick={() => setSelectedProject(project)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {!isLoading && projects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-zinc-500">No projects found. Check back soon!</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={isFirst}
                className={cn(
                  'btn-secondary p-2.5 rounded-full transition-all',
                  isFirst && 'opacity-40 cursor-not-allowed'
                )}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1">
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
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={cn(
                        'w-9 h-9 rounded-full text-sm font-medium transition-all',
                        pageNum === currentPage
                          ? 'bg-brand-600 text-white shadow-md'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
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
                className={cn(
                  'btn-secondary p-2.5 rounded-full transition-all',
                  isLast && 'opacity-40 cursor-not-allowed'
                )}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      <ContactCta />

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}