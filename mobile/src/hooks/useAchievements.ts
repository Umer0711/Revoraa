import { useQuery } from '@tanstack/react-query';
import { achievementService, Achievement } from '@/services/achievements/achievementService';
import { useAuthStore } from '@/store/useAuthStore';

export function useAchievements() {
  const { user } = useAuthStore();

  return useQuery<Achievement[]>({
    queryKey: ['achievements', user?.id],
    queryFn: () => {
      if (!user?.id) return Promise.resolve([]);
      return achievementService.fetchAchievements(user.id);
    },
    enabled: !!user?.id,
  });
}
