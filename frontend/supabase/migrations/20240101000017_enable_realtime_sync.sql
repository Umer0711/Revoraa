-- Enable Realtime for crucial tables
BEGIN;

-- Drop publication if it exists to recreate it cleanly (it usually exists by default)
-- But we can just add to it safely.
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE subscriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE solved_problems;

COMMIT;
