import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard, motion } from 'framer-motion';
import {
  User, Palette, Bell, Shield, Lock, Download, Keyboard, Link as LinkIcon,
  AlertTriangle, ChevronRight, Monitor, Moon, Sun, Key, Loader2, Check, LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../lib/permissions';
import { getProfileData, updateProfile, getUserSettings, updateUserSettings } from '../lib/dataService';
import { supabase } from '../lib/supabaseClient';
import { authConfig } from '../lib/config';
import { useNavigate } from 'react-router-dom';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 24 } } };

const SettingCard = ({ icon: Icon, title, desc, colSpan = 1, children, color = 'var(--color-primary)', danger = false }) => (
  <motion.div variants={item} className={`bento-card col-span-${colSpan}`} style={{ display: 'flex', flexDirection: 'column', borderColor: danger ? 'var(--color-mistakes)' : undefined, background: danger ? 'rgba(239,68,68,0.03)' : undefined }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: children ? '1.5rem' : 0 }}>
      <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: `color-mix(in srgb, ${danger ? 'var(--color-mistakes)' : color} 15%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} color={danger ? 'var(--color-mistakes)' : color} />
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ marginBottom: '0.25rem', color: danger ? 'var(--color-mistakes)' : undefined }}>{title}</h3>
        <p className="text-muted text-sm" style={{ lineHeight: 1.4 }}>{desc}</p>
      </div>
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      {children}
    </div>
  </motion.div>
);

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: checked ? 'var(--color-primary)' : 'var(--color-border-subtle)',
        position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: checked ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </div>
  );
}

export function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isPro, isProPlus } = usePermissions();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile form
  const [fullName, setFullName]   = useState('');
  const [username, setUsername]   = useState('');
  const [bio, setBio]             = useState('');
  const [github, setGithub]       = useState('');
  const [linkedin, setLinkedin]   = useState('');
  const [website, setWebsite]     = useState('');

  // Appearance
  const [theme, setTheme] = useState('dark');

  // Notification settings
  const [notifDailyRevision, setNotifDailyRevision] = useState(true);
  const [notifMissedStreak,  setNotifMissedStreak]  = useState(true);
  const [notifWeeklyDigest,  setNotifWeeklyDigest]  = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { profile: p } = await getProfileData(user.id);
      const settings = await getUserSettings(user.id);
      
      if (settings?.theme) {
        setTheme(settings.theme);
        document.documentElement.setAttribute('data-theme', settings.theme === 'light' ? 'light' : 'dark');
      }

      setProfile(p);
      setFullName(p.full_name ?? '');
      setUsername(p.username ?? '');
      setBio(p.bio ?? '');
      setGithub(p.github_url ?? '');
      setLinkedin(p.linkedin_url ?? '');
      setWebsite(p.website_url ?? '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme === 'light' ? 'light' : 'dark');
    localStorage.setItem('revoraa_theme', newTheme);
    if (user) {
      try {
        await updateUserSettings(user.id, { theme: newTheme });
      } catch (err) {
        console.error('Failed to save theme:', err);
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user.id, {
        full_name: fullName,
        username,
        bio,
        github_url: github,
        linkedin_url: linkedin,
        website_url: website,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you absolutely sure? This cannot be undone.');
    if (!confirmed) return;
    // In production this should call a Supabase Edge Function to fully delete user data
    alert('Account deletion is handled securely via backend. Please contact support@revoraa.com.');
  };

  const handleExport = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('solved_problems')
      .select('*, problem:problems(title, slug, difficulty)')
      .eq('user_id', user.id)
      .is('deleted_at', null);

    const csv = [
      ['Problem', 'Difficulty', 'Confidence', 'Solve Time (min)', 'Date Added', 'Notes'],
      ...(data ?? []).map(sp => [
        sp.problem?.title ?? '',
        sp.problem?.difficulty ?? '',
        sp.confidence ?? '',
        sp.solve_time_minutes ?? '',
        sp.first_solved_at ? new Date(sp.first_solved_at).toLocaleDateString() : '',
        (sp.notes ?? '').replace(/"/g, '""'),
      ]),
    ].map(row => row.map(v => `"${v}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'revoraa_problems.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const initial = profile?.full_name?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? 'U';

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <header className="page-header">
        <h1>Settings</h1>
        <p className="text-secondary">Manage your preferences, account details, and integrations.</p>
      </header>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} />
        </div>
      ) : (
        <motion.div className="bento-grid" variants={container} initial="hidden" animate="show">

          {/* Profile */}
          <SettingCard icon={User} title="Profile" desc="Update your public profile and avatar." colSpan={2}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 600, color: '#fff', flexShrink: 0 }}>
                {profile?.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : initial}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600 }}>{profile?.full_name ?? user?.email?.split('@')?.[0]}</p>
                <p className="text-muted text-sm">{user?.email}</p>
              </div>
              <button className="btn btn-secondary" onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LogOut size={14} /> Sign Out
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              {[
                { label: 'Full Name', val: fullName, set: setFullName, placeholder: 'Your name' },
                { label: 'Username', val: username, set: setUsername, placeholder: 'username' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem', fontWeight: 500 }}>{f.label}</label>
                  <input
                    type="text"
                    value={f.val}
                    onChange={e => f.set(e.target.value)}
                    placeholder={f.placeholder}
                    style={{ width: '100%', padding: '0.625rem 0.75rem', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem', fontWeight: 500 }}>Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Tell the world about yourself…"
                rows={2}
                style={{ width: '100%', padding: '0.625rem 0.75rem', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'GitHub URL', val: github, set: setGithub },
                { label: 'LinkedIn URL', val: linkedin, set: setLinkedin },
                { label: 'Portfolio URL', val: website, set: setWebsite },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem', fontWeight: 500 }}>{f.label}</label>
                  <input
                    type="url"
                    value={f.val}
                    onChange={e => f.set(e.target.value)}
                    placeholder="https://…"
                    style={{ width: '100%', padding: '0.625rem 0.75rem', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>
              ))}
            </div>

            <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving} style={{ alignSelf: 'flex-start', opacity: saving ? 0.7 : 1 }}>
              {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : saved ? <><Check size={14} /> Saved!</> : 'Save Profile'}
            </button>
          </SettingCard>

          {/* Appearance */}
          <SettingCard icon={Palette} title="Appearance" desc="Customize your UI theme and colors." colSpan={2} color="var(--color-readiness)">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {[{ icon: Monitor, label: 'System', val: 'system' }, { icon: Moon, label: 'Dark', val: 'dark' }, { icon: Sun, label: 'Light', val: 'light' }].map((t) => {
                const isActive = theme === t.val;
                return (
                  <button 
                    key={t.label} 
                    onClick={() => handleThemeChange(t.val)}
                    className="btn" 
                    style={{ padding: '0.75rem', background: isActive ? 'var(--color-primary)' : 'var(--color-bg-surface)', border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border-subtle)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: isActive ? '#fff' : 'var(--color-text-secondary)' }}
                  >
                    <t.icon size={18} />
                    <span className="text-xs">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </SettingCard>

          {/* Notifications */}
          <SettingCard icon={Bell} title="Notifications" desc="Configure your daily reminders and alerts." color="var(--color-revision)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { label: 'Daily Revision Reminder', val: notifDailyRevision, set: setNotifDailyRevision },
                { label: 'Missed Streak Alert',     val: notifMissedStreak,  set: setNotifMissedStreak  },
                { label: 'Weekly Progress Digest',  val: notifWeeklyDigest,  set: setNotifWeeklyDigest  },
              ].map(t => (
                <label key={t.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{t.label}</span>
                  <Toggle checked={t.val} onChange={t.set} />
                </label>
              ))}
            </div>
          </SettingCard>

          {/* Security */}
          <SettingCard icon={Lock} title="Security" desc="Update your password and session." color="var(--color-mission)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'space-between' }}
                onClick={async () => {
                  const { error } = await supabase.auth.resetPasswordForEmail(user.email, { redirectTo: authConfig.passwordResetUrl });
                  if (error) alert(error.message);
                  else alert('Check your email for a password reset link.');
                }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Key size={14} /> Change Password</span>
                <ChevronRight size={16} />
              </button>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'space-between' }} onClick={handleSignOut}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><LogOut size={14} /> Sign Out</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </SettingCard>

          
          {/* Billing & Subscription */}
          <SettingCard icon={CreditCard} title="Subscription & Billing" desc="Manage your subscription plan and billing details." color="var(--color-primary)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: isPro ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>
                    {profile?.role === 'pro_yearly' ? 'Pro Yearly' : profile?.role === 'pro_monthly' ? 'Pro Monthly' : 'Free Plan'}
                  </h4>
                  <p className="text-muted text-sm">{isPro ? `Your subscription is active. Renews on: ${new Date(profile?.subscription_renewal_date).toLocaleDateString()}` : 'Upgrade to unlock unlimited problems and advanced analytics.'}</p>
                </div>
                {!isPro && (
                  <button onClick={() => window.location.href = '/pricing'} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                    Upgrade to Pro
                  </button>
                )}
                {isPro && (
                  <button className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }} onClick={() => alert('Manage Subscription portal coming soon')}>
                    Manage Billing
                  </button>
                )}
              </div>
            </div>
          </SettingCard>


          {/* Keyboard Shortcuts */}
          <SettingCard icon={Keyboard} title="Keyboard Shortcuts" desc="Speed up your workflow." color="var(--color-analytics)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                ['Start Revision', 'Enter / Space'],
                ['Done Solving',   'Esc'],
                ['New Problem',    '⌘ N'],
                ['Open Search',    '⌘ K'],
              ].map(([action, key]) => (
                <div key={action} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{action}</span>
                  <kbd style={{ padding: '2px 8px', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 6, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{key}</kbd>
                </div>
              ))}
            </div>
          </SettingCard>

          {/* Connected Accounts */}
          <SettingCard icon={LinkIcon} title="Connected Accounts" desc="Link GitHub or Google for OAuth login." colSpan={2} color="var(--color-readiness)">
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[
                { name: 'GitHub',  color: '#333', onClick: () => supabase.auth.signInWithOAuth({ provider: 'github',  options: { redirectTo: authConfig.oauthCallbackUrl } }) },
                { name: 'Google', color: '#4285F4', onClick: () => supabase.auth.signInWithOAuth({ provider: 'google',  options: { redirectTo: authConfig.oauthCallbackUrl } }) },
              ].map(p => (
                <button key={p.name} onClick={p.onClick} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', gap: '0.625rem' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                  Connect {p.name}
                </button>
              ))}
            </div>
          </SettingCard>

          {/* Data Export */}
          <SettingCard icon={Shield} title="Data Export" desc="Download all your problems and notes as CSV." color="var(--color-xp)">
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleExport}>
              Export Problems CSV
            </button>
          </SettingCard>

          {/* Danger Zone */}
          <SettingCard icon={AlertTriangle} title="Danger Zone" desc="Permanently delete your account and all data." colSpan={4} danger>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <h4 style={{ color: 'var(--color-mistakes)' }}>Delete Account</h4>
                <p className="text-muted text-sm">Once you delete your account, there is no going back. Please be certain.</p>
              </div>
              <button className="btn" style={{ background: 'var(--color-mistakes)', color: '#fff' }} onClick={handleDeleteAccount}>
                Delete Account
              </button>
            </div>
          </SettingCard>

        </motion.div>
      )}
    </div>
  );
}
