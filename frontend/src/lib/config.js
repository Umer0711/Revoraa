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

const missing = REQUIRED_VARS.filter((key) => !import.meta.env[key]);

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

  if (import.meta.env.DEV) {
    throw new Error(msg);
  } else {
    console.error(msg);
  }
}

// ─── Supabase ─────────────────────────────────────────────────────────────────

export const supabaseConfig = {
  url:     import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

// ─── App ──────────────────────────────────────────────────────────────────────

/**
 * The canonical public-facing URL for this deployment.
 * Used for OAuth redirect URIs and email deep-links.
 * Defaults to the current browser origin in development.
 */
export const appConfig = {
  url:           import.meta.env.VITE_APP_URL || (typeof window !== 'undefined' ? window.location.origin : ''),
  supportEmail:  import.meta.env.VITE_SUPPORT_EMAIL || 'support@revoraa.co.in',
  senderEmail:   import.meta.env.VITE_SENDER_EMAIL  || 'reminders@revoraa.com',
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

const rawVapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || null;
const validVapidKey = isValidVapidKey(rawVapidKey) ? rawVapidKey.trim() : null;

export const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || null,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || null,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID        || null,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET    || null,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || null,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || null,
  vapidKey:          validVapidKey,
  /** True only when all FCM-required keys are validly present */
  isConfigured: Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID &&
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID &&
    import.meta.env.VITE_FIREBASE_APP_ID &&
    validVapidKey
  ),
};

// ─── Feature Flags ────────────────────────────────────────────────────────────

export const featureFlags = {
  pushNotifications: firebaseConfig.isConfigured,
  googleCalendar:    Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID),
};

// ─── Telemetry (Sentry & PostHog) ─────────────────────────────────────────────

export const telemetryConfig = {
  sentryDsn: import.meta.env.VITE_SENTRY_DSN || null,
  posthogKey: import.meta.env.VITE_POSTHOG_KEY || null,
  posthogHost: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
};
