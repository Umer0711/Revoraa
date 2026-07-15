import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, BarChart2, Target, Loader2, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAnalyticsData, getActivityHistory } from '../lib/dataService';
import { ActivityCalendar } from '../components/ui/ActivityCalendar';

const DIFF_COLORS = { Easy: 'var(--color-strong)', Medium: 'var(--color-revision)', Hard: 'var(--color-weak)' };
const PLATFORM_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="liquid-glass" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
      <p className="text-secondary text-sm" style={{ marginBottom: '0.375rem' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, fontWeight: 600, fontSize: '0.875rem' }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item      = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 22 } } };

const AccentBar = ({ color }) => (
  <div style={{ position: 'absolute', top: 0, left: '1.5rem', right: '1.5rem', height: '1px', background: `linear-gradient(to right, transparent, ${color}, transparent)`, opacity: 0.55 }} />
);

const StatCard = ({ label, value, sub, color }) => (
  <motion.div variants={item} whileHover={{ y: -3 }} className="bento-card col-span-1" style={{ position: 'relative' }}>
    <AccentBar color={color} />
    <p className="text-muted text-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.625rem' }}>{label}</p>
    <div style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.04em', color }}>{value}</div>
    {sub && <p className="text-muted text-xs" style={{ marginTop: '0.25rem' }}>{sub}</p>}
  </motion.div>
);

