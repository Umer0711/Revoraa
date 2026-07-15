-- ============================================================
-- Phase 4: Shop and Economy Additions
-- ============================================================

-- Add color column to shop_items for UI rendering
alter table public.shop_items add column if not exists color text default '#ffffff';

-- Coin Transactions (Audit Log)
create table if not exists public.coin_transactions (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete cascade,
  amount        integer not null, -- positive for earn, negative for spend
  reason        text not null,
  created_at    timestamptz default now()
);

alter table public.coin_transactions enable row level security;
create policy "Users can view their coin transactions"
  on public.coin_transactions for select
  using (auth.uid() = user_id);

-- User Purchases (Audit Log)
create table if not exists public.user_purchases (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete cascade,
  shop_item_id  uuid references public.shop_items(id) on delete restrict,
  coin_cost     integer not null,
  purchased_at  timestamptz default now()
);

alter table public.user_purchases enable row level security;
create policy "Users can view their purchases"
  on public.user_purchases for select
  using (auth.uid() = user_id);

-- Update RPC to log coin_transactions and user_purchases
create or replace function public.purchase_shop_item(p_user_id uuid, p_item_id uuid, p_coin_cost integer)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_coins integer;
  v_item_name text;
begin
  select coins into v_coins from public.user_stats where user_id = p_user_id for update;

  if v_coins < p_coin_cost then
    raise exception 'Insufficient coins';
  end if;

  select name into v_item_name from public.shop_items where id = p_item_id;

  -- Deduct coins
  update public.user_stats set coins = coins - p_coin_cost, updated_at = now() where user_id = p_user_id;

  -- Add to inventory
  insert into public.user_inventory (user_id, shop_item_id)
  values (p_user_id, p_item_id)
  on conflict (user_id, shop_item_id) do nothing;

  -- Audit logs
  insert into public.coin_transactions (user_id, amount, reason)
  values (p_user_id, -p_coin_cost, 'Purchased shop item: ' || v_item_name);

  insert into public.user_purchases (user_id, shop_item_id, coin_cost)
  values (p_user_id, p_item_id, p_coin_cost);
end;
$$;

-- Update add_user_coins RPC to log transaction
create or replace function public.add_user_coins(p_user_id uuid, p_coins integer, p_reason text default 'Earned coins')
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.user_stats
  set coins = coins + p_coins, updated_at = now()
  where user_id = p_user_id;

  insert into public.coin_transactions (user_id, amount, reason)
  values (p_user_id, p_coins, p_reason);
end;
$$;

-- Seed Shop Items
insert into public.shop_items (id, name, description, category, price, color) values
  ('11111111-1111-1111-1111-111111111111', 'Early Adopter', 'For those who joined in the beta phase.', 'badges', 500, '#f59e0b'),
  ('22222222-2222-2222-2222-222222222222', 'Bug Hunter', 'Found and reported a critical bug.', 'badges', 1000, '#ef4444'),
  ('33333333-3333-3333-3333-333333333333', 'Consistency King', 'Maintained a 30-day streak.', 'badges', 1500, '#10b981'),
  ('44444444-4444-4444-4444-444444444444', 'Neon Border', 'Adds a glowing border to your profile.', 'decorations', 2000, '#8b5cf6'),
  ('55555555-5555-5555-5555-555555555555', 'Holographic Avatar', 'Special hover effect on avatar.', 'decorations', 2500, '#3b82f6'),
  ('66666666-6666-6666-6666-666666666666', 'The Grinder', 'Title displayed under your name.', 'titles', 1000, '#f97316'),
  ('77777777-7777-7777-7777-777777777777', 'Algorithm Wizard', 'Title displayed under your name.', 'titles', 5000, '#ec4899'),
  ('88888888-8888-8888-8888-888888888888', 'Midnight Blue', 'Deep blue editor theme.', 'themes', 800, '#1e3a8a'),
  ('99999999-9999-9999-9999-999999999999', 'Cyberpunk', 'High contrast neon theme.', 'themes', 3000, '#10b981')
on conflict do nothing;

