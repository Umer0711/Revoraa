-- ============================================================
-- Migration 021: Complete Coin Shop Progression System
-- ============================================================

-- ============================================================
-- PHASE 1: Standardize shop_items schema
-- ============================================================

-- Add missing columns (safe IF NOT EXISTS)
ALTER TABLE public.shop_items ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE public.shop_items ADD COLUMN IF NOT EXISTS price integer;
ALTER TABLE public.shop_items ADD COLUMN IF NOT EXISTS rarity text DEFAULT 'common';
ALTER TABLE public.shop_items ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false;
ALTER TABLE public.shop_items ADD COLUMN IF NOT EXISTS icon_name text;
ALTER TABLE public.shop_items ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

-- Create coin_transactions table if missing
CREATE TABLE IF NOT EXISTS public.coin_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount integer NOT NULL,
  reason text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Backfill: copy legacy columns into standardized ones
UPDATE public.shop_items SET category = type WHERE category IS NULL AND type IS NOT NULL;
UPDATE public.shop_items SET price = coin_cost WHERE price IS NULL AND coin_cost IS NOT NULL;

-- ============================================================
-- PHASE 2: Clear old seed data and insert full catalog
-- ============================================================

DELETE FROM public.shop_items;

-- ── BADGES ──────────────────────────────────────────────────
INSERT INTO public.shop_items (name, description, category, price, rarity, color, icon_name, sort_order, is_active) VALUES
  ('Beginner',          'Every journey starts with a single step.',                    'badges', 250,   'common',    '#94a3b8', 'Baby',        1, true),
  ('Daily Grinder',     'Awarded to those who show up every single day.',              'badges', 500,   'common',    '#f59e0b', 'Flame',       2, true),
  ('Consistency King',  'Maintained an impressive solving streak.',                    'badges', 1000,  'rare',      '#10b981', 'Crown',       3, true),
  ('Night Owl',         'For those who code when the world sleeps.',                   'badges', 1200,  'rare',      '#8b5cf6', 'Moon',        4, true),
  ('Problem Hunter',    'Relentlessly tracks down every problem.',                     'badges', 1500,  'rare',      '#3b82f6', 'Crosshair',   5, true),
  ('Algorithm Master',  'Deep understanding of algorithmic thinking.',                 'badges', 2500,  'epic',      '#a855f7', 'Brain',       6, true),
  ('Interview Ready',   'Prepared and confident for any technical interview.',         'badges', 3000,  'epic',      '#06b6d4', 'Briefcase',   7, true),
  ('LeetCode Legend',   'A legend on the competitive coding battlefield.',             'badges', 5000,  'legendary', '#fbbf24', 'Trophy',      8, true),
  ('DSA Grandmaster',   'Mastered every data structure and algorithm pattern.',        'badges', 7000,  'legendary', '#ef4444', 'Swords',      9, true),
  ('Revoraa Elite',     'The highest honor. Only the most dedicated earn this.',       'badges', 10000, 'mythic',    '#ff6b6b', 'Shield',     10, true);

-- ── TITLES ──────────────────────────────────────────────────
INSERT INTO public.shop_items (name, description, category, price, rarity, color, icon_name, sort_order, is_active) VALUES
  ('Problem Solver',       'Displayed under your name across the platform.',           'titles', 300,  'common',    '#94a3b8', 'Code',         1, true),
  ('Array Master',         'A specialist in array manipulation.',                      'titles', 500,  'common',    '#10b981', 'LayoutList',   2, true),
  ('Binary Search Lover',  'Divides and conquers with precision.',                     'titles', 700,  'rare',      '#3b82f6', 'Search',       3, true),
  ('Pattern Hunter',       'Finds the hidden pattern in every problem.',               'titles', 1000, 'rare',      '#f59e0b', 'Fingerprint',  4, true),
  ('Code Wizard',          'Writes elegant, efficient solutions.',                     'titles', 1500, 'epic',      '#8b5cf6', 'Wand2',        5, true),
  ('Interview Slayer',     'Destroys every coding interview round.',                   'titles', 2500, 'epic',      '#ef4444', 'Sword',        6, true),
  ('Algorithm Architect',  'Designs algorithms from the ground up.',                   'titles', 5000, 'legendary', '#fbbf24', 'Building2',    7, true);

