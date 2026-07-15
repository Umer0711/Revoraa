import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AccentBar } from '../components/ui/AccentBar';
import { getAnalyticsData } from '../lib/dataService';
import { useAuth } from '../contexts/AuthContext';
import { useRealtime } from '../contexts/RealtimeContext';
import { supabase } from '../lib/supabaseClient';

export const Patterns = () => {
  const { user } = useAuth();
  const { refreshKey } = useRealtime();
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatterns = async () => {
    try {
      if (!user) return;
      const data = await getAnalyticsData(user.id);
      
      const formatted = data.topPatterns.map(p => ({
        name: p.category,
        count: p.count,
        mastery: p.accuracy
      }));
      
      setPatterns(formatted);
    } catch (err) {
      console.error('Failed to load patterns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatterns();

    if (!user) return;
    const channel = supabase
      .channel(`patterns:${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_pattern_stats',
        filter: `user_id=eq.${user.id}`,
      }, () => fetchPatterns())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user, refreshKey]);

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
        <h1>Patterns</h1>
        <p className="text-secondary">Algorithmic pattern mastery built from your solved problems.</p>
      </header>
      
      {patterns.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
          <p className="text-secondary">Solve problems to discover your pattern mastery.</p>
        </div>
      ) : (
        <div className="bento-grid">
          {patterns.map(({ name, count, mastery }, i) => {
            const color = mastery >= 80 ? 'var(--color-strong)' : mastery >= 60 ? 'var(--color-readiness)' : 'var(--color-weak)';
            return (
              <motion.div 
                key={name} 
                initial={{ opacity: 0, y: 16 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.06 }} 
                whileHover={{ y: -3 }} 
                className="bento-card col-span-2" 
                style={{ position: 'relative' }}
              >
                <AccentBar color={color} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                  <div>
                    <h3 style={{ marginBottom: 0 }}>{name}</h3>
                    <span className="text-muted text-xs">{count} problems solved</span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '1.25rem', color, letterSpacing: '-0.03em' }}>{mastery}%</span>
                </div>
                <div className="progress-track">
                  <motion.div 
                    className="progress-fill" 
                    initial={{ width: 0 }} 
                    animate={{ width: `${mastery}%` }} 
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} 
                    style={{ background: color }} 
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
