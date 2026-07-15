import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const RealtimeContext = createContext({ refreshKey: 0 });

export const useRealtime = () => useContext(RealtimeContext);

export const RealtimeProvider = ({ children }) => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Trigger a global refresh whenever a change occurs
    const triggerRefresh = (payload) => {
      console.log(`[Realtime] Event on ${payload.table}:`, payload.eventType);
      setRefreshKey(prev => prev + 1);
    };

    const channel = supabase.channel('global-refresh')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'solved_problems', filter: `user_id=eq.${user.id}` }, triggerRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_stats', filter: `user_id=eq.${user.id}` }, triggerRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_achievements', filter: `user_id=eq.${user.id}` }, triggerRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, triggerRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'analytics_daily', filter: `user_id=eq.${user.id}` }, triggerRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_pattern_stats', filter: `user_id=eq.${user.id}` }, triggerRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'revision_schedule', filter: `user_id=eq.${user.id}` }, triggerRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_inventory', filter: `user_id=eq.${user.id}` }, triggerRefresh)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <RealtimeContext.Provider value={{ refreshKey }}>
      {children}
    </RealtimeContext.Provider>
  );
};
