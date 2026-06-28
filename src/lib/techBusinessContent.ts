/**
 * techBusinessContent.ts
 * ──────────────────────────────────────────────────────────────────────────
 * Presentation-layer content adapter only. Does NOT replace techMetadata.ts,
 * does NOT touch backend data, hooks, or routing. Maps a technology's slug
 * to grocery-business-facing copy (what it is / why we use it / how it pays
 * off for a grocery operator), plus a "trust indicator" replacing the old
 * "Experience Level" badge.
 *
 * Any slug not explicitly mapped below safely falls back to generic,
 * still-business-framed copy built from tech.name / tech.description, so
 * nothing ever renders blank.
 */

export type TrustIndicator =
  | 'Production Ready'
  | 'Enterprise Standard'
  | 'Battle Tested'
  | 'Core Infrastructure'
  | 'Customer Experience';

export interface TechBusinessContent {
  /** One-line plain-English answer to "what is this." No jargon. */
  whatItIs: string;
  /** Why BrizerHero chose it — the engineering rationale, translated. */
  whyWeUseIt: string;
  /** The direct payoff for a grocery business owner. */
  businessBenefit: string;
  /** Short outcome label shown on the card, e.g. "Faster checkout" */
  outcomeLabel: string;
  /** Trust indicator replacing "Expert / Advanced / Intermediate" */
  trust: TrustIndicator;
  /** Where inside a grocery platform this shows up operationally */
  whereWeUseIt: string[];
  /** 3–4 concrete capabilities, written as outcomes not features */
  capabilities: string[];
  /** Short FAQ pairs for the detail page */
  faqs: { question: string; answer: string }[];
}

const DEFAULT_FAQS = (name: string): { question: string; answer: string }[] => [
  {
    question: `Will ${name} slow down during a weekend rush?`,
    answer: `No. It's built and configured to hold steady load, so checkout, inventory, and order flow keep working even during your busiest hours.`,
  },
  {
    question: `Do I need technical staff to manage this?`,
    answer: `No. This runs as part of your platform's foundation. Our team operates and maintains it, so your staff focus on running the store, not the software.`,
  },
  {
    question: `Is this proven at the scale of a multi-store grocery business?`,
    answer: `Yes. It's a widely adopted, well-supported technology already running in demanding, high-traffic environments before we ever bring it into your platform.`,
  },
];

