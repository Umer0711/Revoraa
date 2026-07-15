-- Migration: Usage Tracking and Profile Subscription State

-- 1. Add columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS monthly_problem_limit INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS monthly_problem_usage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS usage_reset_date TIMESTAMPTZ DEFAULT now() + interval '1 month',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS subscription_renewal_date TIMESTAMPTZ;

-- 2. Update Free Plan Limit Trigger (Dynamic signup_date rolling window)
CREATE OR REPLACE FUNCTION check_free_plan_limits()
RETURNS TRIGGER AS $$
DECLARE
    v_role user_role;
    v_usage integer;
    v_limit integer;
    v_reset_date timestamptz;
BEGIN
    SELECT role, monthly_problem_usage, monthly_problem_limit, usage_reset_date 
    INTO v_role, v_usage, v_limit, v_reset_date 
    FROM public.profiles 
    WHERE auth_id = NEW.user_id;

    -- Lazily reset usage if we've passed the reset date
    IF now() >= v_reset_date THEN
        v_usage := 0;
        
        -- Advance the reset date forward by months until it's in the future
        WHILE now() >= v_reset_date LOOP
            v_reset_date := v_reset_date + interval '1 month';
        END LOOP;
        
        UPDATE public.profiles 
        SET monthly_problem_usage = 0,
            usage_reset_date = v_reset_date
        WHERE auth_id = NEW.user_id;
    END IF;
    
    IF v_role = 'free' THEN
        IF v_usage >= v_limit THEN
            RAISE EXCEPTION 'FREE_LIMIT_EXCEEDED';
        END IF;
        
        -- Increment usage
        UPDATE public.profiles 
        SET monthly_problem_usage = v_usage + 1
        WHERE auth_id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Initial sync of usage
-- Drop the cron job if it exists (no longer needed, using lazy eval in trigger)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
    ) THEN
        PERFORM cron.unschedule('reset_monthly_usage');
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- Ignore errors if pg_cron is not installed
END $$;

DROP FUNCTION IF EXISTS reset_monthly_problem_usage();

UPDATE public.profiles p
SET monthly_problem_usage = (
    SELECT count(*) 
    FROM public.solved_problems sp 
    WHERE sp.user_id = p.auth_id 
    AND sp.created_at >= p.usage_reset_date - interval '1 month'
);
