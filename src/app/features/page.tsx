import type { Metadata } from 'next';
import { FeaturesPageClient } from './FeaturesPageClient';

export const metadata: Metadata = {
  title: 'Features — Complete Ecommerce Ecosystem',
  description: 'Explore the full suite of powerful features for modern ecommerce: store management, inventory, orders, payments, analytics, mobile apps, and more.',
  openGraph: {
    title: 'Features — BrizerHero Ecommerce Solutions',
    description: 'Everything you need to launch, manage and scale your ecommerce business.',
  },
};

export default function FeaturesPage() {
  return <FeaturesPageClient />;
}