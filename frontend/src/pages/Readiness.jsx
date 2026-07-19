import React from 'react';
import { SEO } from '../components/SEO';
import { Target } from 'lucide-react';

export const Readiness = () => {
  return (
    <div style={{ paddingBottom: '3rem' }}>
      <SEO title="Interview Readiness" url="https://revoraa.com/readiness" />
      <header className="page-header">
        <h1>Interview Readiness</h1>
        <p className="text-secondary">Track your probability of passing interviews at top tech companies.</p>
      </header>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '2rem' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Target size={32} color="var(--color-primary)" />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.03em' }}>Coming Soon</h2>
        <p className="text-secondary" style={{ maxWidth: 450, marginBottom: '2rem', lineHeight: 1.6 }}>
          This feature is currently under development. It will be available in an upcoming update.<br/><br/>Stay tuned for future releases.
        </p>
      </div>
    </div>
  );
};
