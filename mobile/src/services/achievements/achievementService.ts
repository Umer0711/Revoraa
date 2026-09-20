import { supabase } from '@/lib/supabase/client';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badge_icon: string;
  xp_reward: number;
  unlocked: boolean;
  unlocked_at?: string;
}

export const achievementService = {
  async fetchAchievements(userId: string): Promise<Achievement[]> {
    try {
      const [allAchievementsRes, userAchievementsRes] = await Promise.all([
        supabase.from('achievements').select('*').order('created_at', { ascending: true }),
        supabase
          .from('user_achievements')
          .select('achievement_id, unlocked_at')
          .eq('user_id', userId),
      ]);

      const unlockedMap = new Map<string, string>();
      (userAchievementsRes.data || []).forEach((ua: any) => {
        unlockedMap.set(ua.achievement_id, ua.unlocked_at);
      });

      const all = allAchievementsRes.data || [
        {
          id: '1',
          title: 'First Step',
          description: 'Solve your very first DSA problem',
          badge_icon: 'Target',
          xp_reward: 50,
        },
        {
          id: '2',
          title: 'Streak Master',
          description: 'Maintain a 7-day study streak',
          badge_icon: 'Flame',
          xp_reward: 150,
        },
        {
          id: '3',
          title: 'Pattern Specialist',
          description: 'Master 5 DSA Patterns in Atlas',
          badge_icon: 'Map',
          xp_reward: 250,
        },
        {
          id: '4',
          title: 'FAANG Ready',
          description: 'Complete 20 Company-specific questions',
          badge_icon: 'Award',
          xp_reward: 500,
        },
        {
          id: '5',
          title: 'Revision Hero',
          description: 'Complete 30 spaced revisions on time',
          badge_icon: 'Repeat',
          xp_reward: 300,
        },
        {
          id: '6',
          title: 'Century Club',
          description: 'Solve 100 total problems in Revoraa',
          badge_icon: 'Zap',
          xp_reward: 1000,
        },
      ];

      return all.map((ach: any) => ({
        id: ach.id,
        title: ach.title,
        description: ach.description,
        badge_icon: ach.badge_icon || 'Award',
        xp_reward: ach.xp_reward || 100,
        unlocked: unlockedMap.has(ach.id) || ach.id === '1', // default unlocked first badge if mock
        unlocked_at: unlockedMap.get(ach.id),
      }));
    } catch (e) {
      console.error('Error fetching achievements:', e);
      return [];
    }
  },
};
