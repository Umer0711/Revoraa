import { onMissionClaimed } from "./eventOrchestrator";

import { supabase } from './supabaseClient';

/**
 * Fetch the full dashboard data for a user.
 */
export async function getDashboardData(userId) {
  const today = new Date().toISOString().split('T')[0];

  const [statsRes, revisionRes, notifRes, achievementsRes] = await Promise.all([
    supabase.from('user_stats').select('*').eq('user_id', userId).single(),
    supabase
      .from('revision_schedule')
      .select(`id, next_revision_date, solved_problem:solved_problems(id, problem:problems(title, difficulty, slug))`)
      .eq('user_id', userId)
      .eq('is_completed', false)
      .lte('next_revision_date', today)
      .order('next_revision_date', { ascending: true })
      .limit(5),
    supabase
      .from('notifications')
      .select('id, title, body, type, is_read, created_at')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('user_achievements')
      .select('unlocked_at, achievement:achievements(title, badge_icon, description)')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false })
      .limit(5),
  ]);

  const todayDate = new Date();
  todayDate.setUTCHours(0,0,0,0);
  
  let effectiveStreak = statsRes.data?.current_streak || 0;
  if (statsRes.data?.last_activity_date) {
    const lastDate = new Date(statsRes.data.last_activity_date);
    lastDate.setUTCHours(0,0,0,0);
    const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) {
      effectiveStreak = 0;
    }
  }

  const finalStats = { ...statsRes.data, current_streak: effectiveStreak };

  return {
    stats: finalStats,
    todayRevisions: revisionRes.data ?? [],
    unreadNotifications: notifRes.data ?? [],
    recentAchievements: achievementsRes.data ?? [],
  };
}

/**
 * Get revision hub statistics dynamically
 */
export async function getRevisionStats(userId) {
  const { data, error } = await supabase.rpc('get_revision_hub_stats', { p_user_id: userId });
  if (error) {
    console.error('Error fetching revision stats:', error);
    return {
      due_today: 0,
      completed_today: 0,
      total_revisions: 0,
      average_time: 0,
      manual_revisions: 0,
      scheduled_revisions: 0,
      success_rate: 0
    };
  }
  return data;
}

/**
 * Get analytics data for the Analytics page.
 */
export async function getAnalyticsData(userId) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const since = thirtyDaysAgo.toISOString().split('T')[0];

  const [dailyRes, statsRes, problemsRes, patternStatsRes, advAnalyticsRes] = await Promise.all([
    supabase
      .from('analytics_daily')
      .select('date, solved, revised, accuracy, avg_time, xp_earned, confidence')
      .eq('user_id', userId)
      .gte('date', since)
      .order('date', { ascending: true }),
    supabase.from('user_stats').select('*').eq('user_id', userId).single(),
    supabase
      .from('solved_problems')
      .select('status, confidence, solve_time_minutes, problem:problems(difficulty, problem_tags(tag))')
      .eq('user_id', userId)
      .is('deleted_at', null),
    supabase
      .from('user_pattern_stats')
      .select('*')
      .eq('user_id', userId)
      .order('solved_count', { ascending: false })
      .limit(8),
    supabase.rpc('get_advanced_analytics', { p_user_id: userId })
  ]);

  // Compute difficulty distribution
  const problems = problemsRes.data ?? [];
  const diffDistribution = { Easy: 0, Medium: 0, Hard: 0 };

  problems.forEach(sp => {
    const diff = sp.problem?.difficulty;
    if (diff) diffDistribution[diff] = (diffDistribution[diff] || 0) + 1;
  });

  const topPatterns = (patternStatsRes.data ?? []).map(ps => ({
    category: ps.pattern_id,
    count: ps.solved_count,
    accuracy: ps.mastery_score
  }));

  const avgConfidence = problems.length
    ? (problems.reduce((s, p) => s + (p.confidence ?? 3), 0) / problems.length).toFixed(1)
    : 0;

  const advAnalytics = advAnalyticsRes.data || {};

  return {
    daily: dailyRes.data || [],
    stats: statsRes.data || {},
    diffDistribution: advAnalytics.difficulty_distribution || diffDistribution,
    topPatterns,
    avgConfidence,
    advanced: advAnalytics
  };
}

/**
 * Get profile data (profile + stats + achievements + inventory).
 */
export async function getProfileData(userId) {
  const [profileRes, statsRes, achievementsRes, inventoryRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('auth_id', userId).single(),
    supabase.from('user_stats').select('*').eq('user_id', userId).single(),
    supabase
      .from('user_achievements')
      .select('unlocked_at, achievement:achievements(*)')
      .eq('user_id', userId),
    supabase
      .from('user_inventory')
      .select('is_equipped, item:shop_items(*)')
      .eq('user_id', userId),
  ]);

  return {
    profile: profileRes.data ?? {},
    stats: statsRes.data ?? {},
    achievements: achievementsRes.data ?? [],
    inventory: inventoryRes.data ?? [],
  };
}

/**
 * Update user profile fields.
 */
export async function updateProfile(userId, updates) {
  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('auth_id', userId);
  if (error) throw error;
}

/**
 * Get settings.
 */
export async function getUserSettings(userId) {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data;
}

/**
 * Update settings.
 */
