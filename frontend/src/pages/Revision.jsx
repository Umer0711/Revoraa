import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, ExternalLink, CheckCircle2, Zap, SkipForward, BookOpen, Loader2, RefreshCw, 
  Library, CalendarClock, Search, Flame, Grid, List, BrainCircuit, Book
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getTodayRevisions, submitRevision, getUserProblems } from '../lib/problemsService';
import { getRevisionStats } from '../lib/dataService';
import { SEO } from '../components/SEO';


const diffColor = d => d === 'Easy' ? 'var(--color-strong)' : d === 'Medium' ? 'var(--color-revision)' : 'var(--color-weak)';

const feedbackOptions = [
  { key: 'failed', label: "Couldn't Solve", sub: 'Resets to Day 1',    color: 'var(--color-mistakes)',  xp: 5  },
  { key: 'hint',   label: 'Needed Hint',    sub: 'Shorter interval',    color: 'var(--color-revision)', xp: 10 },
  { key: 'easy',   label: 'Solved Easily',  sub: 'Advance schedule',    color: 'var(--color-strong)',   xp: 20 },
];

function useTimer(running) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const reset = useCallback(() => setElapsed(0), []);
  const fmt = s => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  };
  return { elapsed, fmt: fmt(elapsed), reset };
}

// Confidence Badge
const confBadge = (conf) => {
  if (conf >= 4) return { cls: 'badge-strong', label: 'High' };
  if (conf === 3) return { cls: 'badge-revision', label: 'Medium' };
  return { cls: 'badge-weak', label: 'Low' };
};

