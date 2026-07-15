import { supabase } from './supabaseClient';
import { getAnalyticsData, sendEmailEvent } from './dataService';

/**
 * eventOrchestrator.js
 * 
 * Centralized Event-Driven Pipeline for Revoraa.
 * Every user action runs through this orchestrator to update all dependent features.
 */

// --------------------------------------------------------
// 1. Core Event: Problem Added
// --------------------------------------------------------
export async function onProblemAdded(userId, solvedProblemId, solveMethod, xpEarned) {
  try {
    console.log('[Event] onProblemAdded triggered', { userId, solvedProblemId, solveMethod, xpEarned });

    // Step 1. Award XP and handle Level Up & Coins
    await handleXpAndLevelUp(userId, xpEarned);

    // Step 2. Generate Mistake Analytics
    // Step 3. Generate Pattern Analytics
    await updateAnalyticsCache(userId);

    // Step 3.5. Update Streak
    await handleStreak(userId, 'add_problem');

    // Step 4. Update Daily Missions
    await incrementDailyMission(userId, 'add_problem');

    // Step 5. Check Achievements
    await checkAchievements(userId, 'problem_added');

    // Step 6. Roadmap Progress and Notifications
    const { data: sp } = await supabase.from('solved_problems').select('user_pattern').eq('id', solvedProblemId).single();
    if (sp?.user_pattern) {
      const { data: topic } = await supabase.from('roadmap_topics').select('id, name, target_problem_count, phase_id, roadmap_phases(title)').ilike('name', sp.user_pattern).single();
      if (topic) {
        const { data: prog } = await supabase.from('user_roadmap_progress').select('solved_count').eq('user_id', userId).eq('topic_id', topic.id).single();
        if (prog) {
          if (prog.solved_count === topic.target_problem_count) {
            await onRoadmapTopicCompleted(userId, topic.name);
          } else if (prog.solved_count < topic.target_problem_count) {
            await notify(userId, `🎯 ${topic.name} Progress`, `${prog.solved_count} / ${topic.target_problem_count} Completed`, 'system');
          }
          
          // Check if the phase was just unlocked (first problem of the phase solved)
          // We can check if `prog.solved_count === 1` and if this is the ONLY progress in the phase so far.
          // The DB trigger handles unlocking. Let's fetch the phase to see if it was recently unlocked.
          if (topic.phase_id) {
            const { data: phaseProg } = await supabase.from('user_roadmap_phases').select('unlocked_at').eq('user_id', userId).eq('phase_id', topic.phase_id).single();
            if (phaseProg && phaseProg.unlocked_at) {
              const unlockTime = new Date(phaseProg.unlocked_at).getTime();
              const now = new Date().getTime();
              if (now - unlockTime < 60000) { // Unlocked in the last 60 seconds
                // It was just unlocked!
                await notify(userId, '🔓 Phase Unlocked!', `You have unlocked Phase ${topic.roadmap_phases?.title}!`, 'achievement');
              }
            }
          }
        }
      }
    }

    // Step 7. Create General Notification
    await notify(userId, 'Problem Logged', 'You earned ' + xpEarned + ' XP for solving a problem!', 'system');

  } catch (error) {
    console.error('[Event Error] onProblemAdded failed:', error);
  }
}

// --------------------------------------------------------
// 2. Core Event: Revision Completed
// --------------------------------------------------------
export async function onRevisionCompleted(userId, solvedProblemId, confidence) {
  try {
    console.log('[Event] onRevisionCompleted triggered', { userId, solvedProblemId, confidence });
    
    // Step 1. Award XP (flat 10 XP for revision)
    await handleXpAndLevelUp(userId, 10);

    // Step 1.5. Update Streak
    await handleStreak(userId, 'complete_revision');

    // Step 2. Update Daily Missions
    await incrementDailyMission(userId, 'complete_revision');

    // Step 3. Check Achievements
    await checkAchievements(userId, 'revision_completed');

    // Step 4. Create Notification
    await notify(userId, 'Revision Complete', 'Great job! +10 XP', 'system');

  } catch (error) {
    console.error('[Event Error] onRevisionCompleted failed:', error);
  }
}

