'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import InputMask from 'react-input-mask';
import { authAPI } from '@/services/API';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(authAPI.login(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      // Armazena token e info do usuário
      localStorage.setItem('token', data.token);
      // Provisório: extrai nome do email antes do '@'
      const nameFromEmail = email.split('@')[0];
      localStorage.setItem('user', JSON.stringify({ name: nameFromEmail }));
      toast.success('Login realizado com sucesso!');
      router.push('/');
    } catch {
      toast.error('Erro ao efetuar login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className={styles.inputLabel}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Digite o email"
              className={styles.inputField}
            />
          </div>
          <div>
            <label className={styles.inputLabel}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Digite a senha"
              className={styles.inputField}
            />
          </div>
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}