/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.brizerhero.com', 'res.cloudinary.com', 'lh3.googleusercontent.com'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
