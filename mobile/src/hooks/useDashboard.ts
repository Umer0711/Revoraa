import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardData } from '@/services/dashboard/dashboardService';
import { useAuthStore } from '@/store/useAuthStore';

export function useDashboard() {
  const { user } = useAuthStore();

  return useQuery<DashboardData>({
    queryKey: ['dashboard', user?.id],
    queryFn: () => {
      if (!user?.id) {
        return Promise.resolve({
          stats: { current_streak: 0, xp: 0, coins: 0, total_solved: 0 },
          todayRevisions: [],
          recentActivity: [],
        });
      }
      return dashboardService.fetchDashboardData(user.id);
    },
    enabled: !!user?.id,
  });
}
