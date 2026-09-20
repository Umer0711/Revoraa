import { useQuery } from '@tanstack/react-query';
import { analyticsService, AnalyticsData } from '@/services/analytics/analyticsService';
import { useAuthStore } from '@/store/useAuthStore';

export function useAnalytics() {
  const { user } = useAuthStore();

  return useQuery<AnalyticsData>({
    queryKey: ['analytics', user?.id],
    queryFn: () => {
      if (!user?.id) {
        return Promise.resolve({
          daily: [],
          diffDistribution: { Easy: 0, Medium: 0, Hard: 0 },
          topPatterns: [],
          avgConfidence: 0,
          weakAreas: [],
        });
      }
      return analyticsService.fetchAnalyticsData(user.id);
    },
    enabled: !!user?.id,
  });
}
