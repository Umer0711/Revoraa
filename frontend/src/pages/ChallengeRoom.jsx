import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Play, CheckCircle2, RotateCcw, 
  HelpCircle, AlertCircle, Sparkles, Terminal, Code2, 
  Zap, Flame, Bug, Shield, Check, Trophy
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLearningLanguage } from '../contexts/LearningLanguageContext';
import { getChallengeBySlug, completeChallenge } from '../lib/learningService';
import { pyodideRunner } from '../lib/pyodideRunner';
import { LanguageSelector } from '../components/learning/LanguageSelector';
import { AccentBar } from '../components/ui/AccentBar';
import { SEO } from '../components/SEO';

export function ChallengeRoom() {
  const { pathSlug, challengeSlug } = useParams();
  const { user } = useAuth();
  const { language, t } = useLearningLanguage();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [testOutput, setTestOutput] = useState('');
  const [testError, setTestError] = useState('');
  const [testPassed, setTestPassed] = useState(false);
  const [completionResult, setCompletionResult] = useState(null);
  const [activeHintIndex, setActiveHintIndex] = useState(-1);

  const loadChallenge = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getChallengeBySlug(pathSlug, challengeSlug, user?.id);
      setChallenge(data);
      setCode(data?.submittedCode || data?.starter_code || '');
      setTestPassed(Boolean(data?.isCompleted));
    } catch (err) {
      console.error('Failed to load challenge:', err);
    } finally {
      setLoading(false);
    }
  }, [pathSlug, challengeSlug, user?.id]);

  useEffect(() => {
    loadChallenge();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loadChallenge]);

  const handleRunAndTest = async () => {
    if (testing) return;
    setTesting(true);
    setTestOutput('');
    setTestError('');

    try {
      // If challenge has test_harness, append it to user code for automated assertion verification
      const codeToExecute = challenge.test_harness 
        ? `${code}\n\n# --- Verification Harness ---\n${challenge.test_harness}`
        : code;

      const result = await pyodideRunner.runCode(codeToExecute, { timeoutMs: 8000 });
      setTestOutput(result.stdout || '');

      if (!result.success || result.stderr) {
        setTestError(result.stderr || 'Test execution failed');
        setTestPassed(false);
      } else {
        // Verification succeeded
        setTestPassed(true);
        // Persist completion
        const comp = await completeChallenge({
          pathSlug,
          challengeSlug,
          submittedCode: code,
          userId: user?.id
        });
        setCompletionResult(comp);
      }
    } catch (err) {
      setTestError(`Execution error: ${err.message || String(err)}`);
      setTestPassed(false);
    } finally {
      setTesting(false);
    }
  };

  const handleReset = () => {
    if (!challenge) return;
    setCode(challenge.starter_code);
    setTestOutput('');
    setTestError('');
    setTestPassed(challenge.isCompleted);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="bento-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <AlertCircle size={40} color="var(--color-mistakes)" style={{ margin: '0 auto 1rem' }} />
        <h2>Challenge Not Found</h2>
        <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>
          The requested coding challenge could not be found.
        </p>
        <Link to={`/learn/${pathSlug}`} className="btn btn-primary" style={{ textDecoration: 'none' }}>
          Back to Course Overview
        </Link>
      </div>
    );
  }

  // Multilingual text resolution
  const instructionText = challenge.instructions?.[language] || challenge.instructions?.['en'] || '';
  const isFallback = language !== 'en' && !challenge.instructions?.[language];
  const hintsList = challenge.hints?.[language] || challenge.hints?.['en'] || [];
  const explanationText = challenge.solution_explanation?.[language] || challenge.solution_explanation?.['en'] || '';

  const getChallengeBadge = () => {
    switch (challenge.challenge_type) {
      case 'cooked_or_cracked':
        return { label: 'Cooked or Cracked 🔥', color: '#f97316' };
      case 'bug_hunt':
        return { label: 'Bug Hunt 🐛', color: '#ef4444' };
      case 'boss_fight':
        return { label: 'Boss Fight ⚔️', color: '#8b5cf6' };
      case 'internet_is_wrong':
        return { label: 'Internet Is Wrong 🧢', color: '#3b82f6' };
      default:
        return { label: 'Coding Practice 💻', color: 'var(--color-primary)' };
    }
  };

  const badge = getChallengeBadge();

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '4rem' }}>
      <SEO 
        title={`${challenge.title} | Revoraa Practice`}
        description={challenge.tagline}
      />

      {/* Breadcrumbs & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
          <Link to="/learn" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Learn</Link>
          <span>/</span>
          <Link to={`/learn/${pathSlug}`} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Course</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{challenge.title}</span>
        </div>

        <LanguageSelector isFallback={isFallback} compact />
      </div>

      {/* Main Challenge Bento Card */}
      <div className="bento-card" style={{ position: 'relative', padding: '2.5rem 2rem', marginBottom: '2rem' }}>
        <AccentBar color={badge.color} />

        {/* Header Bar */}
        <div style={{ marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              padding: '0.2rem 0.6rem', borderRadius: '4px',
              background: `color-mix(in srgb, ${badge.color} 15%, transparent)`,
              color: badge.color, fontWeight: 700, fontSize: '0.75rem'
            }}>
              {badge.label}
            </span>
            <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
              {challenge.difficulty}
            </span>
            {testPassed && (
              <span className="badge badge-success" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Check size={12} />
                <span>Solved</span>
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            {challenge.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
            <span>{challenge.tagline}</span>
            <span style={{ color: 'var(--color-xp)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Zap size={14} />
              <span>+{challenge.xp_reward} XP</span>
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          background: 'var(--color-bg-surface)',
          borderRadius: '8px',
          padding: '1.25rem',
          border: '1px solid var(--color-border-subtle)',
          marginBottom: '2rem',
          lineHeight: 1.6,
          fontSize: '0.925rem'
        }}>
          <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.4rem' }}>
            Task Instructions:
          </div>
          <div style={{ color: 'var(--color-text-secondary)' }}>
            {instructionText}
          </div>
        </div>

        {/* Code Editor & Test Harness Panel */}
        <div style={{
          background: '#18181b',
          borderRadius: '8px',
          border: '1px solid var(--color-border-subtle)',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1.25rem',
            background: '#27272a',
            borderBottom: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#f4f4f5' }}>
              <Code2 size={16} color="var(--color-primary)" />
              <span>Solution Editor (Python 3.12)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={handleReset}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', minHeight: '30px', gap: '0.35rem' }}
                title="Reset to starter code"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>

              <button
                onClick={handleRunAndTest}
                disabled={testing}
                className="btn btn-primary"
                style={{
                  padding: '0.35rem 0.95rem',
                  fontSize: '0.775rem',
                  minHeight: '30px',
                  gap: '0.35rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none'
                }}
              >
                <Play size={13} fill="#fff" />
                <span>{testing ? 'Testing Code...' : 'Test Solution'}</span>
              </button>
            </div>
          </div>

          {/* Textarea Editor */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            style={{
              width: '100%',
              minHeight: '220px',
              padding: '1rem 1.25rem',
              background: '#1e1e1e',
              color: '#f8fafc',
              fontFamily: 'ui-monospace, monospace',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              border: 'none',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />

          {/* Console / Test Output */}
          <div style={{
            background: '#121214',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '1rem 1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <Terminal size={14} color="#38bdf8" />
              <span>Test Output & Assertions</span>
            </div>

            <div style={{
              minHeight: '60px',
              maxHeight: '200px',
              overflowY: 'auto',
              background: '#09090b',
              padding: '0.75rem',
              borderRadius: '6px',
              fontFamily: 'ui-monospace, monospace',
              fontSize: '0.825rem',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap'
            }}>
              {!testOutput && !testError && !testing && (
                <span style={{ color: '#52525b', fontStyle: 'italic' }}>
                  Click "Test Solution" to run assertions in the Pyodide sandbox.
                </span>
              )}

              {testing && (
                <span style={{ color: '#f59e0b', fontStyle: 'italic' }}>
                  Running solution against test harness in WebAssembly...
                </span>
              )}

              {testOutput && <div style={{ color: '#a7f3d0' }}>{testOutput}</div>}

              {testError && (
                <div style={{ color: '#f87171', marginTop: testOutput ? '0.5rem' : '0' }}>
                  {testError}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success Banner */}
        {testPassed && (
          <div style={{
            padding: '1.25rem',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)',
            border: '1px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Trophy size={28} color="#10b981" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#34d399' }}>
                  Challenge Solved!
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  Your code passed all assertions and verified successfully.
                </div>
              </div>
            </div>

            {completionResult?.xp_awarded > 0 && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.4rem 0.8rem', borderRadius: '6px',
                background: '#10b981', color: '#fff', fontWeight: 700, fontSize: '0.85rem'
              }}>
                <Sparkles size={15} />
                <span>+{completionResult.xp_awarded} XP Awarded!</span>
              </div>
            )}
          </div>
        )}

        {/* Progressive Hints Drawer */}
        {hintsList.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HelpCircle size={15} color="#60a5fa" />
              <span>{t('showHint')}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {hintsList.map((hint, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: '6px',
                    padding: '0.75rem 1rem'
                  }}
                >
                  {activeHintIndex >= idx ? (
                    <div style={{ fontSize: '0.85rem', color: '#bfdbfe' }}>
                      {hint}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveHintIndex(idx)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.825rem',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      Unlock Hint {idx + 1}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Solution Explanation (Unlocked when solved) */}
        {testPassed && explanationText && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: '8px',
            padding: '1.25rem',
            marginBottom: '2rem'
          }}>
            <div style={{ fontWeight: 600, color: '#60a5fa', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              Solution Walkthrough:
            </div>
            <div style={{ fontSize: '0.875rem', color: '#bfdbfe', lineHeight: 1.6 }}>
              {explanationText}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to={`/learn/${pathSlug}`} className="btn btn-secondary" style={{ textDecoration: 'none' }}>
          <ArrowLeft size={15} />
          <span>Back to Course Syllabus</span>
        </Link>
      </div>
    </div>
  );
}
