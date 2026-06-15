import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Zap, Users, Globe, Award, Instagram, Facebook, Linkedin, Github, Mail, Phone } from 'lucide-react';
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
              <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                That Moves the World
              </span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
              BrizerHero was founded on a simple belief: great software should be accessible to every business, not just the Fortune 500. We're a tight‑knit team of engineers, designers, and strategists who love building things that work.
            </p>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
              From a single‑page startup website to a full‑scale ecommerce platform serving thousands of users — we bring the same energy, care, and expertise to every project.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-zinc-200 dark:border-zinc-800">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '5+', label: 'Projects Delivered' },
              { value: '3+', label: 'Clients Served' },
              { value: '2+', label: 'Countries' },
              { value: '1+', label: 'Months Building' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-4xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent mb-1">
                  {value}
                </p>
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
              <div key={title} className="flex gap-4 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow">
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

      {/* What we build + CEO Profile */}
      <section className="section-padding bg-zinc-50 dark:bg-zinc-950">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="eyebrow">What We Do</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-5">
                Full-Stack Digital Product Development
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                We're not just a design studio. We're not just a dev shop. We're a complete product team that handles everything from initial strategy through to post‑launch growth.
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

            {/* CEO Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  RK
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100">Ritesh Kumar</h3>
                  <p className="text-sm text-brand-600 dark:text-brand-400">Founder & CEO</p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                Ritesh leads BrizerHero with a vision to democratize high‑quality software. With deep expertise in full‑stack development and a passion for e‑commerce, he ensures every project meets global standards.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.linkedin.com/in/ritesh-kumar-46550a292"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-brand-500 hover:bg-brand-50 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/RiteshLKumarMaurya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-brand-500 hover:bg-brand-50 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Social Links */}
      <section className="section-padding">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <p className="eyebrow justify-center">Connect With Us</p>
            <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
              Let's Stay in Touch
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Left: Emails & WhatsApp */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <Mail className="w-5 h-5 text-brand-500" />
                <div className="text-sm">
                  <a href="mailto:brizerhero@gmail.com" className="text-zinc-700 dark:text-zinc-300 hover:text-brand-500">brizerhero@gmail.com</a>
                </div>
                
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <Phone className="w-5 h-5 text-brand-500" />
                <a href="https://wa.me/918651600737" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-700 dark:text-zinc-300 hover:text-brand-500">
                  WhatsApp Business: +91 8651600737
                </a>
              </div>
            </div>

            {/* Right: Social Media */}
            <div className="flex gap-4 justify-start md:justify-end items-center">
              <a
                href="https://www.instagram.com/brizerhero.com_agency"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-brand-500 hover:bg-brand-50 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/share/14keVwm4vtP/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-brand-500 hover:bg-brand-50 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/ritesh-kumar-46550a292"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-brand-500 hover:bg-brand-50 transition-all"
                aria-label="LinkedIn (CEO)"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/RiteshLKumarMaurya"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-brand-500 hover:bg-brand-50 transition-all"
                aria-label="GitHub (CEO)"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}