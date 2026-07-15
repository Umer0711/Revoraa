-- 1. Create daily_activity table
create table if not exists public.daily_activity (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  activity_date date not null,
  activity_type text not null,
  created_at timestamptz default now()
);

-- Ensure a user only has one specific activity type logged per day (optional, but good for cleanliness)
-- Actually, the prompt says "Only one record per day should count toward streak"
-- Let's just create an index to quickly find today's activity.
create index if not exists idx_daily_activity_user_date on public.daily_activity(user_id, activity_date);

alter table public.daily_activity enable row level security;
create policy "Users can view their own activity"
  on public.daily_activity for select
  using (auth.uid() = user_id);

-- 2. Create RPC to log activity and update streak
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
