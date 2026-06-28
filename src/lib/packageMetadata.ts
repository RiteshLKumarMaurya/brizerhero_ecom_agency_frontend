// lib/packageMetadata.ts

export interface PackageMetadata {
  thumbnail: string | null;       // URL for the card banner
  imageAlt: string;               // Grocery-specific alt text for the banner image (accessibility + SEO)
  displayName: string;            // Frontend-only name (slug unchanged)
  stage: string;                  // Original descriptive stage label (kept for any other consumers of this map)
  stageWord: string;              // One-word stage label — paired with stageNumber for the "Stage One — Start" badge
  stageNumber: 1 | 2 | 3;        // Used for accent color selection
  bestFor: string;                // Who this is designed for
  beforeAfter: string;            // One-sentence emotional shift this package creates for the owner
  includesPrevious?: string;      // Display name of the prior-tier package this one carries forward, if any
  outcomes: string[];             // Business outcomes in plain language (max 6)
  stats: {
    products: string;
    delivery: string;
    support: string;
    platforms: string;
  };
}

export const packageMetadataMap: Record<string, PackageMetadata> = {
  'starter-ecommerce-package': {
    thumbnail: '/images/packages/grocery-online-ordering.jpg',
    imageAlt:
      'Indian grocery store owner taking orders from a tablet, with fresh produce shelves behind the counter',
    displayName: 'Start Selling Online',
    stage: 'Getting Started',
    stageWord: 'Start',
    stageNumber: 1,
    bestFor: 'Independent Grocery Stores',
    beforeAfter: 'Stop taking orders over WhatsApp — start accepting them professionally, online.',
    outcomes: [
      'Accept orders on your own website',
      'Offer pickup & home delivery',
      'Keep your inventory always current',
      'Manage everything from one dashboard',
      'Get found on Google from day one',
      'Accept payments online, instantly',
    ],
    stats: {
      products: 'Up to 500 products',
      delivery: 'Live in 2–3 weeks',
      support: '3 months free support',
      platforms: 'Web store + Admin',
    },
  },

  'growth-ecommerce-package': {
    thumbnail: '/images/packages/grocery-mobile-app-delivery.jpg',
    imageAlt:
      'Grocery store staff packing a home delivery order while checking it against a mobile app',
    displayName: 'Grow Your Business',
    stage: 'Building Momentum',
    stageWord: 'Grow',
    stageNumber: 2,
    bestFor: 'Growing Grocery Businesses',
    beforeAfter: 'Turn occasional buyers into loyal, repeat customers.',
    includesPrevious: 'Start Selling Online',
    outcomes: [
      'Reach customers on Android & iOS',
      'Send automated offers & reminders',
      'Manage multiple vendors with ease',
      "Understand what's selling and what's not",
      'Build a loyal base of repeat customers',
    ],
    stats: {
      products: 'Up to 5,000 products',
      delivery: 'Live in 3–4 weeks',
      support: '6 months free support',
      platforms: 'Web + Admin + Mobile apps',
    },
  },

  'professional-ecommerce-package': {
    thumbnail: '/images/packages/grocery-multi-location-operations.jpg',
    imageAlt:
      'Manager overseeing multi-location grocery operations and delivery routes from a dashboard',
    displayName: 'Scale With Confidence',
    stage: 'Operating At Scale',
    stageWord: 'Scale',
    stageNumber: 3,
    bestFor: 'Multi-Location & High-Volume Stores',
    beforeAfter: 'Run your entire grocery business from one place.',
    includesPrevious: 'Grow Your Business',
    outcomes: [
      'Manage your own delivery team & routes',
      'Give vendors their own self-serve panel',
      'Show smarter, AI-driven product suggestions',
      'Support customers with live chat',
      'Run your full operation in one place',
    ],
    stats: {
      products: 'Unlimited products',
      delivery: 'Live in 4–6 weeks',
      support: '12 months free support',
      platforms: 'Full business ecosystem',
    },
  },
};