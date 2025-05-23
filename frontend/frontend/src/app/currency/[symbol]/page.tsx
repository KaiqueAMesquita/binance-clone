'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { mockCoins } from '../data';
import styles from './page.module.css';

export default function CoinDetailPage() {
  const { symbol } = useParams();
  const coin = mockCoins.find(c => c.symbol === symbol);

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
        {/* Main Chart Section */}
        <main className={styles.main}>
          <div className={styles.heading}>
            <div className={styles.icon}>📈</div>
            <h1 className={styles.title}>
              Preço do {coin.name} ({coin.symbol})
            </h1>
          </div>
          <p className={styles.subtitle}>
            {coin.symbol} para USD: 1 {coin.name} é igual a ${coin.price}{' '}
            <span className="text-green-400">+0.02%</span>
          </p>
          <div className={styles.tabs}>
            {['1D', '7D', '1M', '3M', '1A', 'YTD'].map((tab) => (
              <div
                key={tab}
                className={tab === '1D' ? `${styles.tab} ${styles.tabActive}` : styles.tab}
              >
                {tab}
              </div>
            ))}
          </div>
          <div className={styles.chartContainer}>
            {/* Placeholder para o gráfico */}
            <span>Gráfico não implementado</span>
          </div>
          <div className={styles.updateTime}>
            Última atualização da página: 2025-05-23 17:57 (UTC+0)
          </div>
        </main>

        {/* Sidebar de Compra */}
        <aside className={styles.sidebar}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>Comprar {coin.symbol}</div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Você compra</label>
              <input type="number" placeholder="0" className={styles.formInput} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Você paga</label>
              <input
                type="number"
                placeholder="10 - 50,000"
                className={styles.formInput}
              />
            </div>
            <button className={styles.ctaButton}>Comprar {coin.symbol}</button>
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
                  <div className={styles.feeBarBg}>
                    <div
                      className={styles.feeBar}
                      style={{ width: `${f.value * 100}%` }}
                    />
                  </div>
                  <span className={styles.feeValue}>{f.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}