'use client';

import { useState, useEffect } from 'react';
import UserList from './components/UserList';
import styles from './page.module.css';

export default function UsersPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  if (isLoggedIn === null) {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <p className={styles.message}>
            Faça login para ver a lista de usuários.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <UserList />
      </div>
    </div>
  );
}
