/**
 * lib/config.js — Centralized Application Configuration
 *
 * Single source of truth for ALL environment-driven configuration.
 * Reads from VITE_ prefixed env vars (safe to expose to browser).
 * Validates required variables at import time — fails loudly in dev,
 * logs a warning in production so the app never silently misbehaves.
 */

// ─── Validation ──────────────────────────────────────────────────────────────

const REQUIRED_VARS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
];

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (process.env || {});
const missing = REQUIRED_VARS.filter((key) => !env[key]);

if (missing.length > 0) {
  const msg = [
    '',
    '╔══════════════════════════════════════════════════════╗',
    '║           REVORAA — MISSING ENVIRONMENT VARIABLES    ║',
    '╚══════════════════════════════════════════════════════╝',
    '',
    `The following required environment variables are not set:`,
    ...missing.map((k) => `  ✗  ${k}`),
    '',
    'To fix this:',
    '  1. Copy frontend/.env.example → frontend/.env.local',
    '  2. Fill in the values from your Supabase project dashboard',
    '  3. Restart the dev server',
    '',
  ].join('\n');

  if (env.DEV) {
    throw new Error(msg);
  } else {
    console.error(msg);
  }
}

// ─── Supabase ─────────────────────────────────────────────────────────────────

export const supabaseConfig = {
  url:     env.VITE_SUPABASE_URL,
  anonKey: env.VITE_SUPABASE_ANON_KEY,
};

// ─── App ──────────────────────────────────────────────────────────────────────

/**
 * The canonical public-facing URL for this deployment.
 * Used for OAuth redirect URIs and email deep-links.
 * Defaults to the current browser origin in development.
 */
export const appConfig = {
  url:           env.VITE_APP_URL || (typeof window !== 'undefined' ? window.location?.origin : ''),
  supportEmail:  env.VITE_SUPPORT_EMAIL || 'support@revoraa.co.in',
  senderEmail:   env.VITE_SENDER_EMAIL  || 'reminders@revoraa.com',
};

// ─── Auth Redirect URLs ───────────────────────────────────────────────────────

export const authConfig = {
  oauthCallbackUrl:    `${appConfig.url}/auth/callback`,
  passwordResetUrl:    `${appConfig.url}/reset-password`,
};

// ─── Firebase / FCM ───────────────────────────────────────────────────────────

const isValidVapidKey = (key) => {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  if (trimmed.length < 50) return false;
  if (/^(your|placeholder|demo|test|xxx)/i.test(trimmed)) return false;
  return true;
};

const rawVapidKey = env.VITE_FIREBASE_VAPID_KEY || null;
const validVapidKey = isValidVapidKey(rawVapidKey) ? rawVapidKey.trim() : null;

export const firebaseConfig = {
  apiKey:            env.VITE_FIREBASE_API_KEY            || null,
  authDomain:        env.VITE_FIREBASE_AUTH_DOMAIN        || null,
  projectId:         env.VITE_FIREBASE_PROJECT_ID        || null,
  storageBucket:     env.VITE_FIREBASE_STORAGE_BUCKET    || null,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || null,
  appId:             env.VITE_FIREBASE_APP_ID             || null,
  vapidKey:          validVapidKey,
  /** True only when all FCM-required keys are validly present */
  isConfigured: Boolean(
    env.VITE_FIREBASE_API_KEY &&
    env.VITE_FIREBASE_PROJECT_ID &&
    env.VITE_FIREBASE_MESSAGING_SENDER_ID &&
    env.VITE_FIREBASE_APP_ID &&
    validVapidKey
  ),
};

// ─── Feature Flags ────────────────────────────────────────────────────────────

export const featureFlags = {
  pushNotifications: firebaseConfig.isConfigured,
  googleCalendar:    Boolean(env.VITE_GOOGLE_CLIENT_ID),
};

// ─── Telemetry (Sentry & PostHog) ─────────────────────────────────────────────

export const telemetryConfig = {
  sentryDsn: env.VITE_SENTRY_DSN || null,
  posthogKey: env.VITE_POSTHOG_KEY || null,
  posthogHost: env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
};
