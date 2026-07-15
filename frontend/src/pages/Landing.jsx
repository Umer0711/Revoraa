import React, { useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LandingNavbar } from '../components/LandingNavbar';
import { LandingHero } from '../components/landing/LandingHero';
import { LandingProductTour } from '../components/landing/LandingProductTour';
import { LandingStoryFAQ } from '../components/landing/LandingStoryFAQ';
import { LandingPricing } from '../components/landing/LandingPricing';
import { LandingFooter } from '../components/landing/LandingFooter';
import { AmbientCursor } from '../components/landing/effects/AmbientCursor';
import { FloatingParticles } from '../components/landing/effects/FloatingParticles';
import './Landing.css';
import { SEO } from '../components/SEO';


export const Landing = () => {
  const containerRef = useRef(null);
  const { user, loading } = useAuth();
  
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div ref={containerRef} style={{ background: 'var(--color-bg-base)', color: 'var(--color-text)', minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      <SEO title="Revoraa | Master Coding Interviews" url="https://revoraa.com" />
      <AmbientCursor />
      <FloatingParticles />
      
      <LandingNavbar />
      
      <LandingHero />
      <LandingProductTour />
      <LandingPricing />
      <LandingStoryFAQ />
      <LandingFooter />
      
    </div>
  );
};
