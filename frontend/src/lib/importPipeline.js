/**
 * Revoraa Import Pipeline Engine (Browser & Admin Utility)
 * 
 * Provides parsing, validation, normalization, duplicate detection, dry-run previews,
 * and import reports for company-wise interview question datasets.
 */

import { supabase } from './supabaseClient';

export const TAXONOMY_MAP = {
  'array': 'Arrays',
  'arrays': 'Arrays',
  'string': 'Strings',
  'strings': 'Strings',
  'hash-table': 'Hashing',
  'hashing': 'Hashing',
  'two-pointers': 'Two Pointers',
  'sliding-window': 'Sliding Window',
  'prefix-sum': 'Prefix Sum',
  'binary-search': 'Binary Search',
  'linked-list': 'Linked List',
  'stack': 'Stack',
  'queue': 'Queue',
  'heap': 'Heap',
  'trees': 'Trees',
  'tree': 'Trees',
  'bst': 'BST',
  'graphs': 'Graphs',
  'graph': 'Graphs',
  'dynamic-programming': 'Dynamic Programming',
  'dp': 'Dynamic Programming',
  'greedy': 'Greedy',
  'backtracking': 'Backtracking',
  'recursion': 'Recursion',
  'bit-manipulation': 'Bit Manipulation',
  'math': 'Math',
  'tries': 'Tries'
};

export const PATTERN_MAP = {
  'Arrays': 'Two Pointers',
  'Strings': 'Sliding Window',
  'Hashing': 'Hash Map',
  'Two Pointers': 'Opposite Direction',
  'Sliding Window': 'Dynamic Window',
  'Binary Search': 'Binary Search on Answer',
  'Linked List': 'Fast & Slow Pointer',
  'Stack': 'Monotonic Stack',
  'Queue': 'BFS Traversal',
  'Heap': 'Top K Frequent Elements',
  'Trees': 'DFS Traversal',
  'BST': 'Validate BST',
  'Graphs': 'DFS Island Count',
  'Dynamic Programming': '1D DP',
  'Greedy': 'Interval Scheduling',
  'Backtracking': 'Subsets',
  'Recursion': 'Divide & Conquer',
  'Bit Manipulation': 'Single Number',
  'Math': 'GCD & LCM',
  'Tries': 'Implement Trie'
};

/**
 * Validate a raw dataset row
 */
export function validateRecord(row) {
  const errors = [];

  if (!row.title || typeof row.title !== 'string' || row.title.trim().length === 0) {
    errors.push('Missing or empty Question Title');
  }

  if (!row.slug || typeof row.slug !== 'string' || row.slug.trim().length === 0) {
    errors.push('Missing or invalid Slug');
  }

  if (!row.difficulty || !['Easy', 'Medium', 'Hard'].includes(row.difficulty)) {
    errors.push('Difficulty must be Easy, Medium, or Hard');
  }

  if (!row.url || !row.url.startsWith('http')) {
    errors.push('Invalid or missing Official URL');
  }

  if (!row.company || typeof row.company !== 'string' || row.company.trim().length === 0) {
    errors.push('Missing Company name');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Parse raw CSV or JSON text into records
 */
export function parseDatasetInput(rawInput) {
  const records = [];
  const lines = rawInput.split('\n').map(l => l.trim()).filter(Boolean);

  if (lines.length === 0) return records;

  // Check header
  const header = lines[0].toLowerCase();
  const isCsv = header.includes(',') || header.includes('title');

  if (isCsv) {
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols.length < 3) continue;

      const record = {
        title: cols[headers.indexOf('title')] || cols[0] || '',
        slug: cols[headers.indexOf('slug')] || (cols[0] ? cols[0].toLowerCase().replace(/[^a-z0-9]+/g, '-') : ''),
        difficulty: cols[headers.indexOf('difficulty')] || cols[1] || 'Medium',
        company: cols[headers.indexOf('company')] || cols[2] || 'Google',
        topic: cols[headers.indexOf('topic')] || cols[3] || 'Arrays',
        url: cols[headers.indexOf('url')] || cols[4] || `https://leetcode.com/problems/${cols[0]?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/`
      };
      records.push(record);
    }
  } else {
    try {
      const parsed = JSON.parse(rawInput);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      console.warn('Input is not valid JSON array, falling back to line parsing.');
    }
  }

  return records;
}

