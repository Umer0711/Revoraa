import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Sparkles,
  Flame,
  Coins,
  Zap,
  Repeat,
  Map,
  Target,
  ArrowRight,
  Code2,
  BarChart3,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { useAuthStore } from '@/store/useAuthStore';
import { useDashboard } from '@/hooks/useDashboard';
import { GlassCard, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, profile } = useAuthStore();
  const { data, isLoading, isError, refetch, isRefetching } = useDashboard();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Learner';

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.accent.primary}
          />
        }
      >
        {/* Header Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.name}>{displayName} 👋</Text>
          </View>

          <TouchableOpacity
            style={styles.profileBadge}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Sparkles size={20} color={colors.accent.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        {isLoading ? (
          <View style={styles.statsRow}>
            <SkeletonCard style={{ flex: 1 }} />
            <SkeletonCard style={{ flex: 1 }} />
          </View>
        ) : (
          <View style={styles.statsRow}>
            <StatCard
              title="Current Streak"
              value={`${data?.stats.current_streak || 0} Days`}
              icon={<Flame size={20} color={colors.status.warning} />}
              highlightColor={colors.status.warning}
            />
            <StatCard
              title="Total XP"
              value={data?.stats.xp || 0}
              icon={<Zap size={20} color={colors.accent.primary} />}
              highlightColor={colors.accent.primary}
            />
            <StatCard
              title="Coins"
              value={data?.stats.coins || 0}
              icon={<Coins size={20} color={colors.accent.secondaryGold} />}
              highlightColor={colors.accent.secondaryGold}
            />
          </View>
        )}

        {/* Today's Revision Widget */}
        <GlassCard style={styles.widgetCard}>
          <View style={styles.widgetHeader}>
            <View style={styles.widgetTitleRow}>
              <Repeat size={20} color={colors.accent.primary} />
              <Text style={styles.widgetTitle}>Today's Revision</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/revision')}>
              <ArrowRight size={18} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {data?.todayRevisions && data.todayRevisions.length > 0 ? (
            <View style={styles.revisionList}>
              {data.todayRevisions.slice(0, 3).map((item) => (
                <View key={item.id} style={styles.revisionItem}>
                  <Code2 size={16} color={colors.text.secondary} />
                  <Text style={styles.revisionText} numberOfLines={1}>
                    {item.solved_problem?.problem?.title || 'Algorithm Problem'}
                  </Text>
                  <View style={styles.difficultyBadge}>
                    <Text style={styles.difficultyText}>
                      {item.solved_problem?.problem?.difficulty || 'Medium'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>All caught up! No revisions due today.</Text>
          )}

          <Button
            title="Start Today's Revision"
            onPress={() => router.push('/(tabs)/revision')}
            variant="primary"
            style={styles.actionBtn}
          />
        </GlassCard>

        {/* Quick Access Grid */}
        <View style={styles.gridRow}>
          <GlassCard style={styles.gridCard} onPress={() => router.push('/(tabs)/atlas')}>
            <Map size={24} color={colors.accent.primary} style={{ marginBottom: 8 }} />
            <Text style={styles.gridTitle}>DSA Atlas</Text>
            <Text style={styles.gridSubtitle}>Pattern Roadmap</Text>
          </GlassCard>

          <GlassCard style={styles.gridCard} onPress={() => router.push('/interview')}>
            <Target size={24} color={colors.status.success} style={{ marginBottom: 8 }} />
            <Text style={styles.gridTitle}>Interview Prep</Text>
            <Text style={styles.gridSubtitle}>Company Questions</Text>
          </GlassCard>

          <GlassCard style={styles.gridCard} onPress={() => router.push('/analytics')}>
            <BarChart3 size={24} color={colors.accent.secondaryGold} style={{ marginBottom: 8 }} />
            <Text style={styles.gridTitle}>Analytics</Text>
            <Text style={styles.gridSubtitle}>Progress Insights</Text>
          </GlassCard>
        </View>

        {/* Recent Activity */}
        <GlassCard style={styles.widgetCard}>
          <View style={styles.widgetHeader}>
            <View style={styles.widgetTitleRow}>
              <Code2 size={20} color={colors.text.primary} />
              <Text style={styles.widgetTitle}>Recent Activity</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/problems')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {data?.recentActivity && data.recentActivity.length > 0 ? (
            data.recentActivity.map((act) => (
              <View key={act.id} style={styles.activityItem}>
                <View style={styles.activityDot} />
                <Text style={styles.activityTitle} numberOfLines={1}>
                  {act.problem?.title || 'Solved Problem'}
                </Text>
                <Text style={styles.activityDate}>
                  {new Date(act.created_at).toLocaleDateString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No recent activity yet. Start solving!</Text>
          )}
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  greeting: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  name: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 2,
  },
  profileBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  widgetCard: {
    marginBottom: 20,
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  widgetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  widgetTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  viewAllText: {
    color: colors.accent.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  revisionList: {
    gap: 10,
    marginBottom: 16,
  },
  revisionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.surface,
    padding: 10,
    borderRadius: 12,
    gap: 10,
  },
  revisionText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  difficultyBadge: {
    backgroundColor: 'rgba(245, 166, 35, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  difficultyText: {
    color: colors.accent.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  actionBtn: {
    marginTop: 4,
  },
  emptyText: {
    color: colors.text.secondary,
    fontSize: 14,
    marginVertical: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  gridCard: {
    flex: 1,
    padding: 12,
  },
  gridTitle: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  gridSubtitle: {
    color: colors.text.muted,
    fontSize: 11,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  activityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent.primary,
    marginRight: 10,
  },
  activityTitle: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  activityDate: {
    color: colors.text.muted,
    fontSize: 12,
  },
});
