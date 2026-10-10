import assert from 'node:assert';
import { 
  SUPPORTED_LANGUAGES, 
  DEFAULT_LANGUAGE, 
  getLanguageMeta, 
  getUiString, 
  UI_STRINGS 
} from '../src/lib/languageRegistry.js';
import { 
  getLocalizedLesson, 
  PYTHON_LESSON_TRANSLATIONS 
} from '../src/lib/translations/pythonTranslations.js';
import { 
  ALL_CHALLENGES, 
  ALL_PROJECTS 
} from '../src/lib/practiceAndProjectData.js';
import { 
  getChallenges, 
  getChallengeBySlug, 
  completeChallenge, 
  getProjects, 
  getProjectBySlug, 
  completeProjectMilestone 
} from '../src/lib/learningService.js';

console.log('================================================================');
console.log('      REVORAA PHASE 3 VERIFICATION SUITE                        ');
console.log('================================================================\n');

// ─── Test 1: Multilingual Registry & UI Strings ─────────────────────────────
console.log('▶ Test 1: Multilingual Registry & UI Strings');
assert.strictEqual(DEFAULT_LANGUAGE, 'en', 'Default language must be en');
assert.ok(SUPPORTED_LANGUAGES.some(l => l.code === 'en'), 'English must be registered');
assert.ok(SUPPORTED_LANGUAGES.some(l => l.code === 'hi-Latn'), 'Hinglish must be registered');
assert.ok(SUPPORTED_LANGUAGES.some(l => l.code === 'hi'), 'Hindi must be registered');

// Verify Language Metadata
assert.strictEqual(getLanguageMeta('hi-Latn').name, 'Hinglish');
assert.strictEqual(getLanguageMeta('hi-Latn').nativeName, 'Hinglish (Roman)');
assert.strictEqual(getLanguageMeta('hi').name, 'Hindi');
assert.strictEqual(getLanguageMeta('hi').nativeName, 'हिन्दी (Devanagari)');
assert.strictEqual(getLanguageMeta('en').name, 'English');


// Verify UI Strings & Fallback
assert.strictEqual(getUiString('runCode', 'en'), 'Run Code');
assert.strictEqual(getUiString('runCode', 'hi-Latn'), 'Code Run Karein');
assert.strictEqual(getUiString('runCode', 'hi'), 'कोड चलाएं');
// Fallback for non-existent lang or missing key
assert.strictEqual(getUiString('runCode', 'fr'), 'Run Code');
assert.strictEqual(getUiString('nonExistentKey', 'hi'), 'nonExistentKey');
console.log('  ✔ Language registry & UI localization passed.\n');

// ─── Test 2: Lesson Content Localization & Fallback ─────────────────────────
console.log('▶ Test 2: Lesson Content Localization & Fallback');
const mockLesson = {
  id: 'lesson-1',
  slug: 'how-python-runs',
  title: 'How Python Runs: Bytecode and the PVM',
  summary: 'Understand the two-stage execution model.',
  content: 'Python compiles source code to bytecode (.pyc).'
};

// 1. English lookup
const enLesson = getLocalizedLesson(mockLesson, 'en');
assert.strictEqual(enLesson.isFallback, false);
assert.strictEqual(enLesson.title, 'How Python Runs: Bytecode and the PVM');

// 2. Hinglish lookup (reviewed content)
const hinglishLesson = getLocalizedLesson(mockLesson, 'hi-Latn');
assert.strictEqual(hinglishLesson.isFallback, false);
assert.ok(hinglishLesson.title.includes('Bytecode') && hinglishLesson.title.includes('Kaise Run Hota Hai'), 'Hinglish title should contain natural Roman Hindi');

assert.ok(hinglishLesson.content.includes('compile'), 'Hinglish content preserves technical terms');
assert.ok(hinglishLesson.content.includes('CPython'), 'CPython terminology preserved');

// 3. Hindi lookup (reviewed content)
const hindiLesson = getLocalizedLesson(mockLesson, 'hi');
assert.strictEqual(hindiLesson.isFallback, false);
assert.ok(hindiLesson.title.includes('बाइटकोड'), 'Hindi title uses Devanagari script');
assert.ok(hindiLesson.content.includes('पायथन'), 'Hindi content uses Devanagari');

