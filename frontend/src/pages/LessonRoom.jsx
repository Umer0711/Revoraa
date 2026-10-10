import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, CheckCircle2, Clock, 
  Zap, ShieldCheck, Check, Sparkles, AlertCircle,
  Terminal, Code2, BookOpen
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLearningLanguage } from '../contexts/LearningLanguageContext';
import { getLessonBySlug, completeLesson, submitQuizAssessment } from '../lib/learningService';
import { getLocalizedLesson } from '../lib/translations/pythonTranslations';
import { MacCodeTerminal } from '../components/MacCodeTerminal';
import { PythonPlayground } from '../components/learning/PythonPlayground';
import { KnowledgeCheck } from '../components/learning/KnowledgeCheck';
import { LanguageSelector } from '../components/learning/LanguageSelector';
import { AccentBar } from '../components/ui/AccentBar';
import { SEO } from '../components/SEO';

export function LessonRoom() {
  const { pathSlug, moduleSlug, topicSlug, lessonSlug } = useParams();
  const { user } = useAuth();
  const { language, t } = useLearningLanguage();
  const navigate = useNavigate();

  const [rawLesson, setRawLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const loadLesson = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLessonBySlug(pathSlug, moduleSlug, topicSlug, lessonSlug, user?.id);
      setRawLesson(data);
      setQuizCompleted(false);
    } catch (err) {
      console.error('Failed to load lesson:', err);
    } finally {
      setLoading(false);
    }
  }, [pathSlug, moduleSlug, topicSlug, lessonSlug, user?.id]);

  useEffect(() => {
    loadLesson();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loadLesson]);

  const handleMarkComplete = async () => {
    if (!rawLesson || completing || rawLesson.isCompleted) return;

    try {
      setCompleting(true);
      await completeLesson(rawLesson.id, pathSlug, user?.id);
      setRawLesson(prev => ({ ...prev, isCompleted: true }));
    } catch (err) {
      console.error('Failed to complete lesson:', err);
    } finally {
      setCompleting(false);
    }
  };

  const handleQuizSubmit = async (quizId, answers) => {
    const res = await submitQuizAssessment(quizId, answers, user?.id, rawLesson?.quiz);
    if (res.passed) {
      setQuizCompleted(true);
    }
    return res;
  };

  const handleNextLesson = () => {
    if (rawLesson?.nextLesson) {
      navigate(`/learn/${pathSlug}/${rawLesson.nextLesson.moduleSlug}/${rawLesson.nextLesson.topicSlug}/${rawLesson.nextLesson.lessonSlug}`);
    } else {
      navigate(`/learn/${pathSlug}`);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!rawLesson) {
    return (
      <div className="bento-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <AlertCircle size={40} color="var(--color-mistakes)" style={{ margin: '0 auto 1rem' }} />
        <h2>Lesson Not Found</h2>
        <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>
          The requested lesson does not exist or has not yet been published.
        </p>
        <Link to={`/learn/${pathSlug}`} className="btn btn-primary" style={{ textDecoration: 'none' }}>
          Back to Course Overview
        </Link>
      </div>
    );
  }

  // Resolve language variant with transparent English fallback
  const lesson = getLocalizedLesson(rawLesson, language);
  const isAvailable = lesson.is_published;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '4rem' }}>
      <SEO 
        title={`${lesson.title} | ${lesson.pathTitle || 'Revoraa'}`}
        description={lesson.summary || 'Python development interactive lesson on Revoraa.'}
      />

      {/* Top Header: Breadcrumbs & Language Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
          <Link to="/learn" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>{t('learn')}</Link>
          <span>/</span>
          <Link to={`/learn/${pathSlug}`} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>{lesson.pathTitle}</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-text-secondary)' }}>{lesson.moduleTitle}</span>
          <span>/</span>
          <span style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{lesson.title}</span>
        </div>

        <LanguageSelector isFallback={lesson.isFallback} compact />
      </div>

      {/* Main Lesson Container */}
      <div className="bento-card" style={{ position: 'relative', padding: 'clamp(1.25rem, 3.5vw, 2.5rem) clamp(1rem, 3vw, 2rem)', marginBottom: '2rem' }}>
        <AccentBar color={lesson.isCompleted ? 'var(--color-strong)' : 'var(--color-primary)'} />

        {/* Lesson Header */}
        <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
              {lesson.levelTitle}
            </span>
            <span className="badge" style={{ fontSize: '0.75rem', background: 'var(--color-bg-surface)' }}>
              {lesson.topicTitle}
            </span>
            {lesson.isCompleted && (
              <span className="badge badge-success" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Check size={12} />
                <span>{t('completed')}</span>
              </span>
            )}
            {lesson.isFallback && language !== 'en' && (
              <span className="badge" style={{ fontSize: '0.7rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                English Fallback
              </span>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.1rem)', marginBottom: '0.75rem', letterSpacing: '-0.03em', wordBreak: 'break-word' }}>
            {lesson.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={15} />
              <span>{lesson.estimated_minutes} min read</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-xp)' }}>
              <Zap size={15} />
              <span>+{lesson.xp_reward} XP on completion</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        {isAvailable ? (
          <div>
            {/* Learning Objectives Callout */}
            {lesson.learning_objectives?.length > 0 && (
              <div 
                style={{
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  marginBottom: '2rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--color-text-primary)' }}>
                  <ShieldCheck size={16} color="var(--color-strong)" />
                  <span>{t('learningObjectives')}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {lesson.learning_objectives.map((obj, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>•</span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Authored Text Content */}
            <div 
              style={{ 
                fontSize: '0.975rem', 
                lineHeight: 1.7, 
                color: 'var(--color-text-primary)',
                marginBottom: '2rem'
              }}
            >
              {(lesson.content_markdown || lesson.content)?.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={idx} style={{ fontSize: '1.25rem', margin: '1.75rem 0 0.75rem', color: 'var(--color-text-primary)' }}>
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('```')) {
                  const cleaned = paragraph.replace(/```[a-z]*\n?/g, '').trim();
                  return (
                    <div key={idx} style={{ margin: '1rem 0' }}>
                      <MacCodeTerminal code={cleaned} language="text" />
                    </div>
                  );
                }
                return (
                  <p key={idx} style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* In-Browser Interactive Python Playground */}
            {(lesson.code_snippet || lesson.interactive_code) && (
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Code2 size={18} color="var(--color-primary)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-primary)' }}>
                    Interactive Python Playground
                  </span>
                </div>
                <p className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  Execute and edit the Python code directly in your browser. All code runs safely in a client-side WebAssembly Web Worker.
                </p>

                <PythonPlayground 
                  initialCode={lesson.code_snippet || lesson.interactive_code}
                  title={`${lesson.title} — Playground`}
                  exercisePrompt={lesson.guided_exercise?.prompt}
                  expectedOutput={lesson.guided_exercise?.expected_output || lesson.expected_output}
                />

                {lesson.code_explanation && (
                  <p className="text-secondary text-sm" style={{ fontStyle: 'italic', marginTop: '0.5rem' }}>
                    <strong>Code Note:</strong> {lesson.code_explanation}
                  </p>
                )}
              </div>
            )}

            {/* Key Takeaways Callout */}
            {lesson.key_takeaways?.length > 0 && (
              <div 
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.04) 0%, transparent 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  marginBottom: '2rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.6rem', color: 'var(--color-primary)' }}>
                  <Sparkles size={16} />
                  <span>{t('keyTakeaways')}</span>
                </div>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {lesson.key_takeaways.map((point, i) => (
                    <li key={i} style={{ marginBottom: '0.35rem' }}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Interactive Knowledge Check / Quiz */}
            {lesson.quiz && (
              <div style={{ marginBottom: '2.5rem' }}>
                <KnowledgeCheck 
                  quiz={lesson.quiz}
                  onSubmitQuiz={handleQuizSubmit}
                  onPassed={() => setQuizCompleted(true)}
                />
              </div>
            )}

            {/* Revision Prompts Callout */}
            {lesson.revision_prompts?.length > 0 && (
              <div 
                style={{
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  marginBottom: '2rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.6rem', color: '#60a5fa' }}>
                  <BookOpen size={16} />
                  <span>{t('activeRecall')}</span>
                </div>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {lesson.revision_prompts.map((prompt, i) => (
                    <li key={i} style={{ marginBottom: '0.35rem' }}>{prompt}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Completion Action Box */}
            <div 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                paddingTop: '1.75rem',
                borderTop: '1px solid var(--color-border-subtle)',
                marginTop: '2rem'
              }}
            >
              <div>
                {lesson.isCompleted ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-strong)', fontWeight: 500, fontSize: '0.9rem' }}>
                    <CheckCircle2 size={18} />
                    <span>{t('lessonCompleted')}</span>
                  </div>
                ) : (
                  <span className="text-secondary text-xs">
                    Marking complete records your progress and awards +{lesson.xp_reward} XP.
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {!lesson.isCompleted ? (
                  <button
                    className="btn btn-primary"
                    onClick={handleMarkComplete}
                    disabled={completing}
                  >
                    <Check size={16} />
                    <span>{completing ? 'Recording...' : t('markComplete')}</span>
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary"
                    onClick={handleNextLesson}
                  >
                    <span>{lesson.nextLesson ? t('nextLesson') : 'Back to Course'}</span>
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Placeholder / Planned Lesson Banner */
          <div style={{ padding: '2rem 1rem', textAlign: 'center', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border-subtle)' }}>
            <Terminal size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Planned Curriculum Module</h3>
            <p className="text-secondary" style={{ maxWidth: '480px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              This lesson is part of <strong>{lesson.levelTitle}</strong> ({lesson.moduleTitle}) and is currently scheduled for upcoming release.
            </p>
            <Link to={`/learn/${pathSlug}`} className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              Return to Active Modules
            </Link>
          </div>
        )}
      </div>

      {/* Navigation Footer (Prev / Next) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        {lesson.prevLesson ? (
          <Link
            to={`/learn/${pathSlug}/${lesson.prevLesson.moduleSlug}/${lesson.prevLesson.topicSlug}/${lesson.prevLesson.lessonSlug}`}
            className="btn btn-secondary"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}
          >
            <ArrowLeft size={15} />
            <span>{t('prevLesson')}: {lesson.prevLesson.title.slice(0, 22)}...</span>
          </Link>
        ) : (
          <div />
        )}

        {lesson.nextLesson && (
          <Link
            to={`/learn/${pathSlug}/${lesson.nextLesson.moduleSlug}/${lesson.nextLesson.topicSlug}/${lesson.nextLesson.lessonSlug}`}
            className="btn btn-secondary"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}
          >
            <span>{t('nextLesson')}: {lesson.nextLesson.title.slice(0, 22)}...</span>
            <ArrowRight size={15} />
          </Link>
        )}
      </div>
    </div>
  );
}
