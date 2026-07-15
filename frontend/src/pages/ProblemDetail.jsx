import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ExternalLink, Star, Edit3, Trash2,
  CalendarClock, CheckCircle2, Clock, Target,
  TrendingUp, BookOpen, AlertCircle, Save, Loader2, Plus, X, Trash
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getSolvedProblemById, updateSolvedProblem } from '../lib/problemsService';
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

  const chartData = useMemo(() => {
    if (!problem?.revision_attempts) return [];
    
    // Initial solve attempt
    const initial = {
      name: 'Initial',
      time: problem.solve_time_minutes || 0,
      confidence: problem.confidence || 0,
      date: new Date(problem.first_solved_at).getTime()
    };
    
    // Sort attempts from oldest to newest
    const attempts = [...problem.revision_attempts].reverse().map((att, i) => ({
      name: `Rev ${i+1}`,
      time: att.time_taken || 0,
      confidence: att.confidence || 0,
      date: new Date(att.created_at).getTime()
    }));
    
    return [initial, ...attempts];
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

  const p = problem.problem;
  const tags = p.problem_tags?.map(t => t.tag).join(', ') || 'No Pattern';
  const company = p.problem_companies?.[0]?.company?.name || 'No Company';
  const platform = p.coding_platforms;
  const nextRev = problem.revision_schedule?.[0]?.next_revision_date;
  const revLabel = formatNextRevision(nextRev);
  const revHistory = problem.revision_history || [];
  
  const stats = problem.stats || {};
  const bestTime = stats.best_time_minutes || problem.solve_time_minutes || 0;
  const avgTime = stats.average_time_minutes || problem.solve_time_minutes || 0;
  const improvement = stats.improvement_percentage || 0;

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
              <span style={{ fontSize: '0.78rem', fontWeight: 650, color: diffColor(p.difficulty), letterSpacing: '0.02em' }}>{p.difficulty}</span>
              {problem.status === 'mastered' && <CheckCircle2 size={15} color="var(--color-strong)" />}
            </div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{p.title}</h1>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge">{tags}</span>
              <span className="badge">{company}</span>
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
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
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
            { icon: Clock, label: 'Best Time', value: bestTime ? `${bestTime}m` : '—', color: 'var(--color-strong)' },
            { icon: Clock, label: 'Avg Time', value: avgTime ? `${avgTime}m` : '—', color: 'var(--color-analytics)' },
            { icon: TrendingUp, label: 'Improvement', value: `${improvement > 0 ? '+' : ''}${improvement}%`, color: improvement > 0 ? 'var(--color-strong)' : 'var(--color-text-muted)' },
            { icon: CalendarClock, label: 'Next Revision', value: revLabel, color: 'var(--color-revision)' },
            { icon: Target, label: 'Confidence', value: `${problem.confidence ?? 0}/5`, color: confColor(problem.confidence) },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} style={{ display: 'flex', align: 'center', gap: '0.5rem' }}>
              <Icon size={15} color={color} style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', color }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Bento grid ───────────────────────────────────────────────────────── */}
      <motion.div className="bento-grid" variants={container} initial="hidden" animate="show">
      
        {/* Analytics Charts */}
        <motion.div variants={item} className="bento-card col-span-4" style={{ position: 'relative' }}>
          <AccentBar color="var(--color-analytics)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <TrendingUp size={15} color="var(--color-analytics)" />
            <h3 style={{ margin: 0 }}>Timeline</h3>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
                        contentStyle={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px' }}
                        itemStyle={{ color: 'var(--color-analytics)' }}
                        formatter={(value) => [`${value}m`, 'Time']}
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
                        contentStyle={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px' }}
                        formatter={(value) => [`${value}/5`, 'Confidence']}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <CalendarClock size={15} color="var(--color-revision)" />
            <h3 style={{ margin: 0 }}>Spaced Repetition Schedule</h3>
          </div>
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {srSchedule.map((label, i) => {
              const isDone = i < revHistory.length;
              const isCurrent = i === revHistory.length;
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    flex: '1 0 auto',
                    minWidth: 64,
                    padding: '0.625rem 0.25rem',
                    background: isDone ? 'rgba(34,197,94,0.1)' : isCurrent ? 'rgba(245,158,11,0.1)' : 'var(--color-bg-surface)',
                    border: `1px solid ${isDone ? 'rgba(34,197,94,0.25)' : isCurrent ? 'rgba(245,158,11,0.35)' : 'var(--color-border-subtle)'}`,
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  {isDone && (
                    <div style={{ position: 'absolute', top: -6, right: -6, width: 14, height: 14, borderRadius: '50%', background: 'var(--color-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={10} color="#fff" />
                    </div>
                  )}
                  <p style={{ fontSize: '0.72rem', fontWeight: 650, color: isDone ? 'var(--color-strong)' : isCurrent ? 'var(--color-revision)' : 'var(--color-text-muted)' }}>{label}</p>
                  {isCurrent && <p style={{ fontSize: '0.65rem', color: 'var(--color-revision)', marginTop: '0.2rem' }}>Due: {revLabel}</p>}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Revision History Log */}
        <motion.div variants={item} className="bento-card col-span-4" style={{ position: 'relative' }}>
          <AccentBar color="var(--color-primary)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <TrendingUp size={15} color="var(--color-primary)" />
            <h3 style={{ margin: 0 }}>Revision Log</h3>
          </div>
          {problem.revision_attempts?.length === 0 ? (
            <p className="text-muted text-sm" style={{ textAlign: 'center', padding: '2rem 0' }}>No revisions completed yet.</p>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
              {problem.revision_attempts?.map((rev, idx) => (
                <div key={rev.id || idx} style={{ flexShrink: 0, minWidth: 200, padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="text-secondary text-sm font-semibold">
                      {rev.attempt_type === 'manual_revision' ? 'Manual Rev' : 'Scheduled Rev'}
                    </span>
                    <span className="text-muted text-xs" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {new Date(rev.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: rev.result === 'mastered' ? 'var(--color-strong)' : rev.result === 'hard' ? 'var(--color-weak)' : 'var(--color-revision)', color: '#fff', fontWeight: 600 }}>
                      {rev.result}
                    </span>
                    <span className="text-muted text-xs font-semibold">{rev.time_taken ? `${rev.time_taken}m` : '—'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

      </motion.div>

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
