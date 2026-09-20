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
import { User as UserIcon, Mail, Lock } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toast } from '@/components/ui/Toast';
import { authService } from '@/services/auth/authService';
import { useAuthStore } from '@/store/useAuthStore';

export interface SignupScreenProps {
  onNavigateLogin: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ onNavigateLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { setAuth, setProfile } = useAuthStore();

  const handleSignup = async () => {
    if (!email || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    const { user, session, error } = await authService.signUpWithEmail(email, password, fullName);

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (user && session) {
      setAuth(user, session);
      const profileData = await authService.fetchProfile(user.id);
      setProfile(profileData);
    } else {
      setErrorMsg('Signup successful! Please check your email to confirm your account.');
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start mastering DSA and interview prep</Text>
          </View>

          {errorMsg ? (
            <View style={styles.toastBox}>
              <Toast
                message={errorMsg}
                type={errorMsg.includes('successful') ? 'success' : 'error'}
              />
            </View>
          ) : null}

          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={fullName}
              onChangeText={setFullName}
              leftIcon={<UserIcon size={18} color={colors.text.secondary} />}
            />

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
              placeholder="Minimum 8 characters"
              isPassword
              value={password}
              onChangeText={setPassword}
              leftIcon={<Lock size={18} color={colors.text.secondary} />}
            />

            <Button
              title="Create Account"
              onPress={handleSignup}
              loading={loading}
              variant="primary"
              size="lg"
              style={styles.submitBtn}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={onNavigateLogin}>
              <Text style={styles.loginText}>Sign In</Text>
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
  submitBtn: {
    width: '100%',
    marginTop: 8,
    marginBottom: 20,
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
  loginText: {
    color: colors.accent.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
