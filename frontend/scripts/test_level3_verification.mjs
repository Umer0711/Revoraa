import assert from 'node:assert';
import { PYTHON_PATH } from '../src/lib/learningData.js';
import { LEVEL_3_DEFINITION, LEVEL_3_MODULES } from '../src/lib/curriculum/level3Modules.js';
import { ALL_CHALLENGES, ALL_PROJECTS } from '../src/lib/practiceAndProjectData.js';
import { getLocalizedLesson } from '../src/lib/translations/pythonTranslations.js';

console.log('================================================================');
console.log('      REVORAA LEVEL 3: INTERMEDIATE PYTHON VERIFICATION         ');
console.log('================================================================\n');

// ─── Test 1: Level 3 Curriculum Hierarchy & Architecture ─────────────────────
console.log('▶ Test 1: Level 3 Curriculum Hierarchy & Architecture');
assert.ok(PYTHON_PATH, 'PYTHON_PATH must be defined');
assert.strictEqual(PYTHON_PATH.slug, 'python-development');

const level3 = PYTHON_PATH.levels.find(l => l.level_number === 3);
assert.ok(level3, 'Level 3 must be present in PYTHON_PATH.levels');
assert.strictEqual(level3.title, 'Intermediate Python');
assert.strictEqual(level3.modules.length, 8, 'Level 3 must have exactly 8 modules');

const expectedModules = [
  { slug: 'advanced-data-structures', lessonCount: 8, title: 'Advanced Data Structures' },
  { slug: 'iterators-and-generators', lessonCount: 8, title: 'Iterators and Generators' },
  { slug: 'functions-closures-decorators', lessonCount: 9, title: 'Functions, Closures, and Decorators' },
  { slug: 'comprehensions-functional-programming', lessonCount: 9, title: 'Comprehensions and Functional Programming' },
  { slug: 'http-apis-json', lessonCount: 10, title: 'HTTP, APIs, and JSON' },
  { slug: 'database-integration', lessonCount: 10, title: 'Database Integration' },
  { slug: 'modular-design-maintainability', lessonCount: 10, title: 'Modular Design and Maintainability' },
  { slug: 'intermediate-python-testing-debugging', lessonCount: 10, title: 'Intermediate Python Testing and Debugging' }
];

let totalL3Lessons = 0;
expectedModules.forEach((expected, index) => {
  const mod = level3.modules[index];
  assert.ok(mod, `Module ${index + 1} (${expected.slug}) must exist`);
  assert.strictEqual(mod.slug, expected.slug, `Module ${index + 1} slug mismatch`);
  assert.strictEqual(mod.title, expected.title, `Module ${index + 1} title mismatch`);
  assert.strictEqual(mod.lessons.length, expected.lessonCount, `Module ${expected.slug} must have ${expected.lessonCount} lessons, found ${mod.lessons.length}`);
  totalL3Lessons += mod.lessons.length;
});

assert.strictEqual(totalL3Lessons, 74, 'Level 3 must contain exactly 74 lessons across 8 modules');
console.log(`  ✔ Verified all 8 modules and 74 intermediate lessons.\n`);

// ─── Test 2: Substantive Pedagogical Content Completeness ───────────────────
console.log('▶ Test 2: Substantive Pedagogical Content Quality & Checks');
let totalQuestions = 0;
level3.modules.forEach(mod => {
  mod.lessons.forEach(lesson => {
    assert.ok(lesson.id, `Lesson ${lesson.slug} must have id`);
    assert.ok(lesson.slug, `Lesson in ${mod.slug} must have slug`);
    assert.ok(lesson.title && lesson.title.length > 5, `Lesson ${lesson.slug} must have substantive title`);
    assert.ok(lesson.summary && lesson.summary.length > 15, `Lesson ${lesson.slug} must have substantive summary`);
    assert.ok(lesson.estimated_minutes >= 10, `Lesson ${lesson.slug} must have estimated_minutes >= 10`);
    assert.ok(lesson.xp_reward >= 25, `Lesson ${lesson.slug} must have xp_reward >= 25`);

    // Pedagogical sections
    assert.ok(Array.isArray(lesson.learning_objectives) && lesson.learning_objectives.length >= 2,
      `Lesson ${lesson.slug} must have at least 2 learning objectives`);
    assert.ok(typeof lesson.content_markdown === 'string' && lesson.content_markdown.length >= 250,
      `Lesson ${lesson.slug} content_markdown must be substantive (length ${lesson.content_markdown.length})`);
    assert.ok(Array.isArray(lesson.key_takeaways) && lesson.key_takeaways.length >= 2,
      `Lesson ${lesson.slug} must have at least 2 key takeaways`);
    assert.ok(Array.isArray(lesson.revision_prompts) && lesson.revision_prompts.length >= 2,
      `Lesson ${lesson.slug} must have at least 2 revision prompts`);

    // Assessment knowledge checks
    assert.ok(lesson.quiz, `Lesson ${lesson.slug} must have a quiz object`);
    assert.ok(lesson.quiz.id && lesson.quiz.title, `Lesson ${lesson.slug} quiz must have id and title`);
    assert.ok(Array.isArray(lesson.quiz.questions) && lesson.quiz.questions.length >= 1,
      `Lesson ${lesson.slug} quiz must have at least 1 question`);

    lesson.quiz.questions.forEach(q => {
      assert.ok(q.id, `Quiz question in ${lesson.slug} must have id`);
      assert.ok(q.question_text && q.question_text.length > 10, `Quiz question in ${lesson.slug} must have question text`);
      assert.ok(Array.isArray(q.options) && q.options.length >= 3, `Quiz question in ${lesson.slug} must have >= 3 options`);
      assert.ok(Array.isArray(q.correct_option_ids) && q.correct_option_ids.length >= 1,
        `Quiz question in ${lesson.slug} must specify correct_option_ids`);
      q.correct_option_ids.forEach(ansId => {
        assert.ok(q.options.some(opt => opt.id === ansId),
          `Quiz question in ${lesson.slug} correct option id ${ansId} must match one of options`);
      });
      assert.ok(q.explanation && q.explanation.length > 15, `Quiz question in ${lesson.slug} must have pedagogical explanation`);
      totalQuestions++;
    });
  });
});

