'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Filter, CheckCircle2, Server, Cloud, Code, Database, Smartphone, Settings } from 'lucide-react';
import { useTechnologies } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { ContactCta } from '@/components/sections/ContactCta';
import { getTechMetadata, techMetadataMap } from '@/lib/techMetadata';
import type { TechnologyResponse } from '@/types';

// ─── Category Icons ───────────────────────────────────────────────────────
const categoryIconMap: Record<string, React.ElementType> = {
  Backend: Server,
  Frontend: Code,
  Database: Database,
  Cloud: Cloud,
  Mobile: Smartphone,
  DevOps: Settings,
};

// ─── Experience Level Colors ────────────────────────────────────────────
const experienceColors: Record<string, string> = {
  Expert: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
  Advanced: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
  Intermediate: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30',
};

// ─── Technology Card ────────────────────────────────────────────────────
function TechCard({ tech, index }: { tech: TechnologyResponse; index: number }) {
  const [iconError, setIconError] = useState(false);
  const iconSrc = tech.iconImage ? getOptimizedUrl(tech.iconImage) : null;
  const metadata = getTechMetadata(tech.slug);
  const CategoryIcon = categoryIconMap[metadata.category] || Server;
  const experienceColor = experienceColors[metadata.experienceLevel] || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-2xl hover:border-brand-400 dark:hover:border-brand-700 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium">
          <CategoryIcon className="w-3.5 h-3.5" />
          {metadata.category}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${experienceColor}`}>
          {metadata.experienceLevel}
        </span>
      </div>

      <div className="w-16 h-16 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
        {iconSrc && !iconError ? (
          <Image
            src={iconSrc}
            alt={tech.name}
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
            onError={() => setIconError(true)}
            unoptimized
          />
        ) : (
          <span className="text-2xl font-bold text-brand-500">
            {tech.name.charAt(0)}
          </span>
        )}
      </div>

      <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
        {tech.name}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-2">
        {tech.description || 'Modern technology for scalable solutions.'}
      </p>

      <div className="mb-4">
        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
          Used In
        </p>
        <ul className="space-y-1.5">
          {metadata.usedInProjects.slice(0, 4).map((project, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
              <span className="line-clamp-1">{project}</span>
            </li>
          ))}
          {metadata.usedInProjects.length > 4 && (
            <li className="text-xs text-brand-500">+{metadata.usedInProjects.length - 4} more</li>
          )}
        </ul>
      </div>

      <Link
        href={`/technologies/${tech.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 group-hover:gap-3 transition-all duration-200"
      >
        Learn More
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────
export function TechnologiesPageClient() {
  const { data: technologies, isLoading } = useTechnologies();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    if (!technologies) return ['All'];
    const cats = new Set(technologies.map((t) => getTechMetadata(t.slug).category));
    return ['All', ...Array.from(cats)];
  }, [technologies]);

  const filteredTechs = useMemo(() => {
    if (!technologies) return [];
    if (selectedCategory === 'All') return technologies;
    return technologies.filter((t) => getTechMetadata(t.slug).category === selectedCategory);
  }, [technologies, selectedCategory]);

  const metrics = [
    { label: 'Technologies', value: technologies?.length || 0, suffix: '+' },
    { label: 'Uptime Architecture', value: '99.9', suffix: '%' },
    { label: 'Enterprise Grade', value: 'Security' },
    { label: 'Scalable', value: 'Infrastructure' },
  ];

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="section-container text-center max-w-3xl mx-auto relative">
          <span className="eyebrow justify-center">Our Technology Stack</span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mt-2 mb-5">
            Behind Every{' '}
            <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              Ecommerce Ecosystem
            </span>
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
            We use battle-tested technologies to build secure, scalable, and high-performance ecommerce platforms.
          </p>
        </div>
      </section>

      {/* ─── Trust Metrics ───────────────────────────────────────────── */}
      {!isLoading && technologies && (
        <div className="section-container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {metrics.map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="text-center p-4 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {metric.value}{metric.suffix || ''}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{metric.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Category Filter ─────────────────────────────────────────── */}
      <div className="section-container py-4">
        <div className="flex flex-wrap items-center gap-2 justify-center">
          <Filter className="w-4 h-4 text-zinc-400" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium transition-all
                ${selectedCategory === cat
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-brand-300'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Grid ────────────────────────────────────────────────────── */}
      <section className="section-padding pt-0">
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
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 animate-pulse">
                    <div className="skeleton h-6 w-24 rounded-full mb-4" />
                    <div className="skeleton w-16 h-16 rounded-xl mb-4" />
                    <div className="skeleton h-6 w-3/4 rounded mb-2" />
                    <div className="skeleton h-4 w-full rounded mb-2" />
                    <div className="skeleton h-4 w-5/6 rounded mb-4" />
                    <div className="skeleton h-4 w-20 rounded mb-3" />
                    <div className="space-y-2">
                      <div className="skeleton h-4 w-full rounded" />
                      <div className="skeleton h-4 w-full rounded" />
                      <div className="skeleton h-4 w-3/4 rounded" />
                    </div>
                    <div className="skeleton h-5 w-28 rounded mt-4" />
                  </div>
                ))}
              </motion.div>
            ) : filteredTechs.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <p className="text-zinc-500 dark:text-zinc-400">No technologies in this category yet.</p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredTechs.map((tech, i) => (
                  <TechCard key={tech.id} tech={tech} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── Architecture Flow ───────────────────────────────────────── */}
      <section className="section-padding bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="section-container max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              Used Across Our Ecosystem
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              Our technology stack powers every part of the ecommerce journey.
            </p>
          </div>
          <div className="relative flex flex-col items-center">
            <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
              <div className="w-full p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 text-center">
                <span className="font-semibold text-zinc-900 dark:text-white">Customer App</span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">React Native / Next.js</p>
              </div>
              <ArrowDownIcon />
              <div className="w-full p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 text-center">
                <span className="font-semibold text-zinc-900 dark:text-white">API Gateway</span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Kong / GraphQL</p>
              </div>
              <ArrowDownIcon />
              <div className="w-full p-4 bg-brand-50 dark:bg-brand-950/20 border-2 border-brand-300 dark:border-brand-700 rounded-xl shadow-md text-center">
                <span className="font-semibold text-brand-700 dark:text-brand-300">Spring Boot Backend</span>
                <p className="text-xs text-brand-600 dark:text-brand-400">Java / Kotlin</p>
              </div>
              <ArrowDownIcon />
              <div className="w-full p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 text-center">
                <span className="font-semibold text-zinc-900 dark:text-white">PostgreSQL</span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Relational Database</p>
              </div>
              <ArrowDownIcon />
              <div className="w-full p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 text-center">
                <span className="font-semibold text-zinc-900 dark:text-white">Redis Cache</span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">In-memory Data Store</p>
              </div>
              <ArrowDownIcon />
              <div className="w-full p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 text-center">
                <span className="font-semibold text-zinc-900 dark:text-white">Admin Dashboard</span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">React + Tailwind</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}

function ArrowDownIcon() {
  return (
    <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  );
}