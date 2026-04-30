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

class AuthApiService {

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
    const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, payload);
    return response.data!;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
      return response.data!;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async verifyOtp(payload: OTPVerificationPayload): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        AUTH_ENDPOINTS.VERIFY_OTP,
        payload
      );
      return response.data!;
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    }
  }

 
  async resendOtp(email: string): Promise<OTPResponse> {
    try {
      const response = await apiClient.post<OTPResponse>(AUTH_ENDPOINTS.RESEND_OTP, {
        email,
      });
      return response.data!;
    } catch (error) {
      console.error('OTP resend failed:', error);
      throw error;
    }
  }


  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<User>(AUTH_ENDPOINTS.GET_PROFILE);
      return response.data!;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  }


  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>(AUTH_ENDPOINTS.UPDATE_PROFILE, data);
      return response.data!;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }


  async logout(): Promise<void> {
    try {
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Even if logout fails, we'll clear local tokens
      console.error('Logout failed:', error);
    }
  }


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
