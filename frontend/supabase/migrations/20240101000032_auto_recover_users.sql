-- One-time migration to auto-recover any existing failed activations
-- This calls the RPC we created in a previous migration to recover any users
-- whose payment succeeded but subscription wasn't activated.

DO $$
BEGIN
  -- Perform a global recovery of all users with a status of 'success' or 'failed_activation'
  -- who do not have an active subscription record properly linked.
  PERFORM public.recover_failed_activations();
END $$;
