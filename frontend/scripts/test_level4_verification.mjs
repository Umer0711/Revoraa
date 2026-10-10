/**
 * test_level4_verification.mjs
 * Comprehensive Verification Suite for Revoraa Level 4: Advanced Python
 */

import { PYTHON_PATH, ALL_LEARNING_PATHS } from '../src/lib/learningData.js';
import { LEVEL_4_MODULES, LEVEL_4_DEFINITION } from '../src/lib/curriculum/level4Modules.js';
import { LEVEL_4_PROJECTS } from '../src/lib/curriculum/level4Projects.js';
import { LEVEL_4_CHALLENGES } from '../src/lib/curriculum/level4Challenges.js';
import { ALL_PROJECTS, ALL_CHALLENGES } from '../src/lib/practiceAndProjectData.js';
import { getLocalizedLesson, PYTHON_LESSON_TRANSLATIONS } from '../src/lib/translations/pythonTranslations.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`❌ FAILED: ${message}`);
  }
}

console.log("=== REVORAA LEVEL 4 ADVANCED PYTHON VERIFICATION SUITE ===\n");

// 1. Path & Levels Structure
console.log("1. Verifying Path and Levels Hierarchy...");
assert(PYTHON_PATH.levels.length >= 4, `Expected at least 4 levels, got ${PYTHON_PATH.levels.length}`);
assert(PYTHON_PATH.levels[0].level_number === 1, "Level 1 exists");
assert(PYTHON_PATH.levels[1].level_number === 2, "Level 2 exists");
assert(PYTHON_PATH.levels[2].level_number === 3, "Level 3 exists");
assert(PYTHON_PATH.levels[3].level_number === 4, "Level 4 exists");
assert(PYTHON_PATH.levels[3].title === "Advanced Python", `Level 4 title is 'Advanced Python', got '${PYTHON_PATH.levels[3].title}'`);
assert(PYTHON_PATH.total_lessons >= 185, `Total path lessons expected >= 185, got ${PYTHON_PATH.total_lessons}`);

// 2. Level 4 Modules Check
console.log("\n2. Verifying Level 4 Modules...");
assert(LEVEL_4_MODULES.length === 8, `Expected 8 Level 4 modules, got ${LEVEL_4_MODULES.length}`);
const expectedModuleSlugs = [
  'advanced-python-internals-resource-management',
  'asynchronous-programming-asyncio',
  'threads-processes-and-concurrency',
  'performance-profiling-and-optimization',
  'advanced-type-hints-and-protocols',
  'design-patterns-and-application-architecture',
  'reliable-pipelines-logging-and-error-handling',
  'advanced-testing-architecture-validation'
];

expectedModuleSlugs.forEach((slug, idx) => {
  const mod = LEVEL_4_MODULES[idx];
  assert(mod && mod.slug === slug, `Module ${idx + 1} slug expected '${slug}', got '${mod?.slug}'`);
  assert(mod.level_number === 4, `Module ${idx + 1} level_number is 4`);
  assert(mod.topics.length >= 1, `Module ${idx + 1} has topics`);
});

// 3. Level 4 Lessons Completeness (94 lessons total: Mod 1 has 10, Mods 2-8 have 12 each)
console.log("\n3. Verifying Level 4 Lessons Detail & Integrity...");
let l4TotalLessons = 0;
const lessonSlugsSeen = new Set();

