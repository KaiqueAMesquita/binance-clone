'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';
import { userAPI, authAPI } from '@/services/API';
import { toast } from 'react-toastify';
import styles from './page.module.css';

type JWTPayload = {
  sub?: string;
  nameid?: string;
};

type UserProfile = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  photo?: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Você precisa estar logado.');
      return router.push('/login');
    }

    let userId: string | undefined;
    try {
      const decoded: JWTPayload = jwtDecode(token);
      userId = decoded.nameid || decoded.sub;
      if (!userId) throw new Error();
    } catch {
      toast.error('Token inválido.');
      return router.push('/login');
    }

    fetch(userAPI.getById(userId), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: UserProfile) => setProfile(data))
      .catch(() => toast.error('Erro ao carregar perfil.'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className={styles.container}><p>Carregando perfil…</p></div>;
  if (!profile) return <div className={styles.container}><p>Perfil não encontrado.</p></div>;

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Olá, {profile.name}</h1>
        <img
          src={profile.photo || '/avatar-placeholder.png'}
          alt={profile.name}
          className={styles.photo}
          onError={(e) => { e.currentTarget.src = '/avatar-placeholder.png'; }}
        />
        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span className={styles.label}>ID:</span>
            <span className={styles.value}>{profile.id}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>E-mail:</span>
            <span className={styles.value}>{profile.email}</span>
          </div>
          {profile.phone && (
            <div className={styles.infoItem}>
              <span className={styles.label}>Telefone:</span>
              <span className={styles.value}>{profile.phone}</span>
            </div>
          )}
          {profile.address && (
            <div className={styles.infoItem}>
              <span className={styles.label}>Endereço:</span>
              <span className={styles.value}>{profile.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}