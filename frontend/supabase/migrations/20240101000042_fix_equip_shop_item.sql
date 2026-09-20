-- Migration: 20240101000042_fix_equip_shop_item.sql
-- Fix purchase_shop_item, equip_shop_item & unequip_shop_item to handle safe transactions, deterministic coin deduction, free items, and inventory RLS cleanly.

-- 1. Ensure user_inventory RLS policies are clean
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users own inventory" ON public.user_inventory;
CREATE POLICY "Users own inventory" ON public.user_inventory
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. Ensure coin_transactions RLS policies & constraints are clean
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own coin transactions" ON public.coin_transactions;
CREATE POLICY "Users view own coin transactions" ON public.coin_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop restrictive unique constraint on coin_transactions that was causing ON CONFLICT skips
ALTER TABLE public.coin_transactions DROP CONSTRAINT IF EXISTS coin_transactions_reference_type_key;

-- 3. Update trigger to prevent double-deduction when purchase_shop_item explicitly updates profiles
CREATE OR REPLACE FUNCTION public.update_coins_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- If transaction is a shop_purchase, purchase_shop_item already handles atomic profile deduction
  IF NEW.transaction_type = 'shop_purchase' THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles SET coins_balance = GREATEST(coins_balance + NEW.amount, 0) WHERE auth_id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET coins_balance = GREATEST(coins_balance - OLD.amount, 0) WHERE auth_id = OLD.user_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.profiles SET coins_balance = GREATEST(coins_balance - OLD.amount + NEW.amount, 0) WHERE auth_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Upgrade purchase_shop_item function to be fully idempotent, safe, and perform exact coin deduction
CREATE OR REPLACE FUNCTION public.purchase_shop_item(p_user_id uuid, p_item_id uuid, p_coin_cost integer DEFAULT 0)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_coins integer;
  v_item record;
  v_already_owned boolean;
BEGIN
  IF p_user_id != auth.uid() THEN 
    RAISE EXCEPTION 'Unauthorized'; 
  END IF;

  -- Fetch item from DB
  SELECT id, name, COALESCE(price, 0) AS price, category, is_active 
  INTO v_item 
  FROM public.shop_items 
  WHERE id = p_item_id;

  IF v_item.id IS NULL THEN
    RAISE EXCEPTION 'ITEM_NOT_FOUND';
  END IF;
  
  IF v_item.is_active IS FALSE THEN
    RAISE EXCEPTION 'ITEM_NOT_AVAILABLE';
  END IF;

  -- Check if already owned
  SELECT EXISTS(
    SELECT 1 FROM public.user_inventory WHERE user_id = p_user_id AND shop_item_id = p_item_id
  ) INTO v_already_owned;

  -- Lock user profile and fetch current coins
  SELECT coins_balance INTO v_coins FROM public.profiles WHERE auth_id = p_user_id FOR UPDATE;
  IF v_coins IS NULL THEN
    v_coins := 0;
  END IF;

  -- If user already owns this item, return clean status with current coins
  IF v_already_owned THEN
    RETURN jsonb_build_object(
      'success', true,
      'already_owned', true,
      'item_name', v_item.name,
      'category', v_item.category,
      'coins_spent', 0,
      'coins_remaining', v_coins
    );
  END IF;

  -- Check coin balance
  IF v_coins < v_item.price THEN
    RAISE EXCEPTION 'INSUFFICIENT_COINS';
  END IF;

  -- Add to user inventory
  INSERT INTO public.user_inventory (user_id, shop_item_id, is_equipped, purchased_at)
  VALUES (p_user_id, p_item_id, false, NOW())
  ON CONFLICT (user_id, shop_item_id) DO NOTHING;

  -- Deduct coins directly & atomically from profiles table if price > 0
  IF v_item.price > 0 THEN
    UPDATE public.profiles
    SET coins_balance = GREATEST(coins_balance - v_item.price, 0)
    WHERE auth_id = p_user_id;

    -- Log transaction for audit trail
    INSERT INTO public.coin_transactions (user_id, amount, description, transaction_type, reference_id, created_at)
    VALUES (p_user_id, -v_item.price, 'Purchased: ' || v_item.name, 'shop_purchase', p_item_id::text, NOW());
  END IF;

  -- Fetch updated remaining coins directly from profiles table
  SELECT coins_balance INTO v_coins FROM public.profiles WHERE auth_id = p_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'already_owned', false,
    'item_name', v_item.name,
    'category', v_item.category,
    'coins_spent', v_item.price,
    'coins_remaining', COALESCE(v_coins, 0)
  );
END;
$$;

-- 5. Upgrade equip_shop_item function
CREATE OR REPLACE FUNCTION public.equip_shop_item(p_user_id uuid, p_item_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_inv record;
  v_category text;
BEGIN
  IF p_user_id != auth.uid() THEN 
    RAISE EXCEPTION 'Unauthorized'; 
  END IF;

  -- Check if user owns this item
  SELECT ui.id, si.category
  INTO v_inv
  FROM public.user_inventory ui
  JOIN public.shop_items si ON si.id = ui.shop_item_id
  WHERE ui.user_id = p_user_id AND ui.shop_item_id = p_item_id;

  -- If item is not in inventory, check if it's a free item (price <= 0) and auto-grant it
  IF v_inv.id IS NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.shop_items 
      WHERE id = p_item_id AND (price IS NULL OR price <= 0) AND (is_active IS TRUE OR is_active IS NULL)
    ) THEN
      INSERT INTO public.user_inventory (user_id, shop_item_id, is_equipped, purchased_at)
      VALUES (p_user_id, p_item_id, false, NOW())
      ON CONFLICT (user_id, shop_item_id) DO NOTHING;

      SELECT ui.id, si.category
      INTO v_inv
      FROM public.user_inventory ui
      JOIN public.shop_items si ON si.id = ui.shop_item_id
      WHERE ui.user_id = p_user_id AND ui.shop_item_id = p_item_id;
    END IF;

    IF v_inv.id IS NULL THEN
      RAISE EXCEPTION 'ITEM_NOT_OWNED';
    END IF;
  END IF;

  v_category := v_inv.category;

  -- Unequip any currently equipped item in the same category for this user
  UPDATE public.user_inventory ui
  SET is_equipped = false
  FROM public.shop_items si
  WHERE ui.shop_item_id = si.id
    AND ui.user_id = p_user_id
    AND si.category = v_category
    AND ui.is_equipped = true;

  -- Equip target item
  UPDATE public.user_inventory
  SET is_equipped = true
  WHERE user_id = p_user_id AND shop_item_id = p_item_id;

  RETURN jsonb_build_object('success', true, 'category', v_category, 'shop_item_id', p_item_id);
END;
$$;

-- 6. Upgrade unequip_shop_item function
CREATE OR REPLACE FUNCTION public.unequip_shop_item(p_user_id uuid, p_item_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF p_user_id != auth.uid() THEN 
    RAISE EXCEPTION 'Unauthorized'; 
  END IF;

  UPDATE public.user_inventory
  SET is_equipped = false
  WHERE user_id = p_user_id AND shop_item_id = p_item_id;

  RETURN jsonb_build_object('success', true, 'shop_item_id', p_item_id);
END;
$$;
