import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile } from '@/types';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isOnboarded: boolean;
  setAuth: (user: User | null, session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setOnboarded: (onboarded: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isOnboarded: false,
  setAuth: (user, session) => set({ user, session }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  setOnboarded: (isOnboarded) => set({ isOnboarded }),
  clearAuth: () => set({ user: null, session: null, profile: null }),
}));
