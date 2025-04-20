'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authAPI } from '@/services/API';
import { toast } from 'react-toastify';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Sempre que a rota mudar (ou na montagem inicial),
  // buscamos o "user" no localStorage e atualizamos o estado
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [pathname]);

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
      toast.success('Logout realizado com sucesso!');
    } catch {
      toast.error('Falha ao realizar logout.');
    } finally {
      // removemos os dados e navegamos sem recarregar
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      router.push('/users'); 
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
            <span>Bem‑vindo, {user.name}</span>
            <button onClick={handleLogout} className={styles.linkButton}>
              Sair
            </button>
          </>
        ) : (
          <>
            <Link href="/users/create" className={styles.linkButton}>
              Cadastre‑se
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
