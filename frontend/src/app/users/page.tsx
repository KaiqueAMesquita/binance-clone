'use client';

import { useState, useEffect } from 'react';
import UserList from './components/UserList';
import styles from './page.module.css';
import { userService, User } from '@/services/UserService';
import { useAuth } from '@/contexts/AuthContext';

export default function UsersPage() {
  const { isAuthenticated } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (err) {
        setError('Falha ao carregar usuários');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <p>Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <UserList users={users} />
        )}
      </div>
    </div>
  );
}
