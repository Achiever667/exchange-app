/**
 * Auth Store - Global authentication state management
 * Using Zustand for lightweight, scalable state management
 * 
 * SOLID: Single Responsibility - Only handles auth state
 */

import { create } from 'zustand';
import { User, AuthTokens } from '@/types';
import { STORAGE_KEYS } from '@/constants';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens) => void;
  setAuthenticated: (isAuth: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  hydrate: () => void;
  clearError: () => void;
}

/**
 * Auth Store using Zustand
 * Manages user data, authentication state, and tokens
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setUser: (user) =>
    set(() => {
      if (user && typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      } else if (!user && typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      }
      return { user };
    }),

  setTokens: (tokens) =>
    set(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      }
      return { tokens };
    }),

  setAuthenticated: (isAuth) => set(() => ({ isAuthenticated: isAuth })),

  setLoading: (loading) => set(() => ({ isLoading: loading })),

  setError: (error) => set(() => ({ error })),

  clearError: () => set(() => ({ error: null })),

  logout: () =>
    set(() => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      }
      return {
        user: null,
        tokens: null,
        isAuthenticated: false,
        error: null,
      };
    }),

  hydrate: () => {
    if (typeof window === 'undefined') {
      set({ isLoading: false });
      return;
    }

    try {
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (accessToken && userData && refreshToken) {
        const user = JSON.parse(userData);
        const tokens = {
          accessToken,
          refreshToken,
          expiresIn: 3600, // Default, will be updated on auth
        };

        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to hydrate auth state:', error);
      set({ isLoading: false });
    }
  },
}));
