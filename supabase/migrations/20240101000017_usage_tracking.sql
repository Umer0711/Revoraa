-- Migration: Usage Tracking and Profile Subscription State

-- 1. Add columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS monthly_problem_limit INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS monthly_problem_usage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS usage_reset_date TIMESTAMPTZ DEFAULT date_trunc('month', now()) + interval '1 month',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS subscription_renewal_date TIMESTAMPTZ;

-- 2. Update Free Plan Limit Trigger
CREATE OR REPLACE FUNCTION check_free_plan_limits()
RETURNS TRIGGER AS $$
DECLARE
    v_role user_role;
    v_usage integer;
    v_limit integer;
BEGIN
    SELECT role, monthly_problem_usage, monthly_problem_limit 
    INTO v_role, v_usage, v_limit 
    FROM public.profiles 
    WHERE auth_id = NEW.user_id;
    
    IF v_role = 'free' THEN
        IF v_usage >= v_limit THEN
            RAISE EXCEPTION 'FREE_LIMIT_EXCEEDED';
        END IF;
        
        -- Increment usage
        UPDATE public.profiles 
        SET monthly_problem_usage = monthly_problem_usage + 1
        WHERE auth_id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Reset Monthly Usage Job
CREATE OR REPLACE FUNCTION reset_monthly_problem_usage()
RETURNS void AS $$
BEGIN
    UPDATE public.profiles
    SET monthly_problem_usage = 0,
        usage_reset_date = date_trunc('month', now()) + interval '1 month';
END;
$$ LANGUAGE plpgsql;

-- Schedule cron job to run on the 1st of every month at midnight UTC
SELECT cron.schedule('reset_monthly_usage', '0 0 1 * *', 'SELECT reset_monthly_problem_usage()');

-- 4. Initial sync of usage
UPDATE public.profiles p
SET monthly_problem_usage = (
    SELECT count(*) 
    FROM public.solved_problems sp 
    WHERE sp.user_id = p.auth_id 
    AND date_trunc('month', sp.created_at) = date_trunc('month', now())
);
