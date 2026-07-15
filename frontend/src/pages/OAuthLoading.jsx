import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { GitMerge, Mail } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';

export const OAuthLoading = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const provider = location.state?.provider || 'Provider';
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    // Simulate OAuth connection sequence
    const timers = [
      setTimeout(() => setLoadingStep(1), 1500),
      setTimeout(() => setLoadingStep(2), 3000),
      setTimeout(() => {
        // Mock success/fail based on a random chance, but let's just assume success for this flow.
        navigate('/auth/success');
      }, 4500)
    ];
    return () => timers.forEach(clearTimeout);
  }, [navigate]);

  const loadingMessages = [
    `Connecting to ${provider}...`,
    'Verifying account details...',
    'Preparing your workspace...'
  ];

  return (
    <AuthLayout>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ width: '100%', maxWidth: '400px', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', padding: '4rem 2.5rem', borderRadius: '24px', border: '1px solid var(--color-border-subtle)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', textAlign: 'center' }}
        >
          <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 2rem' }}>
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{ position: 'absolute', inset: 0, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', borderRadius: '50%' }}
            />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {provider === 'GitHub' ? <GitMerge size={32} color="#fff" /> : <Mail size={32} color="#fff" />}
            </div>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff', marginBottom: '1rem', height: 28 }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={loadingStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'block' }}
              >
                {loadingMessages[loadingStep]}
              </motion.span>
            </AnimatePresence>
          </h2>
          <p className="text-secondary" style={{ fontSize: '0.95rem' }}>Please wait while we securely log you in.</p>
        </motion.div>
      </div>
    </AuthLayout>
  );
};
