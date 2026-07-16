-- 20240101000027_payment_and_role_fix.sql

-- 1. Add dedicated subscription fields to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- 2. Migrate the `role` column from ENUM `user_role` to TEXT
-- Since altering the type of an ENUM that's used in tables/functions can be messy, 
-- the safest approach in Postgres is dropping the default, converting the type, and dropping the enum.
ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;
ALTER TABLE public.profiles ALTER COLUMN role TYPE text USING role::text;
DROP TYPE IF EXISTS public.user_role CASCADE;
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'user';

-- 3. Normalize roles (everyone is a 'user' unless they have is_admin = true)
UPDATE public.profiles SET role = 'admin' WHERE is_admin = true;
UPDATE public.profiles SET role = 'user' WHERE is_admin = false OR is_admin IS NULL;

-- 4. Backfill Premium Status from existing Subscriptions
UPDATE public.profiles p
SET 
  is_pro = true,
  plan_type = CASE WHEN pl.interval = 'year' THEN 'pro_yearly' ELSE 'pro_monthly' END,
  expires_at = s.expires_at,
  subscription_status = s.status
FROM public.subscriptions s
JOIN public.plans pl ON s.plan_id = pl.id
WHERE p.auth_id = s.user_id AND s.status = 'active' AND s.expires_at > NOW();

-- 5. Atomic RPC to Process Premium Subscription
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
  v_existing_payment record;
  v_subscription_id uuid;
  v_existing_sub_id uuid;
  v_plan_type text;
  v_duration_days integer;
  v_bonus_coins integer;
  v_bonus_type text;
  v_billing_id uuid;
  v_error_msg text;
BEGIN
  -- Idempotency Check
  SELECT * INTO v_existing_payment FROM public.billing_history WHERE razorpay_payment_id = p_payment_id;
  
  IF v_existing_payment IS NOT NULL THEN
    IF v_existing_payment.status = 'success' THEN
      RETURN jsonb_build_object('success', true, 'message', 'Payment already processed successfully', 'status', 'success');
    ELSIF v_existing_payment.status = 'failed_activation' THEN
      v_billing_id := v_existing_payment.id;
    ELSE
      RETURN jsonb_build_object('success', false, 'message', 'Payment is currently in status: ' || v_existing_payment.status, 'status', v_existing_payment.status);
    END IF;
  ELSE
    -- Insert tracking record FIRST
    INSERT INTO public.billing_history (
      user_id, razorpay_payment_id, razorpay_order_id, amount, status, coupon_id
    ) VALUES (
      p_user_id, p_payment_id, p_order_id, p_final_price, 'processing', p_coupon_id
    ) RETURNING id INTO v_billing_id;
  END IF;

  BEGIN
    SELECT * INTO v_plan FROM public.plans WHERE interval = p_plan_interval;
    IF v_plan IS NULL THEN RAISE EXCEPTION 'PLAN_NOT_FOUND'; END IF;

    v_plan_type := CASE WHEN p_plan_interval = 'year' THEN 'pro_yearly' ELSE 'pro_monthly' END;
    v_duration_days := CASE WHEN p_plan_interval = 'year' THEN 365 ELSE 30 END;
    v_bonus_coins := CASE WHEN p_plan_interval = 'year' THEN 100000 ELSE 50000 END;
    v_bonus_type := CASE WHEN p_plan_interval = 'year' THEN 'pro_yearly_bonus' ELSE 'pro_monthly_bonus' END;

    -- Upsert Subscription
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

    -- Finalize Billing
    UPDATE public.billing_history SET subscription_id = v_subscription_id, status = 'success' WHERE id = v_billing_id;

    -- Track Event
    INSERT INTO public.subscription_events (
      user_id, subscription_id, event_type, metadata
    ) VALUES (
      p_user_id, v_subscription_id, CASE WHEN v_existing_sub_id IS NOT NULL THEN 'renewed' ELSE 'started' END, jsonb_build_object('planInterval', p_plan_interval, 'finalPrice', p_final_price, 'paymentId', p_payment_id)
    );

    -- Update Profile dedicated fields
    UPDATE public.profiles SET 
      is_pro = true,
      plan_type = v_plan_type,
      subscription_status = 'active',
      subscription_renewal_date = now() + (v_duration_days || ' days')::interval,
      expires_at = now() + (v_duration_days || ' days')::interval
    WHERE auth_id = p_user_id;

    -- Grant Coins (Idempotent by reference_id)
    INSERT INTO public.coin_transactions (
      user_id, amount, description, transaction_type, reference_id
    ) VALUES (
      p_user_id, v_bonus_coins, CASE WHEN p_plan_interval = 'year' THEN 'Pro Yearly Bonus' ELSE 'Pro Monthly Bonus' END, v_bonus_type, p_payment_id
    ) ON CONFLICT (reference_id, transaction_type) DO NOTHING;

    -- Coupon Usage
    IF p_coupon_id IS NOT NULL THEN
      UPDATE public.coupons SET used_count = used_count + 1 WHERE id = p_coupon_id;
    END IF;

    RETURN jsonb_build_object(
      'success', true,
      'status', 'success',
      'is_pro', true,
      'plan_type', v_plan_type,
      'expiresAt', (now() + (v_duration_days || ' days')::interval)
    );

  EXCEPTION WHEN OTHERS THEN
    v_error_msg := SQLERRM;
    UPDATE public.billing_history SET status = 'failed_activation' WHERE id = v_billing_id;
    RETURN jsonb_build_object(
      'success', false,
      'status', 'failed_activation',
      'message', 'Payment recorded, but activation failed: ' || v_error_msg
    );
  END;
