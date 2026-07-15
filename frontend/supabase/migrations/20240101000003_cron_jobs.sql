-- ============================================================
-- Cron job: Daily revision reminders at 8 AM UTC
-- Requires pg_cron extension (available on Supabase Pro)
-- ============================================================

-- Enable pg_cron
create extension if not exists pg_cron;

-- Schedule daily reminders at 08:00 UTC
select cron.schedule(
  'daily-revision-reminders',
  '0 8 * * *',
  $$
    select net.http_post(
      url     := current_setting('app.supabase_url') || '/functions/v1/scheduled-reminders',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || current_setting('app.service_role_key')
      ),
      body    := '{}'::jsonb
    );
  $$
);

-- Add fcm_token and notifications_enabled to user_settings
alter table public.user_settings
  add column if not exists fcm_token              text,
  add column if not exists notifications_enabled  boolean default true,
  add column if not exists email                  text;
