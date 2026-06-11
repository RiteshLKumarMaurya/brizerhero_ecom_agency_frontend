import type { Metadata } from 'next';
import { PackagesPageClient } from './PackagesPageClient';

export const metadata: Metadata = {
  title: 'Packages & Pricing — Transparent Software Development Pricing',
  description: 'Browse our transparent development packages. Fixed pricing, clear deliverables, no hidden fees.',
};

export default function PackagesPage() {
  return <PackagesPageClient />;
}
