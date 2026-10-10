import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, Circle, Lock, Play, RotateCcw, 
  Terminal, Code2, Sparkles, Trophy, AlertCircle, ChevronRight, Check
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLearningLanguage } from '../contexts/LearningLanguageContext';
import { getProjectBySlug, completeProjectMilestone } from '../lib/learningService';
import { pyodideRunner } from '../lib/pyodideRunner';
import { LanguageSelector } from '../components/learning/LanguageSelector';
import { AccentBar } from '../components/ui/AccentBar';
import { SEO } from '../components/SEO';

export function ProjectRoom() {
  const { pathSlug, projectSlug } = useParams();
  const { user } = useAuth();
  const { language } = useLearningLanguage();

  const [project, setProject] = useState(null);
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [testOutput, setTestOutput] = useState('');
  const [testError, setTestError] = useState('');
  const [milestoneSuccess, setMilestoneSuccess] = useState(false);

  const loadProject = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProjectBySlug(pathSlug, projectSlug, user?.id);
      setProject(data);

      // Select first incomplete milestone
      if (data?.milestones) {
        const firstIncomplete = data.milestones.findIndex(m => !m.isCompleted);
        const idxToSet = firstIncomplete >= 0 ? firstIncomplete : 0;
        setActiveMilestoneIndex(idxToSet);
        setCode(data.milestones[idxToSet]?.starter_code || '');
        setMilestoneSuccess(Boolean(data.milestones[idxToSet]?.isCompleted));
      }
    } catch (err) {
      console.error('Failed to load project:', err);
    } finally {
      setLoading(false);
    }
  }, [pathSlug, projectSlug, user?.id]);

  useEffect(() => {
    loadProject();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loadProject]);

  const activeMilestone = project?.milestones?.[activeMilestoneIndex] || null;

  const handleSelectMilestone = (idx) => {
    const target = project?.milestones?.[idx];
    if (!target || (!target.isUnlocked && !target.isCompleted)) return;
    setActiveMilestoneIndex(idx);
    setCode(target.starter_code || '');
    setTestOutput('');
    setTestError('');
    setMilestoneSuccess(Boolean(target.isCompleted));
  };

  const handleVerifyMilestone = async () => {
    if (!activeMilestone || testing) return;
    setTesting(true);
    setTestOutput('');
    setTestError('');

    try {
      // Append test harness to user code
      const executionPayload = `${code}\n\n# --- Milestone Verification ---\n${activeMilestone.test_harness}`;
      const res = await pyodideRunner.runCode(executionPayload, { timeoutMs: 8000 });
      setTestOutput(res.stdout || '');

      if (!res.success || res.stderr) {
        setTestError(res.stderr || 'Verification checks failed');
        setMilestoneSuccess(false);
      } else {
        setMilestoneSuccess(true);
        // Persist milestone completion
        await completeProjectMilestone({
          projectSlug,
          milestoneId: activeMilestone.id,
          userId: user?.id
        });
        // Reload project state to update unlocks
        await loadProject();
      }
    } catch (err) {
      setTestError(`Execution error: ${err.message || String(err)}`);
      setMilestoneSuccess(false);
    } finally {
      setTesting(false);
    }
  };

  const handleReset = () => {
    if (!activeMilestone) return;
    setCode(activeMilestone.starter_code);
    setTestOutput('');
    setTestError('');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bento-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <AlertCircle size={40} color="var(--color-mistakes)" style={{ margin: '0 auto 1rem' }} />
        <h2>Project Not Found</h2>
        <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>
          The requested guided project could not be found.
        </p>
        <Link to={`/learn/${pathSlug}`} className="btn btn-primary" style={{ textDecoration: 'none' }}>
          Back to Course Overview
        </Link>
      </div>
    );
  }

  // Multilingual resolution
  const descriptionText = project.description?.[language] || project.description?.['en'] || '';
  const milestoneInstruction = activeMilestone?.instructions?.[language] || activeMilestone?.instructions?.['en'] || '';

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
      <SEO 
        title={`${project.title} | Revoraa Guided Projects`}
        description={project.tagline}
      />

      {/* Header Breadcrumbs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
          <Link to="/learn" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Learn</Link>
          <span>/</span>
          <Link to={`/learn/${pathSlug}`} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Course</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{project.title}</span>
        </div>

        <LanguageSelector compact />
      </div>

      {/* Project Hero Card */}
      <div className="bento-card" style={{ position: 'relative', padding: '2.5rem 2rem', marginBottom: '2rem' }}>
        <AccentBar color="#3b82f6" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
                Capstone Project
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                Level {project.level_number}
              </span>
              {project.isCompleted && (
                <span className="badge badge-success" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Check size={12} />
                  <span>Project Completed</span>
                </span>
              )}
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{project.title}</h1>
            <p className="text-secondary" style={{ maxWidth: '680px', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {descriptionText}
            </p>
          </div>

          {/* Progress Box */}
          <div style={{ minWidth: '200px', background: 'var(--color-bg-surface)', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
              Milestones Progress
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#38bdf8' }}>
              {project.completedMilestonesCount || 0} / {project.milestones.length}
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '0.5rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${project.progressPercentage}%`, background: '#38bdf8', transition: 'width 0.3s' }} />
            </div>
          </div>
        </div>

        {/* Milestone Steps Navigation Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${project.milestones.length}, 1fr)`,
          gap: '0.5rem',
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: '1.25rem'
        }}>
          {project.milestones.map((m, idx) => {
            const isSelected = activeMilestoneIndex === idx;
            const isLocked = !m.isUnlocked && !m.isCompleted;

            return (
              <button
                key={m.id}
                type="button"
                disabled={isLocked}
                onClick={() => handleSelectMilestone(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'var(--color-bg-surface)',
                  border: isSelected ? '1px solid #3b82f6' : '1px solid var(--color-border-subtle)',
                  color: isLocked ? 'var(--color-text-muted)' : isSelected ? '#60a5fa' : 'var(--color-text-primary)',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: m.isCompleted ? '#10b981' : isSelected ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '0.75rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {m.isCompleted ? <Check size={12} /> : isLocked ? <Lock size={11} /> : idx + 1}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.title.replace(/Milestone \d+: /, '')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Milestone Work Area */}
      {activeMilestone && (
        <div className="bento-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>{activeMilestone.title}</h2>
            <p className="text-secondary" style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
              {milestoneInstruction}
            </p>
          </div>

          {/* Code Editor */}
          <div style={{
            background: '#18181b',
            borderRadius: '8px',
            border: '1px solid var(--color-border-subtle)',
            overflow: 'hidden',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1.25rem',
              background: '#27272a',
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#f4f4f5' }}>
                <Code2 size={16} color="#38bdf8" />
                <span>Milestone Implementation (Python)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={handleReset}
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', minHeight: '30px', gap: '0.35rem' }}
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>

                <button
                  onClick={handleVerifyMilestone}
                  disabled={testing}
                  className="btn btn-primary"
                  style={{
                    padding: '0.35rem 0.95rem',
                    fontSize: '0.775rem',
                    minHeight: '30px',
                    gap: '0.35rem',
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    border: 'none'
                  }}
                >
                  <Play size={13} fill="#fff" />
                  <span>{testing ? 'Verifying Milestone...' : 'Verify Milestone'}</span>
                </button>
              </div>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              style={{
                width: '100%',
                minHeight: '240px',
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

            {/* Test Harness Terminal Output */}
            <div style={{
              background: '#121214',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              padding: '1rem 1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <Terminal size={14} color="#38bdf8" />
                <span>Milestone Verification Output</span>
              </div>

              <div style={{
                minHeight: '60px',
                maxHeight: '180px',
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
                    Click "Verify Milestone" to run automated tests against your implementation.
                  </span>
                )}

                {testing && (
                  <span style={{ color: '#f59e0b', fontStyle: 'italic' }}>
                    Executing milestone assertions in WebAssembly sandbox...
                  </span>
                )}

                {testOutput && <div style={{ color: '#a7f3d0' }}>{testOutput}</div>}
                {testError && <div style={{ color: '#f87171' }}>{testError}</div>}
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {milestoneSuccess && (
            <div style={{
              padding: '1rem 1.25rem',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 600 }}>
                <CheckCircle2 size={20} />
                <span>Milestone Passed & Verified!</span>
              </div>

              {activeMilestoneIndex + 1 < project.milestones.length ? (
                <button
                  type="button"
                  onClick={() => handleSelectMilestone(activeMilestoneIndex + 1)}
                  className="btn btn-primary"
                  style={{ fontSize: '0.825rem', minHeight: '34px', gap: '0.35rem' }}
                >
                  <span>Continue to Next Milestone</span>
                  <ChevronRight size={14} />
                </button>
              ) : (
                <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Trophy size={16} />
                  <span>Capstone Project Complete! (+{project.xp_reward} XP)</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Back button */}
      <div>
        <Link to={`/learn/${pathSlug}`} className="btn btn-secondary" style={{ textDecoration: 'none' }}>
          <ArrowLeft size={15} />
          <span>Back to Course Syllabus</span>
        </Link>
      </div>
    </div>
  );
}
