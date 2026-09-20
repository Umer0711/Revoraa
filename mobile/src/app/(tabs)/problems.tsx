import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Code2, Filter, Plus, ExternalLink } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { useAuthStore } from '@/store/useAuthStore';
import { problemService } from '@/services/problems/problemService';
import { SearchInput } from '@/components/ui/Input';
import { GlassCard } from '@/components/ui/Card';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ProblemsScreen() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const {
    data: problems,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['problems', user?.id],
    queryFn: () => (user?.id ? problemService.fetchProblems(user.id) : Promise.resolve([])),
    enabled: !!user?.id,
  });

  const filteredProblems = (problems || []).filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const handleAddProblem = async () => {
    if (!user?.id || !newTitle) return;
    await problemService.addProblem(user.id, {
      title: newTitle,
      topic: newTopic || 'General',
      difficulty: 'Medium',
      platform: 'LeetCode',
      notes: newNotes,
    });
    setShowAddModal(false);
    setNewTitle('');
    setNewTopic('');
    setNewNotes('');
    refetch();
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return colors.status.success;
      case 'Hard':
        return colors.status.danger;
      case 'Medium':
      default:
        return colors.status.warning;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Problem Library</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Plus size={20} color="#000000" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search problems..."
        />
        <ScrollViewHorizontalFilter
          selected={selectedDifficulty}
          onSelect={setSelectedDifficulty}
        />
      </View>

      {isLoading ? (
        <View style={styles.listPadding}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : filteredProblems.length === 0 ? (
        <EmptyState
          title="No Problems Found"
          description="Try adjusting your search or add a new problem to your library."
          actionTitle="Add Problem"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <FlatList
          data={filteredProblems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.accent.primary}
            />
          }
          renderItem={({ item }) => (
            <GlassCard style={styles.problemCard}>
              <View style={styles.cardHeader}>
                <Code2 size={20} color={colors.accent.primary} />
                <Text style={styles.problemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <View
                  style={[
                    styles.diffBadge,
                    { backgroundColor: `${getDifficultyColor(item.difficulty)}20` },
                  ]}
                >
                  <Text style={[styles.diffText, { color: getDifficultyColor(item.difficulty) }]}>
                    {item.difficulty}
                  </Text>
                </View>
              </View>

              {item.notes ? (
                <Text style={styles.notesText} numberOfLines={2}>
                  {item.notes}
                </Text>
              ) : null}

              <View style={styles.cardFooter}>
                <Text style={styles.platformText}>{item.platform || 'LeetCode'}</Text>
                <Text style={styles.dateText}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>
            </GlassCard>
          )}
        />
      )}

      {/* Add Problem BottomSheet */}
      <BottomSheet
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Solved Problem"
      >
        <Input
          label="Problem Title"
          placeholder="e.g. Two Sum"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <Input
          label="Topic / Category"
          placeholder="e.g. Arrays & Hashing"
          value={newTopic}
          onChangeText={setNewTopic}
        />
        <Input
          label="Personal Notes / Approach"
          placeholder="Key insights, time complexity..."
          multiline
          numberOfLines={3}
          value={newNotes}
          onChangeText={setNewNotes}
        />
        <Button
          title="Save Problem"
          onPress={handleAddProblem}
          variant="primary"
          size="lg"
          style={{ marginTop: 12 }}
        />
      </BottomSheet>
    </SafeAreaView>
  );
}

function ScrollViewHorizontalFilter({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (val: string) => void;
}) {
  const options = ['All', 'Easy', 'Medium', 'Hard'];

  return (
    <View style={styles.filterRow}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.filterChip, selected === opt ? styles.activeFilterChip : null]}
          onPress={() => onSelect(opt)}
        >
          <Text
            style={[styles.filterChipText, selected === opt ? styles.activeFilterChipText : null]}
          >
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: '800',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: -4,
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  activeFilterChip: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  filterChipText: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  activeFilterChipText: {
    color: '#000000',
  },
  listPadding: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  problemCard: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  problemTitle: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  diffText: {
    fontSize: 11,
    fontWeight: '700',
  },
  notesText: {
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    paddingTop: 8,
  },
  platformText: {
    color: colors.text.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  dateText: {
    color: colors.text.muted,
    fontSize: 12,
  },
});
