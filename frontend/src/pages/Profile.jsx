import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Code, Briefcase, Globe, Award, Target, Zap, Settings, Loader2, Lock } from 'lucide-react';
import * as Icons from 'lucide-react';
import { FEATURES } from '../lib/features';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCosmetics } from '../contexts/CosmeticContext';
import { getProfileData } from '../lib/dataService';
import { SEO } from '../components/SEO';


const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
};

function StatItem({ label, value, suffix }) {
  return (
    <div>
      <p className="text-muted text-sm uppercase">{label}</p>
      <div style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.25rem' }}>
        {value ?? '—'}{suffix && <span className="text-muted" style={{ fontSize: '1rem', marginLeft: '4px' }}>{suffix}</span>}
      </div>
    </div>
  );
}

export function Profile() {
  const { user, profile: authProfile } = useAuth();
  const isPro = authProfile?.is_pro === true && new Date(authProfile?.expires_at) > new Date();
  const { equippedItems } = useCosmetics();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await getProfileData(user.id);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
      <SEO title="Profile" url="https://revoraa.com/profile" />
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} />
        <p className="text-secondary">Loading profile…</p>
      </div>
    );
  }

  if (error) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Failed to load profile: {error}</div>;
  }

  const profile  = data?.profile  ?? {};
  const stats    = data?.stats    ?? {};
  const achievements = data?.achievements ?? [];

  const firstName  = profile.full_name ?? user?.email?.split('@')?.[0] ?? 'User';
  const initial    = firstName.charAt(0).toUpperCase();
  const memberYear = profile.created_at ? new Date(profile.created_at).getFullYear() : new Date().getFullYear();
  const readiness  = Math.min(100, Math.round(((stats.total_solved ?? 0) / 200) * 100));
  const xpToNext   = 500 - ((stats.xp ?? 0) % 500);

  return (
    <div className="profile-page" style={{ paddingBottom: '3rem' }}>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Profile</h1>
          <p className="text-secondary">Your developer identity and statistics.</p>
        </div>
        <Link to="/settings" className="btn btn-secondary">
          <Settings size={16} /> Edit Profile
        </Link>
      </header>

      <motion.div className="bento-grid" variants={container} initial="hidden" animate="show">

        {/* Hero Card */}
        <motion.div variants={item} className="bento-card col-span-2 row-span-2 liquid-glass" style={{ display: 'flex', flexDirection: 'column', padding: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ 
                  borderRadius: '50%',
                  padding: equippedItems?.profile_frames ? '4px' : '0',
                  background: equippedItems?.profile_frames ? `linear-gradient(135deg, ${equippedItems.profile_frames.color}, transparent)` : 'transparent',
                  boxShadow: equippedItems?.profile_frames ? `0 0 15px ${equippedItems.profile_frames.color}66` : 'none'
                }}>
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={firstName} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 600, color: '#fff' }}>
                      {initial}
                    </div>
                  )}
                </div>
                
                {/* Decoration */}
                {equippedItems?.decorations && (() => {
                  const DecIcon = Icons[equippedItems.decorations.icon_name] || Icons.Sparkles;
                  return (
                    <div style={{
                      position: 'absolute',
                      top: -15,
                      right: -10,
                      background: `color-mix(in srgb, ${equippedItems.decorations.color} 20%, var(--color-bg-base))`,
                      padding: '0.4rem',
                      borderRadius: '50%',
                      border: `1px solid ${equippedItems.decorations.color}`,
                      boxShadow: `0 0 10px ${equippedItems.decorations.color}40`,
                      zIndex: 10
                    }}>
                      <DecIcon size={18} color={equippedItems.decorations.color} />
                    </div>
                  );
                })()}
              </div>
              
              <div>
                <h2 style={{ fontSize: '2rem', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: equippedItems?.name_colors?.color || 'var(--color-text)' }}>
                  {equippedItems?.badges && (() => {
                    const BadgeIcon = Icons[equippedItems.badges.icon_name] || Icons.Award;
                    return <BadgeIcon size={24} color={equippedItems.badges.color} />;
                  })()}
                  {profile.full_name ?? firstName}
                  {FEATURES.PREMIUM && isPro && (
                    <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: 'rgba(255,171,0,0.1)', color: 'var(--color-primary)', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 700 }}>
                      <Zap size={14} /> PRO
                    </span>
                  )}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                  <p className="text-secondary" style={{ margin: 0 }}>@{profile.username ?? 'username'}</p>
                  {equippedItems?.titles && (
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: equippedItems.titles.color || 'var(--color-primary)', background: `color-mix(in srgb, ${equippedItems.titles.color || 'var(--color-primary)'} 15%, transparent)`, padding: '0.1rem 0.6rem', borderRadius: '1rem' }}>
                      {equippedItems.titles.name}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <span className="badge">Lvl {stats.level ?? 1}</span>
                  <span className="badge" style={{ color: 'var(--color-xp)', borderColor: 'var(--color-xp)33' }}>
                    {stats.xp ?? 0} XP
                  </span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-primary)' }}>{readiness}%</div>
              <p className="text-secondary text-sm">Readiness</p>
            </div>
          </div>

          {profile.bio && (
            <p className="text-secondary" style={{ marginTop: '2rem', flex: 1, lineHeight: 1.6 }}>{profile.bio}</p>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            {profile.github_url && (
              <a href={profile.github_url} target="_blank" rel="noreferrer" className="btn-icon" title="GitHub">
                <Code size={18} />
              </a>
            )}
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="btn-icon" title="LinkedIn">
                <Briefcase size={18} />
              </a>
            )}
            {profile.website_url && (
              <a href={profile.website_url} target="_blank" rel="noreferrer" className="btn-icon" title="Portfolio">
                <Globe size={18} />
              </a>
            )}
            <span className="text-muted text-sm" style={{ marginLeft: 'auto', alignSelf: 'center' }}>
              Member since {memberYear}
            </span>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div variants={item} className="bento-card col-span-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', padding: '2rem' }}>
          <StatItem label="Solved"    value={stats.total_solved ?? 0} />
          <StatItem label="Revised"   value={stats.total_revised ?? 0} />
          <StatItem label="Streak"    value={stats.current_streak ?? 0} suffix="days" />
          <StatItem label="XP Total"  value={stats.xp ?? 0} />
          <StatItem label="Level"     value={stats.level ?? 1} />
          <StatItem label="Coins"     value={profile.coins_balance ?? 0} />
        </motion.div>

        {/* XP Progress */}
        <motion.div variants={item} className="bento-card col-span-2">
          <h3 style={{ marginBottom: '1.25rem' }}>XP Progress — Level {stats.level ?? 1}</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="text-secondary text-sm">{stats.xp ?? 0} XP</span>
            <span className="text-muted text-sm">{xpToNext} XP to Level {(stats.level ?? 1) + 1}</span>
          </div>
          <div style={{ height: 8, background: 'var(--color-border-subtle)', borderRadius: 4, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((stats.xp ?? 0) % 500) / 500 * 100}%` }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: '100%', background: 'linear-gradient(to right, var(--color-xp), var(--color-primary))', borderRadius: 4 }}
            />
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div variants={item} className="bento-card col-span-4">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="var(--color-amber)" /> Achievements
            <span className="badge" style={{ marginLeft: '0.5rem' }}>{achievements.filter(a => a.achievement).length} unlocked</span>
          </h3>
          {achievements.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <p>No achievements yet — start solving problems to earn your first badge!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
              {achievements.slice(0, 8).map((ua) => (
                <motion.div
                  key={ua.achievement?.title}
                  whileHover={{ scale: 1.05, y: -4 }}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-subtle)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.625rem',
                  }}
                >
                  <div style={{ fontSize: '2rem' }}>{ua.achievement?.badge_icon ?? '🏆'}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{ua.achievement?.title}</div>
                  <div className="text-muted text-xs">{ua.unlocked_at ? new Date(ua.unlocked_at).toLocaleDateString() : ''}</div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Goals */}
        <motion.div variants={item} className="bento-card col-span-2">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={18} color="var(--color-mission)" /> Interview Readiness
          </h3>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="text-secondary">Overall Readiness</span>
              <span className="text-muted">{readiness}%</span>
            </div>
            <div style={{ height: '6px', background: 'var(--color-border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${readiness}%` }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: '100%', background: 'var(--color-primary)', borderRadius: '3px' }}
              />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="text-secondary">Current Streak</span>
              <span className="text-muted">{stats.current_streak ?? 0} / {stats.longest_streak ?? 0} (best)</span>
            </div>
            <div style={{ height: '6px', background: 'var(--color-border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: stats.longest_streak ? `${((stats.current_streak ?? 0) / stats.longest_streak) * 100}%` : '0%' }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: '100%', background: 'var(--color-xp)', borderRadius: '3px' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={item} className="bento-card col-span-2 liquid-glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
          <motion.div whileHover={{ scale: 1.1, y: -5 }} style={{ textAlign: 'center' }}>
            <Link to="/achievements" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Award size={32} color="var(--color-amber)" style={{ margin: '0 auto 0.5rem' }} />
              <span className="text-sm">Achievements</span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1, y: -5 }} style={{ textAlign: 'center' }}>
            <Link to="/analytics" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Zap size={32} color="var(--color-primary)" style={{ margin: '0 auto 0.5rem' }} />
              <span className="text-sm">Analytics</span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1, y: -5 }} style={{ textAlign: 'center', opacity: 0.4 }}>
            <Lock size={32} color="var(--color-text-secondary)" style={{ margin: '0 auto 0.5rem' }} />
            <span className="text-sm">More Soon</span>
          </motion.div>
        </motion.div>

      </motion.div>
    </div>
  );
}
