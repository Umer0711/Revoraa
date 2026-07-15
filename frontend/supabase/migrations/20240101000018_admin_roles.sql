-- Migration: Admin Roles and RLS

-- 1. Add is_admin to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 2. Create RLS policies for admins

-- Profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (
  (SELECT is_admin FROM public.profiles WHERE auth_id = auth.uid()) = true
);

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING (
  (SELECT is_admin FROM public.profiles WHERE auth_id = auth.uid()) = true
);

-- Subscriptions
CREATE POLICY "Admins can view all subscriptions"
ON public.subscriptions FOR SELECT
USING (
  (SELECT is_admin FROM public.profiles WHERE auth_id = auth.uid()) = true
);

CREATE POLICY "Admins can update all subscriptions"
ON public.subscriptions FOR UPDATE
USING (
  (SELECT is_admin FROM public.profiles WHERE auth_id = auth.uid()) = true
);

-- Coupons
CREATE POLICY "Admins can manage coupons"
ON public.coupons FOR ALL
USING (
  (SELECT is_admin FROM public.profiles WHERE auth_id = auth.uid()) = true
);

-- Billing History
CREATE POLICY "Admins can view all billing history"
ON public.billing_history FOR SELECT
USING (
  (SELECT is_admin FROM public.profiles WHERE auth_id = auth.uid()) = true
);
