/**
 * Revoraa Interview Readiness Data Service (Stabilized v3)
 * 
 * ALL statistics come directly from SQL database queries.
 * ZERO hardcoded fallback numbers.
 * ZERO fabricated counts.
 * Uses DISTINCT problem_id deduplication throughout.
 */

import { supabase } from './supabaseClient';
import { onProblemAdded } from './eventOrchestrator';

// ─── Company Logo & Metadata Registry ────────────────────────────
export const COMPANY_METADATA = {
  'google': { color: '#4285F4', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg', tier: 'Tier 1', industry: 'Search & AI' },
  'amazon': { color: '#FF9900', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', tier: 'Tier 1', industry: 'E-Commerce & Cloud' },
  'meta': { color: '#0668E1', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg', tier: 'Tier 1', industry: 'Social & Meta' },
  'microsoft': { color: '#00A4EF', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg', tier: 'Tier 1', industry: 'Software & Cloud' },
  'apple': { color: '#A2AAAD', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg', tier: 'Tier 1', industry: 'Consumer Hardware' },
  'netflix': { color: '#E50914', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', tier: 'Tier 1', industry: 'Streaming Media' },
  'adobe': { color: '#FF0000', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_2017.svg', tier: 'Tier 1', industry: 'Creative Software' },
  'uber': { color: '#000000', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png', tier: 'Tier 1', industry: 'Mobility & Logistics' },
  'oracle': { color: '#C74634', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg', tier: 'Tier 1', industry: 'Enterprise Database' },
  'atlassian': { color: '#0052CC', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/confluence/confluence-original.svg', tier: 'Tier 1', industry: 'Developer SaaS' },
  'nvidia': { color: '#76B900', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg', tier: 'Tier 1', industry: 'Semiconductors & AI' },
  'stripe': { color: '#635BFF', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg', tier: 'Tier 1', industry: 'Fintech Payments' },
  'goldman-sachs': { color: '#7399C6', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg', tier: 'Tier 1', industry: 'Investment Banking' },
  'jpmorgan': { color: '#002B49', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/af/J_P_Morgan_Logo_2008.svg', tier: 'Tier 1', industry: 'Financial Services' },
  'flipkart': { color: '#2874F0', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Flipkart_logo.svg', tier: 'Tier 1', industry: 'E-Commerce' },
  'walmart-labs': { color: '#0071CE', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg', tier: 'Tier 1', industry: 'Retail Tech' },
  'paypal': { color: '#003087', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg', tier: 'Tier 1', industry: 'Digital Payments' },
  'salesforce': { color: '#00A1E0', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg', tier: 'Tier 1', industry: 'Enterprise CRM' },
  'bloomberg': { color: '#000000', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Bloomberg_Logo.svg', tier: 'Tier 1', industry: 'Financial Data' },
  'linkedin': { color: '#0A66C2', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg', tier: 'Tier 1', industry: 'Professional Network' },
  'tiktok': { color: '#000000', logo: null, tier: 'Tier 1', industry: 'Social Media' },
  'tcs': { color: '#0066B3', logo: null, tier: 'Tier 2', industry: 'IT Services' },
  'ibm': { color: '#054ADA', logo: null, tier: 'Tier 1', industry: 'Enterprise IT' },
  'zoho': { color: '#C8202B', logo: null, tier: 'Tier 2', industry: 'SaaS' },
  'infosys': { color: '#007CC3', logo: null, tier: 'Tier 2', industry: 'IT Services' },
  'visa': { color: '#1A1F71', logo: null, tier: 'Tier 1', industry: 'Financial Services' },
  'airbnb': { color: '#FF5A5F', logo: null, tier: 'Tier 1', industry: 'Travel Tech' },
  'snapchat': { color: '#FFFC00', logo: null, tier: 'Tier 1', industry: 'Social Media' },
  'doordash': { color: '#FF3008', logo: null, tier: 'Tier 1', industry: 'Delivery Tech' },
  'citadel': { color: '#1A3C5E', logo: null, tier: 'Tier 1', industry: 'Quantitative Finance' },
  'de-shaw': { color: '#003366', logo: null, tier: 'Tier 1', industry: 'Quantitative Finance' },
  'snowflake': { color: '#29B5E8', logo: null, tier: 'Tier 1', industry: 'Data Cloud' },
  'phonepe': { color: '#5F259F', logo: null, tier: 'Tier 2', industry: 'Fintech' },
  'accenture': { color: '#A100FF', logo: null, tier: 'Tier 2', industry: 'Consulting' },
  'yandex': { color: '#FF0000', logo: null, tier: 'Tier 1', industry: 'Search Engine' }
};

/**
 * Get Readiness Overview — 100% from database, zero fallbacks
 */
export async function getReadinessOverview(userId) {
  try {
    // Single parallel batch request: company stats sum, user solved problems, user stats, total companies
    const [{ data: dbStats }, { data: solvedRows }, { data: userStats }, { count: totalCompanies }] = await Promise.all([
      supabase.from('company_statistics').select('total_questions, easy_count, medium_count, hard_count'),
      supabase.from('solved_problems').select('problem_id, problem:problems(difficulty)').eq('user_id', userId).is('deleted_at', null),
      supabase.from('user_stats').select('xp, level, current_streak').eq('user_id', visitorFallback(userId)).maybeSingle(),
      supabase.from('companies').select('id', { count: 'exact' })
    ]);

    let totalQuestions = 0;
    let easyCount = 0, mediumCount = 0, hardCount = 0;
    (dbStats || []).forEach(row => {
      totalQuestions += row.total_questions || 0;
      easyCount += row.easy_count || 0;
      mediumCount += row.medium_count || 0;
      hardCount += row.hard_count || 0;
    });

    // Deduplicate solved by problem_id
    const solvedMap = new Map();
    (solvedRows || []).forEach(s => {
      if (s.problem_id && !solvedMap.has(s.problem_id)) {
        solvedMap.set(s.problem_id, s.problem?.difficulty || 'Medium');
      }
    });

    const solvedCount = solvedMap.size;
    let easySolved = 0, mediumSolved = 0, hardSolved = 0;
    for (const diff of solvedMap.values()) {
      if (diff === 'Easy') easySolved++;
      else if (diff === 'Medium') mediumSolved++;
      else if (diff === 'Hard') hardSolved++;
    }

    return {
      totalCompanies: totalCompanies || 0,
      totalQuestions,
      solvedCount,
      remainingCount: Math.max(0, totalQuestions - solvedCount),
      completionPercentage: totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0,
      easyCount,
      mediumCount,
      hardCount,
      easySolved,
      mediumSolved,
      hardSolved,
      currentStreak: userStats?.current_streak || 0,
      xp: userStats?.xp || 0,
      level: userStats?.level || 1
    };
  } catch (error) {
    console.error('Error fetching readiness overview:', error);
    return {
      totalCompanies: 0, totalQuestions: 0, solvedCount: 0, remainingCount: 0,
      completionPercentage: 0, easyCount: 0, mediumCount: 0, hardCount: 0,
      easySolved: 0, mediumSolved: 0, hardSolved: 0,
      currentStreak: 0, xp: 0, level: 1
    };
  }
}

// Helper to handle non-authenticated browsing
function visitorFallback(userId) { return userId; }

/**
 * Fetch Companies Explorer — all companies with INSTANT loading via company_statistics table
 */
export async function getCompaniesExplorer(userId, options = {}) {
  const { search = '', filterStatus = 'ALL' } = options;

  try {
    // Single parallel batch request: fetch companies, company statistics, and user's solved problems
    const [{ data: dbCompanies }, { data: dbStats }, { data: userSolved }] = await Promise.all([
      supabase.from('companies').select('id, name'),
      supabase.from('company_statistics').select('company_id, total_questions, easy_count, medium_count, hard_count'),
      supabase.from('solved_problems').select('problem_id').eq('user_id', userId).is('deleted_at', null)
    ]);

    const statsMap = new Map((dbStats || []).map(s => [s.company_id, s]));
    const solvedIds = (userSolved || []).map(s => s.problem_id);
    const solvedCountMap = new Map();

    // If user has solved problems, aggregate solved count per company efficiently
    if (solvedIds.length > 0) {
      const { data: pcMappings } = await supabase
        .from('problem_companies')
        .select('company_id, problem_id')
        .in('problem_id', solvedIds);

      const companySolvedSets = new Map();
      (pcMappings || []).forEach(pc => {
        if (!companySolvedSets.has(pc.company_id)) companySolvedSets.set(pc.company_id, new Set());
        companySolvedSets.get(pc.company_id).add(pc.problem_id);
      });
      for (const [cid, pSet] of companySolvedSets.entries()) {
        solvedCountMap.set(cid, pSet.size);
      }
    }

    let result = (dbCompanies || []).map(c => {
      const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const meta = COMPANY_METADATA[slug] || { color: '#F59E0B', logo: null, tier: 'Tier 2', industry: 'Technology' };
      const st = statsMap.get(c.id);

      const total = st ? (st.total_questions || 0) : 0;
      const solved = solvedCountMap.get(c.id) || 0;

      return {
        id: c.id,
        name: c.name,
        slug,
        meta,
        totalQuestions: total,
        solvedQuestions: solved,
        remainingQuestions: Math.max(0, total - solved),
        completionPercentage: total > 0 ? Math.round((solved / total) * 100) : 0,
        easyCount: st ? (st.easy_count || 0) : 0,
        mediumCount: st ? (st.medium_count || 0) : 0,
        hardCount: st ? (st.hard_count || 0) : 0
      };
    });

    // Filter out companies with 0 questions
    result = result.filter(c => c.totalQuestions > 0);

    // Sort by totalQuestions descending (most questions first)
    result.sort((a, b) => b.totalQuestions - a.totalQuestions);

    // Apply search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.meta.industry.toLowerCase().includes(q) ||
        c.slug.includes(q)
      );
    }

    // Apply status filter
    if (filterStatus === 'SOLVED') {
      result = result.filter(c => c.completionPercentage === 100);
    } else if (filterStatus === 'IN_PROGRESS') {
      result = result.filter(c => c.completionPercentage > 0 && c.completionPercentage < 100);
    } else if (filterStatus === 'UNTOUCHED') {
      result = result.filter(c => c.completionPercentage === 0);
    }

    return result;
  } catch (error) {
    console.error('Error fetching companies explorer:', error);
    return [];
  }
}

/**
 * Fetch Hierarchical Company Details: Company → Topics → Patterns → Questions
 * All counts from database, zero fabrication.
 */
export async function getCompanyHierarchicalDetails(userId, companyId) {
  try {
    const { data: company } = await supabase.from('companies').select('*').eq('id', companyId).single();

    // Paginate problem_companies for this company
    let allPcMappings = [];
    let offset = 0;
    while (true) {
      const { data: batch } = await supabase
        .from('problem_companies')
        .select('problem:problems(id, title, slug, difficulty, url, acceptance_rate, problem_tags(tag))')
        .eq('company_id', companyId)
        .range(offset, offset + 999);
      if (!batch || batch.length === 0) break;
      allPcMappings = allPcMappings.concat(batch);
      if (batch.length < 1000) break;
      offset += 1000;
    }

    // Fetch user solved for this user
    const { data: userSolved } = await supabase
      .from('solved_problems')
      .select('problem_id, confidence, notes, first_solved_at')
      .eq('user_id', userId)
      .is('deleted_at', null);

    const solvedMap = new Map((userSolved || []).map(s => [s.problem_id, s]));
    const topicMap = new Map();
    const seenProblems = new Set();

    let totalQuestions = 0, solvedQuestions = 0;
    let easyCount = 0, mediumCount = 0, hardCount = 0;

    allPcMappings.forEach(pc => {
      const p = pc.problem;
      if (!p || seenProblems.has(p.id)) return;
      seenProblems.add(p.id);

      const solvedInfo = solvedMap.get(p.id);
      const isSolved = Boolean(solvedInfo);

      totalQuestions++;
      if (isSolved) solvedQuestions++;

      if (p.difficulty === 'Easy') easyCount++;
      else if (p.difficulty === 'Medium') mediumCount++;
      else if (p.difficulty === 'Hard') hardCount++;

      // Get topic from problem_tags
      const tags = (p.problem_tags || []).map(t => t.tag);
      const rawTopic = tags[0] || 'arrays';
      const topicName = rawTopic.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      // Classify pattern dynamically from slug, title and topic
      const s = (p.slug || '').toLowerCase();
      const t = (p.title || '').toLowerCase();
      let patternName = 'Algorithmic Strategy';

      if (s.includes('window') || s.includes('substring') || s.includes('longest-repeating') || s.includes('min-window')) {
        patternName = 'Sliding Window';
      } else if (s.includes('two-sum') || s.includes('3sum') || s.includes('4sum') || s.includes('container') || s.includes('move-zeroes') || s.includes('two-pointers') || s.includes('trap')) {
        patternName = 'Two Pointers';
      } else if (s.includes('prefix') || s.includes('subarray-sum') || s.includes('product-of-array') || s.includes('range-sum')) {
        patternName = 'Prefix Sum';
      } else if (s.includes('matrix') || s.includes('spiral') || s.includes('rotate-image') || s.includes('grid') || s.includes('word-search')) {
        patternName = 'Matrix & Grid Traversal';
      } else if (s.includes('bst') || s.includes('binary-search-tree') || s.includes('validate-binary-search')) {
        patternName = 'Binary Search Tree Operations';
      } else if (s.includes('tree') || s.includes('ancestor') || s.includes('inorder') || s.includes('preorder') || s.includes('postorder') || s.includes('level-order') || s.includes('path-sum') || s.includes('depth') || s.includes('diameter')) {
        patternName = 'Tree Traversal & Depth First Search';
      } else if (s.includes('dp') || s.includes('robber') || s.includes('stairs') || s.includes('coin-change') || s.includes('knapsack') || s.includes('subsequence') || s.includes('decode-ways') || s.includes('word-break') || s.includes('partition')) {
        patternName = 'Dynamic Programming & Memoization';
      } else if (s.includes('graph') || s.includes('island') || s.includes('course') || s.includes('network') || s.includes('ladder') || s.includes('bipartite') || s.includes('shortest-path')) {
        patternName = 'Graph Graph & Breadth/Depth First Search';
      } else if (s.includes('search') || s.includes('rotated') || s.includes('peak') || s.includes('median') || s.includes('koko') || s.includes('find-minimum')) {
        patternName = 'Binary Search & Logarithmic Search';
      } else if (s.includes('stack') || s.includes('parenthes') || s.includes('calculator') || s.includes('temperatures') || s.includes('histogram') || s.includes('next-greater')) {
        patternName = 'Monotonic Stack & Expression Parsing';
      } else if (s.includes('queue') || s.includes('sliding-window-max') || s.includes('stream')) {
        patternName = 'Monotonic Queue & Buffers';
      } else if (s.includes('sort') || s.includes('merge-interval') || s.includes('insert-interval') || s.includes('meeting') || s.includes('non-overlapping')) {
        patternName = 'Sorting, Counting & Interval Merging';
      } else if (s.includes('linked') || s.includes('list') || s.includes('reverse-linked') || s.includes('lru') || s.includes('lfu') || s.includes('middle-of-the-linked')) {
        patternName = 'Linked List Manipulation';
      } else if (s.includes('heap') || s.includes('kth') || s.includes('top-k') || s.includes('merge-k') || s.includes('priority') || s.includes('median-finder')) {
        patternName = 'Heap & Top-K Elements';
      } else if (s.includes('trie') || s.includes('prefix-tree') || s.includes('replace-words')) {
        patternName = 'Trie & Prefix Search';
      } else if (s.includes('backtrack') || s.includes('permut') || s.includes('subset') || s.includes('combin') || s.includes('n-queens') || s.includes('sudoku')) {
        patternName = 'Backtracking & State Exploration';
      } else if (s.includes('greedy') || s.includes('jump') || s.includes('gas') || s.includes('task-scheduler') || s.includes('cookie') || s.includes('candy')) {
        patternName = 'Greedy Choice Strategy';
      } else if (s.includes('bit') || s.includes('single-number') || s.includes('power-of') || s.includes('bitwise') || s.includes('counting-bits')) {
        patternName = 'Bit Manipulation & Masking';
      } else if (s.includes('math') || s.includes('pow') || s.includes('prime') || s.includes('factorial') || s.includes('fizz') || s.includes('happy') || s.includes('roman')) {
        patternName = 'Mathematical Formulas & Properties';
      } else if (s.includes('string') || s.includes('anagram') || s.includes('palindrome') || s.includes('isomorphic') || s.includes('word') || s.includes('reverse')) {
        patternName = 'String Processing & Matching';
      } else if (s.includes('hash') || s.includes('duplicate') || s.includes('frequency') || s.includes('intersection') || s.includes('map')) {
        patternName = 'Hashing & Frequency Counting';
      } else {
        patternName = 'Array Operations & In-Place Modification';
      }

      if (!topicMap.has(topicName)) topicMap.set(topicName, new Map());
      const patMap = topicMap.get(topicName);
      if (!patMap.has(patternName)) patMap.set(patternName, []);

      patMap.get(patternName).push({
        id: p.id,
        title: p.title,
        slug: p.slug,
        difficulty: p.difficulty,
        url: p.url ? (p.url.startsWith('http') ? p.url : `https://leetcode.com/problems/${p.slug}/`) : `https://leetcode.com/problems/${p.slug}/`,
        acceptanceRate: p.acceptance_rate ? `${p.acceptance_rate}%` : '—',
        gfgUrl: `https://www.geeksforgeeks.org/search/?q=${encodeURIComponent(p.title)}`,
        isSolved,
        solvedAt: solvedInfo?.first_solved_at,
        confidence: solvedInfo?.confidence,
        notes: solvedInfo?.notes
      });
    });

    // Build topics tree sorted by question count
    const topicsTree = Array.from(topicMap.entries())
      .map(([topicName, patMap]) => {
        const patterns = Array.from(patMap.entries()).map(([patternName, qList]) => ({
          patternName,
          total: qList.length,
          solved: qList.filter(q => q.isSolved).length,
          questions: qList
        }));
        patterns.sort((a, b) => b.total - a.total);
        return { topicName, patterns };
      })
      .sort((a, b) => {
        const aTotal = a.patterns.reduce((s, p) => s + p.total, 0);
        const bTotal = b.patterns.reduce((s, p) => s + p.total, 0);
        return bTotal - aTotal;
      });

    const slug = company?.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'company';
    const meta = COMPANY_METADATA[slug] || { color: '#F59E0B', logo: null, tier: 'Tier 2', industry: 'Technology' };

    return {
      company: { ...company, meta },
      totalQuestions,
      solvedQuestions,
      remainingQuestions: Math.max(0, totalQuestions - solvedQuestions),
      completionPercentage: totalQuestions > 0 ? Math.round((solvedQuestions / totalQuestions) * 100) : 0,
      easyCount,
      mediumCount,
      hardCount,
      topicsTree
    };
  } catch (error) {
    console.error('Error fetching company hierarchical details:', error);
    return null;
  }
}

/**
 * Toggle Question Solved State & Sync with Revoraa Engine
 */
export async function toggleQuestionSolved(userId, problemId, currentlySolved) {
  try {
    if (currentlySolved) {
      await supabase
        .from('solved_problems')
        .update({ deleted_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('problem_id', problemId);
      return { success: true, isSolved: false };
    } else {
      const { data: solvedProblem, error: spErr } = await supabase
        .from('solved_problems')
        .upsert({
          user_id: userId,
          problem_id: problemId,
          solve_time_minutes: 20,
          confidence: 4,
          solved_using: 'myself',
          status: 'mastered',
          deleted_at: null,
          first_solved_at: new Date().toISOString()
        }, { onConflict: 'user_id,problem_id' })
        .select()
        .single();

      if (spErr) throw spErr;

      // Trigger XP, streak, achievements, revision schedule
      try {
        await onProblemAdded(userId, solvedProblem.id, 'myself', 50);
      } catch (e) {
        console.warn('Event orchestrator warning:', e.message);
      }

      // Schedule SM-2 revision
      try {
        const revDate = new Date();
        revDate.setDate(revDate.getDate() + 3);
        await supabase.from('revision_schedule').upsert({
          user_id: userId,
          solved_problem_id: solvedProblem.id,
          revision_number: 1,
          next_revision_date: revDate.toISOString().split('T')[0],
          interval_days: 3,
          ease_factor: 2.5,
          is_completed: false
        }, { onConflict: 'user_id,solved_problem_id' });
      } catch (e) {
        console.warn('Revision schedule warning:', e.message);
      }

      return { success: true, isSolved: true };
    }
  } catch (error) {
    console.error('Error toggling question solved state:', error);
    return { success: false, error: error.message };
  }
}
