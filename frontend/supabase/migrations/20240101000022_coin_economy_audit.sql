-- ============================================================
-- Migration 022: Complete Coin Economy System Audit
-- ============================================================

-- 1. Modify Profiles Table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS coins_balance integer DEFAULT 0;
ALTER TABLE public.profiles ADD CONSTRAINT coins_balance_check CHECK (coins_balance >= 0);

-- 2. Backfill coins from user_stats to profiles
UPDATE public.profiles p 
SET coins_balance = COALESCE((SELECT coins FROM public.user_stats u WHERE u.user_id = p.auth_id), 0);

-- 3. Modify coin_transactions table
ALTER TABLE public.coin_transactions RENAME COLUMN reason TO description;
ALTER TABLE public.coin_transactions ADD COLUMN IF NOT EXISTS transaction_type text;
ALTER TABLE public.coin_transactions ADD COLUMN IF NOT EXISTS reference_id text;

-- 4. Create trigger to automatically sync profiles.coins_balance
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

DROP TRIGGER IF EXISTS on_coin_transaction ON public.coin_transactions;
CREATE TRIGGER on_coin_transaction
AFTER INSERT OR UPDATE OR DELETE ON public.coin_transactions
FOR EACH ROW EXECUTE FUNCTION public.update_coins_balance();

-- 5. Modify handle_new_user to give signup bonus
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (auth_id, full_name, avatar_url, coins_balance)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    0 -- The trigger on coin_transactions will add the 10000 bonus
  )
  ON CONFLICT (auth_id) DO NOTHING;

  -- Create stats
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Give signup bonus
  INSERT INTO public.coin_transactions (user_id, amount, description, transaction_type)
  VALUES (NEW.id, 10000, 'Welcome Bonus', 'signup_bonus');

  RETURN NEW;
END;
$$;

