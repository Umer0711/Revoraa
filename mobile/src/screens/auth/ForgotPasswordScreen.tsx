import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toast } from '@/components/ui/Toast';
import { authService } from '@/services/auth/authService';

export interface ForgotPasswordScreenProps {
  onNavigateBack: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onNavigateBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setMessage('Please enter your registered email address.');
      setIsError(true);
      return;
    }
    setMessage('');
    setLoading(true);

    const { error } = await authService.resetPassword(email);

    if (error) {
      setMessage(error.message);
      setIsError(true);
    } else {
      setMessage('Password reset instructions sent to your email.');
      setIsError(false);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onNavigateBack} style={styles.backBtn}>
            <ArrowLeft size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your account email and we'll send you instructions to reset your password.
          </Text>

          {message ? (
            <View style={styles.toastBox}>
              <Toast message={message} type={isError ? 'error' : 'success'} />
            </View>
          ) : null}

          <Input
            label="Email"
            placeholder="user@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            leftIcon={<Mail size={18} color={colors.text.secondary} />}
          />

          <Button
            title="Send Reset Instructions"
            onPress={handleResetPassword}
            loading={loading}
            variant="primary"
            size="lg"
            style={styles.submitBtn}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    color: colors.text.primary,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  toastBox: {
    marginBottom: 16,
  },
  submitBtn: {
    marginTop: 8,
  },
});
