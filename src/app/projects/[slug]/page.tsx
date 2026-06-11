import type { Metadata } from 'next';
import { ProjectDetailClient } from './ProjectDetailClient';

interface Props { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return { title: `${title} — Project Case Study`, description: `Case study for ${title} project by BrizerHero.` };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  return <ProjectDetailClient slug={slug} />;
}
