// Firebase Cloud Messaging Service Worker
// This file must be at the root of the public directory and served as firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            self.FIREBASE_API_KEY            || '',
  authDomain:        self.FIREBASE_AUTH_DOMAIN        || '',
  projectId:         self.FIREBASE_PROJECT_ID         || '',
  storageBucket:     self.FIREBASE_STORAGE_BUCKET     || '',
  messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID || '',
  appId:             self.FIREBASE_APP_ID             || '',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const { title, body, icon } = payload.notification ?? {};
  
  self.registration.showNotification(title ?? 'Revoraa', {
    body:  body  ?? 'You have a new notification from Revoraa.',
    icon:  icon  ?? '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag:   'revoraa-notification',
    data:  payload.data ?? {},
    actions: [
      { action: 'open',    title: 'Open Revoraa' },
      { action: 'dismiss', title: 'Dismiss'       },
    ],
  });
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/dashboard');
      }
    })
  );
});
