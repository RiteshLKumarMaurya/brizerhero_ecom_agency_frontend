import type { Metadata } from 'next';
import { ProjectsPageClient } from './ProjectsPageClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Projects — Our Work & Portfolio',
  description: 'Browse our portfolio of websites, mobile apps, ecommerce stores, and custom software. Real projects, real results.',
  openGraph: {
    title: 'Projects — BrizerHero Portfolio',
    description: 'See the digital products we\'ve built for clients worldwide.',
  },
};

// app/projects/page.tsx (Server Component)

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading projects...</div>}>
      <ProjectsPageClient />
    </Suspense>
  );
}