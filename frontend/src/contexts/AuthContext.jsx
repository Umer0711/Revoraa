import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getDeviceFingerprint, getBrowserInfo } from '../lib/fingerprint';
import { usePushNotifications } from '../lib/usePushNotifications';

const AuthContext = createContext({});

import { getUserSettings, updateUserTimezone } from '../lib/dataService';

// Inner component so hooks can use user state
function AuthConsumer({ user, children }) {
  usePushNotifications(user?.id ?? null);
  
  useEffect(() => {
    if (user?.id) {
      getUserSettings(user.id).then(settings => {
        if (settings?.theme) {
          document.documentElement.setAttribute('data-theme', settings.theme === 'light' ? 'light' : 'dark');
          localStorage.setItem('revoraa_theme', settings.theme);
        }
      }).catch(console.error);

      // Sync local timezone
      updateUserTimezone(user.id).catch(console.error);
    }
  }, [user?.id]);

  return children;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile(uid) {
      if (!uid) {
        setProfile(null);
        return;
      }
      const { data } = await supabase.from('profiles').select('*').eq('auth_id', uid).single();
      setProfile(data);
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      await fetchProfile(session?.user?.id);
      if (session?.user) {
        await supabase.rpc('register_device', {
          p_fingerprint: getDeviceFingerprint(),
          p_browser_info: getBrowserInfo(),
          p_os_info: navigator.platform
        });
      }
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      await fetchProfile(session?.user?.id);
      setLoading(false);
    });

    
    // Device Session Enforcement via Realtime
    let deviceChannel;
    if (session?.user) {
      deviceChannel = supabase
        .channel(`device:${session.user.id}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'device_sessions',
          filter: `user_id=eq.${session.user.id}`
        }, (payload) => {
          if (payload.new.device_fingerprint !== getDeviceFingerprint()) {
            alert('Your account was signed in from another device. You have been logged out.');
            supabase.auth.signOut();
          }
        })
        .subscribe();
    }

    return () => {
      subscription.unsubscribe();
      if (deviceChannel) supabase.removeChannel(deviceChannel);
    };
  }, []);

  const value = {
    session,
    user,
    profile,
    loading,
    signOut: () => supabase.auth.signOut(),
    refreshProfile: async () => {
      if (user?.id) {
        const { data } = await supabase.from('profiles').select('*').eq('auth_id', user.id).single();
        setProfile(data);
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && (
        <AuthConsumer user={user}>
          {children}
        </AuthConsumer>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
