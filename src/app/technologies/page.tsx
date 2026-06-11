import type { Metadata } from 'next';
import { TechnologiesPageClient } from './TechnologiesPageClient';

export const metadata: Metadata = {
  title: 'Technologies — Our Tech Stack',
  description: 'Explore the modern technologies and frameworks we use to build scalable, high-performance digital products.',
};

export default function TechnologiesPage() {
  return <TechnologiesPageClient />;
}
