'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import styles from './page.module.css';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Iniciando login...');

    try {
      console.log('Chamando login com:', { email });
      const result = await login(email, password);
      console.log('Resposta do login:', result);
      
      if (result?.user && result?.token) {
        console.log('Login bem-sucedido, redirecionando...');
        toast.success('Login realizado com sucesso!');
        window.location.href = '/users';
      } else {
        console.error('Resposta de login inválida:', result);
        toast.error('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Falha no login. Verifique suas credenciais.');
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
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
