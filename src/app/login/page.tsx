import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginPageClient } from './LoginPageClient';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your BrizerHero account.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageClient />
    </Suspense>
  );
}