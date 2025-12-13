'use client';

import Link from 'next/link';
import styles from './CoinList.module.css';
import { currencyAPI, Currency } from '@/services/CurrencyService';
import { useEffect, useState } from 'react';

export default function CoinList() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await currencyAPI.getAll();
        setCurrencies(data);
      } catch (err) {
        setError('Não foi possível carregar as moedas. O backend está rodando?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  if (loading) return <div className="p-4 text-white">Carregando...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="overflow-hidden rounded-lg shadow-lg bg-gray-900">
      <div className={styles.table}>
        {currencies.map((currency) => (
          <div key={currency.id} className={styles.row}>
            <div className="flex items-center space-x-3">
              <span className={styles.cellSymbol}>{currency.symbol || currency.name}</span>
              <span className={styles.cellName}>{currency.name}</span>
            </div>
            <div className="flex items-center">
              <Link
                href={`/currency/${currency.id}`}
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