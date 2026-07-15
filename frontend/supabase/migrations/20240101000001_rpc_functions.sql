-- ============================================================
-- Supabase RPC Functions
-- ============================================================

-- Increment a user stat column safely
create or replace function public.increment_user_stat(p_user_id uuid, p_column text, p_amount integer default 1)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  execute format(
    'update public.user_stats set %I = %I + $1, updated_at = now() where user_id = $2',
    p_column, p_column
  ) using p_amount, p_user_id;
end;
$$;

-- Add XP and handle level-up
create or replace function public.add_user_xp(p_user_id uuid, p_xp integer)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_xp integer;
  v_level integer;
  v_new_level integer;
begin
  select xp, level into v_xp, v_level
  from public.user_stats
  where user_id = p_user_id;

  v_xp := coalesce(v_xp, 0) + p_xp;

  -- Level = floor(xp / 500) + 1, capped at 100
  v_new_level := least(100, floor(v_xp / 500) + 1);

  update public.user_stats
  set xp = v_xp, level = v_new_level, updated_at = now()
  where user_id = p_user_id;

  -- Create level-up notification if level changed
  if v_new_level > v_level then
    insert into public.notifications (user_id, title, body, type)
    values (p_user_id, '🎉 Level Up!', 'You reached Level ' || v_new_level || '!', 'xp_levelup');
  end if;
end;
$$;

-- Add coins to a user
create or replace function public.add_user_coins(p_user_id uuid, p_coins integer)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.user_stats
  set coins = coins + p_coins, updated_at = now()
  where user_id = p_user_id;
end;
$$;

-- Purchase a shop item atomically
create or replace function public.purchase_shop_item(p_user_id uuid, p_item_id uuid, p_coin_cost integer)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_coins integer;
begin
  select coins into v_coins from public.user_stats where user_id = p_user_id for update;

  if v_coins < p_coin_cost then
    raise exception 'Insufficient coins';
  end if;

  -- Deduct coins
  update public.user_stats set coins = coins - p_coin_cost, updated_at = now() where user_id = p_user_id;

  -- Add to inventory
  insert into public.user_inventory (user_id, shop_item_id)
  values (p_user_id, p_item_id)
  on conflict (user_id, shop_item_id) do nothing;
end;
$$;

-- Update streak for a user (call daily after activity)
create or replace function public.update_streak(p_user_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_last_date date;
  v_streak integer;
  v_longest integer;
  v_today date := current_date;
begin
  select last_activity_date, current_streak, longest_streak
  into v_last_date, v_streak, v_longest
  from public.user_stats
  where user_id = p_user_id;

  if v_last_date is null then
    v_streak := 1;
  elsif v_last_date = v_today then
    -- Already counted today
    return;
  elsif v_last_date = v_today - 1 then
    v_streak := coalesce(v_streak, 0) + 1;
  else
    -- Streak broken
    v_streak := 1;
  end if;

  v_longest := greatest(coalesce(v_longest, 0), v_streak);

  update public.user_stats
  set current_streak = v_streak,
      longest_streak = v_longest,
      last_activity_date = v_today,
      updated_at = now()
  where user_id = p_user_id;

  -- Award streak achievement notifications
  if v_streak in (7, 30, 100) then
    insert into public.notifications (user_id, title, body, type)
    values (p_user_id, '🔥 Streak Milestone!', 'You''ve maintained a ' || v_streak || '-day streak!', 'achievement')
    on conflict do nothing;
  end if;
end;
$$;

-- Upsert daily analytics
create or replace function public.upsert_daily_analytics(
  p_user_id uuid,
  p_solved integer default 0,
  p_revised integer default 0,
  p_avg_time numeric default 0,
  p_xp_earned integer default 0,
  p_confidence numeric default 0
)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.analytics_daily (user_id, date, solved, revised, avg_time, xp_earned, confidence)
  values (p_user_id, current_date, p_solved, p_revised, p_avg_time, p_xp_earned, p_confidence)
  on conflict (user_id, date) do update set
    solved      = analytics_daily.solved + p_solved,
    revised     = analytics_daily.revised + p_revised,
    avg_time    = case when analytics_daily.solved + p_solved > 0
                    then (analytics_daily.avg_time * analytics_daily.solved + p_avg_time * p_solved) / (analytics_daily.solved + p_solved)
                    else 0 end,
    xp_earned   = analytics_daily.xp_earned + p_xp_earned,
    confidence  = case when analytics_daily.solved + p_solved > 0
                    then (analytics_daily.confidence * analytics_daily.solved + p_confidence * p_solved) / (analytics_daily.solved + p_solved)
                    else 0 end;
end;
$$;
