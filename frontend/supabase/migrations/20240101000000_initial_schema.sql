-- ============================================================
-- Revoraa Production Schema v1.0
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- REFERENCE TABLES (public, read-only for auth users)
-- ============================================================

-- Coding Platforms (LeetCode, Codeforces, etc.)
create table if not exists public.coding_platforms (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  slug        text not null unique,
  website     text,
  created_at  timestamptz default now()
);

insert into public.coding_platforms (name, slug, website) values
  ('LeetCode',   'leetcode',   'https://leetcode.com'),
  ('Codeforces', 'codeforces', 'https://codeforces.com')
on conflict (slug) do nothing;

-- Master Problems Table (shared cache, never duplicated)
create table if not exists public.problems (
  id                    uuid primary key default uuid_generate_v4(),
  platform_id           uuid references public.coding_platforms(id) on delete restrict,
  external_problem_id   text,       -- e.g. "1" for Two Sum on LeetCode
  title                 text not null,
  slug                  text not null,
  difficulty            text check (difficulty in ('Easy', 'Medium', 'Hard')),
  acceptance_rate       numeric,
  likes                 integer default 0,
  dislikes              integer default 0,
  is_paid               boolean default false,
  url                   text,
  created_at            timestamptz default now(),
  unique(platform_id, slug)
);

-- Problem Tags (many-to-many)
create table if not exists public.problem_tags (
  id          uuid primary key default uuid_generate_v4(),
  problem_id  uuid references public.problems(id) on delete cascade,
  tag         text not null
);

-- Companies
create table if not exists public.companies (
  id    uuid primary key default uuid_generate_v4(),
  name  text not null unique
);

-- Problem <-> Company mapping
create table if not exists public.problem_companies (
  id          uuid primary key default uuid_generate_v4(),
  problem_id  uuid references public.problems(id) on delete cascade,
  company_id  uuid references public.companies(id) on delete cascade,
  frequency   integer default 1,
  unique(problem_id, company_id)
);

-- Achievements definition (global, admin-managed)
create table if not exists public.achievements (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  description text,
  badge_icon  text,
  xp_reward   integer default 0,
  category    text,  -- 'streak', 'problems', 'revision', 'mastery'
  threshold   integer,  -- e.g. solve 100 problems
  created_at  timestamptz default now()
);

