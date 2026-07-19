/**
 * Problems Service
 *
 * Implements Hybrid Metadata Fetching:
 *   1. Check local Supabase problems table
 *   2. If missing, fetch from LeetCode GraphQL via Edge Function
 *   3. Store permanently
 *   4. Return metadata
 */

import { supabase } from './supabaseClient';
import { getInitialRevisionDate, calculateNextRevision } from './revisionEngine';
import { onProblemAdded, onRevisionCompleted } from './eventOrchestrator';

const LEETCODE_PLATFORM_SLUG = 'leetcode';

// Map LeetCode tags to our Roadmap Topics
const TAG_TO_TOPIC_MAP = {
  'array': 'Arrays',
  'string': 'Strings',
  'hash-table': 'Hashing',
  'two-pointers': 'Two Pointers',
  'sliding-window': 'Sliding Window',
  'prefix-sum': 'Prefix Sum',
  'binary-search': 'Binary Search',
  'linked-list': 'Linked List',
  'stack': 'Stack',
  'queue': 'Queue',
  'heap-priority-queue': 'Heap',
  'tree': 'Tree',
  'binary-tree': 'Binary Tree',
  'binary-search-tree': 'BST',
  'trie': 'Trie',
  'graph': 'Graph',
  'depth-first-search': 'DFS',
  'breadth-first-search': 'BFS',
  'topological-sort': 'Topological Sort',
  'union-find': 'Union Find',
  'backtracking': 'Backtracking',
  'recursion': 'Recursion',
  'greedy': 'Greedy',
  'dynamic-programming': 'Dynamic Programming',
  'bit-manipulation': 'Bit Manipulation',
  'math': 'Math',
  'intervals': 'Intervals',
  'matrix': 'Matrix',
  'design': 'Design'
};

export function detectPatternFromTags(tags = []) {
  for (const t of tags) {
    const lower = typeof t === 'string' ? t.toLowerCase() : t.tag?.toLowerCase();
    if (!lower) continue;
    if (TAG_TO_TOPIC_MAP[lower]) return TAG_TO_TOPIC_MAP[lower];
  }
  return null;
}

/** Normalize a LeetCode URL or slug or number into a slug. */
export function normalizeLeetCodeInput(input) {
  const str = input.trim();

  // Full URL: https://leetcode.com/problems/two-sum/
  const urlMatch = str.match(/leetcode\.com\/problems\/([a-z0-9-]+)/i);
  if (urlMatch) return urlMatch[1];

  // Pure number → we'll search by external_problem_id
  if (/^\d+$/.test(str)) return null; // signal to search by number

  // Already a slug
  return str.toLowerCase().replace(/\s+/g, '-');
}

/** Get the LeetCode platform ID from Supabase */
async function getLeetCodePlatformId() {
  const { data } = await supabase
    .from('coding_platforms')
    .select('id')
    .eq('slug', LEETCODE_PLATFORM_SLUG)
    .single();
  return data?.id ?? null;
}

/** Search DB by slug */
async function findProblemBySlug(slug, platformId) {
  const { data } = await supabase
    .from('problems')
    .select(`*, problem_tags(tag), problem_companies(company:companies(name), frequency)`)
    .eq('platform_id', platformId)
    .eq('slug', slug)
    .maybeSingle();
  return data;
}

/** Search DB by external_problem_id (number) */
async function findProblemByNumber(number, platformId) {
  const { data } = await supabase
    .from('problems')
    .select(`*, problem_tags(tag), problem_companies(company:companies(name), frequency)`)
    .eq('platform_id', platformId)
    .eq('external_problem_id', String(number))
    .maybeSingle();
  return data;
}

/**
 * Hybrid fetch: DB first, then LeetCode GraphQL via Edge Function.
 * @param {string} input - URL, slug, or problem number
 * @returns {Promise<Object|null>} problem metadata
 */
