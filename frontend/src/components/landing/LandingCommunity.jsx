import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Sparkles, ArrowRight, ShieldCheck, Terminal, Award } from 'lucide-react';

export const LandingCommunity = () => {
  return (
    <section 
      id="community" 
      className="landing-community-section"
      style={{
        position: 'relative',
        padding: '6rem 2rem 5rem',
        overflow: 'hidden',
        background: 'var(--color-bg-base)'
      }}
    >
      {/* Background radial atmosphere */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(88, 101, 242, 0.15) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 75%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: 0
        }} 
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="community-glass-card"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '2rem',
            padding: '4rem 3rem',
            position: 'relative',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          {/* Badge */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1.1rem',
              borderRadius: '2rem',
              background: 'rgba(88, 101, 242, 0.12)',
              border: '1px solid rgba(88, 101, 242, 0.35)',
              color: '#8ea1e1',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '1.75rem'
            }}
          >
            <Users size={16} /> Official Discord
          </div>

          {/* Heading */}
          <h2 
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
              maxWidth: '850px'
            }}
          >
            Revoraa Discord Community
          </h2>

          {/* Supporting Copy */}
          <p 
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              lineHeight: 1.7,
              color: 'var(--color-text-secondary)',
              maxWidth: '720px',
              margin: '0 auto 2.5rem',
              fontWeight: 400
            }}
          >
            Join the Revoraa community for DSA discussions, coding challenges, interview preparation, projects, opportunities and developer networking.
          </p>

          {/* CTA Button */}
          <motion.a
            href="https://discord.gg/5DQqddvMn"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, y: -2, boxShadow: '0 12px 30px rgba(88, 101, 242, 0.45)' }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: '#5865F2',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '1.1rem 2.5rem',
              borderRadius: '1rem',
              fontSize: '1.1rem',
              fontWeight: 700,
              boxShadow: '0 8px 24px rgba(88, 101, 242, 0.35)',
              transition: 'background 0.2s',
              cursor: 'pointer'
            }}
          >
            {/* Discord SVG Logo */}
            <svg width="22" height="22" viewBox="0 0 127.14 96.36" fill="currentColor">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
            </svg>
            Join Discord Community
            <ArrowRight size={18} />
          </motion.a>

          {/* Highlights Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              width: '100%',
              marginTop: '3.5rem',
              paddingTop: '2.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              <Terminal size={18} color="#FFAB00" />
              <span>DSA Daily Problem Discussions</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              <Award size={18} color="#10B981" />
              <span>Interview Prep & Mock Signals</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              <ShieldCheck size={18} color="#5865F2" />
              <span>Developer Networking & Referrals</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
