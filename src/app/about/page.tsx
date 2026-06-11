import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Zap, Users, Globe, Award } from 'lucide-react';
import { ContactCta } from '@/components/sections/ContactCta';

export const metadata: Metadata = {
  title: 'About — BrizerHero',
  description: 'Learn about BrizerHero — a premium software development agency helping startups and businesses build world-class digital products.',
};

const values = [
  { icon: Zap, title: 'Speed Without Shortcuts', description: 'We move fast by doing things right the first time. No technical debt, no hack-and-pray.' },
  { icon: Users, title: 'Client-First Always', description: 'Your success is our success. We measure outcomes, not hours billed.' },
  { icon: Globe, title: 'Think Global, Build Local', description: 'We\'ve built for clients across 15+ countries while staying deeply attuned to local markets.' },
  { icon: Award, title: 'Craft Over Commodity', description: 'Every line of code is reviewed. Every design is considered. Quality is not optional.' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-zinc-50 dark:bg-zinc-950">
        <div className="section-container">
          <div className="max-w-3xl">
            <p className="eyebrow">Our Story</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
              We Build the Software <br />
              <span className="gradient-text">That Moves the World</span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
              BrizerHero was founded on a simple belief: great software should be accessible to every business, not just the Fortune 500. We&apos;re a tight-knit team of engineers, designers, and strategists who love building things that work.
            </p>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
              From a single-page startup website to a full-scale ecommerce platform serving thousands of users — we bring the same energy, care, and expertise to every project.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-zinc-200 dark:border-zinc-800">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50+', label: 'Projects Delivered' },
              { value: '30+', label: 'Clients Served' },
              { value: '15+', label: 'Countries' },
              { value: '3+', label: 'Years Building' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-4xl font-bold gradient-text mb-1">{value}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="section-container">
          <div className="max-w-2xl mb-12">
            <p className="eyebrow">How We Work</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              Values We Build By
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-4 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-zinc-900 dark:text-zinc-100 mb-1">{title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we build */}
      <section className="section-padding bg-zinc-50 dark:bg-zinc-950">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="eyebrow">What We Do</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-5">
                Full-Stack Digital Product Development
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                We&apos;re not just a design studio. We&apos;re not just a dev shop. We&apos;re a complete product team that handles everything from initial strategy through to post-launch growth.
              </p>
              <div className="space-y-2 mb-8">
                {['Website Development', 'Mobile App Development', 'Ecommerce Platforms', 'Custom Software', 'AI & Automation', 'Admin Panels & Dashboards'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/services" className="btn-primary">
                View All Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white">
                <div className="text-6xl font-display font-black opacity-10 mb-4">BH</div>
                <h3 className="font-display text-2xl font-bold mb-3">Ready to start building?</h3>
                <p className="text-white/70 mb-6 text-sm leading-relaxed">
                  Book a free 30-minute consultation. We&apos;ll listen to your idea, ask the right questions, and tell you exactly what it will take to bring it to life.
                </p>
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-700 font-bold rounded-xl hover:bg-white/90 transition-colors text-sm">
                  Book Free Consultation <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
