/**
 * firebase.js — Firebase Cloud Messaging (FCM)
 *
 * Used ONLY for push notifications. Auth, DB, and storage use Supabase.
 * All credentials come from the centralized config module (env vars only).
 * Gracefully no-ops when Firebase is not configured.
 */

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { firebaseConfig } from './config';

let app       = null;
let messaging = null;

// Only initialize if all required keys are present
if (firebaseConfig.isConfigured) {
  try {
    app = initializeApp({
      apiKey:            firebaseConfig.apiKey,
      authDomain:        firebaseConfig.authDomain,
      projectId:         firebaseConfig.projectId,
      storageBucket:     firebaseConfig.storageBucket,
      messagingSenderId: firebaseConfig.messagingSenderId,
      appId:             firebaseConfig.appId,
    });
    messaging = getMessaging(app);
  } catch (err) {
    console.warn('[FCM] Firebase init failed:', err.message);
  }
} else {
  console.info('[FCM] Push notifications disabled — Firebase config not set. See .env.example.');
}

/**
 * Request browser notification permission and retrieve FCM registration token.
 * Returns null if permission is denied or FCM is not configured.
 */
export async function requestNotificationPermission() {
  if (!messaging || !firebaseConfig.vapidKey) return null;
  if (!('Notification' in window))            return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    const token = await getToken(messaging, { vapidKey: firebaseConfig.vapidKey });
    return token ?? null;
  } catch (err) {
    console.warn('[FCM] Token registration failed:', err.message);
    return null;
  }
}

/**
 * Subscribe to foreground push messages.
 * Returns an unsubscribe function.
 * @param {(payload: object) => void} callback
 * @returns {() => void}
 */
export function onForegroundMessage(callback) {
  if (!messaging) return () => {};
  return onMessage(messaging, callback);
}

export { messaging };
