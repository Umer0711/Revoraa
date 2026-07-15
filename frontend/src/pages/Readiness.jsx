import React from 'react';
import { motion } from 'framer-motion';
import { AccentBar } from '../components/ui/AccentBar';
import { usePermissions } from '../lib/permissions';
import { Lock } from 'lucide-react';
import { SEO } from '../components/SEO';


const PremiumPageLock = ({ title, description }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center', padding: '2rem' }}>
    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,184,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
      <Lock size={32} color="var(--color-primary)" />
    </div>
    <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.03em' }}>{title}</h2>
    <p className="text-secondary" style={{ maxWidth: 400, marginBottom: '2rem', lineHeight: 1.6 }}>{description}</p>
    <a href="/pricing" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem', textDecoration: 'none' }}>Upgrade to Pro</a>
  </div>
);

// Placeholder since readiness scores aren't dynamically generated yet
const companies = [
  { name: 'Amazon',    pct: 81, topics: 'Arrays, DP, Graphs' },
  { name: 'Meta',     pct: 74, topics: 'BFS, Sliding Window' },
  { name: 'Microsoft',pct: 79, topics: 'Trees, Strings, DP' },
  { name: 'Apple',    pct: 55, topics: 'System Design, OOP' },
  { name: 'Adobe',    pct: 86, topics: 'Arrays, HashMaps' },
];

export const Readiness = () => {
  const { isPro } = usePermissions();

  if (!isPro) {
    return (
      <div style={{ paddingBottom: '3rem' }}>
        <header className="page-header">
          <h1>Company Readiness</h1>
          <p className="text-secondary">Track your probability of passing interviews at top tech companies.</p>
        </header>
        <PremiumPageLock 
          title="Company Readiness" 
          description="Unlock AI-driven readiness scoring, company-specific progress tracking, and targeted preparation insights with a Pro subscription."
        />
      </div>
    );
  }

  return (
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
      <SEO title="Interview Readiness" url="https://revoraa.com/readiness" />
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
};

