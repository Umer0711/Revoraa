import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';

export const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <AuthLayout>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ width: '100%', maxWidth: '400px', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', padding: '4rem 2.5rem', borderRadius: '24px', border: '1px solid var(--color-border-subtle)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', textAlign: 'center' }}
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
            style={{ display: 'inline-flex', width: 80, height: 80, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-success) 15%, transparent)', color: 'var(--color-success)', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}
          >
            <CheckCircle2 size={40} />
          </motion.div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Workspace Ready.</h2>
          <p className="text-secondary" style={{ fontSize: '1rem' }}>Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    </AuthLayout>
  );
};
