import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Mail, Code2, GitMerge, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { authConfig } from '../lib/config';
import { SEO } from '../components/SEO';


export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/dashboard';
  const { user } = useAuth();

  if (user) {
    return <Navigate to={redirectUrl} replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    navigate(redirectUrl);
  };

  const handleOAuth = async (provider) => {
    localStorage.setItem("oauth_redirect", redirectUrl);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider.toLowerCase(),
      options: { redirectTo: authConfig.oauthCallbackUrl },
    });
    if (error) setError(error.message);
  };

  return (
    <AuthLayout>
      <SEO title="Login" url="https://revoraa.com/login" />
      <div style={{ flex: 1, display: 'flex', width: '100%', minHeight: '100vh' }}>
        
        {/* Left Side - Animated Product Preview */}
        <div style={{ flex: 1, display: 'none', '@media (minWidth: 1024px)': { display: 'flex' }, padding: '4rem', flexDirection: 'column', position: 'relative' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', zIndex: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={18} color="#000" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>Revoraa</span>
          </Link>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {/* Minimal Dashboard Mockup for Left Side */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
              style={{ width: '100%', maxWidth: '600px', height: '400px', background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ height: 24, width: 120, background: 'rgba(255,255,255,0.05)', borderRadius: 4 }} />
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 2, height: 100, background: 'rgba(255,255,255,0.03)', borderRadius: 12 }} />
                <div style={{ flex: 1, height: 100, background: 'rgba(255,255,255,0.03)', borderRadius: 12 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ height: 48, background: 'rgba(255,255,255,0.02)', borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '1rem' }}>
                    <CheckCircle2 size={16} color="var(--color-success)" opacity={0.5} />
                    <div style={{ height: 12, width: '60%', background: 'rgba(255,255,255,0.05)', borderRadius: 4 }} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div style={{ marginTop: 'auto', zIndex: 10 }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff', maxWidth: '400px', lineHeight: 1.4 }}>
              "The most systematic way to prepare for technical interviews."
            </p>
          </div>
        </div>

        {/* Right Side - Auth Card */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)', borderLeft: '1px solid var(--color-border-subtle)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', maxWidth: '400px' }}
          >
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff', letterSpacing: '-0.02em' }}>Welcome back</h2>
              <p className="text-secondary" style={{ fontSize: '1rem' }}>Log in to continue your preparation.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={() => handleOAuth('github')}
                className="btn-ghost" 
                style={{ padding: '0.875rem', borderRadius: '12px', border: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '0.95rem', fontWeight: 500, color: '#fff' }}
              >
                <GitMerge size={18} /> Continue with GitHub
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={() => handleOAuth('google')}
                className="btn-ghost" 
                style={{ padding: '0.875rem', borderRadius: '12px', border: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '0.95rem', fontWeight: 500, color: '#fff' }}
              >
                <Mail size={18} /> Continue with Google
              </motion.button>
            </div>

            {error && (
              <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', gap: '1rem' }}>
              <div style={{ height: 1, flex: 1, background: 'var(--color-border-subtle)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>or log in with email</span>
              <div style={{ height: 1, flex: 1, background: 'var(--color-border-subtle)' }} />
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Password</label>
                  <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</Link>
                </div>
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
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#fff', width: 16, height: 16, cursor: 'pointer' }}
                />
                <label htmlFor="remember" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>Remember me for 30 days</label>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading}
                style={{ padding: '0.875rem', marginTop: '0.5rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#fff', color: '#000', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </motion.button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              Don't have an account? <Link to="/signup" style={{ color: '#fff', fontWeight: 500, textDecoration: 'none' }}>Sign up</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </AuthLayout>
  );
};
