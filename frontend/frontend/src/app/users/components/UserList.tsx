'use client';

import { useEffect, useState } from 'react';
import { userAPI } from '@/services/API';
import { toast } from 'react-toastify';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import styles from './UserList.module.css';

type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  photo?: string;
};

interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
  const router = useRouter();
  const [localUsers, setLocalUsers] = useState<User[]>([]);

  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(userAPI.getAll());
      const data = await response.json();
      setLocalUsers(data);
    } catch {
      toast.error('Erro ao buscar os usuários.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        toast.error('Sessão expirada. Por favor, faça login novamente.');
        router.push('/login');
        return;
      }

      const response = await fetch(userAPI.delete(id), { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir o usuário');
      }

      toast.success('Usuário excluído com sucesso! 🗑');
      setLocalUsers(localUsers.filter((user) => user.id !== Number(id)));
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir o usuário. Tente novamente.');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/users/edit/${id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Lista de Usuários</h1>
        <ul className={styles.list}>
          {localUsers.map((user) => (
            <li key={user.id} className={styles.item}>
              <span>{user.name}</span>
              <div className={styles.actions}>
                <button onClick={() => handleEdit(user.id.toString())} className={styles.editBtn}>
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(user.id.toString())} className={styles.deleteBtn}>
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}