export function Revision() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('due_today');

  const [stats, setStats] = useState(null); // 'due_today' | 'manual'

  // Scheduled Queue State
  const [queue, setQueue]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  
  // Manual Library State
  const [manualProblems, setManualProblems] = useState([]);
  const [manualLoading, setManualLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('grid');
  
  // Filters (mock for UI)
  const [sortOrder, setSortOrder] = useState('Newest');

  // Active Session State
  const [sessionActive, setSessionActive] = useState(false);
  const [idx, setIdx]               = useState(0);
  const [phase, setPhase]           = useState('ready');    // ready | solving | feedback | complete
  const [results, setResults]       = useState([]);
  const [xpEarned, setXpEarned]     = useState(0);
  const [confidence, setConfidence] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [isManualSession, setIsManualSession] = useState(false);
  const [manualQueue, setManualQueue] = useState([]);

  const activeQueue = isManualSession ? manualQueue : queue;
  const total = activeQueue.length;
  const { elapsed, fmt, reset } = useTimer(phase === 'solving');

  // Fetch revision stats
  useEffect(() => {
    if (!user) return;
    getRevisionStats(user.id).then(setStats).catch(console.error);
  }, [user, sessionActive]);

  // Fetch today's revision queue
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getTodayRevisions(user.id)
      .then(data => { setQueue(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [user]);

  // Fetch all problems for manual library
  useEffect(() => {
    if (!user || activeTab !== 'manual') return;
    setManualLoading(true);
    getUserProblems(user.id, { query: searchQuery })
      .then(data => { setManualProblems(data); setManualLoading(false); })
      .catch(err => { console.error(err); setManualLoading(false); });
  }, [user, activeTab, searchQuery]);

  const current = activeQueue[idx];
  const problem = current?.solved_problem?.problem || current?.problem; 

  const startSessionPhase = useCallback(() => {
    reset();
    setPhase('solving');
  }, [reset]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!sessionActive) return;
    const handler = (e) => {
      if (phase === 'ready'   && (e.key === 'Enter' || e.key === ' ')) startSessionPhase();
      if (phase === 'solving' && e.key === 'Escape') setPhase('feedback');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, startSessionPhase, sessionActive]);

  const startManualRevision = (prob) => {
    setManualQueue([{
      id: 'manual_' + prob.id,
      solved_problem: prob,
      isManual: true,
      revision_number: (prob.revision_count || 0) + 1
    }]);
    setIdx(0);
    setPhase('ready');
    setIsManualSession(true);
    setSessionActive(true);
    setResults([]);
    setXpEarned(0);
  };

  const startScheduledRevision = (index) => {
    setIdx(index);
    setPhase('ready');
    setIsManualSession(false);
    setSessionActive(true);
    setResults([]);
    setXpEarned(0);
  };

  const exitSession = () => {
    setSessionActive(false);
    if (!isManualSession) {
      // Re-fetch queue to show accurate Due Today if they completed some
      setLoading(true);
      getTodayRevisions(user.id)
        .then(data => { setQueue(data); setLoading(false); })
        .catch(err => { setError(err.message); setLoading(false); });
    }
  };

  const handleFeedback = async (result) => {
    if (!current || !user || submitting) return;
    setSubmitting(true);

    const xp = feedbackOptions.find(f => f.key === result)?.xp ?? 10;
    setXpEarned(prev => prev + xp);
    setResults(prev => [...prev, { id: current.id, problem: problem?.title, result, xp }]);

    try {
      if (current.isManual) {
        const { onManualRevisionCompleted } = await import('../lib/eventOrchestrator');
        await onManualRevisionCompleted(
          user.id,
          problem.id,
          result,
          confidence,
          Math.round(elapsed / 60)
        );
      } else {
        await submitRevision({
          userId: user.id,
          scheduleId: current.id,
          solvedProblemId: current.solved_problem?.id,
          result,
          confidence,
          solveTime: Math.round(elapsed / 60),
          currentRevisionNumber: current.revision_number,
          currentEaseFactor: current.ease_factor,
          currentIntervalDays: current.interval_days,
        });
      }
    } catch (err) {
      console.error('Revision submit error:', err.message);
    } finally {
      setSubmitting(false);
    }

    if (idx + 1 >= total || isManualSession) {
      setPhase('complete');
    } else {
      setIdx(i => i + 1);
      reset();
      setPhase('ready');
      setConfidence(3);
    }
  };

  const handleSkip = () => {
    if (idx + 1 >= total || isManualSession) {
      setPhase('complete');
    } else {
      setIdx(i => i + 1);
      reset();
      setPhase('ready');
      setConfidence(3);
    }
  };

  // ---- RENDERERS ----

  const renderActiveSession = () => {
    if (phase === 'complete') {
      return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: '560px', margin: '6rem auto', textAlign: 'center' }}>
      <SEO title="Revision Hub" url="https://revoraa.com/revision" />
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏁</div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>Session Complete!</h2>
          <p className="text-secondary" style={{ marginBottom: '2.5rem' }}>
            You reviewed {results.length} problem{results.length !== 1 ? 's' : ''} and earned <strong style={{ color: 'var(--color-xp)' }}>+{xpEarned} XP</strong>.
          </p>
          <div className="bento-card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {results.map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: i < results.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{r.problem}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', color: feedbackOptions.find(f => f.key === r.result)?.color ?? 'inherit' }}>
                      {feedbackOptions.find(f => f.key === r.result)?.label}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-xp)', fontWeight: 600 }}>+{r.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={exitSession}>Back to Hub</button>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Dashboard</button>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{isManualSession ? "Manual Revision" : "Scheduled Revision"}</h1>
            <p className="text-secondary text-sm">Problem {idx + 1} of {total}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.75rem', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
              <Zap size={14} color="var(--color-xp)" />
              <span style={{ fontWeight: 600, color: 'var(--color-xp)', fontSize: '0.875rem' }}>+{xpEarned} XP</span>
            </div>
            <button className="btn btn-secondary" onClick={exitSession} style={{ padding: '0.35rem 0.75rem', fontSize: '0.875rem' }}>
              <X size={14} /> Exit
            </button>
          </div>
        </div>

        {!isManualSession && (
          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '2rem' }}>
            {activeQueue.map((_, i) => (
              <motion.div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < idx ? 'var(--color-strong)' : i === idx ? 'var(--color-primary)' : 'var(--color-border-subtle)' }} animate={{ scaleX: i === idx ? [1, 1.05, 1] : 1 }} transition={{ repeat: Infinity, duration: 2 }} />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {phase === 'ready' && (
            <motion.div key={`ready-${idx}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bento-card" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '2rem' }}>
                <span className="text-muted text-sm" style={{ fontVariantNumeric: 'tabular-nums' }}>#{problem?.external_problem_id || 'CUST'}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: diffColor(problem?.difficulty) }}>{problem?.difficulty}</span>
                <span style={{ flex: 1 }} />
                {current?.revision_number && <span className="badge">Revision #{current.revision_number}</span>}
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.03em' }}>{problem?.title ?? 'Loading…'}</h2>
              {problem?.problem_tags?.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                  {problem.problem_tags.map(t => <span key={t.tag || t} className="badge">{t.tag || t}</span>)}
                </div>
              )}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-primary" onClick={startSessionPhase} style={{ flex: 1, justifyContent: 'center' }}>
                  Start Solving (Enter)
                </motion.button>
                <a href={problem?.url ?? '#'} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                  <ExternalLink size={15} /> Open
                </a>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-secondary" onClick={handleSkip}>
                  <SkipForward size={15} /> Skip
                </motion.button>
              </div>
            </motion.div>
          )}

          {phase === 'solving' && (
            <motion.div key={`solving-${idx}`} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bento-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', fontWeight: 700, letterSpacing: '-0.06em', color: 'var(--color-primary)', marginBottom: '0.5rem', fontVariantNumeric: 'tabular-nums' }}>{fmt}</div>
              <p className="text-secondary" style={{ marginBottom: '2rem' }}>Solving: <strong>{problem?.title}</strong></p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-primary" onClick={() => setPhase('feedback')}>
                  <CheckCircle2 size={15} /> Done (Esc)
                </motion.button>
                <a href={problem?.url ?? '#'} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                  <ExternalLink size={15} /> Open External
                </a>
              </div>
            </motion.div>
          )}

          {phase === 'feedback' && (
            <motion.div key={`feedback-${idx}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bento-card" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>How did it go?</h3>
                <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>⏱ {fmt}</span>
              </div>
              <p className="text-secondary text-sm" style={{ marginBottom: '2rem' }}>{problem?.title}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {feedbackOptions.map(({ key, label, sub, color, xp }) => (
                  <motion.button key={key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleFeedback(key)} disabled={submitting} style={{ padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: `1px solid ${color}33`, background: `${color}0d`, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: submitting ? 0.6 : 1, transition: 'all 0.2s' }}>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 600, color, fontSize: '0.95rem' }}>{label}</div>
                      <div className="text-muted text-xs">{sub}</div>
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--color-xp)', fontSize: '0.875rem' }}>+{xp} XP</span>
                  </motion.button>
                ))}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 500, fontSize: '0.875rem' }}>Self-rate your confidence (1–5)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map(lvl => (
                    <button key={lvl} onClick={() => setConfidence(lvl)} style={{ flex: 1, height: 36, borderRadius: 'var(--radius-sm)', background: confidence >= lvl ? 'var(--color-primary)' : 'var(--color-bg-surface)', border: `1px solid ${confidence >= lvl ? 'var(--color-primary)' : 'var(--color-border-subtle)'}`, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.8rem', fontWeight: 600, color: confidence >= lvl ? '#fff' : 'var(--color-text-muted)' }}>{lvl}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderEmptyState = (message, subMessage) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '1.5rem', textAlign: 'center', padding: '2rem' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary) 0%, transparent 100%)', opacity: 0.8 }}>
        <BrainCircuit size={40} color="var(--color-text-primary)" style={{ position: 'absolute' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid var(--color-primary)', animation: 'pulse 2s infinite' }} />
      </div>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>{message}</h2>
        <p className="text-secondary">{subMessage}</p>
      </div>
    </motion.div>
  );

  const renderDueToday = () => {
    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}><Loader2 size={30} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} /></div>;
    if (error) return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '1rem' }}><p className="text-secondary">Failed to load revisions: {error}</p><button className="btn btn-primary" onClick={() => window.location.reload()}><RefreshCw size={15} /> Retry</button></div>;
    if (queue.length === 0) return renderEmptyState("All caught up!", "No scheduled revisions due today. Try a manual revision or add new problems.");

    return (
      <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }} className="bento-grid">
        {queue.map((item, i) => {
          const p = item.solved_problem?.problem;
          const { cls, label } = confBadge(item.solved_problem?.confidence || 3);
          const platformName = p?.coding_platforms?.name;
          const isSupported = ['LeetCode', 'Codeforces'].includes(platformName);
          
          return (
            <motion.div key={item.id} variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }} className="bento-card group" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className="text-muted text-xs" style={{ fontVariantNumeric: 'tabular-nums' }}>#{p?.external_problem_id || '—'}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: diffColor(p?.difficulty) }}>{p?.difficulty}</span>
                </div>
                <span className="badge" style={{ fontSize: '0.7rem', border: `1px solid ${isSupported ? (p?.coding_platforms?.color_hex || 'var(--color-primary)') : 'var(--color-border-subtle)'}40`, color: isSupported ? (p?.coding_platforms?.color_hex || 'inherit') : 'var(--color-text-muted)' }}>
                  {isSupported ? platformName : 'Legacy'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', margin: 0, lineHeight: 1.3, zIndex: 1 }}>{p?.title}</h3>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', zIndex: 1 }}>
                {p?.problem_tags?.slice(0, 2).map(t => <span key={t.tag} className="badge">{t.tag}</span>)}
                {p?.problem_companies?.slice(0, 1).map(c => <span key={c.company.name} className="badge" style={{ background: 'var(--color-bg-subtle)' }}>{c.company.name}</span>)}
                {item.solved_problem?.user_pattern && <span className="badge" style={{ border: '1px dashed var(--color-border-subtle)' }}>{item.solved_problem.user_pattern}</span>}
                <span className={`badge ${cls}`}>{label} confidence</span>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                <div>
                  <p className="text-muted text-[10px]" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Rev #{item.revision_number}</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 550, color: 'var(--color-revision)' }}>Due Today</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className="text-muted text-[10px]" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Avg Time</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 550, color: 'var(--color-text-secondary)' }}>{item.solved_problem?.solve_time_minutes ? `${item.solved_problem.solve_time_minutes}m` : '—'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', zIndex: 1 }}>
                <button className="btn btn-primary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem' }} onClick={() => startScheduledRevision(i)}>Start Revision</button>
                <button className="btn btn-secondary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem' }} onClick={() => navigate(`/library/${item.solved_problem?.id}`)}>Details</button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    );
  };

  const renderManualLibrary = () => {
    if (manualLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}><Loader2 size={30} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} /></div>;
    
    let filtered = [...manualProblems];
    
    if (sortOrder === 'Newest') filtered.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    else if (sortOrder === 'Oldest') filtered.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
    else if (sortOrder === 'Highest Confidence') filtered.sort((a,b) => b.confidence - a.confidence);
    else if (sortOrder === 'Lowest Confidence') filtered.sort((a,b) => a.confidence - b.confidence);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="bento-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="input-group" style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={16} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" className="input-field" placeholder="Search by title, number, pattern..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', paddingLeft: '2.5rem', background: 'var(--color-bg-glass)', border: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select className="input" style={{ width: 'auto', padding: '0.5rem 1rem' }} value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
              <option>Newest</option>
              <option>Oldest</option>
              <option>Highest Confidence</option>
              <option>Lowest Confidence</option>
            </select>
            <div style={{ display: 'flex', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.2rem' }}>
              <button onClick={() => setView('grid')} style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: view === 'grid' ? 'var(--color-bg-glass)' : 'transparent', border: 'none', cursor: 'pointer', color: view === 'grid' ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}><Grid size={16} /></button>
              <button onClick={() => setView('list')} style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: view === 'list' ? 'var(--color-bg-glass)' : 'transparent', border: 'none', cursor: 'pointer', color: view === 'list' ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}><List size={16} /></button>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? renderEmptyState("No problems found.", "Try adjusting your search filters or start solving some new problems.") : (
          view === 'list' ? (
            <div className="bento-card" style={{ padding: '0', overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Problem</th>
                    <th>Difficulty</th>
                    <th>Confidence</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(sp => {
                    const p = sp.problem;
                    const platformName = p?.coding_platforms?.name;
                    const isSupported = ['LeetCode', 'Codeforces'].includes(platformName);
                    return (
                      <tr key={sp.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{p?.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{isSupported ? platformName : 'Legacy'}</div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ color: diffColor(p?.difficulty), fontSize: '0.85rem', fontWeight: 600 }}>{p?.difficulty}</span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span className={`badge ${confBadge(sp.confidence).cls}`}>{confBadge(sp.confidence).label}</span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }} onClick={() => navigate(`/library/${sp.id}`)}>View</button>
                          <button className="btn btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }} onClick={() => startManualRevision(sp)}>Revise</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }} className="bento-grid">
              {filtered.map(sp => {
                const p = sp.problem;
                const { cls, label } = confBadge(sp.confidence);
                const platformName = p?.coding_platforms?.name;
                const isSupported = ['LeetCode', 'Codeforces'].includes(platformName);
                
                return (
                  <motion.div key={sp.id} variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -5 }} className="bento-card group" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate(`/library/${sp.id}`)}>
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span className="text-muted text-xs" style={{ fontVariantNumeric: 'tabular-nums' }}>#{p?.external_problem_id || '—'}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: diffColor(p?.difficulty) }}>{p?.difficulty}</span>
                      </div>
                      <span className="badge" style={{ fontSize: '0.7rem', border: `1px solid ${isSupported ? (p?.coding_platforms?.color_hex || 'var(--color-primary)') : 'var(--color-border-subtle)'}40`, color: isSupported ? (p?.coding_platforms?.color_hex || 'inherit') : 'var(--color-text-muted)' }}>
                        {isSupported ? platformName : 'Legacy'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', margin: 0, lineHeight: 1.3, zIndex: 1 }}>{p?.title}</h3>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', zIndex: 1 }}>
                      {p?.problem_tags?.slice(0, 2).map(t => <span key={t.tag} className="badge">{t.tag}</span>)}
                      {p?.problem_companies?.slice(0, 1).map(c => <span key={c.company.name} className="badge" style={{ background: 'var(--color-bg-subtle)' }}>{c.company.name}</span>)}
                      {sp.user_pattern && <span className="badge" style={{ border: '1px dashed var(--color-border-subtle)' }}>{sp.user_pattern}</span>}
                      <span className={`badge ${cls}`}>{label} confidence</span>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                      <div>
                        <p className="text-muted text-[10px]" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Status</p>
                        <p style={{ fontSize: '0.875rem', fontWeight: 550, color: 'var(--color-text-secondary)' }}>{sp.status === 'mastered' ? 'Mastered' : 'Revising'}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p className="text-muted text-[10px]" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Avg Time</p>
                        <p style={{ fontSize: '0.875rem', fontWeight: 550, color: 'var(--color-text-secondary)' }}>{sp.average_time ? `${sp.average_time}m` : sp.solve_time_minutes ? `${sp.solve_time_minutes}m` : '—'}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', zIndex: 1 }}>
                      <button className="btn btn-primary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem' }} onClick={(e) => { e.stopPropagation(); startManualRevision(sp); }}>Revise</button>
                      <button className="btn btn-secondary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem' }} onClick={(e) => { e.stopPropagation(); navigate(`/library/${sp.id}`); }}>Details</button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )
        )}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '2rem', paddingBottom: '4rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
      
      {!sessionActive && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.02em' }}>
                  <Library color="var(--color-primary)" size={28} />
                  Revision Hub
                </h1>
                <p className="text-secondary" style={{ fontSize: '1.05rem', maxWidth: '500px' }}>Review scheduled problems or practice any problem whenever you want to keep your skills sharp.</p>
              </div>

              {/* Stats Dashboard */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="bento-card" style={{ padding: '1rem 1.5rem', minWidth: '140px', background: 'var(--color-bg-glass)' }}>
                  <p className="text-muted text-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CalendarClock size={12}/> Due Today</p>
                  <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{stats?.due_today ?? 0}</p>
                </div>
                <div className="bento-card" style={{ padding: '1rem 1.5rem', minWidth: '140px', background: 'var(--color-bg-glass)' }}>
                  <p className="text-muted text-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle2 size={12}/> Completed</p>
                  <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-strong)' }}>{stats?.completed_today ?? 0}</p>
                </div>
                <div className="bento-card" style={{ padding: '1rem 1.5rem', minWidth: '140px', background: 'var(--color-bg-glass)' }}>
                  <p className="text-muted text-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Book size={12}/> Total</p>
                  <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>{stats?.total_revisions ?? 0}</p>
                </div>
                <div className="bento-card" style={{ padding: '1rem 1.5rem', minWidth: '140px', background: 'var(--color-bg-glass)' }}>
                  <p className="text-muted text-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Zap size={12}/> Avg Time</p>
                  <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>{stats?.average_time ?? 0}<span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 500, marginLeft: '0.2rem' }}>m</span></p>
                </div>
                <div className="bento-card" style={{ padding: '1rem 1.5rem', minWidth: '140px', background: 'var(--color-bg-glass)' }}>
                  <p className="text-muted text-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Flame size={12}/> Success</p>
                  <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-strong)' }}>{stats?.success_rate ?? 0}<span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 500, marginLeft: '0.2rem' }}>%</span></p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', background: 'var(--color-bg-surface)', padding: '0.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', marginBottom: '2.5rem', width: 'fit-content', position: 'relative' }}>
            <motion.div
              layoutId="activeTabIndicator"
              style={{ position: 'absolute', left: '0.25rem', background: 'var(--color-bg-glass)', borderRadius: 'var(--radius-md)', top: '0.25rem', bottom: '0.25rem', border: '1px solid var(--color-border-subtle)', zIndex: 0 }}
              initial={false}
              animate={{
                width: activeTab === 'due_today' ? '130px' : '170px',
                x: activeTab === 'due_today' ? 0 : 130
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
            <button
              onClick={() => setActiveTab('due_today')}
              style={{ position: 'relative', zIndex: 1, padding: '0.5rem 1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: activeTab === 'due_today' ? 'var(--color-text-primary)' : 'var(--color-text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', width: '130px', justifyContent: 'center' }}
            >
              <CalendarClock size={16} /> Due Today
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              style={{ position: 'relative', zIndex: 1, padding: '0.5rem 1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: activeTab === 'manual' ? 'var(--color-text-primary)' : 'var(--color-text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', width: '170px', justifyContent: 'center' }}
            >
              <BookOpen size={16} /> Manual Practice
            </button>
          </div>
        </>
      )}

      {sessionActive ? renderActiveSession() : (activeTab === 'due_today' ? renderDueToday() : renderManualLibrary())}

    </div>
  );
}
