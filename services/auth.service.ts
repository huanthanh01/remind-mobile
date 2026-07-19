/**
 * Auth service – mirrors web AuthController.ts.
 * Uses SecureStore instead of localStorage.
 */

import { apiHelper, setToken, getToken, removeToken, clearAuthTokens, TokenKeys } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type { UserDto, AuthResponse } from '../stores/types';

export const AuthService = {
  /** Login with email and password */
  async login(identifier: string, password: string): Promise<AuthResponse> {
    try {
      const data = await apiHelper.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
        email: identifier,
        password,
      });

      if (data && (data as AuthResponse).accessToken) {
        const resp = data as AuthResponse;
        await setToken(TokenKeys.ACCESS, resp.accessToken);
        await setToken(TokenKeys.REFRESH, resp.refreshToken);
        await setToken(TokenKeys.USER, JSON.stringify(resp.user));
      }

      return data as AuthResponse;
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error ||
        'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      throw new Error(errorMsg);
    }
  },

  /** Register a new account */
  async register(
    fullName: string,
    email: string,
    password: string,
    role: 'student' | 'expert' = 'student',
  ): Promise<AuthResponse> {
    try {
      const data = await apiHelper.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        role,
      });

      if (data && (data as AuthResponse).accessToken) {
        const resp = data as AuthResponse;
        await setToken(TokenKeys.ACCESS, resp.accessToken);
        await setToken(TokenKeys.REFRESH, resp.refreshToken);
        await setToken(TokenKeys.USER, JSON.stringify(resp.user));
      }

      return data as AuthResponse;
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error || 'Đăng ký thất bại. Vui lòng thử lại.';
      throw new Error(errorMsg);
    }
  },

  /** Logout */
  async logout(): Promise<void> {
    try {
      const refreshToken = await getToken(TokenKeys.REFRESH);
      if (refreshToken) {
        await apiHelper.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
      }
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    } finally {
      await clearAuthTokens();
    }
  },

  /** Get current user from SecureStore */
  async getCurrentUser(): Promise<UserDto | null> {
    const userJson = await getToken(TokenKeys.USER);
    try {
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  },

  /** Check if authenticated */
  async isAuthenticated(): Promise<boolean> {
    const token = await getToken(TokenKeys.ACCESS);
    return !!token;
  },

  /** Forgot password – request OTP */
  async forgotPassword(email: string): Promise<unknown> {
    try {
      return await apiHelper.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error ||
        'Gửi yêu cầu thất bại. Vui lòng kiểm tra lại email.';
      throw new Error(errorMsg);
    }
  },

  /** Reset password with OTP */
  async resetPassword(
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<unknown> {
    try {
      return await apiHelper.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        email,
        otp,
        newPassword,
      });
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error ||
        'Đặt lại mật khẩu thất bại. Vui lòng thử lại.';
      throw new Error(errorMsg);
    }
  },
};
