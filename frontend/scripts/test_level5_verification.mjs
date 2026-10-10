/**
 * test_level5_verification.mjs
 * Comprehensive Verification Suite for Revoraa Level 5: Expert / Production Python
 */

import { PYTHON_PATH, ALL_LEARNING_PATHS } from '../src/lib/learningData.js';
import { LEVEL_5_MODULES, LEVEL_5_DEFINITION } from '../src/lib/curriculum/level5Modules.js';
import { LEVEL_5_PROJECTS } from '../src/lib/curriculum/level5Projects.js';
import { LEVEL_5_CHALLENGES } from '../src/lib/curriculum/level5Challenges.js';
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

console.log("=== REVORAA LEVEL 5 EXPERT / PRODUCTION PYTHON VERIFICATION SUITE ===\n");

// 1. Path & Levels Structure
console.log("1. Verifying Path and Levels Hierarchy...");
assert(PYTHON_PATH.levels.length === 5, `Expected 5 levels, got ${PYTHON_PATH.levels.length}`);
assert(PYTHON_PATH.levels[0].level_number === 1, "Level 1 exists");
assert(PYTHON_PATH.levels[1].level_number === 2, "Level 2 exists");
assert(PYTHON_PATH.levels[2].level_number === 3, "Level 3 exists");
assert(PYTHON_PATH.levels[3].level_number === 4, "Level 4 exists");
assert(PYTHON_PATH.levels[4].level_number === 5, "Level 5 exists");
assert(PYTHON_PATH.levels[4].title === "Expert / Production Python", `Level 5 title is 'Expert / Production Python', got '${PYTHON_PATH.levels[4].title}'`);
assert(PYTHON_PATH.total_lessons === 279, `Total path lessons expected 279, got ${PYTHON_PATH.total_lessons}`);
assert(PYTHON_PATH.estimated_hours === 190, `Total estimated hours expected 190, got ${PYTHON_PATH.estimated_hours}`);

// 2. Level 5 Modules Check
console.log("\n2. Verifying Level 5 Modules...");
assert(LEVEL_5_MODULES.length === 8, `Expected 8 Level 5 modules, got ${LEVEL_5_MODULES.length}`);
const expectedModuleSlugs = [
  'professional-python-project-structure',
  'packaging-and-distribution',
  'configuration-security-and-secrets',
  'production-testing-and-quality-assurance',
  'apis-databases-and-production-reliability',
  'docker-and-deployment-fundamentals',
  'cicd-monitoring-and-operations',
  'production-readiness-and-final-assessment'
];

expectedModuleSlugs.forEach((slug, idx) => {
  const mod = LEVEL_5_MODULES[idx];
  assert(mod && mod.slug === slug, `Module ${idx + 1} slug expected '${slug}', got '${mod?.slug}'`);
  assert(mod.level_number === 5, `Module ${idx + 1} level_number is 5`);
  assert(mod.topics.length >= 2, `Module ${idx + 1} has at least 2 topics`);
});

// 3. Level 5 Lessons Completeness (94 lessons total: Mod 1 has 10, Mods 2-8 have 12 each)
console.log("\n3. Verifying Level 5 Lessons Detail & Integrity...");
let l5TotalLessons = 0;
const lessonSlugsSeen = new Set();

LEVEL_5_MODULES.forEach((mod, modIdx) => {
  const modLessons = mod.topics.flatMap(t => t.lessons);
  l5TotalLessons += modLessons.length;
  
  if (modIdx === 0) {
    assert(modLessons.length === 10, `Module 1 expected 10 lessons, got ${modLessons.length}`);
  } else {
    assert(modLessons.length === 12, `Module ${modIdx + 1} expected 12 lessons, got ${modLessons.length}`);
  }

  modLessons.forEach(les => {
    assert(les.id && les.id.length > 3, `Lesson ${les.slug} has valid id (${les.id})`);
    assert(les.title && les.title.length > 5, `Lesson ${les.slug} has title`);
    assert(les.summary && les.summary.length > 10, `Lesson ${les.slug} has summary`);
    const contentText = les.content || les.content_markdown;
    assert(contentText && contentText.length > 100, `Lesson ${les.slug} has substantive content`);
    assert(Array.isArray(les.learning_objectives) && les.learning_objectives.length >= 2, `Lesson ${les.slug} has learning objectives`);
    const code = les.interactive_code || les.code_snippet;
    assert(code && code.length > 20, `Lesson ${les.slug} has executable/interactive code`);
    
    // Quiz structure check
    const qList = les.quiz?.questions || (les.quiz?.options ? [les.quiz] : []);
    assert(qList.length >= 1 && Array.isArray(qList[0].options) && qList[0].correct_option_ids?.length >= 1, `Lesson ${les.slug} has valid quiz questions`);
    
    // Check uniqueness
    assert(!lessonSlugsSeen.has(les.slug), `Duplicate lesson slug detected: ${les.slug}`);
    lessonSlugsSeen.add(les.slug);
  });
});

