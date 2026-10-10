import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, AlertCircle, HelpCircle, 
  RotateCcw, ArrowRight, Zap, Trophy, Sparkles 
} from 'lucide-react';

export function KnowledgeCheck({ 
  quiz, 
  onSubmitQuiz, 
  onPassed = null 
}) {
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: string[] }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return null;
  }

  const handleSelectOption = (questionId, optionId, questionType) => {
    // If already submitted, prevent modifying options unless user retries
    if (submissionResult) return;

    if (questionType === 'single_choice') {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: [optionId]
      }));
    } else {
      // Multiple choice toggle
      setSelectedAnswers(prev => {
        const current = prev[questionId] || [];
        const exists = current.includes(optionId);
        const updated = exists 
          ? current.filter(id => id !== optionId)
          : [...current, optionId];
        return {
          ...prev,
          [questionId]: updated
        };
      });
    }
  };

  const isQuestionAnswered = (q) => {
    const ans = selectedAnswers[q.id];
    return Array.isArray(ans) && ans.length > 0;
  };

  const allAnswered = quiz.questions.every(isQuestionAnswered);

  const handleSubmit = async () => {
    if (!allAnswered || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await onSubmitQuiz(quiz.id, selectedAnswers);
      setSubmissionResult(result);
      if (result.passed && onPassed) {
        onPassed(result);
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
      setErrorMessage(err.message || 'Failed to submit quiz assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmissionResult(null);
    setErrorMessage(null);
  };

  // Find question result from submission
  const getQuestionResult = (questionId) => {
    if (!submissionResult || !submissionResult.results) return null;
    return submissionResult.results.find(r => r.question_id === questionId);
  };

  return (
    <div style={{
      background: 'var(--color-bg-card, #1c1c1f)',
      borderRadius: 'var(--radius-lg, 12px)',
      border: '1px solid var(--color-border-subtle, rgba(255,255,255,0.1))',
      padding: '2rem 1.75rem',
      margin: '2rem 0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
    }}>
      {/* Assessment Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--color-border-subtle, rgba(255,255,255,0.08))'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-warning" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <HelpCircle size={13} />
              <span>Knowledge Check</span>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {quiz.questions.length} Question{quiz.questions.length > 1 ? 's' : ''}
            </span>
          </div>
          <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>
            {quiz.title}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '20px',
            background: 'rgba(245, 158, 11, 0.1)',
            color: '#f59e0b',
            fontSize: '0.8rem',
            fontWeight: 600
          }}>
            <Zap size={14} />
            <span>+{quiz.xp_reward || 50} XP on passing</span>
          </div>
        </div>
      </div>

      {quiz.description && (
        <p className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          {quiz.description}
        </p>
      )}

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {quiz.questions.map((q, idx) => {
          const qResult = getQuestionResult(q.id);
          const userSelected = selectedAnswers[q.id] || [];
          const isSubmitted = Boolean(submissionResult);

          return (
            <div 
              key={q.id}
              style={{
                background: 'var(--color-bg-surface, rgba(255,255,255,0.03))',
                borderRadius: '8px',
                padding: '1.25rem',
                border: isSubmitted
                  ? qResult?.is_correct 
                    ? '1px solid rgba(16, 185, 129, 0.4)' 
                    : '1px solid rgba(239, 68, 68, 0.4)'
                  : '1px solid var(--color-border-subtle, rgba(255,255,255,0.06))'
              }}
            >
              {/* Question Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--color-bg-tertiary, #27272a)',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  flexShrink: 0
                }}>
                  {idx + 1}
                </span>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {q.question_type === 'single_choice' ? 'Select 1 correct answer' : 'Select all that apply'}
                    </span>
                    {isSubmitted && (
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        color: qResult?.is_correct ? '#10b981' : '#ef4444'
                      }}>
                        {qResult?.is_correct ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        <span>{qResult?.is_correct ? 'Correct' : 'Incorrect'}</span>
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.975rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
                    {q.question_text}
                  </div>
                </div>
              </div>

              {/* Optional Question Code Snippet */}
              {q.code_snippet && (
                <div style={{
                  background: '#121214',
                  borderRadius: '6px',
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: '0.825rem',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}>
                  <pre style={{ margin: 0, overflowX: 'auto' }}>
                    <code>{q.code_snippet}</code>
                  </pre>
                </div>
              )}

              {/* Answer Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {q.options.map((opt) => {
                  const isSelected = userSelected.includes(opt.id);
                  let optBorder = '1px solid rgba(255,255,255,0.08)';
                  let optBg = 'rgba(255,255,255,0.02)';
                  let optColor = 'var(--color-text-primary)';

                  if (isSubmitted && qResult) {
                    const isCorrectAnswer = qResult.correct_option_ids?.includes(opt.id);
                    if (isCorrectAnswer) {
                      optBorder = '1px solid #10b981';
                      optBg = 'rgba(16, 185, 129, 0.1)';
                      optColor = '#34d399';
                    } else if (isSelected && !isCorrectAnswer) {
                      optBorder = '1px solid #ef4444';
                      optBg = 'rgba(239, 68, 68, 0.1)';
                      optColor = '#f87171';
                    }
                  } else if (isSelected) {
                    optBorder = '1px solid var(--color-primary, #f59e0b)';
                    optBg = 'rgba(245, 158, 11, 0.08)';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(q.id, opt.id, q.question_type)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '6px',
                        background: optBg,
                        border: optBorder,
                        color: optColor,
                        fontSize: '0.9rem',
                        textAlign: 'left',
                        cursor: isSubmitted ? 'default' : 'pointer',
                        transition: 'all 0.15s ease',
                        outline: 'none',
                        width: '100%'
                      }}
                    >
                      {/* Checkbox / Radio Visual Indicator */}
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: q.question_type === 'single_choice' ? '50%' : '4px',
                        border: isSelected 
                          ? '2px solid var(--color-primary, #f59e0b)' 
                          : '2px solid rgba(255,255,255,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        background: isSelected ? 'var(--color-primary, #f59e0b)' : 'transparent'
                      }}>
                        {isSelected && (
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: q.question_type === 'single_choice' ? '50%' : '2px',
                            background: '#18181b'
                          }} />
                        )}
                      </div>

                      <span style={{ flex: 1 }}>{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanatory Feedback (Displayed after grading) */}
              {isSubmitted && qResult?.explanation && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '6px',
                  background: 'rgba(59, 130, 246, 0.08)',
                  borderLeft: '3px solid #3b82f6',
                  fontSize: '0.85rem',
                  lineHeight: 1.6,
                  color: '#bfdbfe'
                }}>
                  <div style={{ fontWeight: 600, color: '#60a5fa', marginBottom: '0.25rem' }}>
                    Authoritative Explanation:
                  </div>
                  <div>{qResult.explanation}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          borderRadius: '6px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Submission Status & Results Banner */}
      {submissionResult && (
        <div style={{
          marginTop: '1.75rem',
          padding: '1.25rem',
          borderRadius: '8px',
          background: submissionResult.passed 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)' 
            : 'rgba(239, 68, 68, 0.1)',
          border: submissionResult.passed ? '1px solid #10b981' : '1px solid #ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {submissionResult.passed ? (
              <Trophy size={28} color="#10b981" />
            ) : (
              <AlertCircle size={28} color="#ef4444" />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: submissionResult.passed ? '#34d399' : '#f87171' }}>
                {submissionResult.passed ? 'Assessment Passed!' : 'Assessment Not Passed'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                You scored <strong>{submissionResult.score} / {submissionResult.total_questions}</strong> ({submissionResult.percentage}%).
                Passing requirement: {submissionResult.passing_score}%.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {submissionResult.xp_awarded > 0 && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                background: '#10b981',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                <Sparkles size={15} />
                <span>+{submissionResult.xp_awarded} XP Awarded!</span>
              </div>
            )}
            {submissionResult.already_passed && (
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                (Mastery previously awarded)
              </div>
            )}
            <button
              onClick={handleRetry}
              className="btn btn-secondary"
              style={{ minHeight: '36px', fontSize: '0.85rem', gap: '0.35rem' }}
            >
              <RotateCcw size={14} />
              <span>Retry Assessment</span>
            </button>
          </div>
        </div>
      )}

      {/* Action Footer */}
      {!submissionResult && (
        <div style={{
          marginTop: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <span style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
            {allAnswered 
              ? 'All questions answered. Click to verify your understanding.' 
              : 'Please answer all questions above to submit.'}
          </span>

          <button
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            className="btn btn-primary"
            style={{
              minHeight: '40px',
              padding: '0.5rem 1.5rem',
              fontSize: '0.9rem',
              gap: '0.5rem'
            }}
          >
            <span>{isSubmitting ? 'Evaluating Server-Side...' : 'Check Answers'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
