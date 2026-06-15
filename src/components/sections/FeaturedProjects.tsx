'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useFeaturedProjects } from '@/hooks/useApi';
import { getThumbUrl } from '@/lib/cdn';
import { ProjectCardSkeleton } from '@/components/common/Skeletons';
import type { ProjectResponse } from '@/types';

function ProjectCard({ project, index }: { project: ProjectResponse; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {project.thumbImage ? (
          <img
            src={getThumbUrl(project.thumbImage)}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-500/10 to-purple-500/10" />
        )}
        {project.featured && (
          <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 dark:bg-zinc-900/90 text-brand-600 shadow-sm">
            Featured
          </span>
        )}
      </div>
      <div className="p-5">
        {project.projectBundle && (
          <span className="text-xs text-brand-600 font-medium uppercase tracking-wide">
            {project.projectBundle.projectBundleName}
          </span>
        )}
        <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1 mb-2 group-hover:text-brand-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4">{project.shortDescription}</p>
        {project.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 3).map((tech) => (
              <span key={tech.id} className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600">
                {tech.technology?.name}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 group-hover:gap-2.5 transition-all"
        >
          View Project <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}

export function FeaturedProjects() {
  const { data: projects, isLoading } = useFeaturedProjects();

  return (
    <section className="section-padding">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold tracking-widest text-brand-500 uppercase">Our Work</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
              Projects We're Proud Of
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Real products built for real businesses — see what we've shipped.</p>
          </div>
          <Link href="/projects" className="btn-secondary flex-shrink-0">
            All Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(6).fill(0).map((_, i) => <ProjectCardSkeleton key={i} />)
            : projects?.slice(0, 6).map((project, i) => <ProjectCard key={project.id} project={project} index={i} />)}
        </div>
      </div>
    </section>
  );
}