'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useFeaturedProjects } from '@/hooks/useApi';
import { getThumbUrl } from '@/lib/cdn';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ProjectCardSkeleton } from '@/components/common/Skeletons';
import type { ProjectResponse } from '@/types';

function ProjectCard({ project, index }: { project: ProjectResponse; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="group card-base overflow-hidden p-0 flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-800">
        {project.thumbImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getThumbUrl(project.thumbImage)}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-900/30 to-accent-violet/20 flex items-center justify-center">
            <div className="text-4xl opacity-20">🚀</div>
          </div>
        )}
        {project.featured && (
          <span className="absolute top-3 left-3 tag text-xs">Featured</span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Bundle tag */}
        {project.projectBundle && (
          <span className="text-xs text-zinc-400 dark:text-zinc-500 mb-1.5">{project.projectBundle.projectBundleName}</span>
        )}

        <h3 className="font-display font-bold text-zinc-900 dark:text-zinc-100 text-lg mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1 mb-4">
          {project.shortDescription}
        </p>

        {/* Technologies */}
        {project.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 4).map((tech) => (
              <span key={tech.id} className="text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                {tech.name}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        )}

        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 mt-auto group-hover:gap-2.5 transition-all"
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
          <SectionHeader
            eyebrow="Our Work"
            title="Projects We're Proud Of"
            subtitle="Real products built for real businesses — see what we've shipped."
          />
          <Link href="/projects" className="btn-secondary flex-shrink-0">
            All Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(6).fill(0).map((_, i) => <ProjectCardSkeleton key={i} />)
            : projects?.slice(0, 6).map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))
          }
        </div>
      </div>
    </section>
  );
}
