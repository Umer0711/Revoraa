-- ============================================================
-- Supplementary Tables: Analytics, Revision History, Notifications
-- ============================================================

-- Daily analytics per user
create table if not exists public.analytics_daily (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade,
  date        date not null,
  solved      integer default 0,
  revised     integer default 0,
  accuracy    numeric default 0,    -- % of revisions answered correctly
  avg_time    numeric default 0,    -- average solve time in minutes
  xp_earned   integer default 0,
  confidence  numeric default 0,    -- avg self-rated confidence for the day
  created_at  timestamptz default now(),
  unique(user_id, date)
);

alter table public.analytics_daily enable row level security;

create policy "Users own their analytics"
  on public.analytics_daily for all
  using (auth.uid() = user_id);

-- Revision history log
create table if not exists public.revision_history (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid references auth.users(id) on delete cascade,
  solved_problem_id   uuid references public.solved_problems(id) on delete cascade,
  revision_number     integer not null,
  revision_date       date not null default current_date,
  result              text check (result in ('easy', 'hint', 'failed')),
  solve_time          integer,         -- minutes
  confidence          integer check (confidence between 1 and 5),
  created_at          timestamptz default now()
);

alter table public.revision_history enable row level security;

create policy "Users own their revision history"
  on public.revision_history for all
  using (auth.uid() = user_id);

-- Notifications (system + achievement alerts)
create table if not exists public.notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade,
  title       text not null,
  body        text,
  type        text default 'system',  -- system | achievement | xp_levelup | revision_due
  is_read     boolean default false,
  deleted_at  timestamptz,
  created_at  timestamptz default now()
);

alter table public.notifications enable row level security;

create policy "Users own their notifications"
  on public.notifications for all
  using (auth.uid() = user_id);

-- Add missing columns to profiles if not present
alter table public.profiles
  add column if not exists bio          text,
  add column if not exists github_url   text,
  add column if not exists linkedin_url text,
  add column if not exists website_url  text,
  add column if not exists avatar_url   text;

-- Add missing columns to user_stats if not present
alter table public.user_stats
  add column if not exists total_revised     integer default 0,
  add column if not exists coins             integer default 0,
  add column if not exists last_activity_date date;

-- Shop items table
create table if not exists public.shop_items (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text,
  category    text not null,       -- theme | badge | avatar
  price       integer not null,    -- cost in coins
  icon        text,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- Allow authenticated users to read shop items
alter table public.shop_items enable row level security;
create policy "Anyone can view shop items"
  on public.shop_items for select
  using (true);

-- User inventory (purchased items)
create table if not exists public.user_inventory (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete cascade,
  shop_item_id  uuid references public.shop_items(id) on delete cascade,
  is_equipped   boolean default false,
  purchased_at  timestamptz default now(),
  unique(user_id, shop_item_id)
);

alter table public.user_inventory enable row level security;
create policy "Users own their inventory"
  on public.user_inventory for all
  using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists idx_analytics_daily_user_date on public.analytics_daily(user_id, date);
create index if not exists idx_revision_history_user on public.revision_history(user_id);
create index if not exists idx_notifications_user_unread on public.notifications(user_id, is_read, created_at desc);
create index if not exists idx_revision_schedule_due on public.revision_schedule(user_id, next_revision_date) where is_completed = false;
