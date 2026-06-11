import type { Metadata } from 'next';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { FeaturedServices } from '@/components/sections/FeaturedServices';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { FeaturedPackages } from '@/components/sections/FeaturedPackages';
import { TechnologiesSection } from '@/components/sections/TechnologiesSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { ContactCta } from '@/components/sections/ContactCta';

export const metadata: Metadata = {
  title: 'BrizerHero — Premium Software Development Agency',
  description:
    'We build world-class websites, mobile apps, ecommerce solutions, and custom software. Transform your vision into a high-performance digital product.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedServices />
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