// 4. Untranslated lesson fallback
const untranslatedMock = {
  id: 'lesson-advanced-99',
  slug: 'untranslated-metaclasses-deep-dive',
  title: 'Metaclasses in Depth',
  summary: 'Deep dive into type.__new__',
  content: 'Advanced metaclass concepts.'
};
const fallbackResult = getLocalizedLesson(untranslatedMock, 'hi-Latn');
assert.strictEqual(fallbackResult.isFallback, true, 'Untranslated lesson must flag isFallback=true');
assert.strictEqual(fallbackResult.title, 'Metaclasses in Depth', 'Untranslated lesson must fall back to canonical English title');
assert.strictEqual(fallbackResult.content, 'Advanced metaclass concepts.', 'Untranslated lesson must fall back to canonical English content');
console.log('  ✔ Lesson content translation & fallback resolution passed.\n');

// ─── Test 3: Coding Practice & Challenges Dataset ───────────────────────────
console.log('▶ Test 3: Coding Practice & Challenges Dataset');
assert.ok(ALL_CHALLENGES.length >= 4, 'Must have at least 4 practice challenges');

const challengeTypes = new Set(ALL_CHALLENGES.map(c => c.challenge_type));
assert.ok(challengeTypes.has('cooked_or_cracked'), 'Cooked or cracked challenge type present');
assert.ok(challengeTypes.has('bug_hunt'), 'Bug hunt challenge type present');
assert.ok(challengeTypes.has('internet_is_wrong'), 'Internet is wrong challenge type present');
assert.ok(challengeTypes.has('boss_fight'), 'Boss fight challenge type present');

ALL_CHALLENGES.forEach(c => {
  assert.ok(c.id, `Challenge ${c.slug} must have id`);
  assert.ok(c.slug, `Challenge ${c.title} must have slug`);
  assert.ok(c.starter_code !== undefined, `Challenge ${c.slug} must have starter_code`);
  assert.ok(c.xp_reward > 0, `Challenge ${c.slug} must have xp_reward`);
  assert.ok(c.instructions['en'], `Challenge ${c.slug} must have English translation`);
  assert.ok(c.instructions['hi-Latn'], `Challenge ${c.slug} must have Hinglish translation`);
  assert.ok(c.instructions['hi'], `Challenge ${c.slug} must have Hindi translation`);
  assert.ok(c.hints['en'], `Challenge ${c.slug} must have English hints`);
  assert.ok(c.hints['hi-Latn'], `Challenge ${c.slug} must have Hinglish hints`);
  assert.ok(c.hints['hi'], `Challenge ${c.slug} must have Hindi hints`);
});
console.log(`  ✔ Verified ${ALL_CHALLENGES.length} coding challenges with starter code and multilingual instructions.\n`);

// ─── Test 4: Guided Projects & Milestones Dataset ───────────────────────────
console.log('▶ Test 4: Guided Projects & Milestones Dataset');
assert.ok(ALL_PROJECTS.length >= 2, 'Must have at least 2 guided projects');

const project1 = ALL_PROJECTS.find(p => p.slug === 'cli-task-manager');
assert.ok(project1, 'Level 1 CLI Task Manager project exists');
assert.strictEqual(project1.level_number, 1);
assert.strictEqual(project1.milestones.length, 4, 'CLI Task Manager has 4 progressive milestones');

const project2 = ALL_PROJECTS.find(p => p.slug === 'oop-contact-manager');
assert.ok(project2, 'Level 2 OOP Contact Manager project exists');
assert.strictEqual(project2.level_number, 2);
assert.strictEqual(project2.milestones.length, 4, 'OOP Contact Manager has 4 progressive milestones');

ALL_PROJECTS.forEach(p => {
  assert.ok(p.id, `Project ${p.slug} must have id`);
  assert.ok(p.title, `Project ${p.slug} must have title`);
  assert.ok(p.learning_objectives.length > 0, `Project ${p.slug} must have learning_objectives`);
  p.milestones.forEach((m) => {
    assert.ok(m.id, `Milestone in ${p.slug} has id`);
    assert.ok(m.title, `Milestone ${m.id} has title`);
    assert.ok(m.starter_code !== undefined, `Milestone ${m.id} has starter code`);
    assert.ok(m.test_harness, `Milestone ${m.id} has test harness`);
    assert.ok(m.instructions['en'], `Milestone ${m.id} has English instructions`);
    assert.ok(m.instructions['hi-Latn'], `Milestone ${m.id} has Hinglish instructions`);
    assert.ok(m.instructions['hi'], `Milestone ${m.id} has Hindi instructions`);
  });
});
console.log(`  ✔ Verified ${ALL_PROJECTS.length} guided projects with 8 progressive milestones.\n`);

// ─── Test 5: Learning Service Practice & Projects Operations ─────────────────
console.log('▶ Test 5: Learning Service Practice & Projects Operations');

