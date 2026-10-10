/**
 * supabaseClient.js
 *
 * Supabase client singleton. All configuration comes from lib/config.js,
 * which reads from environment variables and validates them at startup.
 * No fallback values — if env vars are missing, config.js throws first.
 */

import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './config.js';

export const supabase = createClient(
  supabaseConfig.url,
  supabaseConfig.anonKey,
);
