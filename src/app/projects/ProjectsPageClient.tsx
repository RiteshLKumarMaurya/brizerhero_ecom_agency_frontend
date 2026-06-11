'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProjects } from '@/hooks/useApi';
import { getThumbUrl } from '@/lib/cdn';
import { ProjectCardSkeleton } from '@/components/common/Skeletons';
import { ContactCta } from '@/components/sections/ContactCta';
import type { ProjectResponse } from '@/types';
import { cn } from '@/lib/utils';

function ProjectCard({ project, index }: { project: ProjectResponse; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 9) * 0.06 }}
      className="group card-base overflow-hidden p-0 flex flex-col h-full"
    >
      <div className="relative overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-800">
        {project.thumbImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getThumbUrl(project.thumbImage)}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-900/30 to-accent-violet/20" />
        )}
        {project.featured && (
          <span className="absolute top-3 left-3 tag text-xs">Featured</span>
        )}
        {project.projectDeliverableType && (
          <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-lg bg-black/50 text-white backdrop-blur-sm">
            {project.projectDeliverableType}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {project.projectBundle && (
          <span className="text-xs text-zinc-400 mb-1">{project.projectBundle.projectBundleName}</span>
        )}
        <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1 mb-4">
          {project.shortDescription}
        </p>
        {project.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 4).map((t) => (
              <span key={t.id} className="text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">{t.name}</span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500">+{project.technologies.length - 4}</span>
            )}
          </div>
        )}
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 group-hover:gap-3 transition-all"
        >
          View Case Study <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.article>
  );
}

export function ProjectsPageClient() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useProjects(page, 9);

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 bg-zinc-50 dark:bg-zinc-950">
        <div className="section-container">
          <div className="max-w-2xl">
            <p className="eyebrow">Our Portfolio</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-5">
              Projects That <span className="gradient-text">Ship and Scale</span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Every project in our portfolio is a real product serving real users. Browse our work and see what we can build for you.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
  ? Array(9)
      .fill(0)
      .map((_, i) => <ProjectCardSkeleton key={i} />)
  : (data?.content ?? []).map((project, i) => (
      <ProjectCard
        key={project.id}
        project={project}
        index={i}
      />
    ))
}
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={data.first}
                className={cn('btn-secondary p-2.5', data.first && 'opacity-40 cursor-not-allowed')}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Page {data.number + 1} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={data.last}
                className={cn('btn-secondary p-2.5', data.last && 'opacity-40 cursor-not-allowed')}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      <ContactCta />
    </>
  );
}
