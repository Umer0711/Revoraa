/**
 * Revoraa DSA Atlas - Complete 191-Pattern Knowledge Engine
 * 
 * Aggregates all 22 topics & 191 DSA patterns across:
 * - Arrays (20)
 * - Strings (16)
 * - Linked List (10)
 * - Stack (9) & Queue/Deque (5)
 * - Binary Search (8) & Hashing (6)
 * - Trees (11), BST (7), Heap (7)
 * - Graphs (21)
 * - Dynamic Programming (13) & Greedy (7)
 * - Backtracking (7) & Recursion (4)
 * - Bit Manipulation (6) & Math (8)
 * - Tries (4), Segment Tree (4), Fenwick Tree (3), Union Find (4), Advanced Topics (11)
 * 
 * Provides authentic bilingual explanations (EN & Hinglish), deep visual diagrams,
 * accurate code implementations, canonical related problems, search signals for 16K+ questions,
 * and curated external resources (LeetCode, GFG, CP-Algorithms).
 */

import { arraysPatterns } from './patterns/arrays.js';
import { stringsPatterns } from './patterns/strings.js';
import { linkedListPatterns } from './patterns/linkedList.js';
import { stackQueuePatterns } from './patterns/stackQueue.js';
import { binarySearchHashingPatterns } from './patterns/binarySearchHashing.js';
import { treesHeapPatterns } from './patterns/treesHeap.js';
import { graphsPatterns } from './patterns/graphs.js';
import { dpGreedyPatterns } from './patterns/dpGreedy.js';
import { backtrackingRecursionPatterns } from './patterns/backtrackingRecursion.js';
import { mathBitPatterns } from './patterns/mathBit.js';
import { treesAdvancedPatterns } from './patterns/treesAdvanced.js';

// Combine all domain modules
const ALL_MODULES = [
  arraysPatterns,
  stringsPatterns,
  linkedListPatterns,
  stackQueuePatterns,
  binarySearchHashingPatterns,
  treesHeapPatterns,
  graphsPatterns,
  dpGreedyPatterns,
  backtrackingRecursionPatterns,
  mathBitPatterns,
  treesAdvancedPatterns
];

// Flat registry and lookup indexes
export const PATTERNS_REGISTRY = {};
export const PATTERNS_BY_TOPIC = {};
export const PATTERNS_BY_SLUG = {};
export const PATTERN_SEARCH_SIGNALS = {};
export const PATTERN_VISUAL_DATA = {};
export const PATTERN_RELATED_PROBLEMS_MAP = {};
export const PATTERN_LOCALIZATION_MAP = {};
export const PATTERN_CODE_EXAMPLES = {};
export const PATTERN_EXTERNAL_RESOURCES = {};