// --------------------------------------------------------
// 2.5 Core Event: Manual Revision Completed
// --------------------------------------------------------
export async function onManualRevisionCompleted(userId, problemId, result, confidence, solveTime) {
  try {
    console.log('[Event] onManualRevisionCompleted triggered', { userId, problemId, result, confidence });
    
    // Log the manual revision attempt
    await supabase.from('revision_attempts').insert({
      user_id: userId,
      problem_id: problemId,
      attempt_type: 'manual_revision',
      time_taken: solveTime,
      confidence,
      result: result === 'easy' ? 'mastered' : result
    });

    // Step 1. Award XP (flat 5 XP for manual revision to prevent farming)
    await handleXpAndLevelUp(userId, 5);

    // Step 1.5. Update Streak
    await handleStreak(userId, 'complete_revision');

    // Step 2. Update Daily Missions
    await incrementDailyMission(userId, 'complete_revision');

    // Step 4. Create Notification
    await notify(userId, 'Manual Practice Logged', 'Great practice! +5 XP', 'system');

  } catch (error) {
    console.error('[Event Error] onManualRevisionCompleted failed:', error);
  }
}

// --------------------------------------------------------
// 3. Core Event: Daily Mission Claimed
// --------------------------------------------------------
export async function onMissionClaimed(userId, xp, coins, missionTitle) {
  try {
    console.log('[Event] onMissionClaimed triggered', { userId, xp, coins, missionTitle });
    
    // Mission grants specific XP and coins. The RPC handles XP and level up.
    // If we want to grant extra coins, we might need a separate RPC or pass coins to `add_user_xp` if it supports it.
    // For now, let's just use `handleXpAndLevelUp` for XP, and add an RPC for coins or update it directly.
    const { data: stats } = await supabase.from('user_stats').select('xp').eq('user_id', userId).single();
    if (coins > 0) {
      await supabase.from('coin_transactions').insert({
        user_id: userId,
        amount: coins,
        description: `Mission: ${missionTitle}`,
        transaction_type: 'mission_reward'
      });
    }

    await handleXpAndLevelUp(userId, xp);
    
    await handleStreak(userId, 'mission_claimed');
    
    await notify(userId, 'Mission Complete', `You earned ${xp} XP and ${coins} coins from: ${missionTitle}`, 'system');
  } catch (error) {
    console.error('[Event Error] onMissionClaimed failed:', error);
  }
}

// --------------------------------------------------------
// 4. Core Event: Roadmap Topic Completed
// --------------------------------------------------------
export async function onRoadmapTopicCompleted(userId, topicName) {
  try {
    console.log('[Event] onRoadmapTopicCompleted triggered', { userId, topicName });
    await handleXpAndLevelUp(userId, 200); // Big reward for completing a roadmap phase
    await notify(userId, 'Phase Mastered!', `You mastered ${topicName}! +200 XP`, 'achievement');
    await checkAchievements(userId, 'roadmap_completed');
  } catch (error) {
    console.error('[Event Error] onRoadmapTopicCompleted failed:', error);
  }
}

// --------------------------------------------------------
// Helpers
// --------------------------------------------------------

async function handleXpAndLevelUp(userId, xpToAdd) {
  // Add XP via existing RPC (handles XP + basic level up logic + coins + notification)
  try {
    const { data: leveledUp, error } = await supabase.rpc('add_user_xp', { p_user_id: userId, p_xp: xpToAdd });
    if (error) console.error('[Event] add_user_xp RPC error:', error);
    
    if (leveledUp) {
      console.log('[Event] Level Up Detected by DB!');
      // Re-fetch level to send exact number to UI
      const { data: stats } = await supabase.from('user_stats').select('level').eq('user_id', userId).single();
      const level = stats?.level || 1;
      
      // Dispatch Global DOM Event for UI celebrations
      window.dispatchEvent(new CustomEvent('LEVEL_UP', { 
        detail: { level, coins: 100 } 
      }));
    }
  } catch (err) {
    console.error('[Event Error] Failed adding XP:', err);
  }
}

async function handleStreak(userId, activityType) {
  try {
    await supabase.rpc('log_user_activity', { p_user_id: userId, p_activity_type: activityType });
  } catch (err) {
    console.error('[Event Error] Failed handling streak:', err);
  }
}