export function Analytics() {
  const { user } = useAuth();
  const [data, setData]     = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [result, hist] = await Promise.all([
        getAnalyticsData(user.id),
        getActivityHistory(user.id, 365)
      ]);
      setData(result);
      setHistory(hist);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Build radar data from pattern counts
  const radarData = useMemo(() => {
    const topPatterns = data?.topPatterns ?? [];
    if (topPatterns.length === 0) return [];
    const max = topPatterns[0]?.count ?? 1;
    return topPatterns.slice(0, 8).map(p => ({
      subject: p.category?.length > 10 ? p.category.slice(0, 10) + '…' : (p.category || 'Unknown'),
      A: Math.round((p.count / max) * 100),
    }));
  }, [data]);

  // Diff distribution for pie
  const pieData = useMemo(() => {
    const d = data?.diffDistribution ?? {};
    return Object.entries(d).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));
  }, [data]);
  
  // Platform distribution for pie
  const platformData = useMemo(() => {
    const d = data?.advanced?.platform_distribution ?? {};
    return Object.entries(d).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));
  }, [data]);

  // Week activity chart
  const weekData = useMemo(() => {
    const daily = data?.daily ?? [];
    const last7 = daily.slice(-7);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return last7.map((d, i) => ({
      name: days[i] ?? d.date.slice(-2),
      solved: d.solved,
      revised: d.revised,
    }));
  }, [data]);

  const stats = data?.stats ?? {};
  const advanced = data?.advanced ?? {};
  const totalSessions = new Set(history.map(h => h.activity_date)).size;

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} />
        <p className="text-secondary">Crunching your data…</p>
      </div>
    );
  }

  if (error) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Failed to load analytics: {error}</div>;
  }

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <header className="page-header">
        <h1>Analytics</h1>
        <p className="text-secondary">Deep insights into your practice patterns and retention.</p>
      </header>

      <motion.div className="bento-grid" variants={container} initial="hidden" animate="show">

        {/* Stats Row */}
        <StatCard label="Total Solved"   value={stats.total_solved ?? 0}   sub="All time"              color="var(--color-analytics)" />
        <StatCard label="Total Revised"  value={stats.total_revised ?? 0}  sub="Revisions completed"   color="var(--color-strong)" />
        <StatCard label="Current Streak" value={`${stats.current_streak ?? 0}d`} sub={`Best: ${stats.longest_streak ?? 0}d`} color="var(--color-xp)" />
        <StatCard label="Avg Confidence" value={`${data?.avgConfidence ?? '—'}/5`} sub="Self-rated"     color="var(--color-mission)" />
        
        {/* Advanced Stats Row */}
        <StatCard label="Avg Solve Time" value={advanced.average_solve_time ? `${advanced.average_solve_time}m` : '—'} sub="Initial attempt" color="var(--color-revision)" />
        <StatCard label="Avg Revision Time" value={advanced.average_revision_time ? `${advanced.average_revision_time}m` : '—'} sub="Revision attempt" color="var(--color-analytics)" />
        <StatCard label="Fastest Solve" value={advanced.fastest_solve ? `${advanced.fastest_solve}m` : '—'} sub="All time record" color="var(--color-strong)" />
        <StatCard label="Revision Success" value={advanced.revision_success_rate ? `${advanced.revision_success_rate}%` : '—'} sub="Retention rate" color="var(--color-readiness)" />

        {/* Activity Heatmap */}
        <motion.div variants={item} whileHover={{ y: -3 }} className="bento-card col-span-4" style={{ position: 'relative' }}>
          <AccentBar color="var(--color-analytics)" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div className="card-header">
              <Activity size={16} color="var(--color-analytics)" />
              <h3 style={{ marginBottom: 0 }}>Activity Heatmap</h3>
            </div>
            <span className="text-muted text-sm">{totalSessions} active days this year</span>
          </div>
          <ActivityCalendar history={history} days={365} />
        </motion.div>

        {/* Topic Mastery Radar */}
        <motion.div variants={item} whileHover={{ y: -3 }} className="bento-card col-span-2" style={{ height: 380, position: 'relative' }}>
          <AccentBar color="var(--color-level)" />
          <div className="card-header" style={{ marginBottom: '1rem' }}>
            <Target size={16} color="var(--color-level)" />
            <h3 style={{ marginBottom: 0 }}>Topic Distribution</h3>
          </div>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height="88%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
                <PolarGrid stroke="var(--color-border-subtle)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar name="Problems" dataKey="A" stroke="var(--color-level)" fill="var(--color-level)" fillOpacity={0.18} isAnimationActive animationDuration={1200} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Solve problems to see your topic distribution
            </div>
          )}
        </motion.div>

        {/* Difficulty Breakdown */}
        <motion.div variants={item} whileHover={{ y: -3 }} className="bento-card col-span-1" style={{ height: 380, position: 'relative' }}>
          <AccentBar color="var(--color-mission)" />
          <div className="card-header" style={{ marginBottom: '1rem' }}>
            <TrendingUp size={16} color="var(--color-mission)" />
            <h3 style={{ marginBottom: 0 }}>Difficulty Breakdown</h3>
          </div>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height="55%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={60} innerRadius={35} dataKey="value" isAnimationActive animationDuration={1200}>
                    {pieData.map(entry => (
                      <Cell key={entry.name} fill={DIFF_COLORS[entry.name] ?? 'var(--color-primary)'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, name) => [v, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', padding: '0 1rem' }}>
                {pieData.map(d => (
                  <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: DIFF_COLORS[d.name] }} />
                      <span className="text-secondary text-sm">{d.name}</span>
                    </div>
                    <span className="text-muted text-sm font-semibold">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              No data yet
            </div>
          )}
        </motion.div>

        {/* Platform Distribution */}
        <motion.div variants={item} whileHover={{ y: -3 }} className="bento-card col-span-1" style={{ height: 380, position: 'relative' }}>
          <AccentBar color="var(--color-primary)" />
          <div className="card-header" style={{ marginBottom: '1rem' }}>
            <CheckCircle2 size={16} color="var(--color-primary)" />
            <h3 style={{ marginBottom: 0 }}>Platform Distribution</h3>
          </div>
          {platformData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height="55%">
                <PieChart>
                  <Pie data={platformData} cx="50%" cy="50%" outerRadius={60} innerRadius={35} dataKey="value" isAnimationActive animationDuration={1200}>
                    {platformData.map((entry, index) => (
                      <Cell key={entry.name} fill={PLATFORM_COLORS[index % PLATFORM_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, name) => [v, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', padding: '0 1rem' }}>
                {platformData.map((d, index) => (
                  <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: PLATFORM_COLORS[index % PLATFORM_COLORS.length] }} />
                      <span className="text-secondary text-sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100 }}>{d.name}</span>
                    </div>
                    <span className="text-muted text-sm font-semibold">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              No data yet
            </div>
          )}
        </motion.div>

        {/* Daily Activity (last 7 days) */}
        <motion.div variants={item} whileHover={{ y: -3 }} className="bento-card col-span-4" style={{ height: 280, position: 'relative' }}>
          <AccentBar color="var(--color-revision)" />
          <div className="card-header" style={{ marginBottom: '1rem' }}>
            <BarChart2 size={16} color="var(--color-revision)" />
            <h3 style={{ marginBottom: 0 }}>Last 7 Days Activity</h3>
          </div>
          {weekData.length > 0 ? (
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={weekData} margin={{ top: 0, right: 16, left: -24, bottom: 0 }} barSize={14} barGap={2} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="solved"  name="Solved"  fill="var(--color-strong)"   radius={[4,4,0,0]} isAnimationActive animationDuration={1000} />
                <Bar dataKey="revised" name="Revised" fill="var(--color-revision)" radius={[4,4,0,0]} isAnimationActive animationDuration={1100} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              No activity data yet. Start solving!
            </div>
          )}
        </motion.div>

      </motion.div>
    </div>
  );
}
