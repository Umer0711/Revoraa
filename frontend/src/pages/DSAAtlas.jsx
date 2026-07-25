import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronRight, X, BookOpen, Clock, Cpu, Info, Target, Building2, AlertTriangle, Lightbulb, Loader } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import './DSAAtlas.css';

const FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Easy', 'Medium', 'Hard'];

const DifficultyBadge = ({ difficulty }) => {
  let badgeClass = 'badge-success';
  if (difficulty === 'Medium' || difficulty === 'Intermediate') badgeClass = 'badge-warning';
  if (difficulty === 'Hard' || difficulty === 'Advanced') badgeClass = 'badge-danger';
  return <span className={`badge ${badgeClass}`}>{difficulty}</span>;
};

export function DSAAtlas() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [topicsData, setTopicsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [selectedPattern, setSelectedPattern] = useState(null);

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

  // Close drawer on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedPattern) {
        setSelectedPattern(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedPattern]);

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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="dsa-filters">
          {FILTERS.map(filter => (
            <button
              key={filter}
              className={`dsa-filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
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
                  <div key={pattern.id} className="dsa-pattern-card" onClick={() => setSelectedPattern({ ...pattern, parentTopic: activeTopic?.topic })}>
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
                  <h2 style={{ marginBottom: '0.5rem' }}>{selectedPattern.name}</h2>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <DifficultyBadge difficulty={selectedPattern.difficulty} />
                    <span className="badge badge-info">{selectedPattern.interviewFrequency} Frequency</span>
                  </div>
                </div>
                <button className="dsa-drawer-close" onClick={() => setSelectedPattern(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="dsa-drawer-content">
                <div className="dsa-text-body" style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
                  {selectedPattern.overview}
                </div>

                <div className="dsa-section-title"><Info size={16} /> Explanation</div>
                <div className="dsa-text-body">{selectedPattern.explanation}</div>

                <div className="dsa-section-title"><Target size={16} /> When to use</div>
                <div className="dsa-text-body">{selectedPattern.whenToUse}</div>

                <div className="dsa-stats-grid">
                  <div className="dsa-stat-box">
                    <div className="dsa-stat-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> Time Complexity
                    </div>
                    <div className="dsa-stat-value text-primary-accent">{selectedPattern.timeComplexity}</div>
                  </div>
                  <div className="dsa-stat-box">
                    <div className="dsa-stat-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Cpu size={14} /> Space Complexity
                    </div>
                    <div className="dsa-stat-value text-primary-accent">{selectedPattern.spaceComplexity}</div>
                  </div>
                </div>

                <div className="dsa-section-title"><Lightbulb size={16} /> Recognition Tips</div>
                <ul className="dsa-list">
                  {selectedPattern.recognitionTips.map((tip, idx) => <li key={idx}>{tip}</li>)}
                </ul>

                <div className="dsa-section-title"><AlertTriangle size={16} color="var(--color-mistakes)" /> Common Mistakes</div>
                <ul className="dsa-list">
                  {selectedPattern.commonMistakes.map((mistake, idx) => <li key={idx}>{mistake}</li>)}
                </ul>

                <div className="dsa-section-title">Visual Example</div>
                <div className="dsa-code-block">{selectedPattern.visualExample}</div>

                <div className="dsa-section-title"><BookOpen size={16} /> Related Problems</div>
                <div className="dsa-tags">
                  {selectedPattern.relatedProblems.map(prob => <span key={prob} className="dsa-tag">{prob}</span>)}
                </div>

                <div className="dsa-section-title"><Building2 size={16} /> Commonly Asked By</div>
                <div className="dsa-tags">
                  {selectedPattern.companies.map(comp => <span key={comp} className="dsa-tag" style={{ borderStyle: 'dashed' }}>{comp}</span>)}
                </div>
                
                <div style={{ height: '40px' }} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
