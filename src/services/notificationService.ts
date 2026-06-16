import apiClient from '@/lib/apiClient';
import { getFCMToken } from '@/lib/firebase';

export const sendFCMTokenToBackend = async (userId: string | number) => {
  const userIdStr = String(userId);  try {
    const token = await getFCMToken();
    if (!token) return;
    await apiClient.post('/notifications/register-token', {
      userId: userIdStr,
      fcmToken: token,
      deviceType: 'web',
    });
  } catch (error) {
    // Silent fail – don't block user
    console.warn('Failed to register FCM token:', error);
  }
};