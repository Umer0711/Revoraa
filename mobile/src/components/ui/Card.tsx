import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/spacing';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const GlassCard: React.FC<CardProps> = ({ children, style, onPress }) => {
  const content = <View style={[styles.glassCard, style]}>{children}</View>;

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  highlightColor?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  highlightColor = colors.accent.primary,
  style,
  onPress,
}) => {
  return (
    <GlassCard style={[styles.statCard, style]} onPress={onPress}>
      <View style={styles.statHeader}>
        <Text style={styles.statTitle}>{title}</Text>
        {icon && <View style={styles.statIcon}>{icon}</View>}
      </View>
      <Text style={[styles.statValue, { color: highlightColor }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  glassCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border.default,
    padding: 16,
    overflow: 'hidden',
  },
  statCard: {
    flex: 1,
    minWidth: 140,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statTitle: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: '500',
  },
  statIcon: {
    opacity: 0.9,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 2,
  },
  statSubtitle: {
    color: colors.text.muted,
    fontSize: 11,
  },
});
