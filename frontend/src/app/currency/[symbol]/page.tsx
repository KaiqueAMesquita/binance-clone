'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { currencyAPI, Currency } from '@/services/CurrencyService';
import styles from './page.module.css';
import PriceChart from '../components/PriceChart';

export default function CoinDetailPage() {
  const { symbol: id } = useParams();
  const router = useRouter();
  const [coin, setCoin] = useState<Currency | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCoinDetails = async () => {
      try {
        setLoading(true);
        const coinId = Array.isArray(id) ? id[0] : id;
        const data = await currencyAPI.getById(coinId);
        setCoin(data);
      } catch (err) {
        setError('Não foi possível carregar os detalhes da moeda.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinDetails();
  }, [id]);

  const getLatestPrice = () => {
    if (!coin?.histories || coin.histories.length === 0) {
      return 'N/A';
    }
    const sortedHistory = [...coin.histories].sort(
      (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );
    return sortedHistory[0].price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const handleDelete = async () => {
    try {
      if (!coin) return;

      const confirm = window.confirm('Tem certeza que deseja deletar esta moeda?');
      if (!confirm) return;

      await currencyAPI.delete(coin.id);
      toast.success('Moeda deletada com sucesso!');
      router.push('/currency');
    } catch (error) {
      console.error('Erro ao deletar moeda:', error);
      toast.error('Erro ao deletar moeda');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className={styles.container}>
        <p>Moeda não encontrada.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/currency" className={styles.backLink}>
        &larr; Voltar para Mercados
      </Link>
      <div className={styles.gridLayout}>
        <main className={styles.main}>
          <div className={styles.heading}>
            <div className={styles.icon}>📈</div>
            <h1 className={styles.title}>
              Preço do {coin.name} ({coin.name})
              <div className="actionButtons">
                <button
                  className="editButton"
                  onClick={() => router.push(`/currency/edit/${coin?.id}`)}
                >
                  Editar
                </button>
                <button
                  className="deleteButton"
                  onClick={handleDelete}
                >
                  Deletar
                </button>
              </div>
            </h1>
          </div>
          <p className={styles.subtitle}>
            {coin.name} para USD: 1 {coin.name} é igual a {getLatestPrice()}{' '}
            <span className="text-green-400">+0.02%</span>
          </p>
          <div className={styles.tabs}>
            {['1D', '7D', '1M', '3M', '1A', 'YTD'].map((tab) => (
              <div
                key={tab}
                className={
                  tab === '1D'
                    ? `${styles.tab} ${styles.tabActive}`
                    : styles.tab
                }
              >
                {tab}
              </div>
            ))}
          </div>
          <div className={styles.chartContainer}>
            <PriceChart historyData={coin.histories} />
          </div>
          <div className={styles.updateTime}>
            Última atualização da página: {new Date().toLocaleString()}
          </div>
        </main>

        <aside className={styles.sidebar}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>Comprar {coin.name}</div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Você compra</label>
              <input
                type="number"
                placeholder="0"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Você paga</label>
              <input
                type="number"
                placeholder="10 - 50,000"
                className={styles.formInput}
              />
            </div>
            <button className={styles.ctaButton}>Comprar {coin.name}</button>
            <p className={styles.note}>
              A Binance tem as menores taxas de transação entre as principais
              plataformas de trading.
            </p>
            <div className={styles.fees}>
              {[
                { label: 'Binance', value: 0.1 },
                { label: 'Kraken', value: 0.26 },
                { label: 'Coinbase', value: 1.0 },
              ].map((f) => (
                <div key={f.label} className={styles.feeItem}>
                  <span className={styles.feeLabel}>{f.label}</span>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/currency/${coin.id}`}
                      className={styles.actionBtn}
                    >
                      Ver
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}