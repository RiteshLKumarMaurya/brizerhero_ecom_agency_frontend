// app/packages/[slug]/page.tsx
import { PackageDetailClient } from './PackageDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  return <PackageDetailClient slug={slug} />;
}