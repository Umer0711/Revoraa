import React, { useState, useMemo, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, ChevronRight, X, BookOpen, Clock, Cpu, Info, Target,
  Building2, AlertTriangle, Lightbulb, Loader, CheckCircle2,
  ExternalLink, Plus, Code
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { 
  getPatternCodeExample, 
  getPatternRelatedProblems, 
  getPatternVisualData, 
  getPatternLocalization, 
  getPatternData,
  getPatternExternalResources,
  PATTERN_SEARCH_SIGNALS 
} from '../lib/dsaAtlasData';
import { MacCodeTerminal } from '../components/MacCodeTerminal';
import { VisualDiagram } from '../components/VisualDiagram';
import './DSAAtlas.css';

const FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Easy', 'Medium', 'Hard'];

const DifficultyBadge = ({ difficulty }) => {
  let badgeClass = 'badge-success';
  if (difficulty === 'Medium' || difficulty === 'Intermediate') badgeClass = 'badge-warning';
  if (difficulty === 'Hard' || difficulty === 'Advanced') badgeClass = 'badge-danger';
  return <span className={`badge ${badgeClass}`}>{difficulty}</span>;
};

export function DSAAtlas() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [topicsData, setTopicsData] = useState([]);
  const [, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [lang, setLang] = useState('en');

  // Related Problems state
  const [relatedProblemsList, setRelatedProblemsList] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [relatedError, setRelatedError] = useState(null);
  const [previewProblem, setPreviewProblem] = useState(null);

  // Fetch topics and patterns
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch topics
        const { data: topics, error: topicsErr } = await supabase
          .from('dsa_atlas_topics')
          .select('*')
          .order('sort_order', { ascending: true });

        if (topicsErr) throw topicsErr;

        // Fetch patterns
        const { data: patterns, error: patternsErr } = await supabase
          .from('dsa_atlas_patterns')
          .select('*')
          .order('sort_order', { ascending: true });

        if (patternsErr) throw patternsErr;

        // Map patterns to topics
        const mappedData = topics.map(t => {
          return {
            id: t.id,
            topic: t.name,
            description: t.description,
            patterns: patterns.filter(p => p.topic_id === t.id).map(p => ({
              ...p,
              parentTopic: t.name,
              whenToUse: p.when_to_use,
              timeComplexity: p.time_complexity,
              spaceComplexity: p.space_complexity,
              recognitionTips: p.recognition_tips || [],
              commonMistakes: p.common_mistakes || [],
              visualExample: p.visual_example,
              interviewFrequency: p.interview_frequency,
              relatedProblems: p.related_problems || [],
              companies: p.companies || []
            }))
          };
        });

        setTopicsData(mappedData);
        if (mappedData.length > 0) {
          setActiveTopicId(mappedData[0].id);
        }
      } catch (err) {
        console.error('Error fetching DSA Atlas data:', err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch real related problems when a pattern is selected
  useEffect(() => {
    if (!selectedPattern) {
      setRelatedProblemsList([]);
      return;
    }

    let isMounted = true;

    const loadRelatedProblems = async () => {
      setLoadingRelated(true);
      setRelatedError(null);

      try {
        const canonicalList = getPatternRelatedProblems(selectedPattern.name, selectedPattern.parentTopic);
        
        let userSolvedMap = new Map(); // problem_id -> solved_problem_id
        let userSolvedTitles = new Set();
        
        if (user?.id) {
          const { data: solvedData } = await supabase
            .from('solved_problems')
            .select('id, problem_id, problem:problems(title, slug)')
            .eq('user_id', user.id)
            .is('deleted_at', null);

          if (solvedData) {
            solvedData.forEach(s => {
              if (s.problem_id) userSolvedMap.set(s.problem_id, s.id);
              if (s.problem?.title) userSolvedTitles.add(s.problem.title.toLowerCase());
              if (s.problem?.slug) userSolvedTitles.add(s.problem.slug.toLowerCase());
            });
          }
        }

        // Check if database has matching problems from pattern signals
        const signalKey = `${selectedPattern.parentTopic}:${selectedPattern.name}`;
        const signals = PATTERN_SEARCH_SIGNALS[signalKey] || PATTERN_SEARCH_SIGNALS[selectedPattern.name];
        let queryResults = [];

        if (signals?.keywords?.length > 0) {
          try {
            const orFilter = signals.keywords.slice(0, 3).map(k => `title.ilike.%${k}%`).join(',');
            const { data: matchedDbProblems } = await supabase
              .from('problems')
              .select('id, title, slug, difficulty, url')
              .or(orFilter)
              .limit(8);

            if (matchedDbProblems && matchedDbProblems.length > 0) {
              queryResults = matchedDbProblems;
            }
          } catch (e) {
            console.warn('Pattern search signal query notice:', e);
          }
        }

        // Canonical list takes first priority, merged with unique DB results
        const combinedProblems = [...canonicalList];
        const seenTitles = new Set(canonicalList.map(p => p.title.toLowerCase()));

        queryResults.forEach(qp => {
          if (qp.title && !seenTitles.has(qp.title.toLowerCase())) {
            seenTitles.add(qp.title.toLowerCase());
            combinedProblems.push(qp);
          }
        });

        const canonicalTitles = combinedProblems.map(p => p.title);
        let dbProblemMap = new Map();

        if (canonicalTitles.length > 0) {
          const { data: dbProblems } = await supabase
            .from('problems')
            .select('id, title, slug, difficulty, url')
            .in('title', canonicalTitles);

          if (dbProblems) {
            dbProblems.forEach(p => {
              dbProblemMap.set(p.title.toLowerCase(), p);
              if (p.slug) dbProblemMap.set(p.slug.toLowerCase(), p);
            });
          }
        }

        const merged = combinedProblems.map(item => {
          const matchedDb = dbProblemMap.get(item.title.toLowerCase()) || (item.slug ? dbProblemMap.get(item.slug.toLowerCase()) : null);
          const problemId = matchedDb?.id || item.id || null;
          
          let isSolved = false;
          let userSolvedId = null;

          if (problemId && userSolvedMap.has(problemId)) {
            isSolved = true;
            userSolvedId = userSolvedMap.get(problemId);
          } else if (userSolvedTitles.has(item.title.toLowerCase()) || (item.slug && userSolvedTitles.has(item.slug.toLowerCase()))) {
            isSolved = true;
          }

          return {
            title: item.title,
            difficulty: item.difficulty || matchedDb?.difficulty || 'Medium',
            slug: item.slug || matchedDb?.slug,
            url: item.url || matchedDb?.url || (item.slug ? `https://leetcode.com/problems/${item.slug}/` : '#'),
            problemId,
            userSolvedId,
            isSolved
          };
        });

        if (isMounted) {
          setRelatedProblemsList(merged);
        }
      } catch (err) {
        console.error('Error loading related problems:', err);
        if (isMounted) {
          setRelatedError('Unable to load related problems.');
        }
      } finally {
        if (isMounted) {
          setLoadingRelated(false);
        }
      }
    };

    loadRelatedProblems();

    return () => {
      isMounted = false;
    };
  }, [selectedPattern, user?.id]);

  // Close drawer on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (previewProblem) {
          setPreviewProblem(null);
        } else if (selectedPattern) {
          setSelectedPattern(null);
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedPattern, previewProblem]);

  // Filter data for the active topic only
  const filteredPatterns = useMemo(() => {
    if (!activeTopicId || !topicsData.length) return [];
    
    const activeTopic = topicsData.find(t => t.id === activeTopicId);
    if (!activeTopic) return [];

    return activeTopic.patterns.filter(pattern => {
      const matchesSearch = pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            pattern.overview.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesFilter = true;
      if (activeFilter !== 'All') {
        matchesFilter = pattern.difficulty === activeFilter;
      }
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter, topicsData, activeTopicId]);

  const activeTopic = topicsData.find(t => t.id === activeTopicId);

  const patternData = useMemo(() => {
    if (!selectedPattern) return null;
    return getPatternData(selectedPattern.name, selectedPattern.parentTopic);
  }, [selectedPattern]);

  const codeExample = useMemo(() => {
    if (!selectedPattern) return null;
    return getPatternCodeExample(selectedPattern.name, selectedPattern.visualExample, selectedPattern.parentTopic);
  }, [selectedPattern]);

  const visualData = useMemo(() => {
    if (!selectedPattern) return null;
    return getPatternVisualData(selectedPattern.name, selectedPattern.parentTopic);
  }, [selectedPattern]);

  const localizedContent = useMemo(() => {
    if (!selectedPattern) return null;
    return getPatternLocalization(selectedPattern.name, lang, selectedPattern.parentTopic);
  }, [selectedPattern, lang]);

  const externalResources = useMemo(() => {
    if (!selectedPattern) return [];
    return getPatternExternalResources(selectedPattern.name, selectedPattern.parentTopic);
  }, [selectedPattern]);

  const displayCompanies = useMemo(() => {
    if (!selectedPattern) return [];
    const signalKey = `${selectedPattern.parentTopic}:${selectedPattern.name}`;
    const signalCompanies = PATTERN_SEARCH_SIGNALS[signalKey]?.companies || PATTERN_SEARCH_SIGNALS[selectedPattern.name]?.companies || [];
    const dbCompanies = selectedPattern.companies || [];
    return Array.from(new Set([...signalCompanies, ...dbCompanies]));
  }, [selectedPattern]);

  const handleRelatedProblemClick = (problem) => {
    if (problem.isSolved && problem.userSolvedId) {
      navigate(`/library/${problem.userSolvedId}`);
    } else {
      setPreviewProblem(problem);
    }
  };

  return (
    <div className="dsa-atlas-container">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BookOpen size={32} color="var(--color-primary)" />
          DSA Atlas
        </h1>
        <p className="text-muted">An interactive encyclopedia of data structures, algorithms, and patterns.</p>
      </div>

      <div className="dsa-atlas-controls">
        <div className="dsa-search-wrapper">
          <Search size={18} className="dsa-search-icon" />
          <input
            type="text"
            className="dsa-search-input"
            placeholder="Search topics, patterns, or algorithms..."
            value={searchQuery}
            onChange={(e) => {
              const v = e.target.value;
              startTransition(() => setSearchQuery(v));
            }}
          />
        </div>
        <div className="dsa-filters">
          {FILTERS.map(filter => (
            <button
              key={filter}
              className={`dsa-filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => startTransition(() => setActiveFilter(filter))}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
          <Loader size={32} className="spin" style={{ marginBottom: '1rem' }} />
          <p>Loading taxonomy...</p>
        </div>
      ) : error ? (
        <div className="empty-state bento-card">
          <AlertTriangle size={48} color="var(--color-danger)" style={{ opacity: 0.8, marginBottom: '1rem' }} />
          <h3>Error loading data</h3>
          <p>{error}</p>
        </div>
      ) : (
        <div className="dsa-atlas-layout">
          {/* Sidebar */}
          <div className="dsa-sidebar">
            {topicsData.map(topic => (
              <div 
                key={topic.id} 
                className={`dsa-sidebar-item ${activeTopicId === topic.id ? 'active' : ''}`}
                onClick={() => setActiveTopicId(topic.id)}
              >
                <span>{topic.topic}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{topic.patterns.length}</span>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="dsa-main-content">
            {activeTopic && (
              <div className="dsa-topic-header">
                <h2 className="dsa-topic-title">{activeTopic.topic} Patterns</h2>
                <p className="dsa-topic-desc">{activeTopic.description}</p>
              </div>
            )}

            {filteredPatterns.length === 0 ? (
              <div className="empty-state bento-card" style={{ marginTop: 0 }}>
                <Target size={48} color="var(--color-text-muted)" style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <h3>No patterns found</h3>
                <p>Try adjusting your search or filters.</p>
                <button className="btn btn-secondary" style={{ marginTop: '1.5rem' }} onClick={() => {setSearchQuery(''); setActiveFilter('All');}}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="dsa-patterns-grid">
                {filteredPatterns.map(pattern => (
                  <div 
                    key={pattern.id} 
                    className={`dsa-pattern-card ${pattern.interviewFrequency === 'High' || pattern.interviewFrequency === 'Very High' ? 'bento-large' : ''}`}
                    onClick={() => setSelectedPattern({ ...pattern, parentTopic: activeTopic?.topic })}
                  >
                    <div className="dsa-pattern-header">
                      <span className="dsa-pattern-name">{pattern.name}</span>
                      <DifficultyBadge difficulty={pattern.difficulty} />
                    </div>
                    <div className="dsa-pattern-overview">{pattern.overview}</div>
                    <div className="dsa-pattern-footer">
                      <span className="dsa-freq-badge">{pattern.interviewFrequency} Freq</span>
                      <ChevronRight size={14} color="var(--color-text-secondary)" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide Over Drawer for Pattern Details */}
      <AnimatePresence>
        {selectedPattern && (
          <div className="dsa-drawer-backdrop" onClick={() => setSelectedPattern(null)}>
            <motion.div
              className="dsa-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="dsa-drawer-header">
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    {selectedPattern.parentTopic}
                  </div>
                  <h2 style={{ marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>{selectedPattern.name}</h2>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <DifficultyBadge difficulty={selectedPattern.difficulty} />
                    <span className="badge badge-info">{selectedPattern.interviewFrequency} Frequency</span>
                    
                    {/* Language Switcher */}
                    <div className="dsa-lang-toggle">
                      <button 
                        className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                        onClick={() => setLang('en')}
                      >
                        EN
                      </button>
                      <button 
                        className={`lang-btn ${lang === 'hi' ? 'active' : ''}`}
                        onClick={() => setLang('hi')}
                      >
                        Hinglish
                      </button>
                    </div>
                  </div>
                </div>
                <button className="dsa-drawer-close" onClick={() => setSelectedPattern(null)} aria-label="Close pattern details">
                  <X size={20} />
                </button>
              </div>

              <div className="dsa-drawer-content">
                <div className="dsa-text-body" style={{ fontSize: '1.05rem', color: 'var(--color-text-primary)', lineHeight: '1.6' }}>
                  {localizedContent?.overview || patternData?.[lang]?.overview || selectedPattern.overview}
                </div>

                <div className="dsa-section-title"><Info size={16} /> {lang === 'hi' ? 'Explanation (Kya Hai)' : 'Explanation'}</div>
                <div className="dsa-text-body">
                  {localizedContent?.whatItIs || localizedContent?.explanation || patternData?.[lang]?.whatItIs || selectedPattern.explanation}
                </div>

                {(localizedContent?.whyItWorks || patternData?.[lang]?.whyItWorks) && (
                  <>
                    <div className="dsa-section-title"><Lightbulb size={16} color="var(--color-primary)" /> {lang === 'hi' ? 'Yeh Kyun Kaam Karta Hai (Why It Works)' : 'Why It Works'}</div>
                    <div className="dsa-text-body">
                      {localizedContent?.whyItWorks || patternData?.[lang]?.whyItWorks}
                    </div>
                  </>
                )}

                <div className="dsa-section-title"><Target size={16} /> {lang === 'hi' ? 'Kab Use Karein (When to use)' : 'When to use'}</div>
                <div className="dsa-text-body">
                  {localizedContent?.whenToUse || patternData?.[lang]?.whenToUse || selectedPattern.whenToUse}
                </div>

                {(localizedContent?.stepLogic || patternData?.[lang]?.stepLogic) && (
                  <>
                    <div className="dsa-section-title"><Code size={16} color="var(--color-primary)" /> {lang === 'hi' ? 'Step-by-Step Execution Logic' : 'Step-by-Step Execution Logic'}</div>
                    <div className="dsa-step-logic">
                      {localizedContent?.stepLogic || patternData?.[lang]?.stepLogic}
                    </div>
                  </>
                )}

                <div className="dsa-stats-grid">
                  <div className="dsa-stat-box">
                    <div className="dsa-stat-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> Time Complexity
                    </div>
                    <div className="dsa-stat-value text-primary-accent">{patternData?.timeComplexity || selectedPattern.timeComplexity}</div>
                  </div>
                  <div className="dsa-stat-box">
                    <div className="dsa-stat-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Cpu size={14} /> Space Complexity
                    </div>
                    <div className="dsa-stat-value text-primary-accent">{patternData?.spaceComplexity || selectedPattern.spaceComplexity}</div>
                  </div>
                </div>

                {((localizedContent?.recognitionTips || patternData?.[lang]?.recognitionSignals || selectedPattern.recognitionTips)?.length > 0) && (
                  <>
                    <div className="dsa-section-title"><Lightbulb size={16} /> {lang === 'hi' ? 'Pehchanne Ke Signals' : 'Recognition Tips'}</div>
                    <ul className="dsa-list">
                      {(localizedContent?.recognitionTips || patternData?.[lang]?.recognitionSignals || selectedPattern.recognitionTips).map((tip, idx) => <li key={idx}>{tip}</li>)}
                    </ul>
                  </>
                )}

                {((localizedContent?.commonMistakes || patternData?.[lang]?.commonMistakes || selectedPattern.commonMistakes)?.length > 0) && (
                  <>
                    <div className="dsa-section-title"><AlertTriangle size={16} color="var(--color-mistakes)" /> {lang === 'hi' ? 'Aam Galatiyan' : 'Common Mistakes'}</div>
                    <ul className="dsa-list">
                      {(localizedContent?.commonMistakes || patternData?.[lang]?.commonMistakes || selectedPattern.commonMistakes).map((mistake, idx) => <li key={idx}>{mistake}</li>)}
                    </ul>
                  </>
                )}

                <div className="dsa-section-title"><Code size={16} /> {lang === 'hi' ? 'Interactive Visual Diagram' : 'Visual Example'}</div>
                <VisualDiagram data={visualData} lang={lang} />
                <MacCodeTerminal code={codeExample} language="javascript" />

                <div className="dsa-section-title"><BookOpen size={16} /> Related Problems</div>
                {loadingRelated ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 0', color: 'var(--color-text-muted)' }}>
                    <Loader size={16} className="spin" />
                    <span style={{ fontSize: '0.85rem' }}>Loading related problems...</span>
                  </div>
                ) : relatedError ? (
                  <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem', padding: '0.5rem 0' }}>
                    {relatedError}
                  </div>
                ) : relatedProblemsList.length === 0 ? (
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontStyle: 'italic', padding: '0.5rem 0' }}>
                    No related problems mapped to this pattern yet.
                  </div>
                ) : (
                  <div className="dsa-related-problems-list">
                    {relatedProblemsList.map((prob) => (
                      <div
                        key={prob.title}
                        className="dsa-related-problem-card"
                        onClick={() => handleRelatedProblemClick(prob)}
                      >
                        <div>
                          <div className="dsa-related-problem-title">{prob.title}</div>
                          <div className="dsa-problem-meta">
                            <DifficultyBadge difficulty={prob.difficulty} />
                            {prob.isSolved ? (
                              <span className="badge-solved">
                                <CheckCircle2 size={12} /> Solved
                              </span>
                            ) : (
                              <span className="badge-unsolved">Not Solved</span>
                            )}
                          </div>
                        </div>
                        <ChevronRight size={16} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
                      </div>
                    ))}
                  </div>
                )}

                {displayCompanies?.length > 0 && (
                  <>
                    <div className="dsa-section-title"><Building2 size={16} /> Commonly Asked By</div>
                    <div className="dsa-tags">
                      {displayCompanies.map(comp => (
                        <span key={comp} className="dsa-tag" style={{ borderStyle: 'dashed' }}>
                          {comp}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {externalResources?.length > 0 && (
                  <>
                    <div className="dsa-section-title"><ExternalLink size={16} /> {lang === 'hi' ? 'External Learning Resources' : 'External Learning Resources'}</div>
                    <div className="dsa-resources-list">
                      {externalResources.map((res, idx) => (
                        <a
                          key={idx}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="dsa-resource-link"
                        >
                          <span className="dsa-resource-platform">{res.platform}</span>
                          <span className="dsa-resource-title">{res.title}</span>
                          <ExternalLink size={14} className="dsa-resource-icon" />
                        </a>
                      ))}
                    </div>
                  </>
                )}
                
                <div style={{ height: '40px' }} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Unsolved Problem Preview Modal */}
      <AnimatePresence>
        {previewProblem && (
          <div className="dsa-modal-backdrop" onClick={() => setPreviewProblem(null)}>
            <motion.div
              className="dsa-modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem', fontWeight: 600 }}>
                    Related Problem
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {previewProblem.title}
                  </h3>
                </div>
                <button
                  onClick={() => setPreviewProblem(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="Close problem details"
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <DifficultyBadge difficulty={previewProblem.difficulty} />
                <span className="badge-unsolved">Not Solved Yet</span>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                This problem tests your mastery of the <strong>{selectedPattern?.name}</strong> pattern. Solve it on LeetCode or log your solution to add it to your Revoraa revision schedule.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexDirection: 'column' }}>
                <a
                  href={previewProblem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', textDecoration: 'none', minHeight: '44px' }}
                >
                  <ExternalLink size={16} /> Solve on LeetCode
                </a>
                <button
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', minHeight: '44px' }}
                  onClick={() => {
                    setPreviewProblem(null);
                    setSelectedPattern(null);
                    navigate(`/add-problem?url=${encodeURIComponent(previewProblem.url)}&title=${encodeURIComponent(previewProblem.title)}`);
                  }}
                >
                  <Plus size={16} /> Log to My Problems
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
