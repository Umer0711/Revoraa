-- ============================================================
-- Revoraa Developer Learning Platform Migration (Level 4)
-- 20240101000050_level4_advanced_curriculum.sql
--
-- Level 4: Advanced Python Modules, Projects & Challenges Schema
-- ============================================================

-- 1. Ensure learning_challenges challenge_type check constraint covers all challenge modes
DO $$ BEGIN
  ALTER TABLE public.learning_challenges DROP CONSTRAINT IF EXISTS learning_challenges_challenge_type_check;
  ALTER TABLE public.learning_challenges ADD CONSTRAINT learning_challenges_challenge_type_check 
    CHECK (challenge_type IN ('predict_output', 'bug_hunt', 'code_completion', 'refactor', 'problem_solving', 'cooked_or_cracked', 'internet_is_wrong', 'boss_fight', 'code_escape_room'));
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- 2. Extend learning_projects difficulty check constraint to support 'advanced'
DO $$ BEGIN
  ALTER TABLE public.learning_projects DROP CONSTRAINT IF EXISTS learning_projects_difficulty_check;
  ALTER TABLE public.learning_projects ADD CONSTRAINT learning_projects_difficulty_check 
    CHECK (difficulty IN ('beginner', 'foundation', 'intermediate', 'advanced'));
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- 2. Seed Level 4 Modules into learning_modules (if path exists)
DO $$
DECLARE
  v_path_id uuid;
BEGIN
  SELECT id INTO v_path_id FROM public.learning_paths WHERE slug = 'python-development' LIMIT 1;
  
  IF v_path_id IS NOT NULL THEN
    -- Module 1: Advanced Python Internals and Resource Management
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 4, 'Advanced', 'advanced-python-internals-resource-management', 'Advanced Python Internals and Resource Management', 'Master CPython frame evaluation, PyObject headers, garbage collection cycles, the GIL, and custom context managers.', 7, 16)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 4;

    -- Module 2: Asynchronous Programming with asyncio
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 4, 'Advanced', 'asynchronous-programming-asyncio', 'Asynchronous Programming with asyncio', 'Learn coroutines, event loops, tasks, structured concurrency with TaskGroups, timeouts, cancellation, and async iterators.', 8, 17)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 4;

    -- Module 3: Threads, Processes, and Concurrency
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 4, 'Advanced', 'threads-processes-and-concurrency', 'Threads, Processes, and Concurrency', 'Compare threads, processes, and async I/O; master thread-safe queues, locks, race condition elimination, and worker pools.', 8, 18)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 4;

    -- Module 4: Performance Profiling and Optimization
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 4, 'Advanced', 'performance-profiling-and-optimization', 'Performance Profiling and Optimization', 'Measure execution runtime with time.perf_counter, profile bottlenecks with cProfile and tracemalloc, optimize with LRU cache.', 8, 19)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 4;

    -- Module 5: Advanced Type Hints and Protocols
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 4, 'Advanced', 'advanced-type-hints-and-protocols', 'Advanced Type Hints and Protocols', 'Author strict type annotations, generic classes with TypeVar, structural subtyping with Protocols, and TypedDict return contracts.', 8, 20)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 4;

    -- Module 6: Design Patterns and Application Architecture
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 4, 'Advanced', 'design-patterns-and-application-architecture', 'Design Patterns and Application Architecture', 'Implement Strategy, Factory, Adapter, Observer, and Repository patterns with dependency injection and clean separation of concerns.', 9, 21)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 4;

    -- Module 7: Reliable Pipelines, Logging, and Error Handling
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 4, 'Advanced', 'reliable-pipelines-logging-and-error-handling', 'Reliable Pipelines, Logging, and Error Handling', 'Construct resilient multi-stage data pipelines with correlation IDs, structured JSON logging, exponential backoff, and idempotency.', 9, 22)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 4;

    -- Module 8: Advanced Testing and Architecture Validation
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 4, 'Advanced', 'advanced-testing-architecture-validation', 'Advanced Testing and Architecture Validation', 'Test coroutines and cancellations with IsolatedAsyncioTestCase and AsyncMock, inject faults, test architecture boundaries with AST.', 10, 23)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 4;
  END IF;
END $$;

-- 3. Seed Level 4 Projects into learning_projects
INSERT INTO public.learning_projects (slug, path_slug, title, tagline, level_number, difficulty, estimated_hours, xp_reward, sort_order)
VALUES
  ('resource-safe-file-processor', 'python-development', 'Resource-Safe File Processor', 'Build a leak-proof stream parser with custom context managers and rollback cleanup', 4, 'advanced', 6, 220, 11),
  ('async-job-coordinator', 'python-development', 'Async Job Coordinator', 'Orchestrate concurrent async tasks with bounded concurrency, timeouts, and result streaming', 4, 'advanced', 7, 230, 12),
  ('concurrent-workload-simulator', 'python-development', 'Concurrent Workload Simulator', 'Benchmark and compare Sequential, Threading, and Async concurrency models', 4, 'advanced', 6, 220, 13),
  ('python-performance-lab', 'python-development', 'Python Performance Lab', 'Benchmark, identify algorithmic bottlenecks, optimize with memoization, and verify speedups', 4, 'advanced', 6, 220, 14),
  ('typed-utility-library', 'python-development', 'Typed Utility Library', 'Create a reusable type-safe package using Protocols, Generics, and TypedDicts', 4, 'advanced', 6, 220, 15),
  ('extensible-notification-service', 'python-development', 'Extensible Notification Service', 'Implement Strategy, Factory, and Observer patterns to build a modular notification platform', 4, 'advanced', 7, 230, 16),
  ('reliable-data-pipeline', 'python-development', 'Reliable Data Pipeline', 'Build an idempotent data ingestion pipeline with exponential retries and correlation tracking', 4, 'advanced', 7, 230, 17),
  ('harden-unreliable-python-service', 'python-development', 'Harden an Unreliable Python Service', 'Audit, debug, and harden a broken service suffering from resource leaks and unhandled exceptions', 4, 'advanced', 8, 240, 18),
  ('advanced-python-systems-lab', 'python-development', 'Advanced Python Systems Lab (Level 4 Capstone)', 'Architect a full asynchronous telemetry processing service combining Protocols, Caching, and Fault Tolerance', 4, 'advanced', 10, 350, 19)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  level_number = EXCLUDED.level_number,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward;

-- 4. Seed Level 4 Challenges into learning_challenges
INSERT INTO public.learning_challenges (slug, path_slug, module_slug, title, challenge_type, difficulty, xp_reward)
VALUES
  ('cooked-or-cracked-async-loop', 'python-development', 'asynchronous-programming-asyncio', 'Cooked or Cracked: The Ghost Coroutine', 'cooked_or_cracked', 'advanced', 70),
  ('bug-hunt-task-gc', 'python-development', 'asynchronous-programming-asyncio', 'Bug Hunt: The Vanishing Background Task', 'bug_hunt', 'advanced', 80),
  ('internet-is-wrong-gil-threadsafe', 'python-development', 'threads-processes-concurrency', 'Internet Is Wrong: "The GIL Makes Threads Safe"', 'internet_is_wrong', 'advanced', 75),
  ('boss-fight-resilient-pipeline', 'python-development', 'reliable-pipelines-logging-error-handling', 'Boss Fight: The Resilient Pipeline Engine', 'boss_fight', 'advanced', 120),
  ('escape-room-async-vault', 'python-development', 'advanced-testing-and-architecture-validation', 'Code Escape Room: The Async Chamber Vault', 'code_escape_room', 'advanced', 100)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  challenge_type = EXCLUDED.challenge_type,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward;
