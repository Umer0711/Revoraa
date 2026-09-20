import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/auth/authService';
import { colors } from '@/theme/colors';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    },
  },
});

export default function RootLayout() {
  const { setAuth, setProfile, setLoading } = useAuthStore();

  useEffect(() => {
    async function restoreSession() {
      try {
        const { user, session } = await authService.getSession();
        setAuth(user, session);
        if (user) {
          const profile = await authService.fetchProfile(user.id);
          setProfile(profile);
        }
      } catch (e) {
        console.error('Session restore failed:', e);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, [setAuth, setProfile, setLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background.primary },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="interview" options={{ headerShown: false }} />
        <Stack.Screen name="analytics" options={{ headerShown: false }} />
        <Stack.Screen name="achievements" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
