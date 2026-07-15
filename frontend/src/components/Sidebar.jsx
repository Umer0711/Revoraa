import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Library, CalendarCheck, Map,
  Target, TrendingUp, Hash, AlertCircle,
  Award, Zap, CheckSquare, Settings, HelpCircle,
  Flame, Bell, User, LogOut, CreditCard, Star,
  CheckCheck, Trophy, Siren, Menu, X, Moon, Sun, ShoppingCart, Activity, RefreshCw, Shield
} from 'lucide-react';
import { RevoraaLogo } from './RevoraaLogo';
import { useAuth } from '../contexts/AuthContext';
import { useCosmetics } from '../contexts/CosmeticContext';
import { getNotifications, markAllNotificationsRead, getProfileData } from '../lib/dataService';
import { supabase } from '../lib/supabaseClient';
import * as Icons from 'lucide-react';
import './Sidebar.css';

const navMain = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/library', label: 'Problem Library', icon: Library },
  { path: '/revision', label: "Today's Revision", icon: CalendarCheck },
  { path: '/roadmap', label: 'Roadmap', icon: Map },
];

const navInsights = [
  { path: '/readiness', label: 'Interview Readiness', icon: Target },
  { path: '/analytics', label: 'Analytics', icon: TrendingUp },
  { path: '/patterns', label: 'Patterns', icon: Hash },
  { path: '/mistakes', label: 'Mistakes', icon: AlertCircle },
];

const navGamification = [
  { path: '/achievements', label: 'Achievements', icon: Award },
  { path: '/levels', label: 'Levels & XP', icon: Zap },
  { path: '/missions', label: 'Daily Missions', icon: CheckSquare },
  { path: '/shop', label: 'Shop', icon: ShoppingCart },
];

const navAdmin = [{ label: 'Admin Panel', icon: Shield, path: '/admin', highlight: true }];

const navTools = [
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/support', label: 'Support', icon: HelpCircle },
];

const ICONS = { Target, RefreshCw, Trophy, Star, Siren, Activity, Bell };

