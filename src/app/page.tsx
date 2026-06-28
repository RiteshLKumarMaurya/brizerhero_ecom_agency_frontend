import type { Metadata } from 'next';
import { HeroSection } from '@/components/sections/HeroSection';
import { BannersSection } from '@/components/sections/BannersSection';
import { ClientResults } from '@/components/sections/ClientResults';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { FeaturesPreview } from '@/components/sections/FeaturesPreview';
import { ProjectsShowcase } from '@/components/sections/ProjectsShowcase';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { PackagesSection } from '@/components/sections/PackagesSection';
import { ContactCta } from '@/components/sections/ContactCta';

export const metadata: Metadata = {
  title: 'BrizerHero — Premium Digital Platforms for Grocery Businesses',
  description:
    'BrizerHero partners with Indian grocery stores and specialty food retailers to build premium digital platforms — online ordering, mobile apps, inventory systems, and loyalty programs.',
  alternates: {
    canonical: 'https://brizerhero.com',
  },
  openGraph: {
    title: 'BrizerHero — Premium Digital Platforms for Grocery Businesses',
    description:
      'Premium digital platforms built exclusively for grocery businesses. Online ordering, mobile apps, inventory management, and delivery systems — designed for stores that take their reputation seriously.',
    type: 'website',
    url: 'https://brizerhero.com',
  },
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — immediate brand positioning and value proposition */}
      <HeroSection />

      {/* 2. Social proof banners — rapid credibility immediately after the hero */}
      <BannersSection />

      {/* 3. Client results — concrete outcomes before any service detail */}
      {/* <ClientResults /> */}

      {/* 4. Services — establish what we do and how we think */}
      <ServicesSection />

      {/* 5. Features — depth on capabilities for owners doing due diligence */}
      <FeaturesPreview />

      {/* 6. Work — proof through completed projects, after value is established */}
      <ProjectsShowcase />

      {/* 7. Why BrizerHero — differentiation and trust signals */}
      <WhyChooseUs />

      {/* 8. Testimonials — peer validation before commitment decision */}
      <TestimonialsSection />

      {/* 9. Packages — pricing revealed only after full value is understood */}
      <PackagesSection />

      {/* 10. CTA — clear next step at peak trust */}
      <ContactCta />
    </>
  );
}