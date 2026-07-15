import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, Briefcase } from 'lucide-react';
import { useDemoContext } from '../DemoContext';

const COMPANIES = [
  { name: 'Google', score: 92, target: 95, color: '#4285F4' },
  { name: 'Amazon', score: 88, target: 85, color: '#FF9900' }
];

export const ReadinessView = ({ step }) => {
  const { registerRef } = useDemoContext();

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#fff' }}>Interview Readiness</h1>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '0.95rem' }}>Know exactly when to apply based on data.</p>
        </div>
        
        <div 
          ref={registerRef('btn-weak-topics')}
          style={{ padding: '0.5rem 1rem', background: step >= 1 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', transform: step >= 1 ? 'scale(0.95)' : 'scale(1)' }}
        >
          <TrendingDown size={16} /> Weak Topics
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {COMPANIES.map((company, idx) => {
          const ready = company.score >= company.target;
          return (
            <motion.div 
              key={company.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Briefcase size={16} color={company.color} />
                <span style={{ fontWeight: 600, color: '#fff', fontSize: '1rem' }}>{company.name}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{company.score}</span>
              </div>

              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', position: 'relative' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${company.score}%` }}
                  transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                  style={{ height: '100%', background: ready ? 'var(--color-mission)' : 'var(--color-text-muted)', borderRadius: '3px' }} 
                />
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${company.target}%`, width: '2px', background: '#fff' }} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
            className="gemini-glass"
            style={{ position: 'absolute', top: '4rem', right: '0', width: '250px', padding: '1.5rem', zIndex: 20 }}
          >
            <h4 style={{ margin: '0 0 1rem', color: '#fff', fontSize: '1rem' }}>Improvement Areas</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px', color: '#ef4444', fontSize: '0.9rem', fontWeight: 600 }}>Dynamic Programming</div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px', color: '#ef4444', fontSize: '0.9rem', fontWeight: 600 }}>Graph Traversal</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
