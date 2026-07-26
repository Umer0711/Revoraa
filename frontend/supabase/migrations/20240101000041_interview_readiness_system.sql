-- ============================================================
-- Revoraa Interview Readiness System Migration (v1.0)
-- ============================================================

-- 1. Companies Table
create table if not exists public.companies (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  slug        text not null unique,
  logo_url    text,
  industry    text default 'Technology',
  tier        text default 'Tier 1' check (tier in ('Tier 1', 'Tier 2', 'Tier 3', 'Unranked')),
  description text,
  created_at  timestamptz default now()
);

-- 2. Company Questions Mapping (junction between company and master problems)
create table if not exists public.company_questions (
  id              uuid primary key default uuid_generate_v4(),
  company_id      uuid references public.companies(id) on delete cascade,
  question_id     uuid references public.problems(id) on delete cascade,
  frequency       integer default 1,
  last_asked_year integer default 2024,
  role_type       text default 'Software Engineer',
  created_at      timestamptz default now(),
  unique(company_id, question_id)
);

-- 3. Question Patterns
create table if not exists public.question_patterns (
  id                uuid primary key default uuid_generate_v4(),
  question_id       uuid references public.problems(id) on delete cascade,
  pattern_name      text not null,
  sub_pattern_name  text,
  is_primary        boolean default true,
  created_at        timestamptz default now(),
  unique(question_id, pattern_name)
);

-- 4. Question Topics (mapped to DSA Atlas taxonomy)
create table if not exists public.question_topics (
  id          uuid primary key default uuid_generate_v4(),
  question_id uuid references public.problems(id) on delete cascade,
  topic_name  text not null,
  is_primary  boolean default true,
  created_at  timestamptz default now(),
  unique(question_id, topic_name)
);

-- 5. Question Resources (external platform links - LeetCode, GFG, HackerRank)
create table if not exists public.question_resources (
  id            uuid primary key default uuid_generate_v4(),
  question_id   uuid references public.problems(id) on delete cascade,
  platform_name text not null,
  url           text not null,
  is_official   boolean default true,
  created_at    timestamptz default now(),
  unique(question_id, platform_name)
);

-- 6. User Company Progress
create table if not exists public.user_company_progress (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid references auth.users(id) on delete cascade,
  company_id            uuid references public.companies(id) on delete cascade,
  solved_count          integer default 0,
  total_count           integer default 0,
  completion_percentage numeric default 0,
  last_activity_at      timestamptz default now(),
  created_at            timestamptz default now(),
  unique(user_id, company_id)
);

-- 7. User Question Progress (specific to interview readiness tracking)
create table if not exists public.user_question_progress (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid references auth.users(id) on delete cascade,
  question_id        uuid references public.problems(id) on delete cascade,
  solved_problem_id  uuid references public.solved_problems(id) on delete set null,
  status             text default 'unsolved' check (status in ('unsolved', 'solved', 'revising', 'mastered')),
  completed_at       timestamptz,
  time_taken_minutes integer,
  confidence         integer check (confidence between 1 and 5),
  notes              text,
  is_bookmarked      boolean default false,
  needs_revision     boolean default false,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now(),
  unique(user_id, question_id)
);

