'use client';

import { useEffect, useState } from 'react';
import userService, { User } from '@/services/UserService';
import UserList from './components/UserList';
import styles from './page.module.css';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Erro ao buscar os usuários', error);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <UserList />
      </div>
    </div>
  );
}