// src/services/apiClient.ts
import { authAPI } from './API';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private async request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // Obter o token do localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // Configurar cabeçalhos
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    
    // Adicionar token de autenticação, se disponível
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Verificar se a URL já é absoluta (começa com http)
    const isAbsoluteUrl = url.startsWith('http');
    const requestUrl = isAbsoluteUrl ? url : `${process.env.NEXT_PUBLIC_USER_API || 'http://localhost:5294/api'}${url}`;

    try {
      console.log('Fazendo requisição para:', requestUrl); // Para debug
      const response = await fetch(requestUrl, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Erro na requisição');
      }

      // Se a resposta for 204 (No Content), retornar vazio
      if (response.status === 204) {
        return {};
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Erro na requisição:', error);
      return { 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }

  // Métodos HTTP
  public async get<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'GET' });
  }

  public async post<T>(url: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  public async put<T>(url: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  public async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();