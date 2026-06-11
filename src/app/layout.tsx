import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://brizerhero.com'),
  title: {
    default: 'BrizerHero — Website, App & Software Development Agency',
    template: '%s | BrizerHero',
  },
  description:
    'BrizerHero is a premium software development agency building websites, mobile apps, ecommerce solutions, AI products, and custom software for startups, businesses, and entrepreneurs.',
  keywords: [
    'website development company',
    'app development company',
    'software development agency',
    'ecommerce development company',
    'custom software development',
    'mobile app development',
    'AI solutions',
    'startup development',
    'BrizerHero',
  ],
  authors: [{ name: 'BrizerHero', url: 'https://brizerhero.com' }],
  creator: 'BrizerHero',
  publisher: 'BrizerHero',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://brizerhero.com',
    siteName: 'BrizerHero',
    title: 'BrizerHero — Website, App & Software Development Agency',
    description: 'Premium software development agency for startups and businesses.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BrizerHero' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@brizerhero',
    creator: '@brizerhero',
    title: 'BrizerHero — Website, App & Software Development Agency',
    description: 'Premium software development agency for startups and businesses.',
    images: ['/og-image.png'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'BrizerHero',
              url: 'https://brizerhero.com',
              logo: 'https://brizerhero.com/logo.png',
              description: 'Premium software development agency',
              sameAs: ['https://twitter.com/brizerhero', 'https://linkedin.com/company/brizerhero'],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                availableLanguage: 'English',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-surface dark:bg-surface-dark font-sans antialiased">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
