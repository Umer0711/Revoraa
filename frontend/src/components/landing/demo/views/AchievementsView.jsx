import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Crown } from 'lucide-react';
import { useDemoContext } from '../DemoContext';

export const AchievementsView = ({ step }) => {
  const { registerRef } = useDemoContext();
  const [xp, setXp] = useState(850);
  const [level, setLevel] = useState(11);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (step === 1) {
      const runLevelUp = async () => {
        // Fast fill
        for (let i = 850; i <= 1000; i += 15) {
          if (!isMounted) return;
          setXp(Math.min(i, 1000));
          await new Promise(r => setTimeout(r, 10));
        }
        await new Promise(r => setTimeout(r, 100));
        if (!isMounted) return;
        
        setLevel(12);
        setShowConfetti(true);
        setXp(0);
      };
      runLevelUp();
    } else {
      setXp(850);
      setLevel(11);
      setShowConfetti(false);
    }
    return () => { isMounted = false; };
  }, [step]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Confetti Particles */}
      {showConfetti && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1, x: 250, y: 250, scale: 0 }}
              animate={{ 
                opacity: 0, 
                x: 250 + (Math.random() - 0.5) * 600, 
                y: 250 + (Math.random() - 0.5) * 600,
                scale: Math.random() * 1.5 + 0.5,
                rotate: Math.random() * 360
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ position: 'absolute', width: 10, height: 10, background: ['#f59e0b', '#10b981', '#ef4444', '#3b82f6'][Math.floor(Math.random() * 4)], borderRadius: '2px' }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 0 || (step === 1 && level === 11) ? (
          <motion.div 
            key="playing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}
          >
            <Trophy size={48} color="#f59e0b" style={{ marginBottom: '1rem', filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.4))' }} />
            
            <h3 style={{ margin: '0 0 0.5rem', color: '#fff', fontSize: '1.5rem', fontWeight: 800 }}>Level {level}</h3>
            <p style={{ margin: '0 0 2rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Algorithm Explorer</p>

            <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', height: '16px', position: 'relative', overflow: 'hidden', marginBottom: '1rem' }}>
              <motion.div 
                style={{ height: '100%', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', borderRadius: '999px' }}
                initial={{ width: `${(850 / 1000) * 100}%` }}
                animate={{ width: `${(xp / 1000) * 100}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
            
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2rem' }}>
              <span>{xp} XP</span>
              <span>1000 XP</span>
            </div>

            <div 
              ref={registerRef('btn-claim-reward')}
              style={{ 
                width: '100%', 
                background: step === 1 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)', 
                color: '#f59e0b', 
                border: '1px solid rgba(245, 158, 11, 0.3)', 
                padding: '1rem', 
                borderRadius: '12px', 
                fontSize: '1rem', 
                fontWeight: 700, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '0.5rem',
                transform: step === 1 ? 'scale(0.95)' : 'scale(1)',
                transition: 'all 0.1s',
                opacity: step === 1 ? 0.5 : 1
              }}
            >
              <Star size={18} fill="#f59e0b" /> Claim 150 XP Reward
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="levelup"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, background: 'rgba(245, 158, 11, 0.05)', borderRadius: '24px', border: '1px solid rgba(245, 158, 11, 0.3)' }}
          >
            <motion.div animate={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 0.6 }}>
              <Crown size={64} color="#f59e0b" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.6))' }} />
            </motion.div>
            
            <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Level Up!</div>
            <h3 style={{ margin: '0 0 1rem', color: '#fff', fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>Level {level}</h3>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>Algorithm Master</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
