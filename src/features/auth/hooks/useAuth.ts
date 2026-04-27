/**
 * Auth Hooks - React Query hooks for auth operations
 * Manages async auth operations and their state
 *
 * SOLID: Single Responsibility - Only handles auth data fetching
 * No UI logic, pure hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import authApiService from '../api/authApi';
import { useAuthStore } from '../store';
import {
  AuthCredentials,
  RegisterPayload,
  OTPVerificationPayload,
  AuthResponse,
  User,
  OTPResponse,
  ApiError,
} from '@/types';
import { QUERY_KEYS } from '@/constants';

/**
 * Hook: Register new user
 */
export function useRegister() {
  const setUser = useAuthStore((state) => state.setUser);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return useMutation<AuthResponse, ApiError, RegisterPayload>({
    mutationFn: async (payload: RegisterPayload) => authApiService.register(payload),
    onSuccess: (data) => {
      setUser(data.user);
      setTokens(data.tokens);
      setAuthenticated(true);
    },
  });
}

/**
 * Hook: Login user
 */
export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return useMutation<AuthResponse, ApiError, AuthCredentials>({
    mutationFn: async (credentials: AuthCredentials) => authApiService.login(credentials),
    onSuccess: (data) => {
      setUser(data.user);
      setTokens(data.tokens);
      setAuthenticated(true);
    },
  });
}

/**
 * Hook: Verify OTP
 */
export function useVerifyOtp() {
  const setUser = useAuthStore((state) => state.setUser);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return useMutation<AuthResponse, ApiError, OTPVerificationPayload>({
    mutationFn: async (payload: OTPVerificationPayload) => authApiService.verifyOtp(payload),
    onSuccess: (data) => {
      setUser(data.user);
      setTokens(data.tokens);
      setAuthenticated(true);
    },
  });
}

/**
 * Hook: Resend OTP
 */
export function useResendOtp() {
  return useMutation<OTPResponse, ApiError, string>({
    mutationFn: async (email: string) => authApiService.resendOtp(email),
  });
}

/**
 * Hook: Fetch user profile
 */
export function useProfile() {
  return useQuery<User, ApiError>({
    queryKey: QUERY_KEYS.AUTH.PROFILE,
    queryFn: async () => authApiService.getProfile(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook: Update user profile
 */
export function useUpdateProfile() {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation<User, ApiError, Partial<User>>({
    mutationFn: async (data: Partial<User>) => authApiService.updateProfile(data),
    onSuccess: (data) => {
      setUser(data);
      // Invalidate and refetch the profile query
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.PROFILE });
    },
  });
}

/**
 * Hook: Logout
 */
export function useLogout() {
  const logout = useAuthStore((state) => state.logout);

  return useMutation<void, ApiError>({
    mutationFn: async () => authApiService.logout(),
    onSuccess: () => {
      logout();
      // Optional: Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  });
}

/**
 * Hook: Get current auth state
 * Use with useShallow for better performance (React Query best practice)
 */
export function useAuth() {
  return useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
  }));
}

/**
 * Hook: Check if user is authenticated
 */
export function useIsAuthenticated() {
  return useAuthStore((state) => state.isAuthenticated);
}
