const CDN_BASE = process.env.NEXT_PUBLIC_CDN_URL || 'https://media.brizerhero.com';

export function getCdnUrl(key: string | null | undefined): string {
  if (!key) return '/images/placeholder.webp';
  if (key.startsWith('http')) return key;
  return `${CDN_BASE}/${key}`;
}

export function getOptimizedUrl(media: { optimizedKey?: string; originalKey?: string } | null | undefined): string {
  if (!media) return '/images/placeholder.webp';
  return getCdnUrl(media.originalKey);
}

export function getThumbUrl(media: { thumbKey?: string; optimizedKey?: string; originalKey?: string } | null | undefined): string {
  if (!media) return '/images/placeholder.webp';
  return getCdnUrl(media.thumbKey || media.optimizedKey || media.originalKey);
}
