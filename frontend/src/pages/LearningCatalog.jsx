import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, Terminal, Sparkles, Layers, ShieldCheck, PlayCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getLearningPaths, getResumeLesson, enrollInPath } from '../lib/learningService';
import { AccentBar } from '../components/ui/AccentBar';
import { SEO } from '../components/SEO';

export function LearningCatalog() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeTargets, setResumeTargets] = useState({});
  const [enrollingSlug, setEnrollingSlug] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLearningPaths(user?.id);
      setPaths(data);

      // Fetch resume target for each enrolled path
      const targets = {};
      for (const p of data) {
        if (p.isEnrolled) {
          const target = await getResumeLesson(p.slug, user?.id);
          if (target) targets[p.slug] = target;
        }
      }
      setResumeTargets(targets);
    } catch (err) {
      console.error('Failed to load learning paths:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();

    const handleRefetch = () => loadData();
    window.addEventListener('REFETCH_LEARNING', handleRefetch);
    return () => window.removeEventListener('REFETCH_LEARNING', handleRefetch);
  }, [loadData]);

  const handleEnrollOrResume = async (path) => {
    if (!path.isEnrolled) {
      setEnrollingSlug(path.slug);
      await enrollInPath(path.slug, user?.id);
      setEnrollingSlug(null);
    }

    const resume = resumeTargets[path.slug];
    if (resume) {
      navigate(`/learn/${path.slug}/${resume.moduleSlug}/${resume.topicSlug}/${resume.lessonSlug}`);
    } else {
      navigate(`/learn/${path.slug}`);
    }
  };

  return (
    <div>
      <SEO 
        title="Developer Learning Paths | Revoraa"
        description="Structured developer learning paths from language fundamentals to production engineering."
      />

      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-sm)',
            background: 'var(--color-primary-subtle)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)'
          }}>
            <BookOpen size={20} />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Developer Academy
          </span>
        </div>
        <h1>Developer Learning Paths</h1>
        <p className="text-secondary" style={{ maxWidth: '640px' }}>
          Master modern software engineering with structured roadmaps, conceptual walkthroughs, and verified progress tracking.
        </p>
      </header>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
          <div className="spinner" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {paths.map((path) => {
            const resume = resumeTargets[path.slug];
            const isEnrolled = path.isEnrolled;
            const pct = path.progressPercentage || 0;

            return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bento-card"
                style={{
                  position: 'relative',
                  border: isEnrolled ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid var(--color-border-subtle)',
                  padding: '2rem'
                }}
              >
                {isEnrolled && <AccentBar color="var(--color-primary)" />}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
                  {/* Title & Badge */}
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 54, height: 54, borderRadius: 'var(--radius-md)',
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--color-primary)', flexShrink: 0
                    }}>
                      <Terminal size={28} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                        <h2 style={{ fontSize: '1.4rem', margin: 0 }}>{path.title}</h2>
                        {isEnrolled && (
                          <span className="badge badge-warning" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
                            Enrolled · {pct}%
                          </span>
                        )}
                        <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
                          Level 1 Available
                        </span>
                      </div>
                      <p className="text-secondary" style={{ fontSize: '0.925rem', marginBottom: '0.75rem' }}>
                        {path.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Link
                      to={`/learn/${path.slug}`}
                      className="btn btn-secondary"
                      style={{ textDecoration: 'none' }}
                    >
                      <Layers size={15} />
                      <span>View Syllabus</span>
                    </Link>

                    <button
                      className="btn btn-primary"
                      onClick={() => handleEnrollOrResume(path)}
                      disabled={enrollingSlug === path.slug}
                    >
                      {isEnrolled ? (
                        <>
                          <PlayCircle size={15} />
                          <span>{pct > 0 ? 'Resume Learning' : 'Start Lesson 1'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={15} />
                          <span>{enrollingSlug === path.slug ? 'Enrolling...' : 'Enroll Free'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Progress bar if enrolled */}
                {isEnrolled && (
                  <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.825rem' }}>
                      <span className="text-secondary">
                        Overall Course Progress: <strong style={{ color: 'var(--color-text-primary)' }}>{path.completedLessonsCount || 0}</strong> of {path.totalLessonsCount || 12} lessons completed
                      </span>
                      {resume && (
                        <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          Next: <span style={{ color: 'var(--color-primary)' }}>{resume.title}</span>
                        </span>
                      )}
                    </div>
                    <div style={{ height: 6, background: 'var(--color-bg-surface)', borderRadius: 9999, overflow: 'hidden', border: '1px solid var(--color-border-subtle)' }}>
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

                {/* Learning Objectives Preview */}
                <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                  {path.learning_objectives?.slice(0, 3).map((obj, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        fontSize: '0.825rem', color: 'var(--color-text-secondary)',
                        background: 'var(--color-bg-surface)', padding: '0.55rem 0.85rem',
                        borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)'
                      }}
                    >
                      <ShieldCheck size={14} color="var(--color-strong)" style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{obj}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