-- 6. Modify purchase_shop_item
DROP FUNCTION IF EXISTS public.purchase_shop_item(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION public.purchase_shop_item(p_user_id uuid, p_item_id uuid, p_coin_cost integer)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_coins integer;
  v_item record;
  v_already_owned boolean;
BEGIN
  -- 1. Lock and fetch user's coins from profiles
  SELECT coins_balance INTO v_coins FROM public.profiles WHERE auth_id = p_user_id FOR UPDATE;
  IF v_coins IS NULL THEN
    RAISE EXCEPTION 'USER_NOT_FOUND';
  END IF;

  -- 2. Fetch item from DB (authoritative price — never trust frontend)
  SELECT id, name, price, category, is_active INTO v_item FROM public.shop_items WHERE id = p_item_id;
  IF v_item.id IS NULL THEN
    RAISE EXCEPTION 'ITEM_NOT_FOUND';
  END IF;
  IF NOT v_item.is_active THEN
    RAISE EXCEPTION 'ITEM_NOT_AVAILABLE';
  END IF;

  -- 3. Check duplicate ownership
  SELECT EXISTS(
    SELECT 1 FROM public.user_inventory WHERE user_id = p_user_id AND shop_item_id = p_item_id
  ) INTO v_already_owned;
  IF v_already_owned THEN
    RAISE EXCEPTION 'ALREADY_OWNED';
  END IF;

  -- 4. Check balance (use DB price, not frontend price)
  IF v_coins < v_item.price THEN
    RAISE EXCEPTION 'INSUFFICIENT_COINS';
  END IF;

  -- 5. Add to inventory
  INSERT INTO public.user_inventory (user_id, shop_item_id)
  VALUES (p_user_id, p_item_id);

  -- 6. Audit trail & deduct coins (trigger updates balance)
  INSERT INTO public.coin_transactions (user_id, amount, description, transaction_type, reference_id)
  VALUES (p_user_id, -v_item.price, 'Purchased: ' || v_item.name, 'shop_purchase', p_item_id::text);

  -- 7. Return the purchased item details
  RETURN jsonb_build_object(
    'success', true,
    'item_name', v_item.name,
    'category', v_item.category,
    'coins_spent', v_item.price,
    'coins_remaining', v_coins - v_item.price
  );
END;
$$;

-- 7. Atomic Process Premium Subscription RPC
CREATE OR REPLACE FUNCTION public.process_premium_subscription(
  p_user_id uuid,
  p_payment_id text,
  p_order_id text,
  p_plan_interval text,
  p_final_price numeric,
  p_coupon_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_plan record;
  v_existing_payment uuid;
  v_subscription_id uuid;
  v_existing_sub_id uuid;
  v_role text;
  v_duration_days integer;
  v_bonus_coins integer;
  v_bonus_type text;
BEGIN
  -- 1. Idempotency Check: Was this payment already processed?
  SELECT id INTO v_existing_payment FROM public.billing_history WHERE razorpay_payment_id = p_payment_id;
  IF v_existing_payment IS NOT NULL THEN
    RETURN jsonb_build_object('success', true, 'message', 'Payment already processed');
  END IF;

  -- 2. Fetch the plan
  SELECT * INTO v_plan FROM public.plans WHERE interval = p_plan_interval;
  IF v_plan IS NULL THEN
    RAISE EXCEPTION 'PLAN_NOT_FOUND';
  END IF;

  v_role := CASE WHEN p_plan_interval = 'year' THEN 'pro_yearly' ELSE 'pro_monthly' END;
  v_duration_days := CASE WHEN p_plan_interval = 'year' THEN 365 ELSE 30 END;
  v_bonus_coins := CASE WHEN p_plan_interval = 'year' THEN 100000 ELSE 50000 END;
  v_bonus_type := CASE WHEN p_plan_interval = 'year' THEN 'pro_yearly_bonus' ELSE 'pro_monthly_bonus' END;

  -- 3. Upsert Subscription
  SELECT id INTO v_existing_sub_id FROM public.subscriptions WHERE user_id = p_user_id FOR UPDATE;
  
  IF v_existing_sub_id IS NOT NULL THEN
    UPDATE public.subscriptions SET
      plan_id = v_plan.id,
      status = 'active',
      started_at = now(),
      expires_at = now() + (v_duration_days || ' days')::interval,
      renewal_date = now() + (v_duration_days || ' days')::interval,
      razorpay_payment_id = p_payment_id,
      razorpay_order_id = p_order_id,
      updated_at = now()
    WHERE id = v_existing_sub_id;
    v_subscription_id := v_existing_sub_id;
  ELSE
    INSERT INTO public.subscriptions (
      user_id, plan_id, status, started_at, expires_at, renewal_date, razorpay_payment_id, razorpay_order_id
    ) VALUES (
      p_user_id, v_plan.id, 'active', now(), now() + (v_duration_days || ' days')::interval, now() + (v_duration_days || ' days')::interval, p_payment_id, p_order_id
    ) RETURNING id INTO v_subscription_id;
  END IF;

  -- 4. Create Billing History
  INSERT INTO public.billing_history (
    user_id, subscription_id, razorpay_payment_id, razorpay_order_id, amount, status, coupon_id
  ) VALUES (
    p_user_id, v_subscription_id, p_payment_id, p_order_id, p_final_price, 'success', p_coupon_id
  );

  -- 5. Create Subscription Event
  INSERT INTO public.subscription_events (
    user_id, subscription_id, event_type, metadata
  ) VALUES (
    p_user_id, v_subscription_id, CASE WHEN v_existing_sub_id IS NOT NULL THEN 'renewed' ELSE 'started' END, jsonb_build_object('planInterval', p_plan_interval, 'finalPrice', p_final_price)
  );

  -- 6. Update Profile
  UPDATE public.profiles SET 
    role = v_role,
    subscription_status = 'active',
    subscription_renewal_date = now() + (v_duration_days || ' days')::interval
  WHERE auth_id = p_user_id;

  -- 7. Grant Bonus Coins
  INSERT INTO public.coin_transactions (
    user_id, amount, description, transaction_type, reference_id
  ) VALUES (
    p_user_id, v_bonus_coins, CASE WHEN p_plan_interval = 'year' THEN 'Pro Yearly Bonus' ELSE 'Pro Monthly Bonus' END, v_bonus_type, p_payment_id
  );

  -- 8. Increment Coupon Usage if applicable
  IF p_coupon_id IS NOT NULL THEN
    UPDATE public.coupons SET used_count = used_count + 1 WHERE id = p_coupon_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'role', v_role,
    'expiresAt', (now() + (v_duration_days || ' days')::interval)
  );
END;
$$;

-- 8. Admin RPCs
CREATE OR REPLACE FUNCTION public.admin_grant_coins(p_user_id uuid, p_amount integer, p_description text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF (SELECT role FROM public.profiles WHERE auth_id = auth.uid()) != 'admin' THEN
    RAISE EXCEPTION 'UNAUTHORIZED';
  END IF;

  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  INSERT INTO public.coin_transactions (user_id, amount, description, transaction_type)
  VALUES (p_user_id, p_amount, p_description, 'admin_grant');
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_remove_coins(p_user_id uuid, p_amount integer, p_description text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF (SELECT role FROM public.profiles WHERE auth_id = auth.uid()) != 'admin' THEN
    RAISE EXCEPTION 'UNAUTHORIZED';
  END IF;

  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  INSERT INTO public.coin_transactions (user_id, amount, description, transaction_type)
  VALUES (p_user_id, -p_amount, p_description, 'admin_remove');
END;
$$;