export const techBusinessContentMap: Record<string, TechBusinessContent> = {
  'spring-boot': {
    whatItIs: 'The engine room that runs your store\u2019s core business logic — pricing, orders, inventory rules, and promotions.',
    whyWeUseIt: 'We chose it because it has over a decade of proven reliability in industries where downtime costs real money, including retail and grocery.',
    businessBenefit: 'Your platform keeps running correctly under pressure — at 8am restock, at 6pm rush, on the day you run a storewide sale.',
    outcomeLabel: 'Operational reliability',
    trust: 'Core Infrastructure',
    whereWeUseIt: [
      'Order processing and checkout logic',
      'Inventory and stock-level rules',
      'Pricing, discounts, and promotion engines',
      'Staff and store-management permissions',
    ],
    capabilities: [
      'Keeps pricing and promotions consistent across every store and channel',
      'Processes orders accurately even during high-traffic periods',
      'Connects cleanly to your payment, loyalty, and supplier systems',
      'Scales with you as you add stores or sales volume grows',
    ],
    faqs: [
      {
        question: 'What happens if we add more stores or locations?',
        answer: 'This layer is built to grow with you. Adding stores, registers, or order volume doesn\u2019t require rebuilding your platform.',
      },
      ...DEFAULT_FAQS('this system'),
    ],
  },
  postgresql: {
    whatItIs: 'The secure record-keeper for every order, customer, and inventory count your business generates.',
    whyWeUseIt: 'We chose it because it has a 30-plus year track record for never losing or corrupting data — non-negotiable when every record represents real money and real inventory.',
    businessBenefit: 'You never lose track of a sale, a stock count, or a customer record — even if something goes wrong elsewhere in the system.',
    outcomeLabel: 'Data integrity',
    trust: 'Battle Tested',
    whereWeUseIt: [
      'Customer order history and accounts',
      'Inventory counts across all locations',
      'Financial and sales records',
      'Reporting and analytics behind the scenes',
    ],
    capabilities: [
      'Guarantees that completed orders and payments are never silently lost',
      'Keeps inventory counts accurate across multiple stores at once',
      'Supports detailed sales reporting without slowing down your storefront',
      'Backs up automatically so a technical failure never means lost records',
    ],
    faqs: DEFAULT_FAQS('your data layer'),
  },
  redis: {
    whatItIs: 'A high-speed memory layer that keeps frequently checked information instantly ready — like live prices and stock levels.',
    whyWeUseIt: 'We chose it because grocery shoppers expect prices and availability to load instantly, not after a multi-second wait.',
    businessBenefit: 'Your storefront feels fast. Shoppers see accurate prices and stock the moment they look, which means fewer abandoned carts.',
    outcomeLabel: 'Storefront speed',
    trust: 'Production Ready',
    whereWeUseIt: [
      'Live product and price lookups',
      'Shopping cart and session handling',
      'Flash sale and limited-stock counters',
      'Search and filtering responsiveness',
    ],
    capabilities: [
      'Cuts page-load and search response times during peak shopping hours',
      'Keeps shopping carts intact even on an unreliable connection',
      'Handles limited-time offers without overselling stock',
      'Reduces the load on your core database during traffic spikes',
    ],
    faqs: DEFAULT_FAQS('this speed layer'),
  },
  kafka: {
    whatItIs: 'A messaging backbone that lets every part of your platform — orders, inventory, delivery — stay in sync in real time.',
    whyWeUseIt: 'We chose it because grocery operations involve many moving parts at once, and they all need to agree on the same numbers immediately.',
    businessBenefit: 'When a sale happens in-store, your online inventory updates immediately — no overselling, no manual reconciliation.',
    outcomeLabel: 'Real-time accuracy',
    trust: 'Enterprise Standard',
    whereWeUseIt: [
      'Syncing inventory between in-store and online sales',
      'Order status updates across delivery and pickup',
      'Triggering low-stock and reorder alerts',
      'Connecting your platform to supplier and logistics systems',
    ],
    capabilities: [
      'Keeps online and in-store inventory numbers in agreement, in real time',
      'Notifies staff the moment stock runs low, before customers notice',
      'Lets new systems plug in later without disrupting what already works',
      'Handles high volumes of simultaneous orders without dropping updates',
    ],
    faqs: DEFAULT_FAQS('this layer'),
  },
  kong: {
    whatItIs: 'The secure front door that controls how your apps, website, and partner systems talk to your platform.',
    whyWeUseIt: 'We chose it to make sure every request into your system is verified, monitored, and protected before it touches your data.',
    businessBenefit: 'Your customer data and business systems stay protected, while still connecting smoothly to delivery partners, payment providers, and your mobile app.',
    outcomeLabel: 'Secure connectivity',
    trust: 'Enterprise Standard',
    whereWeUseIt: [
      'Customer app and website traffic',
      'Third-party delivery and logistics integrations',
      'Payment provider connections',
      'Internal staff and admin tools',
    ],
    capabilities: [
      'Verifies every request before it reaches sensitive business data',
      'Gives you visibility into how your systems are being used',
      'Makes it safe to connect new delivery or payment partners',
      'Protects against traffic spikes and abuse without manual intervention',
    ],
    faqs: DEFAULT_FAQS('this layer'),
  },
  graphql: {
    whatItIs: 'A flexible way for your apps to ask for exactly the information they need — no more, no less.',
    whyWeUseIt: 'We chose it so your mobile app, website, and admin dashboard each get fast, tailored responses instead of slow, oversized ones.',
    businessBenefit: 'Pages and screens load with only what\u2019s needed, which means a snappier experience for shoppers and staff alike.',
    outcomeLabel: 'Faster experiences',
    trust: 'Production Ready',
    whereWeUseIt: [
      'Customer-facing app and website data requests',
      'Admin and staff dashboards',
      'Reporting screens that combine multiple data sources',
    ],
    capabilities: [
      'Reduces load times by fetching only the data each screen needs',
      'Makes it faster to add new features without reworking existing ones',
      'Combines data from multiple systems into a single smooth screen',
    ],
    faqs: DEFAULT_FAQS('this layer'),
  },
  'react-native': {
    whatItIs: 'The technology behind your customer-facing mobile shopping app, built once and run on both iPhone and Android.',
    whyWeUseIt: 'We chose it so your mobile app reaches both major app stores without doubling development time or cost.',
    businessBenefit: 'Your customers get a fast, native-feeling shopping app on whichever phone they carry, and new features ship to both at the same time.',
    outcomeLabel: 'Mobile reach',
    trust: 'Customer Experience',
    whereWeUseIt: [
      'Customer shopping and ordering app',
      'Push notifications for offers and order updates',
      'In-app loyalty and rewards experience',
    ],
    capabilities: [
      'Reaches iPhone and Android customers from a single app build',
      'Ships new features to both platforms at the same time',
      'Delivers a smooth, responsive shopping experience on mobile data',
      'Supports push notifications for order updates and promotions',
    ],
    faqs: DEFAULT_FAQS('your mobile app'),
  },
  'next-js': {
    whatItIs: 'The technology behind your storefront website — built so pages load quickly and rank well in search.',
    whyWeUseIt: 'We chose it because grocery shoppers leave slow sites, and search visibility directly drives new customers to your store.',
    businessBenefit: 'Your storefront loads quickly on any device and is easier for customers to find through search engines.',
    outcomeLabel: 'Storefront speed',
    trust: 'Customer Experience',
    whereWeUseIt: [
      'Public storefront and product pages',
      'Search engine visibility',
      'Promotional and landing pages',
    ],
    capabilities: [
      'Loads product and category pages quickly, even on mobile networks',
      'Improves how easily customers find your store through search engines',
      'Supports high traffic during sales events without slowing down',
      'Makes it easy to update storefront content without a full rebuild',
    ],
    faqs: DEFAULT_FAQS('your storefront'),
  },
  react: {
    whatItIs: 'The technology behind the screens your staff and managers use every day to run the store.',
    whyWeUseIt: 'We chose it for its reliability and the depth of tooling available, which keeps your internal tools stable and easy to extend.',
    businessBenefit: 'Your staff get dashboards and tools that are responsive and consistent, reducing training time and daily friction.',
    outcomeLabel: 'Staff efficiency',
    trust: 'Production Ready',
    whereWeUseIt: [
      'Store and inventory management dashboards',
      'Staff scheduling and operations tools',
      'Reporting and analytics views',
    ],
    capabilities: [
      'Keeps internal tools fast and responsive for daily staff use',
      'Makes it straightforward to add new operational tools over time',
      'Reduces training time with a consistent, predictable interface',
    ],
    faqs: DEFAULT_FAQS('your internal tools'),
  },
  tailwind: {
    whatItIs: 'The design system that keeps every screen of your platform visually consistent and on-brand.',
    whyWeUseIt: 'We chose it to make sure your storefront and staff tools look polished and professional, without slowing down development.',
    businessBenefit: 'Your brand looks consistent everywhere a customer or employee sees it — website, app, and dashboards alike.',
    outcomeLabel: 'Brand consistency',
    trust: 'Production Ready',
    whereWeUseIt: [
      'Storefront and marketing pages',
      'Mobile app screens',
      'Staff and admin dashboards',
    ],
    capabilities: [
      'Keeps visual design consistent across every part of your platform',
      'Speeds up how quickly new pages and features can be designed',
      'Makes your brand feel deliberate, not assembled piecemeal',
    ],
    faqs: DEFAULT_FAQS('your platform\u2019s design'),
  },
};