-- Shop Items (global, admin-managed)
create table if not exists public.shop_items (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text,
  type        text,   -- 'badge', 'theme', 'frame', 'decoration'
  image_url   text,
  coin_cost   integer not null default 0,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- ============================================================
-- USER-OWNED TABLES (RLS enforced)
-- ============================================================

-- Profiles (one per auth user)
create table if not exists public.profiles (
  id                uuid primary key default uuid_generate_v4(),
  auth_id           uuid references auth.users(id) on delete cascade unique,
  username          text unique,
  full_name         text,
  avatar_url        text,
  bio               text,
  timezone          text default 'UTC',
  experience_level  text default 'beginner', -- 'beginner', 'intermediate', 'advanced'
  target_company    text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- User Stats (aggregated metrics)
create table if not exists public.user_stats (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid references auth.users(id) on delete cascade unique,
  xp                    integer default 0,
  level                 integer default 1,
  coins                 integer default 0,
  total_solved          integer default 0,
  total_revised         integer default 0,
  current_streak        integer default 0,
  longest_streak        integer default 0,
  last_activity_date    date,
  readiness_score       numeric default 0,
  updated_at            timestamptz default now()
);

-- User Settings
create table if not exists public.user_settings (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid references auth.users(id) on delete cascade unique,
  theme                   text default 'dark',
  reminder_enabled        boolean default true,
  reminder_time           time default '09:00:00',
  timezone                text default 'UTC',
  revision_algorithm      text default 'sm2',
  email_notifications     boolean default true,
  push_notifications      boolean default false,
  fcm_token               text,
  weekly_report           boolean default true,
  streak_warnings         boolean default true,
  calendar_connected      boolean default false,
  calendar_token          text,
  updated_at              timestamptz default now()
);

-- Solved Problems (core user progress table)
create table if not exists public.solved_problems (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid references auth.users(id) on delete cascade,
  problem_id          uuid references public.problems(id) on delete restrict,
  solve_time_minutes  integer,
  solved_using        text check (solved_using in ('myself', 'hint', 'editorial')),
  confidence          integer check (confidence between 1 and 5),
  status              text default 'solving' check (status in ('solving', 'revising', 'mastered')),
  notes               text,
  mistakes            text,
  first_solved_at     timestamptz default now(),
  last_revised_at     timestamptz,
  deleted_at          timestamptz,  -- soft delete
  created_at          timestamptz default now(),
  unique(user_id, problem_id)
);

-- Revision Schedule (spaced repetition state machine)
create table if not exists public.revision_schedule (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid references auth.users(id) on delete cascade,
  solved_problem_id   uuid references public.solved_problems(id) on delete cascade,
  revision_number     integer default 1,
  next_revision_date  date not null,
  interval_days       integer default 1,
  ease_factor         numeric default 2.5,  -- SM-2 ease factor
  is_completed        boolean default false,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- Revision History (every attempt logged)
create table if not exists public.revision_history (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid references auth.users(id) on delete cascade,
  solved_problem_id   uuid references public.solved_problems(id) on delete cascade,
  revision_number     integer,
  revision_date       date default current_date,
  result              text check (result in ('easy', 'hint', 'failed')),
  solve_time          integer,  -- minutes
  confidence          integer check (confidence between 1 and 5),
  created_at          timestamptz default now()
);

-- Mistakes
create table if not exists public.mistakes (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid references auth.users(id) on delete cascade,
  solved_problem_id   uuid references public.solved_problems(id) on delete cascade,
  category            text,
  description         text,
  created_at          timestamptz default now()
);

-- Daily Analytics snapshot
create table if not exists public.analytics_daily (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade,
  date        date default current_date,
  solved      integer default 0,
  revised     integer default 0,
  accuracy    numeric default 0,
  avg_time    numeric default 0,
  xp_earned   integer default 0,
  confidence  numeric default 0,
  unique(user_id, date)
);

-- Study Sessions
create table if not exists public.study_sessions (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade,
  date            date default current_date,
  solved_count    integer default 0,
  revised_count   integer default 0,
  total_minutes   integer default 0,
  created_at      timestamptz default now()
);

-- Notifications
create table if not exists public.notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade,
  title       text not null,
  body        text,
  type        text check (type in ('revision_due', 'achievement', 'streak_warning', 'weekly_report', 'xp_levelup', 'system')),
  is_read     boolean default false,
  metadata    jsonb,  -- extra data (e.g. problem_id, achievement_id)
  deleted_at  timestamptz,
  created_at  timestamptz default now()
);

-- Interview Readiness per company
create table if not exists public.interview_readiness (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade,
  company         text not null,
  readiness_score numeric default 0,
  updated_at      timestamptz default now(),
  unique(user_id, company)
);

-- Roadmaps (personalized study plans)
create table if not exists public.roadmaps (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade,
  topic           text not null,
  priority        integer default 1,
  estimated_days  integer,
  completed       boolean default false,
  created_at      timestamptz default now()
);

-- User Achievements (unlocked achievements)
create table if not exists public.user_achievements (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade,
  achievement_id  uuid references public.achievements(id) on delete cascade,
  unlocked_at     timestamptz default now(),
  unique(user_id, achievement_id)
);

-- User Inventory (shop purchases)
create table if not exists public.user_inventory (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete cascade,
  shop_item_id  uuid references public.shop_items(id) on delete cascade,
  purchased_at  timestamptz default now(),
  is_equipped   boolean default false,
  unique(user_id, shop_item_id)
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_problems_slug         on public.problems(slug);
create index if not exists idx_problems_platform     on public.problems(platform_id);
create index if not exists idx_problem_tags_problem  on public.problem_tags(problem_id);
create index if not exists idx_problem_tags_tag      on public.problem_tags(tag);

create index if not exists idx_solved_user            on public.solved_problems(user_id);
create index if not exists idx_solved_problem         on public.solved_problems(problem_id);
create index if not exists idx_solved_status          on public.solved_problems(status);

create index if not exists idx_revision_user          on public.revision_schedule(user_id);
create index if not exists idx_revision_date          on public.revision_schedule(next_revision_date);
create index if not exists idx_revision_completed     on public.revision_schedule(is_completed);

create index if not exists idx_notif_user             on public.notifications(user_id);
create index if not exists idx_notif_read             on public.notifications(is_read);
create index if not exists idx_analytics_user_date    on public.analytics_daily(user_id, date);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all user tables
alter table public.profiles             enable row level security;
alter table public.user_stats           enable row level security;
alter table public.user_settings        enable row level security;
alter table public.solved_problems      enable row level security;
alter table public.revision_schedule    enable row level security;
alter table public.revision_history     enable row level security;
alter table public.mistakes             enable row level security;
alter table public.analytics_daily      enable row level security;
alter table public.study_sessions       enable row level security;
alter table public.notifications        enable row level security;
alter table public.interview_readiness  enable row level security;
alter table public.roadmaps             enable row level security;
alter table public.user_achievements    enable row level security;
alter table public.user_inventory       enable row level security;

-- Profiles: users own their row
create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = auth_id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = auth_id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = auth_id);

-- User Stats
create policy "Users own stats"   on public.user_stats for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- User Settings
create policy "Users own settings" on public.user_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Solved Problems
create policy "Users own solved_problems" on public.solved_problems for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Revision Schedule
create policy "Users own revision_schedule" on public.revision_schedule for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Revision History
create policy "Users own revision_history" on public.revision_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Mistakes
create policy "Users own mistakes" on public.mistakes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Analytics
create policy "Users own analytics" on public.analytics_daily for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Study Sessions
create policy "Users own study_sessions" on public.study_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Notifications
create policy "Users own notifications" on public.notifications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Interview Readiness
create policy "Users own readiness" on public.interview_readiness for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Roadmaps
create policy "Users own roadmaps" on public.roadmaps for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- User Achievements
create policy "Users own achievements" on public.user_achievements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- User Inventory
create policy "Users own inventory" on public.user_inventory for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Reference tables: read-only for authenticated users
alter table public.problems          enable row level security;
alter table public.problem_tags      enable row level security;
alter table public.companies         enable row level security;
alter table public.problem_companies enable row level security;
alter table public.coding_platforms  enable row level security;
alter table public.achievements      enable row level security;
alter table public.shop_items        enable row level security;

create policy "Authenticated read problems"          on public.problems          for select to authenticated using (true);
create policy "Authenticated read problem_tags"      on public.problem_tags      for select to authenticated using (true);
create policy "Authenticated read companies"         on public.companies         for select to authenticated using (true);
create policy "Authenticated read problem_companies" on public.problem_companies for select to authenticated using (true);
create policy "Authenticated read coding_platforms"  on public.coding_platforms  for select to authenticated using (true);
create policy "Authenticated read achievements"      on public.achievements      for select to authenticated using (true);
create policy "Authenticated read shop_items"        on public.shop_items        for select to authenticated using (true);

-- Allow service_role to insert into reference tables (for edge functions)
create policy "Service role can insert problems" on public.problems for insert to service_role with check (true);
create policy "Service role can insert tags"     on public.problem_tags for insert to service_role with check (true);
create policy "Service role can insert companies" on public.companies for insert to service_role with check (true);
create policy "Service role can link companies"  on public.problem_companies for insert to service_role with check (true);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create profile, stats, and settings on new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Create profile
  insert into public.profiles (auth_id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  )
  on conflict (auth_id) do nothing;

  -- Create stats
  insert into public.user_stats (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  -- Create settings
  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at timestamps
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at     before update on public.profiles     for each row execute procedure public.handle_updated_at();
create trigger user_stats_updated_at   before update on public.user_stats   for each row execute procedure public.handle_updated_at();
create trigger user_settings_updated_at before update on public.user_settings for each row execute procedure public.handle_updated_at();
create trigger revision_schedule_updated_at before update on public.revision_schedule for each row execute procedure public.handle_updated_at();

-- ============================================================
-- SEED ACHIEVEMENTS
-- ============================================================

insert into public.achievements (title, description, badge_icon, xp_reward, category, threshold) values
  ('First Blood',      'Solve your first problem',                   '🩸', 50,   'problems', 1),
  ('Getting Started',  'Solve 10 problems',                          '🚀', 100,  'problems', 10),
  ('Century',          'Solve 100 problems',                         '💯', 500,  'problems', 100),
  ('Marathon',         'Solve 500 problems',                         '🏃', 2000, 'problems', 500),
  ('On Fire',          'Maintain a 7-day streak',                    '🔥', 200,  'streak',   7),
  ('Habit Formed',     'Maintain a 30-day streak',                   '⚡', 1000, 'streak',   30),
  ('Revision Rookie',  'Complete your first revision',               '📚', 50,   'revision', 1),
  ('Retention King',   'Complete 50 revisions',                      '👑', 500,  'revision', 50),
  ('Pattern Seeker',   'Solve problems in 5 different patterns',     '🔍', 300,  'mastery',  5),
  ('Master',           'Achieve mastery status on 10 problems',      '🎓', 1000, 'mastery',  10)
on conflict do nothing;

-- ============================================================
-- SEED SHOP ITEMS
-- ============================================================

insert into public.shop_items (name, description, type, coin_cost) values
  ('Gold Frame',        'A golden profile frame',     'frame',       500),
  ('Dark Theme',        'Premium dark mode theme',    'theme',       300),
  ('Hacker Badge',      'Elite coder badge',          'badge',       200),
  ('Diamond Avatar',    'Sparkling diamond frame',    'frame',       1000),
  ('Amber Theme',       'Warm amber accent theme',    'theme',       400)
on conflict do nothing;