assert(l5TotalLessons === 94, `Expected exactly 94 Level 5 lessons, got ${l5TotalLessons}`);

// Verify Lesson 12 in Module 8 (Final Assessment)
const finalLesson = LEVEL_5_MODULES[7].topics[1].lessons[5]; // capstone-evaluation-retrospective
assert(finalLesson.slug === 'capstone-evaluation-retrospective', `Final lesson slug is 'capstone-evaluation-retrospective', got '${finalLesson.slug}'`);
assert(finalLesson.quiz.questions.length === 5, `Final assessment has 5 comprehensive questions, got ${finalLesson.quiz.questions.length}`);
assert(finalLesson.xp_reward === 150, `Final assessment awards 150 XP, got ${finalLesson.xp_reward}`);

// 4. Projects Verification (8 Module Projects + 1 Capstone = 9 Projects, 42 milestones)
console.log("\n4. Verifying Level 5 Projects & Milestones...");
assert(LEVEL_5_PROJECTS.length === 9, `Expected 9 Level 5 projects (8 module + 1 capstone), got ${LEVEL_5_PROJECTS.length}`);

let totalL5Milestones = 0;
LEVEL_5_PROJECTS.forEach(proj => {
  assert(proj.level_number === 5, `Project ${proj.slug} has level_number 5`);
  assert(proj.difficulty === 'expert', `Project ${proj.slug} difficulty is expert`);
  assert(proj.xp_reward >= 240, `Project ${proj.slug} has meaningful XP`);
  assert(proj.description.en && proj.description['hi-Latn'] && proj.description.hi, `Project ${proj.slug} has trilingual descriptions`);
  
  if (proj.slug === 'production-python-project-lab') {
    assert(proj.milestones.length === 10, `Capstone project has 10 milestones, got ${proj.milestones.length}`);
    assert(proj.xp_reward === 500, `Capstone project awards 500 XP, got ${proj.xp_reward}`);
  } else {
    assert(proj.milestones.length === 4, `Module project ${proj.slug} has 4 milestones, got ${proj.milestones.length}`);
  }
  
  proj.milestones.forEach((m) => {
    totalL5Milestones++;
    assert(m.title && m.title.length > 5, `Milestone ${m.id} has title`);
    assert(m.instructions.en && m.instructions['hi-Latn'] && m.instructions.hi, `Milestone ${m.id} has trilingual instructions`);
    assert(m.starter_code && m.starter_code.length > 20, `Milestone ${m.id} has starter code`);
    assert(m.test_harness && m.test_harness.includes('assert'), `Milestone ${m.id} test harness contains assertions`);
  });
});
assert(totalL5Milestones === 42, `Expected 42 total Level 5 milestones (8x4 + 10 = 42), got ${totalL5Milestones}`);

// 5. Challenges Verification (5 interactive challenge modes)
console.log("\n5. Verifying Level 5 Interactive Challenges...");
assert(LEVEL_5_CHALLENGES.length === 5, `Expected 5 Level 5 challenges, got ${LEVEL_5_CHALLENGES.length}`);
const expectedChallengeTypes = ['cooked_or_cracked', 'bug_hunt', 'internet_is_wrong', 'boss_fight', 'code_escape_room'];

LEVEL_5_CHALLENGES.forEach(chal => {
  assert(chal.level_number === 5, `Challenge ${chal.slug} level_number is 5`);
  assert(chal.difficulty === 'expert', `Challenge ${chal.slug} difficulty is expert`);
  assert(expectedChallengeTypes.includes(chal.challenge_type), `Challenge ${chal.slug} has recognized type ${chal.challenge_type}`);
  assert(chal.instructions.en && chal.instructions['hi-Latn'] && chal.instructions.hi, `Challenge ${chal.slug} has trilingual instructions`);
  assert(chal.hints.en && chal.hints['hi-Latn'] && chal.hints.hi, `Challenge ${chal.slug} has trilingual hints`);
  assert(chal.starter_code && chal.starter_code.length > 20, `Challenge ${chal.slug} has starter code`);
  assert(chal.expected_output && chal.expected_output.length > 5, `Challenge ${chal.slug} has expected output`);
});

