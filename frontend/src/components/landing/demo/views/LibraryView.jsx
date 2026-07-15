import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Link, CheckCircle2 } from 'lucide-react';
import { useDemoContext } from '../DemoContext';

export const LibraryView = ({ step }) => {
  const { registerRef } = useDemoContext();
  const [typedUrl, setTypedUrl] = useState('');
  
  useEffect(() => {
    let isMounted = true;
    if (step === 1) {
      // Simulate typing
      const url = "leetcode.com/problems/two-sum";
      let currentStr = "";
      let i = 0;
      
      const typeChar = () => {
        if (!isMounted) return;
        if (i < url.length) {
          currentStr += url.charAt(i);
          setTypedUrl(currentStr);
          i++;
          setTimeout(typeChar, 40); // 40ms typing speed
        }
      };
      
      setTimeout(typeChar, 400);
    }
    return () => { isMounted = false; };
  }, [step]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#fff' }}>Problem Library</h1>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '0.95rem' }}>Track and manage your interview patterns.</p>
        </div>
        <div 
          ref={registerRef('btn-add-problem')}
          style={{ 
            background: step === 0 ? '#fff' : 'rgba(255,255,255,0.8)', 
            color: '#000', 
            padding: '0.75rem 1.25rem', 
            borderRadius: '8px', 
            fontSize: '0.9rem', 
            fontWeight: 600, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            transition: 'all 0.2s',
            transform: step === 0 ? 'scale(1)' : 'scale(0.95)'
          }}
        >
          <Plus size={16} /> Add Problem
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {['Two Sum', 'Best Time to Buy and Sell Stock', 'Contains Duplicate'].map((prob, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 500 }}>{prob}</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>Arrays</span>
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>Easy</span>
            </div>
          </div>
        ))}
      </div>

      {/* Popout Overlay */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: -32, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="gemini-glass"
              style={{ padding: '2rem', width: '400px' }}
            >
              <h3 style={{ margin: '0 0 1rem', color: '#fff', fontSize: '1.25rem' }}>Add New Problem</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Link size={16} color="var(--color-text-muted)" />
                <span style={{ color: typedUrl ? '#fff' : 'var(--color-text-muted)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  {typedUrl || "Paste LeetCode URL..."}
                  <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>|</motion.span>
                </span>
              </div>

              <AnimatePresence>
                {typedUrl === "leetcode.com/problems/two-sum" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', overflow: 'hidden' }}
                  >
                    <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>Pattern Detected: Arrays & Hashing</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Difficulty: Easy • Added to your Revision Queue</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
