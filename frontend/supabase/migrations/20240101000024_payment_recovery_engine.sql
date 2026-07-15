-- Migration: Payment Recovery Engine & Robust Subscriptions
-- Resolves lost payments due to database errors.

-- 1. Update billing_history constraints
ALTER TABLE public.billing_history DROP CONSTRAINT IF EXISTS billing_history_status_check;
ALTER TABLE public.billing_history ADD CONSTRAINT billing_history_status_check 
CHECK (status IN ('success', 'failed', 'pending', 'refunded', 'processing', 'failed_activation'));

-- Make payment ID unique to prevent duplicate processing
ALTER TABLE public.billing_history DROP CONSTRAINT IF EXISTS billing_history_razorpay_payment_id_key;
ALTER TABLE public.billing_history ADD CONSTRAINT billing_history_razorpay_payment_id_key UNIQUE (razorpay_payment_id);

-- Ensure we don't grant duplicate coins for the same payment
ALTER TABLE public.coin_transactions DROP CONSTRAINT IF EXISTS coin_transactions_reference_type_key;
ALTER TABLE public.coin_transactions ADD CONSTRAINT coin_transactions_reference_type_key UNIQUE (reference_id, transaction_type);


-- 2. Restructure `process_premium_subscription` to guarantee payment recording
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
  v_role text;
  v_duration_days integer;
  v_bonus_coins integer;
  v_bonus_type text;
  v_billing_id uuid;
  v_error_msg text;
BEGIN
  -- 1. Idempotency Check: Was this payment already processed or is it processing?
  SELECT * INTO v_existing_payment FROM public.billing_history WHERE razorpay_payment_id = p_payment_id;
  
  IF v_existing_payment IS NOT NULL THEN
    IF v_existing_payment.status = 'success' THEN
      RETURN jsonb_build_object('success', true, 'message', 'Payment already processed successfully', 'status', 'success');
    ELSIF v_existing_payment.status = 'failed_activation' THEN
      -- Proceed to attempt recovery below, we'll just update it
      v_billing_id := v_existing_payment.id;
    ELSE
      RETURN jsonb_build_object('success', false, 'message', 'Payment is currently in status: ' || v_existing_payment.status, 'status', v_existing_payment.status);
    END IF;
  ELSE
    -- INSERT Payment record FIRST as 'processing' so it is never lost
    INSERT INTO public.billing_history (
      user_id, razorpay_payment_id, razorpay_order_id, amount, status, coupon_id
    ) VALUES (
      p_user_id, p_payment_id, p_order_id, p_final_price, 'processing', p_coupon_id
    ) RETURNING id INTO v_billing_id;
  END IF;

  -- 2. Begin Activation Block. If this fails, we catch the exception and mark the billing record as failed_activation.
  BEGIN
    -- Fetch the plan
    SELECT * INTO v_plan FROM public.plans WHERE interval = p_plan_interval;
    IF v_plan IS NULL THEN
      RAISE EXCEPTION 'PLAN_NOT_FOUND';
    END IF;

    v_role := CASE WHEN p_plan_interval = 'year' THEN 'pro_yearly' ELSE 'pro_monthly' END;
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

    -- Update Billing History with the subscription ID and success status
    UPDATE public.billing_history SET 
      subscription_id = v_subscription_id, 
      status = 'success' 
    WHERE id = v_billing_id;

    -- Create Subscription Event
    INSERT INTO public.subscription_events (
      user_id, subscription_id, event_type, metadata
    ) VALUES (
      p_user_id, v_subscription_id, CASE WHEN v_existing_sub_id IS NOT NULL THEN 'renewed' ELSE 'started' END, jsonb_build_object('planInterval', p_plan_interval, 'finalPrice', p_final_price, 'paymentId', p_payment_id)
    );

    -- Update Profile
    UPDATE public.profiles SET 
      role = v_role,
      subscription_status = 'active',
      subscription_renewal_date = now() + (v_duration_days || ' days')::interval
    WHERE auth_id = p_user_id;

    -- Grant Bonus Coins (ON CONFLICT DO NOTHING relies on the constraint created earlier)
    INSERT INTO public.coin_transactions (
      user_id, amount, description, transaction_type, reference_id
    ) VALUES (
      p_user_id, v_bonus_coins, CASE WHEN p_plan_interval = 'year' THEN 'Pro Yearly Bonus' ELSE 'Pro Monthly Bonus' END, v_bonus_type, p_payment_id
    ) ON CONFLICT (reference_id, transaction_type) DO NOTHING;

    -- Increment Coupon Usage if applicable
    IF p_coupon_id IS NOT NULL THEN
      UPDATE public.coupons SET used_count = used_count + 1 WHERE id = p_coupon_id;
    END IF;

    RETURN jsonb_build_object(
      'success', true,
      'status', 'success',
      'role', v_role,
      'expiresAt', (now() + (v_duration_days || ' days')::interval)
    );

  EXCEPTION WHEN OTHERS THEN
    -- If ANYTHING fails (e.g., PLAN_NOT_FOUND, trigger error, deadlock), catch it here!
    v_error_msg := SQLERRM;
    
    -- Mark the payment as failed_activation. We do NOT roll back the initial billing_history insertion!
    UPDATE public.billing_history SET 
      status = 'failed_activation' 
    WHERE id = v_billing_id;

    -- Return a specific state so the frontend knows the payment was saved
    RETURN jsonb_build_object(
      'success', false,
      'status', 'failed_activation',
      'message', 'Payment recorded, but activation failed: ' || v_error_msg
    );
  END;
END;
$$;


-- 3. Recovery RPC (Used by Admin Panel or Automated Jobs)
CREATE OR REPLACE FUNCTION public.retry_subscription_activation(
  p_payment_id text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_billing record;
  v_plan_interval text;
BEGIN
  -- Check if admin (optional, can be adapted if triggered via webhook)
  -- Allow service_role to bypass, check if auth.uid() is admin otherwise
  IF auth.role() = 'authenticated' THEN
    IF (SELECT role FROM public.profiles WHERE auth_id = auth.uid()) != 'admin' THEN
      RAISE EXCEPTION 'UNAUTHORIZED';
    END IF;
  END IF;

  SELECT * INTO v_billing FROM public.billing_history WHERE razorpay_payment_id = p_payment_id;
  
  IF v_billing IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Payment not found');
  END IF;
  
  IF v_billing.status = 'success' THEN
    RETURN jsonb_build_object('success', true, 'message', 'Payment already activated successfully');
  END IF;

  -- Determine plan_interval from amount or razorpay_order_id (In a real system, store this in billing metadata)
  -- For Revoraa, if amount > 200, it's likely yearly. Base prices are 149 and 1499.
  v_plan_interval := CASE WHEN v_billing.amount >= 1000 THEN 'year' ELSE 'month' END;

  -- Just call the main process function again
  RETURN public.process_premium_subscription(
    v_billing.user_id,
    p_payment_id,
    v_billing.razorpay_order_id,
    v_plan_interval,
    v_billing.amount,
    v_billing.coupon_id
  );
END;
$$;
