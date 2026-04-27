/**
 * Auth API Service - Auth domain API calls
 * No UI logic, pure API communication
 * 
 * SOLID: Single Responsibility - Only handles auth API calls
 * Dependency Inversion - Uses apiClient abstraction
 */

import { apiClient } from '@/services/apiClient';
import {
  AuthCredentials,
  RegisterPayload,
  OTPVerificationPayload,
  AuthResponse,
  OTPResponse,
  User,
} from '@/types';
import {
  AUTH_ENDPOINTS,
} from '@/constants';

/**
 * Auth API Service - All auth-related API calls
 */
class AuthApiService {
  /**
   * Register new user
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, payload);
    return response.data!;
  }

  /**
   * Login with credentials
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
    return response.data!;
  }

  /**
   * Verify OTP after registration
   */
  async verifyOtp(payload: OTPVerificationPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      AUTH_ENDPOINTS.VERIFY_OTP,
      payload
    );
    return response.data!;
  }

  /**
   * Resend OTP code
   */
  async resendOtp(email: string): Promise<OTPResponse> {
    const response = await apiClient.post<OTPResponse>(AUTH_ENDPOINTS.RESEND_OTP, {
      email,
    });
    return response.data!;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>(AUTH_ENDPOINTS.GET_PROFILE);
    return response.data!;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>(AUTH_ENDPOINTS.UPDATE_PROFILE, data);
    return response.data!;
  }

  /**
   * Logout (invalidate tokens on backend)
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Even if logout fails, we'll clear local tokens
      console.error('Logout failed:', error);
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await apiClient.post<{
      accessToken: string;
      refreshToken: string;
    }>('/auth/refresh-token', { refreshToken });
    return response.data!;
  }
}

export const authApiService = new AuthApiService();

export default authApiService;
