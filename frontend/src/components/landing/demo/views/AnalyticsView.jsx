import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const AnalyticsView = ({ step }) => {
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    let isMounted = true;
    if (step === 0) {
      setFilled(0);
      const fill = async () => {
        // slight delay before starting to fill
        await new Promise(r => setTimeout(r, 600));
        for (let i = 1; i <= 60; i += 2) {
          if (!isMounted) return;
          setFilled(i);
          await new Promise(r => setTimeout(r, 20));
        }
      };
      fill();
    }
    return () => { isMounted = false; };
  }, [step]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#fff' }}>Analytics</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '0.95rem' }}>Visualize your consistency and speed.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', flex: 1 }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: '#fff', fontSize: '1rem', margin: '0 0 1rem' }}>Activity Heatmap</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '4px', flex: 1 }}>
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div 
                key={i} 
                animate={{ background: i < filled ? 'rgba(16, 185, 129, 0.8)' : 'rgba(255,255,255,0.05)' }}
                style={{ borderRadius: '4px' }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Avg Time per Medium Problem</div>
            <motion.div 
              animate={{ color: filled > 50 ? '#10b981' : '#fff' }}
              style={{ fontSize: '2.5rem', fontWeight: 800 }}
            >
              {Math.max(14, 45 - Math.floor(filled / 2))}m
            </motion.div>
          </div>
          
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
             <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Patterns Mastered</div>
             <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#3b82f6' }}>12/15</div>
          </div>
        </div>
      </div>
    </div>
  );
};