-- ── PROFILE FRAMES ──────────────────────────────────────────
INSERT INTO public.shop_items (name, description, category, price, rarity, color, icon_name, sort_order, is_active) VALUES
  ('Minimal Silver',   'A clean, subtle silver border.',                               'profile_frames', 800,  'common',    '#c0c0c0', 'Circle',       1, true),
  ('Amber Glow',       'Warm amber border with a soft glow.',                          'profile_frames', 1000, 'rare',      '#f59e0b', 'Sun',          2, true),
  ('Glass Crystal',    'Transparent glassmorphism frame.',                              'profile_frames', 1500, 'rare',      '#60a5fa', 'Diamond',      3, true),
  ('Cyber Neon',       'Neon edges with a cyberpunk aesthetic.',                        'profile_frames', 2000, 'epic',      '#06d6a0', 'Zap',          4, true),
  ('Royal Gold',       'A premium gold frame for royalty.',                             'profile_frames', 3000, 'epic',      '#fbbf24', 'Crown',        5, true),
  ('Elite Platinum',   'Exclusive platinum border. Pure prestige.',                     'profile_frames', 5000, 'legendary', '#e2e8f0', 'Gem',          6, true),
  ('Animated Flame',   'A frame that burns with animated fire.',                        'profile_frames', 8000, 'mythic',    '#ef4444', 'Flame',        7, true);

-- ── DASHBOARD THEMES ────────────────────────────────────────
INSERT INTO public.shop_items (name, description, category, price, rarity, color, icon_name, sort_order, is_active) VALUES
  ('Classic Black',    'The default dark experience.',                                  'dashboard_themes', 1000, 'common', '#1a1a2e', 'Moon',     1, true),
  ('Amber Elite',      'Warm amber accents throughout the dashboard.',                  'dashboard_themes', 1000, 'common', '#f59e0b', 'Sun',      2, true),
  ('Midnight Blue',    'Deep blue tones for focused coding.',                           'dashboard_themes', 1000, 'common', '#1e3a5f', 'Cloud',    3, true),
  ('Forest Emerald',   'Fresh green inspired by nature.',                               'dashboard_themes', 1000, 'common', '#065f46', 'TreePine', 4, true),
  ('Purple Nebula',    'Cosmic purple gradients.',                                      'dashboard_themes', 1000, 'common', '#581c87', 'Stars',    5, true),
  ('Ruby Red',         'Bold and passionate red accents.',                              'dashboard_themes', 1000, 'common', '#991b1b', 'Heart',    6, true),
  ('Carbon',           'Ultra-dark with subtle carbon textures.',                       'dashboard_themes', 1000, 'common', '#262626', 'Layers',   7, true),
  ('Minimal White',    'Clean white interface for day mode lovers.',                    'dashboard_themes', 1000, 'common', '#f8fafc', 'SunMoon',  8, true);

-- ── SIDEBAR THEMES ──────────────────────────────────────────
INSERT INTO public.shop_items (name, description, category, price, rarity, color, icon_name, sort_order, is_active) VALUES
  ('Amber',    'Warm amber sidebar accents.',                                           'sidebar_themes', 600, 'common', '#f59e0b', 'Sun',       1, true),
  ('Carbon',   'Dark carbon sidebar.',                                                  'sidebar_themes', 600, 'common', '#333333', 'Layers',    2, true),
  ('Purple',   'Rich purple sidebar.',                                                  'sidebar_themes', 600, 'common', '#7c3aed', 'Palette',   3, true),
  ('Ocean',    'Deep ocean blue sidebar.',                                              'sidebar_themes', 600, 'common', '#0284c7', 'Waves',     4, true),
  ('Emerald',  'Fresh emerald green sidebar.',                                          'sidebar_themes', 600, 'common', '#059669', 'TreePine',  5, true),
  ('Crimson',  'Bold crimson red sidebar.',                                             'sidebar_themes', 600, 'common', '#dc2626', 'Flame',     6, true);

-- ── CURSOR EFFECTS ──────────────────────────────────────────
INSERT INTO public.shop_items (name, description, category, price, rarity, color, icon_name, sort_order, is_active) VALUES
  ('Amber Trail',      'Warm amber particles follow your cursor.',                      'cursor_effects', 1500, 'epic',      '#f59e0b', 'MousePointer2', 1, true),
  ('Spark Trail',      'Electric sparks trail behind your cursor.',                     'cursor_effects', 1500, 'epic',      '#fbbf24', 'Sparkles',      2, true),
  ('Fire Trail',       'Blazing fire follows your every move.',                         'cursor_effects', 1500, 'epic',      '#ef4444', 'Flame',         3, true),
  ('Particle Trail',   'Floating particles drift from your cursor.',                    'cursor_effects', 1500, 'epic',      '#8b5cf6', 'Atom',          4, true),
  ('Lightning Trail',  'Electric lightning crackles behind you.',                       'cursor_effects', 1500, 'legendary', '#06b6d4', 'Zap',           5, true),
  ('Neon Trail',       'Bright neon glow trails your cursor.',                          'cursor_effects', 1500, 'legendary', '#10b981', 'Lightbulb',     6, true);