console.log(`  ✔ Verified 74 lessons for deep pedagogical completeness and ${totalQuestions} knowledge check questions.\n`);

// ─── Test 3: Capstone Final Assessment Verification ─────────────────────────
console.log('▶ Test 3: Capstone Final Assessment');
const capstoneLesson = level3.modules[7].lessons.find(l => l.slug === 'level-3-capstone-assessment');
assert.ok(capstoneLesson, 'Module 8 Lesson 10 must be the Final Intermediate Assessment');
assert.strictEqual(capstoneLesson.quiz.questions.length, 5, 'Capstone assessment must contain 5 comprehensive questions');
assert.strictEqual(capstoneLesson.xp_reward, 100, 'Capstone lesson awards 100 XP');
console.log('  ✔ Capstone 5-question multi-concept assessment verified.\n');

// ─── Test 4: Guided Projects Verification (All 8 Modules) ────────────────────
console.log('▶ Test 4: Level 3 Guided Projects (8 Modules, 32 Milestones)');
const expectedProjectSlugs = [
  'student-records-analyzer',
  'lazy-data-processing-pipeline',
  'reusable-function-utilities',
  'data-transformation-toolkit',
  'api-explorer',
  'personal-expense-tracker',
  'modular-task-manager',
  'repair-and-test-broken-package'
];

expectedProjectSlugs.forEach(slug => {
  const proj = ALL_PROJECTS.find(p => p.slug === slug);
  assert.ok(proj, `Project with slug ${slug} must be registered in ALL_PROJECTS`);
  assert.strictEqual(proj.level_number, 3, `Project ${slug} must have level_number 3`);
  assert.strictEqual(proj.difficulty, 'intermediate', `Project ${slug} must be intermediate`);
  assert.ok(proj.description.en && proj.description['hi-Latn'] && proj.description.hi,
    `Project ${slug} must have descriptions in en, hi-Latn, and hi`);
  assert.strictEqual(proj.milestones.length, 4, `Project ${slug} must have exactly 4 progressive milestones`);

  proj.milestones.forEach(m => {
    assert.ok(m.id && m.title, `Milestone in ${slug} must have id and title`);
    assert.ok(m.instructions.en && m.instructions['hi-Latn'] && m.instructions.hi,
      `Milestone ${m.id} in ${slug} must have instructions in all 3 languages`);
    assert.ok(m.starter_code && m.starter_code.length > 20, `Milestone ${m.id} in ${slug} must have starter_code`);
    assert.ok(m.test_harness && m.test_harness.length > 20, `Milestone ${m.id} in ${slug} must have test_harness`);
  });
});
console.log('  ✔ All 8 Level 3 guided projects verified (32 milestones with test harnesses).\n');

// ─── Test 5: Gen Z Challenge Modes Verification ─────────────────────────────
console.log('▶ Test 5: Gen Z Challenge Modes Integration');
const expectedChallenges = [
  { slug: 'cooked-or-cracked-generator', type: 'cooked_or_cracked' },
  { slug: 'bug-hunt-decorator-scope', type: 'bug_hunt' },
  { slug: 'internet-is-wrong-sort-return', type: 'internet_is_wrong' },
  { slug: 'boss-fight-streamed-log-aggregator', type: 'boss_fight' },
  { slug: 'escape-room-decorator-vault', type: 'code_escape_room' }
];