/**
 * Returns business content for a slug, falling back to a generic-but-still
 * business-framed entry when the slug isn't explicitly mapped. Guarantees
 * every technology card/page has grocery-relevant copy, never raw jargon.
 */
export function getTechBusinessContent(slug: string, name: string, description?: string | null): TechBusinessContent {
  const mapped = techBusinessContentMap[slug];
  if (mapped) return mapped;

  const cleanDescription = description?.trim();

  return {
    whatItIs: cleanDescription || `A core technology that quietly powers part of your platform's everyday operations.`,
    whyWeUseIt: `We chose ${name} because it's proven at scale, well-supported long-term, and fits naturally into the rest of your platform.`,
    businessBenefit: `It works quietly in the background so your team can focus on running the business, not the software behind it.`,
    outcomeLabel: 'Operational reliability',
    trust: 'Production Ready',
    whereWeUseIt: [
      'Behind the scenes of your day-to-day platform operations',
      'Connected to the rest of your store\u2019s systems',
    ],
    capabilities: [
      `Supports your platform reliably as transaction volume grows`,
      `Integrates cleanly with the rest of your technology`,
      `Maintained and monitored so issues are caught before they affect your store`,
    ],
    faqs: DEFAULT_FAQS(name),
  };
}

export const trustIndicatorMeta: Record<TrustIndicator, { description: string }> = {
  'Production Ready': { description: 'Live and proven in active customer-facing environments.' },
  'Enterprise Standard': { description: 'Meets the reliability and security bar enterprise operations require.' },
  'Battle Tested': { description: 'Hardened by years of use under real, high-stakes business load.' },
  'Core Infrastructure': { description: 'A foundational layer the rest of your platform depends on.' },
  'Customer Experience': { description: 'Directly shapes how fast and smooth your platform feels to shoppers.' },
};