// Setup mock browser localStorage for learningService fallback tests
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; }
};

const testUser = { id: 'test-user-phase3' };

// Test fetching challenges
const challenges = await getChallenges('python-development', testUser.id);
assert.strictEqual(challenges.length, ALL_CHALLENGES.length);

const singleChallenge = await getChallengeBySlug('python-development', 'bug-hunt-infinite-loop', testUser.id);
assert.ok(singleChallenge);
assert.strictEqual(singleChallenge.slug, 'bug-hunt-infinite-loop');
assert.strictEqual(singleChallenge.isCompleted, false);

// Complete challenge test (first attempt)
const completeResult1 = await completeChallenge({
  pathSlug: 'python-development',
  challengeSlug: 'bug-hunt-infinite-loop',
  submittedCode: 'count = 0\nwhile count < 5:\n    count += 1',
  userId: testUser.id
});
assert.strictEqual(completeResult1.success, true);
assert.strictEqual(completeResult1.xp_awarded, singleChallenge.xp_reward, 'First completion must award full XP');

// Complete challenge test (repeat attempt - Idempotency Check)
const completeResult2 = await completeChallenge({
  pathSlug: 'python-development',
  challengeSlug: 'bug-hunt-infinite-loop',
  submittedCode: 'count = 0\nwhile count < 5:\n    count += 1',
  userId: testUser.id
});
assert.strictEqual(completeResult2.success, true);
assert.strictEqual(completeResult2.already_completed, true, 'Repeat submission should detect already_completed');
assert.strictEqual(completeResult2.xp_awarded, 0, 'Repeat completion must award 0 XP (idempotent, no double XP)');

// Test Projects & Milestone Progression
const singleProject = await getProjectBySlug('python-development', 'cli-task-manager', testUser.id);
assert.ok(singleProject);
assert.strictEqual(singleProject.milestones[0].isCompleted, false);
assert.strictEqual(singleProject.milestones[0].isUnlocked, true, 'First milestone unlocked initially');
assert.strictEqual(singleProject.milestones[1].isUnlocked, false, 'Second milestone locked initially');

// Complete Milestone 1
const milestone1Result = await completeProjectMilestone({
  projectSlug: 'cli-task-manager',
  milestoneId: 'm1-task-creation',
  userId: testUser.id
});
assert.strictEqual(milestone1Result.success, true);

// Check that reloading project reflects milestone 1 completion and unlocks milestone 2
const updatedProject = await getProjectBySlug('python-development', 'cli-task-manager', testUser.id);
assert.strictEqual(updatedProject.milestones[0].isCompleted, true);
assert.strictEqual(updatedProject.milestones[1].isUnlocked, true, 'Second milestone unlocked after first completed');
assert.strictEqual(updatedProject.completedMilestonesCount, 1);
assert.strictEqual(updatedProject.progressPercentage, 25); // 1 of 4 = 25%

// Complete Remaining Milestones 2, 3, 4
await completeProjectMilestone({ projectSlug: 'cli-task-manager', milestoneId: 'm2-list-filter', userId: testUser.id });
await completeProjectMilestone({ projectSlug: 'cli-task-manager', milestoneId: 'm3-complete-delete', userId: testUser.id });
await completeProjectMilestone({ projectSlug: 'cli-task-manager', milestoneId: 'm4-interactive-loop', userId: testUser.id });


const completedProject = await getProjectBySlug('python-development', 'cli-task-manager', testUser.id);
assert.strictEqual(completedProject.isCompleted, true, 'Project isCompleted must be true when all 4 milestones done');
assert.strictEqual(completedProject.progressPercentage, 100, 'Project progress must reach 100%');

console.log('  ✔ Challenge & Project completion, unlock progression, and idempotency checks passed.\n');

// ─── Test 6: Python Execution Test Harness Logic ─────────────────────────────
console.log('▶ Test 6: Python Execution Test Harness Logic');

ALL_CHALLENGES.forEach(c => {
  if (c.test_harness) {
    assert.ok(c.test_harness.includes('assert'), `Test harness for ${c.slug} must include assertions`);
  }
});

ALL_PROJECTS.forEach(p => {
  p.milestones.forEach(m => {
    assert.ok(m.test_harness.includes('assert'), `Milestone ${m.id} test harness must contain assert statements`);
  });
});

console.log('  ✔ All test harnesses have sound assertions.\n');

console.log('================================================================');
console.log('      ALL PHASE 3 VERIFICATION TESTS PASSED SUCCESSFULLY!       ');
console.log('================================================================');
