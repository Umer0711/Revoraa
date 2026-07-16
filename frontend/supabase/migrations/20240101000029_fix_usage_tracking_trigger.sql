-- Fix check_free_plan_limits trigger after user_role ENUM was dropped

CREATE OR REPLACE FUNCTION public.check_free_plan_limits()
RETURNS TRIGGER AS $$
DECLARE
    v_is_pro boolean;
    v_usage integer;
    v_limit integer;
    v_reset_date timestamptz;
BEGIN
    SELECT is_pro, monthly_problem_usage, monthly_problem_limit, usage_reset_date 
    INTO v_is_pro, v_usage, v_limit, v_reset_date 
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
    
    IF coalesce(v_is_pro, false) = false THEN
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
