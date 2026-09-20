import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const memoryStore = new Map<string, string>();

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key).catch(() => memoryStore.get(key) || null);
  },
  setItem: (key: string, value: string) => {
    memoryStore.set(key, value);
    return SecureStore.setItemAsync(key, value).catch(() => {});
  },
  removeItem: (key: string) => {
    memoryStore.delete(key);
    return SecureStore.deleteItemAsync(key).catch(() => {});
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
