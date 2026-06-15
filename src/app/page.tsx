import type { Metadata } from 'next';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { FeaturedServices } from '@/components/sections/FeaturedServices';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { FeaturedPackages } from '@/components/sections/FeaturedPackages';
import { TechnologiesSection } from '@/components/sections/TechnologiesSection';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { ContactCta } from '@/components/sections/ContactCta';
import { BannersSection } from '@/components/sections/BannersSection';
import { EcomShowcase } from '@/components/sections/EcomShowcase';

export const metadata: Metadata = {
  title: 'BrizerHero — Complete E-commerce Software Solutions',
  description:
    'BrizerHero builds complete e-commerce software solutions — websites, Android apps, iOS apps, admin panels, delivery apps, and backend APIs. Get your entire digital commerce ecosystem built by experts.',
  openGraph: {
    title: 'BrizerHero — Complete E-commerce Software Solutions',
    description: 'We build complete e-commerce ecosystems for store owners, D2C brands, wholesalers, and manufacturers.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BannersSection />
      <StatsSection />
      <FeaturedServices />
      <EcomShowcase />
      <FeaturedProjects />
      <FeaturedPackages />
      <TechnologiesSection />
      <WhyChooseUs />
      <TestimonialsSection />
      <ProcessSection />
      <FaqSection />
      <ContactCta />
    </>
  );
}
