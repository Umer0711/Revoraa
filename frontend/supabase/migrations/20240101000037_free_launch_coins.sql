-- 20240101000037_free_launch_coins.sql
-- Updates the signup bonus to 20,000 coins and retroactively corrects existing users.

-- 1. Update the handle_new_user trigger to give 20,000 coins
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
    -- Grant exactly 20,000 Coins on signup
    INSERT INTO public.coin_transactions (user_id, amount, description, transaction_type)
    VALUES (NEW.id, 20000, 'Welcome Bonus', 'signup_bonus');
  EXCEPTION WHEN OTHERS THEN END;

  RETURN NEW;
END;
$$;

-- 2. Backfill existing users
-- For users who already have a signup bonus of 10,000 or 5,000, we update it to 20,000
UPDATE public.coin_transactions
SET amount = 20000
WHERE transaction_type = 'signup_bonus' AND amount != 20000;

-- For users who don't have a signup bonus at all, grant it
INSERT INTO public.coin_transactions (user_id, amount, description, transaction_type)
SELECT auth_id, 20000, 'Welcome Bonus', 'signup_bonus'
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.coin_transactions ct 
  WHERE ct.user_id = p.auth_id AND ct.transaction_type = 'signup_bonus'
);

-- 3. Recalculate coins_balance for all users to reflect the updated or new transactions
UPDATE public.profiles p
SET coins_balance = COALESCE(
  (SELECT GREATEST(SUM(amount), 0) FROM public.coin_transactions ct WHERE ct.user_id = p.auth_id),
  0
);
