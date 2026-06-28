// lib/testimonialMetadata.ts
//
// PLACEHOLDER DATA — the three entries below are illustrative examples only,
// not real clients. Replace the keys with real client names exactly as
// returned by the API, and only ship results that are actually true.
// Never add a revenue or sales figure that hasn't been confirmed by the client.

export interface TestimonialMetadata {
  industry: string;        // The kind of grocery business — shown as their business type
  services: string[];      // What we actually helped with (max 4–5 shown)
  result: string;          // One honest, observable change — never a revenue or sales number
  location?: string;       // City, State — editorial-only, not part of the API response
}

export const testimonialMetadataMap: Record<string, TestimonialMetadata> = {
  'Raj Patel': {
    industry: 'Indian Grocery',
    services: ['Online Ordering', 'Pickup & Delivery', 'Inventory Dashboard'],
    result: 'Customers now order online instead of calling the store.',
    location: 'Edison, NJ',
  },
  'Maria Lopez': {
    industry: 'Organic Grocery',
    services: ['Customer Mobile App', 'Admin Panel', 'Payment Integration'],
    result: 'Replaced a paper order book with one simple dashboard.',
    location: 'Austin, TX',
  },
  'Sana Khan': {
    industry: 'Bakery',
    services: ['Online Ordering', 'Inventory Dashboard'],
    result: 'Festival pre-orders no longer come in one phone call at a time.',
    location: 'Chicago, IL',
  },
  // Add more entries matching clientName from API
};