async function updateAnalyticsCache(userId) {
  // In a realtime architecture, analytics might just be calculated on read,
  // but if we need a denormalized cache, we do it here.
  // For now, Supabase triggers or live views handle this, so we just log.
  console.log('[Event] Analytics dependencies flagged for refresh.');
}

async function incrementDailyMission(userId, actionType) {
  // Here we can log progress into an analytics or daily missions table.
  // For Revoraa, we use `analytics_daily` for tracking solved/revised counts.
  if (actionType === 'add_problem') {
    await supabase.rpc('upsert_daily_analytics', { p_user_id: userId, p_solved: 1 });
  } else if (actionType === 'complete_revision') {
    await supabase.rpc('upsert_daily_analytics', { p_user_id: userId, p_revised: 1 });
  }
}

async function checkAchievements(userId, eventType) {
  // Get user's current achievements
  const { data: userAchvs } = await supabase.from('user_achievements').select('achievement_id').eq('user_id', userId);
  const unlockedIds = new Set((userAchvs || []).map(a => a.achievement_id));

  // Get current user stats
  const { data: stats } = await supabase.from('user_stats').select('xp, total_solved, total_revised, current_streak').eq('user_id', userId).single();
  if (!stats) return;

  // Fetch all achievements
  const { data: allAchvs } = await supabase.from('achievements').select('*');

  // Dynamically evaluate conditions based on category and threshold
  for (const achv of allAchvs || []) {
    if (unlockedIds.has(achv.id)) continue; // Already unlocked

    let shouldUnlock = false;

    // Evaluate based on category
    if (achv.category === 'problems' && stats.total_solved >= achv.threshold) shouldUnlock = true;
    if (achv.category === 'streak' && stats.current_streak >= achv.threshold) shouldUnlock = true;
    if (achv.category === 'revision' && stats.total_revised >= achv.threshold) shouldUnlock = true;
    if (achv.category === 'xp' && stats.xp >= achv.threshold) shouldUnlock = true;

    if (shouldUnlock) {
      await unlockAchievement(userId, achv);
    }
  }
}

async function unlockAchievement(userId, achievement) {
  console.log('[Event] Unlocking achievement:', achievement.title);
  
  // 1. Insert into user_achievements (prevent duplicates via unique constraint on DB)
  const { error } = await supabase.from('user_achievements').insert({ user_id: userId, achievement_id: achievement.id });
  if (error) {
    if (error.code === '23505') return; // Already exists (Unique violation), skip
    console.error('[Event] Failed to unlock achievement:', error);
    return;
  }

  // 2. Add Reward (XP + Coins)
  if (achievement.xp_reward > 0 || achievement.coins_reward > 0) {
    const { data: stats } = await supabase.from('user_stats').select('xp').eq('user_id', userId).single();
    if (stats && achievement.xp_reward > 0) {
      await supabase.from('user_stats').update({
        xp: stats.xp + achievement.xp_reward
      }).eq('user_id', userId);
    }
    if (achievement.coins_reward > 0) {
      await supabase.from('coin_transactions').insert({
        user_id: userId,
        amount: achievement.coins_reward,
        description: `Achievement: ${achievement.title}`,
        transaction_type: 'achievement_reward'
      });
    }
  }

  // 3. Trigger Email (Background)
  sendEmailEvent('achievement_unlock', {
    achievement: achievement.title,
    xp: achievement.xp_reward,
    coins: achievement.coins_reward
  }, null).catch(err => console.error('[Event] Error sending achievement email:', err));
  
  // 4. Create Notification
  await notify(userId, `🏆 Achievement Unlocked!`, `You earned ${achievement.title}${achievement.xp_reward ? ` (+${achievement.xp_reward} XP)` : ''}`, 'achievement');

  // 5. Dispatch Global DOM Event for UI toast
  window.dispatchEvent(new CustomEvent('ACHIEVEMENT_UNLOCKED', { 
    detail: achievement 
  }));
}

export async function notify(userId, title, body, type = 'system') {
  await supabase.from('notifications').insert({ user_id: userId, title, body, type });
}
