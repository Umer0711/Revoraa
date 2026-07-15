import React from 'react';
import { motion } from 'framer-motion';

export const StoryCursor = ({ x, y, isClicking, show }) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, x, y, scale: isClicking ? 0.9 : 1 }}
      transition={{ 
        x: { type: 'spring', stiffness: 100, damping: 25, mass: 1 }, 
        y: { type: 'spring', stiffness: 100, damping: 25, mass: 1 }, 
        scale: { duration: 0.1 },
        opacity: { duration: 0.3 }
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 32,
        height: 32,
        pointerEvents: 'none',
        zIndex: 9999,
        marginLeft: -4,
        marginTop: -4
      }}
    >
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10.5 5.5L22.5 17.5L16.5 18.5L20 25.5L17.5 27L14 20L9.5 24.5V5.5Z"
          fill="rgba(0, 0, 0, 0.9)"
          stroke="white"
          strokeWidth="2.5"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.4))' }}
        />
      </svg>
      {isClicking && (
        <motion.div
          initial={{ scale: 0.2, opacity: 1 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            position: 'absolute',
            top: 4,
            left: 4,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)',
            pointerEvents: 'none'
          }}
        />
      )}
    </motion.div>
  );
};
