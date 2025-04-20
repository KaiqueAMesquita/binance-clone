'use client';

import UserForm from '../components/UserForm';
import styles from './page.module.css';

export default function UserCreatePage() {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Seja Bem Vindo a Binance Clone!</h1>
        <UserForm />
      </div>
    </div>
  );
}