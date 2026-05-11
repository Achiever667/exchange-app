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
  PasswordResetRequestPayload,
  PasswordResetVerifyPayload,
  PasswordResetCompletePayload,
  PasswordResetResponse,
  SetPinPayload,
  SetPinResponse,
  UploadPicturePayload,
  UploadPictureResponse,
  ResendOtpPayload,
} from '@/types';
import { QUERY_KEYS } from '@/constants';


export function useRegister() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<AuthResponse, ApiError, RegisterPayload>({
    mutationFn: async (payload: RegisterPayload) =>
      authApiService.register(payload),

    onSuccess: (data) => {
      setUser(data.user);

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
  setUser(data.user);
  if (data.tokens) {
    setTokens(data.tokens);
    setAuthenticated(true);
  }
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
      if (data.tokens) {
    setTokens(data.tokens);
    setAuthenticated(true);
  }
    },
  });
}


export function useResendOtp() {
  return useMutation<OTPResponse, ApiError, ResendOtpPayload>({
    mutationFn: async (payload: ResendOtpPayload) => authApiService.resendOtp(payload),
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

// Password Reset Hooks

export function useRequestPasswordOtp() {
  return useMutation<PasswordResetResponse, ApiError, PasswordResetRequestPayload>({
    mutationFn: async (payload: PasswordResetRequestPayload) => authApiService.requestPasswordOtp(payload),
  });
}


export function useVerifyPasswordOtp() {
  return useMutation<PasswordResetResponse, ApiError, PasswordResetVerifyPayload>({
    mutationFn: async (payload: PasswordResetVerifyPayload) => authApiService.verifyPasswordOtp(payload),
  });
}


export function useResetPassword() {
  return useMutation<PasswordResetResponse, ApiError, PasswordResetCompletePayload>({
    mutationFn: async (payload: PasswordResetCompletePayload) => authApiService.resetPassword(payload),
  });
}


// Profile Hooks

export function useUploadProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation<UploadPictureResponse, ApiError, UploadPicturePayload>({
    mutationFn: async (payload: UploadPicturePayload) => authApiService.uploadProfilePicture(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.PROFILE });
    },
  });
}


export function useSetPin() {
  return useMutation<SetPinResponse, ApiError, SetPinPayload>({
    mutationFn: async (payload: SetPinPayload) => authApiService.setPin(payload),
  });
}
