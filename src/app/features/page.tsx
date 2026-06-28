import type { Metadata } from 'next';
import { FeaturesPageClient } from './FeaturesPageClient';

export const metadata: Metadata = {
  title: 'Platform Capabilities — BrizerHero',
  description:
    'See every capability built into the BrizerHero platform — from customer ordering and inventory management to delivery, payments, and analytics. Built exclusively for Indian grocery stores, bakeries, dairy businesses, and produce markets.',
  openGraph: {
    title: 'Platform Capabilities — BrizerHero',
    description:
      'Every part of the BrizerHero platform was built around how grocery businesses actually operate. Explore all capabilities included with every plan.',
  },
};

export default function FeaturesPage() {
  return <FeaturesPageClient />;
}