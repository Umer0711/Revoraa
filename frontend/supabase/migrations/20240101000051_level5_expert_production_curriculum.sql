-- ============================================================
-- Revoraa Developer Learning Platform Migration (Level 5)
-- 20240101000051_level5_expert_production_curriculum.sql
--
-- Level 5: Expert / Production Python Modules, Projects & Challenges Schema
-- ============================================================

-- 1. Ensure learning_projects difficulty check constraint supports 'expert'
DO $$ BEGIN
  ALTER TABLE public.learning_projects DROP CONSTRAINT IF EXISTS learning_projects_difficulty_check;
  ALTER TABLE public.learning_projects ADD CONSTRAINT learning_projects_difficulty_check 
    CHECK (difficulty IN ('beginner', 'foundation', 'intermediate', 'advanced', 'expert'));
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- 2. Ensure learning_challenges difficulty check constraint supports 'expert'
DO $$ BEGIN
  ALTER TABLE public.learning_challenges DROP CONSTRAINT IF EXISTS learning_challenges_difficulty_check;
  ALTER TABLE public.learning_challenges ADD CONSTRAINT learning_challenges_difficulty_check 
    CHECK (difficulty IN ('beginner', 'foundation', 'intermediate', 'advanced', 'expert'));
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- 3. Ensure learning_challenges challenge_type check constraint covers all challenge modes
DO $$ BEGIN
  ALTER TABLE public.learning_challenges DROP CONSTRAINT IF EXISTS learning_challenges_challenge_type_check;
  ALTER TABLE public.learning_challenges ADD CONSTRAINT learning_challenges_challenge_type_check 
    CHECK (challenge_type IN ('predict_output', 'bug_hunt', 'code_completion', 'refactor', 'problem_solving', 'cooked_or_cracked', 'internet_is_wrong', 'boss_fight', 'code_escape_room'));
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- 4. Seed Level 5 Modules into learning_modules (if path exists)
DO $$
DECLARE
  v_path_id uuid;
