import React from 'react';
import { motion } from 'framer-motion';
import { AccentBar } from '../components/ui/AccentBar';

// Placeholder since readiness scores aren't dynamically generated yet
const companies = [
  { name: 'Amazon',    pct: 81, topics: 'Arrays, DP, Graphs' },
  { name: 'Google',   pct: 63, topics: 'Graphs, Trees, DP' },
  { name: 'Meta',     pct: 74, topics: 'BFS, Sliding Window' },
  { name: 'Microsoft',pct: 79, topics: 'Trees, Strings, DP' },
  { name: 'Apple',    pct: 55, topics: 'System Design, OOP' },
  { name: 'Adobe',    pct: 86, topics: 'Arrays, HashMaps' },
];

export const Readiness = () => (
  <div>
    <header className="page-header">
      <h1>Interview Readiness</h1>
      <p className="text-secondary">Company-specific readiness scores based on your solved problems and patterns.</p>
    </header>
    <div className="bento-grid">
      {companies.map(({ name, pct, topics }, i) => {
        const color = pct >= 80 ? 'var(--color-strong)' : pct >= 65 ? 'var(--color-readiness)' : 'var(--color-revision)';
        return (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -4 }}
            className="bento-card col-span-2"
            style={{ position: 'relative' }}
          >
            <AccentBar color={color} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3>{name}</h3>
                <p className="text-muted text-xs" style={{ marginTop: '0.2rem' }}>{topics}</p>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color, letterSpacing: '-0.04em', lineHeight: 1 }}>
                {pct}<span style={{ fontSize: '1rem' }}>%</span>
              </div>
            </div>
            <div className="progress-track">
              <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.3 + i * 0.08, duration: 1, ease: [0.22, 1, 0.36, 1] }} style={{ background: color }} />
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);