-- ── CARD STYLES ─────────────────────────────────────────────
INSERT INTO public.shop_items (name, description, category, price, rarity, color, icon_name, sort_order, is_active) VALUES
  ('Glass',     'Glassmorphism frosted cards.',                                         'card_styles', 1000, 'common', '#94a3b8', 'Square',       1, true),
  ('Gradient',  'Smooth gradient backgrounds on all cards.',                            'card_styles', 1000, 'rare',   '#a855f7', 'Blend',        2, true),
  ('Minimal',   'Clean minimal card borders.',                                          'card_styles', 1000, 'common', '#64748b', 'Minus',        3, true),
  ('Carbon',    'Dark carbon fiber texture cards.',                                     'card_styles', 1000, 'rare',   '#333333', 'Layers',       4, true),
  ('Glow',      'Cards with a subtle outer glow.',                                     'card_styles', 1000, 'epic',   '#f59e0b', 'Sparkles',     5, true),
  ('Elite',     'Premium card styling with gold accents.',                              'card_styles', 1000, 'epic',   '#fbbf24', 'Star',         6, true);

-- ── NAME COLORS ─────────────────────────────────────────────
INSERT INTO public.shop_items (name, description, category, price, rarity, color, icon_name, sort_order, is_active) VALUES
  ('Amber',    'Your name glows amber across the platform.',                            'name_colors', 300, 'common', '#f59e0b', 'Type',   1, true),
  ('Gold',     'Premium gold name color.',                                              'name_colors', 300, 'common', '#fbbf24', 'Type',   2, true),
  ('Silver',   'Clean silver name color.',                                              'name_colors', 300, 'common', '#c0c0c0', 'Type',   3, true),
  ('Emerald',  'Fresh emerald green name.',                                             'name_colors', 300, 'common', '#10b981', 'Type',   4, true),
  ('Purple',   'Rich purple name.',                                                     'name_colors', 300, 'common', '#8b5cf6', 'Type',   5, true),
  ('Cyan',     'Electric cyan name.',                                                   'name_colors', 300, 'common', '#06b6d4', 'Type',   6, true),
  ('Rose',     'Soft rose pink name.',                                                  'name_colors', 300, 'common', '#f43f5e', 'Type',   7, true);

-- ── DECORATIONS ─────────────────────────────────────────────
INSERT INTO public.shop_items (name, description, category, price, rarity, color, icon_name, sort_order, is_active) VALUES
  ('Floating Crown',   'A floating crown above your avatar.',                           'decorations', 2500, 'epic',      '#fbbf24', 'Crown',       1, true),
  ('Golden Star',      'A shining star decoration.',                                    'decorations', 3000, 'epic',      '#f59e0b', 'Star',        2, true),
  ('Fire Wings',       'Blazing wings behind your avatar.',                             'decorations', 4000, 'legendary', '#ef4444', 'Bird',        3, true),
  ('Lightning Aura',   'Electric aura surrounding your profile.',                       'decorations', 4500, 'legendary', '#06b6d4', 'Zap',         4, true),
  ('Elite Shield',     'A prestigious shield decoration.',                              'decorations', 5000, 'legendary', '#8b5cf6', 'Shield',      5, true),
  ('Premium Halo',     'A golden halo floating above.',                                 'decorations', 6000, 'mythic',    '#fbbf24', 'CircleDot',   6, true);

-- ── SEASONAL COLLECTION ─────────────────────────────────────
INSERT INTO public.shop_items (name, description, category, price, rarity, color, icon_name, sort_order, is_active, is_premium) VALUES
  ('Halloween Spirit',    'Spooky seasonal badge. Limited edition.',                    'seasonal', 2000, 'legendary', '#f97316', 'Ghost',       1, false, false),
  ('Christmas Joy',       'Festive holiday badge. Limited edition.',                    'seasonal', 2000, 'legendary', '#dc2626', 'Gift',        2, false, false),
  ('New Year Spark',      'Ring in the new year. Limited edition.',                     'seasonal', 2000, 'legendary', '#fbbf24', 'PartyPopper', 3, false, false),
  ('Hackathon Hero',      'Awarded during hackathon events.',                           'seasonal', 3000, 'mythic',    '#8b5cf6', 'Code',        4, false, false),
  ('Limited Edition',     'Ultra-rare collectible. Once its gone, its gone.',           'seasonal', 5000, 'mythic',    '#ef4444', 'Gem',         5, false, false);


-- ============================================================
-- PHASE 3: Secure RPCs
-- ============================================================

-- Drop the old function because we are changing the return type from void to jsonb
DROP FUNCTION IF EXISTS public.purchase_shop_item(uuid, uuid, integer);

