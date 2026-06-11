import type { Metadata } from 'next';
import { PackageDetailClient } from './PackageDetailClient';

interface Props { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return { title: `${name} Package`, description: `Details and pricing for the ${name} package by BrizerHero.` };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  return <PackageDetailClient slug={slug} />;
}
