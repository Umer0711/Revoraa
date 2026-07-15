import React from 'react';
import { useDemoContext } from './DemoContext';
import { Layout, Library, BarChart3, Target, Trophy, FileEdit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmartCursor } from './SmartCursor';

export const DesktopShell = ({ children, activeTargetId, onCursorActionComplete, activeTab }) => {
  const { registerContainer, registerRef } = useDemoContext();

  const NAV_ITEMS = [
    { id: 'dashboard', icon: Layout, label: 'Dashboard' },
    { id: 'library', icon: Library, label: 'Problem Library' },
    { id: 'revision', icon: FileEdit, label: 'Smart Revision' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'readiness', icon: Target, label: 'Readiness' },
    { id: 'gamification', icon: Trophy, label: 'Achievements' },
  ];

  return (
    <div 
      className="gemini-glass"
      ref={registerContainer}
      style={{ 
        width: '100%', 
        maxWidth: '900px', 
        height: '600px', 
        margin: '0 auto',
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative', 
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}
    >
      {/* Top Bar */}
      <div style={{ height: '48px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 1rem', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Sidebar */}
        <div style={{ width: '220px', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', background: 'rgba(255,255,255,0.01)' }}>
          {NAV_ITEMS.map((item) => (
            <div 
              key={item.id}
              ref={registerRef(`nav-${item.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: activeTab === item.id ? '#fff' : 'var(--color-text-secondary)',
                background: activeTab === item.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                fontWeight: activeTab === item.id ? 600 : 500,
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
            >
              <item.icon size={16} />
              {item.label}
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, position: 'relative', padding: '2rem', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab} // changing key triggers AnimatePresence
              initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, padding: '2rem' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <SmartCursor targetId={activeTargetId} onActionComplete={onCursorActionComplete} />
    </div>
  );
};
