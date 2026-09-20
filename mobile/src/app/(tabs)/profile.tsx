import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  User,
  Zap,
  Coins,
  Award,
  LogOut,
  Bell,
  Shield,
  HelpCircle,
  Info,
  Sparkles,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/auth/authService';
import { GlassCard, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ProfileScreen() {
  const { user, profile, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await authService.signOut();
    clearAuth();
    setLoading(false);
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Revoraa User';
  const email = user?.email || 'user@example.com';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Profile Info */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarBox}>
            <User size={36} color={colors.accent.primary} />
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsRow}>
          <StatCard
            title="Total XP"
            value={profile?.xp || 0}
            icon={<Zap size={20} color={colors.accent.primary} />}
            highlightColor={colors.accent.primary}
          />
          <StatCard
            title="Coins"
            value={profile?.coins || 0}
            icon={<Coins size={20} color={colors.accent.secondaryGold} />}
            highlightColor={colors.accent.secondaryGold}
          />
        </View>

        {/* Settings Options */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account & Settings</Text>

          <SettingRow
            icon={<Bell size={18} color={colors.text.secondary} />}
            label="Notification Preferences"
            onPress={() => {}}
          />
          <SettingRow
            icon={<Shield size={18} color={colors.text.secondary} />}
            label="Privacy & Security"
            onPress={() => {}}
          />
          <SettingRow
            icon={<HelpCircle size={18} color={colors.text.secondary} />}
            label="Help & Support"
            onPress={() => {}}
          />
          <SettingRow
            icon={<Info size={18} color={colors.text.secondary} />}
            label="About Revoraa Mobile"
            subtitle="v1.0.0 (Expo SDK 57)"
            onPress={() => {}}
          />
        </GlassCard>

        {/* Logout Action */}
        <Button
          title="Log Out"
          onPress={handleLogout}
          loading={loading}
          variant="danger"
          size="lg"
          leftIcon={<LogOut size={20} color="#000000" />}
          style={styles.logoutBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({
  icon,
  label,
  subtitle,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.settingRow} onPress={onPress}>
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        {subtitle && <Text style={styles.settingSub}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.card,
    borderWidth: 2,
    borderColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  email: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  sectionCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  settingSub: {
    color: colors.text.muted,
    fontSize: 12,
    marginTop: 2,
  },
  logoutBtn: {
    marginTop: 8,
  },
});
