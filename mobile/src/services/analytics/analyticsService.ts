import { supabase } from '@/lib/supabase/client';

export interface AnalyticsData {
  daily: Array<{
    date: string;
    solved: number;
    revised: number;
    accuracy: number;
    avg_time: number;
    xp_earned: number;
  }>;
  diffDistribution: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
  topPatterns: Array<{
    category: string;
    count: number;
    accuracy: number;
  }>;
  avgConfidence: number;
  weakAreas: string[];
}

export const analyticsService = {
  async fetchAnalyticsData(userId: string): Promise<AnalyticsData> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const since = thirtyDaysAgo.toISOString().split('T')[0];

    const [dailyRes, problemsRes, patternStatsRes] = await Promise.all([
      supabase
        .from('analytics_daily')
        .select('date, solved, revised, accuracy, avg_time, xp_earned')
        .eq('user_id', userId)
        .gte('date', since)
        .order('date', { ascending: true }),
      supabase
        .from('solved_problems')
        .select('confidence, solve_time_minutes, problem:problems(difficulty, topic)')
        .eq('user_id', userId)
        .is('deleted_at', null),
      supabase
        .from('user_pattern_stats')
        .select('pattern, solved_count, mastery_score')
        .eq('user_id', userId)
        .order('solved_count', { ascending: false })
        .limit(6),
    ]);

    const problems = problemsRes.data ?? [];
    const diffDistribution = { Easy: 0, Medium: 0, Hard: 0 };
    const topicCount: Record<string, { total: number; lowConf: number }> = {};

    problems.forEach((sp: any) => {
      const diff = sp.problem?.difficulty as 'Easy' | 'Medium' | 'Hard';
      if (diff && diffDistribution[diff] !== undefined) {
        diffDistribution[diff]++;
      }
      const topic = sp.problem?.topic || 'General';
      if (!topicCount[topic]) topicCount[topic] = { total: 0, lowConf: 0 };
      topicCount[topic].total++;
      if (sp.confidence && sp.confidence <= 2) {
        topicCount[topic].lowConf++;
      }
    });

    const weakAreas = Object.keys(topicCount)
      .filter((t) => topicCount[t].lowConf > 0)
      .sort((a, b) => topicCount[b].lowConf - topicCount[a].lowConf)
      .slice(0, 3);

    const topPatterns = (patternStatsRes.data ?? []).map((ps: any) => ({
      category: ps.pattern || 'Pattern',
      count: ps.solved_count || 0,
      accuracy: ps.mastery_score || 0,
    }));

    const avgConfidence = problems.length
      ? Number(
          (
            problems.reduce((s: number, p: any) => s + (p.confidence ?? 3), 0) / problems.length
          ).toFixed(1),
        )
      : 0;

    return {
      daily: (dailyRes.data as any) || [],
      diffDistribution,
      topPatterns,
      avgConfidence,
      weakAreas: weakAreas.length ? weakAreas : ['Dynamic Programming', 'Graph Traversal'],
    };
  },
};