/**
 * Perform a Dry-Run Analysis on a dataset batch
 */
export async function analyzeDatasetBatch(records) {
  const report = {
    totalRecords: records.length,
    validRecords: 0,
    invalidRecords: 0,
    duplicateQuestions: 0,
    newCompanies: new Set(),
    existingCompanies: new Set(),
    skippedLogs: []
  };

  const seenSlugs = new Set();

  for (let i = 0; i < records.length; i++) {
    const rec = records[i];
    const validation = validateRecord(rec);

    if (!validation.isValid) {
      report.invalidRecords++;
      report.skippedLogs.push({ line: i + 1, record: rec, reason: validation.errors.join('; ') });
      continue;
    }

    if (seenSlugs.has(rec.slug)) {
      report.duplicateQuestions++;
      report.skippedLogs.push({ line: i + 1, record: rec, reason: 'Duplicate slug in batch' });
      continue;
    }
    seenSlugs.add(rec.slug);

    report.validRecords++;
    if (rec.company) report.newCompanies.add(rec.company);
  }

  report.newCompanies = Array.from(report.newCompanies);
  return report;
}

/**
 * Execute Dataset Import into Database
 */
export async function executeDatasetImport(records) {
  const result = {
    importedQuestions: 0,
    importedCompanies: 0,
    errors: []
  };

  try {
    // 1. Ensure LeetCode platform ID
    let { data: platform } = await supabase.from('coding_platforms').select('id').eq('slug', 'leetcode').maybeSingle();
    let platformId = platform?.id;

    if (!platformId) {
      const { data: newPlatform } = await supabase.from('coding_platforms').insert({ name: 'LeetCode', slug: 'leetcode', website: 'https://leetcode.com' }).select().single();
      platformId = newPlatform?.id;
    }

    // 2. Fetch or Create Companies
    const companyNameMap = new Map();
    const { data: dbCompanies } = await supabase.from('companies').select('id, name');
    (dbCompanies || []).forEach(c => companyNameMap.set(c.name.toLowerCase(), c.id));

    for (const rec of records) {
      const normComp = rec.company.trim().toLowerCase();
      if (!companyNameMap.has(normComp)) {
        const { data: newComp, error: compErr } = await supabase.from('companies').insert({ name: rec.company.trim() }).select().single();
        if (newComp) {
          companyNameMap.set(normComp, newComp.id);
          result.importedCompanies++;
        }
      }
    }

    // 3. Process Questions
    for (const rec of records) {
      const val = validateRecord(rec);
      if (!val.isValid) continue;

      let problemId = null;
      const { data: existingProb } = await supabase.from('problems').select('id').eq('slug', rec.slug).maybeSingle();

      if (existingProb) {
        problemId = existingProb.id;
      } else {
        const { data: newProb, error: pErr } = await supabase.from('problems').insert({
          platform_id: platformId,
          title: rec.title,
          slug: rec.slug,
          difficulty: rec.difficulty,
          url: rec.url
        }).select().single();

        if (pErr) {
          result.errors.push(`Failed question ${rec.title}: ${pErr.message}`);
          continue;
        }
        problemId = newProb.id;
      }

      // Link company
      const compId = companyNameMap.get(rec.company.trim().toLowerCase());
      if (compId && problemId) {
        await supabase.from('problem_companies').upsert({
          problem_id: problemId,
          company_id: compId,
          frequency: 50
        }, { onConflict: 'problem_id,company_id' });
      }

      // Link tag
      if (rec.topic) {
        const normTopic = TAXONOMY_MAP[rec.topic.toLowerCase()] || rec.topic;
        await supabase.from('problem_tags').upsert({
          problem_id: problemId,
          tag: normTopic.toLowerCase()
        });
      }

      result.importedQuestions++;
    }

  } catch (error) {
    result.errors.push(`Import exception: ${error.message}`);
  }

  return result;
}
