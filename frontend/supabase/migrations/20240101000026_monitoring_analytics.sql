-- 20240101000026_monitoring_analytics.sql

CREATE OR REPLACE FUNCTION public.get_comprehensive_admin_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_is_admin BOOLEAN;
    v_users JSONB;
    v_revenue JSONB;
    v_payments JSONB;
    v_database JSONB;
    v_security JSONB;
    v_engagement JSONB;
BEGIN
    -- 1. Security Check
    SELECT is_admin INTO v_is_admin FROM public.profiles WHERE auth_id = auth.uid();
    IF NOT v_is_admin THEN
        RAISE EXCEPTION 'Access denied. Admin only.';
    END IF;

    -- 2. Users & Subscriptions
    v_users := jsonb_build_object(
        'total', (SELECT count(*) FROM public.profiles),
        'registered_today', (SELECT count(*) FROM public.profiles WHERE created_at >= NOW() - INTERVAL '1 day'),
        'active_24h', (SELECT count(DISTINCT user_id) FROM public.solved_problems WHERE created_at >= NOW() - INTERVAL '24 hours'),
        'active_7d', (SELECT count(DISTINCT user_id) FROM public.solved_problems WHERE created_at >= NOW() - INTERVAL '7 days'),
        'active_30d', (SELECT count(DISTINCT user_id) FROM public.solved_problems WHERE created_at >= NOW() - INTERVAL '30 days'),
        'pro_monthly', (SELECT count(*) FROM public.subscriptions s JOIN public.plans p ON s.plan_id = p.id WHERE p.interval = 'month' AND s.status = 'active'),
        'pro_yearly', (SELECT count(*) FROM public.subscriptions s JOIN public.plans p ON s.plan_id = p.id WHERE p.interval = 'year' AND s.status = 'active'),
        'free', (SELECT count(*) FROM public.profiles WHERE subscription_status = 'free' OR subscription_status IS NULL)
    );

    -- 3. Revenue
    v_revenue := jsonb_build_object(
        'today', (SELECT COALESCE(SUM(amount), 0) FROM public.billing_history WHERE status = 'success' AND created_at >= NOW() - INTERVAL '1 day'),
        'this_month', (SELECT COALESCE(SUM(amount), 0) FROM public.billing_history WHERE status = 'success' AND date_trunc('month', created_at) = date_trunc('month', NOW())),
        'lifetime', (SELECT COALESCE(SUM(amount), 0) FROM public.billing_history WHERE status = 'success')
    );

    -- 4. Payments
    v_payments := jsonb_build_object(
        'today_total', (SELECT count(*) FROM public.billing_history WHERE created_at >= NOW() - INTERVAL '1 day'),
        'success_rate', (
            SELECT CASE WHEN count(*) = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END)::numeric / count(*)) * 100, 2) END
            FROM public.billing_history WHERE created_at >= NOW() - INTERVAL '30 days'
        ),
        'failed_today', (SELECT count(*) FROM public.billing_history WHERE status IN ('failed', 'failed_activation') AND created_at >= NOW() - INTERVAL '1 day')
    );

    -- 5. Database & System Health (Estimates)
    v_database := jsonb_build_object(
        'total_problems', (SELECT count(*) FROM public.problems),
        'total_solved', (SELECT count(*) FROM public.solved_problems),
        'storage_usage', 'Monitoring via Better Stack',
        'cpu_usage', 'Monitoring via Better Stack'
    );

    -- 6. Engagement & Analytics
    v_engagement := jsonb_build_object(
        'problems_added_today', (SELECT count(*) FROM public.solved_problems WHERE created_at >= NOW() - INTERVAL '1 day'),
        'revisions_completed_today', (SELECT count(*) FROM public.revision_schedule WHERE is_completed = true AND updated_at >= NOW() - INTERVAL '1 day'),
        'coins_distributed', (SELECT COALESCE(SUM(amount), 0) FROM public.coin_transactions WHERE amount > 0),
        'coins_spent', (SELECT ABS(COALESCE(SUM(amount), 0)) FROM public.coin_transactions WHERE amount < 0),
        'shop_purchases', (SELECT count(*) FROM public.user_inventory)
    );

    -- 7. Security (Mocked for dashboard layout, typically requires deeper log querying)
    v_security := jsonb_build_object(
        'failed_logins_today', (SELECT count(*) FROM public.system_logs WHERE error_message ILIKE '%invalid login credentials%' AND created_at >= NOW() - INTERVAL '1 day'),
        'rate_limits', 0,
        'blocked_requests', 0
    );

    RETURN jsonb_build_object(
        'users', v_users,
        'revenue', v_revenue,
        'payments', v_payments,
        'database', v_database,
        'engagement', v_engagement,
        'security', v_security,
        'status', 'operational'
    );
END;
$$;
