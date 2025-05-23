'use client';

import Link from 'next/link';
import { mockCoins } from '@/app/currency/data';
import styles from './CoinList.module.css';

export default function CoinList() {
  return (
    <div className="overflow-hidden rounded-lg shadow-lg bg-gray-900">
      <div className={styles.table}>
        {mockCoins.map((coin) => (
          <div key={coin.symbol} className={styles.row}>
            <div className="flex items-center space-x-3">
              <span className={styles.cellSymbol}>{coin.symbol}</span>
              <span className={styles.cellName}>{coin.name}</span>
            </div>
            <div className="flex items-center">
              <span className={styles.cellPrice}>${coin.price}</span>
              <Link
                href={`/currency/${coin.symbol}`}
                className={styles.actionBtn}
              >
                Ver
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
