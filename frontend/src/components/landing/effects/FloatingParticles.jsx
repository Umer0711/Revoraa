import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAdaptivePerformance } from '../../../contexts/AdaptivePerformanceContext';

export const FloatingParticles = () => {
  const { effects, isHighQuality } = useAdaptivePerformance();
  const particleCount = effects?.particlesCount ?? 10;

  // Generate random particles based on adaptive count
  const particles = useMemo(() => {
    if (particleCount <= 0) return [];
    return Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: Math.random() * 100, // percentage
      size: Math.random() * 3 + 1, // 1 to 4px
      duration: Math.random() * 20 + 20, // 20s to 40s
      delay: Math.random() * -20 // random negative delay so they don't all start at once
    }));
  }, [particleCount]);

  // Completely unmount on efficiency mode or reduced motion
  if (particleCount <= 0 || particles.length === 0) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ 
            opacity: 0.1, 
            x: `${p.x}vw`, 
            y: `${p.y}vh`,
            scale: 0.5
          }}
          animate={{
            opacity: [0.1, 0.4, 0.1],
            y: [`${p.y}vh`, `${p.y - 15}vh`],
            x: [`${p.x}vw`, `${p.x + (Math.random() * 10 - 5)}vw`],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: '#f59e0b',
            boxShadow: isHighQuality ? '0 0 10px rgba(245, 158, 11, 0.8)' : 'none',
            transform: 'translate3d(0,0,0)' // GPU accel
          }}
        />
      ))}
    </div>
  );
};
