'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { currencyAPI, Currency } from '@/services/CurrencyService';
import styles from './page.module.css';
import PriceChart from '../components/PriceChart';
import { FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';


export default function CoinDetailPage() {
  const params = useParams();
  const symbol = Array.isArray(params?.symbol) ? params.symbol[0] : params?.symbol;
  const router = useRouter();
  const [coin, setCoin] = useState<Currency | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;

    const fetchCoinDetails = async () => {
      try {
        setLoading(true);
        const data = await currencyAPI.getById(symbol);
        setCoin(data);
        setError(null);
      } catch (err) {
        setError('Não foi possível carregar os detalhes da moeda.');
        console.error('Erro ao carregar moeda:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinDetails();
  }, [symbol]);

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
        <FaArrowLeft size={14} /> Voltar
      </Link>

      <div className={styles.gridLayout}>
        <main className={styles.main}>
          <div className={styles.heading}>
            <div className={styles.title}>
              <div className="flex items-center gap-2">
                <div className={styles.icon}>📈</div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">{coin.name}</h1>
                  <p className="text-gray-400 text-sm">{coin.symbol}</p>
                </div>
              </div>
              <div className={styles.actionButtons}>
                <button
                  onClick={() => router.push(`/currency/edit/${coin.id}`)}
                  className={`${styles.actionButton} ${styles.editButton}`}
                >
                  <FaEdit className="mr-2" /> Editar
                </button>
                <button
                  onClick={handleDelete}
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                >
                  <FaTrash className="mr-2" /> Deletar
                </button>
              </div>
            </div>
          </div>

          <p className={styles.subtitle}>
            Preço atual: <span className="text-white font-medium">{getLatestPrice()}</span>
            <span className="text-green-400 ml-2">+0.02%</span>
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

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Sobre {coin.name}</h2>
            <p className="text-gray-300 text-sm">
              {coin.description || 'Nenhuma descrição disponível.'}
            </p>
          </div>
        </main>

        <aside className={styles.sidebar}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>Comprar {coin.name}</div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Quantidade ({coin.symbol})</label>
              <input
                type="number"
                placeholder="0.00"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Valor (BRL)</label>
              <input
                type="number"
                placeholder="0.00"
                className={styles.formInput}
              />
            </div>
            <button className={styles.ctaButton}>
              Comprar {coin.symbol}
            </button>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Taxa: 0.1% por transação
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}