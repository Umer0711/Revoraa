-- 20240101000038_audit_rpc_isolation.sql
-- Adds auth.uid() = p_user_id check to all security definer RPCs

create or replace function public.increment_user_stat(p_user_id uuid, p_column text, p_amount integer default 1)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  IF p_user_id != auth.uid() THEN RAISE EXCEPTION 'Unauthorized'; END IF;

  execute format(
    'update public.user_stats set %I = %I + $1, updated_at = now() where user_id = $2',
    p_column, p_column
  ) using p_amount, p_user_id;
end;
$$;



create or replace function public.add_user_xp(p_user_id uuid, p_xp integer)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  v_xp integer;
  v_level integer;
  v_new_level integer;
  v_leveled_up boolean := false;
begin
  IF p_user_id != auth.uid() THEN RAISE EXCEPTION 'Unauthorized'; END IF;

  select xp, level into v_xp, v_level
  from public.user_stats
  where user_id = p_user_id;

  v_xp := coalesce(v_xp, 0) + p_xp;

  -- Level = floor(xp / 500) + 1, capped at 100
  v_new_level := least(100, floor(v_xp / 500) + 1);

  if v_new_level > v_level then
    v_leveled_up := true;
    -- Also award 100 coins on level up
    update public.user_stats
    set xp = v_xp, level = v_new_level, coins = coins + 100, updated_at = now()
    where user_id = p_user_id;

    -- Create level-up notification
    insert into public.notifications (user_id, title, body, type)
    values (p_user_id, '🎉 Level Up!', 'You reached Level ' || v_new_level || ' and earned 100 coins!', 'xp_levelup');
  else
    update public.user_stats
    set xp = v_xp, level = v_new_level, updated_at = now()
    where user_id = p_user_id;
  end if;

  return v_leveled_up;
end;
$$;


create or replace function public.add_user_coins(p_user_id uuid, p_coins integer, p_reason text default 'Earned coins')
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  IF p_user_id != auth.uid() THEN RAISE EXCEPTION 'Unauthorized'; END IF;

  update public.user_stats
  set coins = coins + p_coins, updated_at = now()
  where user_id = p_user_id;

  insert into public.coin_transactions (user_id, amount, reason)
  values (p_user_id, p_coins, p_reason);
end;
$$;



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
  IF p_user_id != auth.uid() THEN RAISE EXCEPTION 'Unauthorized'; END IF;

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
  IF p_user_id != auth.uid() THEN RAISE EXCEPTION 'Unauthorized'; END IF;

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
  IF p_user_id != auth.uid() THEN RAISE EXCEPTION 'Unauthorized'; END IF;

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


create or replace function public.log_user_activity(p_user_id uuid, p_activity_type text)
returns void
language plpgsql
security definer
as $$
declare
  v_timezone text;
  v_local_date date;
  v_last_active date;
  v_current_streak integer;
  v_longest_streak integer;
  v_existing_activity uuid;
