import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Repeat, CheckCircle2, Flame, Clock, Award, Sparkles } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { useAuthStore } from '@/store/useAuthStore';
import { dashboardService } from '@/services/dashboard/dashboardService';
import { supabase } from '@/lib/supabase/client';
import { GlassCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Toast } from '@/components/ui/Toast';

export default function RevisionScreen() {
  const { user } = useAuthStore();
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState('');

  const {
    data: dashboardData,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['revisionHub', user?.id],
    queryFn: () => (user?.id ? dashboardService.fetchDashboardData(user.id) : null),
    enabled: !!user?.id,
  });

  const dueItems = (dashboardData?.todayRevisions || []).filter(
    (item) => !completedIds.includes(item.id),
  );

  const handleCompleteRevision = async (
    revisionId: string,
    confidence: 'easy' | 'medium' | 'hard',
  ) => {
    if (!user?.id) return;
    try {
      const nextDays = confidence === 'easy' ? 7 : confidence === 'medium' ? 3 : 1;
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + nextDays);

      await supabase
        .from('revision_schedule')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', revisionId);

      setCompletedIds((prev) => [...prev, revisionId]);
      setToastMsg(
        `Revision marked as ${confidence.toUpperCase()}! Next review in ${nextDays} day(s).`,
      );
      setTimeout(() => setToastMsg(''), 3000);
      refetch();
    } catch (e) {
      console.error('Error completing revision:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Repeat size={24} color={colors.accent.primary} />
          <Text style={styles.title}>Spaced Revision Engine</Text>
        </View>
        <Text style={styles.subtitle}>
          Review solved problems at optimal intervals to lock them into long-term memory.
        </Text>
      </View>

      {toastMsg ? (
        <View style={styles.toastContainer}>
          <Toast message={toastMsg} type="success" />
        </View>
      ) : null}

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
        {isLoading ? (
          <View style={styles.loaderBox}>
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : dueItems.length === 0 ? (
          <EmptyState
            title="All Revisions Completed! 🎉"
            description="Great work! You've cleared all scheduled revisions for today. Keep building your consistency."
            icon={<CheckCircle2 size={48} color={colors.status.success} />}
          />
        ) : (
          dueItems.map((item) => (
            <GlassCard key={item.id} style={styles.revisionCard}>
              <View style={styles.cardTop}>
                <View style={styles.badge}>
                  <Clock size={12} color={colors.accent.primary} />
                  <Text style={styles.badgeText}>Due Today</Text>
                </View>
                <Text style={styles.diffTag}>
                  {item.solved_problem?.problem?.difficulty || 'Medium'}
                </Text>
              </View>

              <Text style={styles.problemTitle}>
                {item.solved_problem?.problem?.title || 'Algorithm Problem'}
              </Text>

              <Text style={styles.promptText}>
                Rate your recall confidence to schedule the next revision interval:
              </Text>

              <View style={styles.confidenceRow}>
                <TouchableOpacity
                  style={[styles.confBtn, styles.hardBtn]}
                  onPress={() => handleCompleteRevision(item.id, 'hard')}
                >
                  <Text style={styles.confTextHard}>Hard (1d)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.confBtn, styles.medBtn]}
                  onPress={() => handleCompleteRevision(item.id, 'medium')}
                >
                  <Text style={styles.confTextMed}>Good (3d)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.confBtn, styles.easyBtn]}
                  onPress={() => handleCompleteRevision(item.id, 'easy')}
                >
                  <Text style={styles.confTextEasy}>Easy (7d)</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          ))
        )}
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  title: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 18,
  },
  toastContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  loaderBox: {
    gap: 12,
  },
  revisionCard: {
    marginBottom: 14,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  badgeText: {
    color: colors.accent.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  diffTag: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  problemTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  promptText: {
    color: colors.text.secondary,
    fontSize: 13,
    marginBottom: 16,
  },
  confidenceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  confBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  hardBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  medBtn: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  easyBtn: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  confTextHard: {
    color: colors.status.danger,
    fontSize: 12,
    fontWeight: '700',
  },
  confTextMed: {
    color: colors.status.warning,
    fontSize: 12,
    fontWeight: '700',
  },
  confTextEasy: {
    color: colors.status.success,
    fontSize: 12,
    fontWeight: '700',
  },
});
