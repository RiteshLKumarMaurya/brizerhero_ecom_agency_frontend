import type { Metadata } from 'next';
import { ContactPageClient } from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact — Book a Free Consultation',
  description: 'Ready to build? Tell us about your project and we\'ll get back to you within 24 hours with a tailored proposal.',
};

export default function ContactPage() {
  return <ContactPageClient />;
}
