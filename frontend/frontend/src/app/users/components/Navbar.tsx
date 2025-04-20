'use client';

import Link from 'next/link';
import { authAPI } from '@/services/API';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(authAPI.logout(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch {
      // ignore errors
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">Binance Clone</Link>
      </div>
      <div className={styles.links}>
        {user ? (
          <>
            <span>Bem vindo {user.name}</span>
            <button onClick={handleLogout} className={styles.linkButton}>
              Sair
            </button>
          </>
        ) : (
          <>
            <Link href="/users/create" className={styles.linkButton}>
              Cadastre-se
            </Link>
            <Link href="/users/login" className={styles.linkButton}>
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}