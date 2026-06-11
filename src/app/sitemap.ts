import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://brizerhero.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: BASE_URL, changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE_URL}/services`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${BASE_URL}/projects`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${BASE_URL}/packages`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${BASE_URL}/technologies`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/testimonials`, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly' as const, priority: 0.8 },
  ];

  return staticRoutes.map((route) => ({
    ...route,
    lastModified: new Date(),
  }));
}
