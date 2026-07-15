-- 20240101000023_resolve_audit_blockers.sql

-- 1. Create System Logs for silent failures
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    error_message TEXT,
    context TEXT
);

-- Protect system logs (Admin only)
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view system logs" ON public.system_logs 
    FOR SELECT TO authenticated 
    USING ((SELECT is_admin FROM public.profiles WHERE auth_id = auth.uid()) = true);

-- 2. Update Auth Trigger to log exceptions instead of swallowing them silently
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles first
  INSERT INTO public.profiles (
    auth_id,
    email,
    full_name,
    avatar_url,
    coins_balance,
    subscription_status,
    monthly_problem_limit,
    monthly_problem_usage,
    usage_reset_date
  )
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    10000,
    'free',
    15,
    0,
    now() + interval '1 month'
  );

  -- Log the 10,000 coin signup bonus transaction
  INSERT INTO public.coin_transactions (
    user_id,
    amount,
    transaction_type,
    description
  )
  VALUES (
    new.id,
    10000,
    'signup_bonus',
    'Welcome bonus for creating an account'
  );

  -- Insert into user_stats
  INSERT INTO public.user_stats (user_id)
  VALUES (new.id);

  -- Insert into user_settings
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Safely catch any failures (e.g. missing tables) and log them, allowing auth to succeed
  INSERT INTO public.system_logs (error_message, context) 
  VALUES (SQLERRM, 'handle_new_user trigger error for user ' || new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Monthly Usage Reset Mechanism (pg_cron)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule a daily check at midnight to reset users whose billing cycle has ended
SELECT cron.schedule(
    'reset-monthly-usage',
    '0 0 * * *',
    $$
      UPDATE public.profiles 
      SET monthly_problem_usage = 0, 
          usage_reset_date = now() + interval '1 month' 
      WHERE usage_reset_date <= now();
    $$
);


-- 4. Get Dashboard Initialization Data RPC (Fix N+1 query issue)
CREATE OR REPLACE FUNCTION public.get_dashboard_initialization_data(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  profile_data JSON;
  stats_data JSON;
  achievements_data JSON;
  inventory_data JSON;
  result JSON;
BEGIN
  -- 1. Get Profile
  SELECT row_to_json(p) INTO profile_data 
  FROM public.profiles p 
  WHERE p.auth_id = p_user_id;

  -- 2. Get Stats
  SELECT row_to_json(s) INTO stats_data 
  FROM public.user_stats s 
  WHERE s.user_id = p_user_id;
  
  -- 3. Get Achievements (Join with achievements metadata)
  SELECT json_agg(json_build_object(
      'unlocked_at', ua.unlocked_at,
      'achievement', row_to_json(ach.*)
  )) INTO achievements_data 
  FROM public.user_achievements ua 
  JOIN public.achievements ach ON ua.achievement_id = ach.id 
  WHERE ua.user_id = p_user_id;

  -- 4. Get Inventory (Join with shop_items)
  SELECT json_agg(json_build_object(
      'is_equipped', ui.is_equipped,
      'item', row_to_json(si.*)
  )) INTO inventory_data 
  FROM public.user_inventory ui 
  JOIN public.shop_items si ON ui.shop_item_id = si.id 
  WHERE ui.user_id = p_user_id;

  -- Build final JSON result, coalescing nulls to empty objects/arrays
  result := json_build_object(
    'profile', COALESCE(profile_data, '{}'::json),
    'stats', COALESCE(stats_data, '{}'::json),
    'achievements', COALESCE(achievements_data, '[]'::json),
    'inventory', COALESCE(inventory_data, '[]'::json)
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
