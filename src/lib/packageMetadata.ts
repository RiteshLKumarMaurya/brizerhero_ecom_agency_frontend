// lib/packageMetadata.ts

export interface PackageMetadata {
  thumbnail: string;          // URL for the card banner
  bestFor: string;            // e.g., "Small Businesses"
  highlights: string[];       // short feature list
  stats: {
    products: string;
    delivery: string;
    support: string;
    platforms: string;
  };
}

export const packageMetadataMap: Record<string, PackageMetadata> = {
  'starter-ecommerce-package': {
    thumbnail: '/images/packages/starter-thumb.jpg', // replace with actual CDN URLs
    bestFor: 'Small Businesses & Startups',
    highlights: [
      'Ecommerce Website',
      'Admin Dashboard',
      'Product Management',
      'Inventory Management',
      'Razorpay Integration',
      'SEO Optimization',
    ],
    stats: {
      products: 'Up to 500',
      delivery: '2–3 weeks',
      support: '3 months free',
      platforms: 'Web + Admin',
    },
  },
  'growth-ecommerce-package': {
    thumbnail: '/images/packages/growth-thumb.jpg',
    bestFor: 'Growing Brands',
    highlights: [
      'Everything in Starter',
      'Android Ecommerce App',
      'iOS Ecommerce App',
      'Multi‑vendor Support',
      'Advanced Analytics',
      'Email Automation',
    ],
    stats: {
      products: 'Up to 5,000',
      delivery: '3–4 weeks',
      support: '6 months free',
      platforms: 'Web + Admin + Mobile',
    },
  },
  'professional-ecommerce-package': {
    thumbnail: '/images/packages/professional-thumb.jpg',
    bestFor: 'Established Brands',
    highlights: [
      'Everything in Growth',
      'Delivery Management App',
      'Vendor Panel',
      'AI‑based Recommendations',
      'Chat Support System',
      'Headless CMS',
    ],
    stats: {
      products: 'Unlimited',
      delivery: '4–6 weeks',
      support: '12 months free',
      platforms: 'Full Ecosystem',
    },
  },
  // add more as needed
};