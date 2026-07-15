import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const AmbientCursor = () => {
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  const [isLight, setIsLight] = useState(
    () => document.documentElement.getAttribute('data-theme') === 'light'
  );

  // Very soft, highly damped spring for organic "studio light" feel
  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 40, mass: 2 });
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 40, mass: 2 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Light mode: much smaller, much lower opacity — amber used only as a faint accent
  const gradient = isLight
    ? 'radial-gradient(circle at center, rgba(180, 83, 9, 0.04) 0%, rgba(180, 83, 9, 0.01) 40%, transparent 70%)'
    : 'radial-gradient(circle at center, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.02) 40%, transparent 70%)';

  const size = isLight ? 500 : 800;

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
        filter: `blur(${isLight ? 80 : 60}px)`,
        transform: 'translate3d(0,0,0)'
      }}
    />
  );
};
