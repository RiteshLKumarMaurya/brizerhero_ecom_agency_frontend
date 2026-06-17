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
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6366f1',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://brizerhero.com'),

  title: {
    default: 'BrizerHero — Website, App & Software Development Agency',
    template: '%s | BrizerHero',
  },

  description:
    'BrizerHero builds websites, Android apps, iOS apps, ecommerce solutions, admin panels, delivery apps, SaaS products and custom software for startups and businesses.',

  keywords: [
    'website development company',
    'software development agency',
    'mobile app development',
    'android app development',
    'ios app development',
    'ecommerce development',
    'saas development',
    'custom software',
    'startup software development',
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
    icon: [
      {
        url: '/favicon.ico',
      },
      {
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],

    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
      },
    ],

    shortcut: ['/favicon.ico'],
  },

  manifest: '/site.webmanifest',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://brizerhero.com',
    siteName: 'BrizerHero',
    title: 'BrizerHero — Website, App & Software Development Agency',
    description:
      'Premium software development agency building websites, mobile apps, ecommerce solutions and SaaS products.',

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
      'Premium software development agency building websites, mobile apps, ecommerce solutions and SaaS products.',
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

    logo: 'https://brizerhero.com/logo.png',

    description:
      'BrizerHero builds websites, mobile apps, ecommerce platforms, SaaS products and custom software.',

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
      contactType: 'customer support',
      availableLanguage: ['English', 'Hindi'],
    },

    sameAs: [],
  };

  return (
    <html
      lang="en"
      className={inter.variable}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/site.webmanifest" />

        <link rel="icon" href="/favicon.ico" sizes="any" />

        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/android-chrome-512x512.png"
        />

        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>

      <body className="min-h-screen bg-white dark:bg-zinc-950 antialiased">
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

