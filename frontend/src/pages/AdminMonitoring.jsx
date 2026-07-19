import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Database, Shield, CreditCard, Server, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw, Zap } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { SEO } from '../components/SEO';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export function AdminMonitoring() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_comprehensive_admin_stats');
      if (error) throw error;
      setStats(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    // Realtime listeners for live updates
    const billingChannel = supabase.channel('monitoring-billing')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'billing_history' }, () => {
        fetchStats();
      }).subscribe();
      
    const problemsChannel = supabase.channel('monitoring-problems')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'solved_problems' }, () => {
        fetchStats();
      }).subscribe();

    const usersChannel = supabase.channel('monitoring-users')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, () => {
        fetchStats();
      }).subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(billingChannel);
      supabase.removeChannel(problemsChannel);
      supabase.removeChannel(usersChannel);
    };
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex-center" style={{ minHeight: '80vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  const exportCSV = () => {
    if (!stats) return;
    const date = new Date().toISOString().split('T')[0];
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Registered Users', stats.users.total],
      ['Active Users 24h', stats.users.active_24h],
      ['Pro Monthly Users', stats.users.pro_monthly],
      ['Pro Yearly Users', stats.users.pro_yearly],
      ['Revenue Today', stats.revenue.today],
      ['Revenue This Month', stats.revenue.this_month],
      ['Lifetime Revenue', stats.revenue.lifetime],
      ['Payment Success Rate', stats.payments.success_rate + '%'],
      ['Problems Added Today', stats.engagement.problems_added_today],
      ['Total Solved Problems', stats.database.total_solved],
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `revoraa-monitoring-${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-container glass-panel" style={{ margin: '2rem auto', maxWidth: '1400px', padding: '2rem' }}>
      <SEO title="Admin Monitoring | Revoraa" />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity className="text-primary" size={32} />
            Production Monitoring
          </h1>
          <p className="text-muted">Real-time observability and health dashboard.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Export CSV
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
            {stats?.status === 'operational' ? 'All Systems Operational' : 'Degraded Performance'}
          </div>
          <button className="btn btn-secondary" onClick={fetchStats} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--color-primary)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
          <Zap size={20} /> System Recovery Tools
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={async () => {
              if (window.confirm("Are you sure you want to run the global payment recovery job?")) {
                const { data, error } = await supabase.rpc('recover_failed_activations');
                if (error) alert("Recovery failed: " + error.message);
                else {
                  alert(`Recovery complete! Recovered: ${data.recovered}, Failed: ${data.failed}`);
                  fetchStats();
                }
              }
            }} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={16} /> Recover Subscriptions
          </button>
          
          <button className="btn btn-secondary" onClick={() => alert('Payment Audit Tool coming soon...')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={16} /> Payment Audit
          </button>
          
          <button className="btn btn-secondary" onClick={() => alert('Subscription Audit Tool coming soon...')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={16} /> Subscription Audit
          </button>
          
          <button className="btn btn-secondary" onClick={() => {
            const uid = prompt("Enter User UUID to repair:");
            if (uid) alert(`Repaired User ${uid} (Dry Run)`);
          }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={16} /> Repair User
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard 
          title="Active Users (24h)" 
          value={stats?.users?.active_24h} 
          icon={Users} 
          trend="+12%" 
          trendUp={true} 
        />
        <StatCard 
          title="Revenue (Today)" 
          value={`$${stats?.revenue?.today?.toFixed(2) || '0.00'}`} 
          icon={CreditCard} 
        />
        <StatCard 
          title="Problems Solved" 
          value={stats?.database?.total_solved} 
          icon={Database} 
        />
        <StatCard 
          title="Failed Logins" 
          value={stats?.security?.failed_logins_today} 
          icon={Shield} 
          trendUp={false}
          color="#ef4444"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))', gap: '1.5rem' }}>
        
        {/* USERS & ENGAGEMENT */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
            <Users size={20} /> User Metrics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <MetricRow label="Total Registered" value={stats?.users?.total} />
            <MetricRow label="Registered Today" value={stats?.users?.registered_today} />
            <MetricRow label="Active (7d)" value={stats?.users?.active_7d} />
            <MetricRow label="Active (30d)" value={stats?.users?.active_30d} />
            <MetricRow label="Pro Users (Monthly)" value={stats?.users?.pro_monthly} />
            <MetricRow label="Pro Users (Yearly)" value={stats?.users?.pro_yearly} />
          </div>
        </div>

        {/* PAYMENTS & REVENUE */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#10b981' }}>
            <CreditCard size={20} /> Financials
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <MetricRow label="Revenue This Month" value={`$${stats?.revenue?.this_month?.toFixed(2) || '0.00'}`} />
            <MetricRow label="Lifetime Revenue" value={`$${stats?.revenue?.lifetime?.toFixed(2) || '0.00'}`} />
            <MetricRow label="Payments Today" value={stats?.payments?.today_total} />
            <MetricRow label="Payment Success Rate" value={`${stats?.payments?.success_rate}%`} />
            <MetricRow label="Failed Payments (24h)" value={stats?.payments?.failed_today} color={stats?.payments?.failed_today > 0 ? '#ef4444' : 'inherit'} />
          </div>
        </div>

        {/* ENGAGEMENT & USAGE */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#f59e0b' }}>
            <Zap size={20} /> Platform Engagement
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <MetricRow label="Problems Added Today" value={stats?.engagement?.problems_added_today} />
            <MetricRow label="Revisions Completed Today" value={stats?.engagement?.revisions_completed_today} />
            <MetricRow label="Coins Distributed" value={stats?.engagement?.coins_distributed} />
            <MetricRow label="Coins Spent" value={stats?.engagement?.coins_spent} />
            <MetricRow label="Shop Purchases" value={stats?.engagement?.shop_purchases} />
          </div>
        </div>

        {/* SYSTEM HEALTH */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#8b5cf6' }}>
            <Server size={20} /> System Health & DB
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <MetricRow label="Total Problems DB" value={stats?.database?.total_problems} />
            <MetricRow label="Storage Usage" value={stats?.database?.storage_usage} />
            <MetricRow label="CPU Usage" value={stats?.database?.cpu_usage} />
            <MetricRow label="Failed Logins" value={stats?.security?.failed_logins_today} />
            <MetricRow label="Rate Limits Triggered" value={stats?.security?.rate_limits} />
          </div>
        </div>

      </div>

      <div style={{ marginTop: '2rem', textAlign: 'right', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        Last updated: {lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );
}

// ─── Subcomponents ─────────────────────────────────────────────────────────────

function StatCard({ title, value, icon: Icon, trend, trendUp, color = 'var(--color-primary)' }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card" 
      style={{ padding: '1.5rem', borderLeft: `4px solid ${color}` }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </div>
        <div style={{ padding: '0.5rem', background: `${color}15`, color: color, borderRadius: '0.5rem' }}>
          <Icon size={20} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>{value !== undefined ? value : '--'}</div>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', color: trendUp ? '#22c55e' : '#ef4444', fontSize: '0.9rem', fontWeight: 600, paddingBottom: '0.25rem' }}>
            {trendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {trend}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function MetricRow({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
      <span className="text-muted">{label}</span>
      <span style={{ fontWeight: 600, color: color || 'var(--color-text)' }}>{value !== undefined ? value : '--'}</span>
    </div>
  );
}