expectedChallenges.forEach(exp => {
  const chal = ALL_CHALLENGES.find(c => c.slug === exp.slug);
  assert.ok(chal, `Challenge ${exp.slug} must exist in ALL_CHALLENGES`);
  assert.strictEqual(chal.challenge_type, exp.type, `Challenge ${exp.slug} type mismatch`);
  assert.strictEqual(chal.difficulty, 'intermediate', `Challenge ${exp.slug} must be intermediate`);
  assert.ok(chal.instructions.en && chal.instructions['hi-Latn'] && chal.instructions.hi,
    `Challenge ${exp.slug} must have instructions in en, hi-Latn, and hi`);
  assert.ok(chal.hints.en && chal.hints['hi-Latn'] && chal.hints.hi,
    `Challenge ${exp.slug} must have hints in all 3 languages`);
  assert.ok(chal.solution_explanation.en && chal.solution_explanation['hi-Latn'] && chal.solution_explanation.hi,
    `Challenge ${exp.slug} must have solution explanation in all 3 languages`);
  assert.ok(chal.starter_code, `Challenge ${exp.slug} must have starter code`);
  if (exp.type === 'cooked_or_cracked') {
    assert.ok(chal.expected_output, `Challenge ${exp.slug} must have expected_output`);
  } else {
    assert.ok(chal.test_harness, `Challenge ${exp.slug} must have test_harness`);
  }
});
console.log('  ✔ All 5 Gen Z challenge modes (Cooked or Cracked, Bug Hunt, Internet Is Wrong, Boss Fight, Escape Room) verified.\n');

// ─── Test 6: Multilingual Support (en, hi-Latn, hi) & Fallback ──────────────
console.log('▶ Test 6: Multilingual Localization & Fallback Safety');
const sampleLesson = level3.modules[0].lessons[0]; // Revisiting collections

// 1. English
const enRes = getLocalizedLesson(sampleLesson, 'en');
assert.strictEqual(enRes.resolvedLanguage, 'en');
assert.strictEqual(enRes.isFallback, false);

// 2. Hinglish
const hiLatnRes = getLocalizedLesson(sampleLesson, 'hi-Latn');
assert.strictEqual(hiLatnRes.resolvedLanguage, 'hi-Latn');
assert.strictEqual(hiLatnRes.isFallback, false);
assert.ok(hiLatnRes.title.includes('Collections') || hiLatnRes.title.includes('Deep Dive'),
  'Hinglish translation must maintain technical terms');

// 3. Hindi
const hiRes = getLocalizedLesson(sampleLesson, 'hi');
assert.strictEqual(hiRes.resolvedLanguage, 'hi');
assert.strictEqual(hiRes.isFallback, false);
assert.ok(hiRes.title.includes('पायथन') || hiRes.title.includes('कलेक्शन्स'),
  'Hindi translation must use Devanagari script');

// 4. Transparent Fallback
const unTranslatedLesson = { id: 'untranslated-mock-id', slug: 'random-slug', title: 'English Title', content: 'English Content' };
const fallbackRes = getLocalizedLesson(unTranslatedLesson, 'hi');
assert.strictEqual(fallbackRes.isFallback, true);
assert.strictEqual(fallbackRes.resolvedLanguage, 'en');
assert.strictEqual(fallbackRes.title, 'English Title');
console.log('  ✔ Multilingual localization and transparent fallback behavior verified.\n');

// ─── Test 7: Non-Regression & Scope Boundaries ──────────────────────────────
console.log('▶ Test 7: Non-Regression & Scope Boundaries');
// Level 1: Beginner
const level1 = PYTHON_PATH.levels.find(l => l.level_number === 1);
assert.ok(level1, 'Level 1 must still exist');
assert.strictEqual(level1.modules.length, 4, 'Level 1 has 4 modules');
const level1Lessons = level1.modules.reduce((acc, m) => acc + (m.lessons?.length || m.topics.reduce((tAcc, t) => tAcc + t.lessons.length, 0)), 0);
assert.strictEqual(level1Lessons, 12, 'Level 1 has 12 lessons');

// Level 2: Foundation
const level2 = PYTHON_PATH.levels.find(l => l.level_number === 2);
assert.ok(level2, 'Level 2 must still exist');
assert.strictEqual(level2.modules.length, 4, 'Level 2 has 4 modules');
const level2Lessons = level2.modules.reduce((acc, m) => acc + (m.lessons?.length || m.topics.reduce((tAcc, t) => tAcc + t.lessons.length, 0)), 0);
assert.strictEqual(level2Lessons, 5, 'Level 2 has 5 lessons');

// Total path lessons for Levels 1, 2, and 3
const totalL123Lessons = level1Lessons + level2Lessons + totalL3Lessons;
assert.strictEqual(totalL123Lessons, 91, 'Total lessons for Levels 1-3 must equal 91');
assert.ok(PYTHON_PATH.total_lessons >= 91, 'PYTHON_PATH total_lessons must be >= 91');
console.log('  ✔ Verified Level 1, Level 2, and Level 3 intactness.\n');

console.log('================================================================');
console.log('    🎉 ALL LEVEL 3 INTERMEDIATE PYTHON TESTS PASSED (7/7)       ');
console.log('================================================================\n');
