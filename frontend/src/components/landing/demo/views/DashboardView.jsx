import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const DashboardView = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#fff' }}>Welcome back, Alex.</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '0.95rem' }}>Your interview readiness is looking strong today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Simple Stat Cards */}
        {[
          { label: 'Problems Solved', value: '342' },
          { label: 'Current Streak', value: '14 Days' },
          { label: 'Readiness Score', value: '92%' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem' }}
          >
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{stat.label}</div>
            <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Sparkles size={32} color="#f59e0b" style={{ marginBottom: '1rem' }} />
        <h3 style={{ margin: '0 0 0.5rem', color: '#fff', fontSize: '1.1rem' }}>Daily Mission Available</h3>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '0.9rem' }}>Solve 2 dynamic programming problems to earn 150 XP.</p>
      </div>
    </div>
  );
};
