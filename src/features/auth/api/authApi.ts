import { apiClient } from '@/services/apiClient';
import {
  AuthCredentials,
  RegisterPayload,
  OTPVerificationPayload,
  AuthResponse,
  OTPResponse,
  User,
  PasswordResetRequestPayload,
  PasswordResetVerifyPayload,
  PasswordResetCompletePayload,
  PasswordResetResponse,
  SetPinPayload,
  SetPinResponse,
  UploadPicturePayload,
  UploadPictureResponse,
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

  // Password Reset Methods

  async requestPasswordOtp(payload: PasswordResetRequestPayload): Promise<PasswordResetResponse> {
    try {
      const response = await apiClient.post<PasswordResetResponse>(
        AUTH_ENDPOINTS.REQUEST_PASSWORD_OTP,
        payload
      );
      return response.data!;
    } catch (error) {
      console.error('Password OTP request failed:', error);
      throw error;
    }
  }

  async verifyPasswordOtp(payload: PasswordResetVerifyPayload): Promise<PasswordResetResponse> {
    try {
      const response = await apiClient.post<PasswordResetResponse>(
        AUTH_ENDPOINTS.VERIFY_PASSWORD_OTP,
        payload
      );
      return response.data!;
    } catch (error) {
      console.error('Password OTP verification failed:', error);
      throw error;
    }
  }

  async resetPassword(payload: PasswordResetCompletePayload): Promise<PasswordResetResponse> {
    try {
      const response = await apiClient.post<PasswordResetResponse>(
        AUTH_ENDPOINTS.RESET_PASSWORD,
        payload
      );
      return response.data!;
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  }

  // Profile Methods

  async uploadProfilePicture(payload: UploadPicturePayload): Promise<UploadPictureResponse> {
    try {
      const formData = new FormData();
      formData.append('file', payload.file);

      const response = await apiClient.post<UploadPictureResponse>(
        AUTH_ENDPOINTS.UPLOAD_PROFILE_PICTURE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data!;
    } catch (error) {
      console.error('Profile picture upload failed:', error);
      throw error;
    }
  }

  async setPin(payload: SetPinPayload): Promise<SetPinResponse> {
    try {
      const response = await apiClient.put<SetPinResponse>(
        AUTH_ENDPOINTS.SET_PIN,
        payload
      );
      return response.data!;
    } catch (error) {
      console.error('Set PIN failed:', error);
      throw error;
    }
  }
}

export const authApiService = new AuthApiService();

export default authApiService;
