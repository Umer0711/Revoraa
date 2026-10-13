import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useAdaptivePerformance } from '../../../contexts/AdaptivePerformanceContext';

export const AmbientCursor = () => {
  const { isEfficiency, isHighQuality, capabilities } = useAdaptivePerformance();
  const isTouch = capabilities?.isTouch || false;

  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  const [isLight, setIsLight] = useState(
    () => typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light'
  );

  // Soft spring for organic feel
  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 40, mass: 2 });
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 40, mass: 2 });

  useEffect(() => {
    // Skip event listener if efficiency or touch
    if (isEfficiency || isTouch) return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, isEfficiency, isTouch]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // 1. Efficiency mode or touch screen: completely disable
  if (isEfficiency || isTouch) {
    return null;
  }

  const gradient = isLight
    ? 'radial-gradient(circle at center, rgba(180, 83, 9, 0.04) 0%, rgba(180, 83, 9, 0.01) 40%, transparent 70%)'
    : 'radial-gradient(circle at center, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.02) 40%, transparent 70%)';

  const size = isLight ? 400 : 600;

  // 2. Balanced mode: static ambient gradient (no high-frequency spring updates)
  if (!isHighQuality) {
    return (
      <div
        style={{
          position: 'fixed',
          left: '50%',
          top: '30%',
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          background: gradient,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          filter: `blur(${isLight ? 40 : 30}px)`,
          transform: 'translate3d(0,0,0)'
        }}
      />
    );
  }

  // 3. High quality mode: full dynamic spring cursor
  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: smoothX,
        y: smoothY,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        background: gradient,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0,
        filter: `blur(${isLight ? 70 : 50}px)`,
        transform: 'translate3d(0,0,0)'
      }}
    />
  );
};