BEGIN
  SELECT id INTO v_path_id FROM public.learning_paths WHERE slug = 'python-development' LIMIT 1;
  
  IF v_path_id IS NOT NULL THEN
    -- Module 1: Professional Python Project Structure
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 5, 'Expert', 'professional-python-project-structure', 'Professional Python Project Structure', 'Master src-layout architecture, strict import boundaries, virtual environments, dependency pinning, CLI entry points, and 12-factor configuration.', 7, 24)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 5;

    -- Module 2: Packaging and Distribution
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 5, 'Expert', 'packaging-and-distribution', 'Packaging and Distribution', 'Master PEP 517 build backends, pyproject.toml, wheels vs sdists, SemVer versioning, editable installs, and supply-chain security.', 7, 25)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 5;

    -- Module 3: Configuration, Security, and Secrets
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 5, 'Expert', 'configuration-security-and-secrets', 'Configuration, Security, and Secrets', 'Implement fail-fast configuration schemas, runtime environment variables, SecretString masking, SQL injection prevention, and safe logging.', 7, 26)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 5;

    -- Module 4: Production Testing and Quality Assurance
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 5, 'Expert', 'production-testing-and-quality-assurance', 'Production Testing and Quality Assurance', 'Master the test pyramid, pytest fixtures, mock boundary specs, transactional database rollbacks, Ruff linting, Mypy CI, and flaky test eradication.', 8, 27)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 5;

    -- Module 5: APIs, Databases, and Production Reliability
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 5, 'Expert', 'apis-databases-and-production-reliability', 'APIs, Databases, and Production Reliability', 'Design contract validation, Alembic migrations, connection pool tuning, idempotency keys, token-bucket rate limiting, and 3-state circuit breakers.', 8, 28)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 5;

    -- Module 6: Docker and Deployment Fundamentals
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 5, 'Expert', 'docker-and-deployment-fundamentals', 'Docker and Deployment Fundamentals', 'Construct multi-stage Dockerfiles, non-root user hardening, PID 1 signal propagation, ephemeral storage, exit code triage, and safe rollbacks.', 8, 29)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 5;

    -- Module 7: CI/CD, Monitoring, and Operations
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 5, 'Expert', 'cicd-monitoring-and-operations', 'CI/CD, Monitoring, and Operations', 'Implement trunk-based CI, matrix testing, OIDC credentials, structured JSON logging, Prometheus RED metrics, and decoupled liveness/readiness probes.', 8, 30)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 5;

    -- Module 8: Production Readiness and Final Assessment
    INSERT INTO public.learning_modules (path_id, level_number, level_title, slug, title, description, estimated_hours, sort_order)
    VALUES (v_path_id, 5, 'Expert', 'production-readiness-and-final-assessment', 'Production Readiness and Final Assessment', 'Conduct architecture reviews, STRIDE threat models, memory profiling, mutation testing, post-deployment smoke tests, and PRR go/no-go audits.', 10, 31)
    ON CONFLICT (path_id, slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, level_number = 5;
  END IF;
END $$;

-- 5. Seed Level 5 Projects into learning_projects
INSERT INTO public.learning_projects (slug, path_slug, title, tagline, level_number, difficulty, estimated_hours, xp_reward, sort_order)
VALUES
  ('production-ready-python-package', 'python-development', 'Production-Ready Python Package', 'Create a reusable package with documented public interfaces, clean directory structure, and CLI entry points.', 5, 'expert', 6, 240, 20),
  ('release-reusable-utility-library', 'python-development', 'Release a Reusable Utility Library', 'Package, version, test, and build a standards-compliant Python utility library.', 5, 'expert', 6, 240, 21),
  ('secure-configuration-layer', 'python-development', 'Secure Configuration Layer', 'Build a reusable configuration module that validates settings, masks secrets, and prevents injection attacks.', 5, 'expert', 6, 240, 22),
  ('quality-gate-python-application', 'python-development', 'Quality Gate for a Python Application', 'Engineer an automated quality gate with unit tests, mocking, database rollbacks, and static analysis.', 5, 'expert', 6, 240, 23),
  ('reliable-python-service', 'python-development', 'Reliable Python Service', 'Engineer a fault-tolerant service with idempotency, backoff retries, and circuit breakers.', 5, 'expert', 7, 260, 24),
  ('containerize-python-application', 'python-development', 'Containerize a Python Application', 'Write hardened Dockerfiles, handle PID 1 signals, and triage container crashes.', 5, 'expert', 7, 260, 25),
  ('python-ci-pipeline', 'python-development', 'Python CI Pipeline', 'Construct a continuous integration workflow with matrix testing, structured logs, and Prometheus metrics.', 5, 'expert', 7, 260, 26),
  ('production-readiness-audit', 'python-development', 'Production Readiness Audit', 'Audit a Python service against enterprise criteria: architecture, security, smoke tests, and PRR gates.', 5, 'expert', 8, 280, 27),
  ('production-python-project-lab', 'python-development', 'Production Python Project Lab (Level 5 Capstone)', 'Architect, test, package, containerize, and audit a complete production Python microservice across 10 milestones.', 5, 'expert', 15, 500, 28)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  level_number = EXCLUDED.level_number,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward;

-- 6. Seed Level 5 Challenges into learning_challenges
INSERT INTO public.learning_challenges (slug, path_slug, module_slug, title, challenge_type, difficulty, xp_reward)
VALUES
  ('cooked-or-cracked-docker-cache', 'python-development', 'docker-and-deployment-fundamentals', 'Cooked or Cracked: The Docker Cache Invalidator', 'cooked_or_cracked', 'expert', 80),
  ('bug-hunt-leaked-secret', 'python-development', 'configuration-security-and-secrets', 'Bug Hunt: The Leaked Production Token', 'bug_hunt', 'expert', 80),
  ('internet-is-wrong-100-coverage', 'python-development', 'production-testing-and-quality-assurance', 'Internet Is Wrong: The 100% Coverage Illusion', 'internet_is_wrong', 'expert', 80),
  ('boss-fight-production-readiness', 'python-development', 'production-readiness-and-final-assessment', 'Boss Fight: The 3:00 AM Production Launch Triage', 'boss_fight', 'expert', 100),
  ('escape-room-ci-pipeline', 'python-development', 'cicd-monitoring-and-operations', 'Code Escape Room: The CI/CD Verification Vault', 'code_escape_room', 'expert', 100)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  challenge_type = EXCLUDED.challenge_type,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward;
