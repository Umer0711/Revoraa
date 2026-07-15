import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, ArrowRight } from 'lucide-react';
import { useDemoContext } from '../DemoContext';

export const RevisionView = ({ step }) => {
  const { registerRef } = useDemoContext();

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#fff' }}>Spaced Repetition</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '0.95rem' }}>Never forget a pattern. Revisit problems right before you forget them.</p>
      </div>

      <div style={{ flex: 1, position: 'relative', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', overflow: 'hidden' }}>
        {/* Node Graph Mockup */}
        <div style={{ position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%, -50%)', display: 'flex', gap: '3rem', alignItems: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', border: '2px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Network size={24} color="#3b82f6" />
          </div>
          <div style={{ width: 100, height: 2, background: 'rgba(255,255,255,0.1)' }} />
          <motion.div 
            ref={registerRef('node-graph')}
            animate={{ scale: step >= 1 ? 1.05 : 1, borderColor: step >= 1 ? '#10b981' : 'rgba(255,255,255,0.2)' }}
            style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}
          >
            DFS
          </motion.div>
        </div>

        <AnimatePresence>
          {step >= 1 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ position: 'absolute', right: '2rem', top: '2rem', bottom: '2rem', width: '250px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}
            >
              <h3 style={{ margin: '0 0 0.5rem', color: '#10b981', fontSize: '1.1rem' }}>Depth First Search</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', margin: '0 0 1.5rem' }}>Mastery: 85% • Due for revision</p>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', color: '#fff' }}>Number of Islands</div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', color: '#fff' }}>Course Schedule</div>
              </div>

              <div style={{ marginTop: 'auto', background: '#fff', color: '#000', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                Start Practice <ArrowRight size={16} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
