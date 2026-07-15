-- Admin Dashboard & System Health Migration

-- 0. Ensure is_admin column exists (Fallback if migration 18 was skipped)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 1. Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    affected_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    device_info TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create bug_reports table
CREATE TABLE IF NOT EXISTS public.bug_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    endpoint TEXT,
    stack_trace TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 2.5 Add PostgREST Foreign Keys for profiles joins
-- This allows `.select('*, profiles(...)')` in the JS client
DO $$ BEGIN
    ALTER TABLE public.audit_logs ADD CONSTRAINT audit_logs_admin_id_fkey_profile FOREIGN KEY (admin_id) REFERENCES public.profiles(auth_id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.audit_logs ADD CONSTRAINT audit_logs_affected_user_id_fkey_profile FOREIGN KEY (affected_user_id) REFERENCES public.profiles(auth_id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.bug_reports ADD CONSTRAINT bug_reports_user_id_fkey_profile FOREIGN KEY (user_id) REFERENCES public.profiles(auth_id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_user_id_fkey_profile FOREIGN KEY (user_id) REFERENCES public.profiles(auth_id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.billing_history ADD CONSTRAINT billing_history_user_id_fkey_profile FOREIGN KEY (user_id) REFERENCES public.profiles(auth_id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Only admins can see and write audit logs
DROP POLICY IF EXISTS "Admins can manage audit logs" ON public.audit_logs;
CREATE POLICY "Admins can manage audit logs"
    ON public.audit_logs
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE auth_id = auth.uid() AND is_admin = true
        )
    );

-- Anyone authenticated can create a bug report, only admins can view/update all
DROP POLICY IF EXISTS "Users can create bug reports" ON public.bug_reports;
CREATE POLICY "Users can create bug reports"
    ON public.bug_reports
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own bug reports" ON public.bug_reports;
CREATE POLICY "Users can view their own bug reports"
    ON public.bug_reports
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all bug reports" ON public.bug_reports;
CREATE POLICY "Admins can manage all bug reports"
    ON public.bug_reports
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE auth_id = auth.uid() AND is_admin = true
        )
    );

-- 4. Admin Dashboard Stats RPC
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_is_admin BOOLEAN;
    total_users INT;
    active_users_24h INT;
    total_subscriptions INT;
    active_subscriptions INT;
    total_revenue NUMERIC;
    total_problems_solved INT;
    recent_signups INT;
    system_health JSONB;
BEGIN
    -- 1. Security Check
    SELECT is_admin INTO v_is_admin FROM public.profiles WHERE auth_id = auth.uid();
    IF NOT v_is_admin THEN
        RAISE EXCEPTION 'Access denied. Admin only.';
    END IF;

    -- 2. Gather Users Stats
    SELECT count(*) INTO total_users FROM public.profiles;
    
    -- Users active in last 24h (assuming last_sign_in_at or based on solved_problems)
    SELECT count(DISTINCT user_id) INTO active_users_24h 
    FROM public.solved_problems 
    WHERE created_at >= NOW() - INTERVAL '24 hours';
    
    SELECT count(*) INTO recent_signups 
    FROM public.profiles 
    WHERE created_at >= NOW() - INTERVAL '7 days';

    -- 3. Gather Subscription Stats
    SELECT count(*) INTO total_subscriptions FROM public.subscriptions;
    SELECT count(*) INTO active_subscriptions FROM public.subscriptions WHERE status IN ('active', 'trial');
    
    -- 4. Gather Revenue Stats (sum of successful payments from billing_history)
    SELECT COALESCE(SUM(amount), 0) INTO total_revenue 
    FROM public.billing_history 
    WHERE status = 'success';

    -- 5. Gather Engagement Stats
    SELECT count(*) INTO total_problems_solved FROM public.solved_problems;

    -- 6. System Health Mockup (could be expanded based on ping logs)
    system_health := jsonb_build_object(
        'database', 'healthy',
        'realtime', 'healthy',
        'storage', 'healthy',
        'payment_gateway', 'healthy',
        'last_checked', NOW()
    );

    -- 7. Return aggregated JSON
    RETURN jsonb_build_object(
        'users', jsonb_build_object(
            'total', total_users,
            'active_24h', active_users_24h,
            'new_7d', recent_signups
        ),
        'subscriptions', jsonb_build_object(
            'total', total_subscriptions,
            'active', active_subscriptions
        ),
        'revenue', jsonb_build_object(
            'total', total_revenue
        ),
        'engagement', jsonb_build_object(
            'total_problems_solved', total_problems_solved
        ),
        'system_health', system_health,
        'timestamp', NOW()
    );
END;
$$;

-- Add to Realtime Publication (Idempotent)
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bug_reports;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Reload PostgREST schema cache to ensure the new foreign keys and RPCs are immediately available to the API
NOTIFY pgrst, 'reload schema';
