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
import { useRouter } from 'expo-router';
import { ArrowLeft, Award, Lock, Zap, Flame, Target, Map, Repeat } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { useAuthStore } from '@/store/useAuthStore';
import { useAchievements } from '@/hooks/useAchievements';
import { Achievement } from '@/services/achievements/achievementService';
import { GlassCard } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

export default function AchievementsScreen() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const { data: achievements, isLoading, isError, refetch, isRefetching } = useAchievements();
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null);

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const currentXp = profile?.xp || 250;
  const level = Math.floor(currentXp / 500) + 1;
  const nextLevelXp = level * 500;
  const progressPercent = Math.min(100, Math.round((currentXp / nextLevelXp) * 100));

  const getBadgeIcon = (iconName: string, unlocked: boolean) => {
    const color = unlocked ? colors.accent.primary : colors.text.muted;
    switch (iconName) {
      case 'Flame':
        return <Flame size={28} color={color} />;
      case 'Target':
        return <Target size={28} color={color} />;
      case 'Map':
        return <Map size={28} color={color} />;
      case 'Repeat':
        return <Repeat size={28} color={color} />;
      case 'Zap':
        return <Zap size={28} color={color} />;
      case 'Award':
      default:
        return <Award size={28} color={color} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.titleRow}>
          <Award size={22} color={colors.accent.secondaryGold} />
          <Text style={styles.title}>Achievements & Badges</Text>
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
        {/* Level & XP Banner */}
        <GlassCard style={styles.bannerCard}>
          <View style={styles.bannerHeader}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>LEVEL {level}</Text>
            </View>
            <Text style={styles.xpText}>
              {currentXp} / {nextLevelXp} XP
            </Text>
          </View>

          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressSubText}>
            {nextLevelXp - currentXp} XP needed to reach Level {level + 1}
          </Text>
        </GlassCard>

        {/* Badges Grid */}
        <Text style={styles.gridHeader}>Unlocked & Locked Badges:</Text>

        {isLoading ? (
          <SkeletonCard />
        ) : (
          <View style={styles.badgeGrid}>
            {achievements?.map((badge) => (
              <TouchableOpacity
                key={badge.id}
                style={[
                  styles.badgeCard,
                  badge.unlocked ? styles.badgeUnlocked : styles.badgeLocked,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedBadge(badge)}
              >
                <View style={styles.iconCircle}>
                  {badge.unlocked ? (
                    getBadgeIcon(badge.badge_icon, true)
                  ) : (
                    <Lock size={24} color={colors.text.muted} />
                  )}
                </View>
                <Text style={styles.badgeTitle} numberOfLines={1}>
                  {badge.title}
                </Text>
                <Text style={styles.badgeXp}>+{badge.xp_reward} XP</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Badge Detail Modal */}
      <Modal
        visible={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
        title={selectedBadge?.title}
      >
        {selectedBadge && (
          <View style={styles.modalContent}>
            <View style={styles.modalIconBox}>
              {getBadgeIcon(selectedBadge.badge_icon, selectedBadge.unlocked)}
            </View>
            <Text style={styles.modalDesc}>{selectedBadge.description}</Text>
            <View style={styles.rewardRow}>
              <Zap size={16} color={colors.accent.primary} />
              <Text style={styles.rewardText}>Reward: +{selectedBadge.xp_reward} XP</Text>
            </View>
            <Text style={styles.statusText}>
              Status: {selectedBadge.unlocked ? 'Unlocked 🎉' : 'Locked 🔒'}
            </Text>
          </View>
        )}
      </Modal>
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
  },
  bannerCard: {
    marginBottom: 20,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    backgroundColor: 'rgba(245, 166, 35, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  levelText: {
    color: colors.accent.primary,
    fontWeight: '800',
    fontSize: 12,
  },
  xpText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  progressBg: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.background.surface,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent.primary,
  },
  progressSubText: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  gridHeader: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: colors.background.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.default,
    padding: 16,
    alignItems: 'center',
  },
  badgeUnlocked: {
    borderColor: 'rgba(245, 166, 35, 0.4)',
  },
  badgeLocked: {
    opacity: 0.6,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  badgeTitle: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeXp: {
    color: colors.accent.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  modalContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalDesc: {
    color: colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  rewardText: {
    color: colors.accent.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  statusText: {
    color: colors.text.muted,
    fontSize: 13,
  },
});
