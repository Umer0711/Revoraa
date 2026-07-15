import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { supabase } from '../lib/supabaseClient';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      alert(error.message);
      return;
    }
    setSubmitted(true);
    setTimeout(() => navigate('/dashboard'), 2500);
  };

  const getPasswordStrength = () => {
    const p = password;
    if (p.length === 0) return 0;
    if (p.length < 6) return 1;
    if (p.length >= 8 && /[A-Z]/.test(p) && /[0-9]/.test(p)) return 3;
    return 2;
  };

  const strength = getPasswordStrength();
  const strengthColors = ['rgba(255,255,255,0.1)', 'var(--color-mistakes)', 'var(--color-revision)', 'var(--color-strong)'];

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
                    <ShieldAlert size={24} color="#fff" />
                  </div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff', letterSpacing: '-0.02em' }}>Set new password</h2>
                  <p className="text-secondary" style={{ fontSize: '0.95rem' }}>Secure your account with a new password.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="input-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>New Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border-subtle)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-border-subtle)'}
                    />
                    <div style={{ display: 'flex', gap: '4px', marginTop: '0.75rem' }}>
                      {[1, 2, 3].map((level) => (
                        <div key={level} style={{ flex: 1, height: 4, borderRadius: 2, background: strength >= level ? strengthColors[strength] : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
                      ))}
                    </div>
                  </div>

                  <div className="input-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Confirm Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border-subtle)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-border-subtle)'}
                    />
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={password !== confirmPassword || password.length < 6}
                    style={{ padding: '0.875rem', marginTop: '0.5rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#000', border: 'none', cursor: (password !== confirmPassword || password.length < 6) ? 'not-allowed' : 'pointer', opacity: (password !== confirmPassword || password.length < 6) ? 0.5 : 1 }}
                  >
                    Reset Password
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', width: 64, height: 64, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-success) 15%, transparent)', color: 'var(--color-success)', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>Password reset</h2>
                <p className="text-secondary" style={{ fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>Your password has been successfully reset. Redirecting you to login...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AuthLayout>
  );
};
