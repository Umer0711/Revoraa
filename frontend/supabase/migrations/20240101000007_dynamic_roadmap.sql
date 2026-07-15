-- 1. Create roadmap_topics table
create table if not exists public.roadmap_topics (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  display_order integer not null,
  icon text,
  color text,
  target_problem_count integer not null default 10,
  created_at timestamptz default now()
);

-- 2. Create user_roadmap_progress table
create table if not exists public.user_roadmap_progress (
  user_id uuid references auth.users(id) on delete cascade,
  topic_id uuid references public.roadmap_topics(id) on delete cascade,
  solved_count integer default 0,
  is_completed boolean default false,
  completed_at timestamptz,
  primary key(user_id, topic_id)
);

-- RLS for user_roadmap_progress
alter table public.user_roadmap_progress enable row level security;

create policy "Users can view their own roadmap progress"
  on public.user_roadmap_progress for select
  using (auth.uid() = user_id);

create policy "Users can update their own roadmap progress"
  on public.user_roadmap_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can insert their own roadmap progress"
  on public.user_roadmap_progress for insert
  with check (auth.uid() = user_id);

-- RLS for roadmap_topics (readable by all)
alter table public.roadmap_topics enable row level security;
create policy "Roadmap topics are viewable by all"
  on public.roadmap_topics for select
  to authenticated, anon
  using (true);

-- 3. Add onboarding and primary_pattern columns
alter table public.profiles
  add column if not exists has_completed_onboarding boolean default false;

-- Auto-complete onboarding for existing users so we don't lock them out
update public.profiles set has_completed_onboarding = true where has_completed_onboarding = false;

alter table public.solved_problems
  add column if not exists user_pattern text;

-- 4. Seed roadmap topics
insert into public.roadmap_topics (name, slug, display_order, icon, color, target_problem_count) values
('Arrays', 'arrays', 1, '[]', '#3b82f6', 20),
('Strings', 'strings', 2, '""', '#8b5cf6', 15),
('Hashing', 'hashing', 3, '#', '#10b981', 15),
('Two Pointers', 'two-pointers', 4, '↔', '#f59e0b', 15),
('Sliding Window', 'sliding-window', 5, '⬜', '#ec4899', 10),
('Prefix Sum', 'prefix-sum', 6, '∑', '#6366f1', 10),
('Binary Search', 'binary-search', 7, '🔍', '#14b8a6', 15),
('Linked List', 'linked-list', 8, '🔗', '#8b5cf6', 15),
('Stack', 'stack', 9, '📚', '#f43f5e', 10),
('Queue', 'queue', 10, '🚶', '#3b82f6', 5),
('Heap', 'heap', 11, '⛰', '#d946ef', 10),
('Tree', 'tree', 12, '🌳', '#10b981', 15),
('Binary Tree', 'binary-tree', 13, '🌲', '#10b981', 15),
('BST', 'bst', 14, '🌲', '#10b981', 10),
('Trie', 'trie', 15, '🔤', '#8b5cf6', 5),
('Graph', 'graph', 16, '🕸', '#ec4899', 15),
('DFS', 'dfs', 17, '⬇', '#f43f5e', 15),
('BFS', 'bfs', 18, '➡', '#3b82f6', 15),
('Topological Sort', 'topological-sort', 19, '🔢', '#8b5cf6', 5),
('Union Find', 'union-find', 20, '🤝', '#10b981', 10),
('Backtracking', 'backtracking', 21, '↩', '#f59e0b', 15),
('Recursion', 'recursion', 22, '🔄', '#3b82f6', 10),
('Greedy', 'greedy', 23, '💰', '#10b981', 15),
('Dynamic Programming', 'dp', 24, '🧠', '#8b5cf6', 30),
('Bit Manipulation', 'bit-manipulation', 25, '01', '#64748b', 10),
('Math', 'math', 26, '➕', '#f59e0b', 10),
('Intervals', 'intervals', 27, '↔', '#ec4899', 10),
('Matrix', 'matrix', 28, '▦', '#3b82f6', 10),
('Design', 'design', 29, '🏗', '#14b8a6', 10)
on conflict (name) do nothing;

-- 5. Trigger to update user_roadmap_progress automatically
create or replace function public.handle_roadmap_progress()
returns trigger
language plpgsql
security definer
as $$
declare
  v_pattern text;
  v_topic_id uuid;
  v_target integer;
  v_current_count integer;
