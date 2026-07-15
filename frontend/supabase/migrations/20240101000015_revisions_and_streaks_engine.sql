-- Migration: Revisions and Streaks Engine
-- Implements realtime aggregation for solved problems and Revision Hub stats.

-- 1. Add missing columns to solved_problems
alter table public.solved_problems add column if not exists revision_count integer default 0;
alter table public.solved_problems add column if not exists average_time numeric;
alter table public.solved_problems add column if not exists best_time integer;

-- 2. Create Trigger for realtime updates on revision_attempts
create or replace function public.trg_update_solved_problem_stats()
returns trigger
language plpgsql
security definer
as $$
declare
  v_count integer;
  v_avg numeric;
  v_min integer;
begin
  -- Calculate aggregates
  select 
    count(*),
    round(avg(time_taken)::numeric, 1),
    min(time_taken)
  into v_count, v_avg, v_min
  from public.revision_attempts
  where problem_id = new.problem_id and user_id = new.user_id;

  -- Update solved_problems
  update public.solved_problems
  set 
    revision_count = coalesce(v_count, 0),
    average_time = v_avg,
    best_time = v_min,
    confidence = coalesce(new.confidence, confidence),
    last_revised_at = now()
  where problem_id = new.problem_id and user_id = new.user_id;

  return new;
end;
$$;

drop trigger if exists on_revision_attempt_insert on public.revision_attempts;
create trigger on_revision_attempt_insert
after insert or update on public.revision_attempts
for each row
execute function public.trg_update_solved_problem_stats();

-- 3. Backfill existing data for solved_problems
update public.solved_problems sp
set 
  revision_count = coalesce((select count(*) from public.revision_attempts ra where ra.problem_id = sp.problem_id and ra.user_id = sp.user_id), 0),
  average_time = (select round(avg(time_taken)::numeric, 1) from public.revision_attempts ra where ra.problem_id = sp.problem_id and ra.user_id = sp.user_id),
  best_time = (select min(time_taken) from public.revision_attempts ra where ra.problem_id = sp.problem_id and ra.user_id = sp.user_id);

-- 4. Create RPC for Revision Hub Statistics
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
