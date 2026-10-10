-- ============================================================
-- Revoraa Developer Learning Platform Migration (Phase 2)
-- 20240101000047_quiz_assessment_engine.sql
--
-- Interactive Assessment Engine, Server-Side Quiz Grading,
-- Protected Answer Keys, and Idempotent Mastery / XP Awards
-- ============================================================

-- 1. Create learning_quizzes table
CREATE TABLE IF NOT EXISTS public.learning_quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES public.learning_lessons(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  passing_score integer NOT NULL DEFAULT 75, -- Passing threshold percentage (e.g. 75%)
  xp_reward integer NOT NULL DEFAULT 50,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 2. Create learning_quiz_questions table
-- Note: Contains only learner-facing question data. Correct answers are kept secret in learning_quiz_answers!
CREATE TABLE IF NOT EXISTS public.learning_quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES public.learning_quizzes(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('single_choice', 'multiple_choice')),
  options jsonb NOT NULL, -- Array of objects: [{"id": "opt_1", "text": "Choice A"}, ...]
  code_snippet text,
  explanation text, -- Authoritative pedagogical explanation shown after grading
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 3. Create learning_quiz_answers table (PROTECTED SERVER-SIDE TABLE)
-- CRITICAL SECURITY RULE: No client SELECT permitted. Accessible ONLY via SECURITY DEFINER functions.
CREATE TABLE IF NOT EXISTS public.learning_quiz_answers (
  question_id uuid PRIMARY KEY REFERENCES public.learning_quiz_questions(id) ON DELETE CASCADE,
  correct_option_ids jsonb NOT NULL, -- Array of string IDs: ["opt_2"] or ["opt_1", "opt_3"]
  created_at timestamptz DEFAULT now()
);

-- 4. Create user_quiz_attempts table (Historical Assessment Audit Log)
CREATE TABLE IF NOT EXISTS public.user_quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id uuid REFERENCES public.learning_quizzes(id) ON DELETE CASCADE,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  percentage numeric NOT NULL,
  passed boolean NOT NULL,
  answers_submitted jsonb NOT NULL, -- Map of { [question_id]: string[] }
  xp_awarded integer DEFAULT 0,     -- Track XP granted on this attempt (0 if already passed previously)
  created_at timestamptz DEFAULT now()
);

-- 5. Create user_learning_mastery table (Idempotent Milestone Records)
CREATE TABLE IF NOT EXISTS public.user_learning_mastery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id uuid REFERENCES public.learning_quizzes(id) ON DELETE CASCADE,
  path_slug text NOT NULL,
  mastery_level text NOT NULL DEFAULT 'proficient',
  highest_percentage numeric NOT NULL,
  awarded_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, quiz_id)
);

