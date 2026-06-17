// lib/projectMetadata.ts

export interface ProjectCaseStudy {
  industry: string;
  stats: {
    products?: string;
    orders?: string;
    users?: string;
    platform?: string;
    uptime?: string;
  };
  problem: string;
  solution: string;
  results: string[];
  timeline?: string;
  features?: string[];
}

export const projectCaseStudyMap: Record<string, ProjectCaseStudy> = {
  // Example – replace with real slugs and data
  'brizer-hero-ecommerce': {
    industry: 'Ecommerce',
    stats: {
      products: '50K+',
      orders: '1K+/day',
      users: '100K+',
      platform: 'Web + Android + iOS',
      uptime: '99.9%',
    },
    problem:
      'The client’s existing platform was outdated, slow, and lacked mobile capabilities. They needed a complete ecosystem to handle high traffic, automate operations, and provide a seamless shopping experience across devices.',
    solution:
      'We built a modern, scalable ecommerce ecosystem including a high‑performance website, native Android and iOS apps, an admin dashboard, and a delivery management system – all integrated with real‑time analytics and payment gateways.',
    results: [
      '300% increase in online sales within 3 months',
      '80% reduction in manual order processing',
      'Inventory management fully automated',
      'Customer retention improved by 40% with mobile app',
    ],
    timeline: '12 weeks',
    features: [
      'Product Catalog with AI Recommendations',
      'Multi‑vendor Support',
      'Real‑time Order Tracking',
      'Advanced Analytics Dashboard',
    ],
  },
  // Add more projects as needed
};