begin
  -- Determine the pattern
  if TG_OP = 'INSERT' or TG_OP = 'UPDATE' then
    v_pattern := NEW.user_pattern;
    
    -- If user didn't manually set a pattern, try to find one from problem_tags
    if v_pattern is null then
      select pt.tag into v_pattern
      from public.problem_tags pt
      join public.roadmap_topics rt on pt.tag ilike rt.name
      where pt.problem_id = NEW.problem_id
      limit 1;
    end if;
    
    -- If we found a pattern, map it to a topic
    if v_pattern is not null then
      select id, target_problem_count into v_topic_id, v_target
      from public.roadmap_topics
      where name ilike v_pattern
      limit 1;
      
      if v_topic_id is not null then
        -- Insert or increment
        insert into public.user_roadmap_progress (user_id, topic_id, solved_count)
        values (NEW.user_id, v_topic_id, 1)
        on conflict (user_id, topic_id) do update
        set solved_count = user_roadmap_progress.solved_count + 1;
        
        -- Check completion status
        select solved_count into v_current_count
        from public.user_roadmap_progress
        where user_id = NEW.user_id and topic_id = v_topic_id;
        
        if v_current_count >= v_target then
          update public.user_roadmap_progress
          set is_completed = true, completed_at = coalesce(completed_at, now())
          where user_id = NEW.user_id and topic_id = v_topic_id;
        end if;
      end if;
    end if;
  end if;
  
  -- Handle DELETES (decrement)
  if TG_OP = 'DELETE' then
    v_pattern := OLD.user_pattern;
    if v_pattern is null then
      select pt.tag into v_pattern
      from public.problem_tags pt
      join public.roadmap_topics rt on pt.tag ilike rt.name
      where pt.problem_id = OLD.problem_id
      limit 1;
    end if;
    
    if v_pattern is not null then
      select id into v_topic_id from public.roadmap_topics where name ilike v_pattern limit 1;
      if v_topic_id is not null then
        update public.user_roadmap_progress
        set solved_count = greatest(0, solved_count - 1)
        where user_id = OLD.user_id and topic_id = v_topic_id;
      end if;
    end if;
  end if;

  if TG_OP = 'DELETE' then
    return OLD;
  end if;
  return NEW;
end;
$$;

drop trigger if exists on_solved_problem_change on public.solved_problems;
create trigger on_solved_problem_change
after insert or delete on public.solved_problems
for each row execute procedure public.handle_roadmap_progress();

-- Also handle updates if user_pattern changes
create or replace function public.handle_roadmap_progress_update()
returns trigger
language plpgsql
security definer
as $$
declare
  v_old_pattern text;
  v_new_pattern text;
  v_old_topic_id uuid;
  v_new_topic_id uuid;
  v_target integer;
  v_current_count integer;
begin
  if NEW.user_pattern is distinct from OLD.user_pattern then
    v_old_pattern := OLD.user_pattern;
    v_new_pattern := NEW.user_pattern;
    
    if v_old_pattern is not null then
      select id into v_old_topic_id from public.roadmap_topics where name ilike v_old_pattern limit 1;
      if v_old_topic_id is not null then
        update public.user_roadmap_progress
        set solved_count = greatest(0, solved_count - 1)
        where user_id = OLD.user_id and topic_id = v_old_topic_id;
      end if;
    end if;
    
    if v_new_pattern is not null then
      select id, target_problem_count into v_new_topic_id, v_target from public.roadmap_topics where name ilike v_new_pattern limit 1;
      if v_new_topic_id is not null then
        insert into public.user_roadmap_progress (user_id, topic_id, solved_count)
        values (NEW.user_id, v_new_topic_id, 1)
        on conflict (user_id, topic_id) do update
        set solved_count = user_roadmap_progress.solved_count + 1;
        
        select solved_count into v_current_count from public.user_roadmap_progress where user_id = NEW.user_id and topic_id = v_new_topic_id;
        if v_current_count >= v_target then
          update public.user_roadmap_progress set is_completed = true, completed_at = coalesce(completed_at, now())
          where user_id = NEW.user_id and topic_id = v_new_topic_id;
        end if;
      end if;
    end if;
  end if;
  return NEW;
end;
$$;

drop trigger if exists on_solved_problem_update on public.solved_problems;
create trigger on_solved_problem_update
after update on public.solved_problems
for each row execute procedure public.handle_roadmap_progress_update();
