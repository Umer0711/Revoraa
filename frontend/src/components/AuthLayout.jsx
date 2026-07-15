import React from 'react';
import { motion } from 'framer-motion';

export const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout" style={{ position: 'relative', minHeight: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--color-bg-base)' }}>
      {/* Animated Background Elements - Removed excessive purple, using deep slate & subtle neutral mesh */}
      <div className="auth-bg-elements" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <motion.div 
          className="bg-blob"
          style={{
            position: 'absolute', top: '-20%', left: '10%', width: '40vw', height: '40vw',
            background: 'rgba(255, 255, 255, 0.03)', filter: 'blur(100px)', borderRadius: '50%'
          }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div 
          className="bg-blob"
          style={{
            position: 'absolute', bottom: '-20%', right: '10%', width: '40vw', height: '40vw',
            background: 'rgba(255, 255, 255, 0.02)', filter: 'blur(100px)', borderRadius: '50%'
          }}
          animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, transparent 0%, var(--color-bg-base) 100%)', opacity: 0.9 }} />
        {/* Subtle grid pattern for texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', opacity: 0.5, maskImage: 'linear-gradient(to bottom, black 20%, transparent 80%)', WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 80%)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
};
