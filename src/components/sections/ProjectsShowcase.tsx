'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useFeaturedProjects } from '@/hooks/useApi';
import { getThumbUrl } from '@/lib/cdn';
import type { ProjectResponse } from '@/types';

// ─── Presentation layer only. Backend, hooks, fetching, and ProjectResponse ───
// are untouched. The story beats below (challenge / highlights) are generic,
// honest framing for the *category* of build — never invented facts, results,
// or industries about a specific real client. See the note at the bottom of
// this file's accompanying explanation for what a future `industry` /
// `challenge` field on the project model would unlock.

type StoryMeta = {
  badge: string;
  challenge: string;
  highlights: string[];
};

const STORY_META: Record<string, StoryMeta> = {
  storefront: {
    badge: 'Online Storefront',
    challenge: 'Needed an easier way for customers to order groceries online.',
    highlights: ['Online Ordering', 'Customer Accounts', 'Store Branding'],
  },
  operations: {
    badge: 'Store Operations',
    challenge: 'Wanted to simplify day-to-day store operations.',
    highlights: ['Store Management', 'Inventory', 'Admin Dashboard'],
  },
  mobile: {
    badge: 'Customer Experience',
    challenge: 'Customers wanted a faster way to reorder their usual groceries.',
    highlights: ['Online Ordering', 'Customer Accounts', 'Order Updates'],
  },
  acquisition: {
    badge: 'Customer Acquisition',
    challenge: "Needed a faster way to turn local traffic into first-time orders.",
    highlights: ['Promotions', 'Customer Acquisition', 'Easy Checkout'],
  },
  delivery: {
    badge: 'Pickup & Delivery',
    challenge: 'Needed pickup and delivery without adding operational complexity.',
    highlights: ['Pickup & Delivery', 'Delivery Tracking', 'Customer Notifications'],
  },
  vendor: {
    badge: 'Supplier Management',
    challenge: 'Needed an easier way to coordinate with suppliers and vendors.',
    highlights: ['Supplier Coordination', 'Stock Management', 'Vendor Accounts'],
  },
  ecosystem: {
    badge: 'Complete Ecosystem',
    challenge: 'Needed every part of the business working as one connected system.',
    highlights: ['Online Ordering', 'Store Management', 'Pickup & Delivery', 'Customer Accounts'],
  },
};

function getCategoryKey(deliverableType?: string | null): keyof typeof STORY_META {
  const t = (deliverableType || '').toLowerCase();
  if (t.includes('android') || t.includes('ios')) return 'mobile';
  if (t.includes('delivery')) return 'delivery';
  if (t.includes('admin')) return 'operations';
  if (t.includes('vendor')) return 'vendor';
  if (t.includes('landing')) return 'acquisition';
  if (t.includes('complete') || t.includes('ecosystem')) return 'ecosystem';
  return 'storefront';
}

// ─── Loading state, matched to the real card so the page never jumps ───────
function CaseStudyCardSkeleton() {
  return (
    <div className="rounded-[28px] bg-card border border-default overflow-hidden">
      <div className="skeleton aspect-[16/9] w-full" />
      <div className="p-6 space-y-3">
        <div className="skeleton h-6 w-2/3 rounded" />
        <div className="skeleton h-3 w-24 rounded mt-2" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-24 rounded mt-2" />
        <div className="skeleton h-3 w-5/6 rounded" />
        <div className="skeleton h-8 w-32 rounded-full mt-3" />
      </div>
    </div>
  );
}

// ─── Premium Case Study Card ─────────────────────────────────────────────
function ProjectCard({ project }: { project: ProjectResponse }) {
  const story = STORY_META[getCategoryKey(project.projectDeliverableType)];
  const badgeLabel = project.projectBundle?.projectBundleName || story.badge;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group relative rounded-[28px] overflow-hidden bg-card backdrop-blur-sm border border-default hover:border-brand-500/40 transition-colors duration-300 hover:shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55)] hover:shadow-brand-500/10 flex flex-col h-full"
    >
      {/* ─── Banner ───────────────────────────────────────────────── */}
      <div className="relative aspect-[16/9] overflow-hidden bg-raised">
        {project.thumbImage ? (
          <img
            src={getThumbUrl(project.thumbImage)}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-500/10 to-purple-500/10" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)]/70 via-[var(--color-background)]/5 to-transparent" />

        <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1.5 rounded-full bg-zinc-950/70 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide uppercase border border-white/10">
          {badgeLabel}
        </span>

        {project.featured && (
          <span className="absolute top-4 right-4 text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full bg-white/90 text-brand-700">
            Featured
          </span>
        )}
      </div>

      {/* ─── Content ──────────────────────────────────────────────── */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-xl md:text-2xl font-bold text-primary leading-snug group-hover:text-brand-400 transition-colors">
          {project.title}
        </h3>

        <p className="text-[11px] uppercase tracking-wider text-muted mt-4">The Challenge</p>
        <p className="text-sm text-secondary leading-relaxed mt-1">{story.challenge}</p>

        <p className="text-[11px] uppercase tracking-wider text-muted mt-4">Our Solution</p>
        <p className="text-sm text-muted leading-relaxed mt-1 line-clamp-2 flex-1">
          {project.shortDescription}
        </p>

        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4">
          {story.highlights.slice(0, 3).map((item) => (
            <li key={item} className="flex items-center gap-1.5 text-xs text-secondary">
              <CheckCircle className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400 mt-5 group-hover:gap-2.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 rounded-sm"
        >
          See The Full Story <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}

export function ProjectsShowcase() {
  const { data: projects, isLoading } = useFeaturedProjects();

  return (
    <section className="py-24 md:py-20 bg-raised">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold tracking-widest text-brand-400 uppercase">Case Studies</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary mt-3 leading-tight">
              We&rsquo;ve Solved This Before
            </h2>
            <p className="text-secondary mt-4 text-base md:text-lg leading-relaxed">
              Every project starts with a real business challenge, not a
              feature list — here&rsquo;s how we&rsquo;ve helped grocery and
              specialty stores go further online.
            </p>
          </div>
          <Link href="/projects" className="btn-secondary flex-shrink-0">
            See Every Success Story <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {isLoading
            ? Array(6).fill(0).map((_, i) => <CaseStudyCardSkeleton key={i} />)
            : projects?.slice(0, 6).map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      </div>
    </section>
  );
}