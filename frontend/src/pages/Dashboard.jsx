import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Activity, Target, Award, CheckCircle2, TrendingUp, Clock, AlertCircle, Flame, Zap, ArrowRight } from 'lucide-react';
import { motion, animate, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardData } from '../lib/dataService';
import { supabase } from '../lib/supabaseClient';
import { useRealtime } from '../contexts/RealtimeContext';
import { submitInstantRevision } from '../lib/problemsService';
import { usePermissions } from '../lib/permissions';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { SEO } from '../components/SEO';


/* Animated number counter */
function Counter({ from = 0, to, duration = 1.2, delay = 0.3, suffix = '' }) {
  const nodeRef = useRef(null);
  useEffect(() => {
    const node = nodeRef.current;
    const controls = animate(from, to, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) { if (node) node.textContent = Math.round(v) + suffix; }
    });
    return () => controls.stop();
  }, [from, to, duration, delay, suffix]);
  return <span ref={nodeRef}>{from + suffix}</span>;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 22 } }
};

function AccentBar({ color }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: '1.5rem', right: '1.5rem',
      height: '1px',
      background: `linear-gradient(to right, transparent, ${color}, transparent)`,
      opacity: 0.6,
    }} />
  );
}

function SkeletonCard({ className }) {
  return (
    <div className={`bento-card ${className}`} style={{ animation: 'pulse 2s infinite' }}>
      <div style={{ height: 12, width: '40%', background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: '1rem' }} />
      <div style={{ height: 28, width: '60%', background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: '0.5rem' }} />
      <div style={{ height: 10, width: '80%', background: 'rgba(255,255,255,0.04)', borderRadius: 4 }} />
    </div>
  );
}

