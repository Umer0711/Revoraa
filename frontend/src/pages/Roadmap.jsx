import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Lock, Loader2 } from 'lucide-react';
import { AccentBar } from '../components/ui/AccentBar';
import { getRoadmapData } from '../lib/dataService';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useRealtime } from '../contexts/RealtimeContext';
import { SEO } from '../components/SEO';




export const Roadmap = () => {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);

  const { refreshKey } = useRealtime();

  const fetchRoadmap = () => {
    if (user?.id) {
      getRoadmapData(user.id).then(data => {
        setRoadmap(data);
        setLoading(false);
      }).catch(err => {
        console.error("Roadmap fetch error:", err);
        setRoadmap(null);
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    fetchRoadmap();
    if (!user) return;
    const channel = supabase
      .channel(`roadmap:${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_roadmap_progress',
        filter: `user_id=eq.${user.id}`,
      }, () => fetchRoadmap())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_roadmap_phases',
        filter: `user_id=eq.${user.id}`,
      }, () => fetchRoadmap())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user, refreshKey]);

  let content;
  if (loading) {
    content = (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <Loader2 size={24} className="text-muted" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  } else if (!roadmap || roadmap.length === 0) {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem', textAlign: 'center', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
        <p className="text-secondary" style={{ fontSize: '1.1rem' }}>No roadmap data available.</p>
        <p className="text-muted text-sm" style={{ marginTop: '0.5rem' }}>Start solving problems to build your personalized roadmap.</p>
      </div>
    );
  } else {
    // Render Real Roadmap Data from the database
    const phasesToRender = roadmap.map(phase => {
      const totalTarget = phase.topics.reduce((acc, t) => acc + t.target_problem_count, 0);
      const totalSolved = phase.topics.reduce((acc, t) => acc + Math.min(t.solved_count, t.target_problem_count), 0);
      const pct = totalTarget === 0 ? 0 : Math.round((totalSolved / totalTarget) * 100);
      
      const topicsStr = phase.topics.map(t => t.name).join(', ');
      const label = `Phase ${phase.display_order}: ${phase.title}`;
      
      let status = 'locked';
      if (phase.is_completed || pct === 100) status = 'done';
      else if (phase.is_unlocked) status = 'active';

      return {
        label,
        topics: topicsStr,
        status,
        pct,
        isUnlocked: phase.is_unlocked,
        isCompleted: phase.is_completed
      };
    });

    content = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {phasesToRender.map(({ label, topics, status, pct, isUnlocked }, i) => {
          const isDone   = status === 'done';
          const isActive = status === 'active';
          const isLocked = status === 'locked';
          const accent   = isDone ? 'var(--color-strong)' : isActive ? 'var(--color-readiness)' : 'var(--color-text-muted)';
          return <RoadmapCard key={i} label={label} topics={topics} pct={pct} isDone={isDone} isActive={isActive} isLocked={isLocked} isUnlocked={isUnlocked} accent={accent} index={i} />
        })}
      </div>
    );
  }

  return (
    <div>
      <header className="page-header">
        <h1>Roadmap</h1>
        <p className="text-secondary">Your structured path from beginner to interview-ready.</p>
      </header>
      {content}
    </div>
  );
};

function RoadmapCard({ label, topics, pct, isDone, isActive, isLocked, isUnlocked, accent, index: i }) {
  const [justCompleted, setJustCompleted] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const prevPct = React.useRef(pct);
  const prevUnlocked = React.useRef(isUnlocked);

  useEffect(() => {
    if (pct === 100 && prevPct.current < 100) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 3000); // Stop animation after 3s
    }
    prevPct.current = pct;
  }, [pct]);

  useEffect(() => {
    if (isUnlocked && !prevUnlocked.current) {
      setJustUnlocked(true);
      setTimeout(() => setJustUnlocked(false), 3000);
    }
    prevUnlocked.current = isUnlocked;
  }, [isUnlocked]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ 
        opacity: isLocked ? 0.5 : 1, 
        x: 0,
        boxShadow: justCompleted ? `0 0 20px 2px color-mix(in srgb, ${accent} 40%, transparent)` : justUnlocked ? `0 0 15px 2px var(--color-primary)` : '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
      }}
      transition={{ delay: i * 0.04, boxShadow: { duration: 0.5, ease: "easeOut" } }}
      whileHover={{ x: 4 }}
      className={`bento-card ${justCompleted || justUnlocked ? 'clay-card' : ''}`}
      style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative', overflow: 'hidden' }}
    >
      <SEO title="Roadmap" url="https://revoraa.com/roadmap" />
      <AccentBar color={accent} />
      
      {justCompleted && (
        <motion.div
          initial={{ x: '-100%', opacity: 0.5 }}
          animate={{ x: '200%', opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', zIndex: 0 }}
        />
      )}

      <motion.div 
        animate={justCompleted ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
        transition={{ duration: 0.5 }}
        style={{ width: 36, height: 36, borderRadius: '50%', background: `color-mix(in srgb, ${accent} 15%, transparent)`, border: `1.5px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}
      >
        {isDone   ? <CheckCircle2 size={18} color="var(--color-strong)" />  :
         isLocked ? <Lock size={16} color="var(--color-text-muted)" />       :
                    <Circle size={18} color="var(--color-readiness)" strokeWidth={2.5} />}
      </motion.div>

      <div style={{ flex: 1, zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ marginBottom: '0.2rem' }}>{label}</h3>
          {pct > 0 && <span style={{ fontSize: '0.8rem', fontWeight: 600, color: accent }}>{pct}%</span>}
        </div>
        <p className="text-muted text-sm">{topics}</p>
        {pct > 0 && (
          <div className="progress-track" style={{ marginTop: '0.625rem', background: 'rgba(255,255,255,0.05)' }}>
            <motion.div 
              className="progress-fill" 
              initial={{ width: `${prevPct.current}%` }} 
              animate={{ width: `${pct}%` }} 
              transition={{ delay: 0.1 + i * 0.04, duration: 0.5, ease: "easeOut" }} 
              style={{ background: accent, boxShadow: justCompleted ? `0 0 10px ${accent}` : 'none' }} 
            />
          </div>
        )}
      </div>
      {isDone && <span className="badge badge-success" style={{ zIndex: 1 }}>Completed</span>}
      {isActive && <span className="badge badge-primary" style={{ zIndex: 1 }}>In Progress</span>}
    </motion.div>
  );
}
