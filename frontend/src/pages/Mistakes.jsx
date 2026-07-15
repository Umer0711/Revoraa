import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllMistakesData } from '../lib/dataService';
import { useAuth } from '../contexts/AuthContext';
import { useRealtime } from '../contexts/RealtimeContext';

export const Mistakes = () => {
  const { user } = useAuth();
  const { refreshKey } = useRealtime();
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (!user) return;
        const data = await getAllMistakesData(user.id);
        setMistakes(data);
      } catch (err) {
        console.error('Failed to load mistakes:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, refreshKey]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <header className="page-header">
        <h1>Mistakes</h1>
        <p className="text-secondary">Common errors and anti-patterns to watch out for.</p>
      </header>
      
      {mistakes.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
          <p className="text-secondary">You haven't logged any mistakes yet. Keep solving!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {mistakes.map(({ title, count, desc }, i) => (
            <motion.div 
              key={title} 
              initial={{ opacity: 0, x: -12 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: i * 0.08 }} 
              whileHover={{ x: 4 }} 
              className="bento-card" 
              style={{ borderLeft: '3px solid var(--color-mistakes)', position: 'relative' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3>{title}</h3>
                <span className="badge badge-danger">×{count}</span>
              </div>
              <p className="text-secondary text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
