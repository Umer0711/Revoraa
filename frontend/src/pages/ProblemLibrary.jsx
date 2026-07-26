import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Plus, List, LayoutGrid, KanbanSquare, CheckCircle2, Circle, Clock, X, ArrowUpDown, ArrowUp, ArrowDown, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserProblems } from '../lib/problemsService';
import './ProblemLibrary.css';
import { SEO } from '../components/SEO';


const diffColor = d => d === 'Easy' ? 'var(--color-strong)' : d === 'Medium' ? 'var(--color-revision)' : 'var(--color-weak)';
const confBadge = c => c >= 4 ? { cls: 'badge-success', label: 'High' } : c === 3 ? { cls: 'badge-warning', label: 'Med' } : { cls: 'badge-danger', label: 'Low' };
const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const row       = { hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 220, damping: 24 } } };
const card      = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 24 } } };

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

function EmptyState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 2rem', gap: '1rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📭</div>
      <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>No problems yet</p>
      <p className="text-muted text-sm">Start adding problems you've solved and build your revision library.</p>
      <Link to="/add-problem" className="btn btn-primary" style={{ textDecoration: 'none', marginTop: '0.5rem' }}>
        <Plus size={14} /> Add Your First Problem
      </Link>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {[...Array(8)].map((_, i) => (
        <td key={i}><div style={{ height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 4, width: i === 2 ? '80%' : '50%' }} /></td>
      ))}
    </tr>
  );
}

