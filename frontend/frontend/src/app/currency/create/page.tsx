'use client';

import CurrencyForm from '../components/CurrencyForm';
import styles from './page.module.css';

export default function CurrencyCreatePage() {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Cadastrar Moeda</h1>
        <CurrencyForm />
      </div>
    </div>
  );
}