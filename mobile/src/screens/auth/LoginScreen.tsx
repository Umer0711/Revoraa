import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Sparkles, Mail, Lock, Code2 } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toast } from '@/components/ui/Toast';
import { authService } from '@/services/auth/authService';
import { useAuthStore } from '@/store/useAuthStore';

export interface LoginScreenProps {
  onNavigateSignup: () => void;
  onNavigateForgotPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateSignup,
  onNavigateForgotPassword,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { setAuth, setProfile } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    const { user, session, error } = await authService.signInWithEmail(email, password);

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (user && session) {
      setAuth(user, session);
      const profileData = await authService.fetchProfile(user.id);
      setProfile(profileData);
    }
    setLoading(false);
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setErrorMsg('');
    setLoading(true);
    const { error } = await authService.signInWithProvider(provider);
    if (error) {
      setErrorMsg(error.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.iconRing}>
              <Sparkles size={32} color={colors.accent.primary} />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your learning journey</Text>
          </View>

          {errorMsg ? (
            <View style={styles.toastBox}>
              <Toast message={errorMsg} type="error" />
            </View>
          ) : null}

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="user@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              leftIcon={<Mail size={18} color={colors.text.secondary} />}
            />

            <Input
              label="Password"
              placeholder="••••••••"
              isPassword
              value={password}
              onChangeText={setPassword}
              leftIcon={<Lock size={18} color={colors.text.secondary} />}
            />

            <TouchableOpacity onPress={onNavigateForgotPassword} style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              variant="primary"
              size="lg"
              style={styles.submitBtn}
            />

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.oauthRow}>
              <Button
                title="GitHub"
                onPress={() => handleOAuth('github')}
                variant="secondary"
                leftIcon={<Code2 size={18} color={colors.text.primary} />}
                style={styles.oauthBtn}
              />
              <Button
                title="Google"
                onPress={() => handleOAuth('google')}
                variant="secondary"
                style={styles.oauthBtn}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={onNavigateSignup}>
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    color: colors.text.primary,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
  },
  toastBox: {
    marginBottom: 16,
  },
  form: {
    width: '100%',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -8,
  },
  forgotText: {
    color: colors.accent.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  submitBtn: {
    width: '100%',
    marginBottom: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.default,
  },
  dividerText: {
    color: colors.text.muted,
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  oauthRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  oauthBtn: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  footerText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  signupText: {
    color: colors.accent.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
