import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { Providers } from '@/components/layout/Providers';
import { Footer } from '@/components/layout/Footer';
import { NavbarWrapper } from '@/components/layout/NavbarWrapper';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6366f1',
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://brizerhero.com'
  ),

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

  authors: [
    {
      name: 'BrizerHero',
      url: 'https://brizerhero.com',
    },
  ],

  creator: 'BrizerHero',
  publisher: 'BrizerHero',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://brizerhero.com',
    siteName: 'BrizerHero',
    title: 'BrizerHero — Website, App & Software Development Agency',
    description:
      'Premium software development agency for startups and businesses.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BrizerHero',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'BrizerHero — Website, App & Software Development Agency',
    description:
      'Premium software development agency for startups and businesses.',
    images: ['/og-image.png'],
  },

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',

    name: 'BrizerHero',
    url: 'https://brizerhero.com',

    logo: 'https://brizerhero.com/logo.svg',

    description:
      'Premium software development agency building websites, mobile apps, ecommerce solutions, AI products, and custom software.',

    email: 'brizerhero@gmail.com',
    telephone: '+918651600737',

    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Buxar',
      addressRegion: 'Bihar',
      addressCountry: 'IN',
    },

    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
  };

  return (
    <html
      lang="en"
      className={inter.variable}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link rel="manifest" href="/site.webmanifest" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>

      <body className="min-h-screen bg-white dark:bg-zinc-950 font-sans antialiased">
        <Providers>
          <NavbarWrapper />
          <main className="pt-16 md:pt-18">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}