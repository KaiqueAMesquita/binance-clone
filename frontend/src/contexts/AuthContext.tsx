'use client';
import React from 'react';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { authService, User } from '@/services/AuthService';

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ user?: User | null; token: string }>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const userData = authService.getCurrentUser();
      
      // If we have a token but no user data, create a minimal user
      if (token && !userData) {
        const email = 'user@example.com'; // You might want to get this from the token or another source
        const minimalUser = {
          id: 0,
          name: email.split('@')[0],
          email: email
        };
        setUser(minimalUser);
      } else {
        setUser(userData);
      }
      setLoading(false);
    };

    // Add event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuth();
      }
    };

    checkAuth();
    
    // Listen for storage events (for when auth state changes in another tab)
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Iniciando login para:', email);
      const loginResponse = await authService.login(email, password);
      console.log('AuthContext: Resposta do login:', loginResponse);
      
      if (!loginResponse || !loginResponse.token) {
        throw new Error('Resposta de login inválida: token não encontrado');
      }
      
      // If user is null, create a minimal user object
      const user = loginResponse.user || {
        id: 0,
        name: email.split('@')[0],
        email: email
      };
      
      setUser(user);
      console.log('AuthContext: Usuário definido no estado:', user);
      return { ...loginResponse, user };
    } catch (error) {
      console.error('AuthContext: Erro no login:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