LEVEL_4_MODULES.forEach((mod, modIdx) => {
  const modLessons = mod.topics.flatMap(t => t.lessons);
  l4TotalLessons += modLessons.length;
  
  if (modIdx === 0) {
    assert(modLessons.length === 10, `Module 1 expected 10 lessons, got ${modLessons.length}`);
  } else {
    assert(modLessons.length === 12, `Module ${modIdx + 1} expected 12 lessons, got ${modLessons.length}`);
  }

  modLessons.forEach(les => {
    assert(les.id && les.id.startsWith('les-l4-'), `Lesson ${les.slug} has valid id (${les.id})`);
    assert(les.title && les.title.length > 5, `Lesson ${les.slug} has title`);
    assert(les.summary && les.summary.length > 10, `Lesson ${les.slug} has summary`);
    assert(les.content_markdown && les.content_markdown.length > 100, `Lesson ${les.slug} has substantive markdown content`);
    assert(Array.isArray(les.learning_objectives) && les.learning_objectives.length >= 2, `Lesson ${les.slug} has learning objectives`);
    assert(les.code_snippet && les.code_snippet.length > 20, `Lesson ${les.slug} has code snippet`);
    assert(les.expected_output && les.expected_output.length > 0, `Lesson ${les.slug} has expected output`);
    
    // Quiz structure check (supports quiz.questions array or quiz.options)
    const qList = les.quiz?.questions || (les.quiz?.options ? [les.quiz] : []);
    assert(qList.length >= 1 && Array.isArray(qList[0].options) && qList[0].correct_option_ids?.length >= 1, `Lesson ${les.slug} has valid quiz questions`);
    
    assert(Array.isArray(les.key_takeaways) && les.key_takeaways.length >= 2, `Lesson ${les.slug} has key takeaways`);
    assert(Array.isArray(les.revision_prompts) && les.revision_prompts.length >= 1, `Lesson ${les.slug} has revision prompts`);
    
    // Check uniqueness
    assert(!lessonSlugsSeen.has(les.slug), `Duplicate lesson slug detected: ${les.slug}`);
    lessonSlugsSeen.add(les.slug);
  });
});

assert(l4TotalLessons === 94, `Expected exactly 94 Level 4 lessons, got ${l4TotalLessons}`);

// 4. Projects Verification (8 Module Projects + 1 Capstone = 9 Projects, 36 milestones)
console.log("\n4. Verifying Level 4 Projects & Milestones...");
assert(LEVEL_4_PROJECTS.length === 9, `Expected 9 Level 4 projects (8 module + 1 capstone), got ${LEVEL_4_PROJECTS.length}`);

let totalL4Milestones = 0;
LEVEL_4_PROJECTS.forEach(proj => {
  assert(proj.level_number === 4, `Project ${proj.slug} has level_number 4`);
  assert(proj.difficulty === 'advanced', `Project ${proj.slug} difficulty is advanced`);
  assert(proj.xp_reward >= 200, `Project ${proj.slug} has meaningful XP`);
  assert(proj.description.en && proj.description['hi-Latn'] && proj.description.hi, `Project ${proj.slug} has trilingual descriptions`);
  assert(proj.milestones.length === 4, `Project ${proj.slug} has 4 milestones, got ${proj.milestones.length}`);
  
  proj.milestones.forEach((m, mIdx) => {
    totalL4Milestones++;
    assert(m.title && m.title.length > 5, `Milestone ${m.id} has title`);
    assert(m.instructions.en && m.instructions['hi-Latn'] && m.instructions.hi, `Milestone ${m.id} has trilingual instructions`);
    assert(m.starter_code && m.starter_code.length > 20, `Milestone ${m.id} has starter code`);
    assert(m.test_harness && m.test_harness.includes('assert'), `Milestone ${m.id} test harness contains assertions`);
  });
});
assert(totalL4Milestones === 36, `Expected 36 total Level 4 milestones, got ${totalL4Milestones}`);

// 5. Challenges Verification (5 interactive challenge modes)
console.log("\n5. Verifying Level 4 Interactive Challenges...");
assert(LEVEL_4_CHALLENGES.length === 5, `Expected 5 Level 4 challenges, got ${LEVEL_4_CHALLENGES.length}`);
const expectedChallengeTypes = ['cooked_or_cracked', 'bug_hunt', 'internet_is_wrong', 'boss_fight', 'code_escape_room'];

