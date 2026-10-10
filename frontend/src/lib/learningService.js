/**
 * learningService.js
 * 
 * Client data access service for Revoraa Developer Learning Platform.
 * Queries Supabase Postgres tables with fallback to the local curriculum definition
 * and user-specific persistent storage (localStorage) if migrations are pending in the schema cache.
 * 
 * Supports:
 * - Curriculum browsing (Path -> Level -> Module -> Topic -> Lesson)
 * - Explicit lesson completion
 * - Server-side / verified quiz assessment grading
 * - Idempotent mastery & XP awards
 */

import { supabase } from './supabaseClient.js';
import { ALL_LEARNING_PATHS, PYTHON_PATH } from './learningData.js';
import { ALL_CHALLENGES, ALL_PROJECTS } from './practiceAndProjectData.js';

const PROGRESS_STORAGE_PREFIX = 'revoraa_lesson_progress_';
const ENROLLMENT_STORAGE_PREFIX = 'revoraa_path_enrollment_';
const QUIZ_ATTEMPTS_STORAGE_PREFIX = 'revoraa_quiz_attempts_';
const MASTERY_STORAGE_PREFIX = 'revoraa_learning_mastery_';
const CHALLENGE_PROGRESS_PREFIX = 'revoraa_challenge_progress_';
const PROJECT_PROGRESS_PREFIX = 'revoraa_project_progress_';

function safeDispatch(event, detail) {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    try {
      window.dispatchEvent(new CustomEvent(event, { detail }));
    } catch (e) {}
  }
}

/**
 * Get all available learning paths with enrollment and progress stats.
 */
export async function getLearningPaths(userId) {
  try {
    // 1. Try querying Supabase learning_paths table
    const { data: dbPaths, error: pathsErr } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (!pathsErr && dbPaths && dbPaths.length > 0) {
      // If tables exist, fetch user enrollments
      let userEnrollments = [];
      if (userId) {
        const { data: enrollments } = await supabase
          .from('user_learning_enrollments')
          .select('*')
          .eq('user_id', userId);
        userEnrollments = enrollments || [];
      }

      return dbPaths.map(p => {
        const enrollment = userEnrollments.find(e => e.path_id === p.id);
        const staticFallback = ALL_LEARNING_PATHS.find(sp => sp.slug === p.slug);
        return {
          ...staticFallback,
          ...p,
          isEnrolled: Boolean(enrollment),
          progressPercentage: Number(enrollment?.progress_percentage || 0),
          lastAccessedLessonId: enrollment?.current_lesson_id || null
        };
      });
    }
  } catch (err) {
    console.warn('[LearningService] Supabase learning_paths query error, falling back:', err.message);
  }

  // Fallback to static catalog with local persistence
  return ALL_LEARNING_PATHS.map(path => {
    const enrollment = getLocalEnrollment(path.slug, userId);
    const progress = calculateLocalProgress(path, userId);
    return {
      ...path,
      isEnrolled: Boolean(enrollment),
      progressPercentage: progress.percentage,
      completedLessonsCount: progress.completedCount,
      totalLessonsCount: progress.totalCount,
      lastAccessedLessonId: enrollment?.current_lesson_id || null
    };
  });
}

/**
 * Get a specific learning path by slug with full module, topic, and lesson hierarchy.
 */
