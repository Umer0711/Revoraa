import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ExternalLink, Star, Edit3, Trash2,
  CalendarClock, CheckCircle2, Clock, Target,
  TrendingUp, BookOpen, AlertCircle, Save, Loader2, Plus, X, Trash, Play
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getSolvedProblemById, updateSolvedProblem, recordSolveAttempt, formatDuration, formatTimerDisplay } from '../lib/problemsService';
import { supabase } from '../lib/supabaseClient';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

const diffColor = d => d === 'Easy' ? 'var(--color-strong)' : d === 'Medium' ? 'var(--color-revision)' : 'var(--color-weak)';
const confLabel = c => c >= 4 ? 'High' : c === 3 ? 'Medium' : 'Low';
const confColor = c => c >= 4 ? 'var(--color-strong)' : c === 3 ? 'var(--color-revision)' : 'var(--color-weak)';

const srSchedule = ['Day 1', 'Day 2', 'Day 4', 'Day 7', 'Day 14', 'Day 30', 'Day 60', 'Day 90', 'Day 180'];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 22 } } };

const AccentBar = ({ color }) => (
  <div style={{ position: 'absolute', top: 0, left: '1.5rem', right: '1.5rem', height: '1px', background: `linear-gradient(to right, transparent, ${color}, transparent)`, opacity: 0.55 }} />
);

function formatNextRevision(dateStr) {
  if (!dateStr) return '—';
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(dateStr); d.setHours(0,0,0,0);
  const diff = Math.round((d - today) / 86400000);
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return `In ${diff} days`;
}

