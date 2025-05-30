'use client';

import Link from 'next/link';
import styles from './CoinList.module.css';
import { currencyAPI } from '@/services/CurrencyService';

export default function CoinList() {
  return (
    <div className="overflow-hidden rounded-lg shadow-lg bg-gray-900">
      <div className={styles.table}>
        {(currencyAPI.getAll()).map((currency: any) => (
          <div key={currency.symbol} className={styles.row}>
            <div className="flex items-center space-x-3">
              <span className={styles.cellSymbol}>{currency.symbol}</span>
              <span className={styles.cellName}>{currency.name}</span>
            </div>
            <div className="flex items-center">
              <span className={styles.cellPrice}>${ currency.price}</span>
              <Link
                href={`/currency/${currency.symbol}`}
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