// Helper to normalize keys
function normalizeKey(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Populate indexes
ALL_MODULES.forEach(mod => {
  Object.values(mod).forEach(pattern => {
    if (!pattern || !pattern.name) return;

    const nameKey = pattern.name.trim();
    const normName = normalizeKey(pattern.name);
    const normTopic = normalizeKey(pattern.topic);
    const combinedKey = `${normTopic}:${normName}`;
    const slugKey = pattern.slug ? pattern.slug.toLowerCase().trim() : '';

    // Primary registry entries
    PATTERNS_REGISTRY[combinedKey] = pattern;
    if (slugKey) {
      PATTERNS_BY_SLUG[slugKey] = pattern;
    }

    // Default fallback by name (if not set or preferred)
    if (!PATTERNS_REGISTRY[normName]) {
      PATTERNS_REGISTRY[normName] = pattern;
    }

    // Direct name map
    if (!PATTERNS_REGISTRY[nameKey]) {
      PATTERNS_REGISTRY[nameKey] = pattern;
    }

    // Topic map
    if (!PATTERNS_BY_TOPIC[pattern.topic]) {
      PATTERNS_BY_TOPIC[pattern.topic] = [];
    }
    PATTERNS_BY_TOPIC[pattern.topic].push(pattern);

    // Visual data mapping
    if (pattern.visual) {
      PATTERN_VISUAL_DATA[combinedKey] = pattern.visual;
      PATTERN_VISUAL_DATA[nameKey] = pattern.visual;
    }

    // Related problems mapping
    const relProblems = pattern.relatedProblems || pattern.relatedCanonical || [];
    pattern.relatedProblems = relProblems;
    if (relProblems.length > 0) {
      PATTERN_RELATED_PROBLEMS_MAP[combinedKey] = relProblems;
      PATTERN_RELATED_PROBLEMS_MAP[nameKey] = relProblems;
    }

    // Search signals mapping
    if (pattern.searchSignals) {
      PATTERN_SEARCH_SIGNALS[combinedKey] = pattern.searchSignals;
      PATTERN_SEARCH_SIGNALS[nameKey] = pattern.searchSignals;
    }

    // Code example mapping
    if (pattern.code) {
      PATTERN_CODE_EXAMPLES[combinedKey] = pattern.code;
      PATTERN_CODE_EXAMPLES[nameKey] = pattern.code;
    }

    // External resources mapping
    if (pattern.externalResources) {
      PATTERN_EXTERNAL_RESOURCES[combinedKey] = pattern.externalResources;
      PATTERN_EXTERNAL_RESOURCES[nameKey] = pattern.externalResources;
    }

    // Localization mapping
    PATTERN_LOCALIZATION_MAP[combinedKey] = {
      en: {
        title: pattern.en?.title || pattern.name,
        overview: pattern.en?.overview || '',
        whatItIs: pattern.en?.whatItIs || '',
        whyItWorks: pattern.en?.whyItWorks || '',
        explanation: `${pattern.en?.whatItIs || ''}\n\n${pattern.en?.whyItWorks || ''}`.trim(),
        whenToUse: pattern.en?.whenToUse || '',
        recognitionTips: pattern.en?.recognitionSignals || [],
        commonMistakes: pattern.en?.commonMistakes || [],
        stepLogic: pattern.en?.stepLogic || ''
      },
      hi: {
        title: pattern.hi?.title || pattern.name,
        overview: pattern.hi?.overview || '',
        whatItIs: pattern.hi?.whatItIs || '',
        whyItWorks: pattern.hi?.whyItWorks || '',
        explanation: `${pattern.hi?.whatItIs || ''}\n\n${pattern.hi?.whyItWorks || ''}`.trim(),
        whenToUse: pattern.hi?.whenToUse || '',
        recognitionTips: pattern.hi?.recognitionSignals || [],
        commonMistakes: pattern.hi?.commonMistakes || [],
        stepLogic: pattern.hi?.stepLogic || ''
      }
    };
    PATTERN_LOCALIZATION_MAP[nameKey] = PATTERN_LOCALIZATION_MAP[combinedKey];
  });
});

/**
 * Retrieve the full pattern definition object
 * @param {string} patternName 
 * @param {string} [topicName] 
 * @returns {object|null}
 */
export function getPatternData(patternName, topicName) {
  if (!patternName) return null;

  const normName = normalizeKey(patternName);
  const normTopic = normalizeKey(topicName);

  if (normTopic && PATTERNS_REGISTRY[`${normTopic}:${normName}`]) {
    return PATTERNS_REGISTRY[`${normTopic}:${normName}`];
  }

  if (PATTERNS_REGISTRY[patternName]) {
    return PATTERNS_REGISTRY[patternName];
  }

  if (PATTERNS_REGISTRY[normName]) {
    return PATTERNS_REGISTRY[normName];
  }

  return null;
}

/**
 * Retrieve the interactive visual data for a pattern
 * @param {string} patternName 
 * @param {string} [topicName] 
 * @returns {object|null}
 */
export function getPatternVisualData(patternName, topicName) {
  if (!patternName) return null;

  const normName = normalizeKey(patternName);
  const normTopic = normalizeKey(topicName);

  if (normTopic && PATTERN_VISUAL_DATA[`${normTopic}:${normName}`]) {
    return PATTERN_VISUAL_DATA[`${normTopic}:${normName}`];
  }

  if (PATTERN_VISUAL_DATA[patternName]) {
    return PATTERN_VISUAL_DATA[patternName];
  }

  const pattern = getPatternData(patternName, topicName);
  if (pattern && pattern.visual) {
    return pattern.visual;
  }

  return null;
}

/**
 * Retrieve localized educational content for a pattern
 * @param {string} patternName 
 * @param {'en'|'hi'} [lang='en'] 
 * @param {string} [topicName] 
 * @returns {object|null}
 */
export function getPatternLocalization(patternName, lang = 'en', topicName) {
  if (!patternName) return null;

  const normName = normalizeKey(patternName);
  const normTopic = normalizeKey(topicName);

  let loc = null;
  if (normTopic && PATTERN_LOCALIZATION_MAP[`${normTopic}:${normName}`]) {
    loc = PATTERN_LOCALIZATION_MAP[`${normTopic}:${normName}`];
  } else if (PATTERN_LOCALIZATION_MAP[patternName]) {
    loc = PATTERN_LOCALIZATION_MAP[patternName];
  } else if (PATTERN_LOCALIZATION_MAP[normName]) {
    loc = PATTERN_LOCALIZATION_MAP[normName];
  }

  if (loc && loc[lang]) {
    return loc[lang];
  }

  // Fallback to pattern object directly
  const pattern = getPatternData(patternName, topicName);
  if (pattern && pattern[lang]) {
    return {
      title: pattern[lang].title || pattern.name,
      overview: pattern[lang].overview || '',
      whatItIs: pattern[lang].whatItIs || '',
      whyItWorks: pattern[lang].whyItWorks || '',
      explanation: `${pattern[lang].whatItIs || ''}\n\n${pattern[lang].whyItWorks || ''}`.trim(),
      whenToUse: pattern[lang].whenToUse || '',
      recognitionTips: pattern[lang].recognitionSignals || [],
      commonMistakes: pattern[lang].commonMistakes || [],
      stepLogic: pattern[lang].stepLogic || ''
    };
  }

  return null;
}

/**
 * Retrieve authentic working code example for a pattern
 * @param {string} patternName 
 * @param {string} [dbVisualExample] 
 * @param {string} [topicName] 
 * @returns {string}
 */
export function getPatternCodeExample(patternName, dbVisualExample, topicName) {
  // If dbVisualExample has genuine custom code, preserve it
  if (dbVisualExample && typeof dbVisualExample === 'string' && !dbVisualExample.trim().startsWith('Example logic for')) {
    return dbVisualExample.trim();
  }

  const normName = normalizeKey(patternName);
  const normTopic = normalizeKey(topicName);

  if (normTopic && PATTERN_CODE_EXAMPLES[`${normTopic}:${normName}`]) {
    return PATTERN_CODE_EXAMPLES[`${normTopic}:${normName}`];
  }

  if (PATTERN_CODE_EXAMPLES[patternName]) {
    return PATTERN_CODE_EXAMPLES[patternName];
  }

  const pattern = getPatternData(patternName, topicName);
  if (pattern && pattern.code) {
    return pattern.code;
  }

  return `// ${patternName} Implementation\nfunction solve(input) {\n  // Implementation for ${patternName}\n  return input;\n}`;
}

/**
 * Retrieve canonical related problems for a pattern
 * @param {string} patternName 
 * @param {string} [topicName] 
 * @returns {Array<object>}
 */
export function getPatternRelatedProblems(patternName, topicName) {
  if (!patternName) return [];

  const normName = normalizeKey(patternName);
  const normTopic = normalizeKey(topicName);

  if (normTopic && PATTERN_RELATED_PROBLEMS_MAP[`${normTopic}:${normName}`]) {
    return PATTERN_RELATED_PROBLEMS_MAP[`${normTopic}:${normName}`];
  }

  if (PATTERN_RELATED_PROBLEMS_MAP[patternName]) {
    return PATTERN_RELATED_PROBLEMS_MAP[patternName];
  }

  const pattern = getPatternData(patternName, topicName);
  if (pattern && (pattern.relatedProblems || pattern.relatedCanonical)) {
    return pattern.relatedProblems || pattern.relatedCanonical;
  }

  return [];
}

/**
 * Retrieve curated external learning resources for a pattern
 * @param {string} patternName 
 * @param {string} [topicName] 
 * @returns {Array<object>}
 */
export function getPatternExternalResources(patternName, topicName) {
  if (!patternName) return [];

  const normName = normalizeKey(patternName);
  const normTopic = normalizeKey(topicName);

  if (normTopic && PATTERN_EXTERNAL_RESOURCES[`${normTopic}:${normName}`]) {
    return PATTERN_EXTERNAL_RESOURCES[`${normTopic}:${normName}`];
  }

  if (PATTERN_EXTERNAL_RESOURCES[patternName]) {
    return PATTERN_EXTERNAL_RESOURCES[patternName];
  }

  const pattern = getPatternData(patternName, topicName);
  if (pattern && pattern.externalResources) {
    return pattern.externalResources;
  }

  return [];
}
