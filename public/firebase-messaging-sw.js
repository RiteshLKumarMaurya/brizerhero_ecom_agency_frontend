importScripts(
  "https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCyrCPMHK1nWItoXjGUUqjpUWzPIjq_f8g",
  authDomain: "brizerhero-agency.firebaseapp.com",
  projectId: "brizerhero-agency",
  storageBucket: "brizerhero-agency.firebasestorage.app",
  messagingSenderId: "995240676409",
  appId: "1:995240676409:web:b621d19c286e79113451e8",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification?.title || "New Notification",
    {
      body: payload.notification?.body || "You have a new notification",
      icon: "/logo.svg",
    }
  );
});