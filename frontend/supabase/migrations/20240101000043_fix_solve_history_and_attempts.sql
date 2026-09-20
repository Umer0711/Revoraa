-- Migration: Fix Solve History, Attempts, Duration Seconds & Problem Stats
-- Ensures every solve creates a persistent attempt record, tracks exact duration in seconds,
-- and calculates accurate Best Time, Avg Time, and Improvement metrics.

-- 1. Extend revision_attempts with duration_seconds, timestamps, and attempt_number
alter table public.revision_attempts add column if not exists duration_seconds integer;
alter table public.revision_attempts add column if not exists started_at timestamptz;
alter table public.revision_attempts add column if not exists completed_at timestamptz;
alter table public.revision_attempts add column if not exists attempt_number integer;

-- Backfill duration_seconds from existing time_taken (minutes)
update public.revision_attempts
set duration_seconds = time_taken * 60
where duration_seconds is null and time_taken is not null;

-- Backfill missing initial_solve attempts from solved_problems
insert into public.revision_attempts (
  problem_id,
  user_id,
  attempt_type,
  attempt_number,
  time_taken,
  duration_seconds,
  confidence,
  notes,
  result,
  started_at,
  completed_at,
  created_at
)
select 
  sp.problem_id, 
  sp.user_id, 
  'initial_solve', 
  1,
  sp.solve_time_minutes, 
  coalesce(sp.solve_time_minutes * 60, 0), 
  sp.confidence, 
  sp.notes, 
  'easy', 
  coalesce(sp.first_solved_at, sp.created_at, now()),
  coalesce(sp.first_solved_at, sp.created_at, now()),
  coalesce(sp.first_solved_at, sp.created_at, now())
from public.solved_problems sp
where not exists (
  select 1 from public.revision_attempts ra 
  where ra.user_id = sp.user_id and ra.problem_id = sp.problem_id
);

-- Index for speedy user/problem history queries
create index if not exists idx_revision_attempts_user_problem_time on public.revision_attempts(user_id, problem_id, created_at);

