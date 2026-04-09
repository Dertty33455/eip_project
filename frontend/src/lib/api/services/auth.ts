/**
 * Authentication API Service
 */

import apiClient from './client';
import { API_ENDPOINTS } from './config';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  phone?: string;
  role?: 'USER' | 'SELLER' | 'ADMIN';
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  country?: string;
  phone?: string;
  role: 'USER' | 'SELLER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isVerifiedSeller: boolean;
  createdAt: string;
  updatedAt: string;
}

export const authService = {
  // Register new user
  register: (payload: RegisterPayload) =>
    apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload),

  // Login user
  login: (payload: LoginPayload) =>
    apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload),

  // Get current user
  getMe: () =>
    apiClient.get<{ user: User; subscription?: any }>(API_ENDPOINTS.AUTH.ME),

  // Logout user
  logout: () =>
    apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {}),

  // Update profile
  updateProfile: (data: Partial<User>) =>
    apiClient.patch(API_ENDPOINTS.AUTH.PROFILE, data),

  // Get user activities
  getActivities: (params?: any) =>
    apiClient.get(API_ENDPOINTS.AUTH.ACTIVITIES, { params }),

  // Log activity
  logActivity: (data: any) =>
    apiClient.post(API_ENDPOINTS.AUTH.ACTIVITIES, data),

  // Request verification token
  requestVerificationToken: (type: 'EMAIL' | 'PHONE' | 'PASSWORD_RESET') =>
    apiClient.post(`${API_ENDPOINTS.AUTH.VERIFICATION_TOKENS}request_verification/`, { type }),

  // Verify token
  verifyToken: (token: string) =>
    apiClient.post(`${API_ENDPOINTS.AUTH.VERIFICATION_TOKENS}verify_token/`, { token }),

  // Check if token is valid
  isTokenValid: (token: string) =>
    apiClient.get(`${API_ENDPOINTS.AUTH.VERIFICATION_TOKENS}is_valid/`, { params: { token } }),
};