-- 8. Company Statistics (materialized aggregated metrics)
create table if not exists public.company_statistics (
  company_id      uuid primary key references public.companies(id) on delete cascade,
  total_questions integer default 0,
  easy_count      integer default 0,
  medium_count    integer default 0,
  hard_count      integer default 0,
  top_topics      jsonb default '[]'::jsonb,
  top_patterns    jsonb default '[]'::jsonb,
  updated_at      timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_company_questions_company on public.company_questions(company_id);
create index if not exists idx_company_questions_question on public.company_questions(question_id);
create index if not exists idx_question_patterns_question on public.question_patterns(question_id);
create index if not exists idx_question_topics_question on public.question_topics(question_id);
create index if not exists idx_user_company_progress_user on public.user_company_progress(user_id);
create index if not exists idx_user_question_progress_user on public.user_question_progress(user_id);
create index if not exists idx_user_question_progress_status on public.user_question_progress(user_id, status);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table public.companies enable row level security;
alter table public.company_questions enable row level security;
alter table public.question_patterns enable row level security;
alter table public.question_topics enable row level security;
alter table public.question_resources enable row level security;
alter table public.user_company_progress enable row level security;
alter table public.user_question_progress enable row level security;
alter table public.company_statistics enable row level security;

-- Public read access for dataset reference tables
create policy "Public companies read" on public.companies for select using (true);
create policy "Public company_questions read" on public.company_questions for select using (true);
create policy "Public question_patterns read" on public.question_patterns for select using (true);
create policy "Public question_topics read" on public.question_topics for select using (true);
create policy "Public question_resources read" on public.question_resources for select using (true);
create policy "Public company_statistics read" on public.company_statistics for select using (true);

-- Admin write policies for dataset reference tables
create policy "Admin companies write" on public.companies for all using (auth.role() = 'authenticated');
create policy "Admin company_questions write" on public.company_questions for all using (auth.role() = 'authenticated');
create policy "Admin question_patterns write" on public.question_patterns for all using (auth.role() = 'authenticated');
create policy "Admin question_topics write" on public.question_topics for all using (auth.role() = 'authenticated');
create policy "Admin question_resources write" on public.question_resources for all using (auth.role() = 'authenticated');
create policy "Admin company_statistics write" on public.company_statistics for all using (auth.role() = 'authenticated');

-- User-isolated policies for progress tables
create policy "User company progress isolated select" on public.user_company_progress for select using (auth.uid() = user_id);
create policy "User company progress isolated insert" on public.user_company_progress for insert with check (auth.uid() = user_id);
create policy "User company progress isolated update" on public.user_company_progress for update using (auth.uid() = user_id);
create policy "User company progress isolated delete" on public.user_company_progress for delete using (auth.uid() = user_id);

create policy "User question progress isolated select" on public.user_question_progress for select using (auth.uid() = user_id);
create policy "User question progress isolated insert" on public.user_question_progress for insert with check (auth.uid() = user_id);
create policy "User question progress isolated update" on public.user_question_progress for update using (auth.uid() = user_id);
create policy "User question progress isolated delete" on public.user_question_progress for delete using (auth.uid() = user_id);

-- ============================================================
-- HELPER RPC FUNCTIONS
-- ============================================================

-- Recalculate company statistics
create or replace function public.recalculate_company_statistics(p_company_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_total int;
  v_easy int;
  v_medium int;
  v_hard int;
  v_top_topics jsonb;
  v_top_patterns jsonb;
begin
  select count(*) into v_total
  from public.company_questions cq
  where cq.company_id = p_company_id;

  select
    count(case when p.difficulty = 'Easy' then 1 end),
    count(case when p.difficulty = 'Medium' then 1 end),
    count(case when p.difficulty = 'Hard' then 1 end)
  into v_easy, v_medium, v_hard
  from public.company_questions cq
  join public.problems p on p.id = cq.question_id
  where cq.company_id = p_company_id;

  select coalesce(jsonb_agg(t.top_item), '[]'::jsonb) into v_top_topics
  from (
    select jsonb_build_object('topic', qt.topic_name, 'count', count(*)) as top_item
    from public.company_questions cq
    join public.question_topics qt on qt.question_id = cq.question_id
    where cq.company_id = p_company_id
    group by qt.topic_name
    order by count(*) desc
    limit 5
  ) t;

  select coalesce(jsonb_agg(qp_sub.top_item), '[]'::jsonb) into v_top_patterns
  from (
    select jsonb_build_object('pattern', qp.pattern_name, 'count', count(*)) as top_item
    from public.company_questions cq
    join public.question_patterns qp on qp.question_id = cq.question_id
    where cq.company_id = p_company_id
    group by qp.pattern_name
    order by count(*) desc
    limit 5
  ) qp_sub;

  insert into public.company_statistics (company_id, total_questions, easy_count, medium_count, hard_count, top_topics, top_patterns, updated_at)
  values (p_company_id, v_total, v_easy, v_medium, v_hard, v_top_topics, v_top_patterns, now())
  on conflict (company_id) do update set
    total_questions = excluded.total_questions,
    easy_count = excluded.easy_count,
    medium_count = excluded.medium_count,
    hard_count = excluded.hard_count,
    top_topics = excluded.top_topics,
    top_patterns = excluded.top_patterns,
    updated_at = now();
end;
$$;
