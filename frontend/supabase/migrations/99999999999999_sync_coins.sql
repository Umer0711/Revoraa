-- Supabase Fix: Sync Coin Transactions and Recreate Trigger
-- Paste this in Supabase SQL Editor

-- 1. Ensure coins_balance exists and is valid
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS coins_balance integer DEFAULT 0;
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'coins_balance_check') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT coins_balance_check CHECK (coins_balance >= 0);
  END IF;
END $$;

-- 2. Ensure coin_transactions columns exist
ALTER TABLE public.coin_transactions ADD COLUMN IF NOT EXISTS transaction_type text;
ALTER TABLE public.coin_transactions ADD COLUMN IF NOT EXISTS reference_id text;
ALTER TABLE public.coin_transactions ADD COLUMN IF NOT EXISTS description text;

-- 3. Recreate the trigger function to update coins_balance
CREATE OR REPLACE FUNCTION public.update_coins_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles SET coins_balance = coins_balance + NEW.amount WHERE auth_id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET coins_balance = coins_balance - OLD.amount WHERE auth_id = OLD.user_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.profiles SET coins_balance = coins_balance - OLD.amount + NEW.amount WHERE auth_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Recreate the trigger on coin_transactions
DROP TRIGGER IF EXISTS on_coin_transaction ON public.coin_transactions;
CREATE TRIGGER on_coin_transaction
AFTER INSERT OR UPDATE OR DELETE ON public.coin_transactions
FOR EACH ROW EXECUTE FUNCTION public.update_coins_balance();

-- 5. Backfill: Recalculate ALL users' coin_balance from coin_transactions 
-- This fixes any missing 10k signup bonuses that were inserted into coin_transactions but not applied to the profile!
UPDATE public.profiles p
SET coins_balance = COALESCE(
  (SELECT SUM(amount) FROM public.coin_transactions ct WHERE ct.user_id = p.auth_id),
  0
);

-- 6. For users who don't even have the Welcome Bonus transaction yet, grant it now
INSERT INTO public.coin_transactions (user_id, amount, description, transaction_type)
SELECT auth_id, 10000, 'Welcome Bonus', 'signup_bonus'
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.coin_transactions ct 
  WHERE ct.user_id = p.auth_id AND ct.transaction_type = 'signup_bonus'
);
