-- ============================================================
-- Phase 1: Free Plan Reset (Rolling 30 Days)
-- ============================================================

-- First, drop the old global cron job and function
DO $$
BEGIN
    PERFORM cron.unschedule('reset_monthly_usage');
EXCEPTION
    WHEN undefined_table THEN
        NULL;
    WHEN others THEN
        NULL;
END $$;

DROP FUNCTION IF EXISTS reset_monthly_problem_usage();

-- Change the default of usage_reset_date to be exactly 1 month from account creation (or now)
ALTER TABLE public.profiles
ALTER COLUMN usage_reset_date SET DEFAULT (now() + interval '1 month');

-- Create the new rolling reset function
CREATE OR REPLACE FUNCTION reset_eligible_monthly_usages()
RETURNS void AS $$
BEGIN
    UPDATE public.profiles
    SET monthly_problem_usage = 0,
        usage_reset_date = usage_reset_date + interval '1 month'
    WHERE usage_reset_date <= now();
END;
$$ LANGUAGE plpgsql;

-- Schedule it to run daily at midnight UTC
SELECT cron.schedule('reset_eligible_usages_daily', '0 0 * * *', 'SELECT reset_eligible_monthly_usages()');


-- ============================================================
-- Phase 6: Subscription Expiry
-- ============================================================

CREATE OR REPLACE FUNCTION downgrade_expired_subscriptions()
RETURNS void AS $$
BEGIN
    UPDATE public.profiles
    SET role = 'free',
        subscription_status = 'expired'
    WHERE role != 'free' 
      AND subscription_renewal_date IS NOT NULL 
      AND subscription_renewal_date < now();
END;
$$ LANGUAGE plpgsql;

SELECT cron.schedule('downgrade_expired_subscriptions_daily', '30 0 * * *', 'SELECT downgrade_expired_subscriptions()');


-- ============================================================
-- Phase 7: Shop Items (Expanded Categories)
-- ============================================================

ALTER TABLE public.shop_items ADD COLUMN IF NOT EXISTS color text default '#ffffff';

-- Categories requested: Badges, Titles, Decorations, Themes, Profile Frames, Sidebar Themes, Cursor Effects, Card Borders
INSERT INTO public.shop_items (id, name, description, type, coin_cost, color) VALUES
  (gen_random_uuid(), 'Legend', 'Top solver badge.', 'badges', 5000, '#fbbf24'),
  (gen_random_uuid(), 'Grandmaster', 'Elite badge for elite solvers.', 'badges', 10000, '#ef4444'),
  (gen_random_uuid(), 'Night Owl', 'For those coding late.', 'badges', 500, '#8b5cf6'),
  (gen_random_uuid(), 'Top Solver', 'A highly prestigious badge.', 'badges', 3000, '#3b82f6'),
  
  (gen_random_uuid(), 'Gold Border', 'Golden trim for your profile.', 'decorations', 2000, '#fbbf24'),
  (gen_random_uuid(), 'Amber Border', 'Warm amber glow.', 'decorations', 1500, '#f59e0b'),
  (gen_random_uuid(), 'Glass Border', 'Sleek glassmorphism edge.', 'decorations', 3000, '#94a3b8'),

  (gen_random_uuid(), 'DSA Master', 'Title displayed under your name.', 'titles', 4000, '#a855f7'),
  (gen_random_uuid(), 'Interview Slayer', 'Title displayed under your name.', 'titles', 3500, '#dc2626'),
  (gen_random_uuid(), 'Code Wizard', 'Title displayed under your name.', 'titles', 2000, '#0ea5e9'),
  (gen_random_uuid(), 'Pattern Hunter', 'Title displayed under your name.', 'titles', 1500, '#10b981'),

  (gen_random_uuid(), 'Amber', 'Warm and energetic theme.', 'themes', 1000, '#f59e0b'),
  (gen_random_uuid(), 'Carbon', 'Ultra dark, sleek interface.', 'themes', 2000, '#333333'),
  (gen_random_uuid(), 'Emerald', 'Fresh green interface.', 'themes', 1500, '#10b981'),
  (gen_random_uuid(), 'Crimson', 'Bold red accents.', 'themes', 2500, '#e11d48'),

  (gen_random_uuid(), 'Animated', 'A slowly rotating border frame.', 'profile_frames', 5000, '#8b5cf6'),
  (gen_random_uuid(), 'Premium', 'A static rich profile frame.', 'profile_frames', 3000, '#fbbf24')
ON CONFLICT DO NOTHING;


-- ============================================================
-- Phase 12: Realtime Audit
-- ============================================================

-- Ensure REPLICA IDENTITY FULL for tables that frontend tracks via Realtime
ALTER TABLE public.user_pattern_stats REPLICA IDENTITY FULL;
ALTER TABLE public.revision_schedule REPLICA IDENTITY FULL;
ALTER TABLE public.user_stats REPLICA IDENTITY FULL;
ALTER TABLE public.user_inventory REPLICA IDENTITY FULL;

-- Ensure these tables are in the supabase_realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_pattern_stats'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_pattern_stats;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'revision_schedule'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.revision_schedule;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_stats'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_stats;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_inventory'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_inventory;
  END IF;
END $$;
