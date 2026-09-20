import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Map, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { GlassCard } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { SearchInput } from '@/components/ui/Input';

const DSA_TOPICS = [
  {
    id: 'arrays',
    title: 'Arrays & Hashing',
    patternsCount: 6,
    solved: 12,
    total: 15,
    patterns: ['Two Pointers', 'Sliding Window', 'Prefix Sum', 'Frequency Map'],
  },
  {
    id: 'two-pointers',
    title: 'Two Pointers',
    patternsCount: 4,
    solved: 8,
    total: 10,
    patterns: ['Fast & Slow Pointers', 'Left & Right Pointers', 'Subarray Sum'],
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    patternsCount: 5,
    solved: 7,
    total: 12,
    patterns: ['Fixed Size Window', 'Dynamic Window', 'Longest Substring'],
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    patternsCount: 4,
    solved: 9,
    total: 14,
    patterns: ['Search Range', 'Rotated Array', 'Search Matrix'],
  },
  {
    id: 'trees',
    title: 'Trees & Graphs',
    patternsCount: 8,
    solved: 15,
    total: 25,
    patterns: ['BFS Traversal', 'DFS Traversal', 'Topological Sort', 'Dijkstra'],
  },
  {
    id: 'dp',
    title: 'Dynamic Programming',
    patternsCount: 7,
    solved: 6,
    total: 20,
    patterns: ['0/1 Knapsack', 'Unbounded Knapsack', 'Fibonacci Sequence', 'LCS'],
  },
];

export default function AtlasScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredTopics = DSA_TOPICS.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Map size={24} color={colors.accent.primary} />
          <Text style={styles.title}>DSA Atlas</Text>
        </View>
        <Text style={styles.subtitle}>
          Structured mastery roadmap across core DSA patterns and algorithms.
        </Text>
      </View>

      <View style={styles.searchBox}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search topics or patterns..."
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredTopics.map((topic) => {
          const progressPercent = Math.round((topic.solved / topic.total) * 100);
          const isExpanded = expandedId === topic.id;

          return (
            <GlassCard key={topic.id} style={styles.topicCard}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setExpandedId(isExpanded ? null : topic.id)}
                style={styles.topicHeader}
              >
                <ProgressRing
                  size={52}
                  strokeWidth={5}
                  progress={progressPercent}
                  color={progressPercent > 75 ? colors.status.success : colors.accent.primary}
                />

                <View style={styles.topicInfo}>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Text style={styles.topicMeta}>
                    {topic.solved} / {topic.total} Solved • {topic.patternsCount} Patterns
                  </Text>
                </View>

                <ChevronRight
                  size={20}
                  color={colors.text.secondary}
                  style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.patternsContainer}>
                  <Text style={styles.patternsHeader}>Key Patterns:</Text>
                  {topic.patterns.map((pat, idx) => (
                    <View key={idx} style={styles.patternRow}>
                      <CheckCircle2 size={16} color={colors.accent.primary} />
                      <Text style={styles.patternName}>{pat}</Text>
                    </View>
                  ))}
                </View>
              )}
            </GlassCard>
          );
        })}
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
  searchBox: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  topicCard: {
    marginBottom: 12,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  topicMeta: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  patternsContainer: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  patternsHeader: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  patternRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  patternName: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
