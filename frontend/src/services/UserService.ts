// src/services/UserService.ts
import { apiClient } from './apiClient';
import { userAPI } from './API';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  photo?: string;
  password?: string; // Adicionado para compatibilidade com o formulário
}

export const userService = {
  async getUsers(): Promise<User[]> {
    const { data, error } = await apiClient.get<User[]>(userAPI.getAll());
    if (error) throw new Error(error);
    return data || [];
  },

  async getUserById(id: number): Promise<User> {
    const { data, error } = await apiClient.get<User>(userAPI.getById(id));
    if (error || !data) {
      throw new Error(error || 'Usuário não encontrado');
    }
    return data;
  },

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const { password, ...dataToUpdate } = userData;
    const payload = password ? userData : dataToUpdate;

    const { data, error } = await apiClient.put<User>(userAPI.edit(id), payload);
    if (error || !data) {
      throw new Error(error || 'Falha ao atualizar usuário');
    }
    return data;
  },

  async deleteUser(id: number): Promise<void> {
    const { error } = await apiClient.delete(userAPI.delete(id));
    if (error) {
      throw new Error(error);
    }
  },

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const { data, error } = await apiClient.post<User>(userAPI.create(), userData);
    if (error || !data) {
      throw new Error(error || 'Falha ao criar usuário');
    }
    return data;
  }
};

export default userService;