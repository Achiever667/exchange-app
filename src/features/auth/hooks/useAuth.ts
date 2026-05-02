import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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


export function useResendOtp() {
  return useMutation<OTPResponse, ApiError, string>({
    mutationFn: async (email: string) => authApiService.resendOtp(email),
  });
}


export function useProfile() {
  return useQuery<User, ApiError>({
    queryKey: QUERY_KEYS.AUTH.PROFILE,
    queryFn: async () => authApiService.getProfile(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}


export function useUpdateProfile() {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation<User, ApiError, Partial<User>>({
    mutationFn: async (data: Partial<User>) => authApiService.updateProfile(data),
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.PROFILE });
    },
  });
}


export function useLogout() {
  const logout = useAuthStore((state) => state.logout);

  return useMutation<void, ApiError>({
    mutationFn: async () => authApiService.logout(),
    onSuccess: () => {
      logout();
      // if (typeof window !== 'undefined') {
      //   window.location.href = '/login';
      // }
    },
  });
}


export function useAuth() {
  return useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
  }));
}


export function useIsAuthenticated() {
  return useAuthStore((state) => state.isAuthenticated);
}
