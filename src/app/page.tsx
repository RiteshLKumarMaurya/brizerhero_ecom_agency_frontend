import type { Metadata } from 'next';
import { HeroSection } from '@/components/sections/HeroSection';
import { BannersSection } from '@/components/sections/BannersSection';
import { EcosystemVisual } from '@/components/sections/EcosystemVisual';
import { FeaturesPreview } from '@/components/sections/FeaturesPreview';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { ProjectsShowcase } from '@/components/sections/ProjectsShowcase';
import { PackagesSection } from '@/components/sections/PackagesSection';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { ClientResults } from '@/components/sections/ClientResults';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { FinalCta } from '@/components/sections/FinalCta';
import { ContactCta } from '@/components/sections/ContactCta';

export const metadata: Metadata = {
  title: 'BrizerHero — Complete Ecommerce Ecosystem Solutions',
  description:
    'BrizerHero builds complete ecommerce ecosystems — websites, mobile apps, admin panels, delivery apps, and backend APIs. Launch your digital commerce business today.',
  openGraph: {
    title: 'BrizerHero — Complete Ecommerce Ecosystem Solutions',
    description: 'We build complete ecommerce ecosystems for store owners, D2C brands, wholesalers, and manufacturers.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BannersSection />
      <ClientResults />  
      <PackagesSection />
      <ProjectsShowcase />
      <ServicesSection />
      <FeaturesPreview />
      <WhyChooseUs />
      <TestimonialsSection />
      <ProcessSection />
      <FinalCta />
    </>
  );
}