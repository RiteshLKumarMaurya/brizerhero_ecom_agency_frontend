// app/services/page.tsx  (Server Component — do not add 'use client')
import type { Metadata } from 'next';
import { ServicesPageClient } from './ServicesPageClient';

export const metadata: Metadata = {
  title: 'Business Solutions — Software for Food & Grocery Businesses',
  description:
    'BrizerHero builds software for Indian grocery stores, bakeries, dairy businesses, organic food retailers, and produce markets. Online ordering, inventory management, delivery tracking, and more.',
  openGraph: {
    title: 'Business Solutions — BrizerHero',
    description:
      'Software built specifically for food businesses. Not generic tools — systems that match how your store actually operates.',
  },
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}