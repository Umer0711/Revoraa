import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getDeviceFingerprint, getBrowserInfo } from '../lib/fingerprint';
import { usePushNotifications } from '../lib/usePushNotifications';
import { getUserSettings, updateUserTimezone } from '../lib/dataService';

const AuthContext = createContext({});

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
      updateUserTimezone(user.id).catch(console.error);
    }
  }, [user?.id]);

  return children;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData(uid) {
      if (!uid) {
        setProfile(null);
        setSubscriptionData(null);
        setUsageData(null);
        return;
      }
      
      const [profileRes, subRes, usageRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('auth_id', uid).maybeSingle(),
        supabase.from('subscriptions').select('*').eq('user_id', uid).maybeSingle(),
        supabase.from('solved_problems').select('id', { count: 'exact', head: true }).eq('user_id', uid).gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      ]);
      
      let profileData = profileRes.data;
      let subData = subRes.data;

      // 🛡️ Auto-Recovery: If user isn't Pro, check if they have a pending successful payment
      if (profileData && (!profileData.is_pro || new Date(profileData.expires_at) < new Date())) {
        await syncSubscription(uid);
      }

      if (profileData) {
        setProfile(profileData);
        setUsageData({
          problems_added_this_month: profileData.monthly_problem_usage || 0,
          monthly_problem_limit: profileData.monthly_problem_limit || 15,
          usage_reset_date: profileData.usage_reset_date
        });
      }
      if (subData) setSubscriptionData(subData);
    }


    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      await fetchUserData(session?.user?.id);
      
      if (session?.user) {
        import('@sentry/react').then(Sentry => Sentry.setUser({ id: session.user.id, email: session.user.email }));
        import('posthog-js').then(ph => ph.default.identify(session.user.id, { email: session.user.email }));
        
        supabase.rpc('register_device', {
          p_fingerprint: getDeviceFingerprint(),
          p_browser_info: getBrowserInfo(),
          p_os_info: navigator.platform
        }).then(({ error }) => { if(error) console.error(error) });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      await fetchUserData(session?.user?.id);
      
      if (session?.user) {
        import('@sentry/react').then(Sentry => Sentry.setUser({ id: session.user.id, email: session.user.email }));
        import('posthog-js').then(ph => ph.default.identify(session.user.id, { email: session.user.email }));
      } else {
        import('@sentry/react').then(Sentry => Sentry.setUser(null));
        import('posthog-js').then(ph => ph.default.reset());
      }
      
      setLoading(false);
    });

    let deviceChannel, subChannel, profileChannel, usageChannel;
    
    if (session?.user) {
      deviceChannel = supabase.channel(`device:${session.user.id}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'device_sessions', filter: `user_id=eq.${session.user.id}` }, (payload) => {
          if (payload.new.device_fingerprint !== getDeviceFingerprint()) {
            alert('Your account was signed in from another device. You have been logged out.');
            supabase.auth.signOut();
          }
        }).subscribe();
        
      subChannel = supabase.channel(`sub:${session.user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'subscriptions', filter: `user_id=eq.${session.user.id}` }, (payload) => {
          setSubscriptionData(payload.new);
        }).subscribe();
        
      profileChannel = supabase.channel(`profile:${session.user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `auth_id=eq.${session.user.id}` }, (payload) => {
          setProfile(payload.new);
        }).subscribe();
        
      usageChannel = supabase.channel(`usage:${session.user.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'solved_problems', filter: `user_id=eq.${session.user.id}` }, () => {
          // Re-fetch the user data to update the problem count when a new problem is solved
          fetchUserData(session.user.id);
        }).subscribe();
    }

    return () => {
      subscription.unsubscribe();
      if (deviceChannel) supabase.removeChannel(deviceChannel);
      if (subChannel) supabase.removeChannel(subChannel);
      if (profileChannel) supabase.removeChannel(profileChannel);
      if (usageChannel) supabase.removeChannel(usageChannel);
    };
  }, [session?.user?.id]); // depend on session.user.id so realtime channels attach correctly after login

  const syncSubscription = async (uid = user?.id) => {
    if (!uid) return false;
    try {
      const { data: recData } = await supabase.rpc('recover_my_subscription');
      if (recData?.success) {
        const { data: refreshedProfile } = await supabase.from('profiles').select('*').eq('auth_id', uid).single();
        if (refreshedProfile) setProfile(refreshedProfile);
        
        const { data: refreshedSub } = await supabase.from('subscriptions').select('*').eq('user_id', uid).maybeSingle();
        if (refreshedSub) setSubscriptionData(refreshedSub);
        
        return true;
      }
    } catch (e) {
      console.error("Subscription auto-recovery check failed", e);
    }
    return false;
  };

  const value = {
    session,
    user,
    profile,
    subscriptionData,
    usageData,
    loading,
    syncSubscription,
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
