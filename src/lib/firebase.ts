import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!;

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

let messaging: Messaging | null = null;

if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

export async function getFCMToken(): Promise<string | null> {
  try {
    if (typeof window === "undefined") return null;

    if (!messaging) {
      console.error("Firebase messaging not initialized");
      return null;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    await navigator.serviceWorker.ready;

    console.log("Service Worker Ready");

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    console.log("FCM Token:", token);

    return token;
  } catch (error: any) {
    console.error("FCM ERROR:", error);
    console.error("FCM CODE:", error?.code);
    console.error("FCM MESSAGE:", error?.message);
    return null;
  }
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });