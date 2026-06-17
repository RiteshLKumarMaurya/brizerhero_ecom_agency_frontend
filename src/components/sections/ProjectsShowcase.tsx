'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useFeaturedProjects } from '@/hooks/useApi';
import { getThumbUrl } from '@/lib/cdn';
import { ProjectCardSkeleton } from '@/components/common/Skeletons';
import type { ProjectResponse } from '@/types';

function ProjectCard({ project }: { project: ProjectResponse }) {
  const techNames = project.technologies?.map(t => t.technology?.name).filter(Boolean) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-brand-500/50 transition-all"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-zinc-800">
        {project.thumbImage ? (
          <img src={getThumbUrl(project.thumbImage)} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-500/10 to-purple-500/10" />
        )}
        {project.featured && (
          <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-brand-600 shadow-sm">
            Featured
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
          {project.projectBundle && <span>{project.projectBundle.projectBundleName}</span>}
          {project.projectDeliverableType && (
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
              {project.projectDeliverableType.replace('_', ' ')}
            </span>
          )}
        </div>
        <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{project.shortDescription}</p>
        {techNames.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {techNames.slice(0, 3).map((name) => (
              <span key={name} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                {name}
              </span>
            ))}
            {techNames.length > 3 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-zinc-500">
                +{techNames.length - 3}
              </span>
            )}
          </div>
        )}
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400 group-hover:gap-2.5 transition-all"
        >
          View Case Study <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}

export function ProjectsShowcase() {
  const { data: projects, isLoading } = useFeaturedProjects();

  return (
    <section className="py-20 bg-zinc-900">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold tracking-widest text-brand-400 uppercase">Case Studies</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-2">
              Real Results, Real Ecommerce
            </h2>
            <p className="text-zinc-400 mt-1">See how we've helped businesses go online and scale.</p>
          </div>
          <Link href="/projects" className="btn-secondary flex-shrink-0">
            All Case Studies <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(6).fill(0).map((_, i) => <ProjectCardSkeleton key={i} />)
            : projects?.slice(0, 6).map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      </div>
    </section>
  );
}