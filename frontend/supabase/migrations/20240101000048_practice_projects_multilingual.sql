-- ============================================================
-- Revoraa Developer Learning Platform Migration (Phase 3)
-- 20240101000048_practice_projects_multilingual.sql
--
-- Multilingual Preferences, Coding Challenges, and Guided Projects
-- ============================================================

-- 1. Add learning_language to user_settings if not present
DO $$ BEGIN
  ALTER TABLE public.user_settings 
    ADD COLUMN IF NOT EXISTS learning_language text DEFAULT 'en' CHECK (learning_language IN ('en', 'hi-Latn', 'hi'));
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- 2. Create learning_challenges table
CREATE TABLE IF NOT EXISTS public.learning_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  path_slug text NOT NULL,
  module_slug text,
  lesson_slug text,
  title text NOT NULL,
  challenge_type text NOT NULL CHECK (challenge_type IN ('predict_output', 'bug_hunt', 'code_completion', 'refactor', 'problem_solving', 'cooked_or_cracked', 'internet_is_wrong', 'boss_fight')),
  difficulty text NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  xp_reward integer NOT NULL DEFAULT 35,
  starter_code text,
  solution_code text, -- Protected reference solution
  test_harness text,  -- Verification assertions
  expected_output text,
  is_published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 3. Create user_challenge_progress table (Persisted Challenge Completions)
CREATE TABLE IF NOT EXISTS public.user_challenge_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id text NOT NULL, -- Stable slug identifier
  challenge_slug text NOT NULL,
  path_slug text NOT NULL,
  is_completed boolean NOT NULL DEFAULT true,
  submitted_code text,
  attempts_count integer DEFAULT 1,
  xp_awarded integer DEFAULT 0,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, challenge_slug)
);

-- 4. Create learning_projects table
CREATE TABLE IF NOT EXISTS public.learning_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  path_slug text NOT NULL,
  title text NOT NULL,
  tagline text,
  description text,
  level_number integer NOT NULL DEFAULT 1,
  difficulty text NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'foundation', 'intermediate')),
  estimated_hours integer DEFAULT 4,
  xp_reward integer NOT NULL DEFAULT 150,
  is_published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 5. Create user_project_milestones table (Tracks Step-by-Step Project Progress)
CREATE TABLE IF NOT EXISTS public.user_project_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  project_slug text NOT NULL,
  milestone_id text NOT NULL,
  is_completed boolean NOT NULL DEFAULT true,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, project_slug, milestone_id)
);

-- 6. Create user_project_progress table (Overall Project Completion)
CREATE TABLE IF NOT EXISTS public.user_project_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  project_slug text NOT NULL,
  is_completed boolean NOT NULL DEFAULT false,
  completed_milestones text[] DEFAULT '{}',
  total_milestones integer NOT NULL DEFAULT 4,
  xp_awarded integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, project_slug)
);

-- 7. Indexes for Query Performance
CREATE INDEX IF NOT EXISTS idx_learning_challenges_path ON public.learning_challenges(path_slug);
CREATE INDEX IF NOT EXISTS idx_user_challenge_progress_user ON public.user_challenge_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_projects_path ON public.learning_projects(path_slug);
CREATE INDEX IF NOT EXISTS idx_user_project_milestones_user ON public.user_project_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_user_project_progress_user ON public.user_project_progress(user_id);

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.learning_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_project_progress ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies
-- Allow public read of published challenges
DO $$ BEGIN
  CREATE POLICY "Allow public read on published challenges"
    ON public.learning_challenges FOR SELECT USING (is_published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Allow public read of published projects
DO $$ BEGIN
  CREATE POLICY "Allow public read on published projects"
    ON public.learning_projects FOR SELECT USING (is_published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- User challenge progress strictly scoped to authenticated user
DO $$ BEGIN
  CREATE POLICY "Users can manage their own challenge progress"
    ON public.user_challenge_progress FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- User project milestone progress strictly scoped to authenticated user
DO $$ BEGIN
  CREATE POLICY "Users can manage their own project milestones"
    ON public.user_project_milestones FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- User project progress strictly scoped to authenticated user
DO $$ BEGIN
  CREATE POLICY "Users can manage their own project progress"
    ON public.user_project_progress FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 10. RPC: Complete Challenge Atomically & Idempotently
CREATE OR REPLACE FUNCTION public.complete_learning_challenge(
  p_challenge_slug text,
  p_path_slug text,
  p_submitted_code text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_challenge record;
  v_already_completed boolean := false;
  v_xp_to_award integer := 0;
  v_attempt_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to record challenge progress';
  END IF;

  SELECT * INTO v_challenge
  FROM public.learning_challenges
  WHERE slug = p_challenge_slug AND is_published = true;

  -- Check if user already completed this challenge previously
  SELECT EXISTS (
    SELECT 1 FROM public.user_challenge_progress
    WHERE user_id = v_user_id AND challenge_slug = p_challenge_slug AND is_completed = true
  ) INTO v_already_completed;

  IF NOT v_already_completed THEN
    v_xp_to_award := COALESCE(v_challenge.xp_reward, 35);

    -- Award XP atomically
    UPDATE public.user_stats
    SET xp = coalesce(xp, 0) + v_xp_to_award,
        updated_at = now()
    WHERE user_id = v_user_id;

    INSERT INTO public.user_challenge_progress (
      user_id, challenge_id, challenge_slug, path_slug, is_completed, submitted_code, xp_awarded, completed_at
    )
    VALUES (
      v_user_id, p_challenge_slug, p_challenge_slug, p_path_slug, true, p_submitted_code, v_xp_to_award, now()
    )
    ON CONFLICT (user_id, challenge_slug)
    DO UPDATE SET
      is_completed = true,
      submitted_code = EXCLUDED.submitted_code,
      attempts_count = public.user_challenge_progress.attempts_count + 1
    RETURNING id INTO v_attempt_id;
  ELSE
    -- Idempotent: record re-submission without duplicate XP
    UPDATE public.user_challenge_progress
    SET submitted_code = p_submitted_code,
        attempts_count = attempts_count + 1
    WHERE user_id = v_user_id AND challenge_slug = p_challenge_slug
    RETURNING id INTO v_attempt_id;
    v_xp_to_award := 0;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'challenge_slug', p_challenge_slug,
    'xp_awarded', v_xp_to_award,
    'already_completed', v_already_completed
  );
END;
$$;
