-- ============================================================
-- Revoraa Adaptive Performance Profiles Migration
-- 20240101000052_adaptive_performance_profiles.sql
--
-- Cross-Platform Device Profiling, Performance Modes & Persistence
-- ============================================================

-- 1. Extend user_settings to store user-level default performance mode override
DO $$ BEGIN
  ALTER TABLE public.user_settings 
    ADD COLUMN IF NOT EXISTS performance_mode text DEFAULT 'automatic' 
    CHECK (performance_mode IN ('automatic', 'efficiency', 'balanced', 'high-quality'));
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- 2. Create user_device_profiles table for per-browser/device persistent performance state
CREATE TABLE IF NOT EXISTS public.user_device_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id text NOT NULL,
  performance_mode text NOT NULL DEFAULT 'balanced' 
    CHECK (performance_mode IN ('efficiency', 'balanced', 'high-quality')),
  manual_override text NOT NULL DEFAULT 'automatic' 
    CHECK (manual_override IN ('automatic', 'efficiency', 'balanced', 'high-quality')),
  capabilities jsonb DEFAULT '{}'::jsonb,
  algorithm_version integer NOT NULL DEFAULT 1,
  classification_reason text,
  last_assessed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, device_id)
);

-- Index for fast lookup by device_id (for fast device boot and anonymous association)
CREATE INDEX IF NOT EXISTS idx_device_profiles_device_id ON public.user_device_profiles(device_id);
CREATE INDEX IF NOT EXISTS idx_device_profiles_user_id ON public.user_device_profiles(user_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.user_device_profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can read their own device profiles
DROP POLICY IF EXISTS "Users can read own device profiles" ON public.user_device_profiles;
CREATE POLICY "Users can read own device profiles" 
  ON public.user_device_profiles FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own device profiles
DROP POLICY IF EXISTS "Users can insert own device profiles" ON public.user_device_profiles;
CREATE POLICY "Users can insert own device profiles" 
  ON public.user_device_profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own device profiles
DROP POLICY IF EXISTS "Users can update own device profiles" ON public.user_device_profiles;
CREATE POLICY "Users can update own device profiles" 
  ON public.user_device_profiles FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy 4: Users can delete their own device profiles
DROP POLICY IF EXISTS "Users can delete own device profiles" ON public.user_device_profiles;
CREATE POLICY "Users can delete own device profiles" 
  ON public.user_device_profiles FOR DELETE 
  USING (auth.uid() = user_id);

-- 4. RPC function to safely upsert device performance profile
CREATE OR REPLACE FUNCTION public.upsert_device_performance_profile(
  p_device_id text,
  p_performance_mode text,
  p_manual_override text DEFAULT 'automatic',
  p_capabilities jsonb DEFAULT '{}'::jsonb,
  p_algorithm_version integer DEFAULT 1,
  p_classification_reason text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_result jsonb;
BEGIN
  v_user_id := auth.uid();

  -- Verify authenticated session
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to persist profile';
  END IF;

  -- Validate mode inputs
  IF p_performance_mode NOT IN ('efficiency', 'balanced', 'high-quality') THEN
    p_performance_mode := 'balanced';
  END IF;

  IF p_manual_override NOT IN ('automatic', 'efficiency', 'balanced', 'high-quality') THEN
    p_manual_override := 'automatic';
  END IF;

  -- Insert or update user device profile
  INSERT INTO public.user_device_profiles (
    user_id,
    device_id,
    performance_mode,
    manual_override,
    capabilities,
    algorithm_version,
    classification_reason,
    last_assessed_at,
    updated_at
  )
  VALUES (
    v_user_id,
    p_device_id,
    p_performance_mode,
    p_manual_override,
    COALESCE(p_capabilities, '{}'::jsonb),
    p_algorithm_version,
    p_classification_reason,
    now(),
    now()
  )
  ON CONFLICT (user_id, device_id) DO UPDATE SET
    performance_mode = EXCLUDED.performance_mode,
    manual_override = EXCLUDED.manual_override,
    capabilities = EXCLUDED.capabilities,
    algorithm_version = EXCLUDED.algorithm_version,
    classification_reason = EXCLUDED.classification_reason,
    last_assessed_at = now(),
    updated_at = now();

  -- Also update global user_settings preferred performance mode if manual override is specified
  IF p_manual_override <> 'automatic' THEN
    UPDATE public.user_settings 
    SET performance_mode = p_manual_override, updated_at = now() 
    WHERE user_id = v_user_id;
  END IF;

  SELECT to_jsonb(t) INTO v_result 
  FROM public.user_device_profiles t 
  WHERE t.user_id = v_user_id AND t.device_id = p_device_id;

  RETURN v_result;
END;
$$;
