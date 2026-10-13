/**
 * Revoraa Adaptive Performance System — Database & Service API
 */

import { supabase } from './supabaseClient.js';
import {
  loadCachedProfile,
  saveCachedProfile,
  fetchRemoteDeviceProfile,
  persistDeviceProfileToRemote
} from './performance/index.js';

export async function getUserDeviceProfiles(userId) {
  if (!userId || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('user_device_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.warn('[Revoraa Perf] Failed to fetch device profiles:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('[Revoraa Perf] Exception fetching device profiles:', err);
    return [];
  }
}

export async function deleteUserDeviceProfile(userId, deviceId) {
  if (!userId || !deviceId || !supabase) return false;
  try {
    const { error } = await supabase
      .from('user_device_profiles')
      .delete()
      .eq('user_id', userId)
      .eq('device_id', deviceId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('[Revoraa Perf] Failed to delete device profile:', err);
    return false;
  }
}

export {
  loadCachedProfile,
  saveCachedProfile,
  fetchRemoteDeviceProfile,
  persistDeviceProfileToRemote
};
