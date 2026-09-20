import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/spacing';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  const getContainerStyle = (): ViewStyle => {
    let base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.button,
    };

    switch (size) {
      case 'sm':
        base.paddingVertical = 8;
        base.paddingHorizontal = 14;
        break;
      case 'lg':
        base.paddingVertical = 16;
        base.paddingHorizontal = 24;
        break;
      case 'md':
      default:
        base.paddingVertical = 12;
        base.paddingHorizontal = 18;
        break;
    }

    switch (variant) {
      case 'secondary':
        base.backgroundColor = colors.background.surface;
        base.borderWidth = 1;
        base.borderColor = colors.border.default;
        break;
      case 'danger':
        base.backgroundColor = colors.status.danger;
        break;
      case 'outline':
        base.backgroundColor = 'transparent';
        base.borderWidth = 1;
        base.borderColor = colors.accent.primary;
        break;
      case 'ghost':
        base.backgroundColor = 'transparent';
        break;
      case 'primary':
      default:
        base.backgroundColor = colors.accent.primary;
        break;
    }

    if (disabled || loading) {
      base.opacity = 0.5;
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    let base: TextStyle = {
      fontWeight: '600',
    };

    switch (size) {
      case 'sm':
        base.fontSize = 13;
        break;
      case 'lg':
        base.fontSize = 17;
        break;
      case 'md':
      default:
        base.fontSize = 15;
        break;
    }

    switch (variant) {
      case 'secondary':
      case 'outline':
      case 'ghost':
        base.color = colors.text.primary;
        break;
      case 'danger':
      case 'primary':
      default:
        base.color = '#000000';
        break;
    }

    return base;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#000000' : colors.text.primary}
        />
      ) : (
        <>
          {leftIcon ? <React.Fragment>{leftIcon}</React.Fragment> : null}
          <Text
            style={[
              getTextStyle(),
              leftIcon ? { marginLeft: 8 } : null,
              rightIcon ? { marginRight: 8 } : null,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon ? <React.Fragment>{rightIcon}</React.Fragment> : null}
        </>
      )}
    </TouchableOpacity>
  );
};
