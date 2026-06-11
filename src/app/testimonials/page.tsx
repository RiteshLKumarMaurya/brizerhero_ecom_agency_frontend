import type { Metadata } from 'next';
import { TestimonialsPageClient } from './TestimonialsPageClient';

export const metadata: Metadata = {
  title: 'Testimonials — Client Reviews',
  description: 'Read what our clients say about working with BrizerHero. Real reviews from real businesses.',
};

export default function TestimonialsPage() {
  return <TestimonialsPageClient />;
}
