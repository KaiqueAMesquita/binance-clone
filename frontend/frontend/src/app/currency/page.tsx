'use client';

import CoinList from '@/app/currency/components/CoinList'
import styles from './page.module.css';

export default function CurrencyPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Moedas</h1>
      <CoinList />
    </div>
  );
}