// 6. Multilingual Translation & Fallback Behavior
console.log("\n6. Verifying Multilingual Localization & Fallback...");
const sampleLesson = LEVEL_5_MODULES[0].topics[0].lessons[0]; // from-scripts-to-maintainable-applications
const enVer = getLocalizedLesson(sampleLesson, 'en');
assert(enVer.title === sampleLesson.title, "English returns canonical title");
assert(enVer.isFallback === false, "English is not fallback");

const hiLatnVer = getLocalizedLesson(sampleLesson, 'hi-Latn');
assert(hiLatnVer.title.includes('Scripts'), `Hinglish translation resolved title: ${hiLatnVer.title}`);
assert(hiLatnVer.isFallback === false, "Hinglish translation is not fallback");

const hiVer = getLocalizedLesson(sampleLesson, 'hi');
assert(hiVer.title.includes('स्क्रिप्ट'), `Hindi translation resolved title: ${hiVer.title}`);
assert(hiVer.isFallback === false, "Hindi translation is not fallback");

// Test fallback for lesson without explicit translation:
const unTranslatedMock = { id: 'l5-mock-99', slug: 'mock-slug', title: 'Fallback Test Title', summary: 'Summary' };
const fallbackVer = getLocalizedLesson(unTranslatedMock, 'hi');
assert(fallbackVer.title === 'Fallback Test Title', "Fallback preserves original title");
assert(fallbackVer.isFallback === true, "Un-translated lesson marked as isFallback: true");

// 7. Non-Regression Checks for Levels 1, 2, 3, and 4
console.log("\n7. Verifying Non-Regression for Levels 1, 2, 3, and 4...");
assert(PYTHON_PATH.levels[0].modules.length === 4, "Level 1 has 4 modules");
assert(PYTHON_PATH.levels[1].modules.length === 4, "Level 2 has 4 modules");
assert(PYTHON_PATH.levels[2].modules.length === 8, "Level 3 has 8 modules");
assert(PYTHON_PATH.levels[3].modules.length === 8, "Level 4 has 8 modules");
assert(PYTHON_PATH.levels[4].modules.length === 8, "Level 5 has 8 modules");

const l1Lessons = PYTHON_PATH.levels[0].modules.flatMap(m => m.topics.flatMap(t => t.lessons)).length;
const l2Lessons = PYTHON_PATH.levels[1].modules.flatMap(m => m.topics.flatMap(t => t.lessons)).length;
const l3Lessons = PYTHON_PATH.levels[2].modules.flatMap(m => m.topics.flatMap(t => t.lessons)).length;
const l4Lessons = PYTHON_PATH.levels[3].modules.flatMap(m => m.topics.flatMap(t => t.lessons)).length;
const l5Lessons = PYTHON_PATH.levels[4].modules.flatMap(m => m.topics.flatMap(t => t.lessons)).length;

assert(l1Lessons === 12, `Level 1 has 12 lessons (got ${l1Lessons})`);
assert(l2Lessons === 5, `Level 2 has 5 lessons (got ${l2Lessons})`);
assert(l3Lessons === 74, `Level 3 has 74 lessons (got ${l3Lessons})`);
assert(l4Lessons === 94, `Level 4 has 94 lessons (got ${l4Lessons})`);
assert(l5Lessons === 94, `Level 5 has 94 lessons (got ${l5Lessons})`);
assert(l1Lessons + l2Lessons + l3Lessons + l4Lessons + l5Lessons === 279, "Sum of all lessons equals 279");

assert(ALL_PROJECTS.length === 28, `Total projects in registry is 28 (got ${ALL_PROJECTS.length})`);
assert(ALL_CHALLENGES.length === 19, `Total challenges in registry is 19 (got ${ALL_CHALLENGES.length})`);

console.log(`\n======================================================`);
console.log(`RESULTS: ${passed} assertions passed, ${failed} assertions failed.`);
console.log(`======================================================`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 ALL LEVEL 5 VERIFICATIONS PASSED WITH ZERO REGRESSIONS!");
}
