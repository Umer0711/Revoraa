import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Zap } from 'lucide-react';
import { useAdaptivePerformance } from '../../contexts/AdaptivePerformanceContext';

export function GlobalCelebrations() {
  const [levelUp, setLevelUp] = useState(null);
  const [achievement, setAchievement] = useState(null);
  const { isEfficiency, isHighQuality, reducedMotion } = useAdaptivePerformance();

  useEffect(() => {
    const handleLevelUp = (e) => {
      const { level, coins } = e.detail;
      setLevelUp({ level, coins });
      
      // If user prefers reduced motion or efficiency mode: single brief burst
      if (reducedMotion || isEfficiency) {
        confetti({
          particleCount: 15,
          spread: 45,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ffffff']
        });
      } else if (!isHighQuality) {
        // Balanced: single 40-particle dual burst
        confetti({
          particleCount: 20,
          angle: 60,
          spread: 45,
          origin: { x: 0.1 },
          colors: ['#f59e0b', '#fbbf24', '#ffffff']
        });
        confetti({
          particleCount: 20,
          angle: 120,
          spread: 45,
          origin: { x: 0.9 },
          colors: ['#f59e0b', '#fbbf24', '#ffffff']
        });
      } else {
        // High quality: full 1.5s rAF burst
        const duration = 1500;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#f59e0b', '#fbbf24', '#ffffff']
          });
          confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#f59e0b', '#fbbf24', '#ffffff']
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();
      }

      setTimeout(() => setLevelUp(null), 3500);
    };

    const handleAchievement = (e) => {
      const ach = e.detail;
      setAchievement(ach);

      const count = (reducedMotion || isEfficiency) ? 15 : (!isHighQuality ? 35 : 80);
      confetti({
        particleCount: count,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f472b6', '#ffffff']
      });

      setTimeout(() => setAchievement(null), 4000);
    };

    window.addEventListener('LEVEL_UP', handleLevelUp);
    window.addEventListener('ACHIEVEMENT_UNLOCKED', handleAchievement);

    return () => {
      window.removeEventListener('LEVEL_UP', handleLevelUp);
      window.removeEventListener('ACHIEVEMENT_UNLOCKED', handleAchievement);
    };
  }, [isEfficiency, isHighQuality, reducedMotion]);

  return (
    <>
      {/* Level Up Celebration */}
      <AnimatePresence>
        {levelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <motion.div 
              initial={{ rotate: -180, scale: 0 }} 
              animate={{ rotate: 0, scale: 1 }} 
              transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05))',
                border: '2px solid rgba(245, 158, 11, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 40px rgba(245, 158, 11, 0.4)',
                marginBottom: '1rem',
                backdropFilter: 'blur(12px)'
              }}
            >
              <Zap size={64} color="#f59e0b" fill="#f59e0b" />
            </motion.div>
            
            <h1 style={{ fontSize: '3rem', margin: 0, textShadow: '0 0 20px rgba(245, 158, 11, 0.8)', color: '#fff' }}>
              Level {levelUp.level}
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem', marginTop: '0.5rem' }}>
              +{levelUp.coins} Coins
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Toast */}
      <AnimatePresence>
        {achievement && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 32, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            style={{
              position: 'fixed',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9998,
              pointerEvents: 'none',
              background: 'rgba(24, 24, 27, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset'
            }}
          >
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(236, 72, 153, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Trophy size={24} color="#ec4899" />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: '#ec4899', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Achievement Unlocked
              </p>
              <h3 style={{ margin: '0.2rem 0 0.3rem 0', fontSize: '1.1rem', color: '#fff' }}>
                {achievement.title}
              </h3>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                {achievement.xp_reward > 0 && <span>+{achievement.xp_reward} XP</span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
