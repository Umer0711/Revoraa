/**
 * usePushNotifications — React hook
 * 
 * Handles:
 * 1. Requesting browser notification permission
 * 2. Registering the FCM token with Supabase user_settings
 * 3. Listening for foreground messages
 * 4. Displaying in-app toast notifications
 */

import { useEffect, useCallback, useRef } from 'react';
import { requestNotificationPermission, onForegroundMessage } from './firebase';
import { supabase } from './supabaseClient';

export function usePushNotifications(userId) {
  const unsubscribeRef = useRef(null);

  const registerToken = useCallback(async () => {
    if (!userId || !('Notification' in window)) return;
    if (Notification.permission === 'denied') return;

    const token = await requestNotificationPermission();
    if (!token) return;

    // Store token in user_settings
    const { error } = await supabase
      .from('user_settings')
      .update({ fcm_token: token, updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    if (error) console.warn('[FCM] Failed to save token:', error.message);
    else console.info('[FCM] Token registered.');
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    // Register token after a short delay (don't block initial render)
    const timer = setTimeout(registerToken, 3000);

    // Listen for foreground messages and show a brief toast
    const unsubscribe = onForegroundMessage((payload) => {
      const title = payload.notification?.title ?? 'Revoraa';
      const body  = payload.notification?.body  ?? '';
      console.info('[FCM] Foreground message:', title, body);

      // Dispatch a custom event that the Navbar can listen to
      window.dispatchEvent(new CustomEvent('revoraa:notification', { detail: { title, body } }));
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      clearTimeout(timer);
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [userId, registerToken]);
}