-- Upgraded purchase_shop_item: validates price from DB, checks ownership
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
  -- 1. Lock and fetch user's coins
  SELECT coins INTO v_coins FROM public.user_stats WHERE user_id = p_user_id FOR UPDATE;
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

  -- 5. Deduct coins
  UPDATE public.user_stats SET coins = coins - v_item.price, updated_at = now() WHERE user_id = p_user_id;

  -- 6. Add to inventory
  INSERT INTO public.user_inventory (user_id, shop_item_id)
  VALUES (p_user_id, p_item_id);

  -- 7. Audit trail
  INSERT INTO public.coin_transactions (user_id, amount, reason)
  VALUES (p_user_id, -v_item.price, 'Purchased: ' || v_item.name);

  -- 8. Return the purchased item details
  RETURN jsonb_build_object(
    'success', true,
    'item_name', v_item.name,
    'category', v_item.category,
    'coins_spent', v_item.price,
    'coins_remaining', v_coins - v_item.price
  );
END;
$$;


-- Equip item (unequips any other item in same category first)
CREATE OR REPLACE FUNCTION public.equip_shop_item(p_user_id uuid, p_item_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_inv record;
  v_category text;
BEGIN
  -- 1. Check the user owns this item
  SELECT ui.id, si.category
  INTO v_inv
  FROM public.user_inventory ui
  JOIN public.shop_items si ON si.id = ui.shop_item_id
  WHERE ui.user_id = p_user_id AND ui.shop_item_id = p_item_id;

  IF v_inv.id IS NULL THEN
    RAISE EXCEPTION 'ITEM_NOT_OWNED';
  END IF;

  v_category := v_inv.category;

  -- 2. Unequip any currently equipped item in the same category
  UPDATE public.user_inventory ui
  SET is_equipped = false
  FROM public.shop_items si
  WHERE ui.shop_item_id = si.id
    AND ui.user_id = p_user_id
    AND si.category = v_category
    AND ui.is_equipped = true;

  -- 3. Equip this item
  UPDATE public.user_inventory
  SET is_equipped = true
  WHERE user_id = p_user_id AND shop_item_id = p_item_id;

  RETURN jsonb_build_object('success', true, 'category', v_category);
END;
$$;


-- Unequip item
CREATE OR REPLACE FUNCTION public.unequip_shop_item(p_user_id uuid, p_item_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.user_inventory
  SET is_equipped = false
  WHERE user_id = p_user_id AND shop_item_id = p_item_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'ITEM_NOT_OWNED';
  END IF;

  RETURN jsonb_build_object('success', true);
END;
$$;


-- Grant subscription coins (idempotent — once per subscription_id)
CREATE OR REPLACE FUNCTION public.grant_subscription_coins(p_user_id uuid, p_subscription_id uuid, p_plan_type text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_coins_to_grant integer;
  v_already_granted boolean;
  v_reason text;
BEGIN
  -- Determine amount based on plan
  IF p_plan_type = 'monthly' THEN
    v_coins_to_grant := 1000;
    v_reason := 'PRO Monthly subscription bonus';
  ELSIF p_plan_type = 'yearly' THEN
    v_coins_to_grant := 10000;
    v_reason := 'PRO Yearly subscription bonus';
  ELSE
    RAISE EXCEPTION 'INVALID_PLAN_TYPE';
  END IF;

  -- Check if already granted for this subscription
  SELECT EXISTS(
    SELECT 1 FROM public.coin_transactions
    WHERE user_id = p_user_id
    AND reason = v_reason || ' [' || p_subscription_id::text || ']'
  ) INTO v_already_granted;

  IF v_already_granted THEN
    RETURN jsonb_build_object('success', false, 'message', 'Coins already granted for this subscription');
  END IF;

  -- Grant coins
  UPDATE public.user_stats
  SET coins = coins + v_coins_to_grant, updated_at = now()
  WHERE user_id = p_user_id;

  -- Log transaction with subscription ID to prevent re-granting
  INSERT INTO public.coin_transactions (user_id, amount, reason)
  VALUES (p_user_id, v_coins_to_grant, v_reason || ' [' || p_subscription_id::text || ']');

  RETURN jsonb_build_object('success', true, 'coins_granted', v_coins_to_grant);
END;
$$;


-- ============================================================
-- PHASE 4: Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_shop_items_category ON public.shop_items(category);
CREATE INDEX IF NOT EXISTS idx_shop_items_active ON public.shop_items(is_active);
CREATE INDEX IF NOT EXISTS idx_user_inventory_equipped ON public.user_inventory(user_id, is_equipped) WHERE is_equipped = true;
CREATE INDEX IF NOT EXISTS idx_coin_transactions_user ON public.coin_transactions(user_id, created_at DESC);