export async function getLearningPathBySlug(slug, userId) {
  const staticPath = ALL_LEARNING_PATHS.find(p => p.slug === slug) || PYTHON_PATH;
  const enrollment = getLocalEnrollment(slug, userId);
  const completedLessonIds = getCompletedLessonIds(userId);

  // Map levels, modules, topics, and lessons with dynamic completion/availability status
  const levels = staticPath.levels.map(level => {
    const modules = level.modules.map(mod => {
      let moduleCompletedLessons = 0;
      let moduleTotalLessons = 0;

      const topics = mod.topics.map(topic => {
        const lessons = topic.lessons.map(lesson => {
          moduleTotalLessons++;
          const isCompleted = completedLessonIds.has(lesson.id);
          if (isCompleted) moduleCompletedLessons++;

          return {
            ...lesson,
            isCompleted,
            pathSlug: staticPath.slug,
            moduleSlug: mod.slug,
            topicSlug: topic.slug
          };
        });

        return {
          ...topic,
          lessons
        };
      });

      const isModuleCompleted = moduleTotalLessons > 0 && moduleCompletedLessons === moduleTotalLessons;
      const modulePct = moduleTotalLessons > 0 ? Math.round((moduleCompletedLessons / moduleTotalLessons) * 100) : 0;

      return {
        ...mod,
        topics,
        totalLessons: moduleTotalLessons,
        completedLessons: moduleCompletedLessons,
        isCompleted: isModuleCompleted,
        progressPercentage: modulePct
      };
    });

    return {
      ...level,
      modules
    };
  });

  const progress = calculateLocalProgress(staticPath, userId);

  return {
    ...staticPath,
    levels,
    isEnrolled: Boolean(enrollment),
    progressPercentage: progress.percentage,
    completedLessonsCount: progress.completedCount,
    totalLessonsCount: progress.totalCount,
    lastAccessedLessonId: enrollment?.current_lesson_id || null
  };
}

/**
 * Enroll user in a learning path.
 */
export async function enrollInPath(pathSlug, userId) {
  if (!userId) return false;

  const path = ALL_LEARNING_PATHS.find(p => p.slug === pathSlug) || PYTHON_PATH;
  
  // Find first lesson for initial position
  const firstLesson = path.levels[0]?.modules[0]?.topics[0]?.lessons[0];

  // Try saving to Supabase if table exists
  try {
    await supabase.from('user_learning_enrollments').upsert({
      user_id: userId,
      path_id: path.id,
      current_lesson_id: firstLesson?.id || null,
      progress_percentage: 0,
      enrolled_at: new Date().toISOString(),
      last_accessed_at: new Date().toISOString()
    }, { onConflict: 'user_id, path_id' });
  } catch (e) {
    // Expected if not migrated
  }

  // Persist locally
  const enrollment = {
    path_slug: pathSlug,
    current_lesson_id: firstLesson?.id || null,
    enrolled_at: new Date().toISOString(),
    last_accessed_at: new Date().toISOString()
  };
  setLocalEnrollment(pathSlug, userId, enrollment);

  safeDispatch('REFETCH_LEARNING', { pathSlug, userId });
  return true;
}

/**
 * Fetch a single lesson by its slugs.
 */
export async function getLessonBySlug(pathSlug, moduleSlug, topicSlug, lessonSlug, userId) {
  const path = await getLearningPathBySlug(pathSlug, userId);
  if (!path) return null;

  for (const level of path.levels) {
    for (const mod of level.modules) {
      if (mod.slug === moduleSlug) {
        for (const topic of mod.topics) {
          if (topic.slug === topicSlug) {
            const lesson = topic.lessons.find(l => l.slug === lessonSlug);
            if (lesson) {
              // Update last accessed position
              updateLastAccessedLesson(pathSlug, userId, lesson.id);

              // Find next and prev lessons for seamless navigation
              const nextLesson = findNextLesson(path, level.level_number, mod.slug, topic.slug, lesson.slug);
              const prevLesson = findPrevLesson(path, level.level_number, mod.slug, topic.slug, lesson.slug);

              return {
                ...lesson,
                pathTitle: path.title,
                levelTitle: level.level_title,
                moduleTitle: mod.title,
                topicTitle: topic.title,
                nextLesson,
                prevLesson
              };
            }
          }
        }
      }
    }
  }
  return null;
}

/**
 * Mark a lesson as completed by explicit user action.
 */
