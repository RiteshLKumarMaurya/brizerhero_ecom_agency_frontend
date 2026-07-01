'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/api';
import { getFCMToken } from '@/lib/firebase'; // ✅ ADDED

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (notification?: (n: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
          renderButton: (element: HTMLElement, config: object) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  const handleCredentialResponse = useCallback(
    async (credential: string, redirectTo = '/') => {
      setLoading(true);
      try {
        // 🔥 1. Get FCM token (if available)
        const fcmToken = await getFCMToken();

        // 2. Call backend with idToken + fcmToken + device
        const { data } = await authApi.googleLogin({
          idToken: credential,
          fcmToken: fcmToken || undefined,
          device: 'web',
        });

        const { user, tokens } = data.data;
        setAuth(user, tokens.accessToken, tokens.refreshToken);
        toast.success(`Welcome${user.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}!`);
        router.push(redirectTo);
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Google login failed. Please try again.';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [setAuth, router]
  );

  const initGoogleOneTap = useCallback(
    (redirectTo = '/') => {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId || typeof window === 'undefined' || !window.google) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => handleCredentialResponse(response.credential, redirectTo),
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // One Tap not shown — use manual button
        }
      });
    },
    [handleCredentialResponse]
  );

  const renderGoogleButton = useCallback(
    (element: HTMLElement, redirectTo = '/') => {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId || !window.google) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => handleCredentialResponse(response.credential, redirectTo),
      });

      window.google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      });
    },
    [handleCredentialResponse]
  );

  return { loading, handleCredentialResponse, initGoogleOneTap, renderGoogleButton };
}