export function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState('');
  
  // Issue Management
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState('');
  
  const [fav, setFav] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchProblem = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSolvedProblemById(id);
      setProblem(data);
      setNotes(data.notes || '');
      
      let parsedIssues = [];
      if (data.mistakes) {
        try {
          parsedIssues = JSON.parse(data.mistakes);
          if (!Array.isArray(parsedIssues)) parsedIssues = [data.mistakes];
        } catch(e) {
          parsedIssues = [data.mistakes];
        }
      }
      setIssues(parsedIssues);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (user) fetchProblem();
  }, [user, fetchProblem]);

  const handleSaveNotes = async () => {
    try {
      setSaveLoading(true);
      await updateSolvedProblem(id, { notes });
      setEditing(false);
      setProblem(prev => ({ ...prev, notes }));
    } catch (err) {
      alert("Failed to save notes: " + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const saveIssuesToDb = async (newIssues) => {
    try {
      await updateSolvedProblem(id, { mistakes: JSON.stringify(newIssues) });
      setIssues(newIssues);
      setProblem(prev => ({ ...prev, mistakes: JSON.stringify(newIssues) }));
    } catch (err) {
      alert("Failed to update issues: " + err.message);
    }
  };

  const handleAddIssue = (e) => {
    e.preventDefault();
    if (!newIssue.trim()) return;
    const updated = [...issues, newIssue.trim()];
    setNewIssue('');
    saveIssuesToDb(updated);
  };

  const handleRemoveIssue = (index) => {
    const updated = issues.filter((_, i) => i !== index);
    saveIssuesToDb(updated);
  };

  const handleClearAllIssues = () => {
    if (window.confirm("Are you sure you want to clear all issues?")) {
      saveIssuesToDb([]);
    }
  };

  const handleDelete = async () => {
    try {
      await supabase.from('solved_problems').update({ deleted_at: new Date().toISOString() }).eq('id', id);
      navigate('/library');
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  // Active Solving Session State (persisted in localStorage across reload / navigation)
  const sessionKey = user && problem?.problem_id ? `revoraa_solve_session_${user.id}_${problem.problem_id}` : null;
  const [solveSession, setSolveSession] = useState(null);
  const [timerElapsed, setTimerElapsed] = useState(0);

  // Solve Completion Modal State
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [modalDuration, setModalDuration] = useState(60);
  const [solveConfidence, setSolveConfidence] = useState(4);
  const [solveResult, setSolveResult] = useState('easy');
  const [solveNotes, setSolveNotes] = useState('');
  const [solveSubmitting, setSolveSubmitting] = useState(false);

  // Restore solve session on problem load or key change
  useEffect(() => {
    if (!sessionKey) return;
    try {
      const saved = localStorage.getItem(sessionKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.startedAt) {
          setSolveSession(parsed);
          const elapsed = Math.max(0, Math.floor((Date.now() - parsed.startedAt) / 1000));
          setTimerElapsed(elapsed);
        }
      } else {
        setSolveSession(null);
        setTimerElapsed(0);
      }
    } catch (e) {
      console.warn('Failed to restore solve session', e);
    }
  }, [sessionKey]);

  // Live timer interval
  useEffect(() => {
    if (!solveSession?.startedAt) {
      return;
    }
    const update = () => {
      const elapsed = Math.max(0, Math.floor((Date.now() - solveSession.startedAt) / 1000));
      setTimerElapsed(elapsed);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [solveSession]);

  const handleStartSolving = () => {
    if (!sessionKey || !problem) return;
    const newSession = {
      problemId: problem.problem_id,
      solvedProblemId: problem.id,
      startedAt: Date.now()
    };
    try {
      localStorage.setItem(sessionKey, JSON.stringify(newSession));
    } catch {}
    setSolveSession(newSession);
    setTimerElapsed(0);
  };

  const handleCancelSolving = () => {
    if (window.confirm("Cancel this solving session? The timer will be discarded.")) {
      if (sessionKey) {
        try { localStorage.removeItem(sessionKey); } catch {}
      }
      setSolveSession(null);
      setTimerElapsed(0);
    }
  };

  const handleOpenCompletionModal = () => {
    const duration = timerElapsed > 0 ? timerElapsed : 60;
    setModalDuration(duration);
    setSolveConfidence(problem.confidence || 4);
    setSolveResult('easy');
    setSolveNotes('');
    setShowCompletionModal(true);
  };

  const handleSubmitAttempt = async (e) => {
    if (e) e.preventDefault();
    if (!user || !problem || solveSubmitting) return;

    setSolveSubmitting(true);
    try {
      const startTimestamp = solveSession?.startedAt 
        ? new Date(solveSession.startedAt).toISOString() 
        : new Date(Date.now() - modalDuration * 1000).toISOString();
      const endTimestamp = new Date().toISOString();

      await recordSolveAttempt({
        userId: user.id,
        problemId: problem.problem_id,
        solvedProblemId: problem.id,
        durationSeconds: modalDuration,
        confidence: solveConfidence,
        result: solveResult,
        notes: solveNotes.trim() || null,
        startedAt: startTimestamp,
        completedAt: endTimestamp
      });

      // Clear session
      if (sessionKey) {
        try { localStorage.removeItem(sessionKey); } catch {}
      }
      setSolveSession(null);
      setTimerElapsed(0);
      setShowCompletionModal(false);

      // Refresh problem state immediately
      await fetchProblem();

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('REFETCH_ANALYTICS'));
      }
    } catch (err) {
      console.error("Failed to record solve attempt:", err);
      alert("Error saving attempt: " + (err.message || 'Please try again.'));
    } finally {
      setSolveSubmitting(false);
    }
  };

  const chartData = useMemo(() => {
    const attempts = problem?.revision_attempts;
    if (!attempts || attempts.length === 0) {
      if (problem?.solve_time_minutes != null) {
        return [{
          name: 'Initial',
          attemptLabel: 'Initial Solve',
          time: problem.solve_time_minutes,
          durationSeconds: problem.solve_time_minutes * 60,
          formattedDuration: formatDuration(problem.solve_time_minutes * 60),
          confidence: problem.confidence || 0,
          date: new Date(problem.first_solved_at || problem.created_at).getTime(),
          dateStr: new Date(problem.first_solved_at || problem.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          result: 'easy'
        }];
      }
      return [];
    }

    // Sort strictly chronological (oldest to newest)
    const sorted = [...attempts].sort((a, b) => new Date(a.created_at || a.completed_at || 0) - new Date(b.created_at || b.completed_at || 0));

    return sorted.map((att, i) => {
      const durSec = att.duration_seconds != null ? att.duration_seconds : (att.time_taken ? att.time_taken * 60 : 0);
      const durMins = att.time_taken != null ? att.time_taken : Math.round(durSec / 60);
      const d = new Date(att.created_at || att.completed_at || Date.now());
      return {
        name: i === 0 ? 'Initial' : `Rev ${i}`,
        attemptLabel: i === 0 ? 'Initial Solve' : `Revision ${i}`,
        time: durMins,
        durationSeconds: durSec,
        formattedDuration: formatDuration(durSec),
        confidence: att.confidence || 0,
        date: d.getTime(),
        dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        result: att.result || 'easy'
      };
    });
  }, [problem]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 className="spinner" size={32} color="var(--color-primary)" />
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}>
          <p style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--color-text-muted)' }}>404</p>
          <h2 style={{ marginBottom: '0.5rem' }}>Problem not found</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>This problem doesn't exist in your library.</p>
          <Link to="/library" className="btn btn-primary" style={{ textDecoration: 'none' }}>← Back to Library</Link>
        </motion.div>
      </div>
    );
  }

  const p = problem.problem || {};
  const platform = p.coding_platforms;
  const nextRev = problem.revision_schedule?.[0]?.next_revision_date;
  const revLabel = formatNextRevision(nextRev);
  
  const stats = problem.stats || {};
  const bestTimeDisplay = stats.best_time_seconds 
    ? formatDuration(stats.best_time_seconds) 
    : (stats.best_time_minutes || problem.solve_time_minutes ? `${stats.best_time_minutes || problem.solve_time_minutes}m` : '—');

  const avgTimeDisplay = stats.average_time_seconds 
    ? formatDuration(stats.average_time_seconds) 
    : (stats.average_time_minutes || problem.solve_time_minutes ? `${stats.average_time_minutes || problem.solve_time_minutes}m` : '—');

  const totalAttempts = stats.total_attempts || (problem.revision_attempts?.length || (problem.solve_time_minutes ? 1 : 0));
  const rawImprovement = stats.improvement_percentage != null ? Math.round(stats.improvement_percentage) : 0;
  const improvementDisplay = totalAttempts > 1 
    ? (rawImprovement > 0 ? `+${rawImprovement}%` : rawImprovement < 0 ? `${rawImprovement}%` : '0%') 
    : 'Baseline';
  const improvementColor = totalAttempts > 1 
    ? (rawImprovement > 0 ? 'var(--color-strong)' : rawImprovement < 0 ? 'var(--color-weak)' : 'var(--color-text-muted)')
    : 'var(--color-text-muted)';

  const attemptsCount = (problem.revision_attempts && problem.revision_attempts.length > 0)
    ? problem.revision_attempts.length
    : (problem.revision_history?.length || (problem.solve_time_minutes ? 1 : 0));

  return (
    <div style={{ maxWidth: 960, paddingBottom: '4rem' }}>
      {/* Back nav */}
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: '1.75rem' }}>
        <Link
          to="/library"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}
        >
          <ArrowLeft size={14} /> Back to Library
        </Link>
      </motion.div>

      {/* ── Hero header ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        className="bento-card"
        style={{ position: 'relative', marginBottom: '1.25rem' }}
      >
        <AccentBar color={diffColor(p.difficulty)} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.625rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>#{p.external_problem_id || '—'}</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 650, color: diffColor(p.difficulty), letterSpacing: '0.02em' }}>{p.difficulty || 'Unknown'}</span>
              {problem.status === 'mastered' && <CheckCircle2 size={15} color="var(--color-strong)" />}
            </div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{p.title}</h1>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {p.problem_tags?.map(t => <span key={t.tag} className="badge">{t.tag}</span>)}
              {p.problem_companies?.map(c => <span key={c.company.name} className="badge" style={{ background: 'var(--color-bg-subtle)' }}>{c.company.name}</span>)}
              {problem.user_pattern && <span className="badge" style={{ border: '1px dashed var(--color-border-subtle)' }}>{problem.user_pattern}</span>}
              {platform ? (
                <span className="badge" style={{ border: `1px solid ${platform.color_hex || 'var(--color-primary)'}`, color: platform.color_hex || 'inherit' }}>
                  {platform.name}
                </span>
              ) : (
                <span className="badge" style={{ border: '1px solid var(--color-border-subtle)' }}>Custom</span>
              )}
              <span className="badge" style={{ color: confColor(problem.confidence), borderColor: `color-mix(in srgb, ${confColor(problem.confidence)} 30%, transparent)` }}>
                {confLabel(problem.confidence)} Confidence
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, alignItems: 'center', flexWrap: 'wrap' }}>
            {solveSession ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '9999px',
                    background: 'rgba(34, 197, 94, 0.12)',
                    border: '1px solid rgba(34, 197, 94, 0.35)',
                    color: 'var(--color-strong)',
                    fontFamily: 'monospace',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em'
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-strong)', display: 'inline-block' }} />
                  {formatTimerDisplay(timerElapsed)}
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="btn btn-primary"
                  onClick={handleOpenCompletionModal}
                  style={{ fontSize: '0.82rem', padding: '0.42rem 0.9rem', gap: '0.4rem' }}
                >
                  <CheckCircle2 size={15} /> I Solved It
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="btn btn-secondary"
                  onClick={handleCancelSolving}
                  title="Cancel solving timer"
                  style={{ fontSize: '0.82rem', padding: '0.42rem 0.65rem' }}
                >
                  <X size={15} />
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="btn btn-primary"
                onClick={handleStartSolving}
                style={{ fontSize: '0.82rem', padding: '0.42rem 0.9rem', gap: '0.4rem' }}
              >
                <Play size={14} fill="currentColor" /> Start Solving
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              className="btn-icon" onClick={() => setFav(f => !f)}
              aria-label="Favourite"
              style={{ color: fav ? 'var(--color-revision)' : 'var(--color-text-muted)' }}
            >
              <Star size={17} fill={fav ? 'currentColor' : 'none'} />
            </motion.button>
            <a
              href={p.url || (p.slug && `https://leetcode.com/problems/${p.slug}/`) || '#'} target="_blank" rel="noreferrer"
              className="btn btn-secondary"
              style={{ textDecoration: 'none', fontSize: '0.82rem' }}
            >
              <ExternalLink size={14} /> Open Problem
            </a>
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              className="btn-icon"
              onClick={() => setShowDeleteConfirm(true)}
              style={{ color: 'var(--color-mistakes)' }}
              aria-label="Delete problem"
            >
              <Trash2 size={17} />
            </motion.button>
          </div>
        </div>

        {/* Quick stats row */}
        <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border-subtle)', flexWrap: 'wrap' }}>
          {[
            { icon: Clock, label: 'Best Time', value: bestTimeDisplay, color: 'var(--color-strong)' },
            { icon: Clock, label: 'Avg Time', value: avgTimeDisplay, color: 'var(--color-analytics)' },
            { icon: TrendingUp, label: 'Improvement', value: improvementDisplay, color: improvementColor },
            { icon: CalendarClock, label: 'Next Revision', value: revLabel, color: 'var(--color-revision)' },
            { icon: Target, label: 'Confidence', value: `${problem.confidence ?? 0}/5`, color: confColor(problem.confidence) },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icon size={15} color={color} style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{label}</p>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', color, margin: 0 }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Active Solving Session Banner */}
      {solveSession && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bento-card"
          style={{
            marginBottom: '1.25rem',
            padding: '1rem 1.5rem',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(14, 165, 233, 0.06) 100%)',
            border: '1px solid rgba(34, 197, 94, 0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-strong)', boxShadow: '0 0 10px var(--color-strong)' }} />
            <div>
              <p style={{ fontWeight: 650, fontSize: '0.9rem', margin: 0, color: 'var(--color-text-primary)' }}>
                Active Solving Session in Progress
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Started at {new Date(solveSession.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Live timer running
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-strong)' }}>
              {formatTimerDisplay(timerElapsed)}
            </span>
            <button className="btn btn-primary" onClick={handleOpenCompletionModal} style={{ fontSize: '0.85rem', gap: '0.4rem' }}>
              <CheckCircle2 size={15} /> Finish & Log Solve
            </button>
            <button className="btn btn-secondary" onClick={handleCancelSolving} style={{ fontSize: '0.85rem' }}>
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* ── Bento grid ───────────────────────────────────────────────────────── */}
      <motion.div className="bento-grid" variants={container} initial="hidden" animate="show">
      
        {/* Analytics Charts */}
        <motion.div variants={item} className="bento-card col-span-4" style={{ position: 'relative' }}>
          <AccentBar color="var(--color-analytics)" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={15} color="var(--color-analytics)" />
              <h3 style={{ margin: 0 }}>Timeline & Progression</h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              {chartData.length} recorded data point{chartData.length === 1 ? '' : 's'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Time Trend */}
            <div style={{ flex: 1, minWidth: 300 }}>
              <h4 className="text-secondary text-sm" style={{ marginBottom: '1rem', textAlign: 'center' }}>Time Taken (minutes)</h4>
              <div style={{ height: 180, width: '100%' }}>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
                      <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} width={30} />
                      <RechartsTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', padding: '0.625rem 0.875rem', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
                                <p style={{ fontWeight: 650, fontSize: '0.82rem', marginBottom: '0.2rem', color: 'var(--color-text-primary)' }}>{data.attemptLabel}</p>
                                <p style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{data.dateStr}</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-analytics)', fontWeight: 600, margin: 0 }}>⏱ Time: {data.formattedDuration}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line type="monotone" dataKey="time" stroke="var(--color-analytics)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p className="text-muted text-sm">Not enough data to plot time.</p>
                  </div>
                )}
              </div>
            </div>
            {/* Confidence Trend */}
            <div style={{ flex: 1, minWidth: 300 }}>
              <h4 className="text-secondary text-sm" style={{ marginBottom: '1rem', textAlign: 'center' }}>Confidence Progression</h4>
              <div style={{ height: 180, width: '100%' }}>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
                      <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 5]} stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} width={30} tickCount={6} />
                      <RechartsTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', padding: '0.625rem 0.875rem', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
                                <p style={{ fontWeight: 650, fontSize: '0.82rem', marginBottom: '0.2rem', color: 'var(--color-text-primary)' }}>{data.attemptLabel}</p>
                                <p style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{data.dateStr}</p>
                                <p style={{ fontSize: '0.8rem', color: confColor(data.confidence), fontWeight: 600, margin: 0 }}>★ Confidence: {data.confidence} / 5</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="confidence" radius={[4, 4, 0, 0]} maxBarSize={40}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={confColor(entry.confidence)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p className="text-muted text-sm">Not enough data to plot confidence.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notes Card */}
        <motion.div variants={item} className="bento-card col-span-2" style={{ position: 'relative' }}>
          <AccentBar color="var(--color-readiness)" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={15} color="var(--color-readiness)" />
              <h3 style={{ margin: 0 }}>Notes</h3>
            </div>
            {editing ? (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.875rem' }}
                onClick={handleSaveNotes}
                disabled={saveLoading}
              >
                {saveLoading ? <Loader2 className="spinner" size={13} /> : <Save size={13} />} Save
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                className="btn-icon" onClick={() => setEditing(e => !e)}
                aria-label="Edit notes"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <Edit3 size={17} />
              </motion.button>
            )}
          </div>
          <AnimatePresence mode="wait">
            {editing ? (
              <motion.textarea
                key="edit"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Write your approach, key observations, or edge cases…"
                className="input-field"
                style={{ minHeight: 120, resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit' }}
                autoFocus
              />
            ) : (
              <motion.p
                key="view"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-secondary"
                style={{ fontSize: '0.875rem', lineHeight: 1.7, minHeight: 60, cursor: 'text', whiteSpace: 'pre-wrap' }}
                onClick={() => setEditing(true)}
              >
                {notes || <span className="text-muted">Click the edit icon to add notes…</span>}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Issue Management Card */}
        <motion.div variants={item} className="bento-card col-span-2" style={{ position: 'relative' }}>
          <AccentBar color="var(--color-mistakes)" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={15} color="var(--color-mistakes)" />
              <h3 style={{ margin: 0 }}>Issue Tracker</h3>
            </div>
            {issues.length > 0 && (
              <button 
                className="btn text-sm" 
                style={{ padding: '0.25rem 0.5rem', background: 'transparent', color: 'var(--color-mistakes)' }}
                onClick={handleClearAllIssues}
              >
                Clear All
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <form onSubmit={handleAddIssue} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="input-field" 
                style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} 
                placeholder="Log a new mistake or issue..." 
                value={newIssue}
                onChange={(e) => setNewIssue(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 0.75rem' }} disabled={!newIssue.trim()}>
                <Plus size={16} /> Add
              </button>
            </form>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 200, overflowY: 'auto', paddingRight: '0.5rem' }}>
              {issues.length === 0 ? (
                <p className="text-muted text-sm text-center" style={{ padding: '1rem 0' }}>No issues logged yet.</p>
              ) : (
                issues.map((issue, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0.75rem', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>{issue}</span>
                    <button 
                      onClick={() => handleRemoveIssue(idx)}
                      className="btn-icon" 
                      style={{ color: 'var(--color-text-muted)', padding: '0.25rem' }}
                      title="Resolve Issue"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>

        {/* Spaced Repetition Timeline */}
        <motion.div variants={item} className="bento-card col-span-4" style={{ position: 'relative' }}>
          <AccentBar color="var(--color-revision)" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarClock size={15} color="var(--color-revision)" />
              <h3 style={{ margin: 0 }}>Spaced Repetition Schedule</h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              {problem.revision_schedule?.[0]?.next_revision_date ? `Next scheduled: ${revLabel}` : 'Schedule active'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {srSchedule.map((label, i) => {
              const isDone = i < attemptsCount;
              const isCurrent = i === attemptsCount;
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    flex: '1 0 auto',
                    minWidth: 68,
                    padding: '0.65rem 0.35rem',
                    background: isDone ? 'rgba(34,197,94,0.1)' : isCurrent ? 'rgba(245,158,11,0.1)' : 'var(--color-bg-surface)',
                    border: `1px solid ${isDone ? 'rgba(34,197,94,0.25)' : isCurrent ? 'rgba(245,158,11,0.35)' : 'var(--color-border-subtle)'}`,
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  {isDone && (
                    <div style={{ position: 'absolute', top: -6, right: -6, width: 15, height: 15, borderRadius: '50%', background: 'var(--color-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={11} color="#fff" />
                    </div>
                  )}
                  <p style={{ fontSize: '0.74rem', fontWeight: 650, color: isDone ? 'var(--color-strong)' : isCurrent ? 'var(--color-revision)' : 'var(--color-text-muted)', margin: 0 }}>{label}</p>
                  {isCurrent && <p style={{ fontSize: '0.65rem', color: 'var(--color-revision)', marginTop: '0.2rem', marginBottom: 0 }}>Due: {revLabel}</p>}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Solve & Revision History Log */}
        <motion.div variants={item} className="bento-card col-span-4" style={{ position: 'relative' }}>
          <AccentBar color="var(--color-primary)" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={15} color="var(--color-primary)" />
              <h3 style={{ margin: 0 }}>Solve & Revision History</h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              {problem.revision_attempts?.length || 0} total attempt{(problem.revision_attempts?.length || 0) === 1 ? '' : 's'} recorded
            </span>
          </div>
          {(!problem.revision_attempts || problem.revision_attempts.length === 0) ? (
            <p className="text-muted text-sm" style={{ textAlign: 'center', padding: '2rem 0' }}>No solve attempts logged yet.</p>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
              {[...problem.revision_attempts]
                .sort((a, b) => new Date(b.created_at || b.completed_at || 0) - new Date(a.created_at || a.completed_at || 0))
                .map((rev, idx, arr) => {
                  const attemptNum = rev.attempt_number || (arr.length - idx);
                  const durSec = rev.duration_seconds != null ? rev.duration_seconds : (rev.time_taken ? rev.time_taken * 60 : 0);
                  const durDisplay = formatDuration(durSec);
                  const resultColor = rev.result === 'easy' || rev.result === 'mastered' 
                    ? 'var(--color-strong)' 
                    : rev.result === 'failed' || rev.result === 'hard' 
                    ? 'var(--color-mistakes)' 
                    : 'var(--color-revision)';

                  return (
                    <div key={rev.id || idx} style={{ flexShrink: 0, minWidth: 220, padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span className="text-secondary text-sm font-semibold">
                          Attempt #{attemptNum}
                        </span>
                        <span className="text-muted text-xs" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {new Date(rev.created_at || rev.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                        <span style={{ fontSize: '0.72rem', textTransform: 'capitalize', padding: '0.2rem 0.5rem', borderRadius: '4px', background: `color-mix(in srgb, ${resultColor} 18%, transparent)`, color: resultColor, border: `1px solid color-mix(in srgb, ${resultColor} 40%, transparent)`, fontWeight: 650 }}>
                          {rev.result || 'solved'}
                        </span>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>
                          ⏱ {durDisplay}
                        </span>
                      </div>
                      {rev.confidence != null && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.74rem', color: confColor(rev.confidence) }}>
                          Confidence: {rev.confidence} / 5
                        </div>
                      )}
                      {rev.notes && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--color-text-muted)', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={rev.notes}>
                          "{rev.notes}"
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </motion.div>

      </motion.div>

      {/* Solve Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              zIndex: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              padding: '1rem'
            }}
            onClick={() => !solveSubmitting && setShowCompletionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="bento-card"
              style={{
                maxWidth: 480,
                width: '100%',
                padding: '2rem',
                position: 'relative'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Log Solve Attempt</h3>
                  <p className="text-secondary text-sm" style={{ marginTop: '0.25rem', marginBottom: 0 }}>
                    {p.title}
                  </p>
                </div>
                <button
                  className="btn-icon"
                  onClick={() => !solveSubmitting && setShowCompletionModal(false)}
                  style={{ color: 'var(--color-text-muted)' }}
                  disabled={solveSubmitting}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitAttempt}>
                {/* Duration */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Time Taken
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="number"
                      min="1"
                      className="input-field"
                      style={{ width: 100, fontSize: '1.1rem', fontWeight: 600, textAlign: 'center' }}
                      value={Math.max(1, Math.round(modalDuration / 60))}
                      onChange={(e) => setModalDuration(Math.max(1, parseInt(e.target.value) || 1) * 60)}
                      disabled={solveSubmitting}
                    />
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>minutes</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
                      ({formatDuration(modalDuration)})
                    </span>
                  </div>
                </div>

                {/* Result Type */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Result / Outcome
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    {[
                      { id: 'easy', label: 'Clean Solve', color: 'var(--color-strong)' },
                      { id: 'hint', label: 'Used Hint', color: 'var(--color-revision)' },
                      { id: 'failed', label: 'Struggled', color: 'var(--color-mistakes)' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSolveResult(opt.id)}
                        disabled={solveSubmitting}
                        style={{
                          padding: '0.6rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          background: solveResult === opt.id ? `color-mix(in srgb, ${opt.color} 18%, transparent)` : 'var(--color-bg-surface)',
                          border: `1px solid ${solveResult === opt.id ? opt.color : 'var(--color-border-subtle)'}`,
                          color: solveResult === opt.id ? opt.color : 'var(--color-text-secondary)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confidence */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Confidence Level: {solveConfidence} / 5 ({confLabel(solveConfidence)})
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSolveConfidence(star)}
                        disabled={solveSubmitting}
                        style={{
                          flex: 1,
                          padding: '0.55rem 0',
                          borderRadius: 'var(--radius-sm)',
                          background: star <= solveConfidence ? 'rgba(245, 158, 11, 0.15)' : 'var(--color-bg-surface)',
                          border: `1px solid ${star <= solveConfidence ? 'var(--color-revision)' : 'var(--color-border-subtle)'}`,
                          color: star <= solveConfidence ? 'var(--color-revision)' : 'var(--color-text-muted)',
                          fontSize: '0.85rem',
                          fontWeight: 750,
                          cursor: 'pointer'
                        }}
                      >
                        {star} ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Attempt Notes */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Attempt Notes / Reflections (Optional)
                  </label>
                  <textarea
                    rows={3}
                    className="input-field"
                    placeholder="Key observations, mistakes made, or time complexity notes..."
                    value={solveNotes}
                    onChange={e => setSolveNotes(e.target.value)}
                    disabled={solveSubmitting}
                    style={{ width: '100%', resize: 'none', fontSize: '0.85rem' }}
                  />
                </div>

                {/* Modal actions */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCompletionModal(false)}
                    disabled={solveSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={solveSubmitting}
                    style={{ minWidth: 120 }}
                  >
                    {solveSubmitting ? <Loader2 className="spinner" size={15} /> : 'Save Attempt'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm dialog */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="bento-card liquid-glass"
              style={{ maxWidth: 380, width: '90%', textAlign: 'center', padding: '2.5rem' }}
              onClick={e => e.stopPropagation()}
            >
              <Trash2 size={32} color="var(--color-mistakes)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>Remove Problem?</h3>
              <p className="text-secondary text-sm" style={{ marginBottom: '1.75rem' }}>
                This will remove <strong>"{p.title}"</strong> from your library including all notes, history, and revision data.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                <button
                  className="btn"
                  style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--color-mistakes)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '9999px' }}
                  onClick={handleDelete}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
