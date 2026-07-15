import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function WelcomeCelebration() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user) return;

    const hasSeenWelcome = localStorage.getItem(`revoraa_welcome_shown_${user.id}`);
    if (!hasSeenWelcome) {
      // Delay slightly for smooth entrance
      const timer = setTimeout(() => {
        setShow(true);
        // Play premium confetti
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#3b82f6', '#8b5cf6', '#ffffff']
          });
          confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#3b82f6', '#8b5cf6', '#ffffff']
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();

      }, 800);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleStart = () => {
    if (user) {
      localStorage.setItem(`revoraa_welcome_shown_${user.id}`, 'true');
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(9, 9, 11, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.2 }}
            className="bento-card liquid-glass"
            style={{
              maxWidth: 440,
              width: '100%',
              textAlign: 'center',
              padding: '3rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.4 }}
              style={{
                width: 64, height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.5rem',
                border: '1px solid rgba(139, 92, 246, 0.4)'
              }}
            >
              <Sparkles size={32} color="#8b5cf6" />
            </motion.div>

            <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem', color: '#fff' }}>Welcome to Revoraa</h1>
            <p className="text-secondary" style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Your interview journey starts today. Let's build long-term mastery together with spaced repetition and pattern recognition.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                display: 'flex',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(to right, var(--color-primary), #8b5cf6)',
                border: 'none',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
              }}
            >
              Start First Mission <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
