import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Link2, Search, ArrowRight, ArrowLeft, Check, Zap, CalendarClock, AlertCircle, Loader2, Plus, X, Trash2, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { saveSolvedProblem, detectPatternFromTags } from '../lib/problemsService';
import { resolveProblemMetadata } from '../lib/providers';
import { FEATURES } from '../lib/features';

const SOLVE_METHODS = [
  { key: 'myself',   label: 'Myself',        desc: 'Solved completely on my own' },
  { key: 'hint',     label: 'Needed Hint',   desc: 'Needed a nudge in the right direction' },
  { key: 'editorial',label: 'Used Editorial', desc: 'Referenced the solution or editorial' },
];

const PATTERNS = [
  'Arrays', 'Strings', 'Hashing', 'Two Pointers', 'Sliding Window', 'Prefix Sum',
  'Binary Search', 'Linked List', 'Stack', 'Queue', 'Heap', 'Tree', 'Binary Tree',
  'BST', 'Trie', 'Graph', 'DFS', 'BFS', 'Topological Sort', 'Union Find',
  'Backtracking', 'Recursion', 'Greedy', 'Dynamic Programming', 'Bit Manipulation',
  'Math', 'Intervals', 'Matrix', 'Design'
];

const INTERVALS = ['1 day', '3 days', '7 days', '14 days', '30 days', '60 days', '90 days'];

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: (direction) => ({ x: direction < 0 ? 50 : -50, opacity: 0, scale: 0.95, transition: { duration: 0.2 } })
};