export async function fetchProblemMetadata(input) {
  const platformId = await getLeetCodePlatformId();
  if (!platformId) throw new Error('LeetCode platform not found in database.');

  const isNumber = /^\d+$/.test(input.trim());
  const slug = isNumber ? null : normalizeLeetCodeInput(input);

  // 1. Check DB first
  let problem = isNumber
    ? await findProblemByNumber(input.trim(), platformId)
    : slug ? await findProblemBySlug(slug, platformId) : null;

  if (problem) return problem;

  // 2. Cache miss — fetch from LeetCode via Edge Function
  const { data: fetched, error } = await supabase.functions.invoke('fetch-leetcode', {
    body: { input: input.trim() },
  });

  if (error) throw new Error(`Failed to fetch from LeetCode: ${error.message}`);
  if (!fetched?.problem) throw new Error(fetched?.error?.message || 'Problem not found on LeetCode.');

  // 3. Re-fetch from DB after edge function stores it
  problem = fetched.problem.slug
    ? await findProblemBySlug(fetched.problem.slug, platformId)
    : null;

  return problem;
}

/**
 * Save a solved problem for the current user.
 * @param {Object} params
 */
export async function upsertProblem(problemData) {
  const { data: platform } = await supabase
    .from('coding_platforms')
    .select('id')
    .eq('slug', problemData.platform || 'custom')
    .single();

  const platformId = platform?.id;

  const { data, error } = await supabase
    .from('problems')
    .upsert({
      title: problemData.title || 'Manual Entry',
      slug: problemData.slug || problemData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `manual-${Date.now()}`,
      difficulty: problemData.difficulty || 'Medium',
      url: problemData.url || '',
      external_problem_id: problemData.externalId || '',
      platform_id: platformId,
    }, { onConflict: 'platform_id,slug' })  // Matches the actual unique constraint: unique(platform_id, slug)
    .select()
    .single();

  if (error) throw error;

  // Insert tags if provided
  if (problemData.tags && problemData.tags.length > 0) {
    const tagsToInsert = problemData.tags.map(t => ({ problem_id: data.id, tag: t }));
    await supabase.from('problem_tags').upsert(tagsToInsert, { onConflict: 'problem_id,tag' });
  }

  // Insert companies if provided
  if (problemData.companies && problemData.companies.length > 0) {
    // We must first ensure companies exist in the companies table, then link them
    for (const cName of problemData.companies) {
      const { data: comp } = await supabase
        .from('companies')
        .upsert({ name: cName }, { onConflict: 'name' })
        .select()
        .single();
      
      if (comp) {
        await supabase
          .from('problem_companies')
          .upsert({ problem_id: data.id, company_id: comp.id }, { onConflict: 'problem_id,company_id' });
      }
    }
  }

  return data;
}

export async function saveSolvedProblem({ problemData, problemId, solveTimeMinutes, solvedUsing, confidence, notes, mistakes, userPattern, userId }) {
  let finalProblemId = problemId;

  // If no problemId but problemData is provided, upsert it first
  // This only affects the global problems cache — NOT user-specific data
  if (!finalProblemId && problemData) {
    const p = await upsertProblem(problemData);
    finalProblemId = p.id;
  }

  // 1. USER-SCOPED DUPLICATE CHECK: Check only within this user's own library
  //    This is intentionally scoped to (user_id + problem_id) so different users
  //    can independently add the same problem without conflict.
  const { data: existing } = await supabase
    .from('solved_problems')
    .select('id, deleted_at')
    .eq('user_id', userId)
    .eq('problem_id', finalProblemId)
    .maybeSingle();

  if (existing && !existing.deleted_at) {
    // This specific user already has this problem in their library
    throw new Error('USER_ALREADY_HAS_PROBLEM');
  }

  // 2. Insert (or restore if soft-deleted) the solved_problems row
  const { data: solved, error: solveErr } = await supabase
    .from('solved_problems')
    .upsert({
      user_id: userId,
      problem_id: finalProblemId,
      solve_time_minutes: solveTimeMinutes,
      solved_using: solvedUsing,
      confidence,
      notes,
      mistakes,
      user_pattern: userPattern,
      status: 'revising',
      first_solved_at: new Date().toISOString(),
      deleted_at: null,  // Restore if previously soft-deleted
    }, { onConflict: 'user_id,problem_id', ignoreDuplicates: false })
    .select()
    .single();

  if (solveErr) throw solveErr;

  // 3. Schedule first revision — insert; non-fatal if it fails (e.g., edge case re-adds)
  const { error: revErr } = await supabase
    .from('revision_schedule')
    .insert({
      user_id: userId,
      solved_problem_id: solved.id,
      revision_number: 0,
      next_revision_date: getInitialRevisionDate(),
      interval_days: 1,
      ease_factor: 2.5,
    });

  if (revErr) console.error('Revision schedule insert error (non-fatal):', revErr.message);

  // 4. Update user stats
  await supabase.rpc('increment_user_stat', { p_user_id: userId, p_column: 'total_solved', p_amount: 1 });

  // 5. Trigger the centralized Event Orchestrator
  const xpEarned = solvedUsing === 'myself' ? 50 : solvedUsing === 'hint' ? 30 : 15;
  // Fire and forget (don't block the UI return)
  onProblemAdded(userId, solved.id, solvedUsing, xpEarned).catch(err => console.error('Orchestrator Error:', err));

  return solved;
}

