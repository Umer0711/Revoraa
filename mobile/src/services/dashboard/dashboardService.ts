import { supabase } from '@/lib/supabase/client';

export interface DashboardData {
  stats: {
    current_streak: number;
    xp: number;
    coins: number;
    total_solved: number;
    last_activity_date?: string;
  };
  todayRevisions: Array<{
    id: string;
    next_revision_date: string;
    solved_problem?: {
      id: string;
      problem?: {
        title: string;
        difficulty: string;
        slug: string;
      };
    };
  }>;
  recentActivity: Array<{
    id: string;
    created_at: string;
    problem?: {
      title: string;
      difficulty: string;
    };
  }>;
}

export const dashboardService = {
  async fetchDashboardData(userId: string): Promise<DashboardData> {
    const today = new Date().toISOString().split('T')[0];

    const [statsRes, revisionRes, recentRes] = await Promise.all([
      supabase.from('user_stats').select('*').eq('user_id', userId).maybeSingle(),
      supabase
        .from('revision_schedule')
        .select(
          `id, next_revision_date, solved_problem:solved_problems(id, problem:problems(title, difficulty, slug))`,
        )
        .eq('user_id', userId)
        .eq('is_completed', false)
        .lte('next_revision_date', today)
        .order('next_revision_date', { ascending: true })
        .limit(5),
      supabase
        .from('solved_problems')
        .select(`id, created_at, problem:problems(title, difficulty)`)
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    const statsData = statsRes.data || {
      current_streak: 0,
      xp: 0,
      coins: 0,
      total_solved: 0,
    };

    return {
      stats: statsData,
      todayRevisions: (revisionRes.data as any) ?? [],
      recentActivity: (recentRes.data as any) ?? [],
    };
  },
};
