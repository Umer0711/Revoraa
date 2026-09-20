import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/spacing';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info' }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color={colors.status.success} />;
      case 'error':
        return <AlertCircle size={18} color={colors.status.danger} />;
      case 'info':
      default:
        return <Info size={18} color={colors.accent.primary} />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return colors.status.success;
      case 'error':
        return colors.status.danger;
      case 'info':
      default:
        return colors.accent.primary;
    }
  };

  return (
    <View style={[styles.container, { borderColor: getBorderColor() }]}>
      {getIcon()}
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  text: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
    flex: 1,
  },
});