-- 6. Indexes for Performance and Attempt Audits
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON public.learning_quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user ON public.user_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_quiz ON public.user_quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_mastery_user ON public.user_learning_mastery(user_id);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.learning_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_mastery ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies
-- Allow public read of published quizzes
DO $$ BEGIN
  CREATE POLICY "Allow public read on published quizzes"
    ON public.learning_quizzes FOR SELECT USING (is_published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Allow public read on quiz questions (options only, no answers)
DO $$ BEGIN
  CREATE POLICY "Allow public read on quiz questions"
    ON public.learning_quiz_questions FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- STRICT: learning_quiz_answers has NO SELECT POLICIES for authenticated or anon.
-- Direct queries like `SELECT * FROM learning_quiz_answers` will return 0 rows for any client!

-- Users can inspect their own past assessment attempts
DO $$ BEGIN
  CREATE POLICY "Users can view their own quiz attempts"
    ON public.user_quiz_attempts FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Users can view their own mastery records
DO $$ BEGIN
  CREATE POLICY "Users can view their own mastery records"
    ON public.user_learning_mastery FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 9. Authoritative Server-Side Quiz Grading RPC Function
-- This function runs with SECURITY DEFINER to inspect learning_quiz_answers securely,
-- evaluate scores, award XP atomically, and prevent duplicate XP awards on retries.
CREATE OR REPLACE FUNCTION public.submit_quiz_assessment(
  p_quiz_id uuid,
  p_submissions jsonb -- Object: { "question_id_1": ["opt_a"], "question_id_2": ["opt_b", "opt_c"] }
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_quiz record;
  v_question record;
  v_correct_ids jsonb;
  v_user_answers jsonb;
  v_total_questions integer := 0;
  v_score integer := 0;
  v_percentage numeric := 0;
  v_passed boolean := false;
  v_already_passed boolean := false;
  v_xp_to_award integer := 0;
  v_results jsonb := '[]'::jsonb;
  v_q_correct boolean;
  v_attempt_id uuid;
BEGIN
  -- 1. Identify Authenticated Caller
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to submit quiz assessment';
  END IF;

  -- 2. Fetch Quiz Metadata
  SELECT * INTO v_quiz
  FROM public.learning_quizzes
  WHERE id = p_quiz_id AND is_published = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Quiz not found or not currently published';
  END IF;

  -- 3. Check if user already passed this quiz previously (Idempotency Guard)
  SELECT EXISTS (
    SELECT 1 FROM public.user_quiz_attempts
    WHERE user_id = v_user_id AND quiz_id = p_quiz_id AND passed = true
  ) INTO v_already_passed;

  -- 4. Grade Each Question Authoritatively Against Protected Answers
  FOR v_question IN
    SELECT q.id, q.question_type, q.explanation, a.correct_option_ids
    FROM public.learning_quiz_questions q
    JOIN public.learning_quiz_answers a ON a.question_id = q.id
    WHERE q.quiz_id = p_quiz_id
    ORDER BY q.sort_order ASC, q.created_at ASC
  LOOP
    v_total_questions := v_total_questions + 1;
    v_user_answers := COALESCE(p_submissions->>(v_question.id::text), '[]')::jsonb;
    v_correct_ids := v_question.correct_option_ids;

    -- Evaluate Single Choice vs Multiple Choice
    IF v_question.question_type = 'single_choice' THEN
      -- Exact 1-element match
      IF jsonb_array_length(v_user_answers) = 1 AND
         v_user_answers = v_correct_ids THEN
        v_q_correct := true;
      ELSE
        v_q_correct := false;
      END IF;
    ELSE
      -- Multiple Choice: both arrays must contain exact same set of options
      IF (v_user_answers <@ v_correct_ids) AND (v_correct_ids <@ v_user_answers) THEN
        v_q_correct := true;
      ELSE
        v_q_correct := false;
      END IF;
    END IF;

    IF v_q_correct THEN
      v_score := v_score + 1;
    END IF;

    -- Append safe review result (including explanation and correct options for post-submission feedback)
    v_results := v_results || jsonb_build_object(
      'question_id', v_question.id,
      'is_correct', v_q_correct,
      'correct_option_ids', v_correct_ids,
      'explanation', v_question.explanation
    );
  END LOOP;

  -- 5. Calculate Final Score & Passing Status
  IF v_total_questions > 0 THEN
    v_percentage := round((v_score::numeric / v_total_questions::numeric) * 100);
  ELSE
    v_percentage := 0;
  END IF;

  v_passed := (v_percentage >= v_quiz.passing_score);

  -- 6. Atomic Award Handling: Grant XP only on first passing attempt
  IF v_passed AND NOT v_already_passed THEN
    v_xp_to_award := v_quiz.xp_reward;
    
    -- Increment user XP atomically using existing helper if available or direct update
    UPDATE public.user_stats
    SET xp = coalesce(xp, 0) + v_xp_to_award,
        updated_at = now()
    WHERE user_id = v_user_id;

    -- Upsert mastery record
    INSERT INTO public.user_learning_mastery (
      user_id, quiz_id, path_slug, mastery_level, highest_percentage, awarded_at, updated_at
    )
    VALUES (
      v_user_id, p_quiz_id, 'python-development', 'proficient', v_percentage, now(), now()
    )
    ON CONFLICT (user_id, quiz_id)
    DO UPDATE SET
      highest_percentage = GREATEST(public.user_learning_mastery.highest_percentage, EXCLUDED.highest_percentage),
      updated_at = now();
  ELSE
    v_xp_to_award := 0;
  END IF;

  -- 7. Persist Attempt Record in user_quiz_attempts
  INSERT INTO public.user_quiz_attempts (
    user_id, quiz_id, score, total_questions, percentage, passed, answers_submitted, xp_awarded
  )
  VALUES (
    v_user_id, p_quiz_id, v_score, v_total_questions, v_percentage, v_passed, p_submissions, v_xp_to_award
  )
  RETURNING id INTO v_attempt_id;

  -- 8. Return Comprehensive Authorized Result
  RETURN jsonb_build_object(
    'attempt_id', v_attempt_id,
    'quiz_id', p_quiz_id,
    'score', v_score,
    'total_questions', v_total_questions,
    'percentage', v_percentage,
    'passed', v_passed,
    'passing_score', v_quiz.passing_score,
    'xp_awarded', v_xp_to_award,
    'already_passed', v_already_passed,
    'results', v_results
  );
END;
$$;
