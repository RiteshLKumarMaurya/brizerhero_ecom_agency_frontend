import type { Metadata } from 'next';
import { ProjectsPageClient } from './ProjectsPageClient';

export const metadata: Metadata = {
  title: 'Projects — Our Work & Portfolio',
  description: 'Browse our portfolio of websites, mobile apps, ecommerce stores, and custom software. Real projects, real results.',
  openGraph: {
    title: 'Projects — BrizerHero Portfolio',
    description: 'See the digital products we\'ve built for clients worldwide.',
  },
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