-- 2. Enhanced get_problem_stats function
-- Calculates Best Time, Average Time, Latest Time, Initial Time, and Improvement %
create or replace function public.get_problem_stats(p_user_id uuid, p_problem_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_stats jsonb;
  v_initial_seconds integer;
  v_latest_seconds integer;
  v_best_seconds integer;
  v_avg_seconds numeric;
  v_improvement_pct numeric;
  v_total_attempts integer;
begin
  -- Count total attempts
  select count(*) into v_total_attempts
  from public.revision_attempts
  where user_id = p_user_id and problem_id = p_problem_id;

  -- Get initial solve time in seconds
  select coalesce(duration_seconds, time_taken * 60) into v_initial_seconds
  from public.revision_attempts
  where user_id = p_user_id and problem_id = p_problem_id
  order by created_at asc limit 1;

  -- Get latest solve time in seconds
  select coalesce(duration_seconds, time_taken * 60) into v_latest_seconds
  from public.revision_attempts
  where user_id = p_user_id and problem_id = p_problem_id and (duration_seconds is not null or time_taken is not null)
  order by created_at desc limit 1;

  -- Get best (minimum) time in seconds and average seconds
  select 
    min(coalesce(duration_seconds, time_taken * 60)),
    avg(coalesce(duration_seconds, time_taken * 60))
  into v_best_seconds, v_avg_seconds
  from public.revision_attempts
  where user_id = p_user_id and problem_id = p_problem_id and (duration_seconds is not null or time_taken is not null);

  -- Calculate improvement %: (initial - latest) / initial * 100
  -- Faster solve -> positive improvement; slower solve -> negative improvement
  if v_initial_seconds is not null and v_latest_seconds is not null and v_initial_seconds > 0 then
    v_improvement_pct := round(((v_initial_seconds - v_latest_seconds)::numeric / v_initial_seconds::numeric) * 100, 1);
  else
    v_improvement_pct := 0;
  end if;

  v_stats := jsonb_build_object(
    'best_time', round(coalesce(v_best_seconds, 0) / 60.0),
    'best_time_seconds', coalesce(v_best_seconds, 0),
    'average_time', round((coalesce(v_avg_seconds, 0) / 60.0)::numeric, 1),
    'average_time_seconds', round(coalesce(v_avg_seconds, 0)),
    'latest_time', round(coalesce(v_latest_seconds, 0) / 60.0),
    'latest_time_seconds', coalesce(v_latest_seconds, 0),
    'initial_time', round(coalesce(v_initial_seconds, 0) / 60.0),
    'initial_time_seconds', coalesce(v_initial_seconds, 0),
    'improvement_pct', coalesce(v_improvement_pct, 0),
    'total_attempts', coalesce(v_total_attempts, 0)
  );

  return v_stats;
end;
$$;

-- 3. Atomic RPC to record a solve attempt with spaced repetition update
create or replace function public.record_solve_attempt(
  p_user_id uuid,
  p_problem_id uuid,
  p_duration_seconds integer,
  p_confidence integer,
  p_result text,
  p_notes text default null,
  p_started_at timestamptz default null,
  p_completed_at timestamptz default null
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_time_taken_mins integer;
  v_attempt_number integer;
  v_attempt_type text;
  v_solved_problem_id uuid;
  v_attempt_id uuid;
  v_current_sched_id uuid;
  v_current_rev_number integer;
  v_current_ease numeric;
  v_current_interval integer;
  v_new_rev_number integer;
  v_new_ease numeric;
  v_new_interval integer;
  v_next_date date;
  v_stats jsonb;
begin
  -- Validate caller isolation
  if auth.uid() is not null and auth.uid() <> p_user_id then
    raise exception 'Unauthorized: user_id does not match authenticated user';
  end if;

  v_time_taken_mins := greatest(1, round(p_duration_seconds / 60.0));

  -- Get solved_problem row
  select id into v_solved_problem_id
  from public.solved_problems
  where user_id = p_user_id and problem_id = p_problem_id and deleted_at is null;

  -- Determine next attempt number and attempt type
  select coalesce(max(attempt_number), count(*)) + 1 into v_attempt_number
  from public.revision_attempts
  where user_id = p_user_id and problem_id = p_problem_id;

  if v_attempt_number = 1 then
    v_attempt_type := 'initial_solve';
  else
    v_attempt_type := 'manual_revision';
  end if;

  -- 1. Insert into revision_attempts
  insert into public.revision_attempts (
    problem_id,
    user_id,
    attempt_type,
    attempt_number,
    time_taken,
    duration_seconds,
    confidence,
    notes,
    result,
    started_at,
    completed_at,
    created_at
  )
  values (
    p_problem_id,
    p_user_id,
    v_attempt_type,
    v_attempt_number,
    v_time_taken_mins,
    p_duration_seconds,
    p_confidence,
    p_notes,
    p_result,
    coalesce(p_started_at, now() - (p_duration_seconds || ' seconds')::interval),
    coalesce(p_completed_at, now()),
    now()
  )
  returning id into v_attempt_id;

  -- 2. If solved_problems doesn't exist yet, insert it; otherwise update it
  if v_solved_problem_id is null then
    insert into public.solved_problems (
      user_id,
      problem_id,
      solve_time_minutes,
      confidence,
      notes,
      status,
      first_solved_at,
      last_revised_at
    )
    values (
      p_user_id,
      p_problem_id,
      v_time_taken_mins,
      p_confidence,
      p_notes,
      case when p_result = 'easy' and p_confidence >= 4 then 'mastered' else 'revising' end,
      now(),
      now()
    )
    returning id into v_solved_problem_id;
  else
    update public.solved_problems
    set
      confidence = p_confidence,
      last_revised_at = now(),
      notes = coalesce(p_notes, notes),
      status = case when p_result = 'easy' and p_confidence >= 4 then 'mastered' else 'revising' end
    where id = v_solved_problem_id;
  end if;

  -- 3. Spaced Repetition Reschedule
  select id, revision_number, ease_factor, interval_days
  into v_current_sched_id, v_current_rev_number, v_current_ease, v_current_interval
  from public.revision_schedule
  where user_id = p_user_id and solved_problem_id = v_solved_problem_id and is_completed = false
  order by next_revision_date asc limit 1;

  v_current_ease := coalesce(v_current_ease, 2.5);
  v_current_interval := coalesce(v_current_interval, 1);
  v_current_rev_number := coalesce(v_current_rev_number, 0);

  if p_result = 'failed' then
    v_new_interval := 1;
    v_new_rev_number := 0;
    v_new_ease := greatest(1.3, v_current_ease - 0.2);
  elsif p_result = 'hint' then
    v_new_rev_number := greatest(0, v_current_rev_number - 1);
    v_new_interval := case 
      when v_new_rev_number = 0 then 1
      when v_new_rev_number = 1 then 3
      when v_new_rev_number = 2 then 7
      when v_new_rev_number = 3 then 14
      when v_new_rev_number = 4 then 30
      when v_new_rev_number = 5 then 60
      when v_new_rev_number = 6 then 90
      else 180
    end;
    v_new_ease := greatest(1.3, v_current_ease - 0.15);
  else
    -- Easy / Mastered
    v_new_rev_number := v_current_rev_number + 1;
    v_new_interval := case 
      when v_new_rev_number = 1 then 3
      when v_new_rev_number = 2 then 7
      when v_new_rev_number = 3 then 14
      when v_new_rev_number = 4 then 30
      when v_new_rev_number = 5 then 60
      when v_new_rev_number = 6 then 90
      else 180
    end;
    v_new_ease := v_current_ease + (0.1 - (5 - p_confidence) * (0.08 + (5 - p_confidence) * 0.02));
    v_new_ease := greatest(1.3, v_new_ease);
  end if;

  v_next_date := current_date + v_new_interval;

  -- Complete prior schedule
  if v_current_sched_id is not null then
    update public.revision_schedule
    set is_completed = true, updated_at = now()
    where id = v_current_sched_id;
  end if;

  -- Insert new scheduled revision
  insert into public.revision_schedule (
    user_id,
    solved_problem_id,
    revision_number,
    next_revision_date,
    interval_days,
    ease_factor,
    is_completed,
    created_at,
    updated_at
  )
  values (
    p_user_id,
    v_solved_problem_id,
    v_new_rev_number,
    v_next_date,
    v_new_interval,
    round(v_new_ease, 2),
    false,
    now(),
    now()
  );

  -- 4. Recompute problem stats
  v_stats := public.get_problem_stats(p_user_id, p_problem_id);

  return jsonb_build_object(
    'success', true,
    'attempt_id', v_attempt_id,
    'attempt_number', v_attempt_number,
    'solved_problem_id', v_solved_problem_id,
    'next_revision_date', v_next_date,
    'stats', v_stats
  );
end;
$$;
