// app/projects/page.tsx  (Server Component — do not add 'use client')
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProjectsPageClient } from './ProjectsPageClient';

export const metadata: Metadata = {
  title: 'Case Studies — Software Built for Food & Grocery Businesses',
  description:
    'Browse real case studies from BrizerHero. We build software exclusively for Indian grocery stores, organic food retailers, bakeries, dairy businesses, and produce markets.',
  openGraph: {
    title: 'Case Studies — BrizerHero',
    description:
    "See the platforms we've built for grocery stores, bakeries, dairy brands, and produce markets across India."
    ,
  },
};

function ProjectsLoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-zinc-400">Loading case studies…</p>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsLoadingFallback />}>
      <ProjectsPageClient />
    </Suspense>
  );
}