-- 1. Create user_pattern_stats
create table if not exists public.user_pattern_stats (
  user_id uuid references auth.users(id) on delete cascade,
  pattern text not null,
  solved_count integer default 0,
  total_confidence integer default 0,
  mastery_score integer default 0,
  primary key(user_id, pattern)
);

alter table public.user_pattern_stats enable row level security;
create policy "Users can view their own pattern stats"
  on public.user_pattern_stats for select
  using (auth.uid() = user_id);

-- Trigger to handle user_pattern_stats
create or replace function public.handle_pattern_analytics()
returns trigger
language plpgsql
security definer
as $$
declare
  v_pattern text;
  v_conf integer;
begin
  if TG_OP = 'INSERT' then
    v_pattern := NEW.user_pattern;
    if v_pattern is null then
      select pt.tag into v_pattern from public.problem_tags pt join public.roadmap_topics rt on pt.tag ilike rt.name where pt.problem_id = NEW.problem_id limit 1;
    end if;

    if v_pattern is not null then
      v_conf := coalesce(NEW.confidence, 3);
      insert into public.user_pattern_stats (user_id, pattern, solved_count, total_confidence, mastery_score)
      values (NEW.user_id, v_pattern, 1, v_conf, round((v_conf::numeric / 5.0) * 100))
      on conflict (user_id, pattern) do update
      set solved_count = user_pattern_stats.solved_count + 1,
          total_confidence = user_pattern_stats.total_confidence + v_conf,
          mastery_score = round(((user_pattern_stats.total_confidence + v_conf)::numeric / ((user_pattern_stats.solved_count + 1) * 5.0)) * 100);
    end if;
  end if;

  if TG_OP = 'UPDATE' and NEW.user_pattern is distinct from OLD.user_pattern then
    -- Handle pattern change (rare but possible)
    -- Remove from old
    if OLD.user_pattern is not null then
      update public.user_pattern_stats
      set solved_count = greatest(0, solved_count - 1),
          total_confidence = greatest(0, total_confidence - coalesce(OLD.confidence, 3)),
          mastery_score = case when solved_count - 1 > 0 then round(((total_confidence - coalesce(OLD.confidence, 3))::numeric / ((solved_count - 1) * 5.0)) * 100) else 0 end
      where user_id = OLD.user_id and pattern ilike OLD.user_pattern;
    end if;
    -- Add to new
    v_pattern := NEW.user_pattern;
    if v_pattern is not null then
      v_conf := coalesce(NEW.confidence, 3);
      insert into public.user_pattern_stats (user_id, pattern, solved_count, total_confidence, mastery_score)
      values (NEW.user_id, v_pattern, 1, v_conf, round((v_conf::numeric / 5.0) * 100))
      on conflict (user_id, pattern) do update
      set solved_count = user_pattern_stats.solved_count + 1,
          total_confidence = user_pattern_stats.total_confidence + v_conf,
          mastery_score = round(((user_pattern_stats.total_confidence + v_conf)::numeric / ((user_pattern_stats.solved_count + 1) * 5.0)) * 100);
    end if;
  end if;

  if TG_OP = 'DELETE' then
    v_pattern := OLD.user_pattern;
    if v_pattern is null then
      select pt.tag into v_pattern from public.problem_tags pt join public.roadmap_topics rt on pt.tag ilike rt.name where pt.problem_id = OLD.problem_id limit 1;
    end if;
    if v_pattern is not null then
      v_conf := coalesce(OLD.confidence, 3);
      update public.user_pattern_stats
      set solved_count = greatest(0, solved_count - 1),
          total_confidence = greatest(0, total_confidence - v_conf),
          mastery_score = case when solved_count - 1 > 0 then round(((total_confidence - v_conf)::numeric / ((solved_count - 1) * 5.0)) * 100) else 0 end
      where user_id = OLD.user_id and pattern ilike v_pattern;
    end if;
    return OLD;
  end if;

  return NEW;
end;
$$;

drop trigger if exists on_solved_problem_pattern on public.solved_problems;
create trigger on_solved_problem_pattern
after insert or update or delete on public.solved_problems
for each row execute procedure public.handle_pattern_analytics();


-- 2. Create roadmap_phases
create table if not exists public.roadmap_phases (
  id integer primary key generated always as identity,
  title text not null,
  display_order integer not null,
  required_previous_phase integer references public.roadmap_phases(id)
);

alter table public.roadmap_phases enable row level security;
create policy "Roadmap phases are viewable by all"
  on public.roadmap_phases for select to authenticated, anon using (true);

-- Insert phases 1 through 8
insert into public.roadmap_phases (title, display_order) values
('Core Data Structures', 1),
('Two-Pointer Patterns', 2),
('Trees & Graphs', 3),
('Dynamic Programming', 4),
('Advanced Algorithms', 5),
('Math & Bit Manipulation', 6),
('System Design Prep', 7),
('Interview Ready', 8)
on conflict do nothing;

-- 3. Update roadmap_topics to link to phases
alter table public.roadmap_topics
add column if not exists phase_id integer references public.roadmap_phases(id);

-- Auto-map based on display order (approx 4 per phase)
update public.roadmap_topics
set phase_id = ceil(display_order::float / 4.0)::integer
where phase_id is null;

-- 4. Create user_roadmap_phases
create table if not exists public.user_roadmap_phases (
  user_id uuid references auth.users(id) on delete cascade,
  phase_id integer references public.roadmap_phases(id) on delete cascade,
  is_unlocked boolean default false,
  unlocked_at timestamptz,
  is_completed boolean default false,
  completed_at timestamptz,
  primary key(user_id, phase_id)
);

alter table public.user_roadmap_phases enable row level security;
create policy "Users can view their own roadmap phases"
  on public.user_roadmap_phases for select
  using (auth.uid() = user_id);

-- 5. Trigger for unlocking phases based on topic completion
create or replace function public.handle_roadmap_phase_progress()
returns trigger
language plpgsql
security definer
as $$
declare
  v_phase_id integer;
begin
  if TG_OP = 'INSERT' or TG_OP = 'UPDATE' then
    -- Find which phase this topic belongs to
    select phase_id into v_phase_id from public.roadmap_topics where id = NEW.topic_id;
    
    if v_phase_id is not null then
      -- If solved_count > 0, phase is unlocked
      if NEW.solved_count > 0 then
        insert into public.user_roadmap_phases (user_id, phase_id, is_unlocked, unlocked_at)
        values (NEW.user_id, v_phase_id, true, now())
        on conflict (user_id, phase_id) do update
        set is_unlocked = true,
            unlocked_at = coalesce(user_roadmap_phases.unlocked_at, now())
        where user_roadmap_phases.is_unlocked = false;
      end if;

      -- We don't automatically complete phases here unless we check all topics in the phase.
      -- To keep it performant, we can evaluate phase completion in sync_user_data or a daily job.
    end if;
  end if;

  return NEW;
end;
$$;

drop trigger if exists on_user_roadmap_progress_change on public.user_roadmap_progress;
create trigger on_user_roadmap_progress_change
after insert or update on public.user_roadmap_progress
for each row execute procedure public.handle_roadmap_phase_progress();

-- Auto-unlock Phase 1 for all users
insert into public.user_roadmap_phases (user_id, phase_id, is_unlocked, unlocked_at)
select u.id, 1, true, now()
from auth.users u
on conflict do nothing;