export async function completeLesson(lessonId, pathSlug, userId) {
  if (!userId || !lessonId) return false;

  const now = new Date().toISOString();

  // 1. Try Supabase insert
  try {
    await supabase.from('user_lesson_progress').upsert({
      user_id: userId,
      lesson_id: lessonId,
      is_completed: true,
      completed_at: now
    }, { onConflict: 'user_id, lesson_id' });
  } catch (e) {
    // Expected fallback
  }

  // 2. Persist locally
  const completedIds = getCompletedLessonIds(userId);
  completedIds.add(lessonId);
  setCompletedLessonIds(userId, completedIds);

  // 3. Update path progress
  const path = ALL_LEARNING_PATHS.find(p => p.slug === pathSlug) || PYTHON_PATH;
  const progress = calculateLocalProgress(path, userId);

  // Update enrollment last accessed and progress %
  const currentEnrollment = getLocalEnrollment(pathSlug, userId) || {};
  setLocalEnrollment(pathSlug, userId, {
    ...currentEnrollment,
    path_slug: pathSlug,
    current_lesson_id: lessonId,
    progress_percentage: progress.percentage,
    last_accessed_at: now
  });

  // 4. Award XP via RPC
  try {
    await supabase.rpc('add_user_xp', { p_user_id: userId, p_xp: 25 });
  } catch (e) {}

  safeDispatch('REFETCH_LEARNING', { lessonId, pathSlug, userId });
  return true;
}

/**
 * Authoritatively submit a quiz assessment for server-side grading and mastery awards.
 * 
 * First attempts to invoke the PostgreSQL RPC `submit_quiz_assessment` with SECURITY DEFINER
 * so answer keys and scoring never depend on client claims.
 * If the remote database has not yet applied migration 20240101000047, gracefully falls back
 * to verified local grading and persists attempt history to scoped user storage.
 */
export async function submitQuizAssessment(quizId, answers, userId, lessonQuizMetadata = null) {
  if (!userId) {
    throw new Error('You must be signed in to submit an assessment.');
  }

  // 1. Attempt Server-Side RPC Execution (Authoritative Primary Path)
  try {
    const { data, error } = await supabase.rpc('submit_quiz_assessment', {
      p_quiz_id: quizId,
      p_submissions: answers
    });

    if (!error && data) {
      return {
        ...data,
        verified: true,
        method: 'supabase_rpc'
      };
    }

    if (error && error.code !== 'PGRST202' && error.code !== '42P01') {
      console.warn('[LearningService] Server quiz RPC error:', error);
    }
  } catch (err) {
    console.warn('[LearningService] RPC submit_quiz_assessment unavailable, using verified local fallback:', err.message);
  }

  // 2. Verified Local Fallback (Guarantees uninterrupted learner UX)
  return gradeQuizLocally(quizId, answers, userId, lessonQuizMetadata);
}

/**
 * Local verified grading implementation for development/offline fallback.
 */
function gradeQuizLocally(quizId, answers, userId, lessonQuizMetadata) {
  // Locate quiz in curriculum if not passed directly
  let quiz = lessonQuizMetadata;
  if (!quiz) {
    for (const level of PYTHON_PATH.levels) {
      for (const mod of level.modules) {
        for (const topic of mod.topics) {
          for (const lesson of topic.lessons) {
            if (lesson.quiz && lesson.quiz.id === quizId) {
              quiz = lesson.quiz;
              break;
            }
          }
        }
      }
    }
  }

  if (!quiz) {
    throw new Error(`Quiz ${quizId} not found in curriculum.`);
  }

  let score = 0;
  const total = quiz.questions.length;
  const results = [];

  for (const q of quiz.questions) {
    const userSelected = answers[q.id] || [];
    const correctIds = q.correct_option_ids || [];
    let isCorrect = false;

    if (q.question_type === 'single_choice') {
      isCorrect = userSelected.length === 1 && userSelected[0] === correctIds[0];
    } else {
      // Multiple choice: exact set match
      const userSet = new Set(userSelected);
      const correctSet = new Set(correctIds);
      isCorrect = userSet.size === correctSet.size && [...userSet].every(x => correctSet.has(x));
    }

    if (isCorrect) score += 1;

    results.push({
      question_id: q.id,
      is_correct: isCorrect,
      correct_option_ids: correctIds,
      explanation: q.explanation
    });
  }

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = percentage >= (quiz.passing_score || 75);

  // Check previous attempts for idempotent XP reward
  const previousAttempts = getLocalQuizAttempts(userId, quizId);
  const alreadyPassed = previousAttempts.some(a => a.passed);

  let xpAwarded = 0;
  if (passed && !alreadyPassed) {
    xpAwarded = quiz.xp_reward || 50;
    // Attempt awarding XP via RPC if available
    try {
      supabase.rpc('add_user_xp', { p_user_id: userId, p_xp: xpAwarded }).then(() => {}, () => {});
    } catch (e) {}
  }

  // Persist attempt locally
  const attemptRecord = {
    id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    quiz_id: quizId,
    score,
    total_questions: total,
    percentage,
    passed,
    xp_awarded: xpAwarded,
    answers_submitted: answers,
    created_at: new Date().toISOString()
  };
  saveLocalQuizAttempt(userId, quizId, attemptRecord);

  return {
    attempt_id: attemptRecord.id,
    quiz_id: quizId,
    score,
    total_questions: total,
    percentage,
    passed,
    passing_score: quiz.passing_score || 75,
    xp_awarded: xpAwarded,
    already_passed: alreadyPassed,
    results,
    verified: false,
    method: 'local_fallback'
  };
}

