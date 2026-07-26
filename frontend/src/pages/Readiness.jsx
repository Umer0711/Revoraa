import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { SEO } from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import {
  CheckCircle2, Flame, Search, X, ChevronDown, ChevronRight,
  Bookmark, FileText, Check, TrendingUp, Zap, ArrowLeft, Target, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  getReadinessOverview,
  getCompaniesExplorer,
  getCompanyHierarchicalDetails,
  toggleQuestionSolved
} from '../lib/readinessService';
import './Readiness.css';

export const Readiness = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  // View Mode
  const [viewMode, setViewMode] = useState('home');
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Data
  const [overview, setOverview] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [companyDetailData, setCompanyDetailData] = useState(null);

  // Accordion state
  const [expandedTopics, setExpandedTopics] = useState({});
  const [expandedPatterns, setExpandedPatterns] = useState({});

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Bookmarks & Notes
  const [bookmarkedSet, setBookmarkedSet] = useState(new Set());
  const [activeNotesQuestion, setActiveNotesQuestion] = useState(null);
  const [notesText, setNotesText] = useState('');

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Engineer';

  // ─── Load data ────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const [ovData, compList] = await Promise.all([
          getReadinessOverview(user.id),
          getCompaniesExplorer(user.id, { search: '', filterStatus: selectedStatus })
        ]);
        setOverview(ovData);
        setCompanies(compList);
      } catch (err) {
        console.error('Error loading readiness data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, selectedStatus]);

  // Debounced search
  useEffect(() => {
    if (!user || viewMode !== 'home') return;
    const timer = setTimeout(() => {
      getCompaniesExplorer(user.id, { search: searchTerm, filterStatus: selectedStatus }).then(setCompanies);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ─── Company Dashboard ────────────────────────────────────
  const handleOpenCompanyDashboard = async (company) => {
    setSelectedCompany(company);
    setViewMode('company');
    setSearchTerm('');
    setSelectedDifficulty('ALL');
    setLoading(true);
    try {
      const details = await getCompanyHierarchicalDetails(user.id, company.id);
      setCompanyDetailData(details);
      if (details?.topicsTree?.length > 0) {
        const firstTopic = details.topicsTree[0];
        setExpandedTopics({ [firstTopic.topicName]: true });
        if (firstTopic.patterns?.length > 0) {
          setExpandedPatterns({ [`${firstTopic.topicName}_${firstTopic.patterns[0].patternName}`]: true });
        }
      }
    } catch (err) {
      console.error('Error opening company:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    setViewMode('home');
    setSelectedCompany(null);
    setCompanyDetailData(null);
    setExpandedTopics({});
    setExpandedPatterns({});
    setSearchTerm('');
    setSelectedDifficulty('ALL');
  };

  // ─── Toggle Solved ────────────────────────────────────────
  const handleToggleCheck = async (problemId, currentSolvedState) => {
    if (!user) return;
    try {
      const res = await toggleQuestionSolved(user.id, problemId, currentSolvedState);
      if (res.success) {
        toast.success(res.isSolved ? '🎉 Solved! +50 XP Awarded' : 'Marked Unsolved');
        // Refresh both overview and company detail
        const updatedOv = await getReadinessOverview(user.id);
        setOverview(updatedOv);
        if (selectedCompany) {
          const updatedDetails = await getCompanyHierarchicalDetails(user.id, selectedCompany.id);
          setCompanyDetailData(updatedDetails);
        }
      }
    } catch (e) {
      toast.error('Error updating progress');
    }
  };

  const handleToggleBookmark = (id) => {
    setBookmarkedSet(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ─── Memoized Topics Tree (INP Performance Optimization) ───
  const filteredTopicsTree = useMemo(() => {
    if (!companyDetailData?.topicsTree) return [];
    const q = searchTerm.trim().toLowerCase();

    return companyDetailData.topicsTree.map(topic => {
      let topicTotal = 0;
      let topicSolved = 0;

      const filteredPatterns = (topic.patterns || []).map(pat => {
        let qList = pat.questions || [];
        if (q) {
          qList = qList.filter(item => item.title?.toLowerCase().includes(q) || item.slug?.includes(q));
        }
        if (selectedDifficulty !== 'ALL') {
          qList = qList.filter(item => item.difficulty === selectedDifficulty);
        }
        topicTotal += qList.length;
        topicSolved += qList.filter(item => item.isSolved).length;

        return {
          ...pat,
          filteredQuestions: qList
        };
      }).filter(pat => pat.filteredQuestions.length > 0 || (!q && selectedDifficulty === 'ALL'));

      const topicPct = topicTotal > 0 ? Math.round((topicSolved / topicTotal) * 100) : 0;

      return {
        ...topic,
        topicTotal,
        topicSolved,
        topicPct,
        filteredPatterns
      };
    }).filter(topic => topic.filteredPatterns.length > 0 || (!q && selectedDifficulty === 'ALL'));
  }, [companyDetailData?.topicsTree, searchTerm, selectedDifficulty]);

  // ─── RENDER ───────────────────────────────────────────────
  return (
    <div className="readiness-container">
      <SEO title="Interview Readiness | Revoraa" description="Company-based interview readiness platform." url="https://revoraa.com/readiness" />

      {/* ═══════════════════════════════════════════════════════
          COMPANY DASHBOARD VIEW
          ═══════════════════════════════════════════════════════ */}
      {viewMode === 'company' && selectedCompany ? (
        <div>
          <div className="readiness-breadcrumb">
            <button className="breadcrumb-back-btn" onClick={handleBackToHome}>
              <ArrowLeft size={14} /> Back to Companies
            </button>
            <span>/</span>
            <span>Interview Readiness</span>
            <span>/</span>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>{selectedCompany.name}</span>
          </div>

          {/* Company Hero */}
          <div className="company-hero-banner">
            <div className="company-hero-info">
              <div className="company-hero-logo">
                {selectedCompany.meta?.logo ? (
                  <img src={selectedCompany.meta.logo} alt={selectedCompany.name}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling && (e.target.nextSibling.style.display = 'flex'); }} />
                ) : null}
                <span style={{ display: selectedCompany.meta?.logo ? 'none' : 'flex' }}>{selectedCompany.name.charAt(0)}</span>
              </div>
              <div>
                <h2>{selectedCompany.name} Interview Readiness</h2>
                <p>{selectedCompany.meta?.industry || 'Technology'} • {companyDetailData?.totalQuestions ?? selectedCompany.totalQuestions} Questions</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'center' }}>
              {[
                { val: companyDetailData?.totalQuestions ?? 0, label: 'Total', color: '#ffffff' },
                { val: companyDetailData?.solvedQuestions ?? 0, label: 'Solved', color: '#fbbf24' },
                { val: companyDetailData?.remainingQuestions ?? 0, label: 'Remaining', color: '#60a5fa' },
                { val: `${companyDetailData?.completionPercentage ?? 0}%`, label: 'Complete', color: '#fbbf24' }
              ].map((m, i) => (
                <div key={i}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: m.color }}>{m.val}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Easy / Med / Hard breakdown */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Easy', count: companyDetailData?.easyCount ?? 0, color: '#10b981' },
              { label: 'Medium', count: companyDetailData?.mediumCount ?? 0, color: '#f59e0b' },
              { label: 'Hard', count: companyDetailData?.hardCount ?? 0, color: '#ef4444' }
            ].map((d, i) => (
              <div key={i} style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: 12, background: 'rgba(30,41,59,0.35)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, marginBottom: 4 }}>{d.label}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: d.color }}>{d.count}</div>
              </div>
            ))}
          </div>

          {/* Company Search + Filter */}
          <div className="toolbar-row">
            <div className="toolbar-search-wrap">
              <input
                type="text"
                placeholder="Search companies, topics, patterns or questions..."
                value={searchTerm}
                onChange={e => {
                  const v = e.target.value;
                  startTransition(() => setSearchTerm(v));
                }}
              />
              <div className="search-shortcut-badge">⌘K</div>
            </div>
            <select
              className="select-filter"
              value={selectedDifficulty}
              onChange={e => {
                const v = e.target.value;
                startTransition(() => setSelectedDifficulty(v));
              }}
            >
              <option value="ALL">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Topic → Pattern → Question Accordion */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading {selectedCompany.name} questions...</div>
          ) : filteredTopicsTree.length > 0 ? (
            filteredTopicsTree.map(topic => {
              const isTopicOpen = Boolean(expandedTopics[topic.topicName]);

              return (
                <div key={topic.topicName} className="topic-accordion-card">
                  <div className="topic-accordion-header" onClick={() => startTransition(() => setExpandedTopics(prev => ({ ...prev, [topic.topicName]: !prev[topic.topicName] })))}>
                    <div className="topic-header-title">
                      {isTopicOpen ? <ChevronDown size={20} color="#fbbf24" /> : <ChevronRight size={20} color="#94a3b8" />}
                      <span>{topic.topicName}</span>
                    </div>
                    <div className="topic-header-stats">
                      <span>{topic.topicTotal} Qs</span>
                      <span>{topic.topicSolved} Solved</span>
                      <span style={{ color: '#fbbf24', fontWeight: 700 }}>{topic.topicPct}%</span>
                    </div>
                  </div>

                  {isTopicOpen && topic.filteredPatterns.map(pat => {
                    const patKey = `${topic.topicName}_${pat.patternName}`;
                    const isPatOpen = Boolean(expandedPatterns[patKey]);
                    const qList = pat.filteredQuestions;

                    return (
                      <div key={patKey} className="pattern-accordion-item">
                        <div className="pattern-accordion-header" onClick={() => startTransition(() => setExpandedPatterns(prev => ({ ...prev, [patKey]: !prev[patKey] })))}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            {isPatOpen ? <ChevronDown size={18} color="#fbbf24" /> : <ChevronRight size={18} color="#94a3b8" />}
                            <div>
                              <div className="pattern-name-title">{pat.patternName}</div>
                            </div>
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>{pat.solved} / {pat.total} Solved</div>
                        </div>

                        {isPatOpen && qList.map(q => (
                          <div key={q.id} className="question-row-item">
                            <div className="q-row-left">
                              <button className={`q-check-box ${q.isSolved ? 'checked' : ''}`} onClick={() => handleToggleCheck(q.id, q.isSolved)}>
                                {q.isSolved && <Check size={14} />}
                              </button>
                              <div className="q-title-name">{q.title}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span className={`diff-pill-outline diff-pill-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{q.acceptanceRate}</span>
                              <div style={{ display: 'flex', gap: '0.35rem' }}>
                                <a href={q.url} target="_blank" rel="noopener noreferrer" className="action-icon-btn" title="LeetCode"><Zap size={14} color="#f59e0b" /></a>
                                <a href={q.gfgUrl} target="_blank" rel="noopener noreferrer" className="action-icon-btn" title="GFG">g</a>
                                <button className="action-icon-btn" title="Notes" onClick={() => { setActiveNotesQuestion(q); setNotesText(q.notes || ''); }}><FileText size={14} /></button>
                                <button className="action-icon-btn" title="Bookmark" onClick={() => handleToggleBookmark(q.id)}>
                                  <Bookmark size={14} fill={bookmarkedSet.has(q.id) ? '#fbbf24' : 'none'} color={bookmarkedSet.has(q.id) ? '#fbbf24' : '#64748b'} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No questions found for {selectedCompany.name}.</div>
          )}
        </div>

      ) : (
        /* ═══════════════════════════════════════════════════════
           HOME PAGE: Progress + Search + Company Grid
           ═══════════════════════════════════════════════════════ */
        <div>
          <h1 className="readiness-title-main">Interview Readiness</h1>

          {/* Hero Dashboard */}
          <div className="hero-dashboard-grid">
            <div className="hero-banner-card">
              <div className="hero-banner-content">
                <h2>Keep pushing, {userName}!</h2>
                <p>Master company interview patterns one problem at a time.</p>
                <div>
                  <div className="total-solved-label">TOTAL SOLVED</div>
                  <div className="total-solved-count">
                    {overview?.solvedCount ?? 0} <span>/ {overview?.totalQuestions ?? 0}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.35rem', fontWeight: 500 }}>
                    Across 656 Company Interview Sheets
                  </div>
                </div>
              </div>
              <div className="progress-ring-wrap">
                <svg width="90" height="90" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r="38" stroke="rgba(255,255,255,0.08)" strokeWidth="7" fill="none" />
                  <circle cx="45" cy="45" r="38" stroke="#f59e0b" strokeWidth="7" fill="none"
                    strokeDasharray="238.76"
                    strokeDashoffset={238.76 - (238.76 * (overview?.completionPercentage ?? 0)) / 100}
                    strokeLinecap="round" transform="rotate(-90 45 45)"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
                </svg>
                <div style={{ position: 'absolute' }} className="progress-ring-text">{overview?.completionPercentage ?? 0}%</div>
              </div>
            </div>

            {/* Quad Metric Cards — ALL from DB */}
            <div className="hero-quad-grid">
              <div className="quad-metric-card">
                <div className="quad-header"><span>EASY</span><CheckCircle2 size={16} color="#10b981" /></div>
                <div className="quad-value">{overview?.easySolved ?? 0} <span>/ {overview?.easyCount ?? 0}</span></div>
              </div>
              <div className="quad-metric-card">
                <div className="quad-header"><span>MEDIUM</span><TrendingUp size={16} color="#f59e0b" /></div>
                <div className="quad-value">{overview?.mediumSolved ?? 0} <span>/ {overview?.mediumCount ?? 0}</span></div>
              </div>
              <div className="quad-metric-card">
                <div className="quad-header"><span>HARD</span><Zap size={16} color="#ef4444" /></div>
                <div className="quad-value">{overview?.hardSolved ?? 0} <span>/ {overview?.hardCount ?? 0}</span></div>
              </div>
              <div className="quad-metric-card">
                <div className="quad-header"><span>COMPANIES</span><BarChart3 size={16} color="#f59e0b" /></div>
                <div className="quad-value">{overview?.totalCompanies ?? 0}</div>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="toolbar-row">
            <div className="toolbar-search-wrap">
              <input type="text" placeholder="Search companies, topics, patterns or questions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <div className="search-shortcut-badge">⌘K</div>
            </div>
            <select className="select-filter" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
              <option value="ALL">All Companies</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="SOLVED">Completed</option>
              <option value="UNTOUCHED">Untouched</option>
            </select>
          </div>

          {/* Company Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading companies...</div>
          ) : companies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No companies match your search.</div>
          ) : (
            <div className="company-cards-grid">
              {companies.map(comp => (
                <div key={comp.id} className="company-saas-card" onClick={() => handleOpenCompanyDashboard(comp)}>
                  <div>
                    <div className="card-header-flex">
                      <div className="company-icon-box" style={{ borderLeft: `4px solid ${comp.meta?.color || '#f59e0b'}` }}>
                        {comp.meta?.logo ? (
                          <img src={comp.meta.logo} alt={comp.name} className="company-logo-img"
                            onError={(e) => { e.target.style.display = 'none'; }} />
                        ) : null}
                        <span style={{ display: comp.meta?.logo ? 'none' : 'inline' }}>{comp.name.charAt(0)}</span>
                      </div>
                      <div className="company-card-info">
                        <h3>{comp.name}</h3>
                        <span>{comp.meta?.industry || 'Technology'} • {comp.meta?.tier || 'Tier 1'}</span>
                      </div>
                    </div>

                    <div className="card-stats-row">
                      <span style={{ color: '#e2e8f0' }}>{comp.solvedQuestions} / {comp.totalQuestions} Solved</span>
                      <span style={{ color: '#fbbf24', fontWeight: 700 }}>{comp.completionPercentage}%</span>
                    </div>

                    <div className="card-progress-track">
                      <div className="card-progress-fill" style={{ width: `${comp.completionPercentage}%` }} />
                    </div>
                  </div>

                  <div className="company-card-diff-row">
                    <span className="diff-mini-pill easy">Easy: {comp.easyCount}</span>
                    <span className="diff-mini-pill med">Medium: {comp.mediumCount}</span>
                    <span className="diff-mini-pill hard">Hard: {comp.hardCount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notes Modal */}
      <AnimatePresence>
        {activeNotesQuestion && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setActiveNotesQuestion(null)}>
            <motion.div style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '1.5rem', width: '90%', maxWidth: 500, backdropFilter: 'blur(20px)' }}
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Notes for {activeNotesQuestion.title}</h2>
                <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }} onClick={() => setActiveNotesQuestion(null)}><X size={20} /></button>
              </div>
              <textarea rows={5} placeholder="Write solution notes, time complexity, edge cases..." value={notesText} onChange={e => setNotesText(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.8)', color: '#ffffff', marginBottom: '1rem', resize: 'vertical', fontFamily: 'inherit' }} />
              <button onClick={() => { toast.success('Notes saved!'); setActiveNotesQuestion(null); }}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 10, border: 'none', background: '#f59e0b', color: '#000', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                Save Notes
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