LEVEL_4_CHALLENGES.forEach(chal => {
  assert(chal.level_number === 4, `Challenge ${chal.slug} level_number is 4`);
  assert(chal.difficulty === 'advanced', `Challenge ${chal.slug} difficulty is advanced`);
  assert(expectedChallengeTypes.includes(chal.challenge_type), `Challenge ${chal.slug} has recognized type ${chal.challenge_type}`);
  assert(chal.instructions.en && chal.instructions['hi-Latn'] && chal.instructions.hi, `Challenge ${chal.slug} has trilingual instructions`);
  assert(chal.hints.en && chal.hints['hi-Latn'] && chal.hints.hi, `Challenge ${chal.slug} has trilingual hints`);
  assert(chal.starter_code && chal.starter_code.length > 20, `Challenge ${chal.slug} has starter code`);
});

// 6. Multilingual Translation & Fallback Behavior
console.log("\n6. Verifying Multilingual Localization & Fallback...");
const sampleLesson = LEVEL_4_MODULES[0].topics[0].lessons[0]; // les-l4-revisiting-execution-model
const enVer = getLocalizedLesson(sampleLesson, 'en');
assert(enVer.title === sampleLesson.title, "English returns canonical title");
assert(enVer.isFallback === false, "English is not fallback");

const hiLatnVer = getLocalizedLesson(sampleLesson, 'hi-Latn');
assert(hiLatnVer.title.includes('CPython'), `Hinglish translation resolved title: ${hiLatnVer.title}`);
assert(hiLatnVer.isFallback === false, "Hinglish translation is not fallback");

const hiVer = getLocalizedLesson(sampleLesson, 'hi');
assert(hiVer.title.includes('पायथन'), `Hindi translation resolved title: ${hiVer.title}`);
assert(hiVer.isFallback === false, "Hindi translation is not fallback");

// Test fallback for lesson without explicit translation:
const unTranslatedMock = { id: 'les-l4-mock-99', slug: 'mock-slug', title: 'Fallback Test Title', summary: 'Summary' };
const fallbackVer = getLocalizedLesson(unTranslatedMock, 'hi');
assert(fallbackVer.title === 'Fallback Test Title', "Fallback preserves original title");
assert(fallbackVer.isFallback === true, "Un-translated lesson marked as isFallback: true");

// 7. Non-Regression Checks for Levels 1, 2, and 3
console.log("\n7. Verifying Non-Regression for Levels 1, 2, and 3...");
assert(PYTHON_PATH.levels[0].modules.length === 4, "Level 1 has 4 modules");
assert(PYTHON_PATH.levels[1].modules.length === 4, "Level 2 has 4 modules");
assert(PYTHON_PATH.levels[2].modules.length === 8, "Level 3 has 8 modules");
const l1Lessons = PYTHON_PATH.levels[0].modules.flatMap(m => m.topics.flatMap(t => t.lessons)).length;
const l2Lessons = PYTHON_PATH.levels[1].modules.flatMap(m => m.topics.flatMap(t => t.lessons)).length;
const l3Lessons = PYTHON_PATH.levels[2].modules.flatMap(m => m.topics.flatMap(t => t.lessons)).length;
assert(l1Lessons === 12, `Level 1 has 12 lessons (got ${l1Lessons})`);
assert(l2Lessons === 5, `Level 2 has 5 lessons (got ${l2Lessons})`);
assert(l3Lessons === 74, `Level 3 has 74 lessons (got ${l3Lessons})`);
assert(ALL_PROJECTS.length >= 19, `Total projects in registry is >= 19 (got ${ALL_PROJECTS.length})`);
assert(ALL_CHALLENGES.length >= 12, `Total challenges in registry is >= 12 (got ${ALL_CHALLENGES.length})`);

console.log(`\n======================================================`);
console.log(`RESULTS: ${passed} assertions passed, ${failed} assertions failed.`);
console.log(`======================================================`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 ALL LEVEL 4 VERIFICATIONS PASSED WITH ZERO REGRESSIONS!");
}
