import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { authConfig } from '../lib/config';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: authConfig.passwordResetUrl,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSubmitted(true);
  };

  return (
    <AuthLayout>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: '400px', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', padding: '3rem 2.5rem', borderRadius: '24px', border: '1px solid var(--color-border-subtle)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <KeyRound size={24} color="#fff" />
                  </div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff', letterSpacing: '-0.02em' }}>Reset password</h2>
                  <p className="text-secondary" style={{ fontSize: '0.95rem' }}>Enter your email and we'll send a recovery link.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="input-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border-subtle)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-border-subtle)'}
                    />
                  </div>

                  {error && (
                    <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      {error}
                    </div>
                  )}

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    style={{ padding: '0.875rem', marginTop: '0.5rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#000', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'Sending…' : 'Send recovery link'}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', width: 64, height: 64, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-success) 15%, transparent)', color: 'var(--color-success)', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <Mail size={32} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>Check your email</h2>
                <p className="text-secondary" style={{ fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>We've sent a password recovery link to <strong>{email}</strong>.</p>
                
                <Link to="/login" style={{ padding: '0.875rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '1rem', fontWeight: 600, background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                  Back to log in
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {!submitted && (
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
              <ArrowLeft size={16} /> Back to log in
            </Link>
          )}
        </motion.div>
      </div>
    </AuthLayout>
  );
};
