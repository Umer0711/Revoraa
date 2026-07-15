import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CalendarClock, Zap, Trophy, TrendingUp, AlertCircle, Trash2, CheckCheck, Info } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useRealtime } from '../contexts/RealtimeContext';
import { formatDistanceToNow } from 'date-fns';

const typeConfig = {
  revision:       { icon: CalendarClock, color: 'var(--color-revision)',    bg: 'rgba(245,158,11,0.12)'  },
  revision_due:   { icon: CalendarClock, color: 'var(--color-revision)',    bg: 'rgba(245,158,11,0.12)'  },
  achievement:    { icon: Trophy,        color: 'var(--color-achievement)', bg: 'rgba(236,72,153,0.12)' },
  xp:             { icon: Zap,           color: 'var(--color-xp)',          bg: 'rgba(249,115,22,0.12)' },
  xp_levelup:     { icon: Zap,           color: 'var(--color-xp)',          bg: 'rgba(249,115,22,0.12)' },
  readiness:      { icon: TrendingUp,    color: 'var(--color-readiness)',   bg: 'rgba(59,130,246,0.12)' },
  insight:        { icon: AlertCircle,   color: 'var(--color-analytics)',   bg: 'rgba(6,182,212,0.12)'  },
  activity:       { icon: Bell,          color: 'var(--color-primary)',     bg: 'rgba(139,92,246,0.12)' },
  system:         { icon: Info,          color: 'var(--color-text-muted)',  bg: 'rgba(255,255,255,0.05)' },
  default:        { icon: Bell,          color: 'var(--color-text-muted)',  bg: 'rgba(255,255,255,0.05)' }
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 10, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 24 } } };

export function Notifications() {
  const { user } = useAuth();
  const { refreshKey } = useRealtime();
  const [notifs, setNotifs] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifs() {
      if (!user) return;
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setNotifs(data);
      }
      setLoading(false);
    }
    fetchNotifs();
  }, [user, refreshKey]);

  const filters = ['All', 'Unread', 'Revision', 'Achievements', 'XP'];
  const typeMap = { 
    Revision: ['revision', 'revision_due'], 
    Achievements: ['achievement'], 
    XP: ['xp', 'xp_levelup'] 
  };

  const filtered = notifs.filter(n => {
    if (filter === 'Unread') return !n.is_read;
    if (typeMap[filter]) return typeMap[filter].includes(n.type);
    return true;
  });

  const unreadCount = notifs.filter(n => !n.is_read).length;

  const markAllRead = async () => {
    setNotifs(ns => ns.map(n => ({ ...n, is_read: true })));
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
  };

  const markRead = async (id) => {
    setNotifs(ns => ns.map(n => n.id === id ? { ...n, is_read: true } : n));
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  };

  const dismiss = async (id) => {
    setNotifs(ns => ns.filter(n => n.id !== id));
    await supabase.from('notifications').update({ deleted_at: new Date().toISOString() }).eq('id', id);
  };

  const clearAll = async () => {
    setNotifs([]);
    await supabase.from('notifications').update({ deleted_at: new Date().toISOString() }).eq('user_id', user.id).is('deleted_at', null);
  };

  return (
    <div style={{ maxWidth: 720, paddingBottom: '4rem' }}>
      <header className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h1 style={{ margin: 0 }}>Notifications</h1>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="badge badge-danger"
                  style={{ fontSize: '0.7rem', fontWeight: 700 }}
                >
                  {unreadCount} new
                </motion.span>
              )}
            </div>
            <p className="text-secondary">Revision reminders, XP updates, and activity.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="btn btn-secondary" onClick={markAllRead} style={{ fontSize: '0.8rem' }}>
              <CheckCheck size={14} /> Mark all read
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="btn btn-secondary" onClick={clearAll} style={{ fontSize: '0.8rem', color: 'var(--color-mistakes)' }}>
              <Trash2 size={14} /> Clear all
            </motion.button>
          </div>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          {filters.map(f => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => setFilter(f)}
              className="btn"
              style={{
                padding: '0.4rem 0.875rem',
                fontSize: '0.82rem',
                background: filter === f ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                color: filter === f ? '#fff' : 'var(--color-text-secondary)',
                border: `1px solid ${filter === f ? 'transparent' : 'var(--color-border-subtle)'}`,
              }}
            >
              {f}
            </motion.button>
          ))}
        </div>
      </header>

      {/* Notification list */}
      {loading ? (
        <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading notifications...</div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          <Bell size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>No notifications to show.</p>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
          <AnimatePresence mode="popLayout">
            {filtered.map(n => {
              const config = typeConfig[n.type] || typeConfig.default;
              const Icon = config.icon;
              
              return (
                <motion.div
                  key={n.id}
                  layout
                  variants={item}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, scale: 0.9, x: -20, transition: { duration: 0.2 } }}
                  className="bento-card"
                  style={{
                    padding: '1.25rem',
                    display: 'flex', gap: '1rem', alignItems: 'flex-start',
                    background: n.is_read ? 'var(--color-bg-surface)' : 'rgba(139, 92, 246, 0.03)',
                    border: n.is_read ? '1px solid var(--color-border-subtle)' : '1px solid rgba(139, 92, 246, 0.2)',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={() => !n.is_read && markRead(n.id)}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: config.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={20} color={config.color} />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                      <h4 style={{ margin: 0, color: n.is_read ? 'var(--color-text-primary)' : '#fff' }}>{n.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {n.created_at ? formatDistanceToNow(new Date(n.created_at), { addSuffix: true }) : 'Just now'}
                      </span>
                    </div>
                    <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                      onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: '0.25rem' }}
                      title="Dismiss"
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
