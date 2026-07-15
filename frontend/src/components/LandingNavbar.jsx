import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { RevoraaLogo } from './RevoraaLogo';
import { MagneticButton } from './ui/MagneticButton';
import { useAuth } from '../contexts/AuthContext';

const NAV_LINKS = [
  { name: 'Features', href: '#features' },
  { name: 'How it Works', href: '#how-it-works' },
  { name: 'Analytics', href: '#analytics' },
  { name: 'Roadmap', href: '#roadmap' },
  { name: 'FAQ', href: '#faq' }
];

export const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');
  const { user } = useAuth();

  // Track theme changes from the sidebar toggle
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const isLight = theme === 'light';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
        style={{
          position: 'fixed',
          top: 20,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none', // Allow clicking through the container
          padding: '0 1rem'
        }}
      >
        <motion.nav
          animate={{
            height: scrolled ? 68 : 74,
            background: scrolled
              ? isLight ? 'rgba(250, 248, 245, 0.90)' : 'rgba(10, 10, 12, 0.80)'
              : isLight ? 'rgba(248, 246, 242, 0.55)' : 'rgba(10, 10, 12, 0.20)',
            backdropFilter: scrolled ? 'blur(40px) saturate(200%)' : 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: scrolled ? 'blur(40px) saturate(200%)' : 'blur(20px) saturate(160%)',
            boxShadow: scrolled
              ? isLight
                ? '0 8px 32px -8px rgba(0,0,0,0.12), inset 0 -1px 0 rgba(0,0,0,0.06)'
                : '0 20px 40px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)'
              : isLight
                ? '0 4px 16px -4px rgba(0,0,0,0.06)'
                : '0 10px 30px -10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
            borderColor: scrolled
              ? isLight ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.12)'
              : isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.06)'
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{
            pointerEvents: 'auto',
            width: '100%',
            maxWidth: '1200px',
            borderRadius: '9999px',
            border: '1px solid',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            padding: '0 0.5rem 0 1.25rem',
          }}
          aria-label="Main Navigation"
        >
          {/* LEFT: Logo */}
          <Link 
            to="/" 
            aria-label="Revoraa Home"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              textDecoration: 'none',
              outline: 'none'
            }}
          >
            <motion.div 
              whileHover={{ scale: 1.05, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              >
              <RevoraaLogo size={18} color={isLight ? '#b45309' : '#f59e0b'} />
            </motion.div>
            <span style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.03em', color: isLight ? '#151515' : '#fff' }}>
              Revoraa
            </span>
          </Link>

          {/* CENTER: Links (Desktop) */}
          <div className="nav-desktop" style={{ justifySelf: 'center', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onMouseEnter={() => setActiveHover(link.name)}
                onMouseLeave={() => setActiveHover(null)}
                style={{
                  position: 'relative',
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: activeHover === link.name
                    ? (isLight ? '#151515' : '#fff')
                    : (isLight ? '#555555' : 'rgba(255,255,255,0.65)'),
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  outline: 'none',
                  borderRadius: '999px',
                  letterSpacing: '0.01em'
                }}
              >
                {activeHover === link.name && (
                  <motion.div
                    layoutId="navHoverPill"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)',
                      borderRadius: '999px',
                      zIndex: -1
                    }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{link.name}</span>
              </a>
            ))}
          </div>

          {/* RIGHT: Actions (Desktop) */}
          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {user ? (
              <Link to="/dashboard" style={{ textDecoration: 'none', outline: 'none' }}>
                <MagneticButton
                  style={{ 
                    background: isLight ? '#151515' : '#fff', 
                    color: isLight ? '#FAF8F5' : '#000', 
                    padding: '0.65rem 1.25rem', 
                    borderRadius: '999px', 
                    fontSize: '0.95rem', 
                    fontWeight: 600, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.35rem',
                    boxShadow: isLight
                      ? '0 4px 14px rgba(0,0,0,0.15), inset 0 -1px 0 rgba(0,0,0,0.2)'
                      : '0 4px 14px rgba(255,255,255,0.25), inset 0 -2px 0 rgba(0,0,0,0.1)'
                  }}
                >
                  Go to Dashboard <ArrowRight size={16} strokeWidth={2.5} />
                </MagneticButton>
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  style={{ 
                    padding: '0.6rem 1.25rem', 
                    fontSize: '0.95rem', 
                    fontWeight: 600, 
                    color: isLight ? '#555555' : 'rgba(255,255,255,0.85)', 
                    textDecoration: 'none',
                    borderRadius: '999px',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onMouseOver={e => { e.target.style.background = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)'; e.target.style.color = isLight ? '#151515' : '#fff'; }} 
                  onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = isLight ? '#555555' : 'rgba(255,255,255,0.85)'; }}
                >
                  Log in
                </Link>
                <Link to="/signup" style={{ textDecoration: 'none', outline: 'none' }}>
                  <MagneticButton
                    style={{ 
                      background: isLight ? '#151515' : '#fff', 
                      color: isLight ? '#FAF8F5' : '#000', 
                      padding: '0.65rem 1.25rem', 
                      borderRadius: '999px', 
                      fontSize: '0.95rem', 
                      fontWeight: 600, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.35rem',
                      boxShadow: isLight
                        ? '0 4px 14px rgba(0,0,0,0.15), inset 0 -1px 0 rgba(0,0,0,0.2)'
                        : '0 4px 14px rgba(255,255,255,0.25), inset 0 -2px 0 rgba(0,0,0,0.1)'
                    }}
                  >
                    Get Started <ArrowRight size={16} strokeWidth={2.5} />
                  </MagneticButton>
                </Link>
              </>
            )}
          </div>

          {/* RIGHT: Mobile Toggle */}
          <div className="nav-mobile-toggle" style={{ display: 'none', justifySelf: 'end' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
              style={{ 
                padding: '0.6rem', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                color: '#fff', 
                cursor: 'pointer',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none'
              }}
            >
              <Menu size={20} />
            </motion.button>
          </div>
        </motion.nav>
      </motion.header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%', transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', 
              inset: 0, 
              zIndex: 200, 
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(30px) saturate(200%)',
              WebkitBackdropFilter: 'blur(30px) saturate(200%)',
              padding: '1.5rem', 
              display: 'flex', 
              flexDirection: 'column'
            }}
          >
            {/* Mobile Menu Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: '8px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RevoraaLogo size={18} color="#000" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                Revoraa
              </span>
            </Link>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(false)} 
                aria-label="Close Menu"
                style={{ 
                  padding: '0.6rem', 
                  background: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: '#fff', 
                  cursor: 'pointer',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none'
                }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Mobile Menu Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, padding: '0 1rem' }}>
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.1 + (i * 0.05), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ 
                      fontSize: '2.5rem', 
                      fontWeight: 700, 
                      color: '#fff', 
                      textDecoration: 'none', 
                      letterSpacing: '-0.03em',
                      display: 'block'
                    }}
                  >
                    {link.name}
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Mobile Menu Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto', padding: '0 1rem 2rem' }}
            >
              {user ? (
                <Link 
                  to="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ 
                    padding: '1.1rem', 
                    borderRadius: '16px', 
                    background: '#fff', 
                    color: '#000', 
                    textAlign: 'center', 
                    textDecoration: 'none', 
                    fontSize: '1.1rem', 
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(255,255,255,0.25), inset 0 -2px 0 rgba(0,0,0,0.1)'
                  }}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ 
                      padding: '1.1rem', 
                      borderRadius: '16px', 
                      background: 'rgba(255,255,255,0.05)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff', 
                      textAlign: 'center', 
                      textDecoration: 'none', 
                      fontSize: '1.1rem', 
                      fontWeight: 600 
                    }}
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ 
                      padding: '1.1rem', 
                      borderRadius: '16px', 
                      background: '#fff', 
                      color: '#000', 
                      textAlign: 'center', 
                      textDecoration: 'none', 
                      fontSize: '1.1rem', 
                      fontWeight: 600,
                      boxShadow: '0 4px 14px rgba(255,255,255,0.25), inset 0 -2px 0 rgba(0,0,0,0.1)'
                    }}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
