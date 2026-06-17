import type { Metadata } from 'next';
import { ServicesPageClient } from './ServicesPageClient';

export const metadata: Metadata = {
  title: 'Services — Website, App & Software Development',
  description: 'Explore our full range of development services: websites, mobile apps, ecommerce, custom software, AI solutions, and more.',
  openGraph: {
    title: 'Services — BrizerHero',
    description: 'Premium software development services for startups and businesses.',
  },
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}