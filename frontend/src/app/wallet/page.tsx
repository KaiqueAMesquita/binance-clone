"use client";

import React, { useEffect, useState } from 'react';
import WalletSummary, { WalletSummaryData } from './components/WalletSummary';
import AssetTable, { AssetRow } from './components/AssetTable';
import PromotionalCards, { PromotionCard } from './components/PromotionalCards';
import RecentTransactions, { WalletTransaction } from './components/RecentTransactions';
import styles from './page.module.css';
import { walletService, AssetRow as ApiAssetRow, WalletSummaryData as ApiWalletSummary } from '@/services/WalletService';

export default function WalletPage() {
  const [summary, setSummary] = useState<WalletSummaryData | null>(null);
  const [assets, setAssets] = useState<AssetRow[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const [s, a, t, h] = await Promise.all([
          walletService.getSummary(),
          walletService.getAssets(),
          walletService.getTransactions(),
          walletService.getHistory(7),
        ]);
        if (!active) return;
        setSummary(s as unknown as ApiWalletSummary as WalletSummaryData);
        const mappedAssets: AssetRow[] = (a || []).map((it: ApiAssetRow) => ({
          symbol: it.symbol,
          name: it.name,
          quantity: it.quantity,
          fiatValue: it.fiatValue,
          fiatCurrency: it.fiatCurrency || '$',
          costBasis: it.costBasis || 0,
          currentPrice: it.currentPrice || 0,
          pnlToday: it.pnlToday || 0,
          pnlIsPositive: !!it.pnlIsPositive,
          accent: it.accent || '#64748b',
        }));
        setAssets(mappedAssets);
        setTransactions(t || []);
        setHistory(h || []);
      } catch (err: unknown) {
        console.error('Falha ao carregar dados da carteira', err);
        setError((err as Error)?.message || 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const promotions: PromotionCard[] = [
    {
      title: 'A forma mais fácil de realizar trades de criptomoedas com taxa 0',
      cta: 'Converter',
      variant: 'primary',
    },
    {
      title: 'Faça trade de criptomoedas com ferramentas avançadas',
      subtitle: 'BTC/USDT • ferramenta',
      cta: 'Trading Spot',
      variant: 'secondary',
    },
  ];

  if (loading) return <div className={styles.page}><div className={styles.content}>Carregando carteira...</div></div>;
  if (error) return <div className={styles.page}><div className={styles.content}>Erro: {error}</div></div>;

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {summary && <WalletSummary data={summary} history={history} />}
        <AssetTable assets={assets} />
        <PromotionalCards cards={promotions} />
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  );
}