export function AddProblem() {
  const { user, profile, usageData } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const isPremium = profile?.is_pro === true && new Date(profile?.expires_at) > new Date();
  const usageCurrent = usageData?.problems_added_this_month || 0;
  const usageLimit = usageData?.monthly_problem_limit || 15;
  const limitReached = FEATURES.PREMIUM && !isPremium && usageCurrent >= usageLimit;

  // Form State
  const [url, setUrl] = useState('');
  const [fetchedProblem, setFetchedProblem] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  
  const [solveMethod, setSolveMethod] = useState('');
  const [solveTime, setSolveTime] = useState('');
  const [confidence, setConfidence] = useState(3);
  const [notes, setNotes] = useState('');
  
  const [mistakes, setMistakes] = useState([]);
  const [mistakeInput, setMistakeInput] = useState('');
  const [manualPattern, setManualPattern] = useState('');

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [xpEarned, setXpEarned] = useState(50);
  const [savedProblemId, setSavedProblemId] = useState(null);

  const handleFetchProblem = async () => {
    if (!url.trim()) return;
    setFetchLoading(true);
    setFetchError('');
    try {
      const problem = await resolveProblemMetadata(url.trim());
      if (!problem) throw new Error('Problem not found. Please check the URL or try custom entry.');
      setFetchedProblem(problem);
      
      // Auto-detect pattern from tags
      const autoPattern = detectPatternFromTags(problem.tags || []);
      if (autoPattern) {
        setManualPattern(autoPattern);
      } else {
        const matched = PATTERNS.find(p => problem.tags?.some(t => t.toLowerCase() === p.toLowerCase()));
        setManualPattern(matched || '');
      }

      setDirection(1);
      setStep(2);
    } catch (err) {
      if (err.message === 'Unsupported platform') {
        setFetchError('This platform is not supported yet. Currently Revoraa supports LeetCode and Codeforces. Support for additional platforms is planned in a future update.');
      } else {
        setFetchError(err.message);
        // Give them a manual fallback problem state
        setFetchedProblem({ isManual: true, title: '', difficulty: 'Medium', tags: [], url: url.trim() });
      }
    } finally {
      setFetchLoading(false);
    }
  };

  const handleProceedManually = () => {
    setDirection(1);
    setStep(2);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  const isStep2Valid = solveMethod && solveTime && notes.trim() && manualPattern && (!fetchedProblem?.isManual || fetchedProblem?.title?.trim());

  const goToStep3 = () => {
    if (!isStep2Valid) return;
    setDirection(1);
    setStep(3);
  };

  const addMistake = () => {
    if (mistakeInput.trim()) {
      setMistakes([...mistakes, mistakeInput.trim()]);
      setMistakeInput('');
    }
  };

  const removeMistake = (index) => {
    setMistakes(mistakes.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!fetchedProblem || !user) return;
    setSaveLoading(true);
    setSaveError('');
    try {
      const xp = solveMethod === 'myself' ? 50 : solveMethod === 'hint' ? 30 : 15;
      setXpEarned(xp);
      const solved = await saveSolvedProblem({
        problemId: fetchedProblem.id,
        problemData: fetchedProblem,
        solveTimeMinutes: solveTime ? Number(solveTime) : null,
        solvedUsing: solveMethod,
        confidence,
        notes,
        mistakes: JSON.stringify(mistakes), // Save as JSON array string
        userPattern: manualPattern,
        userId: user.id,
      });
      setSavedProblemId(solved.id);
      setDirection(1);
      setIsSuccess(true);
      // Removed the setTimeout auto-navigate here for Instant Revision flow
    } catch (err) {
      if (err.message === 'FREE_LIMIT_EXCEEDED' || err.message.includes('FREE_LIMIT_EXCEEDED')) {
        setSaveError('FREE_LIMIT_EXCEEDED');
      } else if (err.message === 'USER_ALREADY_HAS_PROBLEM') {
        setSaveError('You have already added this problem to your library. Visit the Problem Library to update or review it.');
      } else {
        setSaveError(err.message || 'An error occurred while saving. Please try again.');
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const diffColor = d => d === 'Easy' ? 'var(--color-strong)' : d === 'Hard' ? 'var(--color-weak)' : 'var(--color-revision)';

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '4rem', paddingBottom: '4rem' }}>

      {limitReached ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bento-card clay-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255, 171, 0, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <Lock size={40} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Free Limit Reached</h2>
          <p className="text-secondary" style={{ marginBottom: '2rem' }}>
            You've tracked {usageLimit} problems this month. 
            {FEATURES.PREMIUM ? " Upgrade to Pro to track unlimited problems and unlock deeper analytics." : " Wait for your monthly reset to track more problems."}
          </p>
          {FEATURES.PREMIUM && (
            <button onClick={() => navigate('/pricing')} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Upgrade to Pro <ArrowRight size={16} />
            </button>
          )}
        </motion.div>
      ) : (
      <>
        {!isSuccess && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '3rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ flex: 1, height: '4px', background: i <= step ? 'var(--color-primary)' : 'var(--color-border-subtle)', borderRadius: '2px', transition: 'background 0.3s ease' }} />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait" custom={direction}>

        {isSuccess && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bento-card clay-card"
            style={{ textAlign: 'center', padding: '3rem 2rem' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <Check size={64} color="var(--color-emerald)" style={{ margin: '0 auto 1.5rem' }} />
            </motion.div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Problem Saved</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--color-bg-glass)', borderRadius: '100px', border: '1px solid var(--color-border-subtle)', color: 'var(--color-emerald)', fontWeight: 600 }}>
                <Zap size={16} /> +{xpEarned} XP
              </div>
              <p className="text-secondary" style={{ margin: 0 }}>✓ Roadmap Updated</p>
              <p className="text-secondary" style={{ margin: 0 }}>✓ Pattern Analytics Updated</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate(savedProblemId ? `/revision-hub/session?ids=${savedProblemId}` : '/dashboard')}
              >
                <Zap size={16} /> Revise Now
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate('/dashboard')}
              >
                Continue Studying
              </button>
              <button 
                className="btn btn-ghost" 
                onClick={() => navigate('/library')}
              >
                View in Library
              </button>
            </div>
          </motion.div>
        )}



        {/* STEP 1 — Problem Lookup */}
        {!isSuccess && step === 1 && (
          <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="bento-card">
            <h2 style={{ marginBottom: '0.5rem' }}>Add a Problem</h2>
            <p className="text-secondary" style={{ marginBottom: '2rem' }}>
              Paste a LeetCode URL, slug, or problem number. We'll auto-fill the metadata.
            </p>

            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <Link2 size={18} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="input"
                  placeholder="https://leetcode.com/problems/two-sum/ or '1' or 'two-sum'"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleFetchProblem()}
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)' }}
                />
              </div>
            </div>

            {fetchError && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontSize: '0.875rem' }}>
                  <AlertCircle size={16} /> {fetchError}
                </div>
                {fetchError !== 'This platform is not supported yet. Currently Revoraa supports LeetCode and Codeforces. Support for additional platforms is planned in a future update.' && (
                  <button 
                    onClick={handleProceedManually}
                    style={{ alignSelf: 'flex-start', background: 'transparent', border: '1px solid #f87171', color: '#f87171', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}>
                    Enter Problem Manually
                  </button>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-primary"
                onClick={handleFetchProblem}
                disabled={!url.trim() || fetchLoading}
                style={{ opacity: (!url.trim() || fetchLoading) ? 0.6 : 1, cursor: (!url.trim() || fetchLoading) ? 'not-allowed' : 'pointer' }}
              >
                {fetchLoading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Fetching…</> : <>Fetch Problem <ArrowRight size={16} /></>}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 2 — Log Attempt */}
        {!isSuccess && step === 2 && (
          <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="bento-card">
            <h2 style={{ marginBottom: '0.5rem' }}>Log Your Attempt</h2>

            {fetchedProblem && !fetchedProblem.isManual && (
              <div className="liquid-glass" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--color-bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Search size={20} className="text-muted" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>{fetchedProblem.title}</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: diffColor(fetchedProblem.difficulty) }}>{fetchedProblem.difficulty}</span>
                    {fetchedProblem.problem_tags?.slice(0, 3).map(t => (
                      <span key={t.tag} className="badge text-sm">{t.tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {fetchedProblem && fetchedProblem.isManual && (
              <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', border: '1px dashed var(--color-border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Problem Title <span className="text-muted">*</span></label>
                  <input type="text" className="input" placeholder="e.g. Two Sum" value={fetchedProblem.title} onChange={e => setFetchedProblem({...fetchedProblem, title: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Difficulty <span className="text-muted">*</span></label>
                    <select className="input" value={fetchedProblem.difficulty} onChange={e => setFetchedProblem({...fetchedProblem, difficulty: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)' }}>
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Platform</label>
                    <select className="input" value={fetchedProblem.platform || 'custom'} onChange={e => setFetchedProblem({...fetchedProblem, platform: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)' }}>
                      <option value="custom">Custom / Other</option>
                      <option value="leetcode">LeetCode</option>
                      <option value="codeforces">Codeforces</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Primary Pattern <span className="text-muted">*</span></label>
              <select
                className="input"
                value={manualPattern}
                onChange={e => setManualPattern(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)' }}
              >
                <option value="" disabled>Select the closest pattern...</option>
                {PATTERNS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 500 }}>How did you solve it? <span className="text-muted">*</span></label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {SOLVE_METHODS.map(({ key, label, desc }) => (
                  <div
                    key={key}
                    onClick={() => setSolveMethod(key)}
                    style={{
                      padding: '0.875rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${solveMethod === key ? 'var(--color-primary)' : 'var(--color-border-subtle)'}`,
                      background: solveMethod === key ? 'color-mix(in srgb, var(--color-primary) 10%, transparent)' : 'var(--color-bg-surface)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${solveMethod === key ? 'var(--color-primary)' : 'var(--color-border-hover)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {solveMethod === key && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-primary)' }} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 550 }}>{label}</div>
                      <div className="text-muted text-xs">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Notes & Approach <span className="text-muted">*</span></label>
              <textarea
                className="input"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Write your approach, key observations, or edge cases…"
                rows={2}
                style={{ width: '100%', padding: '0.75rem', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.875rem', lineHeight: 1.6 }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Mistakes / What Went Wrong</label>
                {mistakes.length > 0 && (
                  <button onClick={() => setMistakes([])} style={{ background: 'none', border: 'none', color: 'var(--color-weak)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Trash2 size={12} /> Clear All
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  className="input"
                  value={mistakeInput}
                  onChange={e => setMistakeInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addMistake()}
                  placeholder="e.g., Forgot base case, OBOE, syntax..."
                  style={{ flex: 1, padding: '0.5rem 0.75rem', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)' }}
                />
                <button className="btn btn-secondary" onClick={addMistake} disabled={!mistakeInput.trim()} style={{ padding: '0.5rem 1rem' }}>
                  <Plus size={16} /> Add
                </button>
              </div>
              
              {mistakes.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {mistakes.map((mistake, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ fontSize: '0.875rem' }}>{mistake}</span>
                      <button onClick={() => removeMistake(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 500, fontSize: '0.875rem' }}>Solve Time (min) <span className="text-muted">*</span></label>
                <input
                  type="number"
                  className="input"
                  value={solveTime}
                  onChange={(e) => setSolveTime(e.target.value)}
                  placeholder="e.g. 25"
                  min={1}
                  max={300}
                  style={{ width: '100%', padding: '0.75rem', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 500, fontSize: '0.875rem' }}>Confidence (1–5) <span className="text-muted">*</span></label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '42px' }}>
                  {[1, 2, 3, 4, 5].map(lvl => (
                    <div
                      key={lvl}
                      onClick={() => setConfidence(lvl)}
                      title={['Very Low', 'Low', 'Medium', 'High', 'Very High'][lvl - 1]}
                      style={{
                        flex: 1,
                        height: '100%',
                        background: confidence >= lvl ? 'var(--color-primary)' : 'var(--color-border-subtle)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        opacity: confidence >= lvl ? 1 : 0.4,
                        transition: 'all 0.2s',
                      }}
                    />
                  ))}
                </div>
                <p className="text-muted text-xs" style={{ marginTop: '0.25rem' }}>{['', 'Very Low', 'Low', 'Medium', 'High', 'Very High'][confidence]}</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-secondary" onClick={prevStep}>
                <ArrowLeft size={16} /> Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-primary"
                onClick={goToStep3}
                disabled={!isStep2Valid}
                style={{ opacity: !isStep2Valid ? 0.6 : 1 }}
              >
                Review Schedule <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 3 — Review Revision Schedule */}
        {!isSuccess && step === 3 && (
          <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="bento-card">
            <h2 style={{ marginBottom: '0.5rem' }}>Revision Schedule</h2>
            <p className="text-secondary" style={{ marginBottom: '2rem' }}>
              Based on your confidence score of <strong>{confidence}/5</strong>, here's your scheduled revision timeline.
            </p>

            <div className="clay-card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', textAlign: 'center' }}>
              <CalendarClock size={40} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                First Revision: Tomorrow
              </h3>
              <p className="text-secondary text-sm">
                Confidence: <strong>{['', 'Very Low', 'Low', 'Medium', 'High', 'Very High'][confidence]}</strong> → intervals will adapt as you revise
              </p>
            </div>

            <div style={{ display: 'flex', gap: '2px', marginBottom: '2.5rem' }}>
              {INTERVALS.map((label, i) => (
                <div
                  key={label}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.25rem',
                    background: i === 0 ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                    textAlign: 'center',
                    fontSize: '0.7rem',
                    fontWeight: i === 0 ? 700 : 400,
                    color: i === 0 ? '#fff' : 'var(--color-text-secondary)',
                    borderTopLeftRadius: i === 0 ? '6px' : 0,
                    borderBottomLeftRadius: i === 0 ? '6px' : 0,
                    borderTopRightRadius: i === INTERVALS.length - 1 ? '6px' : 0,
                    borderBottomRightRadius: i === INTERVALS.length - 1 ? '6px' : 0,
                    border: `1px solid ${i === 0 ? 'transparent' : 'var(--color-border-subtle)'}`,
                    borderLeft: i > 0 ? 'none' : undefined,
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {saveError === 'FREE_LIMIT_EXCEEDED' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,171,0,0.1)', border: '1px solid rgba(255,171,0,0.3)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                  <AlertCircle size={18} style={{ flexShrink: 0 }} /> Monthly limit reached
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Monthly limit reached. Your free quota will reset on {new Date(profile?.usage_reset_date).toLocaleDateString()}.
                  {FEATURES.PREMIUM && " Upgrade to Pro for unlimited tracking."}
                </p>
                {FEATURES.PREMIUM && (
                  <button onClick={() => window.location.href='/pricing'} className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    Upgrade to Pro
                  </button>
                )}
              </div>
            ) : saveError ? (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem' }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} /> {saveError}
              </div>
            ) : null}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-secondary" onClick={prevStep}>
                <ArrowLeft size={16} /> Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saveLoading}
                style={{ opacity: saveLoading ? 0.7 : 1 }}
              >
                {saveLoading
                  ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
                  : <><Check size={16} /> Save Problem</>
                }
              </motion.button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
      </>
      )}
    </div>
  );
}
