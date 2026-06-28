import type { Metadata } from 'next';
import { ContactPageClient } from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact — BrizerHero',
  description: 'Start a conversation with BrizerHero, a technology partner built exclusively for grocery, bakery, dairy, and specialty food businesses across the United States.',
};

export default function ContactPage() {
  return <ContactPageClient />;
}