/**
 * Get all solved problems for the current user with metadata.
 */
export async function getUserProblems(userId, { query = '', difficulty = 'All', sortKey = 'first_solved_at', sortDir = 'desc' } = {}) {
  let q = supabase
    .from('solved_problems')
    .select(`
      id, status, confidence, solve_time_minutes, first_solved_at, last_revised_at, notes, mistakes, user_pattern,
      revision_count, average_time, best_time,
      problem:problems(id, title, slug, difficulty, url, external_problem_id,
        coding_platforms(name),
        problem_tags(tag),
        problem_companies(company:companies(name))
      ),
      revision_schedule(next_revision_date, revision_number, is_completed)
    `)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order(sortKey, { ascending: sortDir === 'asc' });

  if (difficulty !== 'All') {
    q = q.eq('problem.difficulty', difficulty);
  }

  const { data, error } = await q;
  if (error) throw error;

  // Client-side text filter (Supabase doesn't support joined column filtering in one query)
  if (query.trim()) {
    const lower = query.toLowerCase();
    return (data ?? []).filter(row =>
      row.problem?.title?.toLowerCase().includes(lower) ||
      row.problem?.slug?.toLowerCase().includes(lower) ||
      String(row.problem?.external_problem_id).includes(lower)
    );
  }

  return data ?? [];
}

/**
 * Get revisions due today or overdue for a user.
 */
