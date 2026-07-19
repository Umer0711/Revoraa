-- Fix coin_transactions_reference_type_key constraint to include user_id
-- This allows multiple users to purchase the same shop item without violating the unique constraint.

ALTER TABLE public.coin_transactions DROP CONSTRAINT IF EXISTS coin_transactions_reference_type_key;
ALTER TABLE public.coin_transactions ADD CONSTRAINT coin_transactions_reference_type_key UNIQUE (user_id, reference_id, transaction_type);

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
  
  -- Must use FOUND instead of IS NOT NULL because records with any null fields evaluate to false for IS NOT NULL
  IF FOUND THEN
    IF v_existing_payment.status = 'success' THEN
      RETURN jsonb_build_object('success', true, 'message', 'Payment already processed successfully', 'status', 'success');
    ELSIF v_existing_payment.status = 'failed_activation' THEN
      v_billing_id := v_existing_payment.id;
    ELSE
      RETURN jsonb_build_object('success', false, 'message', 'Payment is currently in status: ' || v_existing_payment.status, 'status', v_existing_payment.status);
    END IF;
  ELSE
    -- Record the billing event initially as processing
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

    -- Grant Coins (Idempotent by reference_id AND user_id)
    INSERT INTO public.coin_transactions (
      user_id, amount, description, transaction_type, reference_id
    ) VALUES (
      p_user_id, v_bonus_coins, CASE WHEN p_plan_interval = 'year' THEN 'Pro Yearly Bonus' ELSE 'Pro Monthly Bonus' END, v_bonus_type, p_payment_id
    ) ON CONFLICT (user_id, reference_id, transaction_type) DO NOTHING;

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
