import React, { useState, useEffect, useMemo, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Compass, CalendarCheck, Target, Menu, X,
  Library, Map, Award, Zap, CheckSquare, ShoppingCart, TrendingUp,
  Hash, AlertCircle, Settings, HelpCircle, Flame, Bell, User, LogOut,
  Sun, Moon, Shield, ChevronRight, Coins, PlusCircle, BookOpen
} from 'lucide-react';
import { RevoraaLogo } from './RevoraaLogo';
import { useAuth } from '../contexts/AuthContext';
import { useCosmetics } from '../contexts/CosmeticContext';
import { getNotifications, markAllNotificationsRead, getProfileData } from '../lib/dataService';
import { supabase } from '../lib/supabaseClient';
import { FEATURES } from '../lib/features';
import * as Icons from 'lucide-react';

const primaryTabs = [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { path: '/dsa-atlas', label: 'Atlas', icon: Compass },
  { path: '/revision', label: 'Revision', icon: CalendarCheck },
  { path: '/readiness', label: 'Readiness', icon: Target },
];

export function MobileNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, profile } = useAuth();
  const { equippedItems } = useCosmetics();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const isPro = profile?.is_pro === true && new Date(profile?.expires_at) > new Date();

  // Theme support
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  // Fetch notifications & stats
  useEffect(() => {
    if (!user) return;
    async function loadData() {
      try {
        const [notifs, profileInfo] = await Promise.all([
          getNotifications(user.id),
          getProfileData(user.id)
        ]);
        setNotifications(notifs ?? []);
        setProfileData(profileInfo ?? null);
      } catch (e) {
        console.error('MobileNav fetch error:', e);
      }
    }
    loadData();

    const channel = supabase
      .channel(`mobile_nav:${user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Auto-close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const firstName = profile?.full_name?.split(' ')?.[0] || profileData?.profile?.full_name?.split(' ')?.[0] || user?.email?.split('@')[0] || 'User';
  const initial = firstName.charAt(0).toUpperCase();
  const coinsBalance = profileData?.profile?.coins_balance ?? profile?.coins_balance ?? 0;

  const handleMarkAllRead = async () => {
    if (!user) return;
    await markAllNotificationsRead(user.id);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  return (
    <>
      {/* ─── Top Mobile Header ──────────────────────────────────────────────── */}
      <header className="mobile-header">
        {/* Left: User Avatar & Quick Profile trigger */}
        <Link to="/profile" className="mobile-header-user" aria-label="View Profile">
          <div className="mobile-avatar-ring">
            {profileData?.profile?.avatar_url ? (
              <img src={profileData.profile.avatar_url} alt={firstName} className="mobile-avatar-img" />
            ) : (
              <div className="mobile-avatar-placeholder">{initial}</div>
            )}
          </div>
          <div className="mobile-user-details">
            <span className="mobile-user-name" style={{ color: equippedItems?.name_colors?.color || 'var(--color-text-primary)' }}>
              {firstName}
            </span>
            <span className="mobile-user-streak">
              <Flame size={10} color="var(--color-revision)" fill="var(--color-revision)" />
              {profileData?.stats?.current_streak || 0}d
            </span>
          </div>
        </Link>

        {/* Center: Revoraa Brand */}
        <Link to="/dashboard" className="mobile-header-brand" aria-label="Revoraa Home">
          <RevoraaLogo size={20} color="var(--color-primary)" />
          <span className="mobile-brand-title">Revoraa</span>
        </Link>

        {/* Right: Coins Badge & Notifications & Theme */}
        <div className="mobile-header-actions">
          <Link to="/shop" className="mobile-coins-badge" aria-label="Coin Shop">
            <Coins size={13} color="var(--color-revision)" />
            <span>{coinsBalance.toLocaleString()}</span>
          </Link>

          <button
            className="mobile-icon-btn"
            onClick={() => setNotifOpen(o => !o)}
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="mobile-notif-dot">{unreadCount}</span>}
          </button>

          <button className="mobile-icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* ─── Mobile Notifications Bottom Sheet ────────────────────────────── */}
      <AnimatePresence>
        {notifOpen && (
          <>
            <motion.div
              className="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNotifOpen(false)}
            />
            <motion.div
              className="mobile-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            >
              <div className="mobile-sheet-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3>Notifications</h3>
                  {unreadCount > 0 && <span className="badge badge-primary">{unreadCount}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {unreadCount > 0 && (
                    <button className="btn-ghost text-xs" onClick={handleMarkAllRead}>
                      Mark read
                    </button>
                  )}
                  <button className="mobile-icon-btn" onClick={() => setNotifOpen(false)}>
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="mobile-sheet-body">
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <Bell size={28} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.slice(0, 15).map(n => (
                    <div key={n.id} className={`mobile-notif-row ${!n.is_read ? 'unread' : ''}`}>
                      <div className="mobile-notif-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                          <span className="mobile-notif-title">{n.title}</span>
                          <span className="text-xs text-muted">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-secondary">{n.body}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Bottom Navigation Bar ────────────────────────────────────────── */}
      <nav className="mobile-bottom-nav">
        {primaryTabs.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) => `mobile-tab-item ${isActive ? 'active' : ''}`}
          >
            {({ isActive }) => (
              <>
                <div className="mobile-tab-icon-wrap">
                  <tab.icon size={20} strokeWidth={isActive ? 2.3 : 1.8} />
                  {isActive && <motion.div layoutId="mobile-tab-glow" className="mobile-tab-pill" />}
                </div>
                <span className="mobile-tab-label">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* More Menu Trigger */}
        <button
          className={`mobile-tab-item ${drawerOpen ? 'active' : ''}`}
          onClick={() => setDrawerOpen(true)}
          aria-label="More navigation menu"
        >
          <div className="mobile-tab-icon-wrap">
            <Menu size={20} strokeWidth={drawerOpen ? 2.3 : 1.8} />
          </div>
          <span className="mobile-tab-label">More</span>
        </button>
      </nav>

      {/* ─── Slide-Over Mobile Menu Sheet ──────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className="mobile-drawer-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            >
              <div className="mobile-drawer-handle" />

              {/* User Header inside drawer */}
              <div className="mobile-drawer-user-card">
                <div className="mobile-drawer-avatar">
                  {profileData?.profile?.avatar_url ? (
                    <img src={profileData.profile.avatar_url} alt={firstName} />
                  ) : (
                    <span>{initial}</span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: equippedItems?.name_colors?.color || 'var(--color-text-primary)' }}>
                      {profileData?.profile?.full_name || firstName}
                    </h4>
                    {isPro && <span className="pro-pill">PRO</span>}
                  </div>
                  <p className="text-xs text-muted" style={{ margin: '0.1rem 0 0' }}>{user?.email}</p>
                </div>
                <button className="mobile-icon-btn" onClick={() => setDrawerOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Sections */}
              <div className="mobile-drawer-scroll">

                {/* Section: Learning & Practice */}
                <div className="mobile-drawer-group">
                  <span className="mobile-group-title">PRACTICE & LEARNING</span>
                  <div className="mobile-grid-links">
                    <Link to="/learn" className="mobile-nav-card" onClick={() => setDrawerOpen(false)}>
                      <BookOpen size={18} color="var(--color-primary)" />
                      <span>Developer Paths</span>
                      <ChevronRight size={14} className="chevron" />
                    </Link>
                    <Link to="/library" className="mobile-nav-card" onClick={() => setDrawerOpen(false)}>
                      <Library size={18} color="var(--color-primary)" />
                      <span>Problem Library</span>
                      <ChevronRight size={14} className="chevron" />
                    </Link>
                    <Link to="/add-problem" className="mobile-nav-card">
                      <PlusCircle size={18} color="var(--color-mission)" />
                      <span>Add Problem</span>
                      <ChevronRight size={14} className="chevron" />
                    </Link>
                    <Link to="/roadmap" className="mobile-nav-card">
                      <Map size={18} color="var(--color-readiness)" />
                      <span>Roadmap</span>
                      <ChevronRight size={14} className="chevron" />
                    </Link>
                    <Link to="/patterns" className="mobile-nav-card">
                      <Hash size={18} color="var(--color-level)" />
                      <span>Patterns</span>
                      <ChevronRight size={14} className="chevron" />
                    </Link>
                    <Link to="/mistakes" className="mobile-nav-card">
                      <AlertCircle size={18} color="var(--color-mistakes)" />
                      <span>Mistakes Log</span>
                      <ChevronRight size={14} className="chevron" />
                    </Link>
                  </div>
                </div>

                {/* Section: Gamification & Shop */}
                <div className="mobile-drawer-group">
                  <span className="mobile-group-title">GAMIFICATION</span>
                  <div className="mobile-grid-links">
                    <Link to="/shop" className="mobile-nav-card">
                      <ShoppingCart size={18} color="var(--color-revision)" />
                      <span>Coin Shop</span>
                      <ChevronRight size={14} className="chevron" />
                    </Link>
                    <Link to="/missions" className="mobile-nav-card">
                      <CheckSquare size={18} color="var(--color-mission)" />
                      <span>Daily Missions</span>
                      <ChevronRight size={14} className="chevron" />
                    </Link>
                    <Link to="/achievements" className="mobile-nav-card">
                      <Award size={18} color="var(--color-achievement)" />
                      <span>Achievements</span>
                      <ChevronRight size={14} className="chevron" />
                    </Link>
                    <Link to="/levels" className="mobile-nav-card">
                      <Zap size={18} color="var(--color-xp)" />
                      <span>Levels & XP</span>
                      <ChevronRight size={14} className="chevron" />
                    </Link>
                    <Link to="/analytics" className="mobile-nav-card">
                      <TrendingUp size={18} color="var(--color-analytics)" />
                      <span>Analytics</span>
                      <ChevronRight size={14} className="chevron" />
                    </Link>
                  </div>
                </div>

                {/* Section: Admin if permitted */}
                {(user?.email === 'umer221107@gmai.com' || user?.email === 'umer221107@gmail.com') && (
                  <div className="mobile-drawer-group">
                    <span className="mobile-group-title" style={{ color: 'var(--color-primary)' }}>ADMINISTRATION</span>
                    <div className="mobile-grid-links">
                      <Link to="/admin" className="mobile-nav-card">
                        <Shield size={18} color="var(--color-primary)" />
                        <span>Admin Panel</span>
                        <ChevronRight size={14} className="chevron" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Section: Account & Support */}
                <div className="mobile-drawer-group">
                  <span className="mobile-group-title">ACCOUNT</span>
                  <div className="mobile-grid-links">
                    <Link to="/profile" className="mobile-nav-card">
                      <User size={18} color="var(--color-text-secondary)" />
                      <span>Profile</span>
                      <ChevronRight size={14} className="chevron" />
                    </Link>
                    <Link to="/settings" className="mobile-nav-card">
                      <Settings size={18} color="var(--color-text-secondary)" />
                      <span>Settings</span>
                      <ChevronRight size={14} className="chevron" />
                    </Link>
                    <Link to="/support" className="mobile-nav-card">
                      <HelpCircle size={18} color="var(--color-text-secondary)" />
                      <span>Support</span>
                      <ChevronRight size={14} className="chevron" />
                    </Link>
                  </div>
                </div>

                {/* Sign Out Button */}
                <button
                  className="mobile-signout-btn"
                  onClick={async () => {
                    setDrawerOpen(false);
                    await supabase.auth.signOut();
                    navigate('/');
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
