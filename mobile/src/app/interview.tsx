import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Target, ArrowLeft, ExternalLink, CheckCircle2, Building2 } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { GlassCard } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { SearchInput } from '@/components/ui/Input';

const COMPANIES = [
  {
    id: 'google',
    name: 'Google',
    solved: 24,
    total: 35,
    topTopic: 'Arrays & Trees',
    questions: [
      {
        id: 'g1',
        title: 'Median of Two Sorted Arrays',
        difficulty: 'Hard',
        solved: true,
        url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
      },
      {
        id: 'g2',
        title: 'Container With Most Water',
        difficulty: 'Medium',
        solved: true,
        url: 'https://leetcode.com/problems/container-with-most-water/',
      },
      {
        id: 'g3',
        title: 'Word Ladder',
        difficulty: 'Hard',
        solved: false,
        url: 'https://leetcode.com/problems/word-ladder/',
      },
    ],
  },
  {
    id: 'meta',
    name: 'Meta',
    solved: 18,
    total: 28,
    topTopic: 'Binary Search & Graphs',
    questions: [
      {
        id: 'm1',
        title: 'Valid Palindrome',
        difficulty: 'Easy',
        solved: true,
        url: 'https://leetcode.com/problems/valid-palindrome/',
      },
      {
        id: 'm2',
        title: 'Subarray Sum Equals K',
        difficulty: 'Medium',
        solved: false,
        url: 'https://leetcode.com/problems/subarray-sum-equals-k/',
      },
    ],
  },
  {
    id: 'amazon',
    name: 'Amazon',
    solved: 30,
    total: 40,
    topTopic: 'Sliding Window & BFS',
    questions: [
      {
        id: 'a1',
        title: 'LRU Cache',
        difficulty: 'Medium',
        solved: true,
        url: 'https://leetcode.com/problems/lru-cache/',
      },
      {
        id: 'a2',
        title: 'Number of Islands',
        difficulty: 'Medium',
        solved: true,
        url: 'https://leetcode.com/problems/number-of-islands/',
      },
    ],
  },
];

export default function InterviewScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const filteredCompanies = COMPANIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedCompany = COMPANIES.find((c) => c.id === selectedCompanyId);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.headerTitleRow}>
          <Target size={22} color={colors.status.success} />
          <Text style={styles.title}>Interview Readiness</Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search target company..."
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {selectedCompany ? (
          <View>
            <TouchableOpacity onPress={() => setSelectedCompanyId(null)} style={styles.backToGrid}>
              <Text style={styles.backToGridText}>← Back to All Companies</Text>
            </TouchableOpacity>

            <GlassCard style={styles.companyDetailHeader}>
              <Text style={styles.companyDetailName}>{selectedCompany.name}</Text>
              <Text style={styles.companyDetailMeta}>
                Focus: {selectedCompany.topTopic} • {selectedCompany.solved} /{' '}
                {selectedCompany.total} Solved
              </Text>
            </GlassCard>

            <Text style={styles.questionsHeader}>Company Top Questions:</Text>
            {selectedCompany.questions.map((q) => (
              <GlassCard key={q.id} style={styles.questionCard}>
                <View style={styles.questionRow}>
                  <CheckCircle2
                    size={20}
                    color={q.solved ? colors.status.success : colors.text.muted}
                  />
                  <Text style={styles.questionTitle}>{q.title}</Text>

                  <TouchableOpacity onPress={() => Linking.openURL(q.url)} style={styles.linkBtn}>
                    <ExternalLink size={16} color={colors.accent.primary} />
                  </TouchableOpacity>
                </View>
              </GlassCard>
            ))}
          </View>
        ) : (
          <View style={styles.companyGrid}>
            {filteredCompanies.map((company) => {
              const percent = Math.round((company.solved / company.total) * 100);

              return (
                <GlassCard
                  key={company.id}
                  style={styles.companyCard}
                  onPress={() => setSelectedCompanyId(company.id)}
                >
                  <View style={styles.companyHeader}>
                    <Building2 size={24} color={colors.accent.primary} />
                    <Text style={styles.companyName}>{company.name}</Text>
                  </View>

                  <View style={styles.progressRow}>
                    <ProgressRing
                      size={44}
                      strokeWidth={4}
                      progress={percent}
                      color={colors.status.success}
                    />
                    <View style={styles.companyStats}>
                      <Text style={styles.solvedText}>
                        {company.solved} / {company.total}
                      </Text>
                      <Text style={styles.topicText}>{company.topTopic}</Text>
                    </View>
                  </View>
                </GlassCard>
              );
            })}
          </View>
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: '800',
  },
  searchBox: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  companyGrid: {
    gap: 12,
  },
  companyCard: {
    marginBottom: 12,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  companyName: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  companyStats: {
    flex: 1,
  },
  solvedText: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  topicText: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  backToGrid: {
    marginBottom: 12,
  },
  backToGridText: {
    color: colors.accent.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  companyDetailHeader: {
    marginBottom: 16,
  },
  companyDetailName: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  companyDetailMeta: {
    color: colors.text.secondary,
    fontSize: 13,
  },
  questionsHeader: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  questionCard: {
    marginBottom: 10,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  questionTitle: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  linkBtn: {
    padding: 6,
  },
});
