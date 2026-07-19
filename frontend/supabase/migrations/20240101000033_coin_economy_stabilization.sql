-- Phase 2: Coin Economy Stabilization
-- Objective: Ensure exactly 5,000 coins for new signups and backfill old users to have exactly one signup bonus.

-- 1. Robust trigger that catches exceptions, updated to 5,000 coins
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

  -- 5,000 Coin Signup Bonus
  BEGIN
    INSERT INTO public.coin_transactions (user_id, amount, description, transaction_type)
    VALUES (NEW.id, 5000, 'Welcome Bonus', 'signup_bonus');
  EXCEPTION WHEN OTHERS THEN END;

  RETURN NEW;
END;
$$;

-- 2. Backfill: Grant exactly 5000 to users who DO NOT have a signup bonus transaction
INSERT INTO public.coin_transactions (user_id, amount, description, transaction_type)
SELECT auth_id, 5000, 'Welcome Bonus', 'signup_bonus'
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.coin_transactions ct 
  WHERE ct.user_id = p.auth_id AND ct.transaction_type = 'signup_bonus'
);
