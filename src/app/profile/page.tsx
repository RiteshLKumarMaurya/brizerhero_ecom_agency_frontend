import type { Metadata } from 'next';
import { ProfilePageClient } from './ProfilePageClient';

export const metadata: Metadata = {
  title: 'My Profile',
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
