/// <reference types="react" />
import type { Metadata } from 'next';
import { ContactCta } from '@/components/sections/ContactCta';

export const metadata: Metadata = {
  title: 'About — BrizerHero',
  description: 'BrizerHero is a digital technology partner built exclusively for grocery, bakery, dairy, and specialty food businesses across the United States.',
};

const challenges = [
  { label: 'Inventory', description: 'Stock changes by the hour, not the quarter.' },
  { label: 'Pickup & Delivery', description: 'Not an add-on. It\'s how people shop now.' },
  { label: 'Repeat Customers', description: 'The same families come back every week. Your systems should recognize that.' },
  { label: 'Seasonality', description: 'Demand moves with festivals and seasons, not a sales funnel.' },
  { label: 'Daily Operations', description: 'Shifts change. Prices change. The system has to keep up without slowing anyone down.' },
  { label: 'Local Trust', description: 'A grocery store earns trust differently than an app does. Technology should support that, not replace it.' },
];

const whyUs = [
  { num: '01', title: 'Grocery is the only thing we do.', description: 'We\'re not generalists who picked up a grocery client. This is the one industry we know from the inside.' },
  { num: '02', title: 'No template, repurposed.', description: 'We don\'t start from a generic e-commerce theme and bend it toward grocery. We start from how grocery actually works.' },
  { num: '03', title: 'We speak the business, not just the build.', description: 'Inventory turns, shrink, peak-hour staffing — we already understand the language before the first meeting.' },
  { num: '04', title: 'We stay after launch.', description: 'A generic agency moves to the next client. We\'re still here when your store changes next season.' },
];

const principles = [
  { num: '01', title: 'We understand grocery before writing code.', description: 'Before a single screen is designed, we want to know how your shelves get restocked and how your busiest hour actually feels.' },
  { num: '02', title: 'Business outcomes before features.', description: 'A feature that doesn\'t save your team time or your customers a trip isn\'t a win — it\'s just more software.' },
  { num: '03', title: 'Long-term partnerships.', description: 'Inventory shifts, seasons change, new locations open. We build with room for what\'s next, not just what\'s now.' },
  { num: '04', title: 'Simplicity wins.', description: 'If a new hire can\'t use it on day one without training, it\'s too complicated — no matter how capable it is.' },
  { num: '05', title: 'Every decision earns trust.', description: 'Nothing ships because it looks impressive in a demo. It ships because it holds up on a Saturday afternoon rush.' },
];

