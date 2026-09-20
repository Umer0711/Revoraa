import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Brain, BarChart, Target, Trophy, CheckCircle2, Plus } from 'lucide-react';
import { RevoraaLogo } from '../RevoraaLogo';
import { StoryCursor } from './StoryCursor';
import { MagneticButton } from '../ui/MagneticButton';
import { TextReveal } from '../ui/TextReveal';

export const LandingHero = () => {
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 100, y: 300 });
  const [clicking, setClicking] = useState(false);
  const [isLight, setIsLight] = useState(
    () => document.documentElement.getAttribute('data-theme') === 'light'
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Sequence automation
  useEffect(() => {
    let timeout;
    
    const sequence = async () => {
      // Fast, elegant timings
      // Hover 150ms, Click 120ms
      // Dashboard -> Add Problem
      if (currentViewIndex === 0) {
        setMousePos({ x: 420, y: 80 }); // Center of "Add Problem"
        timeout = setTimeout(() => setClicking(true), 600);
        timeout = setTimeout(() => {
          setClicking(false);
          setCurrentViewIndex(1);
        }, 720);
      }
      // Add Problem -> Saved
      else if (currentViewIndex === 1) {
        setMousePos({ x: 260, y: 280 }); // Center of "Save to Library"
        timeout = setTimeout(() => setClicking(true), 500);
        timeout = setTimeout(() => {
          setClicking(false);
          setCurrentViewIndex(2);
        }, 620);
      }
      // Saved -> Revision
      else if (currentViewIndex === 2) {
        setMousePos({ x: 80, y: 110 }); // Center of "Revision"
        timeout = setTimeout(() => setClicking(true), 800);
        timeout = setTimeout(() => {
          setClicking(false);
          setCurrentViewIndex(3);
        }, 920);
      }
      // Revision -> Analytics
      else if (currentViewIndex === 3) {
        setMousePos({ x: 80, y: 150 }); // Center of "Analytics"
        timeout = setTimeout(() => setClicking(true), 800);
        timeout = setTimeout(() => {
          setClicking(false);
          setCurrentViewIndex(4);
        }, 920);
      }
      // Analytics -> Readiness
      else if (currentViewIndex === 4) {
        setMousePos({ x: 80, y: 190 }); // Center of "Readiness"
        timeout = setTimeout(() => setClicking(true), 800);
        timeout = setTimeout(() => {
          setClicking(false);
          setCurrentViewIndex(5);
        }, 920);
      }
      // Readiness -> Achievements
      else if (currentViewIndex === 5) {
        setMousePos({ x: 80, y: 230 }); // Center of "Achievements"
        timeout = setTimeout(() => setClicking(true), 800);
        timeout = setTimeout(() => {
          setClicking(false);
          setCurrentViewIndex(6);
        }, 920);
      }
      // Achievements -> Seamless Loop back to 0
      else if (currentViewIndex === 6) {
        setMousePos({ x: 80, y: 70 }); // Center of "Dashboard"
        timeout = setTimeout(() => setClicking(true), 1200);
        timeout = setTimeout(() => {
          setClicking(false);
          setCurrentViewIndex(0);
        }, 1320);
      }
    };

    sequence();
    return () => clearTimeout(timeout);
  }, [currentViewIndex]);

  const renderSidebar = () => (
    <div style={{ width: '220px', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', background: 'rgba(255,255,255,0.01)' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: 600 }}>
        <RevoraaLogo size={16} color="#fff" />
        <span>Revoraa</span>
      </div>
      {[
        { id: 0, icon: RevoraaLogo, label: 'Dashboard' },
        { id: 1, icon: Brain, label: 'Problem Library' },
        { id: 4, icon: BarChart, label: 'Analytics' },
        { id: 5, icon: Target, label: 'Readiness' },
        { id: 6, icon: Trophy, label: 'Achievements' },
      ].map(item => {
        const isActive = currentViewIndex === item.id || (item.id === 0 && currentViewIndex <= 2);
        return (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: '8px', background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent', color: isActive ? '#fff' : 'var(--color-text-secondary)', fontSize: '0.8rem', transition: 'all 0.2s' }}>
            <item.icon size={14} /> {item.label}
          </div>
        );
      })}
    </div>
  );

  const renderContent = () => {
    // Smooth crossfade transitions for the FSM FSM
    const defaultTransition = { duration: 0.35, ease: "easeInOut" };
    const baseStyle = { position: 'absolute', inset: 0, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' };

    switch(currentViewIndex) {
      case 0: // Dashboard
        return (
          <motion.div key="v0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={defaultTransition} style={baseStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.25rem' }}>Welcome back</h3>
                <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>You have 3 revisions due today.</p>
              </div>
              <div style={{ background: '#fff', color: '#000', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={14} /> Add Problem
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, height: '100px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--color-border-glass)' }} />
              <div style={{ flex: 1, height: '100px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--color-border-glass)' }} />
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--color-border-glass)' }} />
          </motion.div>
        );
      case 1: // Add Problem
        return (
          <motion.div key="v1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={defaultTransition} style={{ ...baseStyle, alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
            <div className="gemini-glass" style={{ width: '100%', maxWidth: '350px', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <h4 style={{ margin: '0 0 1rem', color: '#fff' }}>Log Problem</h4>
              <div style={{ height: '36px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '1rem' }} />
              <div style={{ height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '1.5rem' }} />
              <div style={{ background: '#fff', color: '#000', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>Save to Library</div>
            </div>
          </motion.div>
        );
      case 2: // Saved
        return (
          <motion.div key="v2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={defaultTransition} style={{ ...baseStyle, alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-mission)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
                <CheckCircle2 color="#fff" size={24} />
              </div>
              <h3 style={{ margin: 0, color: '#fff' }}>Problem Logged</h3>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Scheduled for revision in 3 days.</p>
            </div>
          </motion.div>
        );
      case 3: // Revision
        return (
          <motion.div key="v3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={defaultTransition} style={baseStyle}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.25rem' }}>Daily Missions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: '60px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--color-border-glass)', display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '1rem' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)' }} />
                  <div style={{ width: '40%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 4: // Analytics
        return (
          <motion.div key="v4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={defaultTransition} style={baseStyle}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.25rem' }}>Analytics</h3>
            <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
              <div style={{ flex: 2, background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--color-border-glass)' }} />
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--color-border-glass)' }} />
            </div>
          </motion.div>
        );
      case 5: // Readiness
        return (
          <motion.div key="v5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={defaultTransition} style={baseStyle}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.25rem' }}>Interview Readiness</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ height: '120px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--color-border-glass)', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ width: '60%', height: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '70%', height: '100%', background: 'var(--color-readiness)' }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 6: // Achievements
        return (
          <motion.div key="v6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={defaultTransition} style={baseStyle}>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Trophy size={48} color="#f59e0b" style={{ marginBottom: '1rem', filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.6))' }} />
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.5rem' }}>Level 12</h3>
              <p style={{ margin: '0.5rem 0 0', color: 'var(--color-text-secondary)' }}>Algorithm Master</p>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="landing-ambient-bg landing-hero-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '80px', position: 'relative', overflow: 'hidden' }}>
      
      <div className="landing-hero-grid" style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', zIndex: 10 }}>
        
        {/* LEFT: Text Content */}
        <motion.div 
          initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }} 
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }} 
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', zIndex: 20 }}
        >
          
          <h1 className="landing-hero-title" style={{ fontSize: 'clamp(3.5rem, 6vw, 6.5rem)', fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1.05, color: isLight ? '#151515' : '#fff', marginBottom: '1.5rem' }}>
            <TextReveal delay={0.2}>Practice with purpose.</TextReveal>
          </h1>
          
          <div className="landing-hero-subtext" style={{ fontSize: '1.35rem', color: isLight ? '#555555' : 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: '520px', fontWeight: 400, marginBottom: '3.5rem', letterSpacing: '-0.01em' }}>
            <TextReveal delay={0.4}>
              Every solved problem deserves to be remembered. Knowledge compounds. Master interviews one revision at a time.
            </TextReveal>
          </div>
          
          <div className="landing-hero-ctas" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <MagneticButton style={{ background: isLight ? '#151515' : '#fff', color: isLight ? '#FAF8F5' : '#000', padding: '1.1rem 2.2rem', borderRadius: '999px', fontSize: '1rem', fontWeight: 600, border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: isLight ? '0 8px 30px rgba(0,0,0,0.18)' : '0 8px 30px rgba(255,255,255,0.2)' }}>
                Get Started
              </MagneticButton>
            </Link>
            
            <MagneticButton 
              style={{ background: 'transparent', color: isLight ? '#555555' : '#fff', padding: '1.1rem 1.8rem', borderRadius: '999px', fontSize: '1rem', fontWeight: 600, border: `1px solid ${isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Play size={16} fill={isLight ? '#555555' : '#fff'} /> Watch Demo
            </MagneticButton>
          </div>
        </motion.div>

        {/* RIGHT: Interactive Desktop Mockup */}
        <motion.div 
          className="landing-hero-mockup"
          initial={{ opacity: 0, y: 50, rotateX: 15, rotateY: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ perspective: '1200px' }}
        >
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="gemini-glass"
            style={{ width: '100%', aspectRatio: '16/10', display: 'flex', flexDirection: 'column', position: 'relative' }}
          >
            
            {/* macOS Titlebar */}
            <div style={{ height: '32px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.02))', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '0.5rem', borderRadius: '24px 24px 0 0' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2)' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2)' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2)' }} />
              <div style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 600, letterSpacing: '0.02em' }}>revoraa.com</div>
            </div>

            {/* App Layout */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', borderRadius: '0 0 24px 24px' }}>
              {renderSidebar()}
              <div style={{ flex: 1, background: 'var(--color-bg-surface)', position: 'relative', overflow: 'hidden' }}>
                <AnimatePresence>
                  {renderContent()}
                </AnimatePresence>
              </div>
            </div>

            <StoryCursor x={mousePos.x} y={mousePos.y} isClicking={clicking} show={true} />

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
