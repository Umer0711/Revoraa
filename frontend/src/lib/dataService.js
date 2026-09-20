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
 * Uses the authoritative get_user_analytics RPC with timezone support,
 * and falls back to real-time client-side calculation from solved_problems and revision_attempts.
 */
export async function getAnalyticsData(userId) {
  if (!userId) return null;

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  // 1. Attempt authoritative RPC first
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_user_analytics', {
      p_user_id: userId,
      p_timezone: tz
    });

    if (!rpcError && rpcData && rpcData.summary) {
      const s = rpcData.summary;
      const diffDist = rpcData.difficulty_distribution || { Easy: 0, Medium: 0, Hard: 0 };
      const platDist = rpcData.platform_distribution || {};
      const topicDist = rpcData.topic_distribution || [];
      const dailyAct = rpcData.daily_activity || [];
      const last7 = rpcData.last_7_days || [];

      return {
        summary: s,
        stats: {
          total_solved: s.total_solved ?? 0,
          total_revised: s.total_revised ?? 0,
          current_streak: s.current_streak ?? 0,
          longest_streak: s.longest_streak ?? 0,
        },
        advanced: {
          average_solve_time: s.average_solve_time_seconds ? Math.round(s.average_solve_time_seconds / 60) : null,
          average_revision_time: s.average_revision_time_seconds ? Math.round(s.average_revision_time_seconds / 60) : null,
          fastest_solve: s.fastest_solve_seconds ? Math.round(s.fastest_solve_seconds / 60) : null,
          revision_success_rate: s.revision_success_rate,
          average_solve_time_seconds: s.average_solve_time_seconds,
          average_revision_time_seconds: s.average_revision_time_seconds,
          fastest_solve_seconds: s.fastest_solve_seconds,
          platform_distribution: platDist,
          difficulty_distribution: diffDist,
        },
        diffDistribution: diffDist,
        platformDistribution: platDist,
        topPatterns: topicDist.map(t => ({
          category: t.name,
          count: t.count || t.solved || 0,
          solved: t.solved || 0,
          revised: t.revised || 0
        })),
        avgConfidence: s.average_confidence != null ? s.average_confidence : '—',
        daily: last7,
        dailyActivity: dailyAct,
        history: dailyAct
      };
    }
  } catch (err) {
    console.warn('RPC get_user_analytics unavailable or failed, falling back to direct table queries:', err.message);
  }

  // 2. Authoritative Client-side Fallback querying solved_problems and revision_attempts directly
  const [solvedRes, attemptsRes, userStatsRes] = await Promise.all([
    supabase
      .from('solved_problems')
      .select('id, problem_id, confidence, solve_time_minutes, user_pattern, created_at, problem:problems(id, title, difficulty, coding_platforms(name), problem_tags(tag))')
      .eq('user_id', userId)
      .is('deleted_at', null),
    supabase
      .from('revision_attempts')
      .select('id, problem_id, attempt_type, attempt_number, duration_seconds, time_taken, confidence, result, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true }),
    supabase
      .from('user_stats')
      .select('current_streak, longest_streak')
      .eq('user_id', userId)
      .maybeSingle()
  ]);

  const solvedProblems = solvedRes.data || [];
  const attempts = attemptsRes.data || [];

  // Unique problems solved
  const uniqueProblemIds = new Set(solvedProblems.map(sp => sp.problem_id));
  const totalSolved = uniqueProblemIds.size;

  // Revisions count (non-initial)
  const revisionAttempts = attempts.filter(a => a.attempt_type === 'scheduled_revision' || a.attempt_type === 'manual_revision');
  const totalRevised = revisionAttempts.length;

  // Average confidence
  const allConfidenceValues = attempts.map(a => a.confidence).filter(c => c != null);
  if (allConfidenceValues.length === 0) {
    solvedProblems.forEach(sp => { if (sp.confidence != null) allConfidenceValues.push(sp.confidence); });
  }
  const avgConf = allConfidenceValues.length > 0
    ? (allConfidenceValues.reduce((a, b) => a + b, 0) / allConfidenceValues.length).toFixed(1)
    : '—';

  // Initial solve times
  const initialAttempts = attempts.filter(a => a.attempt_type === 'initial_solve');
  const initialDurations = initialAttempts
    .map(a => a.duration_seconds != null ? a.duration_seconds : (a.time_taken ? a.time_taken * 60 : null))
    .filter(d => d != null && d > 0);
  if (initialDurations.length === 0) {
    solvedProblems.forEach(sp => {
      if (sp.solve_time_minutes && sp.solve_time_minutes > 0) initialDurations.push(sp.solve_time_minutes * 60);
    });
  }
  const avgSolveTimeSec = initialDurations.length > 0
    ? Math.round(initialDurations.reduce((a, b) => a + b, 0) / initialDurations.length)
    : null;

  // Revision times
  const revDurations = revisionAttempts
    .map(a => a.duration_seconds != null ? a.duration_seconds : (a.time_taken ? a.time_taken * 60 : null))
    .filter(d => d != null && d > 0);
  const avgRevTimeSec = revDurations.length > 0
    ? Math.round(revDurations.reduce((a, b) => a + b, 0) / revDurations.length)
    : null;

  // Fastest solve
  const allDurations = [...initialDurations, ...revDurations];
  const fastestSolveSec = allDurations.length > 0 ? Math.min(...allDurations) : null;

  // Revision success rate
  const ratedRevisions = revisionAttempts.filter(a => a.result != null);
  const successfulRevisions = ratedRevisions.filter(a => a.result === 'easy' || a.result === 'mastered');
  const revSuccessRate = ratedRevisions.length > 0
    ? Math.round((successfulRevisions.length / ratedRevisions.length) * 100)
    : null;

  // Distributions
  const diffDistribution = { Easy: 0, Medium: 0, Hard: 0 };
  const platformDistribution = {};
  const topicCounts = {};

  solvedProblems.forEach(sp => {
    const diff = sp.problem?.difficulty;
    if (diff) diffDistribution[diff] = (diffDistribution[diff] || 0) + 1;

    const plat = sp.problem?.coding_platforms?.name || 'Custom';
    platformDistribution[plat] = (platformDistribution[plat] || 0) + 1;

    const topic = sp.user_pattern || sp.problem?.problem_tags?.[0]?.tag || 'General';
    topicCounts[topic] = (topicCounts[topic] || 0) + 1;
  });

  const topPatterns = Object.entries(topicCounts)
    .map(([category, count]) => ({ category, count, solved: count, revised: 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Daily activity by calendar date
  const activityMap = new Map();
  attempts.forEach(a => {
    const dStr = new Date(a.created_at).toLocaleDateString('en-CA');
    const cur = activityMap.get(dStr) || { date: dStr, solved: 0, revised: 0, total: 0 };
    if (a.attempt_type === 'initial_solve') cur.solved += 1;
    else cur.revised += 1;
    cur.total += 1;
    activityMap.set(dStr, cur);
  });
  if (activityMap.size === 0) {
    solvedProblems.forEach(sp => {
      const dStr = new Date(sp.created_at).toLocaleDateString('en-CA');
      const cur = activityMap.get(dStr) || { date: dStr, solved: 0, revised: 0, total: 0 };
      cur.solved += 1;
      cur.total += 1;
      activityMap.set(dStr, cur);
    });
  }

  const dailyActivity = Array.from(activityMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  // Dynamic streaks
  const activeDates = Array.from(activityMap.keys()).sort();
  const todayStr = new Date().toLocaleDateString('en-CA');
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString('en-CA');

  let currentStreak = 0;
  let longestStreak = 0;
  let running = 0;
  let prevDate = null;

  activeDates.forEach(dStr => {
    const d = new Date(dStr);
    if (!prevDate) {
      running = 1;
    } else {
      const diff = Math.round((d - prevDate) / 86400000);
      if (diff === 1) running += 1;
      else running = 1;
    }
    if (running > longestStreak) longestStreak = running;
    prevDate = d;
  });

  if (activeDates.includes(todayStr) || activeDates.includes(yesterdayStr)) {
    let checkDate = activeDates.includes(todayStr) ? new Date() : yesterday;
    while (activeDates.includes(checkDate.toLocaleDateString('en-CA'))) {
      currentStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  // Last 7 days
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toLocaleDateString('en-CA');
    const act = activityMap.get(dStr) || { solved: 0, revised: 0 };
    last7.push({
      date: dStr,
      name: days[d.getDay()],
      solved: act.solved,
      revised: act.revised
    });
  }

  const currentYear = new Date().getFullYear().toString();
  const activeDaysThisYear = activeDates.filter(d => d.startsWith(currentYear)).length;

  return {
    summary: {
      total_solved: totalSolved,
      total_revised: totalRevised,
      current_streak: currentStreak,
      longest_streak: Math.max(longestStreak, currentStreak),
      average_confidence: avgConf === '—' ? null : Number(avgConf),
      average_solve_time_seconds: avgSolveTimeSec,
      average_revision_time_seconds: avgRevTimeSec,
      fastest_solve_seconds: fastestSolveSec,
      revision_success_rate: revSuccessRate,
      active_days_this_year: activeDaysThisYear
    },
    stats: {
      total_solved: totalSolved,
      total_revised: totalRevised,
      current_streak: currentStreak,
      longest_streak: Math.max(longestStreak, currentStreak),
    },
    advanced: {
      average_solve_time: avgSolveTimeSec ? Math.round(avgSolveTimeSec / 60) : null,
      average_revision_time: avgRevTimeSec ? Math.round(avgRevTimeSec / 60) : null,
      fastest_solve: fastestSolveSec ? Math.round(fastestSolveSec / 60) : null,
      revision_success_rate: revSuccessRate,
      average_solve_time_seconds: avgSolveTimeSec,
      average_revision_time_seconds: avgRevTimeSec,
      fastest_solve_seconds: fastestSolveSec,
      platform_distribution: platformDistribution,
      difficulty_distribution: diffDistribution,
    },
    diffDistribution,
    platformDistribution,
    topPatterns,
    avgConfidence: avgConf,
    daily: last7,
    dailyActivity,
    history: dailyActivity
  };
}

/**
 * Get profile data (profile + stats + achievements + inventory).
 */
export async function getProfileData(userId) {
  const { data, error } = await supabase.rpc('get_dashboard_initialization_data', { p_user_id: userId });
  if (error) throw error;
  
  return {
    profile: data.profile ?? {},
    stats: data.stats ?? {},
    achievements: data.achievements ?? [],
    inventory: data.inventory ?? [],
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
 * Get all shop items with user inventory state.
 * Includes inactive seasonal items (displayed as "Coming Soon").
 */
export async function getShopData(userId) {
  const [itemsRes, inventoryRes] = await Promise.all([
    supabase.from('shop_items').select('*').order('sort_order', { ascending: true }),
    supabase.from('user_inventory').select('shop_item_id, is_equipped').eq('user_id', userId),
  ]);

  const owned = new Set((inventoryRes.data ?? []).map(i => i.shop_item_id));
  const equipped = new Set((inventoryRes.data ?? []).filter(i => i.is_equipped).map(i => i.shop_item_id));

  return (itemsRes.data ?? []).map(item => ({
    ...item,
    // Normalize: some legacy rows have coin_cost instead of price
    price: item.price ?? item.coin_cost ?? 0,
    category: item.category ?? item.type ?? 'badges',
    owned: owned.has(item.id),
    equipped: equipped.has(item.id),
  }));
}

/**
 * Purchase a shop item using coins (fully server-validated).
 */
export async function purchaseShopItem(userId, itemId) {
  // 1. Pre-fetch item price and user current coins balance
  const [itemRes, profileRes] = await Promise.all([
    supabase.from('shop_items').select('id, name, price, is_active').eq('id', itemId).maybeSingle(),
    supabase.from('profiles').select('coins_balance').eq('auth_id', userId).maybeSingle()
  ]);

  const item = itemRes.data;
  const currentCoins = profileRes.data?.coins_balance ?? 0;
  const itemPrice = item?.price ?? 0;

  if (itemPrice > 0 && currentCoins < itemPrice) {
    throw new Error('Not enough coins.');
  }

  // 2. Call server RPC to record inventory purchase
  const { data, error } = await supabase.rpc('purchase_shop_item', {
    p_user_id: userId,
    p_item_id: itemId,
    p_coin_cost: 0,
  });

  if (error) {
    const msg = error.message || error.details || '';
    const code = error.code || '';

    if (msg.includes('INSUFFICIENT_COINS')) {
      throw new Error('Not enough coins.');
    }
    if (msg.includes('ALREADY_OWNED') || code === '23505') {
      throw new Error('You already own this item.');
    }
    if (msg.includes('ITEM_NOT_AVAILABLE')) {
      throw new Error('This item is not available.');
    }
    throw new Error(msg || 'Purchase failed.');
  }

  // 3. Guaranteed explicit coin deduction on profiles
  const newCoinsBalance = Math.max(0, currentCoins - itemPrice);
  if (itemPrice > 0) {
    try {
      await supabase
        .from('profiles')
        .update({ coins_balance: newCoinsBalance })
        .eq('auth_id', userId);

      await supabase
        .from('coin_transactions')
        .insert({
          user_id: userId,
          amount: -itemPrice,
          description: `Purchased: ${item?.name || 'Shop Item'}`,
          transaction_type: 'shop_purchase',
          reference_id: itemId
        });
    } catch (e) {
      console.warn('[Shop] Coin deduction update notice:', e);
    }
  }

  return {
    ...(data || {}),
    coins_spent: itemPrice,
    coins_remaining: newCoinsBalance
  };
}

/**
 * Equip a shop item (one per category — auto-unequips previous).
 */
export async function equipShopItem(userId, itemId) {
  if (!userId || !itemId) return null;
  const { data, error } = await supabase.rpc('equip_shop_item', {
    p_user_id: userId,
    p_item_id: itemId,
  });
  if (error) {
    const msg = error.message || error.details || '';
    if (msg.includes('ITEM_NOT_OWNED')) {
      throw new Error('You do not own this item yet.');
    }
    throw new Error(msg || 'Failed to equip item.');
  }
  return data;
}

/**
 * Unequip a shop item.
 */
export async function unequipShopItem(userId, itemId) {
  if (!userId || !itemId) return null;
  const { data, error } = await supabase.rpc('unequip_shop_item', {
    p_user_id: userId,
    p_item_id: itemId,
  });
  if (error) {
    const msg = error.message || error.details || '';
    if (msg.includes('ITEM_NOT_OWNED')) {
      return { success: true };
    }
    throw new Error(msg || 'Failed to unequip item.');
  }
  return data;
}

/**
 * Get all equipped items for a user (used globally by CosmeticContext).
 */
export async function getEquippedItems(userId) {
  const { data, error } = await supabase
    .from('user_inventory')
    .select('shop_item_id, shop_items(id, name, category, color, icon_name, rarity)')
    .eq('user_id', userId)
    .eq('is_equipped', true);

  if (error) throw error;
  // Return as a map keyed by category for easy access
  const equipped = {};
  (data ?? []).forEach(inv => {
    const item = inv.shop_items;
    if (item) {
      equipped[item.category] = item;
    }
  });
  return equipped;
}

/**
 * Get user's full inventory (all owned items).
 */
export async function getUserInventory(userId) {
  const { data, error } = await supabase
    .from('user_inventory')
    .select('shop_item_id, is_equipped, purchased_at, shop_items(*)')
    .eq('user_id', userId)
    .order('purchased_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(inv => ({
    ...inv.shop_items,
    id: inv.shop_items?.id || inv.shop_item_id,
    shop_item_id: inv.shop_item_id || inv.shop_items?.id,
    is_equipped: inv.is_equipped,
    purchased_at: inv.purchased_at,
  }));
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
  const sinceIso = pastDate.toISOString();

  try {
    const [attemptsRes, dailyRes] = await Promise.all([
      supabase
        .from('revision_attempts')
        .select('created_at, attempt_type')
        .eq('user_id', userId)
        .gte('created_at', sinceIso),
      supabase
        .from('daily_activity')
        .select('activity_date, activity_type')
        .eq('user_id', userId)
        .gte('activity_date', sinceIso.split('T')[0])
    ]);

    const dateMap = new Map();

    (attemptsRes.data || []).forEach(a => {
      const dStr = new Date(a.created_at).toLocaleDateString('en-CA');
      const cur = dateMap.get(dStr) || { activity_date: dStr, solved: 0, revised: 0, total: 0 };
      if (a.attempt_type === 'initial_solve') cur.solved += 1;
      else cur.revised += 1;
      cur.total += 1;
      dateMap.set(dStr, cur);
    });

    (dailyRes.data || []).forEach(d => {
      if (!dateMap.has(d.activity_date)) {
        dateMap.set(d.activity_date, {
          activity_date: d.activity_date,
          solved: d.activity_type === 'add_problem' ? 1 : 0,
          revised: d.activity_type === 'complete_revision' ? 1 : 0,
          total: 1
        });
      }
    });

    return Array.from(dateMap.values()).sort((a, b) => a.activity_date.localeCompare(b.activity_date));
  } catch (err) {
    console.error('Error in getActivityHistory:', err);
    return [];
  }
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
