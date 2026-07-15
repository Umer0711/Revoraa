import React from 'react';
import { LandingPricing } from '../components/landing/LandingPricing';
import { RevoraaLogo } from '../components/RevoraaLogo';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

export const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', position: 'relative' }}>
      <header style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <RevoraaLogo />
        <button onClick={() => navigate('/dashboard')} style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
          <X size={16} /> Close
        </button>
      </header>
      <main style={{ paddingBottom: '4rem' }}>
        <LandingPricing />
      </main>
    </div>
  );
};
