-- Drop existing function because we are changing the return type from void to boolean
DROP FUNCTION IF EXISTS public.add_user_xp(uuid, integer);

-- Modify add_user_xp to return boolean and grant 100 coins on level up
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
