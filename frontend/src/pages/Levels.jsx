import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AccentBar } from '../components/ui/AccentBar';
import { getProfileData } from '../lib/dataService';
import { useAuth } from '../contexts/AuthContext';

export const Levels = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (!user) return;
        const { stats } = await getProfileData(user.id);
        setStats(stats);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading || !stats) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  const currentLevel = stats.level ?? 1;
  const currentXp = stats.xp ?? 0;
  
  // Generate level list: 2 below, current, 2 above
  const levelList = Array.from({ length: 5 }, (_, i) => {
    const lvl = Math.max(1, currentLevel - 2) + i;
    const isCurrent = lvl === currentLevel;
    const isDone = lvl < currentLevel;
    const xpNeeded = (lvl - 1) * 500;
    
    let title = 'Apprentice';
    if (lvl >= 5) title = 'Practitioner';
    if (lvl >= 10) title = 'Intermediate';
    if (lvl >= 15) title = 'Advanced';
    if (lvl >= 20) title = 'Expert';
    if (lvl >= 30) title = 'Master';

    return { n: lvl, title, xpNeeded, done: isDone, current: isCurrent };
  });

  // Ensure unique levels if currentLevel < 3
  const uniqueLevels = levelList.filter((v, i, a) => a.findIndex(t => t.n === v.n) === i);

  return (
    <div>
      <header className="page-header">
        <h1>Levels & XP</h1>
        <p className="text-secondary">You are currently at <span style={{ color: 'var(--color-xp)', fontWeight: 600 }}>Level {currentLevel} · {currentXp.toLocaleString()} XP</span>.</p>
      </header>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {uniqueLevels.map(({ n, title, xpNeeded, done, current }) => (
          <motion.div 
            key={n} 
            initial={{ opacity: 0, x: -12 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: n * 0.04 }} 
            className="bento-card" 
            style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', border: current ? '1px solid rgba(249,115,22,0.35)' : undefined, position: 'relative' }}
          >
            {current && <AccentBar color="var(--color-xp)" />}
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: done ? 'rgba(34,197,94,0.12)' : current ? 'rgba(249,115,22,0.12)' : 'var(--color-bg-surface)', border: `1.5px solid ${done ? 'var(--color-strong)' : current ? 'var(--color-xp)' : 'var(--color-border-subtle)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '0.875rem', color: done ? 'var(--color-strong)' : current ? 'var(--color-xp)' : 'var(--color-text-muted)' }}>
              {done ? '✓' : n}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ marginBottom: 0 }}>Level {n} – {title}</h3>
                <span className="text-muted text-sm">{xpNeeded.toLocaleString()} XP</span>
              </div>
            </div>
            {current && <span className="badge badge-warning">Current</span>}
            {done    && <span className="badge badge-success">Done</span>}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