export async function updateUserSettings(userId, updates) {
  const { error } = await supabase
    .from('user_settings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
  if (error) throw error;
}

/**
 * Get all notifications for a user.
 */
export async function getNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/**
 * Mark notification as read.
 */
export async function markNotificationRead(notifId) {
  await supabase.from('notifications').update({ is_read: true }).eq('id', notifId);
}

/**
 * Mark all notifications as read.
 */
export async function markAllNotificationsRead(userId) {
  await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
}

/**
 * Get shop items with user inventory state.
 */
export async function getShopData(userId) {
  const [itemsRes, inventoryRes] = await Promise.all([
    supabase.from('shop_items').select('*').eq('is_active', true),
    supabase.from('user_inventory').select('shop_item_id, is_equipped').eq('user_id', userId),
  ]);

  const owned = new Set((inventoryRes.data ?? []).map(i => i.shop_item_id));
  const equipped = new Set((inventoryRes.data ?? []).filter(i => i.is_equipped).map(i => i.shop_item_id));

  return (itemsRes.data ?? []).map(item => ({
    ...item,
    owned: owned.has(item.id),
    equipped: equipped.has(item.id),
  }));
}

/**
 * Purchase a shop item using coins.
 */
export async function purchaseShopItem(userId, itemId, coinCost) {
  // Check coins via RPC
  const { data: stats } = await supabase.from('user_stats').select('coins').eq('user_id', userId).single();
  if ((stats?.coins ?? 0) < coinCost) throw new Error('Insufficient coins.');

  // Deduct coins & add to inventory in a transaction via RPC
  const { error } = await supabase.rpc('purchase_shop_item', {
    p_user_id: userId,
    p_item_id: itemId,
    p_coin_cost: coinCost,
  });
  if (error) throw error;
}

/**
 * Get all achievements and cross-reference with user_achievements
 */
export async function getAllAchievementsData(userId) {
  const [allRes, userRes] = await Promise.all([
    supabase.from('achievements').select('*').order('xp_reward', { ascending: true }),
    supabase.from('user_achievements').select('*').eq('user_id', userId),
  ]);

  const unlockedMap = {};
  (userRes.data ?? []).forEach(ua => {
    unlockedMap[ua.achievement_id] = ua.unlocked_at;
  });

  return (allRes.data ?? []).map(a => ({
    ...a,
    unlocked: !!unlockedMap[a.id],
    unlocked_at: unlockedMap[a.id] || null,
  }));
}

/**
 * Get mistakes distribution from solved_problems
 */
export async function getAllMistakesData(userId) {
  const { data } = await supabase
    .from('solved_problems')
    .select('mistakes, problem:problems(title)')
    .eq('user_id', userId)
    .not('mistakes', 'is', null)
    .neq('mistakes', '');

  const rawMistakes = data ?? [];
  const mistakeCounts = {};

  rawMistakes.forEach(m => {
    const text = m.mistakes.trim();
    if (text) {
      if (!mistakeCounts[text]) mistakeCounts[text] = 0;
      mistakeCounts[text]++;
    }
  });

  return Object.entries(mistakeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([title, count]) => ({ 
      title, 
      count, 
      desc: `Occurred in ${count} problem${count > 1 ? 's' : ''}.` 
    }));
}

/**
 * Submit support ticket (Simulated since no table exists yet)
 */
export async function submitSupportTicket(userId, email, subject, message) {
  const { error } = await supabase
    .from('support_tickets')
    .insert({ user_id: userId, email, subject, message });
    
  if (error) {
    throw error;
  }
}


/**
 * Claim daily mission reward
 */
export async function claimDailyMissionReward(userId, missionId, xp, coins, missionTitle) {
  // Delegate the logic to the event orchestrator to keep everything centralized
  // It handles XP + leveling up + notifications
  await onMissionClaimed(userId, xp, coins, missionTitle);
}

export async function getRoadmapData(userId) {
  if (!userId) return null;

  const [phasesRes, userPhasesRes, topicsRes, progressRes] = await Promise.all([
    supabase.from('roadmap_phases').select('*').order('display_order', { ascending: true }),
    supabase.from('user_roadmap_phases').select('*').eq('user_id', userId),
    supabase.from('roadmap_topics').select('*').order('display_order', { ascending: true }),
    supabase.from('user_roadmap_progress').select('*').eq('user_id', userId)
  ]);

  if (phasesRes.error) {
    if (phasesRes.error.code === '42P01') return null; // Not migrated
    throw phasesRes.error;
  }

  const phases = phasesRes.data ?? [];
  const userPhases = userPhasesRes.data ?? [];
  const topics = topicsRes.data ?? [];
  const progress = progressRes.data ?? [];

  return phases.map(phase => {
    const uPhase = userPhases.find(p => p.phase_id === phase.id);
    const phaseTopics = topics.filter(t => t.phase_id === phase.id).map(t => {
      const prog = progress.find(p => p.topic_id === t.id);
      return {
        ...t,
        solved_count: prog?.solved_count || 0,
        is_completed: prog?.is_completed || false,
      };
    });

    return {
      ...phase,
      is_unlocked: uPhase?.is_unlocked || false,
      is_completed: uPhase?.is_completed || false,
      topics: phaseTopics
    };
  });
}

/**
 * Streak & Activity
 */
export async function getActivityHistory(userId, days = 365) {
  if (!userId) return [];
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - days);
  const since = pastDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_activity')
    .select('activity_date, activity_type')
    .eq('user_id', userId)
    .gte('activity_date', since)
    .order('activity_date', { ascending: true });

  if (error) {
    if (error.code === '42P01') return []; // Migration not applied
    throw error;
  }
  return data || [];
}

export async function updateUserTimezone(userId) {
  try {
    if (!userId) return;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      await supabase.from('user_settings').update({ timezone: tz }).eq('user_id', userId);
    }
  } catch (err) {
    console.error('Failed to update timezone:', err);
  }
}


export async function sendEmailEvent(type, payload, to = null) {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { type, payload, to }
    });
    if (error) console.error('Failed to send email:', error);
    return data;
  } catch (err) {
    console.error('Email error:', err);
  }
}
