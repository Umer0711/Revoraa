import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, GitMerge, Code2, ArrowLeft, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { AuthLayout } from '../components/AuthLayout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { authConfig } from '../lib/config';

export const SignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/dashboard';
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate(redirectUrl);
    }
  }, [user, navigate]);

  const handleNext = async (e) => {
    e.preventDefault();
    setError('');
    if (step === 1) { setStep(2); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }
    if (formData.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);

    // 1. Call secure backend validation first (Edge Function)
    const { data: valData, error: valError } = await supabase.functions.invoke('validate-email', {
      body: { email: formData.email }
    });

    if (valError || (valData && !valData.valid)) {
      setLoading(false);
      toast.error('Temporary email addresses are not supported.\nPlease sign up using your personal, work, or university email.', {
        style: {
          background: 'var(--color-bg-surface)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-mistakes)',
        },
        iconTheme: { primary: 'var(--color-mistakes)', secondary: '#fff' }
      });
      setError('Temporary email addresses are not allowed.');
      return;
    }

    // 2. Proceed with Supabase Auth (Trigger acts as fallback)
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { full_name: formData.name, username: formData.username },
      },
    });
    setLoading(false);
    
    if (error) { 
      // If Edge function somehow bypassed, or DB trigger throws 500
      if (error.message.includes('Temporary email') || error.message.includes('Database error saving new user')) {
        toast.error('Temporary email addresses are not supported.\nPlease sign up using your personal, work, or university email.', {
          style: {
            background: 'var(--color-bg-surface)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-mistakes)',
          },
          iconTheme: { primary: 'var(--color-mistakes)', secondary: '#fff' }
        });
        setError('Temporary email addresses are not allowed.');
      } else {
        setError(error.message); 
      }
      return; 
    }
    navigate(redirectUrl);
  };

  const handleOAuth = async (provider) => {
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: authConfig.oauthCallbackUrl },
    });
    if (error) setError(error.message);
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    if (p.length === 0) return 0;
    if (p.length < 6) return 1;
    if (p.length >= 8 && /[A-Z]/.test(p) && /[0-9]/.test(p)) return 3;
    return 2;
  };

  const strength = getPasswordStrength();
  const strengthColors = ['rgba(255,255,255,0.1)', 'var(--color-mistakes)', 'var(--color-revision)', 'var(--color-strong)'];

  return (
    <AuthLayout>
      <Toaster position="top-center" />
      <div style={{ flex: 1, display: 'flex', width: '100%', minHeight: '100vh' }}>
        
        {/* Left Side - Static/Animated Preview */}
        <div style={{ flex: 1, display: 'none', '@media (minWidth: 1024px)': { display: 'flex' }, padding: '4rem', flexDirection: 'column', position: 'relative' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', zIndex: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={18} color="#000" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>Revoraa</span>
          </Link>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
              style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '2rem' }}
            >
              <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>Join thousands of engineers landing offers.</h1>
              <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)' }}>Master data structures, algorithms, and system design through spaced repetition.</p>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>A</div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>G</div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>M</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Auth Card */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)', borderLeft: '1px solid var(--color-border-subtle)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', maxWidth: '400px', position: 'relative' }}
          >
            {step === 2 && (
              <button 
                onClick={() => setStep(1)} 
                style={{ position: 'absolute', top: '-3rem', left: '-1rem', background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}

            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff', letterSpacing: '-0.02em' }}>Create account</h2>
              <p className="text-secondary" style={{ fontSize: '1rem' }}>Start your journey to interview readiness.</p>
            </div>

            <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                      <motion.button type="button" onClick={() => handleOAuth('GitHub')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-ghost" style={{ padding: '0.875rem', borderRadius: '12px', border: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '0.95rem', fontWeight: 500, color: '#fff' }}>
                        <GitMerge size={18} /> Sign up with GitHub
                      </motion.button>
                      <motion.button type="button" onClick={() => handleOAuth('Google')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-ghost" style={{ padding: '0.875rem', borderRadius: '12px', border: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '0.95rem', fontWeight: 500, color: '#fff' }}>
                        <Mail size={18} /> Sign up with Google
                      </motion.button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0', gap: '1rem' }}>
                      <div style={{ height: 1, flex: 1, background: 'var(--color-border-subtle)' }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>or register with email</span>
                      <div style={{ height: 1, flex: 1, background: 'var(--color-border-subtle)' }} />
                    </div>

                    <div className="input-group">
                      <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                        required
                        style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border-subtle)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' }}
                        onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
                        onBlur={e => e.target.style.borderColor = 'var(--color-border-subtle)'}
                      />
                    </div>
                    
                    <div className="input-group">
                      <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="name@example.com"
                        required
                        style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border-subtle)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' }}
                        onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
                        onBlur={e => e.target.style.borderColor = 'var(--color-border-subtle)'}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="input-group">
                      <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Username</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>@</span>
                        <input 
                          type="text" 
                          value={formData.username}
                          onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})}
                          placeholder="johndoe"
                          required
                          style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border-subtle)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' }}
                          onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
                          onBlur={e => e.target.style.borderColor = 'var(--color-border-subtle)'}
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Password</label>
                      <input 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        placeholder="••••••••"
                        required
                        style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border-subtle)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' }}
                        onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
                        onBlur={e => e.target.style.borderColor = 'var(--color-border-subtle)'}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '0.875rem' }}>
                  {error}
                </div>
              )}

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                style={{ padding: '0.875rem', marginTop: '0.5rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#fff', color: '#000', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Creating account…' : step === 1 ? 'Continue with Email' : 'Create Account'}
              </motion.button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              Already have an account? <Link to="/login" style={{ color: '#fff', fontWeight: 500, textDecoration: 'none' }}>Log in</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </AuthLayout>
  );
};
