// lib/testimonialMetadata.ts

export interface TestimonialMetadata {
  services: string[];
  result: string;
  industry?: string;
  projectType?: string;
}

export const testimonialMetadataMap: Record<string, TestimonialMetadata> = {
  'John Doe': {
    services: ['Ecommerce Website', 'Admin Panel', 'Payment Integration'],
    result: 'Increased Online Sales by 200%',
    industry: 'Fashion Retail',
    projectType: 'Full Ecommerce Platform',
  },
  'Jane Smith': {
    services: ['Android App', 'iOS App', 'Delivery Management'],
    result: 'Automated Delivery Operations',
    industry: 'Food Delivery',
    projectType: 'Delivery App Ecosystem',
  },
  // Add more entries matching clientName from API
};