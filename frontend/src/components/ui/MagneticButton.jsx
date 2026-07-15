import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const MagneticButton = ({ children, className = '', style = {}, ...props }) => {
  const ref = useRef(null);
  
  const [isHovered, setIsHovered] = useState(false);
  
  // Track raw mouse position relative to center of button
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth the raw position using a spring
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // Map the smoothed mouse position to movement bounds
  const xContent = useTransform(smoothX, [-1, 1], [-5, 5]);
  const yContent = useTransform(smoothY, [-1, 1], [-5, 5]);
  
  // Glow position tracks exactly with the mouse but smoothed
  const xGlow = useTransform(smoothX, [-1, 1], ['-20%', '120%']);
  const yGlow = useTransform(smoothY, [-1, 1], ['-20%', '120%']);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate distance from center, normalized to [-1, 1]
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const xPos = (e.clientX - centerX) / (rect.width / 2);
    const yPos = (e.clientY - centerY) / (rect.height / 2);

    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.875rem 1.5rem',
        borderRadius: '12px',
        fontWeight: 600,
        fontSize: '1rem',
        background: 'var(--color-bg-elevated)',
        color: 'var(--color-text)',
        border: '1px solid rgba(255,255,255,0.1)',
        cursor: 'pointer',
        overflow: 'hidden',
        outline: 'none',
        ...style
      }}
      className={className}
      {...props}
    >
      {/* Magnetic Background Glow */}
      <motion.div
        style={{
          position: 'absolute',
          left: xGlow,
          top: yGlow,
          width: '50px',
          height: '50px',
          background: 'rgba(245, 158, 11, 0.4)',
          filter: 'blur(30px)',
          transform: 'translate(-50%, -50%)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      />
      
      {/* Button Content with magnetic pull */}
      <motion.div
        style={{
          x: xContent,
          y: yContent,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 1
        }}
      >
        {children}
      </motion.div>
    </motion.button>
  );
};
