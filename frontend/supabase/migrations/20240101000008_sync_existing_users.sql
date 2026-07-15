-- Add is_synchronized to profiles
alter table public.profiles
add column if not exists is_synchronized boolean default false;

-- RPC to synchronize a user's data and build roadmap progress from existing solved problems
create or replace function public.sync_user_data(p_user_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_rec record;
  v_pattern text;
  v_topic_id uuid;
  v_target integer;
  v_current_count integer;
  v_total_solved integer := 0;
  v_total_revised integer := 0;
begin
  -- 1. Reset progress and pattern stats for this user to ensure no duplicates
  delete from public.user_roadmap_progress where user_id = p_user_id;
  delete from public.user_pattern_stats where user_id = p_user_id;
  delete from public.user_roadmap_phases where user_id = p_user_id;

  -- Ensure Phase 1 is unlocked for everyone
  insert into public.user_roadmap_phases (user_id, phase_id, is_unlocked, unlocked_at)
  values (p_user_id, 1, true, now())
  on conflict do nothing;

  -- 2. Iterate through all solved problems for this user
  for v_rec in 
    select sp.id, sp.problem_id, sp.user_pattern, sp.confidence
    from public.solved_problems sp
    where sp.user_id = p_user_id
  loop
    v_total_solved := v_total_solved + 1;
    v_pattern := v_rec.user_pattern;

    -- If pattern is null, attempt to map from problem tags
    if v_pattern is null then
      select pt.tag into v_pattern
      from public.problem_tags pt
      join public.roadmap_topics rt on pt.tag ilike rt.name
      where pt.problem_id = v_rec.problem_id
      limit 1;
      
      -- Update the solved_problems record so we have a cached pattern
      if v_pattern is not null then
        update public.solved_problems
        set user_pattern = v_pattern
        where id = v_rec.id;
      end if;
    end if;

    -- If we have a pattern, increment roadmap progress
    if v_pattern is not null then
      select id, target_problem_count into v_topic_id, v_target
      from public.roadmap_topics
      where name ilike v_pattern
      limit 1;

      if v_topic_id is not null then
        insert into public.user_roadmap_progress (user_id, topic_id, solved_count)
        values (p_user_id, v_topic_id, 1)
        on conflict (user_id, topic_id) do update
        set solved_count = user_roadmap_progress.solved_count + 1;
      end if;

      -- Populate user_pattern_stats
      insert into public.user_pattern_stats (user_id, pattern, solved_count, total_confidence, mastery_score)
      values (p_user_id, v_pattern, 1, coalesce(v_rec.confidence, 3), round((coalesce(v_rec.confidence, 3)::numeric / 5.0) * 100))
      on conflict (user_id, pattern) do update
      set solved_count = user_pattern_stats.solved_count + 1,
          total_confidence = user_pattern_stats.total_confidence + coalesce(v_rec.confidence, 3),
          mastery_score = round(((user_pattern_stats.total_confidence + coalesce(v_rec.confidence, 3))::numeric / ((user_pattern_stats.solved_count + 1) * 5.0)) * 100);

    end if;
  end loop;

  -- 3. Check for completions in roadmap progress
  update public.user_roadmap_progress urp
  set is_completed = true,
      completed_at = coalesce(completed_at, now())
  from public.roadmap_topics rt
  where urp.topic_id = rt.id
    and urp.user_id = p_user_id
    and urp.solved_count >= rt.target_problem_count;

  -- 4. Calculate total revisions from revision_history
  select count(*) into v_total_revised
  from public.revision_history
  where user_id = p_user_id;

  -- 5. Update user_stats with the recalculated totals
  update public.user_stats
  set total_solved = v_total_solved,
      total_revised = v_total_revised
  where user_id = p_user_id;

  -- 6. Mark user as synchronized
  update public.profiles
  set is_synchronized = true
  where auth_id = p_user_id;

end;
$$;
