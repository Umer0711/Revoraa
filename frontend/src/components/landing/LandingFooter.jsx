import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { RevoraaLogo } from '../RevoraaLogo';
import { Link } from 'react-router-dom';

const SOCIAL_LINKS = [
  {
    name: 'X',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
      </svg>
    ),
    href: "#"
  },
  {
    name: 'GitHub',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
    ),
    href: "#"
  },
  {
    name: 'LinkedIn',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    ),
    href: "#"
  }
];

export const LandingFooter = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', overflow: 'hidden', background: 'var(--color-bg-base)', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '8rem', paddingBottom: '3rem' }}
    >
      
      {/* Warm Ambient Glow at bottom */}
      <div style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '100vw', height: '400px', background: 'radial-gradient(ellipse at bottom, rgba(245, 158, 11, 0.15) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 10 }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', paddingBottom: '6rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          
          {/* Brand Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '340px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <RevoraaLogo size={32} color="#f59e0b" />
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>Revoraa</span>
            </Link>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 400, letterSpacing: '-0.01em' }}>
              Helping engineers build lasting interview confidence.
            </p>
            
            <div style={{ marginTop: '1rem', position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input type="email" placeholder="Subscribe to newsletter" style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.15)', padding: '0.75rem 0', color: '#fff', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = '#f59e0b'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'} />
              <motion.button whileHover={{ x: 5 }} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </div>

          {/* Navigation Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginTop: '0.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.02em', marginBottom: '0.5rem' }}>Product</h4>
              {['Features', 'Roadmap', 'Documentation', 'GitHub'].map(l => (
                <motion.a key={l} href="#" whileHover={{ color: '#fff', x: 2 }} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.2s', width: 'fit-content' }}>
                  {l}
                </motion.a>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.02em', marginBottom: '0.5rem' }}>Company</h4>
              {['Support', 'Contact', 'Privacy', 'Terms'].map(l => (
                <motion.a key={l} href="#" whileHover={{ color: '#fff', x: 2 }} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.2s', width: 'fit-content' }}>
                  {l}
                </motion.a>
              ))}
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', gap: '1.5rem' }}>
          <span style={{ fontWeight: 500 }}>© 2026 Revoraa Inc.</span>
          
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {SOCIAL_LINKS.map((link) => (
              <motion.a key={link.name} href={link.href} aria-label={link.name} whileHover={{ color: '#fff', y: -2 }} style={{ color: 'var(--color-text-muted)', transition: 'color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {link.icon}
              </motion.a>
            ))}
          </div>
        </div>

      </div>
    </motion.footer>
  );
};
