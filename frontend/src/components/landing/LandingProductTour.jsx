import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DemoOrchestrator } from './demo/DemoOrchestrator';

const CHAPTERS = {
  dashboard: {
    number: "Chapter 1",
    title: "Your Mission Control.",
    description: "Start your day with a clear view of your readiness. Track your current streak, overall score, and pick up your daily mission.",
    color: "#3b82f6"
  },
  library: {
    number: "Chapter 2",
    title: "Curate your library.",
    description: "Paste any LeetCode URL and we instantly extract the pattern, difficulty, and company tags. Build your personal repository of knowledge.",
    color: "#10b981"
  },
  revision: {
    number: "Chapter 3",
    title: "Never forget a pattern.",
    description: "Our spaced repetition engine calculates exactly when you need to revise a problem to commit it to long-term memory.",
    color: "#8b5cf6"
  },
  analytics: {
    number: "Chapter 4",
    title: "Visualize your growth.",
    description: "Stop guessing. Track your speed, consistency, and mastery across all algorithmic patterns over time.",
    color: "#ec4899"
  },
  readiness: {
    number: "Chapter 5",
    title: "Know when to apply.",
    description: "We compare your mastery against historical data of successful candidates. Identify weak topics before they identify you.",
    color: "#ef4444"
  },
  gamification: {
    number: "Chapter 6",
    title: "Level up your skills.",
    description: "LeetCode shouldn't be boring. Earn XP, complete daily missions, unlock achievements, and stay motivated.",
    color: "#f59e0b"
  }
};

export const LandingProductTour = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const content = CHAPTERS[activeView] || CHAPTERS['dashboard'];

  return (
    <section className="landing-ambient-bg" style={{ padding: '8rem 2rem', position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10, display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', width: '100%' }}>
        
        {/* Left Side: Dynamic Text */}
        <div style={{ flex: '1 1 350px', maxWidth: '500px' }}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeView}
              initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
              transition={{ duration: 0.4 }}
            >
              <div style={{ color: content.color, fontWeight: 700, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {content.number} <span style={{ width: 30, height: 1, background: content.color }} />
              </div>
              <h2 style={{ fontSize: 'clamp(3rem, 5vw, 4rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', margin: '0 0 1.5rem', lineHeight: 1.05 }}>
                {content.title}
              </h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0, letterSpacing: '-0.01em' }}>
                {content.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Demo Application */}
        <div style={{ flex: '1 1 700px' }}>
          <DemoOrchestrator onStateChange={setActiveView} />
        </div>

      </div>
    </section>
  );
};
