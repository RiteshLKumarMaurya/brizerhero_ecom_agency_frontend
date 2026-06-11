import type { Metadata } from 'next';
import { TechnologyDetailClient } from './TechnologyDetailClient';

interface Props { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return { title: `${name} — Technology`, description: `How we use ${name} to build modern digital products.` };
}

export default async function TechnologyDetailPage({ params }: Props) {
  const { slug } = await params;
  return <TechnologyDetailClient slug={slug} />;
}
