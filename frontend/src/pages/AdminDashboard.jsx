import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Ticket, CreditCard, Search, Shield, Ban, Activity, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { SEO } from '../components/SEO';


const tabs = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'coupons', label: 'Coupons', icon: Ticket },
  { id: 'billing', label: 'Billing Logs', icon: CreditCard },
  { id: 'audit', label: 'Audit Logs', icon: Shield },
  { id: 'bugs', label: 'Bug Reports', icon: AlertTriangle },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  
  const [users, setUsers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [billing, setBilling] = useState([]);
  const [overviewStats, setOverviewStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [bugReports, setBugReports] = useState([]);

  // Search/Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modals/Forms
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount_amount: 0, discount_percentage: 0, max_uses: 100 });
  const [retryingPaymentId, setRetryingPaymentId] = useState(null);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      if (tab === 'overview') {
        const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
        if (!error) setOverviewStats(data);
        else console.error('Overview stats error:', error);

      } else if (tab === 'users') {
        // Fetch profiles and subscriptions separately — subscriptions.user_id → auth.users (not profiles)
        const [profilesRes, subsRes] = await Promise.all([
          supabase.from('profiles').select('*').order('created_at', { ascending: false }),
          supabase.from('subscriptions').select('user_id, status, expires_at, plan_id'),
        ]);
        const profiles = profilesRes.data || [];
        const subs = subsRes.data || [];
        // Merge: attach subscriptions array to each profile by auth_id
        const merged = profiles.map(p => ({
          ...p,
          subscriptions: subs.filter(s => s.user_id === p.auth_id),
        }));
        setUsers(merged);

      } else if (tab === 'coupons') {
        const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
        setCoupons(data || []);

      } else if (tab === 'billing') {
        // billing_history.user_id → auth.users (no direct FK to profiles table)
        // Fetch billing + profiles separately, merge on user_id = auth_id
        const [billRes, profilesRes] = await Promise.all([
          supabase.from('billing_history').select('*').order('created_at', { ascending: false }).limit(50),
          supabase.from('profiles').select('auth_id, full_name, email'),
        ]);
        const bills = billRes.data || [];
        const profileMap = Object.fromEntries((profilesRes.data || []).map(p => [p.auth_id, p]));
        setBilling(bills.map(b => ({ ...b, profiles: profileMap[b.user_id] || null })));

      } else if (tab === 'audit') {
        // audit_logs — tables may not exist yet if migration 020 hasn't been applied
        // Fetch simply without FK joins; display user IDs as fallback
        const { data, error } = await supabase
          .from('audit_logs')
          .select('id, action, admin_id, affected_user_id, details, ip_address, device_info, created_at')
          .order('created_at', { ascending: false })
          .limit(50);
        if (!error) {
          // Enrich with profile names if we can
          const allIds = [...new Set([
            ...(data || []).map(l => l.admin_id).filter(Boolean),
            ...(data || []).map(l => l.affected_user_id).filter(Boolean),
          ])];
          let profileMap = {};
          if (allIds.length > 0) {
            const { data: profs } = await supabase.from('profiles').select('auth_id, full_name, email').in('auth_id', allIds);
            profileMap = Object.fromEntries((profs || []).map(p => [p.auth_id, p]));
          }
          setAuditLogs((data || []).map(log => ({
            ...log,
            admin: profileMap[log.admin_id] || null,
            affected_user: profileMap[log.affected_user_id] || null,
          })));
        } else {
          // Table doesn't exist yet — show empty state gracefully
          console.warn('audit_logs table not ready:', error.message);
          setAuditLogs([]);
        }

      } else if (tab === 'bugs') {
        // bug_reports.user_id → auth.users (no direct FK to profiles)
        const [bugRes, profilesRes] = await Promise.all([
          supabase.from('bug_reports').select('*').order('created_at', { ascending: false }),
          supabase.from('profiles').select('auth_id, full_name, email'),
        ]);
        const bugs = bugRes.data || [];
        const profileMap = Object.fromEntries((profilesRes.data || []).map(p => [p.auth_id, p]));
        setBugReports(bugs.map(b => ({ ...b, profiles: profileMap[b.user_id] || null })));
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (authId, isBanned) => {
    if (!window.confirm(`Are you sure you want to ${isBanned ? 'unban' : 'ban'} this user?`)) return;
    
    // In a real app, banning would ideally happen via an edge function or by setting a banned flag on the profile.
    // For now, we'll assume we add an is_banned column to profiles if we needed it, or we suspend them via edge function.
    alert('User banning functionality requires a backend edge function to suspend the auth.users account.');
  };

  const handleExtendSubscription = async (userId) => {
    const days = prompt('How many days to extend the subscription?');
    if (!days || isNaN(Number(days))) return;
    
    try {
      const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', userId).eq('status', 'active').maybeSingle();
      if (!sub) return alert('No active subscription found.');
      
      const newDate = new Date(sub.expires_at || Date.now());
      newDate.setDate(newDate.getDate() + Number(days));
      
      const { error } = await supabase.from('subscriptions').update({ expires_at: newDate.toISOString() }).eq('id', sub.id);
      if (error) throw error;
      
      alert('Subscription extended successfully.');
      fetchData('users');
    } catch (err) {
      alert('Error extending: ' + err.message);
    }
  };

  const handleRetryActivation = async (paymentId) => {
    if (!window.confirm('Are you sure you want to retry this payment activation?')) return;
    try {
      setRetryingPaymentId(paymentId);
      const { data, error } = await supabase.rpc('retry_subscription_activation', {
        p_payment_id: paymentId
      });
      if (error) throw error;
      if (data?.success) {
        alert('Activation successful!');
        fetchData('billing');
      } else {
        alert('Failed: ' + (data?.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error retrying activation: ' + err.message);
    } finally {
      setRetryingPaymentId(null);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        code: newCoupon.code.toUpperCase(),
        max_uses: newCoupon.max_uses,
      };
      if (newCoupon.discount_amount > 0) payload.discount_amount = newCoupon.discount_amount;
      else if (newCoupon.discount_percentage > 0) payload.discount_percentage = newCoupon.discount_percentage;
      
      const { error } = await supabase.from('coupons').insert(payload);
      if (error) throw error;
      
      setShowCouponForm(false);
      setNewCoupon({ code: '', discount_amount: 0, discount_percentage: 0, max_uses: 100 });
      fetchData('coupons');
    } catch (err) {
      alert('Error creating coupon: ' + err.message);
    }
  };

  const handleToggleCoupon = async (id, currentStatus) => {
    await supabase.from('coupons').update({ is_active: !currentStatus }).eq('id', id);
    fetchData('coupons');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <SEO title="Admin Dashboard" url="https://revoraa.com/admin" />
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2rem', margin: 0 }}>
            <Shield color="var(--color-primary)" /> Admin Console
          </h1>
          <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Manage users, billing, and platform configurations.</p>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '1rem 1.5rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'none', border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s'
            }}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ background: 'var(--color-bg-elevated)', borderRadius: '1rem', border: '1px solid var(--color-border)', padding: '1.5rem', minHeight: '500px' }}>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '4rem' }}>
            <Loader2 className="spin" size={32} color="var(--color-primary)" />
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Platform Overview</h2>
                {overviewStats ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="bento-card" style={{ padding: '1.5rem' }}>
                      <p className="text-muted text-sm mb-1">Total Users</p>
                      <h3 style={{ fontSize: '2rem', margin: 0 }}>{overviewStats.users?.total || 0}</h3>
                      <p className="text-xs text-secondary mt-2">+{overviewStats.users?.new_7d || 0} this week</p>
                    </div>
                    <div className="bento-card" style={{ padding: '1.5rem' }}>
                      <p className="text-muted text-sm mb-1">Active Subscriptions</p>
                      <h3 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-primary)' }}>{overviewStats.subscriptions?.active || 0}</h3>
                      <p className="text-xs text-secondary mt-2">Total {overviewStats.subscriptions?.total || 0}</p>
                    </div>
                    <div className="bento-card" style={{ padding: '1.5rem' }}>
                      <p className="text-muted text-sm mb-1">Total Revenue</p>
                      <h3 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-correct)' }}>₹{overviewStats.revenue?.total || 0}</h3>
                    </div>
                    <div className="bento-card" style={{ padding: '1.5rem' }}>
                      <p className="text-muted text-sm mb-1">Problems Solved</p>
                      <h3 style={{ fontSize: '2rem', margin: 0 }}>{overviewStats.engagement?.total_problems_solved || 0}</h3>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted" style={{ padding: '2rem', textAlign: 'center', border: '1px dashed var(--color-border)', borderRadius: '0.5rem' }}>
                    <AlertTriangle size={24} style={{ margin: '0 auto 0.5rem auto', color: 'var(--color-text-muted)' }} />
                    <p>Stats not available. The database migration for the admin dashboard might not be applied.</p>
                  </div>
                )}
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--color-text-muted)' }} />
                    <input type="text" placeholder="Search users by name or email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.5rem', background: 'var(--color-bg-base)', border: '1px solid var(--color-border-subtle)', borderRadius: '0.5rem', color: '#fff', outline: 'none' }} />
                  </div>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border-subtle)', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        <th style={{ padding: '1rem 0.5rem' }}>User</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Plan</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Joined</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.filter(u => u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase())).map(user => {
                        const activeSub = user.subscriptions?.find(s => s.status === 'active');
                        return (
                          <tr key={user.auth_id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                            <td style={{ padding: '1rem 0.5rem' }}>
                              <div style={{ fontWeight: 600 }}>{user.full_name || 'No Name'}</div>
                              <div className="text-muted text-xs">{user.email || user.username}</div>
                            </td>
                            <td style={{ padding: '1rem 0.5rem' }}>
                              {activeSub ? (
                                <span style={{ padding: '0.25rem 0.5rem', background: 'rgba(255,171,0,0.1)', color: 'var(--color-primary)', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>PRO</span>
                              ) : (
                                <span style={{ padding: '0.25rem 0.5rem', background: 'var(--color-bg-light)', borderRadius: '1rem', fontSize: '0.75rem' }}>FREE</span>
                              )}
                            </td>
                            <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '1rem 0.5rem' }}>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleExtendSubscription(user.auth_id)} style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border-subtle)', padding: '0.3rem 0.6rem', borderRadius: '0.25rem', color: '#fff', cursor: 'pointer', fontSize: '0.75rem' }}>Extend</button>
                                <button onClick={() => handleBanUser(user.auth_id, false)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '0.3rem 0.6rem', borderRadius: '0.25rem', color: 'var(--color-mistakes)', cursor: 'pointer', fontSize: '0.75rem' }}><Ban size={12} style={{ display: 'inline', marginRight: '4px' }}/> Ban</button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* COUPONS TAB */}
            {activeTab === 'coupons' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Discount Coupons</h2>
                  <button onClick={() => setShowCouponForm(!showCouponForm)} className="btn btn-primary">+ Create Coupon</button>
                </div>

                {showCouponForm && (
                  <form onSubmit={handleCreateCoupon} style={{ background: 'var(--color-bg-base)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem', border: '1px solid var(--color-border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Coupon Code</label>
                      <input type="text" required value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', color: '#fff' }} placeholder="e.g. SUMMER50" />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Max Uses</label>
                      <input type="number" required value={newCoupon.max_uses} onChange={e => setNewCoupon({...newCoupon, max_uses: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', color: '#fff' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Discount Amount (Fixed)</label>
                      <input type="number" value={newCoupon.discount_amount} onChange={e => setNewCoupon({...newCoupon, discount_amount: e.target.value, discount_percentage: 0})} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', color: '#fff' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Discount Percentage (%)</label>
                      <input type="number" value={newCoupon.discount_percentage} onChange={e => setNewCoupon({...newCoupon, discount_percentage: e.target.value, discount_amount: 0})} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', color: '#fff' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                      <button type="button" onClick={() => setShowCouponForm(false)} className="btn btn-secondary">Cancel</button>
                      <button type="submit" className="btn btn-primary">Save Coupon</button>
                    </div>
                  </form>
                )}

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border-subtle)', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        <th style={{ padding: '1rem 0.5rem' }}>Code</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Discount</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Usage</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>{c.code}</td>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            {c.discount_amount ? `₹${c.discount_amount} OFF` : `${c.discount_percentage}% OFF`}
                          </td>
                          <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                            {c.used_count} / {c.max_uses || '∞'}
                          </td>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            <span style={{ padding: '0.25rem 0.5rem', background: c.is_active ? 'rgba(16,185,129,0.1)' : 'var(--color-bg-light)', color: c.is_active ? 'var(--color-success)' : 'var(--color-text-muted)', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
                              {c.is_active ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            <button onClick={() => handleToggleCoupon(c.id, c.is_active)} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                              {c.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* BILLING LOGS TAB */}
            {activeTab === 'billing' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', margin: 0 }}>Recent Payments</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border-subtle)', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        <th style={{ padding: '1rem 0.5rem' }}>Date</th>
                        <th style={{ padding: '1rem 0.5rem' }}>User</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Amount</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Payment / Order ID</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billing.map(b => (
                        <tr key={b.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                            {new Date(b.created_at).toLocaleString()}
                          </td>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            <div style={{ fontWeight: 500 }}>{b.profiles?.full_name || 'User'}</div>
                            <div className="text-muted text-xs">{b.profiles?.email}</div>
                          </td>
                          <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>
                            {b.amount} {b.currency}
                          </td>
                          <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                            <div style={{ fontWeight: 600 }}>P: {b.razorpay_payment_id || 'N/A'}</div>
                            <div>O: {b.razorpay_order_id}</div>
                          </td>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            <span style={{ padding: '0.25rem 0.5rem', background: b.status === 'success' ? 'rgba(16,185,129,0.1)' : (b.status === 'failed' || b.status === 'failed_activation') ? 'rgba(239,68,68,0.1)' : 'var(--color-bg-light)', color: b.status === 'success' ? 'var(--color-success)' : (b.status === 'failed' || b.status === 'failed_activation') ? 'var(--color-mistakes)' : 'var(--color-text-muted)', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                              {b.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            {b.status === 'failed_activation' && (
                              <button 
                                onClick={() => handleRetryActivation(b.razorpay_payment_id)}
                                disabled={retryingPaymentId === b.razorpay_payment_id}
                                className="btn btn-primary" 
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                              >
                                {retryingPaymentId === b.razorpay_payment_id ? 'Retrying...' : 'Retry'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* AUDIT LOGS TAB */}
            {activeTab === 'audit' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', margin: 0 }}>Security Audit Logs</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border-subtle)', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        <th style={{ padding: '1rem 0.5rem' }}>Time</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Admin</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Action</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Affected User</th>
                        <th style={{ padding: '1rem 0.5rem' }}>IP / Device</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map(log => (
                        <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                          <td style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>
                            {log.admin?.full_name || log.admin_id}
                          </td>
                          <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem', color: 'var(--color-primary)' }}>
                            {log.action}
                          </td>
                          <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem' }}>
                            {log.affected_user?.email || log.affected_user_id || '—'}
                          </td>
                          <td style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                            <div>{log.ip_address || '—'}</div>
                            <div className="text-muted">{log.device_info || ''}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {auditLogs.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No audit logs found.</div>
                  )}
                </div>
              </div>
            )}

            {/* BUG REPORTS TAB */}
            {activeTab === 'bugs' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', margin: 0 }}>System Bug Reports</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border-subtle)', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        <th style={{ padding: '1rem 0.5rem' }}>Reported By</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Issue</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Status / Priority</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Endpoint</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bugReports.map(bug => (
                        <tr key={bug.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            <div style={{ fontWeight: 500 }}>{bug.profiles?.full_name || 'User'}</div>
                            <div className="text-muted text-xs">{new Date(bug.created_at).toLocaleString()}</div>
                          </td>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            <div style={{ fontWeight: 600 }}>{bug.title}</div>
                            <div className="text-muted text-xs" style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bug.description}</div>
                          </td>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            <span style={{ padding: '0.2rem 0.4rem', borderRadius: '0.25rem', fontSize: '0.75rem', background: bug.status === 'resolved' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: bug.status === 'resolved' ? 'var(--color-success)' : 'var(--color-primary)', marginRight: '0.5rem' }}>
                              {bug.status}
                            </span>
                            <span style={{ padding: '0.2rem 0.4rem', borderRadius: '0.25rem', fontSize: '0.75rem', background: bug.priority === 'critical' ? 'rgba(239,68,68,0.1)' : 'var(--color-bg-light)', color: bug.priority === 'critical' ? 'var(--color-mistakes)' : 'inherit' }}>
                              {bug.priority}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                            {bug.endpoint || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {bugReports.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No bug reports found.</div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