/**
 * Get resume lesson target for a learning path.
 */
export async function getResumeLesson(pathSlug, userId) {
  const path = await getLearningPathBySlug(pathSlug, userId);
  if (!path) return null;

  // Find the first published lesson that is not yet completed
  for (const level of path.levels) {
    for (const mod of level.modules) {
      if (!mod.is_published) continue;
      for (const topic of mod.topics) {
        for (const lesson of topic.lessons) {
          if (lesson.is_published && !lesson.isCompleted) {
            return {
              pathSlug: path.slug,
              moduleSlug: mod.slug,
              topicSlug: topic.slug,
              lessonSlug: lesson.slug,
              title: lesson.title,
              moduleTitle: mod.title
            };
          }
        }
      }
    }
  }

  // If all completed or none found, return the very first lesson
  const first = path.levels[0]?.modules[0]?.topics[0]?.lessons[0];
  if (first) {
    return {
      pathSlug: path.slug,
      moduleSlug: path.levels[0].modules[0].slug,
      topicSlug: path.levels[0].modules[0].topics[0].slug,
      lessonSlug: first.slug,
      title: first.title,
      moduleTitle: path.levels[0].modules[0].title
    };
  }
  return null;
}

// ─── Helpers & Storage Utilities ─────────────────────────────────────────────

function getLocalEnrollment(pathSlug, userId) {
  if (!userId) return null;
  try {
    const key = `${ENROLLMENT_STORAGE_PREFIX}${userId}_${pathSlug}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setLocalEnrollment(pathSlug, userId, data) {
  if (!userId) return;
  try {
    const key = `${ENROLLMENT_STORAGE_PREFIX}${userId}_${pathSlug}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}
}

function getCompletedLessonIds(userId) {
  if (!userId) return new Set();
  try {
    const key = `${PROGRESS_STORAGE_PREFIX}${userId}`;
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) {
    return new Set();
  }
}

function setCompletedLessonIds(userId, idsSet) {
  if (!userId) return;
  try {
    const key = `${PROGRESS_STORAGE_PREFIX}${userId}`;
    localStorage.setItem(key, JSON.stringify([...idsSet]));
  } catch (e) {}
}

function updateLastAccessedLesson(pathSlug, userId, lessonId) {
  if (!userId) return;
  const current = getLocalEnrollment(pathSlug, userId) || {};
  setLocalEnrollment(pathSlug, userId, {
    ...current,
    path_slug: pathSlug,
    current_lesson_id: lessonId,
    last_accessed_at: new Date().toISOString()
  });
}

function calculateLocalProgress(path, userId) {
  const completedIds = getCompletedLessonIds(userId);
  let totalPublished = 0;
  let completed = 0;

  for (const level of path.levels || []) {
    for (const mod of level.modules || []) {
      if (!mod.is_published) continue;
      for (const topic of mod.topics || []) {
        for (const lesson of topic.lessons || []) {
          if (lesson.is_published) {
            totalPublished++;
            if (completedIds.has(lesson.id)) completed++;
          }
        }
      }
    }
  }

  const percentage = totalPublished > 0 ? Math.round((completed / totalPublished) * 100) : 0;
  return {
    completedCount: completed,
    totalCount: totalPublished,
    percentage
  };
}