begin
  IF p_user_id != auth.uid() THEN RAISE EXCEPTION 'Unauthorized'; END IF;

  -- 1. Get user's timezone from user_settings (default 'UTC' if not found)
  select timezone into v_timezone from public.user_settings where user_id = p_user_id;
  v_local_date := (now() at time zone coalesce(v_timezone, 'UTC'))::date;

  -- 2. Insert into daily_activity
  -- Check if they already have an activity today
  select id into v_existing_activity 
  from public.daily_activity
  where user_id = p_user_id and activity_date = v_local_date
  limit 1;

  if v_existing_activity is null then
    -- This is the FIRST activity today!
    -- Record the activity
    insert into public.daily_activity (user_id, activity_date, activity_type)
    values (p_user_id, v_local_date, p_activity_type);

    -- 3. Update streaks in user_stats
    select last_activity_date, current_streak, longest_streak
    into v_last_active, v_current_streak, v_longest_streak
    from public.user_stats
    where user_id = p_user_id;

    if v_last_active is null or v_last_active < v_local_date - interval '1 day' then
      -- Streak broken or first activity ever
      v_current_streak := 1;
    elsif v_last_active = v_local_date - interval '1 day' then
      -- Streak continues
      v_current_streak := coalesce(v_current_streak, 0) + 1;
    elsif v_last_active = v_local_date then
      -- Edge case (shouldn't happen because of v_existing_activity check, but just in case)
      v_current_streak := coalesce(v_current_streak, 1);
    end if;

    -- Update longest streak
    if coalesce(v_current_streak, 1) > coalesce(v_longest_streak, 0) then
      v_longest_streak := v_current_streak;
    end if;

    -- Commit update
    update public.user_stats
    set current_streak = v_current_streak,
        longest_streak = coalesce(v_longest_streak, v_current_streak),
        last_activity_date = v_local_date,
        updated_at = now()
    where user_id = p_user_id;

  else
    -- They already have an activity today. 
    -- We can still insert the new activity into history, but it won't affect the streak.
    insert into public.daily_activity (user_id, activity_date, activity_type)
    values (p_user_id, v_local_date, p_activity_type);
  end if;
end;
$$;


create or replace function public.get_problem_stats(p_user_id uuid, p_problem_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_stats jsonb;
  v_initial_time integer;
  v_latest_time integer;
  v_best_time integer;
  v_avg_time numeric;
  v_improvement_pct numeric;
begin
  IF p_user_id != auth.uid() THEN RAISE EXCEPTION 'Unauthorized'; END IF;

  -- Get initial solve time
  select time_taken into v_initial_time
  from public.revision_attempts
  where user_id = p_user_id and problem_id = p_problem_id and attempt_type = 'initial_solve'
  order by created_at asc limit 1;

  -- Get latest time
  select time_taken into v_latest_time
  from public.revision_attempts
  where user_id = p_user_id and problem_id = p_problem_id and time_taken is not null
  order by created_at desc limit 1;

  -- Get best and avg time
  select min(time_taken), avg(time_taken) into v_best_time, v_avg_time
  from public.revision_attempts
  where user_id = p_user_id and problem_id = p_problem_id and time_taken is not null;

  -- Calculate improvement % (if initial is greater than latest, it's a positive improvement)
  if v_initial_time is not null and v_latest_time is not null and v_initial_time > 0 then
    v_improvement_pct := round(((v_initial_time - v_latest_time)::numeric / v_initial_time::numeric) * 100, 1);
  else
    v_improvement_pct := 0;
  end if;

  v_stats := jsonb_build_object(
    'best_time', v_best_time,
    'average_time', round(v_avg_time, 1),
    'latest_time', v_latest_time,
    'initial_time', v_initial_time,
    'improvement_pct', v_improvement_pct
  );

  return v_stats;
end;
$$;




create or replace function public.get_advanced_analytics(p_user_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_result jsonb;
  v_avg_solve_time numeric;
  v_fastest_solve integer;
  v_avg_revision_time numeric;
  v_revision_success_rate numeric;
  v_platform_dist jsonb;
  v_difficulty_dist jsonb;
begin
  IF p_user_id != auth.uid() THEN RAISE EXCEPTION 'Unauthorized'; END IF;

  -- Overall Average Solve Time (initial solves)
  select round(avg(time_taken), 1) into v_avg_solve_time
  from public.revision_attempts
  where user_id = p_user_id and attempt_type = 'initial_solve' and time_taken is not null;

  -- Overall Average Revision Time
  select round(avg(time_taken), 1) into v_avg_revision_time
  from public.revision_attempts
  where user_id = p_user_id and attempt_type in ('scheduled_revision', 'manual_revision') and time_taken is not null;

  -- Fastest solve ever
  select min(time_taken) into v_fastest_solve
  from public.revision_attempts
  where user_id = p_user_id and time_taken is not null;

  -- Revision Success Rate (easy + mastered)
  select 
    case when count(*) > 0 then
      round((sum(case when result in ('easy', 'mastered') then 1 else 0 end)::numeric / count(*)) * 100, 1)
    else 0 end into v_revision_success_rate
  from public.revision_attempts
  where user_id = p_user_id and attempt_type in ('scheduled_revision', 'manual_revision') and result is not null;

  -- Platform Distribution
  select jsonb_object_agg(name, count) into v_platform_dist
  from (
    select cp.name, count(sp.id) as count
    from public.solved_problems sp
    join public.problems p on sp.problem_id = p.id
    join public.coding_platforms cp on p.platform_id = cp.id
    where sp.user_id = p_user_id and sp.deleted_at is null
    group by cp.name
  ) sub;

  -- Difficulty Distribution
  select jsonb_object_agg(difficulty, count) into v_difficulty_dist
  from (
    select p.difficulty, count(sp.id) as count
    from public.solved_problems sp
    join public.problems p on sp.problem_id = p.id
    where sp.user_id = p_user_id and sp.deleted_at is null
    group by p.difficulty
  ) sub;

  v_result := jsonb_build_object(
    'average_solve_time', coalesce(v_avg_solve_time, 0),
    'average_revision_time', coalesce(v_avg_revision_time, 0),
    'fastest_solve', coalesce(v_fastest_solve, 0),
    'revision_success_rate', coalesce(v_revision_success_rate, 0),
    'platform_distribution', coalesce(v_platform_dist, '{}'::jsonb),
    'difficulty_distribution', coalesce(v_difficulty_dist, '{}'::jsonb)
  );

  return v_result;
end;
$$;


create or replace function public.get_revision_hub_stats(p_user_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_due_today integer;
  v_completed_today integer;
  v_total_revisions integer;
  v_average_time numeric;
  v_manual_revisions integer;
  v_scheduled_revisions integer;
  v_success_count integer;
  v_success_rate numeric;
begin
  IF p_user_id != auth.uid() THEN RAISE EXCEPTION 'Unauthorized'; END IF;

  -- Due Today (from revision_schedule where next_revision_date <= today and is_completed = false)
  -- Filter by active status in solved_problems ('solving', 'revising')
  select count(*)
  into v_due_today
  from public.revision_schedule rs
  join public.solved_problems sp on rs.solved_problem_id = sp.id
  where rs.user_id = p_user_id 
    and rs.is_completed = false 
    and rs.next_revision_date <= current_date
    and sp.status in ('solving', 'revising');

  -- Completed Today
  -- Assuming users are in UTC or close enough for 'today', you could use user_settings timezone in the future,
  -- but for now falling back to local UTC logic (current_date).
  select count(*)
  into v_completed_today
  from public.revision_attempts
  where user_id = p_user_id and (created_at at time zone 'UTC')::date = current_date;

  -- Aggregates from revision_attempts
  select 
    count(*),
    coalesce(round(avg(time_taken)::numeric, 1), 0),
    count(*) filter (where attempt_type = 'manual_revision'),
    count(*) filter (where attempt_type = 'scheduled_revision'),
    count(*) filter (where result in ('easy', 'mastered'))
  into 
    v_total_revisions, 
    v_average_time, 
    v_manual_revisions, 
    v_scheduled_revisions,
    v_success_count
  from public.revision_attempts
  where user_id = p_user_id;

  v_success_rate := case when v_total_revisions > 0 then round((v_success_count::numeric / v_total_revisions::numeric) * 100, 1) else 0 end;

  return jsonb_build_object(
    'due_today', v_due_today,
    'completed_today', v_completed_today,
    'total_revisions', v_total_revisions,
    'average_time', v_average_time,
    'manual_revisions', v_manual_revisions,
    'scheduled_revisions', v_scheduled_revisions,
    'success_rate', v_success_rate
  );
end;
$$;


CREATE OR REPLACE FUNCTION public.equip_shop_item(p_user_id uuid, p_item_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_inv record;
  v_category text;
BEGIN
  IF p_user_id != auth.uid() THEN RAISE EXCEPTION 'Unauthorized'; END IF;

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




CREATE OR REPLACE FUNCTION public.unequip_shop_item(p_user_id uuid, p_item_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF p_user_id != auth.uid() THEN RAISE EXCEPTION 'Unauthorized'; END IF;

  UPDATE public.user_inventory
  SET is_equipped = false
  WHERE user_id = p_user_id AND shop_item_id = p_item_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'ITEM_NOT_OWNED';
  END IF;

  RETURN jsonb_build_object('success', true);
END;
$$;




CREATE OR REPLACE FUNCTION public.get_dashboard_initialization_data(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  profile_data JSON;
  stats_data JSON;
  achievements_data JSON;
  inventory_data JSON;
  result JSON;
BEGIN
  IF p_user_id != auth.uid() THEN RAISE EXCEPTION 'Unauthorized'; END IF;

  -- 1. Get Profile
  SELECT row_to_json(p) INTO profile_data 
  FROM public.profiles p 
  WHERE p.auth_id = p_user_id;

  -- 2. Get Stats
  SELECT row_to_json(s) INTO stats_data 
  FROM public.user_stats s 
  WHERE s.user_id = p_user_id;
  
  -- 3. Get Achievements (Join with achievements metadata)
  SELECT json_agg(json_build_object(
      'unlocked_at', ua.unlocked_at,
      'achievement', row_to_json(ach.*)
  )) INTO achievements_data 
  FROM public.user_achievements ua 
  JOIN public.achievements ach ON ua.achievement_id = ach.id 
  WHERE ua.user_id = p_user_id;

  -- 4. Get Inventory (Join with shop_items)
  SELECT json_agg(json_build_object(
      'is_equipped', ui.is_equipped,
      'item', row_to_json(si.*)
  )) INTO inventory_data 
  FROM public.user_inventory ui 
  JOIN public.shop_items si ON ui.shop_item_id = si.id 
  WHERE ui.user_id = p_user_id;

  -- Build final JSON result, coalescing nulls to empty objects/arrays
  result := json_build_object(
    'profile', COALESCE(profile_data, '{}'::json),
    'stats', COALESCE(stats_data, '{}'::json),
    'achievements', COALESCE(achievements_data, '[]'::json),
    'inventory', COALESCE(inventory_data, '[]'::json)
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql 

