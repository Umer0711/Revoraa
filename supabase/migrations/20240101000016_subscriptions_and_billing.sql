-- Migration: Subscriptions, Billing, and Roles
-- Implements production-ready SaaS billing tables, coupons, roles, and feature limits.

-- 1. Update Profile Roles
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('free', 'pro_monthly', 'pro_yearly');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'free';

-- 2. Plans Table
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    razorpay_plan_id TEXT,
    price NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    interval TEXT CHECK (interval IN ('month', 'year')),
    features JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert Default Plans
INSERT INTO public.plans (name, price, interval) VALUES 
('Monthly Pro', 149, 'month'),
('Yearly Pro', 1499, 'year')
ON CONFLICT (name) DO NOTHING;

-- 3. Coupons
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    discount_amount NUMERIC,
    discount_percentage NUMERIC,
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert Launch Coupon
INSERT INTO public.coupons (code, discount_amount) VALUES 
('GLITCHIVY', 50) -- Wait, 149 -> 99 is 50 off. For yearly, 1499 -> 999 is 500 off. We'll handle the exact logic in the edge function.
ON CONFLICT (code) DO NOTHING;

-- 4. Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.plans(id),
    status TEXT NOT NULL CHECK (status IN ('trial', 'active', 'cancelled', 'expired', 'pending', 'failed', 'refunded')),
    razorpay_subscription_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_order_id TEXT,
    started_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ,
    renewal_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Billing History (Invoices / Payment Logs)
CREATE TABLE IF NOT EXISTS public.billing_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id),
    razorpay_payment_id TEXT,
    razorpay_order_id TEXT,
    razorpay_invoice_id TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending', 'refunded')),
    payment_method TEXT,
    coupon_id UUID REFERENCES public.coupons(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Subscription Events (Audit Log)
CREATE TABLE IF NOT EXISTS public.subscription_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id),
    event_type TEXT NOT NULL, -- 'started', 'renewed', 'cancelled', 'expired', 'refunded', 'upgraded', 'downgraded'
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Device Sessions (Enforcing 1 active device)
CREATE TABLE IF NOT EXISTS public.device_sessions (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    device_fingerprint TEXT NOT NULL,
    browser_info TEXT,
    os_info TEXT,
    ip_address TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Feature Gating Trigger (15 problems/month for Free users)
CREATE OR REPLACE FUNCTION check_free_plan_limits()
RETURNS TRIGGER AS $$
DECLARE
    v_role user_role;
    v_count integer;
BEGIN
    -- Get user role
    SELECT role INTO v_role FROM public.profiles WHERE auth_id = NEW.user_id;
    
    IF v_role = 'free' THEN
        -- Check how many problems added in the current month
        SELECT count(*) INTO v_count
        FROM public.solved_problems
        WHERE user_id = NEW.user_id
          AND date_trunc('month', created_at) = date_trunc('month', now());
          
        IF v_count >= 15 THEN
            RAISE EXCEPTION 'FREE_LIMIT_EXCEEDED';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_free_plan_limits ON public.solved_problems;
CREATE TRIGGER enforce_free_plan_limits
BEFORE INSERT ON public.solved_problems
FOR EACH ROW
EXECUTE FUNCTION check_free_plan_limits();

-- 9. Setup pg_cron for daily subscription expiration check
CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION downgrade_expired_subscriptions()
RETURNS void AS $$
BEGIN
    -- Update profiles to free for expired subscriptions
    UPDATE public.profiles p
    SET role = 'free'
    FROM public.subscriptions s
    WHERE p.auth_id = s.user_id
      AND s.status = 'active'
      AND s.expires_at < now();

    -- Log events
    INSERT INTO public.subscription_events (user_id, subscription_id, event_type)
    SELECT user_id, id, 'expired'
    FROM public.subscriptions
    WHERE status = 'active' AND expires_at < now();

    -- Update subscription status
    UPDATE public.subscriptions
    SET status = 'expired'
    WHERE status = 'active' AND expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Schedule cron job to run daily at midnight UTC
SELECT cron.schedule('downgrade_expired_subscriptions', '0 0 * * *', 'SELECT downgrade_expired_subscriptions()');

-- 10. Helper function to increment coupon usage safely
CREATE OR REPLACE FUNCTION increment_coupon_usage(p_coupon_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.coupons
    SET used_count = used_count + 1
    WHERE id = p_coupon_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Device Management RPC
CREATE OR REPLACE FUNCTION register_device(p_fingerprint TEXT, p_browser_info TEXT, p_os_info TEXT)
RETURNS void AS $$
BEGIN
    -- Upsert the device session. Because user_id is the primary key, it overwrites the old device.
    INSERT INTO public.device_sessions (user_id, device_fingerprint, browser_info, os_info, last_login)
    VALUES (auth.uid(), p_fingerprint, p_browser_info, p_os_info, now())
    ON CONFLICT (user_id) DO UPDATE
    SET device_fingerprint = EXCLUDED.device_fingerprint,
        browser_info = EXCLUDED.browser_info,
        os_info = EXCLUDED.os_info,
        last_login = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
