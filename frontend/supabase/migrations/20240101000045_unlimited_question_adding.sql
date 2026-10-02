-- ============================================================================
-- Migration: 20240101000045_unlimited_question_adding.sql
-- Remove Question-Adding Quota for All Users
-- ============================================================================

-- 1. Drop the trigger enforcing free plan limits on solved_problems
DROP TRIGGER IF EXISTS enforce_free_plan_limits ON public.solved_problems;

-- 2. Redefine check_free_plan_limits() to never raise FREE_LIMIT_EXCEEDED
CREATE OR REPLACE FUNCTION public.check_free_plan_limits()
RETURNS TRIGGER AS $$
BEGIN
    -- Question additions are unlimited for all users in Revoraa.
    -- Never raise FREE_LIMIT_EXCEEDED or block question insertion.
    -- Maintain monthly usage metric if desired without any blocking limit.
    UPDATE public.profiles 
    SET monthly_problem_usage = COALESCE(monthly_problem_usage, 0) + 1
    WHERE auth_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Reset any monthly_problem_limit restrictions in profiles
ALTER TABLE public.profiles ALTER COLUMN monthly_problem_limit DROP DEFAULT;
ALTER TABLE public.profiles ALTER COLUMN monthly_problem_limit SET DEFAULT NULL;
UPDATE public.profiles SET monthly_problem_limit = NULL WHERE monthly_problem_limit IS NOT NULL;
