-- Phase 4: Revision Engine Audit - Cleanup duplicates
-- We only want ONE active (is_completed = false) revision schedule per solved_problem_id.

WITH duplicates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY solved_problem_id 
      ORDER BY updated_at DESC, next_revision_date ASC
    ) as row_num
  FROM public.revision_schedule
  WHERE is_completed = false
)
DELETE FROM public.revision_schedule
WHERE id IN (
  SELECT id FROM duplicates WHERE row_num > 1
);