export async function getTodayRevisions(userId) {
  const localDate = new Date();
  const yyyy = localDate.getFullYear();
  const mm = String(localDate.getMonth() + 1).padStart(2, '0');
  const dd = String(localDate.getDate()).padStart(2, '0');
  const today = `${yyyy}-${mm}-${dd}`;

  const { data, error } = await supabase
    .from('revision_schedule')
    .select(`
      id, revision_number, next_revision_date, interval_days, ease_factor,
      solved_problem:solved_problems!inner(
        id, confidence, notes, status, user_pattern,
        problem:problems(id, title, slug, difficulty, url, external_problem_id, problem_tags(tag), problem_companies(company:companies(name)), coding_platforms(name))
      )
    `)
    .eq('user_id', userId)
    .eq('is_completed', false)
    .lte('next_revision_date', today)
    .in('solved_problem.status', ['solving', 'revising'])
    .order('next_revision_date', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/**
 * Submit a revision result and reschedule.
 */
export async function submitRevision({ userId, scheduleId, solvedProblemId, result, confidence, solveTime, currentRevisionNumber, currentEaseFactor, currentIntervalDays }) {
  const next = calculateNextRevision({
    revisionNumber: currentRevisionNumber,
    easeFactor: currentEaseFactor,
    intervalDays: currentIntervalDays,
    result,
    confidence,
  });

  // Mark current schedule as done
  await supabase
    .from('revision_schedule')
    .update({ is_completed: true, updated_at: new Date().toISOString() })
    .eq('id', scheduleId);

  // Insert next schedule
  await supabase
    .from('revision_schedule')
    .insert({
      user_id: userId,
      solved_problem_id: solvedProblemId,
      revision_number: next.revisionNumber,
      next_revision_date: next.nextDate,
      interval_days: next.intervalDays,
      ease_factor: next.easeFactor,
    });

  // Log revision attempt (replaces revision_history)
  await supabase
    .from('revision_attempts')
    .insert({
      user_id: userId,
      problem_id: (await supabase.from('solved_problems').select('problem_id').eq('id', solvedProblemId).single()).data.problem_id,
      attempt_type: 'scheduled_revision',
      time_taken: solveTime,
      confidence: confidence,
      result: result === 'easy' ? 'mastered' : result
    });

  // Note: solved_problems is automatically updated by the new trigger

  // Update user stats
  await supabase.rpc('increment_user_stat', { p_user_id: userId, p_column: 'total_revised', p_amount: 1 });

  // Award XP based on result
  const xp = result === 'easy' ? 20 : result === 'hint' ? 10 : 5;
  await supabase.rpc('add_user_xp', { p_user_id: userId, p_xp: xp });

  return next;
}

/**
 * Get a specific solved problem by its ID
 */
export async function getSolvedProblemById(solvedProblemId) {
  const { data, error } = await supabase
    .from('solved_problems')
    .select(`
      id, status, confidence, solve_time_minutes, first_solved_at, last_revised_at, notes, mistakes, user_pattern, user_id, problem_id,
      problem:problems(id, title, slug, difficulty, url, external_problem_id,
        coding_platforms(name),
        problem_tags(tag),
        problem_companies(company:companies(name))
      ),
      revision_schedule(next_revision_date, revision_number, is_completed, interval_days, ease_factor),
      revision_history(revision_number, revision_date, result, confidence, solve_time)
    `)
    .eq('id', solvedProblemId)
    .single();

  if (error) throw error;
  
  // Sort revision history descending by date
  if (data.revision_history) {
    data.revision_history.sort((a, b) => new Date(b.revision_date) - new Date(a.revision_date));
  }

  
  // Fetch revision attempts separately since it relates to user_id and problem_id directly
  if (data.problem_id) {
    try {
      const { data: attempts } = await supabase
        .from('revision_attempts')
        .select('id, attempt_type, time_taken, confidence, result, created_at')
        .eq('problem_id', data.problem_id)
        .eq('user_id', data.user_id)
        .order('created_at', { ascending: true });
      data.revision_attempts = attempts || [];
    } catch(e) {
      console.error("Failed to fetch revision attempts", e);
      data.revision_attempts = [];
    }
  } else {
    data.revision_attempts = [];
  }


  
  // Also fetch stats from RPC
  if (data.problem_id) {
    try {
      const { data: stats } = await supabase.rpc('get_problem_stats', {
        p_user_id: data.user_id,
        p_problem_id: data.problem_id
      });
      data.stats = stats?.[0] || null;
    } catch(e) {
      console.error("Failed to fetch problem stats", e);
    }
  } else {
    data.stats = null;
  }


  return data;
}

/**
 * Update solved problem notes or mistakes
 */
export async function updateSolvedProblem(solvedProblemId, updates) {
  const { error } = await supabase
    .from('solved_problems')
    .update(updates)
    .eq('id', solvedProblemId);
  if (error) throw error;
}
/**
 * Submit an instant reinforcement revision.
 * This does NOT alter the scheduled spaced-repetition logic.
 */
export async function submitInstantRevision({ userId, solvedProblemId, result, confidence, solveTime }) {
  // Log revision history as an instant revision
  await supabase
    .from('revision_history')
    .insert({
      user_id: userId,
      solved_problem_id: solvedProblemId,
      revision_number: 0, // 0 denotes an instant/unscheduled revision
      revision_date: new Date().toISOString().split('T')[0],
      result,
      solve_time: solveTime,
      confidence,
    });

  // Update last_revised_at and confidence on solved_problems
  await supabase
    .from('solved_problems')
    .update({ 
      last_revised_at: new Date().toISOString(),
      confidence 
    })
    .eq('id', solvedProblemId);

  // Update user stats
  await supabase.rpc('increment_user_stat', { p_user_id: userId, p_column: 'total_revised', p_amount: 1 });

  // Event Orchestrator handles XP, Daily Missions, Notifications, and Achievements
  await onRevisionCompleted(userId, solvedProblemId, confidence);

  return true;
}
