'use client';

import { useEffect, useState } from 'react';
import { userAPI } from '@/services/API';
import { toast } from 'react-toastify';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import styles from './UserList.module.css';

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  photo?: string;
};

export default function UserList() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(userAPI.getAll());
      const data = await response.json();
      setUsers(data);
    } catch {
      toast.error('Erro ao buscar os usuários.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      await fetch(userAPI.delete(id), { method: 'DELETE' });
      toast.success('Usuário excluído com sucesso! 🗑');
      setUsers(users.filter((user) => user.id !== id));
    } catch {
      toast.error('Erro ao excluir o usuário.');
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
          {users.map((user) => (
            <li key={user.id} className={styles.item}>
              <span>{user.name}</span>
              <div className={styles.actions}>
                <button onClick={() => handleEdit(user.id)} className={styles.editBtn}>
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(user.id)} className={styles.deleteBtn}>
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