export function ProblemLibrary() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [view, setView]             = useState('table');
  const [query, setQuery]           = useState('');
  const [diffFilter, setDiffFilter] = useState('All');
  const [sort, setSort]             = useState({ key: 'first_solved_at', dir: 'desc' });
  const [problems, setProblems]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  // Clear data immediately when user changes to prevent data leaking
  useEffect(() => {
    setProblems([]);
    setLoading(true);
  }, [user?.id]);

  const fetchProblems = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserProblems(user.id, { query, difficulty: diffFilter });
      setProblems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, query, diffFilter]);

  useEffect(() => {
    const t = setTimeout(fetchProblems, 250); // debounce search
    return () => clearTimeout(t);
  }, [fetchProblems]);

  const toggleSort = (key) => {
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });
  };

  const SortIcon = ({ k }) => {
    if (sort.key !== k) return <ArrowUpDown size={12} style={{ marginLeft: 4, opacity: 0.35 }} />;
    return sort.dir === 'asc' ? <ArrowUp size={12} style={{ marginLeft: 4, color: 'var(--color-primary)' }} /> : <ArrowDown size={12} style={{ marginLeft: 4, color: 'var(--color-primary)' }} />;
  };

  const sorted = useMemo(() => {
    return [...problems].sort((a, b) => {
      let va, vb;
      if (sort.key === 'title') { va = a.problem?.title; vb = b.problem?.title; }
      else if (sort.key === 'difficulty') { va = diffOrder[a.problem?.difficulty]; vb = diffOrder[b.problem?.difficulty]; }
      else if (sort.key === 'confidence') { va = a.confidence; vb = b.confidence; }
      else if (sort.key === 'number') { va = Number(a.problem?.external_problem_id); vb = Number(b.problem?.external_problem_id); }
      else { va = a[sort.key] ?? ''; vb = b[sort.key] ?? ''; }
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sort.dir === 'asc' ? -1 : 1;
      if (va > vb) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [problems, sort]);

  return (
    <div className="library-page">
      <SEO title="Problem Library" url="https://revoraa.com/library" />
      {/* Sticky header */}
      <header className="page-header" style={{ position: 'sticky', top: 0, zIndex: 20, margin: '0 -3.5rem 2.5rem', padding: '1.5rem 3.5rem', background: 'var(--color-bg-overlay)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ marginBottom: '0.2rem' }}>Problem Library</h1>
            <p className="text-secondary text-sm">{loading ? 'Loading…' : `${sorted.length} problem${sorted.length !== 1 ? 's' : ''}`}</p>
          </div>
          <Link to="/add-problem" className="btn btn-primary" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <Plus size={15} /> Add Problem
          </Link>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.875rem', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)' }}>
            <Search size={15} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Search by #, title, pattern…"
              value={query}
              onChange={e => {
                const v = e.target.value;
                startTransition(() => setQuery(v));
              }}
              style={{ background: 'transparent', border: 'none', color: 'var(--color-text-primary)', outline: 'none', fontSize: '0.875rem', width: '100%', fontFamily: 'inherit' }}
              aria-label="Search problems"
            />
            {query && (
              <button onClick={() => startTransition(() => setQuery(''))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Difficulty Dropdown Select with custom down arrow mark */}
          <select
            className="select-filter"
            value={diffFilter}
            onChange={e => {
              const v = e.target.value;
              startTransition(() => setDiffFilter(v));
            }}
            style={{ padding: '0.45rem 2.5rem 0.45rem 0.875rem', fontSize: '0.82rem', height: '100%' }}
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Difficulty filter pills */}
          {['All', 'Easy', 'Medium', 'Hard'].map(d => (
            <motion.button
              key={d}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => startTransition(() => setDiffFilter(d))}
              className="btn"
              style={{
                padding: '0.45rem 0.875rem',
                fontSize: '0.82rem',
                background: diffFilter === d ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                color: diffFilter === d ? '#fff' : 'var(--color-text-secondary)',
                border: `1px solid ${diffFilter === d ? 'transparent' : 'var(--color-border-subtle)'}`,
              }}
            >
              {d}
            </motion.button>
          ))}

          {/* View toggle */}
          <div style={{ display: 'flex', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.2rem', gap: '0.1rem', marginLeft: 'auto' }}>
            {[
              { key: 'table', Icon: List },
              { key: 'grid',  Icon: LayoutGrid },
              { key: 'kanban', Icon: KanbanSquare, disabled: true },
            ].map(({ key, Icon, disabled }) => (
              <motion.button
                key={key}
                onClick={() => !disabled && setView(key)}
                whileHover={!disabled ? { scale: 1.08 } : {}}
                className="btn-icon"
                title={disabled ? `${key} (Coming Soon)` : key}
                style={{
                  padding: '0.35rem 0.5rem',
                  background: view === key ? 'var(--color-border-hover)' : 'transparent',
                  borderRadius: 'var(--radius-sm)',
                  opacity: disabled ? 0.4 : 1,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  color: view === key ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                }}
              >
                <Icon size={15} />
              </motion.button>
            ))}
          </div>
        </div>
      </header>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: '#f87171', marginBottom: '1.5rem' }}>
          Failed to load problems: {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* TABLE VIEW */}
        {view === 'table' && (
          <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bento-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}></th>
                  <th style={{ width: 52, cursor: 'pointer' }} onClick={() => toggleSort('number')}><span style={{ display: 'flex', alignItems: 'center' }}>#<SortIcon k="number" /></span></th>
                  <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('title')}><span style={{ display: 'flex', alignItems: 'center' }}>Title<SortIcon k="title" /></span></th>
                  <th>Tags</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('difficulty')}><span style={{ display: 'flex', alignItems: 'center' }}>Difficulty<SortIcon k="difficulty" /></span></th>
                  <th>Company</th>
                  <th>Platform</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('confidence')}><span style={{ display: 'flex', alignItems: 'center' }}>Confidence<SortIcon k="confidence" /></span></th>
                  <th>Next Revision</th>
                </tr>
              </thead>
              <motion.tbody variants={container} initial="hidden" animate="show">
                {loading ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                ) : sorted.length === 0 ? (
                  <tr>
                    <td colSpan={9}>
                      <EmptyState />
                    </td>
                  </tr>
                ) : sorted.map(sp => {
                  const p = sp.problem;
                  const { cls, label } = confBadge(sp.confidence);
                  const nextRev = sp.revision_schedule?.[0]?.next_revision_date;
                  const revLabel = formatNextRevision(nextRev);
                  const isUrgent = revLabel === 'Today' || revLabel.includes('overdue');
                  const tags = p?.problem_tags?.slice(0, 2) ?? [];
                  const companies = p?.problem_companies?.slice(0, 1) ?? [];

                  return (
                    <motion.tr variants={row} key={sp.id} onClick={() => navigate(`/library/${sp.id}`)} style={{ cursor: 'pointer' }}>
                      <td style={{ textAlign: 'center', paddingLeft: '1rem' }}>
                        {sp.status === 'mastered'
                          ? <CheckCircle2 size={15} color="var(--color-strong)" />
                          : sp.status === 'revising'
                          ? <Clock size={15} color="var(--color-revision)" />
                          : <Circle size={15} color="var(--color-text-muted)" />
                        }
                      </td>
                      <td style={{ color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>{p?.external_problem_id}</td>
                      <td style={{ fontWeight: 550, color: 'var(--color-text-primary)' }}>{p?.title}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                          {tags.map(t => <span key={t.tag} className="badge">{t.tag}</span>)}
                        </div>
                      </td>
                      <td style={{ color: diffColor(p?.difficulty), fontWeight: 500 }}>
                        {p?.difficulty || 'Medium'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                          {companies.map(c => <span key={c.company.name} className="badge" style={{ background: 'var(--color-bg-subtle)' }}>{c.company.name}</span>)}
                        </div>
                      </td>
                      <td>
                        {p?.coding_platforms ? (
                          <span className="badge" style={{ border: `1px solid ${['LeetCode', 'Codeforces'].includes(p.coding_platforms.name) ? (p.coding_platforms.color_hex || 'var(--color-primary)') : 'var(--color-border-subtle)'}`, color: ['LeetCode', 'Codeforces'].includes(p.coding_platforms.name) ? (p.coding_platforms.color_hex || 'inherit') : 'var(--color-text-muted)' }}>
                            {['LeetCode', 'Codeforces'].includes(p.coding_platforms.name) ? p.coding_platforms.name : 'Legacy'}
                          </span>
                        ) : (
                          <span className="badge" style={{ border: '1px solid var(--color-border-subtle)' }}>Custom</span>
                        )}
                      </td>
                      <td><span className={`badge ${cls}`}>{label}</span></td>
                      <td style={{ color: isUrgent ? 'var(--color-revision)' : 'var(--color-text-muted)', fontWeight: isUrgent ? 600 : 400 }}>
                        {revLabel}
                        {sp.revision_schedule?.[0]?.revision_number && (
                          <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', opacity: 0.7 }}>(Rev {sp.revision_schedule[0].revision_number})</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </table>
          </div>
          </motion.div>
        )}

        {/* GRID VIEW */}
        {view === 'grid' && (
          <motion.div key="grid" className="bento-grid" variants={container} initial="hidden" animate="show">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="bento-card col-span-2" style={{ height: 180, animation: 'pulse 2s infinite' }} />
              ))
            ) : sorted.length === 0 ? (
              <div className="bento-card col-span-6" style={{ padding: '2rem' }}>
                <EmptyState />
              </div>
            ) : sorted.map(sp => {
              const p = sp.problem;
              const { cls, label } = confBadge(sp.confidence);
              const nextRev = sp.revision_schedule?.[0]?.next_revision_date;
              const revLabel = formatNextRevision(nextRev);
              const isUrgent = revLabel === 'Today' || revLabel.includes('overdue');
              return (
                <motion.div
                  key={sp.id}
                  variants={card}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/library/${sp.id}`)}
                  className="bento-card col-span-2"
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', position: 'relative', cursor: 'pointer' }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(to right, transparent, ${diffColor(p?.difficulty)}, transparent)`, opacity: 0.5 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className="text-muted text-xs" style={{ fontVariantNumeric: 'tabular-nums' }}>#{p?.external_problem_id}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: diffColor(p?.difficulty) }}>{p?.difficulty}</span>
                    </div>
                    {p?.coding_platforms ? (
                      <span className="badge" style={{ fontSize: '0.7rem', border: `1px solid ${['LeetCode', 'Codeforces'].includes(p.coding_platforms.name) ? (p.coding_platforms.color_hex || 'var(--color-primary)') : 'var(--color-border-subtle)'}40`, color: ['LeetCode', 'Codeforces'].includes(p.coding_platforms.name) ? (p.coding_platforms.color_hex || 'inherit') : 'var(--color-text-muted)' }}>
                        {['LeetCode', 'Codeforces'].includes(p.coding_platforms.name) ? p.coding_platforms.name : 'Legacy'}
                      </span>
                    ) : (
                      <BookOpen size={14} color="var(--color-text-muted)" />
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.05rem', margin: 0, lineHeight: 1.3 }}>{p?.title}</h3>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {p?.problem_tags?.slice(0, 2).map(t => <span key={t.tag} className="badge">{t.tag}</span>)}
                    {p?.problem_companies?.slice(0, 1).map(c => <span key={c.company.name} className="badge" style={{ background: 'var(--color-bg-subtle)' }}>{c.company.name}</span>)}
                    {sp.user_pattern && <span className="badge" style={{ border: '1px dashed var(--color-border-subtle)' }}>{sp.user_pattern}</span>}
                    <span className={`badge ${cls}`}>{label} confidence</span>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '0.875rem', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p className="text-muted text-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Next Revision</p>
                      <p style={{ fontSize: '0.875rem', fontWeight: 550, color: isUrgent ? 'var(--color-revision)' : 'var(--color-text-secondary)' }}>
                        {revLabel}
                        {sp.revision_schedule?.[0]?.revision_number && (
                          <span style={{ marginLeft: '0.25rem', fontSize: '0.75rem', opacity: 0.7 }}>(Rev {sp.revision_schedule[0].revision_number})</span>
                        )}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p className="text-muted text-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Time</p>
                      <p style={{ fontSize: '0.875rem', fontWeight: 550, color: 'var(--color-text-secondary)' }}>{sp.solve_time_minutes ? `${sp.solve_time_minutes}m` : '—'}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}