export function Dashboard() {
  const { user, subscriptionData, usageData } = useAuth();
  const { refreshKey } = useRealtime();
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [quickRecallProblem, setQuickRecallProblem] = useState(null);
  const [gradingLoading, setGradingLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [initTasks, setInitTasks] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const profileData = await supabase.from('profiles').select('full_name, is_synchronized').eq('auth_id', user.id).single();
      setProfile(profileData.data);

      if (profileData.data?.is_synchronized === false) {
        // Start background initialization flow
        setInitTasks({
          roadmap: false,
          analytics: false,
          achievements: false,
          missions: false
        });
        setLoading(false); // Let dashboard render immediately with skeleton/empty state

        try {
          // 1. Sync user data (Roadmap & Stats)
          await supabase.rpc('sync_user_data', { p_user_id: user.id });
          setInitTasks(p => ({ ...p, roadmap: true }));

          // 2. We can simulate or fetch other things concurrently
          const [dashData] = await Promise.all([
            getDashboardData(user.id).then(d => {
              setInitTasks(p => ({ ...p, achievements: true, missions: true }));
              return d;
            }),
            // Small artificial delay for aesthetics so the widget doesn't flash instantly
            new Promise(res => setTimeout(res, 800)).then(() => setInitTasks(p => ({ ...p, analytics: true })))
          ]);

          setData(dashData);
          setQuickRecallProblem(null);

          // Update profile locally & remotely
          await supabase.from('profiles').update({ is_synchronized: true, has_completed_onboarding: true }).eq('auth_id', user.id);
          
          // Hide widget after a short delay
          setTimeout(() => setInitTasks(null), 2500);

        } catch (e) {
          console.error('Background init failed:', e);
          setInitTasks(null); // Fallback
        }
        return; // Exit here
      }

      // Normal flow for synchronized users
      const [dashData, latestProblemRes] = await Promise.all([
        getDashboardData(user.id),
        supabase.from('solved_problems')
          .select('id, confidence, problem:problems(title, difficulty, url)')
          .eq('user_id', user.id)
          .order('first_solved_at', { ascending: false })
          .limit(1)
          .maybeSingle()
      ]);

      setData(dashData);
      
      let quickRecall = null;
      if (latestProblemRes.data) {
        const { data: hasInstantRev } = await supabase.from('revision_history')
          .select('id')
          .eq('solved_problem_id', latestProblemRes.data.id)
          .eq('revision_number', 0)
          .maybeSingle();
        if (!hasInstantRev) {
          quickRecall = latestProblemRes.data;
        }
      }
      setQuickRecallProblem(quickRecall);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();

    // Realtime subscription for stats changes
    if (!user) return;
    const channel = supabase
      .channel(`dashboard:${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_stats',
        filter: `user_id=eq.${user.id}`,
      }, () => fetchData())
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, () => fetchData())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user, fetchData, refreshKey]);

  const stats = data?.stats ?? { total_solved: 0, xp: 0, current_streak: 0, longest_streak: 0, level: 1 };
  const todayRevisions = data?.todayRevisions ?? [];
  const recentAchievements = data?.recentAchievements ?? [];
  const xpToNextLevel = 500 - ((stats.xp || 0) % 500);
  const xpProgress = (((stats.xp || 0) % 500) / 500) * 100;
  const readiness = Math.min(100, Math.round(((stats.total_solved || 0) / 200) * 100));

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = profile?.full_name?.split(' ')?.[0] ?? user?.email?.split('@')?.[0] ?? 'there';

  if (loading) {
    return (
      <div className="dashboard-page">
      <SEO title="Dashboard" url="https://revoraa.com/dashboard" />
        <div className="bento-grid">
          <SkeletonCard className="col-span-2 row-span-2" />
          <SkeletonCard className="col-span-1 row-span-2" />
          <SkeletonCard className="col-span-1" />
          <SkeletonCard className="col-span-1" />
          <SkeletonCard className="col-span-2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          <AlertCircle size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>Failed to load dashboard data. <button onClick={fetchData} style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button></p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>{greeting()}, {firstName} 👋</h1>
            <p className="text-secondary">
              {todayRevisions.length > 0
                ? `You have ${todayRevisions.length} revision${todayRevisions.length === 1 ? '' : 's'} due today.`
                : 'All caught up! Great work keeping up with your revisions.'}
            </p>
          </div>
          <Link to="/add-problem" className="btn btn-primary" style={{ flexShrink: 0 }}>
            <Zap size={15} /> Add Problem
          </Link>
        </div>
      </header>

      <AnimatePresence>
        {quickRecallProblem && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bento-card clay-card"
            style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--color-bg-glass)', border: '1px solid var(--color-primary)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Zap size={18} color="var(--color-primary)" />
                  <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-primary)' }}>Quick Recall</h2>
                </div>
                <p className="text-secondary" style={{ margin: 0 }}>Reinforce the problem you just added.</p>
              </div>
              <a href={quickRecallProblem.problem?.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {quickRecallProblem.problem?.title} <ArrowRight size={14} />
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <button 
                onClick={async () => {
                  setGradingLoading(true);
                  await submitInstantRevision({ userId: user.id, solvedProblemId: quickRecallProblem.id, result: 'easy', confidence: Math.min(5, quickRecallProblem.confidence + 1), solveTime: null });
                  setQuickRecallProblem(null);
                  setGradingLoading(false);
                }}
                disabled={gradingLoading}
                className="bento-card" 
                style={{ textAlign: 'center', cursor: 'pointer', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', transition: 'transform 0.2s' }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>😎</div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#10b981' }}>Solved Easily</div>
              </button>
              
              <button 
                onClick={async () => {
                  setGradingLoading(true);
                  await submitInstantRevision({ userId: user.id, solvedProblemId: quickRecallProblem.id, result: 'hint', confidence: quickRecallProblem.confidence, solveTime: null });
                  setQuickRecallProblem(null);
                  setGradingLoading(false);
                }}
                disabled={gradingLoading}
                className="bento-card" 
                style={{ textAlign: 'center', cursor: 'pointer', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', transition: 'transform 0.2s' }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🤔</div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#f59e0b' }}>Needed Hint</div>
              </button>
              
              <button 
                onClick={async () => {
                  setGradingLoading(true);
                  await submitInstantRevision({ userId: user.id, solvedProblemId: quickRecallProblem.id, result: 'hard', confidence: Math.max(1, quickRecallProblem.confidence - 1), solveTime: null });
                  setQuickRecallProblem(null);
                  setGradingLoading(false);
                }}
                disabled={gradingLoading}
                className="bento-card" 
                style={{ textAlign: 'center', cursor: 'pointer', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', transition: 'transform 0.2s' }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🤯</div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#ef4444' }}>Couldn't Solve</div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="bento-grid" variants={container} initial="hidden" animate="show">
        {/* Subscription & Usage Widget */}
        <motion.div variants={item} className="bento-card col-span-1 md:col-span-1 lg:col-span-1" style={{ position: 'relative', overflow: 'hidden', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '1.25rem' }}>
          <AccentBar color="var(--color-primary)" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={14} color="var(--color-primary)"/> {subscriptionData?.status === 'active' ? 'Pro Plan' : 'Free Plan'}
            </h3>
            {subscriptionData?.status !== 'active' && (
              <Link to="/pricing" style={{ fontSize: '0.75rem', color: '#000', background: 'var(--color-primary)', padding: '0.2rem 0.6rem', borderRadius: '1rem', textDecoration: 'none', fontWeight: 600 }}>Upgrade</Link>
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                {subscriptionData?.status === 'active' ? 'Unlimited' : `${usageData?.problems_added_this_month || 0}`}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500, paddingBottom: '0.2rem' }}>
                {subscriptionData?.status === 'active' ? 'Problems' : `/ ${usageData?.monthly_problem_limit || 15} Used`}
              </span>
            </div>
            {subscriptionData?.status !== 'active' && (
              <div style={{ width: '100%', height: '6px', background: 'var(--color-bg-light)', borderRadius: '3px', marginTop: '0.5rem', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, ((usageData?.problems_added_this_month || 0) / (usageData?.monthly_problem_limit || 15)) * 100)}%`, height: '100%', background: 'var(--color-primary)', borderRadius: '3px' }} />
              </div>
            )}
          </div>
        </motion.div>

        {/* Today's Mission – Hero */}
        <motion.div
          variants={item}
          whileHover={{ y: -3 }}
          className="bento-card col-span-2 row-span-2"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}
        >
          <AccentBar color="var(--color-mission)" />
          <div>
            <div className="card-header" style={{ marginBottom: '1.25rem' }}>
              <Target size={16} color="var(--color-mission)" />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-mission)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Today's Mission
              </span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 650, letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>
              {todayRevisions.length > 0 ? `Revise ${todayRevisions.length} Problem${todayRevisions.length === 1 ? '' : 's'}` : 'Add a Problem'}
            </h2>
            <p className="text-secondary" style={{ marginBottom: '1.75rem', fontSize: '0.875rem' }}>
              {todayRevisions.length > 0
                ? `Estimated time: ~${todayRevisions.length * 12} min`
                : 'Start tracking your progress by adding your first solved problem.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {todayRevisions.length > 0 ? todayRevisions.slice(0, 3).map((rev) => (
                <motion.div
                  key={rev.id}
                  whileHover={{ x: 3 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                    padding: '0.625rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--color-border-subtle)',
                    fontSize: '0.875rem',
                  }}
                >
                  <Clock size={15} color="var(--color-text-muted)" />
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    {rev.solved_problem?.problem?.title ?? 'Problem'}
                  </span>
                  <span className={`badge badge-${rev.solved_problem?.problem?.difficulty === 'Easy' ? 'green' : rev.solved_problem?.problem?.difficulty === 'Hard' ? 'red' : 'yellow'}`} style={{ marginLeft: 'auto' }}>
                    {rev.solved_problem?.problem?.difficulty}
                  </span>
                </motion.div>
              )) : (
                <motion.div
                  whileHover={{ x: 3 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                    padding: '0.625rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px dashed var(--color-border-subtle)',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <CheckCircle2 size={15} />
                  <span>No revisions due today — you're all caught up!</span>
                </motion.div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.625rem', marginTop: '2rem' }}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/revision" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                <Play size={14} fill="currentColor" /> Start Session
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/library" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                Browse Problems
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Interview Readiness */}
        <motion.div
          variants={item}
          whileHover={{ y: -3 }}
          className="bento-card col-span-1 row-span-2"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}
        >
          <AccentBar color="var(--color-readiness)" />
          <div>
            <div className="card-header" style={{ marginBottom: '1.5rem' }}>
              <TrendingUp size={16} color="var(--color-readiness)" />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-readiness)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Readiness
              </span>
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1 }}>
              <Counter to={readiness} duration={1.4} delay={0.4} suffix="%" />
            </div>
            <p className="text-secondary" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
              {stats.total_solved > 0
                ? `Based on ${stats.total_solved} solved problems`
                : 'Solve problems to track readiness'}
            </p>
          </div>

          <div>
            <div className="progress-track">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${readiness}%` }}
                transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ background: `linear-gradient(to right, var(--color-readiness), var(--color-primary))` }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <span className="text-muted text-xs">Current</span>
              <span className="text-muted text-xs">Goal: 90%</span>
            </div>
          </div>
        </motion.div>

        {/* Streak */}
        <motion.div
          variants={item}
          whileHover={{ scale: 1.02 }}
          className="bento-card col-span-1"
          style={{ position: 'relative' }}
        >
          <AccentBar color="var(--color-xp)" />
          <div className="card-header" style={{ marginBottom: '1rem' }}>
            <Flame size={16} color="var(--color-xp)" />
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-xp)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Streak
            </span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1 }}>
            <Counter to={stats.current_streak ?? 0} delay={0.5} />
          </div>
          <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>days</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.75rem' }}>
            <p className="text-secondary" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Today's Status: 
              {stats.last_activity_date === new Date().toLocaleDateString('en-CA') 
                ? <span style={{ color: 'var(--color-primary)' }}>✅ Completed</span> 
                : <span style={{ color: 'var(--color-text-muted)' }}>❌ Pending</span>}
            </p>
            {stats.longest_streak > 0 && (
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                Best: {stats.longest_streak} days
              </p>
            )}
          </div>
        </motion.div>

        {/* Recent Achievements / Daily Quest */}
        <motion.div
          variants={item}
          whileHover={{ scale: 1.02 }}
          className="bento-card col-span-1"
          style={{ position: 'relative' }}
        >
          <AccentBar color="var(--color-achievement)" />
          <div className="card-header" style={{ marginBottom: '1rem' }}>
            <Award size={16} color="var(--color-achievement)" />
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-achievement)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Achievements
            </span>
          </div>
          {recentAchievements.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentAchievements.slice(0, 2).map((ua) => (
                <div key={ua.achievement?.title} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>{ua.achievement?.badge_icon}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{ua.achievement?.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Complete challenges to earn your first achievement!
            </p>
          )}
        </motion.div>

        {/* XP Card */}
        <motion.div
          variants={item}
          whileHover={{ y: -3 }}
          className="bento-card col-span-2"
          style={{ position: 'relative' }}
        >
          <AccentBar color="var(--color-xp)" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="card-header" style={{ marginBottom: '0.875rem' }}>
                <Zap size={16} color="var(--color-xp)" />
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-xp)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  XP & Level
                </span>
              </div>
              <div style={{ display: 'flex', align: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.04em' }}>
                  <Counter to={stats.xp ?? 0} delay={0.5} suffix=" XP" />
                </span>
              </div>
              <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                Level {stats.level ?? 1} · {xpToNextLevel} XP to Level {(stats.level ?? 1) + 1}
              </p>
            </div>
            <div style={{
              padding: '0.5rem 0.875rem',
              background: 'rgba(249,115,22,0.12)',
              border: '1px solid rgba(249,115,22,0.2)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-xp)', letterSpacing: '-0.03em' }}>{stats.level ?? 1}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-xp)', fontWeight: 600, letterSpacing: '0.04em' }}>LEVEL</div>
            </div>
          </div>
          <div className="progress-track" style={{ marginTop: '1rem' }}>
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: `linear-gradient(to right, var(--color-xp), var(--color-revision))` }}
            />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          variants={item}
          whileHover={{ y: -3 }}
          className="bento-card col-span-2"
          style={{ position: 'relative' }}
        >
          <AccentBar color="var(--color-analytics)" />
          <div className="card-header" style={{ marginBottom: '1.25rem' }}>
            <Activity size={16} color="var(--color-analytics)" />
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-analytics)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Recent
            </span>
          </div>
          {data?.unreadNotifications?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.unreadNotifications.slice(0, 3).map((notif) => (
                <div key={notif.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{notif.title}</span>
                  </div>
                  <span className="text-muted text-xs">{new Date(notif.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              No new notifications. Keep solving! 🚀
            </p>
          )}
          <Link to="/analytics" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
            View analytics <ArrowRight size={13} />
          </Link>
        </motion.div>

      </motion.div>
      <InitializationWidget tasks={initTasks} />
    </div>
  );
}

function InitializationWidget({ tasks }) {
  if (!tasks) return null;
  
  const allDone = Object.values(tasks).every(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="init-widget glass-panel"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '320px',
        padding: '1.5rem',
        borderRadius: '16px',
        zIndex: 100,
        background: 'rgba(10,10,10,0.85)',
        border: '1px solid rgba(255,160,0,0.2)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <motion.div
          animate={allDone ? {} : { rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        >
          {allDone ? <CheckCircle2 size={24} color="var(--color-brand)" /> : <Zap size={24} color="var(--color-brand)" />}
        </motion.div>
        <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>
          {allDone ? 'Workspace Ready' : 'Preparing Workspace...'}
        </h4>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <InitTask label="Profile Created" done={true} />
        <InitTask label="Roadmap Generated" done={tasks.roadmap} />
        <InitTask label="Initializing Analytics" done={tasks.analytics} />
        <InitTask label="Daily Missions" done={tasks.missions} />
        <InitTask label="Achievements" done={tasks.achievements} />
      </div>
    </motion.div>
  );
}

function InitTask({ label, done }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: done ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.4)' }}>
      {done ? <CheckCircle2 size={16} color="var(--color-brand)" /> : <Clock size={16} />}
      <span style={{ fontSize: '0.9rem' }}>{label}</span>
    </div>
  );
}
