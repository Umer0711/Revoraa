-- ============================================================================
-- Migration: 20240101000044_realtime_user_analytics.sql
-- Real-time User Analytics & Historical Tracking
-- Authoritative, timezone-aware analytics calculated directly from
-- public.solved_problems and public.revision_attempts.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_user_analytics(
  p_user_id uuid,
  p_timezone text DEFAULT 'UTC'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tz text;
  v_today date;
  v_yesterday date;
  v_year_start date;
  
  -- Summary variables
  v_total_solved integer := 0;
  v_total_revised integer := 0;
  v_avg_confidence numeric := NULL;
  v_avg_solve_time_sec integer := NULL;
  v_avg_rev_time_sec integer := NULL;
  v_fastest_solve_sec integer := NULL;
  v_rev_success_rate numeric := NULL;
  v_active_days_this_year integer := 0;
  
  -- Streak calculation
  v_current_streak integer := 0;
  v_longest_streak integer := 0;
  v_streak_counter integer := 0;
  v_prev_date date := NULL;
  v_curr_date date;
  v_has_today boolean := false;
  v_has_yesterday boolean := false;
  
  -- Distribution objects
  v_diff_dist jsonb := '{}'::jsonb;
  v_platform_dist jsonb := '{}'::jsonb;
  v_topic_dist jsonb := '[]'::jsonb;
  v_daily_activity jsonb := '[]'::jsonb;
  v_last_7_days jsonb := '[]'::jsonb;
  
  v_result jsonb;
BEGIN
  -- 1. Security check: User can only access their own analytics
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- 2. Resolve timezone
  v_tz := COALESCE(NULLIF(trim(p_timezone), ''), 'UTC');
  BEGIN
    v_today := (now() AT TIME ZONE v_tz)::date;
  EXCEPTION WHEN OTHERS THEN
    v_tz := 'UTC';
    v_today := (now() AT TIME ZONE 'UTC')::date;
  END;

  v_yesterday := v_today - 1;
  v_year_start := make_date(extract(year from v_today)::integer, 1, 1);

  -- 3. Total Solved: Unique problems the user has solved and not deleted
  SELECT COUNT(DISTINCT problem_id)
  INTO v_total_solved
  FROM public.solved_problems
  WHERE user_id = p_user_id
    AND deleted_at IS NULL;

  -- 4. Total Revised: All non-initial revision attempts
  SELECT COUNT(*)
  INTO v_total_revised
  FROM public.revision_attempts
  WHERE user_id = p_user_id
    AND attempt_type IN ('scheduled_revision', 'manual_revision');

  -- 5. Average Confidence across all recorded attempts
  SELECT ROUND(AVG(confidence)::numeric, 1)
  INTO v_avg_confidence
  FROM public.revision_attempts
  WHERE user_id = p_user_id
    AND confidence IS NOT NULL;

  -- Fallback if no attempts recorded yet, check solved_problems
  IF v_avg_confidence IS NULL THEN
    SELECT ROUND(AVG(confidence)::numeric, 1)
    INTO v_avg_confidence
    FROM public.solved_problems
    WHERE user_id = p_user_id
      AND deleted_at IS NULL
      AND confidence IS NOT NULL;
  END IF;

  -- 6. Average Initial Solve Time (seconds)
  SELECT ROUND(AVG(COALESCE(duration_seconds, time_taken * 60)))::integer
  INTO v_avg_solve_time_sec
  FROM public.revision_attempts
  WHERE user_id = p_user_id
    AND attempt_type = 'initial_solve'
    AND COALESCE(duration_seconds, time_taken * 60) > 0;

  -- Fallback if no initial_solve attempt recorded yet
  IF v_avg_solve_time_sec IS NULL THEN
    SELECT ROUND(AVG(solve_time_minutes * 60))::integer
    INTO v_avg_solve_time_sec
    FROM public.solved_problems
    WHERE user_id = p_user_id
      AND deleted_at IS NULL
      AND solve_time_minutes > 0;
  END IF;

  -- 7. Average Revision Time (seconds)
  SELECT ROUND(AVG(COALESCE(duration_seconds, time_taken * 60)))::integer
  INTO v_avg_rev_time_sec
  FROM public.revision_attempts
  WHERE user_id = p_user_id
    AND attempt_type IN ('scheduled_revision', 'manual_revision')
    AND COALESCE(duration_seconds, time_taken * 60) > 0;

  -- 8. Fastest Solve Ever (seconds)
  SELECT MIN(COALESCE(duration_seconds, time_taken * 60))::integer
  INTO v_fastest_solve_sec
  FROM public.revision_attempts
  WHERE user_id = p_user_id
    AND COALESCE(duration_seconds, time_taken * 60) > 0;

  -- Fallback if no attempt records yet
  IF v_fastest_solve_sec IS NULL THEN
    SELECT MIN(solve_time_minutes * 60)::integer
    INTO v_fastest_solve_sec
    FROM public.solved_problems
    WHERE user_id = p_user_id
      AND deleted_at IS NULL
      AND solve_time_minutes > 0;
  END IF;

  -- 9. Revision Success Rate (percentage of revisions resulting in easy/mastered)
  SELECT 
    CASE WHEN COUNT(*) > 0 THEN
      ROUND((COUNT(*) FILTER (WHERE result IN ('easy', 'mastered'))::numeric / COUNT(*)) * 100, 1)
    ELSE NULL END
  INTO v_rev_success_rate
  FROM public.revision_attempts
  WHERE user_id = p_user_id
    AND attempt_type IN ('scheduled_revision', 'manual_revision')
    AND result IS NOT NULL;

  -- 10. Dynamic Streak Calculation based on actual activity dates in user's timezone
  -- Fetch distinct calendar dates in ascending order
  FOR v_curr_date IN
    SELECT DISTINCT act_date
    FROM (
      SELECT (created_at AT TIME ZONE v_tz)::date AS act_date
      FROM public.revision_attempts
      WHERE user_id = p_user_id
      UNION
      SELECT (created_at AT TIME ZONE v_tz)::date AS act_date
      FROM public.solved_problems
      WHERE user_id = p_user_id AND deleted_at IS NULL
      UNION
      SELECT activity_date AS act_date
      FROM public.daily_activity
      WHERE user_id = p_user_id
    ) all_dates
    ORDER BY act_date ASC
  LOOP
    IF v_curr_date >= v_year_start THEN
      v_active_days_this_year := v_active_days_this_year + 1;
    END IF;

    IF v_curr_date = v_today THEN
      v_has_today := true;
    END IF;
    IF v_curr_date = v_yesterday THEN
      v_has_yesterday := true;
    END IF;

    IF v_prev_date IS NULL THEN
      v_streak_counter := 1;
    ELSIF v_curr_date = v_prev_date + 1 THEN
      v_streak_counter := v_streak_counter + 1;
    ELSE
      v_streak_counter := 1;
    END IF;

    IF v_streak_counter > v_longest_streak THEN
      v_longest_streak := v_streak_counter;
    END IF;

    v_prev_date := v_curr_date;
  END LOOP;

  -- Current streak only valid if user was active today or yesterday
  IF v_has_today THEN
    -- Active today: streak is consecutive days ending today
    v_current_streak := 0;
    v_curr_date := v_today;
    WHILE EXISTS (
      SELECT 1 FROM (
        SELECT (created_at AT TIME ZONE v_tz)::date AS act_date FROM public.revision_attempts WHERE user_id = p_user_id
        UNION
        SELECT (created_at AT TIME ZONE v_tz)::date AS act_date FROM public.solved_problems WHERE user_id = p_user_id AND deleted_at IS NULL
        UNION
        SELECT activity_date AS act_date FROM public.daily_activity WHERE user_id = p_user_id
      ) d WHERE d.act_date = v_curr_date
    ) LOOP
      v_current_streak := v_current_streak + 1;
      v_curr_date := v_curr_date - 1;
    END LOOP;
  ELSIF v_has_yesterday THEN
    -- Active yesterday: streak is consecutive days ending yesterday
    v_current_streak := 0;
    v_curr_date := v_yesterday;
    WHILE EXISTS (
      SELECT 1 FROM (
        SELECT (created_at AT TIME ZONE v_tz)::date AS act_date FROM public.revision_attempts WHERE user_id = p_user_id
        UNION
        SELECT (created_at AT TIME ZONE v_tz)::date AS act_date FROM public.solved_problems WHERE user_id = p_user_id AND deleted_at IS NULL
        UNION
        SELECT activity_date AS act_date FROM public.daily_activity WHERE user_id = p_user_id
      ) d WHERE d.act_date = v_curr_date
    ) LOOP
      v_current_streak := v_current_streak + 1;
      v_curr_date := v_curr_date - 1;
    END LOOP;
  ELSE
    v_current_streak := 0;
  END IF;

  -- 11. Difficulty Distribution (Unique solved problems)
  SELECT COALESCE(jsonb_object_agg(sub.difficulty, sub.cnt), '{}'::jsonb)
  INTO v_diff_dist
  FROM (
    SELECT COALESCE(p.difficulty, 'Unknown') AS difficulty, COUNT(DISTINCT sp.problem_id) AS cnt
    FROM public.solved_problems sp
    JOIN public.problems p ON sp.problem_id = p.id
    WHERE sp.user_id = p_user_id AND sp.deleted_at IS NULL
    GROUP BY p.difficulty
  ) sub;

  -- 12. Platform Distribution (Unique solved problems)
  SELECT COALESCE(jsonb_object_agg(sub.platform_name, sub.cnt), '{}'::jsonb)
  INTO v_platform_dist
  FROM (
    SELECT COALESCE(cp.name, 'Custom') AS platform_name, COUNT(DISTINCT sp.problem_id) AS cnt
    FROM public.solved_problems sp
    JOIN public.problems p ON sp.problem_id = p.id
    LEFT JOIN public.coding_platforms cp ON p.platform_id = cp.id
    WHERE sp.user_id = p_user_id AND sp.deleted_at IS NULL
    GROUP BY cp.name
  ) sub;

  -- 13. Topic Distribution (Top topics from solved problems and user_pattern/tags)
  SELECT COALESCE(jsonb_agg(topic_row), '[]'::jsonb)
  INTO v_topic_dist
  FROM (
    WITH user_topics AS (
      SELECT 
        COALESCE(sp.user_pattern, pt.tag, 'General') AS topic_name,
        sp.problem_id
      FROM public.solved_problems sp
      LEFT JOIN LATERAL (
        SELECT tag FROM public.problem_tags WHERE problem_id = sp.problem_id LIMIT 1
      ) pt ON true
      WHERE sp.user_id = p_user_id AND sp.deleted_at IS NULL
    )
    SELECT 
      topic_name AS name,
      COUNT(DISTINCT problem_id) AS count,
      COUNT(DISTINCT problem_id) AS solved
    FROM user_topics
    WHERE topic_name IS NOT NULL AND topic_name != ''
    GROUP BY topic_name
    ORDER BY count DESC
    LIMIT 10
  ) topic_row;

  -- 14. Daily Activity for the current year / past 365 days
  SELECT COALESCE(jsonb_agg(day_stat ORDER BY day_stat->>'date' ASC), '[]'::jsonb)
  INTO v_daily_activity
  FROM (
    WITH raw_attempts AS (
      SELECT 
        (created_at AT TIME ZONE v_tz)::date AS act_date,
        CASE WHEN attempt_type = 'initial_solve' THEN 1 ELSE 0 END AS is_solve,
        CASE WHEN attempt_type IN ('scheduled_revision', 'manual_revision') THEN 1 ELSE 0 END AS is_rev
      FROM public.revision_attempts
      WHERE user_id = p_user_id
        AND (created_at AT TIME ZONE v_tz)::date >= v_year_start
      UNION ALL
      SELECT 
        (created_at AT TIME ZONE v_tz)::date AS act_date,
        1 AS is_solve,
        0 AS is_rev
      FROM public.solved_problems
      WHERE user_id = p_user_id 
        AND deleted_at IS NULL
        AND (created_at AT TIME ZONE v_tz)::date >= v_year_start
        AND id NOT IN (SELECT solved_problem_id FROM public.revision_attempts WHERE solved_problem_id IS NOT NULL)
    )
    SELECT jsonb_build_object(
      'date', act_date::text,
      'solved', SUM(is_solve),
      'revised', SUM(is_rev),
      'total', COUNT(*)
    ) AS day_stat
    FROM raw_attempts
    GROUP BY act_date
  ) daily_sub;

  -- 15. Last 7 Days Activity Breakdown
  SELECT COALESCE(jsonb_agg(d_row ORDER BY d_row->>'date' ASC), '[]'::jsonb)
  INTO v_last_7_days
  FROM (
    WITH days_series AS (
      SELECT (v_today - i)::date AS d_date
      FROM generate_series(6, 0, -1) AS i
    ),
    day_counts AS (
      SELECT 
        (created_at AT TIME ZONE v_tz)::date AS act_date,
        COUNT(*) FILTER (WHERE attempt_type = 'initial_solve') AS solved_count,
        COUNT(*) FILTER (WHERE attempt_type IN ('scheduled_revision', 'manual_revision')) AS revised_count
      FROM public.revision_attempts
      WHERE user_id = p_user_id
        AND (created_at AT TIME ZONE v_tz)::date >= (v_today - 6)
      GROUP BY (created_at AT TIME ZONE v_tz)::date
    )
    SELECT jsonb_build_object(
      'date', ds.d_date::text,
      'name', to_char(ds.d_date, 'Dy'),
      'solved', COALESCE(dc.solved_count, 0),
      'revised', COALESCE(dc.revised_count, 0)
    ) AS d_row
    FROM days_series ds
    LEFT JOIN day_counts dc ON ds.d_date = dc.act_date
  ) l7_sub;

  -- 16. Assemble final JSON response
  v_result := jsonb_build_object(
    'summary', jsonb_build_object(
      'total_solved', v_total_solved,
      'total_revised', v_total_revised,
      'current_streak', v_current_streak,
      'longest_streak', v_longest_streak,
      'average_confidence', v_avg_confidence,
      'average_solve_time_seconds', v_avg_solve_time_sec,
      'average_revision_time_seconds', v_avg_rev_time_sec,
      'fastest_solve_seconds', v_fastest_solve_sec,
      'revision_success_rate', v_rev_success_rate,
      'active_days_this_year', v_active_days_this_year
    ),
    'difficulty_distribution', v_diff_dist,
    'platform_distribution', v_platform_dist,
    'topic_distribution', v_topic_dist,
    'daily_activity', v_daily_activity,
    'last_7_days', v_last_7_days
  );

  RETURN v_result;
END;
$$;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_analytics(uuid, text) TO authenticated;
