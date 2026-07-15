import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { claimDailyMissionReward } from '../lib/dataService';
import { useAuth } from '../contexts/AuthContext';
import { useRealtime } from '../contexts/RealtimeContext';

export const Missions = () => {
  const { user } = useAuth();
  const { refreshKey } = useRealtime();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (!user) return;
        
        // Fetch today's analytics_daily record
        const today = new Date().toISOString().split('T')[0];
        const { data: analytics } = await supabase
          .from('analytics_daily')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today)
          .single();

        const solvedCount = analytics?.solved || 0;
        const revisionsCount = analytics?.revised || 0;
        
        // Load claims from localStorage
        const claimsKey = `missions_claimed_${user.id}_${today}`;
        let claimed = {};
        try {
          claimed = JSON.parse(localStorage.getItem(claimsKey) || '{}');
        } catch (e) {}

        const dailyMissions = [
          { id: 'm1', title: 'Solve 1 Hard problem',   xp: 100, done: solvedCount >= 1,     icon: '⚔️' }, // simplified requirement
          { id: 'm2', title: 'Complete 3 revisions',   xp: 75,  done: revisionsCount >= 3,  icon: '🔁' },
          { id: 'm3', title: 'Solve 2 problems today', xp: 60,  done: solvedCount >= 2,     icon: '📦' },
          { id: 'm4', title: 'Study a new pattern',    xp: 80,  done: solvedCount >= 1,     icon: '📖' },
        ].map(m => ({
          ...m,
          claimed: !!claimed[m.id]
        }));

        setMissions(dailyMissions);
      } catch (err) {
        console.error('Failed to load missions:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, refreshKey]);

  const handleClaim = async (mission) => {
    if (!mission.done || mission.claimed) return;
    
    try {
      await claimDailyMissionReward(user.id, mission.id, mission.xp, 10, mission.title);
      
      const today = new Date().toISOString().split('T')[0];
      const claimsKey = `missions_claimed_${user.id}_${today}`;
      const claimed = JSON.parse(localStorage.getItem(claimsKey) || '{}');
      claimed[mission.id] = true;
      localStorage.setItem(claimsKey, JSON.stringify(claimed));
      
      setMissions(prev => prev.map(m => m.id === mission.id ? { ...m, claimed: true } : m));
    } catch (err) {
      console.error('Failed to claim reward:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <header className="page-header">
        <h1>Daily Missions</h1>
        <p className="text-secondary">Complete missions to earn XP and coins.</p>
      </header>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {missions.map((mission, i) => {
          const { id, title, xp, done, claimed, icon } = mission;
          return (
            <motion.div 
              key={id} 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.08 }} 
              whileHover={{ x: 4 }} 
              className="bento-card" 
              style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', opacity: claimed ? 0.6 : 1 }}
            >
              <span style={{ fontSize: '1.5rem' }}>{icon}</span>
              <div style={{ flex: 1 }}>
                <h3 style={{ textDecoration: claimed ? 'line-through' : 'none', color: claimed ? 'var(--color-text-muted)' : undefined, marginBottom: 0 }}>
                  {title}
                </h3>
              </div>
              
              {!claimed ? (
                <button 
                  onClick={() => handleClaim(mission)}
                  disabled={!done}
                  className={`btn ${done ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                >
                  {done ? 'Claim' : `${xp} XP`}
                </button>
              ) : (
                <CheckCircle2 size={18} color="var(--color-strong)" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
