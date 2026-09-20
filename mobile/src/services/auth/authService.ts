import { supabase } from '@/lib/supabase/client';
import { UserProfile } from '@/types';
import { User, Session } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

export const authService = {
  async fetchProfile(authId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_id', authId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      return data as UserProfile | null;
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      return null;
    }
  },

  async signInWithEmail(
    email: string,
    password: string,
  ): Promise<{ user: User | null; session: Session | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { user: null, session: null, error };
      return { user: data.user, session: data.session, error: null };
    } catch (err: any) {
      return { user: null, session: null, error: err };
    }
  },

  async signUpWithEmail(
    email: string,
    password: string,
    fullName?: string,
  ): Promise<{ user: User | null; session: Session | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) return { user: null, session: null, error };
      return { user: data.user, session: data.session, error: null };
    } catch (err: any) {
      return { user: null, session: null, error: err };
    }
  },

  async signInWithProvider(provider: 'google' | 'github'): Promise<{ error: Error | null }> {
    try {
      const redirectUrl = Linking.createURL('auth/callback');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) return { error };

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        if (result.type === 'success' && result.url) {
          const urlObj = new URL(result.url);
          const params = new URLSearchParams(urlObj.hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken && refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          }
        }
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  },

  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  },

  async resetPassword(email: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  },

  async getSession(): Promise<{ user: User | null; session: Session | null }> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return {
      user: session?.user ?? null,
      session,
    };
  },
};
