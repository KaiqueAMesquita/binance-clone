import { apiClient } from './apiClient';
import { userAPI } from './API';

export interface User {
    id: number,
    name: string,
    email: string,
    phone: string,
    address: string,
    password: string,
    photo: string,
}

export const userService = {
    async getUsers(): Promise<User[]> {
        const { data, error } = await apiClient.get<User[]>(userAPI.getAll());
        if (error) throw new Error(error);
        return data || [];
    },

    async getUserById(id: number): Promise<User> {
        const { data, error } = await apiClient.get<User>(userAPI.getById(id));
        if (error) throw new Error(error);
        if (!data) throw new Error('Usuário não encontrado');
        return data;
    },

    async updateUser(id: number, userData: Partial<User>): Promise<User> {
        // Removendo o campo password se estiver vazio para não enviar senha em branco
        const { password, ...dataToUpdate } = userData;
        const payload = password ? userData : dataToUpdate;

        const { data, error } = await apiClient.put<User>(userAPI.edit(id), payload);
        if (error) throw new Error(error);
        if (!data) throw new Error('Falha ao atualizar usuário');
        return data;
    },

    async deleteUser(id: number): Promise<void> {
        const { error } = await apiClient.delete(userAPI.delete(id));
        if (error) throw new Error(error);
    }
};

export default userService