import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  TrendingUp,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { useAnalytics } from '@/hooks/useAnalytics';
import { GlassCard, StatCard } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

export default function AnalyticsScreen() {
  const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = useAnalytics();

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const totalEasy = data?.diffDistribution.Easy || 0;
  const totalMedium = data?.diffDistribution.Medium || 0;
  const totalHard = data?.diffDistribution.Hard || 0;
  const totalSolved = totalEasy + totalMedium + totalHard;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.titleRow}>
          <BarChart3 size={22} color={colors.accent.primary} />
          <Text style={styles.title}>Analytics & Insights</Text>
        </View>
      </View>

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
        {/* Top Summary Stats */}
        {isLoading ? (
          <SkeletonCard />
        ) : (
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Solved"
              value={totalSolved}
              subtitle="All time"
              icon={<TrendingUp size={20} color={colors.accent.primary} />}
            />
            <StatCard
              title="Avg Confidence"
              value={`${data?.avgConfidence || 0} / 5`}
              subtitle="Self-assessment"
              icon={<Target size={20} color={colors.status.success} />}
              highlightColor={colors.status.success}
            />
          </View>
        )}

        {/* Difficulty Distribution */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Difficulty Breakdown</Text>
          <View style={styles.diffRow}>
            <View style={styles.diffItem}>
              <Text style={[styles.diffCount, { color: colors.status.success }]}>{totalEasy}</Text>
              <Text style={styles.diffLabel}>Easy</Text>
            </View>
            <View style={styles.diffItem}>
              <Text style={[styles.diffCount, { color: colors.status.warning }]}>
                {totalMedium}
              </Text>
              <Text style={styles.diffLabel}>Medium</Text>
            </View>
            <View style={styles.diffItem}>
              <Text style={[styles.diffCount, { color: colors.status.danger }]}>{totalHard}</Text>
              <Text style={styles.diffLabel}>Hard</Text>
            </View>
          </View>

          {/* Simple distribution bar */}
          <View style={styles.barContainer}>
            {totalSolved > 0 ? (
              <>
                <View
                  style={[
                    styles.barSegment,
                    { flex: totalEasy || 1, backgroundColor: colors.status.success },
                  ]}
                />
                <View
                  style={[
                    styles.barSegment,
                    { flex: totalMedium || 1, backgroundColor: colors.status.warning },
                  ]}
                />
                <View
                  style={[
                    styles.barSegment,
                    { flex: totalHard || 1, backgroundColor: colors.status.danger },
                  ]}
                />
              </>
            ) : (
              <View
                style={[styles.barSegment, { flex: 1, backgroundColor: colors.background.surface }]}
              />
            )}
          </View>
        </GlassCard>

        {/* Weak Areas Recommendation */}
        <GlassCard style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <AlertTriangle size={18} color={colors.status.warning} />
            <Text style={styles.sectionTitle}>Target Weak Areas</Text>
          </View>
          <Text style={styles.cardSubText}>
            Based on your confidence ratings, focus on these topics next:
          </Text>

          {data?.weakAreas.map((area, idx) => (
            <View key={idx} style={styles.weakAreaItem}>
              <Text style={styles.weakAreaIndex}>{idx + 1}</Text>
              <Text style={styles.weakAreaName}>{area}</Text>
            </View>
          ))}
        </GlassCard>

        {/* Top Pattern Mastery */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Top Pattern Mastery</Text>
          {data?.topPatterns && data.topPatterns.length > 0 ? (
            data.topPatterns.map((pat, idx) => (
              <View key={idx} style={styles.patternItem}>
                <Text style={styles.patternName}>{pat.category}</Text>
                <Text style={styles.patternCount}>{pat.count} Solved</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Keep solving to unlock pattern analytics!</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  sectionCard: {
    marginBottom: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  cardSubText: {
    color: colors.text.secondary,
    fontSize: 13,
    marginBottom: 12,
  },
  diffRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  diffItem: {
    alignItems: 'center',
  },
  diffCount: {
    fontSize: 22,
    fontWeight: '800',
  },
  diffLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  barContainer: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: colors.background.surface,
  },
  barSegment: {
    height: '100%',
  },
  weakAreaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.surface,
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    gap: 10,
  },
  weakAreaIndex: {
    color: colors.accent.primary,
    fontWeight: '800',
    fontSize: 14,
    width: 20,
    textAlign: 'center',
  },
  weakAreaName: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  patternItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  patternName: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  patternCount: {
    color: colors.text.secondary,
    fontSize: 13,
  },
  emptyText: {
    color: colors.text.secondary,
    fontSize: 13,
    marginVertical: 8,
  },
});
