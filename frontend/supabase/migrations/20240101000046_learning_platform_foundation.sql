-- ============================================================
-- Revoraa Developer Learning Platform Migration (Phase 1)
-- 20240101000046_learning_platform_foundation.sql
-- ============================================================

-- 1. Create learning_paths table
CREATE TABLE IF NOT EXISTS public.learning_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  icon text DEFAULT 'Terminal',
  badge_color text DEFAULT '#f59e0b',
  is_published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 2. Create learning_modules table
CREATE TABLE IF NOT EXISTS public.learning_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id uuid REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  level_number integer NOT NULL DEFAULT 1,
  level_title text NOT NULL DEFAULT 'Beginner',
  slug text NOT NULL,
  title text NOT NULL,
  description text,
  estimated_hours integer DEFAULT 3,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(path_id, slug)
);

-- 3. Create learning_topics table
CREATE TABLE IF NOT EXISTS public.learning_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  summary text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(module_id, slug)
);

-- 4. Create learning_lessons table
CREATE TABLE IF NOT EXISTS public.learning_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES public.learning_topics(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  lesson_type text DEFAULT 'reading' CHECK (lesson_type IN ('reading', 'video', 'exercise', 'quiz')),
  content_markdown text,
  code_snippet text,
  code_language text DEFAULT 'python',
  estimated_minutes integer DEFAULT 10,
  xp_reward integer DEFAULT 25,
  is_published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(topic_id, slug)
);

-- 5. Create user_learning_enrollments table
CREATE TABLE IF NOT EXISTS public.user_learning_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  path_id uuid REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  current_lesson_id uuid REFERENCES public.learning_lessons(id) ON DELETE SET NULL,
  progress_percentage numeric DEFAULT 0,
  enrolled_at timestamptz DEFAULT now(),
  last_accessed_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, path_id)
);

-- 6. Create user_lesson_progress table
CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES public.learning_lessons(id) ON DELETE CASCADE,
  is_completed boolean DEFAULT true,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- 7. Indexes for performant hierarchy traversal
CREATE INDEX IF NOT EXISTS idx_learning_modules_path ON public.learning_modules(path_id);
CREATE INDEX IF NOT EXISTS idx_learning_topics_module ON public.learning_topics(module_id);
CREATE INDEX IF NOT EXISTS idx_learning_lessons_topic ON public.learning_lessons(topic_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user ON public.user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_enrollments_user ON public.user_learning_enrollments(user_id);

-- 8. Row Level Security
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Allow public read on published learning paths"
    ON public.learning_paths FOR SELECT USING (is_published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public read on learning modules"
    ON public.learning_modules FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public read on learning topics"
    ON public.learning_topics FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public read on published learning lessons"
    ON public.learning_lessons FOR SELECT USING (is_published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can manage their own enrollments"
    ON public.user_learning_enrollments FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can manage their own lesson progress"
    ON public.user_lesson_progress FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
