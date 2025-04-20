'use client';

import UserForm from '../components/UserForm';
import styles from './page.module.css';

export default function UserCreatePage() {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Cadastrar Usuário</h1>
        <UserForm />
      </div>
    </div>
  );
}