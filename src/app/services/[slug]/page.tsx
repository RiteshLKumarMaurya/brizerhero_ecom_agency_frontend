// app/services/[slug]/page.tsx  (Server Component — do not add 'use client')
import type { Metadata } from 'next';
import { ServiceDetailClient } from './ServiceDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${name} — Built for Food & Grocery Businesses | BrizerHero`,
    description: `Learn how BrizerHero's ${name} solution helps grocery stores, bakeries, dairy businesses, and produce markets improve operations and serve customers better.`,
    openGraph: {
      title: `${name} | BrizerHero`,
      description: `A business solution for food retailers — see what's included, how we work, and what changes for your store.`,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  return <ServiceDetailClient slug={slug} />;
}