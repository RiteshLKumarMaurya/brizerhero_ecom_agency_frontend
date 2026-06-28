// app/projects/[slug]/page.tsx  (Server Component — do not add 'use client')
import type { Metadata } from 'next';
import { ProjectDetailClient } from './ProjectDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${title} — Case Study | BrizerHero`,
    description: `See how BrizerHero built a complete software platform for ${title}. Real business challenge, real solution, real outcomes.`,
    openGraph: {
      title: `${title} — Case Study`,
      description: `A BrizerHero case study: software built for food and grocery businesses like yours.`,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  return <ProjectDetailClient slug={slug} />;
}