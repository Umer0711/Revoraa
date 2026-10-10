-- ============================================================
-- Revoraa Developer Learning Platform Migration (Level 3)
-- 20240101000049_level3_intermediate_curriculum.sql
--
-- Level 3: Intermediate Python Modules, Projects & Challenges Schema
-- ============================================================

-- 1. Extend learning_challenges challenge_type check constraint for code_escape_room
DO $$ BEGIN
  ALTER TABLE public.learning_challenges DROP CONSTRAINT IF EXISTS learning_challenges_challenge_type_check;
  ALTER TABLE public.learning_challenges ADD CONSTRAINT learning_challenges_challenge_type_check 
    CHECK (challenge_type IN ('predict_output', 'bug_hunt', 'code_completion', 'refactor', 'problem_solving', 'cooked_or_cracked', 'internet_is_wrong', 'boss_fight', 'code_escape_room'));
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- 2. Seed Level 3 Modules into learning_modules (if path exists)
DO $$
DECLARE
  v_path_id uuid;
BEGIN
  SELECT id INTO v_path_id FROM public.learning_paths WHERE slug = 'python-development' LIMIT 1;
  
  IF v_path_id IS NOT NULL THEN
    -- Module 1: Advanced Data Structures
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 3, 'Intermediate', 'advanced-data-structures', 'Advanced Data Structures', 'Move beyond basic syntax to write memory-efficient collections, custom sorting, stacks, queues, and Big-O evaluation.', 8, 8)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 3;

    -- Module 2: Iterators and Generators
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 3, 'Intermediate', 'iterators-and-generators', 'Iterators and Generators', 'Master Python iteration protocols, custom iterators, generator functions, lazy streams, and yield from.', 8, 9)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 3;

    -- Module 3: Functions, Closures, and Decorators
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 3, 'Intermediate', 'functions-closures-decorators', 'Functions, Closures, and Decorators', 'Understand first-class functions, lexical scope, closures, decorators with arguments, and functools.wraps.', 9, 10)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 3;

    -- Module 4: Comprehensions and Functional Programming
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 3, 'Intermediate', 'comprehensions-functional-programming', 'Comprehensions and Functional Programming', 'Write clean list/dict/set comprehensions, lambda expressions, map/filter, and functional pipelines.', 8, 11)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 3;

    -- Module 5: HTTP, APIs, and JSON
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 3, 'Intermediate', 'http-apis-json', 'HTTP, APIs, and JSON', 'Consume REST APIs, parse JSON safely, handle timeouts and HTTP error codes, and mock network responses.', 9, 12)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 3;

    -- Module 6: Database Integration
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 3, 'Intermediate', 'database-integration', 'Database Integration', 'Connect Python to SQLite, execute parameterized queries, manage transactions and rollbacks, and isolate data tests.', 9, 13)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 3;

    -- Module 7: Modular Design and Maintainability
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 3, 'Intermediate', 'modular-design-maintainability', 'Modular Design and Maintainability', 'Architect reusable Python packages, avoid circular imports, enforce separation of concerns, and log cleanly.', 9, 14)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 3;

    -- Module 8: Intermediate Python Testing and Debugging
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 3, 'Intermediate', 'intermediate-python-testing-debugging', 'Intermediate Python Testing and Debugging', 'Write comprehensive unit tests, mock external dependencies, reproduce edge cases, and debug systematically.', 10, 15)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 3;
  END IF;
END $$;

-- 3. Seed Level 3 Projects into learning_projects
INSERT INTO public.learning_projects (slug, path_slug, title, tagline, level_number, difficulty, estimated_hours, xp_reward, sort_order)
VALUES
  ('student-records-analyzer', 'python-development', 'Student Records Analyzer', 'Process nested collections, calculate statistics, and produce readable reports', 3, 'intermediate', 6, 200, 3),
  ('lazy-data-processing-pipeline', 'python-development', 'Lazy Data Processing Pipeline', 'Stream, filter, and transform unbounded datasets with zero memory bloat', 3, 'intermediate', 6, 200, 4),
  ('reusable-function-utilities', 'python-development', 'Reusable Function Utilities', 'Author production decorators for timing, logging, and retry logic', 3, 'intermediate', 6, 220, 5),
  ('data-transformation-toolkit', 'python-development', 'Data Transformation Toolkit', 'Build idiomatic comprehension and functional transformation pipelines', 3, 'intermediate', 6, 200, 6),
  ('api-explorer', 'python-development', 'API Explorer', 'Build a robust, resilient HTTP API client with retries and mock transports', 3, 'intermediate', 7, 240, 7),
  ('personal-expense-tracker', 'python-development', 'Personal Expense Tracker', 'Architect an isolated SQLite transaction ledger with parameterized queries', 3, 'intermediate', 7, 250, 8),
  ('modular-task-manager', 'python-development', 'Modular Task Manager', 'Engineer a decoupled 4-tier Python package architecture', 3, 'intermediate', 7, 250, 9),
  ('repair-and-test-broken-package', 'python-development', 'Repair and Test a Broken Python Package', 'Diagnose, fix, and prove defects in an existing legacy code package', 3, 'intermediate', 8, 300, 10)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  level_number = EXCLUDED.level_number,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward;

-- 4. Seed Level 3 Challenges into learning_challenges
INSERT INTO public.learning_challenges (slug, path_slug, module_slug, title, challenge_type, difficulty, xp_reward)
VALUES
  ('cooked-or-cracked-generator', 'python-development', 'iterators-and-generators', 'Cooked or Cracked: The Ghost Generator', 'cooked_or_cracked', 'intermediate', 60),
  ('bug-hunt-decorator-scope', 'python-development', 'functions-closures-decorators', 'Bug Hunt: The Vanishing Return Value', 'bug_hunt', 'intermediate', 70),
  ('internet-is-wrong-sort-return', 'python-development', 'advanced-data-structures', 'Internet Is Wrong: In-Place Sort vs sorted()', 'internet_is_wrong', 'intermediate', 65),
  ('boss-fight-streamed-log-aggregator', 'python-development', 'iterators-and-generators', 'Boss Fight: Memory-Efficient Log Streamer', 'boss_fight', 'intermediate', 95),
  ('escape-room-decorator-vault', 'python-development', 'functions-closures-decorators', 'Code Escape Room: The Decorator Vault', 'code_escape_room', 'intermediate', 100)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  challenge_type = EXCLUDED.challenge_type,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward;
