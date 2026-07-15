import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AccentBar } from '../components/ui/AccentBar';
import { getAllAchievementsData } from '../lib/dataService';
import { useAuth } from '../contexts/AuthContext';
import { useRealtime } from '../contexts/RealtimeContext';
import { SEO } from '../components/SEO';


export const Achievements = () => {
  const { user } = useAuth();
  const { refreshKey } = useRealtime();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (!user) return;
        const data = await getAllAchievementsData(user.id);
        setAchievements(data);
      } catch (err) {
        console.error('Failed to load achievements:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, refreshKey]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const remainingCount = achievements.length - unlockedCount;

  return (
    <div>
      <SEO title="Achievements" url="https://revoraa.com/achievements" />
      <header className="page-header">
        <h1>Achievements</h1>
        <p className="text-secondary">
          <span style={{ color: 'var(--color-achievement)', fontWeight: 600 }}>{unlockedCount}</span> unlocked · <span className="text-muted">{remainingCount} remaining</span>
        </p>
      </header>
      
      <div className="bento-grid">
        {achievements.map((achievement, i) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bento-card col-span-2"
            style={{ opacity: achievement.unlocked ? 1 : 0.45, position: 'relative', textAlign: 'center', padding: '2rem' }}
          >
            {achievement.unlocked && <AccentBar color="var(--color-achievement)" />}
            <motion.div
              animate={achievement.unlocked ? { rotate: [0, 8, -8, 0] } : {}}
              transition={{ repeat: Infinity, duration: 5, delay: i * 0.4 }}
              style={{ fontSize: '2.5rem', marginBottom: '0.75rem', display: 'block' }}
            >
              {achievement.badge_icon}
            </motion.div>
            <h3 style={{ marginBottom: '0.35rem' }}>{achievement.title}</h3>
            <p className="text-muted text-sm" style={{ marginBottom: '0.875rem' }}>{achievement.description}</p>
            <span className={`badge ${achievement.unlocked ? 'badge-pink' : ''}`} style={{ margin: '0 auto' }}>
              {achievement.unlocked ? `+${achievement.xp_reward} XP` : `${achievement.xp_reward} XP locked`}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
