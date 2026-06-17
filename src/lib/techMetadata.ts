// lib/techMetadata.ts
export interface TechMetadata {
  category: string;
  experienceLevel: 'Expert' | 'Advanced' | 'Intermediate';
  usedInProjects: string[];
}

export const techMetadataMap: Record<string, TechMetadata> = {
  'spring-boot': {
    category: 'Backend',
    experienceLevel: 'Expert',
    usedInProjects: ['Ecommerce Website', 'Admin Panel', 'Delivery System', 'Vendor Panel'],
  },
  'react': {
    category: 'Frontend',
    experienceLevel: 'Expert',
    usedInProjects: ['Customer Dashboard', 'Admin UI', 'Landing Pages'],
  },
  'postgresql': {
    category: 'Database',
    experienceLevel: 'Advanced',
    usedInProjects: ['Order Management', 'Product Catalog', 'Analytics'],
  },
  'redis': {
    category: 'Database',
    experienceLevel: 'Advanced',
    usedInProjects: ['Session Cache', 'Rate Limiting', 'Real-time Notifications'],
  },
  'docker': {
    category: 'DevOps',
    experienceLevel: 'Advanced',
    usedInProjects: ['CI/CD Pipelines', 'Microservices Deployment'],
  },
  'kubernetes': {
    category: 'DevOps',
    experienceLevel: 'Intermediate',
    usedInProjects: ['Container Orchestration', 'Scaling Infrastructure'],
  },
  'react-native': {
    category: 'Mobile',
    experienceLevel: 'Expert',
    usedInProjects: ['Customer App', 'Vendor App', 'Delivery App'],
  },
  'flutter': {
    category: 'Mobile',
    experienceLevel: 'Intermediate',
    usedInProjects: ['Cross-platform Apps'],
  },
  'spring-cloud': {
    category: 'Cloud',
    experienceLevel: 'Advanced',
    usedInProjects: ['Microservices', 'API Gateway'],
  },
  'aws': {
    category: 'Cloud',
    experienceLevel: 'Expert',
    usedInProjects: ['Hosting', 'S3 Storage', 'Lambda Functions'],
  },
  // ... add as many as needed
};

export const getTechMetadata = (slug: string): TechMetadata => {
  return techMetadataMap[slug] || {
    category: 'General',
    experienceLevel: 'Intermediate',
    usedInProjects: ['Ecommerce Platform', 'Admin Dashboard', 'Mobile App'],
  };
};