const process = [
  { step: '01', title: 'Understand', description: 'We sit with how your store actually runs — inventory, staffing, customers, the small daily frictions no one else asks about.' },
  { step: '02', title: 'Design', description: 'We shape the system around your operations, not a template that almost fits.' },
  { step: '03', title: 'Build', description: 'We build it properly, then test it the way your team will actually use it: under pressure, on a busy day.' },
  { step: '04', title: 'Support', description: 'Launch isn\'t the finish line. We stay close as your business keeps evolving.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-24 pb-20">
        <div className="section-container">
          <div className="max-w-3xl animate-fade-up">
            <p className="eyebrow">Why We Exist</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Grocery Runs Differently. <br />
              <span className="bg-gradient-to-r from-teal-500 to-teal-300 bg-clip-text text-transparent">
                So We Build Differently.
              </span>
            </h1>
            <p className="text-lg leading-relaxed mb-6">
              Most software is built for everyone, which means it&apos;s built for no one in particular.
            </p>
            <p className="text-lg leading-relaxed">
              A grocery store doesn&apos;t run like a SaaS company. BrizerHero exists around a single idea: build for grocery, deeply, and nothing else.
            </p>

            <p className="mt-8 max-w-2xl font-display text-xl md:text-2xl leading-snug text-white">
  Because the trust you've spent years earning deserves technology that protects it.
</p>
          </div>
        </div>
      </section>

<section className="section-padding">
  <div className="section-container">
    <div className="max-w-2xl mx-auto text-center mb-14">
      <p className="eyebrow">Who We Build For</p>

      <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
        We Don't Build For Everyone.
      </h2>

      <p className="text-lg text-[var(--text-muted)] leading-relaxed">
        We intentionally focus on grocery businesses because specialization creates better products, better partnerships, and better long-term results.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

      <div className="card-base p-8">
        <h3 className="font-display text-xl font-bold mb-2">
          Indian Grocery
        </h3>
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">
          Family-owned stores serving communities across the United States.
        </p>
      </div>

      <div className="card-base p-8">
        <h3 className="font-display text-xl font-bold mb-2">
          Organic Markets
        </h3>
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">
          Stores focused on fresh, healthy, and specialty products.
        </p>
      </div>

      <div className="card-base p-8">
        <h3 className="font-display text-xl font-bold mb-2">
          Bakeries
        </h3>
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">
          Businesses that depend on repeat customers and daily operations.
        </p>
      </div>

      <div className="card-base p-8">
        <h3 className="font-display text-xl font-bold mb-2">
          Dairy & Produce
        </h3>
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">
          Businesses managing fresh inventory, seasonal demand, and local trust.
        </p>
      </div>

    </div>
  </div>
</section>

      <section className="section-padding bg-[var(--bg-secondary)]">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <p className="eyebrow">Why Grocery</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                We Stopped Trying to Serve Everyone
              </h2>
              <p className="text-lg leading-relaxed">
                Most agencies say yes to every industry. We say yes to one.
              </p>
            </div>
            <div className="space-y-6 pt-1 lg:pt-2">
              <p className="text-lg leading-relaxed">
                Our focus is Indian grocery stores in the United States — family-run, fast-moving, built on customers who come back every week.
              </p>
              <p className="text-lg leading-relaxed">
                The same realities extend to organic markets, bakeries, dairies, and produce sellers: thin margins, daily inventory turns, and trust that&apos;s earned in person, long before it ever shows up online.
              </p>
              <p className="font-display text-xl font-bold leading-snug">
                Working in one industry means we don&apos;t have to relearn your business with every project. We already understand it before the first call.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="max-w-2xl mb-10">
            <p className="eyebrow">How We Think</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              We Start With the Business. Not the Build.
            </h2>
          </div>
          <div className="max-w-2xl space-y-5">
            <p className="text-lg leading-relaxed">
              Most projects start with a feature list. Ours start with a conversation.
            </p>
            <p className="text-lg leading-relaxed">
              What slows your team down during the morning rush? What do your customers expect when they open the app at 7pm on a Sunday? What&apos;s quietly costing you money every week, even if no one&apos;s pointed at it yet?
            </p>
            <p className="text-lg leading-relaxed">
              The technology comes after that conversation, not before it. Once we understand the business, the right build becomes obvious — not the other way around.
            </p>
            <p className="font-display text-xl font-bold leading-snug pt-2">
              It&apos;s also why most of our relationships don&apos;t end at launch. A grocery business keeps changing, and the partner behind its technology should keep showing up.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[var(--bg-secondary)]">
        <div className="section-container">
          <div className="max-w-2xl mb-14">
            <p className="eyebrow">Why BrizerHero</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Why Choose Us Over a Generic Agency
            </h2>
            <p className="text-lg leading-relaxed">
              There&apos;s no shortage of agencies that can build you a website or an app. Here&apos;s what&apos;s actually different about working with one that only builds for grocery.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {whyUs.map(({ num, title, description }) => (
              <div key={num} className="card-base p-7">
                <span className="font-display text-sm text-[var(--text-muted)] block mb-4">{num}</span>
                <h3 className="font-display text-lg font-bold mb-2">{title}</h3>
                <p className="leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-12 lg:gap-16">
            <div className="max-w-md">
              <p className="eyebrow">Our Principles</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                How We Make Decisions
              </h2>
              <p className="leading-relaxed text-[var(--text-muted)]">
                Not abstract values on a wall. Rules we actually apply, project after project.
              </p>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {principles.map(({ num, title, description }) => (
                <div key={num} className="flex gap-6 py-7 first:pt-0">
                  <span className="font-display text-sm text-[var(--text-muted)] pt-1 w-8 flex-shrink-0">
                    {num}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold mb-1">{title}</h3>
                    <p className="leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[var(--bg-secondary)]">
        <div className="section-container">
          <div className="max-w-2xl mb-14">
            <p className="eyebrow">How We Work</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              A Partnership, Not a Project
            </h2>
            <p className="text-lg leading-relaxed">
              No black box, no surprises at the end. Just four steps, in order, every time.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 lg:divide-x divide-[var(--border)]">
            {process.map(({ step, title, description }) => (
              <div key={step} className="py-6 lg:py-2 lg:px-8 lg:first:pl-0 lg:last:pr-0">
                <p className="font-display text-4xl font-bold text-[var(--text-muted)] mb-4">{step}</p>
                <h3 className="font-display text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="sr-only">Founder&apos;s Note</h2>
            <p className="eyebrow text-center">Founder&apos;s Note</p>
            <blockquote className="font-display text-2xl md:text-3xl font-medium leading-snug mb-6">
              I started BrizerHero after watching grocery store owners get sold the same software as everyone else, then struggle to make it fit how their business actually works. Grocery deserves better than a generic template. That&apos;s the whole reason this exists.
            </blockquote>
            <p className="text-sm text-[var(--text-muted)]">
              — <cite className="font-normal not-italic">Ritesh, Founder</cite>
            </p>
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}