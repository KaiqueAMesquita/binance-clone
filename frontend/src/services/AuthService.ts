// src/services/AuthService.ts
import { apiClient } from './apiClient';
import { authAPI } from './API';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  photo?: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data, error } = await apiClient.post<LoginResponse>(
      authAPI.login(), 
      { email, password }
    );
    
    if (error || !data) {
      throw new Error(error || 'Falha no login');
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(authAPI.logout());
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },

  async refreshToken(): Promise<{ token: string }> {
    const { data, error } = await apiClient.post<{ token: string }>(authAPI.refreshToken());
    if (error || !data) {
      throw new Error(error || 'Falha ao atualizar token');
    }
    return data;
  },

  async getProfile(): Promise<User> {
    const { data, error } = await apiClient.get<User>(authAPI.profile());
    if (error || !data) {
      throw new Error(error || 'Falha ao carregar perfil');
    }
    return data;
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