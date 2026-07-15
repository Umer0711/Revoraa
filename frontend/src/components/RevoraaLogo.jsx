import React from 'react';
import { motion } from 'framer-motion';

export const RevoraaLogo = ({ size = 24, color = "currentColor", style = {}, ...props }) => {
  return (
    <motion.div 
      style={{ 
        position: 'relative', 
        width: size, 
        height: size, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        ...style 
      }}
      initial={{ scale: 0.97 }}
      animate={{ scale: [0.97, 1.03, 0.97] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      {...props}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="amber-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#f59e0b" stopOpacity="0" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="glass-reflect" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Base Layer - Tech Geometric R */}
        <g stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Top Loop */}
          <path d="M 8 28 L 8 12 L 16 4 L 24 12 L 16 20 L 8 20" />
          {/* Leg */}
          <path d="M 16 20 L 24 28" />
        </g>

        {/* Glass Reflection Highlight */}
        <g stroke="url(#glass-reflect)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ mixBlendMode: 'overlay' }}>
          <path d="M 8 28 L 8 12 L 16 4 L 24 12 L 16 20 L 8 20" />
          <path d="M 16 20 L 24 28" />
        </g>

        {/* Animated Amber Light Sweep */}
        <motion.g stroke="url(#amber-glow)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <motion.path 
            d="M 8 28 L 8 12 L 16 4 L 24 12 L 16 20 L 8 20"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.6, 1] }}
          />
          <motion.path 
            d="M 16 20 L 24 28"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.6, 1], delay: 0.2 }}
          />
        </motion.g>
      </svg>
      
      {/* Soft backing glow */}
      <motion.div 
        animate={{ opacity: [0.15, 0.4, 0.15], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: size * 1.8,
          height: size * 1.8,
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 60%)',
          transform: 'translate(-50%, -50%)',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />
    </motion.div>
  );
};
