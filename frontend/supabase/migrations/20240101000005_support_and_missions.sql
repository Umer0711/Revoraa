create table if not exists public.support_tickets (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    email text not null,
    subject text not null,
    message text not null,
    status text default 'open',
    created_at timestamptz default now()
);

alter table public.support_tickets enable row level security;
create policy "Users can insert their own support tickets" on public.support_tickets for insert with check (auth.uid() = user_id);
create policy "Users can read their own support tickets" on public.support_tickets for select using (auth.uid() = user_id);

create table if not exists public.claimed_missions (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    mission_id text not null,
    claimed_at date default CURRENT_DATE not null,
    unique (user_id, mission_id, claimed_at)
);

alter table public.claimed_missions enable row level security;
create policy "Users can read their own claimed missions" on public.claimed_missions for select using (auth.uid() = user_id);

create or replace function public.claim_mission_reward(
    p_user_id uuid,
    p_mission_id text,
    p_xp integer,
    p_coins integer
) returns void as $$
begin
    -- 1. Insert into claimed_missions to prevent duplicate claims today
    insert into public.claimed_missions (user_id, mission_id, claimed_at)
    values (p_user_id, p_mission_id, CURRENT_DATE);

    -- 2. Increment stats
    update public.user_stats
    set xp = xp + p_xp,
        coins = coins + p_coins,
        updated_at = now()
    where user_id = p_user_id;
end;
$$ language plpgsql security definer;
