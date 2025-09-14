// src/services/AuthService.ts
import { apiClient } from './apiClient';
import { authAPI } from './API';

export interface User {
  id: number;
  name: string;
  email: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data, error } = await apiClient.post<LoginResponse>(authAPI.login(), { email, password });
    
    if (error || !data) {
      throw new Error(error || 'Falha no login');
    }

    // Store token and user data in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  },

  logout(): void {
    // Clear token and user data from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  }
};