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

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className="overflow-hidden rounded-lg shadow-lg bg-gray-900">
      <div className={styles.table}>
        {currencies.map((currency) => (
          <div key={currency.id} className={styles.row}>
            <div className="flex items-center space-x-3">
              <span className={styles.cellSymbol}>{currency.name}</span>
              <span className={styles.cellName}>{currency.description}</span>
            </div>
            <div className="flex items-center">
              {/* O preço não está disponível diretamente na lista, 
                  precisaria ser buscado do histórico. Deixado para futura implementação. */}
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
