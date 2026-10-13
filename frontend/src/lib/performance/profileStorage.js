/**
 * Revoraa Adaptive Performance System — Persistent Profile Storage
 * 
 * Manages synchronous local caching, Supabase cloud persistence,
 * TTL validation, and multi-device deduplication.
 */

import { PERFORMANCE_ALGORITHM_VERSION, PERFORMANCE_MODES } from './deviceClassifier.js';

let _supabase = null;
async function getSupabase() {
  if (!_supabase) {
    try {
      const mod = await import('../supabaseClient.js');
      _supabase = mod.supabase;
    } catch {
      _supabase = null;
    }
  }
  return _supabase;
}

const PROFILE_STORAGE_KEY = 'revoraa_perf_profile_v1';
const PROFILE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const RECALIBRATION_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Load cached device profile synchronously from localStorage.
 * Runs instantly before React render to eliminate any UI layout flashes.
 */
export function loadCachedProfile(deviceId) {
  if (typeof window === 'undefined') {
    return {
      mode: PERFORMANCE_MODES.BALANCED,
      manualOverride: 'automatic',
      isCached: false,
      isStale: true
    };
  }

  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      return {
        mode: PERFORMANCE_MODES.BALANCED,
        manualOverride: 'automatic',
        isCached: false,
        isStale: true
      };
    }

    const parsed = JSON.parse(raw);
    const now = Date.now();
    const isExpired = now - (parsed.lastAssessedAt || 0) > PROFILE_TTL_MS;
    const isVersionMismatch = parsed.algorithmVersion !== PERFORMANCE_ALGORITHM_VERSION;
    const isValidMode = Object.values(PERFORMANCE_MODES).includes(parsed.mode);

    if (isVersionMismatch || !isValidMode) {
      return {
        mode: PERFORMANCE_MODES.BALANCED,
        manualOverride: parsed.manualOverride || 'automatic',
        isCached: false,
        isStale: true
      };
    }

    // If manual override is active, it always takes precedence
    const effectiveMode = (parsed.manualOverride && parsed.manualOverride !== 'automatic')
      ? parsed.manualOverride
      : parsed.mode;

    return {
      deviceId: parsed.deviceId || deviceId,
      mode: effectiveMode,
      autoMode: parsed.mode || PERFORMANCE_MODES.BALANCED,
      manualOverride: parsed.manualOverride || 'automatic',
      capabilities: parsed.capabilities || null,
      reason: parsed.reason || 'Cached profile',
      lastAssessedAt: parsed.lastAssessedAt || now,
      algorithmVersion: parsed.algorithmVersion,
      isCached: true,
      isStale: isExpired
    };
  } catch (err) {
    console.warn('[Revoraa Perf] Failed to parse local cached profile:', err);
    return {
      mode: PERFORMANCE_MODES.BALANCED,
      manualOverride: 'automatic',
      isCached: false,
      isStale: true
    };
  }
}

/**
 * Save profile to local storage.
 */
export function saveCachedProfile(profile) {
  if (typeof window === 'undefined') return;
  try {
    const dataToSave = {
      deviceId: profile.deviceId,
      mode: profile.autoMode || profile.mode,
      manualOverride: profile.manualOverride || 'automatic',
      capabilities: profile.capabilities,
      reason: profile.reason,
      lastAssessedAt: profile.lastAssessedAt || Date.now(),
      algorithmVersion: PERFORMANCE_ALGORITHM_VERSION
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (err) {
    console.warn('[Revoraa Perf] Failed to write profile to localStorage:', err);
  }
}

/**
 * Determine if reassessment should occur based on cooldown and validity.
 */
export function shouldReassessProfile(cachedProfile, force = false) {
  if (force) return true;
  if (!cachedProfile || !cachedProfile.isCached) return true;
  if (cachedProfile.isStale) return true;

  const now = Date.now();
  const timeSinceLastAssessment = now - (cachedProfile.lastAssessedAt || 0);
  
  // Prevent recalibration if under cooldown
  if (timeSinceLastAssessment < RECALIBRATION_COOLDOWN_MS) {
    return false;
  }

  return false;
}

/**
 * Fetch remote device profile from Supabase for authenticated user.
 */
export async function fetchRemoteDeviceProfile(userId, deviceId) {
  if (!userId || !deviceId) return null;
  const client = await getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('user_device_profiles')
      .select('*')
      .eq('user_id', userId)
      .eq('device_id', deviceId)
      .maybeSingle();

    if (error) {
      // If table doesn't exist yet or network error, silently fall back to local
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      deviceId: data.device_id,
      mode: data.performance_mode,
      manualOverride: data.manual_override || 'automatic',
      capabilities: data.capabilities,
      algorithmVersion: data.algorithm_version,
      reason: data.classification_reason,
      lastAssessedAt: new Date(data.last_assessed_at).getTime(),
      updatedAt: new Date(data.updated_at).getTime()
    };
  } catch (err) {
    console.warn('[Revoraa Perf] Failed to fetch remote device profile:', err);
    return null;
  }
}

/**
 * Persist device profile to Supabase.
 * Uses upsert RPC or direct table upsert.
 */
export async function persistDeviceProfileToRemote(userId, profile) {
  if (!userId || !profile || !profile.deviceId) return null;
  const client = await getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client.rpc('upsert_device_performance_profile', {
      p_device_id: profile.deviceId,
      p_performance_mode: profile.autoMode || profile.mode,
      p_manual_override: profile.manualOverride || 'automatic',
      p_capabilities: profile.capabilities || {},
      p_algorithm_version: PERFORMANCE_ALGORITHM_VERSION,
      p_classification_reason: profile.reason || 'Client assessment'
    });

    if (error) {
      // Fallback: direct upsert into table
      const { error: upsertErr } = await client
        .from('user_device_profiles')
        .upsert({
          user_id: userId,
          device_id: profile.deviceId,
          performance_mode: profile.autoMode || profile.mode,
          manual_override: profile.manualOverride || 'automatic',
          capabilities: profile.capabilities || {},
          algorithm_version: PERFORMANCE_ALGORITHM_VERSION,
          classification_reason: profile.reason || 'Client assessment',
          last_assessed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,device_id' });

      if (upsertErr) {
        console.warn('[Revoraa Perf] Direct upsert fallback error:', upsertErr);
      }
    }

    return data;
  } catch (err) {
    console.warn('[Revoraa Perf] Error persisting remote device profile:', err);
    return null;
  }
}
