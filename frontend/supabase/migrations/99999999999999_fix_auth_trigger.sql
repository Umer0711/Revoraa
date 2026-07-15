-- Supabase Self-Healing Script for Missing Profiles & Economy Audit fixes
-- Paste this in Supabase SQL Editor to fix broken signups and missing profiles.

-- 1. Ensure all columns exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS coins_balance integer DEFAULT 0;
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'coins_balance_check') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT coins_balance_check CHECK (coins_balance >= 0);
  END IF;
END $$;

ALTER TABLE public.coin_transactions ADD COLUMN IF NOT EXISTS transaction_type text;
ALTER TABLE public.coin_transactions ADD COLUMN IF NOT EXISTS reference_id text;
ALTER TABLE public.coin_transactions ADD COLUMN IF NOT EXISTS description text;

-- Safely copy reason to description if it exists and description is null
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='coin_transactions' AND column_name='reason') THEN
    EXECUTE 'UPDATE public.coin_transactions SET description = reason WHERE description IS NULL';
    EXECUTE 'ALTER TABLE public.coin_transactions DROP COLUMN IF EXISTS reason';
  END IF;
END $$;

-- 2. Self-Healing Device Registration
-- This will ensure users who signed up when the trigger was broken get their profile created on login.
CREATE OR REPLACE FUNCTION register_device(p_fingerprint TEXT, p_browser_info TEXT, p_os_info TEXT)
RETURNS void AS $$
DECLARE
    v_user_id uuid;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN;
    END IF;

    -- SELF-HEALING: If profile doesn't exist, create it (handles trigger failures)
    INSERT INTO public.profiles (auth_id, full_name, coins_balance)
    VALUES (v_user_id, 'User', 0)
    ON CONFLICT (auth_id) DO NOTHING;

    INSERT INTO public.user_stats (user_id)
    VALUES (v_user_id)
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO public.user_settings (user_id)
    VALUES (v_user_id)
    ON CONFLICT (user_id) DO NOTHING;

    -- Upsert the device session
    INSERT INTO public.device_sessions (user_id, device_fingerprint, browser_info, os_info, last_login)
    VALUES (v_user_id, p_fingerprint, p_browser_info, p_os_info, now())
    ON CONFLICT (user_id) DO UPDATE
    SET device_fingerprint = EXCLUDED.device_fingerprint,
        browser_info = EXCLUDED.browser_info,
        os_info = EXCLUDED.os_info,
        last_login = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Robust trigger that catches exceptions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create profile safely
  BEGIN
    INSERT INTO public.profiles (auth_id, full_name, avatar_url, coins_balance)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
      0 
    )
    ON CONFLICT (auth_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN 
    -- Ignore error to prevent rolling back auth.users
  END;

  BEGIN
    INSERT INTO public.user_stats (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN END;

  BEGIN
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN END;

  BEGIN
    INSERT INTO public.coin_transactions (user_id, amount, description, transaction_type)
    VALUES (NEW.id, 10000, 'Welcome Bonus', 'signup_bonus');
  EXCEPTION WHEN OTHERS THEN END;

  RETURN NEW;
END;
$$;