END;
$$;


-- 6. RPC: Auto-Recover Failed Activations
CREATE OR REPLACE FUNCTION public.recover_failed_activations()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_billing record;
  v_plan_interval text;
  v_recovered_count integer := 0;
  v_failed_count integer := 0;
  v_result jsonb;
BEGIN
  -- Ensure admin check for manual invocation, though this could be run via cron/frontend
  -- We allow authenticated users to trigger recovery ONLY for themselves later if needed,
  -- but this global function recovers ALL users, so we limit it strictly to admins.
  IF auth.role() = 'authenticated' THEN
    IF (SELECT role FROM public.profiles WHERE auth_id = auth.uid()) != 'admin' THEN
      RAISE EXCEPTION 'UNAUTHORIZED';
    END IF;
  END IF;

  FOR v_billing IN 
    SELECT b.* FROM public.billing_history b
    LEFT JOIN public.subscriptions s ON b.subscription_id = s.id
    WHERE b.status IN ('success', 'failed_activation')
    -- We want to recover if the subscription is missing entirely OR if profile is out of sync
  LOOP
    -- We just re-run process_premium_subscription because it is idempotent!
    v_plan_interval := CASE WHEN v_billing.amount >= 1000 THEN 'year' ELSE 'month' END;
    
    v_result := public.process_premium_subscription(
      v_billing.user_id,
      v_billing.razorpay_payment_id,
      v_billing.razorpay_order_id,
      v_plan_interval,
      v_billing.amount,
      v_billing.coupon_id
    );

    IF (v_result->>'success')::boolean THEN
      v_recovered_count := v_recovered_count + 1;
    ELSE
      v_failed_count := v_failed_count + 1;
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'recovered', v_recovered_count,
    'failed', v_failed_count
  );
END;
$$;

-- 7. RPC: Recover Single User (Safe for Frontend to Call)
CREATE OR REPLACE FUNCTION public.recover_my_subscription()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_billing record;
  v_plan_interval text;
  v_result jsonb;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  -- Find the most recent verified payment that wasn't successfully activated
  SELECT * INTO v_billing 
  FROM public.billing_history 
  WHERE user_id = v_user_id 
  AND status = 'failed_activation'
  ORDER BY created_at DESC 
  LIMIT 1;

  IF v_billing IS NULL THEN
    RETURN jsonb_build_object('success', true, 'message', 'No failed activations found');
  END IF;

  v_plan_interval := CASE WHEN v_billing.amount >= 1000 THEN 'year' ELSE 'month' END;
  
  v_result := public.process_premium_subscription(
    v_billing.user_id,
    v_billing.razorpay_payment_id,
    v_billing.razorpay_order_id,
    v_plan_interval,
    v_billing.amount,
    v_billing.coupon_id
  );

  RETURN v_result;
END;
$$;