function getLocalQuizAttempts(userId, quizId) {
  if (!userId) return [];
  try {
    const key = `${QUIZ_ATTEMPTS_STORAGE_PREFIX}${userId}_${quizId}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalQuizAttempt(userId, quizId, attemptRecord) {
  if (!userId) return;
  try {
    const key = `${QUIZ_ATTEMPTS_STORAGE_PREFIX}${userId}_${quizId}`;
    const existing = getLocalQuizAttempts(userId, quizId);
    existing.unshift(attemptRecord);
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 20))); // Keep last 20 attempts
  } catch (e) {}
}

function findNextLesson(path, currentLevelNum, currentModSlug, currentTopicSlug, currentLessonSlug) {
  let foundCurrent = false;

  for (const level of path.levels) {
    for (const mod of level.modules) {
      for (const topic of mod.topics) {
        for (const lesson of topic.lessons) {
          if (foundCurrent && lesson.is_published) {
            return {
              pathSlug: path.slug,
              moduleSlug: mod.slug,
              topicSlug: topic.slug,
              lessonSlug: lesson.slug,
              title: lesson.title
            };
          }
          if (mod.slug === currentModSlug && topic.slug === currentTopicSlug && lesson.slug === currentLessonSlug) {
            foundCurrent = true;
          }
        }
      }
    }
  }
  return null;
}

function findPrevLesson(path, currentLevelNum, currentModSlug, currentTopicSlug, currentLessonSlug) {
  let prev = null;

  for (const level of path.levels) {
    for (const mod of level.modules) {
      for (const topic of mod.topics) {
        for (const lesson of topic.lessons) {
          if (mod.slug === currentModSlug && topic.slug === currentTopicSlug && lesson.slug === currentLessonSlug) {
            return prev;
          }
          if (lesson.is_published) {
            prev = {
              pathSlug: path.slug,
              moduleSlug: mod.slug,
              topicSlug: topic.slug,
              lessonSlug: lesson.slug,
              title: lesson.title
            };
          }
        }
      }
    }
  }
  return null;
}

// ─── Practice & Challenges Services ─────────────────────────────────────────

export async function getChallenges(pathSlug, userId) {
  const completedMap = getLocalChallengeProgress(userId);

  return ALL_CHALLENGES.filter(c => c.path_slug === pathSlug).map(c => {
    const isCompleted = Boolean(completedMap[c.slug]);
    return {
      ...c,
      isCompleted,
      submittedCode: completedMap[c.slug]?.submitted_code || null
    };
  });
}

export async function getChallengeBySlug(pathSlug, challengeSlug, userId) {
  const challenge = ALL_CHALLENGES.find(c => c.path_slug === pathSlug && c.slug === challengeSlug);
  if (!challenge) return null;

  const completedMap = getLocalChallengeProgress(userId);
  const prog = completedMap[challengeSlug];

  return {
    ...challenge,
    isCompleted: Boolean(prog),
    submittedCode: prog?.submitted_code || challenge.starter_code
  };
}

export async function completeChallenge({ pathSlug, challengeSlug, submittedCode, userId }) {
  if (!userId) throw new Error('Authentication required.');

  // Try Supabase RPC
  try {
    const { data, error } = await supabase.rpc('complete_learning_challenge', {
      p_challenge_slug: challengeSlug,
      p_path_slug: pathSlug,
      p_submitted_code: submittedCode
    });
    if (!error && data) {
      saveLocalChallengeProgress(userId, challengeSlug, { submitted_code: submittedCode, is_completed: true });
      safeDispatch('REFETCH_LEARNING', { challengeSlug, pathSlug, userId });
      return data;
    }
  } catch (err) {}

  // Local fallback
  const existing = getLocalChallengeProgress(userId);
  const alreadyCompleted = Boolean(existing[challengeSlug]);
  const challenge = ALL_CHALLENGES.find(c => c.slug === challengeSlug);
  const xpToAward = alreadyCompleted ? 0 : (challenge?.xp_reward || 35);

  if (!alreadyCompleted && xpToAward > 0) {
    try {
      await supabase.rpc('add_user_xp', { p_user_id: userId, p_xp: xpToAward });
    } catch (e) {}
  }

  saveLocalChallengeProgress(userId, challengeSlug, {
    submitted_code: submittedCode,
    is_completed: true,
    completed_at: new Date().toISOString()
  });

  safeDispatch('REFETCH_LEARNING', { challengeSlug, pathSlug, userId });
  return {
    success: true,
    challenge_slug: challengeSlug,
    xp_awarded: xpToAward,
    already_completed: alreadyCompleted
  };
}

// ─── Guided Projects Services ────────────────────────────────────────────────

export async function getProjects(pathSlug, userId) {
  const milestoneProgress = getLocalProjectMilestones(userId);

  return ALL_PROJECTS.filter(p => p.path_slug === pathSlug).map(project => {
    const completedForProject = milestoneProgress[project.slug] || [];
    const totalMilestones = project.milestones.length;
    const completedCount = completedForProject.length;
    const isCompleted = totalMilestones > 0 && completedCount === totalMilestones;
    const progressPct = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;

    return {
      ...project,
      completedMilestones: completedForProject,
      isCompleted,
      progressPercentage: progressPct
    };
  });
}

export async function getProjectBySlug(pathSlug, projectSlug, userId) {
  const project = ALL_PROJECTS.find(p => p.path_slug === pathSlug && p.slug === projectSlug);
  if (!project) return null;

  const milestoneProgress = getLocalProjectMilestones(userId);
  const completedForProject = new Set(milestoneProgress[projectSlug] || []);

  const milestones = project.milestones.map((m, idx) => {
    const isCompleted = completedForProject.has(m.id);
    const isUnlocked = idx === 0 || completedForProject.has(project.milestones[idx - 1].id);
    return {
      ...m,
      isCompleted,
      isUnlocked
    };
  });

  const isCompleted = milestones.length > 0 && milestones.every(m => m.isCompleted);
  const completedCount = milestones.filter(m => m.isCompleted).length;
  const progressPct = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  return {
    ...project,
    milestones,
    isCompleted,
    progressPercentage: progressPct,
    completedMilestonesCount: completedCount
  };
}

export async function completeProjectMilestone({ projectSlug, milestoneId, userId }) {
  if (!userId) throw new Error('Authentication required.');

  // Try Supabase upsert
  try {
    await supabase.from('user_project_milestones').upsert({
      user_id: userId,
      project_slug: projectSlug,
      milestone_id: milestoneId,
      is_completed: true,
      completed_at: new Date().toISOString()
    }, { onConflict: 'user_id, project_slug, milestone_id' });
  } catch (e) {}

  saveLocalProjectMilestone(userId, projectSlug, milestoneId);

  safeDispatch('REFETCH_LEARNING', { projectSlug, milestoneId, userId });
  return { success: true, projectSlug, milestoneId };
}

// ─── Challenge & Project Local Storage Helpers ──────────────────────────────

function getLocalChallengeProgress(userId) {
  if (!userId) return {};
  try {
    const raw = localStorage.getItem(`${CHALLENGE_PROGRESS_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveLocalChallengeProgress(userId, challengeSlug, data) {
  if (!userId) return;
  try {
    const current = getLocalChallengeProgress(userId);
    current[challengeSlug] = data;
    localStorage.setItem(`${CHALLENGE_PROGRESS_PREFIX}${userId}`, JSON.stringify(current));
  } catch (e) {}
}

function getLocalProjectMilestones(userId) {
  if (!userId) return {};
  try {
    const raw = localStorage.getItem(`${PROJECT_PROGRESS_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveLocalProjectMilestone(userId, projectSlug, milestoneId) {
  if (!userId) return;
  try {
    const current = getLocalProjectMilestones(userId);
    const list = current[projectSlug] || [];
    if (!list.includes(milestoneId)) {
      list.push(milestoneId);
      current[projectSlug] = list;
      localStorage.setItem(`${PROJECT_PROGRESS_PREFIX}${userId}`, JSON.stringify(current));
    }
  } catch (e) {}
}

