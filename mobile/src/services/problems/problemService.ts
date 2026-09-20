import { supabase } from '@/lib/supabase/client';
import { Problem } from '@/types';

export const problemService = {
  async fetchProblems(userId: string): Promise<Problem[]> {
    const { data, error } = await supabase
      .from('solved_problems')
      .select(
        `
        id,
        user_id,
        created_at,
        notes,
        problem:problems(
          title,
          difficulty,
          slug,
          platform
        )
      `,
      )
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching problems:', error);
      return [];
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      user_id: item.user_id,
      title: item.problem?.title || 'Untitled Problem',
      difficulty: item.problem?.difficulty || 'Medium',
      topic: item.problem?.topic || 'General',
      platform: item.problem?.platform || 'LeetCode',
      notes: item.notes,
      created_at: item.created_at,
    }));
  },

  async addProblem(
    userId: string,
    problemData: {
      title: string;
      difficulty: string;
      topic: string;
      platform: string;
      notes?: string;
    },
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.from('solved_problems').insert({
        user_id: userId,
        notes: problemData.notes,
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  },
};