const NavItem = ({ item }) => (
  <NavLink
    to={item.path}
    end={item.path === '/'}
    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
    style={{ position: 'relative' }}
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <motion.div
            layoutId="sidebar-active-pill"
            className="active-indicator"
            initial={false}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            style={{ position: 'absolute', inset: 0, borderRadius: 'var(--radius-sm)', zIndex: -1 }}
          />
        )}
        <item.icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
        <span>{item.label}</span>
      </>
    )}
  </NavLink>
);

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, subscriptionData, profile } = useAuth();
  const { equippedItems } = useCosmetics();

  const [notifications, setNotifications] = useState([]);
  const [profileData, setProfileData] = useState(null);

  const notifRef   = useRef(null);
  const notifDropdownRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Theme support
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const [notifs, profileInfo] = await Promise.all([
        getNotifications(user.id),
        getProfileData(user.id)
      ]);
      setNotifications(notifs);
      setProfileData(profileInfo);
    } catch (err) {
      console.error("Sidebar data fetch error:", err);
    }
  }, [user]);

  useEffect(() => {
    fetchData();

    if (!user) return;
    const channel = supabase.channel(`sidebar:${user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user_stats', filter: `user_id=eq.${user.id}` }, () => {
        fetchData();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user, fetchData]);

  const handleMarkAllRead = async () => {
    if (!user) return;
    await markAllNotificationsRead(user.id);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const groupedNotifications = useMemo(() => {
    const grouped = { Today: [], Earlier: [] };
    const today = new Date().toISOString().split('T')[0];
    notifications.slice(0, 15).forEach(notif => {
      const isToday = notif.created_at?.startsWith(today);
      if (isToday) grouped.Today.push(notif);
      else grouped.Earlier.push(notif);
    });
    if (grouped.Today.length === 0) delete grouped.Today;
    if (grouped.Earlier.length === 0) delete grouped.Earlier;
    return grouped;
  }, [notifications]);

  // Auto-close mobile sidebar on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      const isOutsideBell = notifRef.current && !notifRef.current.contains(e.target);
      const isOutsideDropdown = notifDropdownRef.current && !notifDropdownRef.current.contains(e.target);
      if (isOutsideBell && isOutsideDropdown) setNotifOpen(false);
      
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close notifications on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setNotifOpen(false);
    };
    if (notifOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [notifOpen]);

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.94, y: -6 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } },
    exit:    { opacity: 0, scale: 0.94, y: -6, transition: { duration: 0.15 } },
  };

  const notifDropdown = (
    <AnimatePresence>
      {notifOpen && (
        <motion.div
          ref={notifDropdownRef}
          className="notification-dropdown"
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="notif-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Notifications</span>
              {unreadCount > 0 && (
                <span className="badge badge-primary">{unreadCount} new</span>
              )}
            </div>
            <button
              className="btn-ghost"
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', cursor: 'pointer' }}
              onClick={handleMarkAllRead}
            >
              <CheckCheck size={13} style={{ marginRight: '0.3rem' }} />
              Mark all read
            </button>
          </div>

          <div className="notif-body">
            {notifications.length === 0 ? (
              <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                <Bell size={32} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p className="text-secondary text-sm">No notifications yet</p>
              </div>
            ) : (
              Object.entries(groupedNotifications).map(([group, items]) => (
                <div key={group} className="notif-group">
                  <div className="notif-group-header">
                    <span>{group}</span>
                  </div>
                  {items.map((n) => {
                    const NIcon = ICONS[n.type] || Bell;
                    const color = n.type === 'revision' ? 'var(--color-revision)' : n.type === 'achievement' ? 'var(--color-achievement)' : 'var(--color-primary)';
                    return (
                      <div key={n.id} className="notif-item">
                        <div className="notif-icon-wrap" style={{ background: `color-mix(in srgb, ${color} 15%, transparent)` }}>
                          <NIcon size={16} color={color} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color }}>{n.type}</span>
                            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{n.title}</span>
                            {!n.is_read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0 }} />}
                          </div>
                          <p className="text-muted text-xs" style={{ lineHeight: 1.4 }}>{n.body}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
          
          <div className="notif-footer">
            <Link to="/notifications" className="text-primary text-sm" style={{ fontWeight: 500, textDecoration: 'none', display: 'inline-block', width: '100%', textAlign: 'center' }} onClick={() => setNotifOpen(false)}>
              View All Notifications
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const firstName = profile?.full_name?.split(' ')?.[0] || profileData?.profile?.full_name?.split(' ')?.[0] || user?.email?.split('@')[0] || 'User';
  const initial = firstName.charAt(0).toUpperCase();

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <motion.div
              whileHover={{ rotate: 90, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 250 }}
            >
              <RevoraaLogo size={24} color="var(--color-primary)" />
            </motion.div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 750, margin: 0, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>Revoraa</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="btn-icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{ padding: '0.4rem', color: 'var(--color-text-secondary)' }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </motion.button>

            {/* Notification bell */}
            <div ref={notifRef} style={{ position: 'relative' }}>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="btn-icon"
              onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
              aria-label={`Notifications – ${unreadCount} unread`}
              style={{ padding: '0.3rem' }}
            >
              <motion.div
                animate={notifOpen ? {} : { rotate: [0, -15, 15, -10, 10, 0] }}
                transition={{ duration: 0.6, delay: 1, repeat: Infinity, repeatDelay: 8 }}
              >
                <Bell size={16} />
              </motion.div>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute', top: 1, right: 1,
                    width: 16, height: 16,
                    background: 'var(--color-mistakes)',
                    borderRadius: '50%',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff',
                    border: '1.5px solid var(--color-bg-base)',
                  }}
                >
                  {unreadCount}
                </motion.span>
              )}
            </motion.button>

          </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <p className="nav-heading">MAIN</p>
          {navMain.map(item => <NavItem key={item.path} item={item} />)}
        </div>
        <div className="nav-section">
          <p className="nav-heading">INSIGHTS</p>
          {navInsights.map(item => <NavItem key={item.path} item={item} />)}
        </div>
        <div className="nav-section">
          <p className="nav-heading">GAMIFICATION</p>
          {navGamification.map(item => <NavItem key={item.path} item={item} />)}
        </div>
        { (user?.email === 'umer221107@gmai.com' || user?.email === 'umer221107@gmail.com') && (
        <div className="nav-section">
          <p className="nav-heading" style={{ color: 'var(--color-primary)' }}>ADMINISTRATION</p>
          {navAdmin.map(item => <NavItem key={item.path} item={item} />)}
        </div>
      )}
      <div className="nav-section">
        <p className="nav-heading">ACCOUNT</p>
          {navTools.map(item => <NavItem key={item.path} item={item} />)}
        </div>
      </nav>

      {/* Footer / Profile */}
      <div className="sidebar-footer">
        <div ref={profileRef} style={{ position: 'relative' }}>
          <motion.div whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)' }} style={{ borderRadius: 'var(--radius-sm)' }}>
            <div
              className="user-profile-bottom"
              onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
            >
              <div className="avatar-ring">
                <svg viewBox="0 0 34 34">
                  <circle className="bg" cx="17" cy="17" r="15" />
                  <motion.circle
                    className="progress"
                    cx="17" cy="17" r="15"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 28 }}
                    transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
                {profileData?.profile?.avatar_url ? (
                  <img src={profileData.profile.avatar_url} alt={firstName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div className="avatar-inner">{initial}</div>
                )}
              </div>
              <div className="user-info">
                <span className="user-name" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: equippedItems?.name_colors?.color || 'var(--color-text)' }}>
                  {equippedItems?.badges && (() => {
                    const BadgeIcon = Icons[equippedItems.badges.icon_name] || Icons.Award;
                    return <BadgeIcon size={14} color={equippedItems.badges.color} />;
                  })()}
                  {firstName}
                  {subscriptionData?.status === 'active' && <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--color-primary)', color: 'black', fontSize: '0.5rem', padding: '1px 4px', borderRadius: '4px', fontWeight: 800, letterSpacing: '0.05em' }}>PRO</div>}
                </span>
                <div className="user-meta">
                  <span className="user-level">Lvl {Math.floor((profileData?.stats?.xp || 0) / 500) + 1}</span>
                  <span className="user-streak">
                    <Flame size={9} fill="currentColor" /> {profileData?.stats?.current_streak || 0}
                  </span>
                </div>
                {equippedItems?.titles && (
                  <div style={{ fontSize: '0.7rem', color: equippedItems.titles.color || 'var(--color-text-muted)', marginTop: '2px', fontWeight: 500 }}>
                    {equippedItems.titles.name}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Profile dropdown */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                className="profile-dropdown"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ bottom: '100%', top: 'auto', marginBottom: '0.5rem' }}
              >
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{profileData?.profile?.full_name || firstName}</p>
                  <p className="text-muted text-xs">{user?.email}</p>
                </div>
                {[
                  { icon: User,    label: 'Profile',       path: '/profile' },
                  { icon: Settings,label: 'Settings',      path: '/settings' },
                  { icon: Award,   label: 'Achievements',  path: '/achievements' },
                  { icon: CreditCard, label: 'Subscription', path: '/settings' },
                ].map(({ icon: Icon, label, path }) => (
                  <Link
                    key={label}
                    to={path}
                    className="profile-dropdown-item"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Icon size={15} />
                    {label}
                  </Link>
                ))}
                <div className="divider" style={{ margin: '0.25rem 0' }} />
                <div
                  className="profile-dropdown-item danger"
                  onClick={async () => { 
                    setProfileOpen(false); 
                    await supabase.auth.signOut();
                    navigate('/'); 
                  }}
                >
                  <LogOut size={15} />
                  Sign out
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <div className="top-navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn-icon"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span style={{ fontWeight: 650, fontSize: '0.95rem', letterSpacing: '-0.03em' }}>Revoraa</span>
        </div>
      </div>

      {/* Desktop sidebar */}
      <motion.aside
        className="sidebar desktop-sidebar"
        initial={{ x: -280, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24, delay: 0.05 }}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="sidebar open"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              style={{ zIndex: 60 }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                <button className="btn-icon" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X size={18} />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Render portals */}
      {createPortal(notifDropdown, document.body)}
    </>
  );
}
