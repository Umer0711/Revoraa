-- Migration: Production Features (Revision Attempts, Email Logs, Issues, Analytics Views)

-- 1. Create revision_attempts table
create table if not exists public.revision_attempts (
  id uuid primary key default uuid_generate_v4(),
  problem_id uuid references public.problems(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  attempt_type text not null check (attempt_type in ('initial_solve', 'scheduled_revision', 'manual_revision')),
  time_taken integer, -- in minutes
  confidence integer check (confidence between 1 and 5),
  notes text,
  result text check (result in ('easy', 'hint', 'failed', 'mastered')),
  created_at timestamptz default now()
);

-- Index for fast lookups
create index if not exists idx_revision_attempts_user_problem on public.revision_attempts(user_id, problem_id);

-- RLS
alter table public.revision_attempts enable row level security;
drop policy if exists "Users can view their own revision attempts" on public.revision_attempts;
create policy "Users can view their own revision attempts" on public.revision_attempts for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own revision attempts" on public.revision_attempts;
create policy "Users can insert their own revision attempts" on public.revision_attempts for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own revision attempts" on public.revision_attempts;
create policy "Users can update their own revision attempts" on public.revision_attempts for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own revision attempts" on public.revision_attempts;
create policy "Users can delete their own revision attempts" on public.revision_attempts for delete using (auth.uid() = user_id);

-- Migrate existing data from solved_problems to revision_attempts for 'initial_solve'
insert into public.revision_attempts (problem_id, user_id, attempt_type, time_taken, confidence, notes, result, created_at)
select problem_id, user_id, 'initial_solve', solve_time_minutes, confidence, notes, 'easy', first_solved_at
from public.solved_problems
where not exists (
    select 1 from public.revision_attempts ra where ra.user_id = public.solved_problems.user_id and ra.problem_id = public.solved_problems.problem_id and ra.attempt_type = 'initial_solve'
);

-- Migrate existing data from revision_history to revision_attempts for 'scheduled_revision'
insert into public.revision_attempts (problem_id, user_id, attempt_type, time_taken, confidence, result, created_at)
select 
  sp.problem_id, 
  rh.user_id, 
  'scheduled_revision', 
  rh.solve_time, 
  rh.confidence, 
  rh.result, 
  rh.created_at
from public.revision_history rh
join public.solved_problems sp on rh.solved_problem_id = sp.id;


-- 2. Create email_logs table
create table if not exists public.email_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  email_type text not null check (email_type in ('daily_reminder', 'streak_warning', 'achievement_unlock', 'weekly_report', 'welcome_email')),
  subject text,
  status text not null check (status in ('pending', 'sent', 'failed')),
  error_message text,
  created_at timestamptz default now()
);

-- RLS
alter table public.email_logs enable row level security;
drop policy if exists "Users can view their own email logs" on public.email_logs;
create policy "Users can view their own email logs" on public.email_logs for select using (auth.uid() = user_id);

drop policy if exists "Service can manage email logs" on public.email_logs;
create policy "Service can manage email logs" on public.email_logs using (true); -- Usually restricted to service role, simplified here


-- 3. Extend Coding Platforms
insert into public.coding_platforms (name, slug, website) values
  ('Custom', 'custom', null)
on conflict (slug) do nothing;


-- 4. Extend Mistakes (Issues) to support true CRUD + status
alter table public.mistakes add column if not exists is_cleared boolean default false;
alter table public.mistakes add column if not exists cleared_at timestamptz;


-- 5. Create RPCs for Analytics

-- 5a. get_problem_stats
-- Computes Best Time, Average Time, Improvement %, Fastest Solve, Latest Solve for a specific problem
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


-- 5b. get_advanced_analytics
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
