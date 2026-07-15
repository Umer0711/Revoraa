import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';

export const OAuthFailed = () => {
  const navigate = useNavigate();

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
            style={{ display: 'inline-flex', width: 80, height: 80, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-mistakes) 15%, transparent)', color: 'var(--color-mistakes)', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}
          >
            <AlertCircle size={40} />
          </motion.div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Authentication Failed</h2>
          <p className="text-secondary" style={{ fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.5 }}>
            We couldn't securely log you in. This may happen if you cancelled the prompt or if the provider is unavailable.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              onClick={() => navigate('/login')}
              style={{ padding: '0.875rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#fff', color: '#000', border: 'none', cursor: 'pointer', width: '100%' }}
            >
              <RefreshCw size={18} /> Try Again
            </button>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </AuthLayout>
  );
};
