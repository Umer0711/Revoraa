import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Terminal, CheckCircle2, Circle, Lock, 
  Clock, Play, ChevronDown, ChevronRight, Sparkles, BookOpen, 
  Layers, Zap, Check, AlertCircle, Code2, FolderGit2, Trophy, Flame, Bug
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLearningLanguage } from '../contexts/LearningLanguageContext';
import { 
  getLearningPathBySlug, getResumeLesson, enrollInPath, 
  getChallenges, getProjects 
} from '../lib/learningService';
import { LanguageSelector } from '../components/learning/LanguageSelector';
import { AccentBar } from '../components/ui/AccentBar';
import { SEO } from '../components/SEO';

export function PathOverview() {
  const { pathSlug } = useParams();
  const { user } = useAuth();
  const { language, t } = useLearningLanguage();
  const navigate = useNavigate();

  const [pathData, setPathData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMainTab, setActiveMainTab] = useState('curriculum'); // 'curriculum' | 'challenges' | 'projects'
  const [activeLevelNumber, setActiveLevelNumber] = useState(1);
  const [expandedModules, setExpandedModules] = useState({});
  const [resumeLesson, setResumeLesson] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [projects, setProjects] = useState([]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLearningPathBySlug(pathSlug, user?.id);
      setPathData(data);

      if (data?.isEnrolled) {
        const resume = await getResumeLesson(pathSlug, user?.id);
        setResumeLesson(resume);
      }

      // Load challenges & projects
      const chalList = await getChallenges(pathSlug, user?.id);
      setChallenges(chalList);

      const projList = await getProjects(pathSlug, user?.id);
      setProjects(projList);

      // Default expand first module of level 1
      if (data?.levels?.[0]?.modules?.[0]?.slug) {
        setExpandedModules(prev => ({
          ...prev,
          [data.levels[0].modules[0].slug]: true
        }));
      }
    } catch (err) {
      console.error('Failed to load path overview:', err);
    } finally {
      setLoading(false);
    }
  }, [pathSlug, user?.id]);

  useEffect(() => {
    loadData();

    const handleRefetch = () => loadData();
    window.addEventListener('REFETCH_LEARNING', handleRefetch);
    return () => window.removeEventListener('REFETCH_LEARNING', handleRefetch);
  }, [loadData]);

  const toggleModule = (moduleSlug) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleSlug]: !prev[moduleSlug]
    }));
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    await enrollInPath(pathSlug, user?.id);
    await loadData();
    setEnrolling(false);
  };

  if (loading || !pathData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  const activeLevel = pathData.levels.find(l => l.level_number === activeLevelNumber) || pathData.levels[0];
  const pct = pathData.progressPercentage || 0;

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <SEO 
        title={`${pathData.title} | Revoraa Learning`}
        description={pathData.description}
      />

      {/* Top Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Link 
          to="/learn" 
          className="text-secondary" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', fontSize: '0.875rem' }}
        >
          <ArrowLeft size={16} />
          <span>{t('allPaths')}</span>
        </Link>

        <LanguageSelector compact />
      </div>

      {/* Path Hero Card */}
      <div className="bento-card" style={{ position: 'relative', marginBottom: '2rem', padding: 'clamp(1.25rem, 3.5vw, 2rem)' }}>
        <AccentBar color="var(--color-primary)" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ flex: '1 1 280px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
                Course Blueprint
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                Python 3.12+
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '0.5rem', wordBreak: 'break-word' }}>{pathData.title}</h1>
            <p className="text-secondary" style={{ maxWidth: '720px', fontSize: '0.95rem' }}>
              {pathData.description}
            </p>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start', flexShrink: 0 }}>
            {pathData.isEnrolled ? (
              resumeLesson ? (
                <Link
                  to={`/learn/${pathSlug}/${resumeLesson.moduleSlug}/${resumeLesson.topicSlug}/${resumeLesson.lessonSlug}`}
                  className="btn btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  <Play size={15} />
                  <span>Resume: {resumeLesson.title.slice(0, 24)}...</span>
                </Link>
              ) : (
                <button
                  className="btn btn-secondary"
                  disabled
                >
                  <CheckCircle2 size={15} color="var(--color-strong)" />
                  <span>All Available Lessons Completed</span>
                </button>
              )
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleEnroll}
                disabled={enrolling}
              >
                <Sparkles size={15} />
                <span>{enrolling ? 'Enrolling...' : 'Enroll in Path'}</span>
              </button>
            )}

            <div className="text-muted text-xs" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>~{pathData.estimated_hours} Hours Total</span>
              <span>•</span>
              <span>{pathData.total_lessons} Lessons</span>
            </div>
          </div>
        </div>

        {/* Course Progress Meter */}
        {pathData.isEnrolled && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
              <span className="text-secondary font-medium">Path Completion Progress</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{pct}% Completed</span>
            </div>
            <div style={{ height: 8, background: 'var(--color-bg-surface)', borderRadius: 9999, overflow: 'hidden', border: '1px solid var(--color-border-subtle)' }}>
              <div 
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: 'linear-gradient(to right, var(--color-primary), #fbbf24)',
                  borderRadius: 9999,
                  transition: 'width 0.5s ease'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Mode Navigation Tabs (Curriculum vs Challenges vs Projects) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1.75rem',
        background: 'var(--color-bg-surface)',
        padding: '0.35rem',
        borderRadius: '8px',
        border: '1px solid var(--color-border-subtle)',
        width: 'fit-content',
        maxWidth: '100%',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none'
      }}>
        <button
          type="button"
          onClick={() => setActiveMainTab('curriculum')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            background: activeMainTab === 'curriculum' ? 'var(--color-primary)' : 'transparent',
            color: activeMainTab === 'curriculum' ? '#fff' : 'var(--color-text-secondary)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
        >
          <BookOpen size={15} />
          <span>{t('curriculumTab')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('challenges')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            background: activeMainTab === 'challenges' ? 'var(--color-primary)' : 'transparent',
            color: activeMainTab === 'challenges' ? '#fff' : 'var(--color-text-secondary)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
        >
          <Code2 size={15} />
          <span>{t('challengesTab')}</span>
          <span className="badge" style={{ fontSize: '0.7rem', padding: '1px 6px', background: 'rgba(255,255,255,0.2)' }}>
            {challenges.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('projects')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            background: activeMainTab === 'projects' ? 'var(--color-primary)' : 'transparent',
            color: activeMainTab === 'projects' ? '#fff' : 'var(--color-text-secondary)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
        >
          <FolderGit2 size={15} />
          <span>{t('projectsTab')}</span>
          <span className="badge" style={{ fontSize: '0.7rem', padding: '1px 6px', background: 'rgba(255,255,255,0.2)' }}>
            {projects.length}
          </span>
        </button>
      </div>

      {/* ─── TAB 1: CURRICULUM VIEW ────────────────────────────────────────── */}
      {activeMainTab === 'curriculum' && (
        <div>
          {/* Level Selection Tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            paddingBottom: '0.75rem',
            maxWidth: '100%',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {pathData.levels.map(level => {
              const isActive = level.level_number === activeLevelNumber;
              return (
                <button
                  key={level.level_number}
                  onClick={() => setActiveLevelNumber(level.level_number)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: isActive ? 'var(--color-primary-subtle)' : 'transparent',
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span>{level.badge}: {level.level_title}</span>
                  <span className="badge badge-success" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>
                    Active
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Level Header */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
              {activeLevel.level_title} Curriculum
            </h2>
            <p className="text-secondary text-sm">
              {activeLevel.description}
            </p>
          </div>

          {/* Modules List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeLevel.modules.map((mod, modIdx) => {
              const isExpanded = expandedModules[mod.slug] ?? false;
              const isPublished = mod.is_published;

              return (
                <div 
                  key={mod.id} 
                  className="bento-card" 
                  style={{ 
                    padding: 0, 
                    overflow: 'hidden',
                    opacity: isPublished ? 1 : 0.75,
                    border: isPublished ? '1px solid var(--color-border-subtle)' : '1px dashed var(--color-border-subtle)'
                  }}
                >
                  {/* Module Header Bar */}
                  <div 
                    onClick={() => toggleModule(mod.slug)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 'clamp(1rem, 2.5vw, 1.25rem) clamp(1rem, 3vw, 1.5rem)',
                      background: 'var(--color-bg-card)',
                      cursor: 'pointer',
                      userSelect: 'none',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0, flex: '1 1 240px' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: mod.isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'var(--color-bg-surface)',
                        border: `1.5px solid ${mod.isCompleted ? 'var(--color-strong)' : 'var(--color-border-subtle)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 600, fontSize: '0.85rem', flexShrink: 0,
                        color: mod.isCompleted ? 'var(--color-strong)' : 'var(--color-text-secondary)'
                      }}>
                        {mod.isCompleted ? <Check size={16} /> : modIdx + 1}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '1.05rem', margin: 0, wordBreak: 'break-word' }}>{mod.title}</h3>
                          {!isPublished && (
                            <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>Upcoming</span>
                          )}
                          {mod.isCompleted && (
                            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Completed</span>
                          )}
                        </div>
                        <p className="text-secondary text-xs" style={{ margin: '0.25rem 0 0', wordBreak: 'break-word' }}>
                          {mod.description}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0, marginLeft: 'auto' }}>
                      <span className="text-muted text-xs">
                        {mod.completedLessons || 0} / {mod.totalLessons || mod.topics?.length || 0} Lessons
                      </span>
                      <div style={{ color: 'var(--color-text-muted)' }}>
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Topics & Lessons Drawer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ borderTop: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-surface)' }}
                      >
                        <div style={{ padding: 'clamp(0.75rem, 2.5vw, 1.25rem) clamp(1rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          {mod.topics.map((topic, topicIdx) => (
                            <div key={topic.id}>
                              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                                Topic {topicIdx + 1}: {topic.title}
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {topic.lessons.map((lesson) => {
                                  const isCompleted = lesson.isCompleted;

                                  return (
                                    <Link
                                      key={lesson.id}
                                      to={`/learn/${pathSlug}/${mod.slug}/${topic.slug}/${lesson.slug}`}
                                      style={{ textDecoration: 'none' }}
                                    >
                                      <div 
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          padding: '0.75rem 1rem',
                                          borderRadius: 'var(--radius-sm)',
                                          background: isCompleted ? 'rgba(16, 185, 129, 0.05)' : 'var(--color-bg-card)',
                                          border: isCompleted ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--color-border-subtle)',
                                          transition: 'all 0.15s ease',
                                          flexWrap: 'wrap',
                                          gap: '0.5rem'
                                        }}
                                      >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: '1 1 200px' }}>
                                          <div style={{ color: isCompleted ? 'var(--color-strong)' : 'var(--color-text-muted)', flexShrink: 0 }}>
                                            {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                          </div>
                                          <div style={{ minWidth: 0 }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-primary)', wordBreak: 'break-word' }}>
                                              {lesson.title}
                                            </div>
                                            {lesson.summary && (
                                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.15rem', wordBreak: 'break-word' }}>
                                                {lesson.summary}
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, marginLeft: 'auto' }}>
                                          <span className="text-secondary text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Clock size={12} />
                                            <span>{lesson.estimated_minutes}m</span>
                                          </span>
                                          <span className="text-secondary text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-xp)' }}>
                                            <Zap size={12} />
                                            <span>+{lesson.xp_reward} XP</span>
                                          </span>
                                          <ChevronRight size={15} color="var(--color-text-muted)" />
                                        </div>
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── TAB 2: PRACTICE & CHALLENGES VIEW ────────────────────────────── */}
      {activeMainTab === 'challenges' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>
              Coding Challenges & Gen Z Practice Modes
            </h2>
            <p className="text-secondary text-sm">
              Hands-on Python bug hunting, output prediction, and boss fights with automated verification in Pyodide.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
            {challenges.map((c) => {
              const isCompleted = c.isCompleted;
              return (
                <div 
                  key={c.id}
                  className="bento-card"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <AccentBar color={isCompleted ? '#10b981' : 'var(--color-primary)'} />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                        {c.challenge_type.replace(/_/g, ' ')}
                      </span>
                      {isCompleted ? (
                        <span className="badge badge-success" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Check size={11} />
                          <span>Solved</span>
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-xp)', fontWeight: 600 }}>
                          +{c.xp_reward} XP
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{c.title}</h3>
                    <p className="text-secondary text-xs" style={{ lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      {c.tagline}
                    </p>
                  </div>

                  <Link
                    to={`/learn/${pathSlug}/challenges/${c.slug}`}
                    className={`btn ${isCompleted ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ textDecoration: 'none', justifyContent: 'center', width: '100%', fontSize: '0.825rem' }}
                  >
                    <span>{isCompleted ? 'Review Solution' : 'Start Challenge'}</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── TAB 3: GUIDED PROJECTS VIEW ──────────────────────────────────── */}
      {activeMainTab === 'projects' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>
              Capstone Developer Projects
            </h2>
            <p className="text-secondary text-sm">
              Combine language fundamentals, data structures, and OOP to build portfolio-grade Python projects with step-by-step milestones.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 290px), 1fr))', gap: '1.5rem' }}>
            {projects.map((proj) => {
              const isCompleted = proj.isCompleted;
              return (
                <div
                  key={proj.id}
                  className="bento-card"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <AccentBar color="#38bdf8" />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                        Level {proj.level_number} Project
                      </span>
                      {isCompleted && (
                        <span className="badge badge-success" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Check size={11} />
                          <span>Completed</span>
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>{proj.title}</h3>
                    <p className="text-secondary text-xs" style={{ lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      {proj.tagline}
                    </p>

                    {/* Milestone progress bar */}
                    <div style={{ background: 'var(--color-bg-surface)', padding: '0.85rem', borderRadius: '6px', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
                        <span>Milestones</span>
                        <span style={{ fontWeight: 600, color: '#38bdf8' }}>{proj.completedMilestones?.length || 0} / {proj.milestones.length} Done</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${proj.progressPercentage}%`, background: '#38bdf8' }} />
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/learn/${pathSlug}/projects/${proj.slug}`}
                    className="btn btn-primary"
                    style={{ textDecoration: 'none', justifyContent: 'center', width: '100%', fontSize: '0.85rem' }}
                  >
                    <span>{proj.completedMilestones?.length > 0 ? 'Continue Project' : 'Start Project'}</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
