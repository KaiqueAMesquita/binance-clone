'use client';

import WalletSummary, { WalletSummaryData } from './components/WalletSummary';
import AssetTable, { AssetRow } from './components/AssetTable';
import PromotionalCards, { PromotionCard } from './components/PromotionalCards';
import RecentTransactions, { WalletTransaction } from './components/RecentTransactions';
import styles from './page.module.css';

const walletSummary: WalletSummaryData = {
  estimatedBalanceBtc: 0.00187386,
  estimatedCurrency: 'BTC',
  estimatedBalanceFiat: 225.59,
  fiatSymbol: '$',
  pnlToday: {
    value: 8.42,
    percentage: 3.88,
    currency: '$',
    isPositive: true,
  },
};

const assets: AssetRow[] = [
  {
    symbol: 'SOL',
    name: 'Solana',
    quantity: 0.63794897,
    fiatValue: 233.18,
    fiatCurrency: '$',
    costBasis: 167.07,
    currentPrice: 149.08,
    pnlToday: 7.37,
    pnlIsPositive: true,
    accent: '#9945FF',
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    quantity: 0.00063336,
    fiatValue: 120389.99,
    fiatCurrency: '$',
    costBasis: 89605.3,
    currentPrice: 762.25,
    pnlToday: 1.07,
    pnlIsPositive: true,
    accent: '#F7931A',
  },
  {
    symbol: 'USDT',
    name: 'TetherUS',
    quantity: 0.001,
    fiatValue: 1,
    fiatCurrency: '$',
    costBasis: 1,
    currentPrice: 1,
    pnlToday: 0,
    pnlIsPositive: false,
    accent: '#26A17B',
  },
];

const promotions: PromotionCard[] = [
  {
    title: 'A forma mais fácil de realizar trades de criptomoedas com taxa 0',
    cta: 'Converter',
    variant: 'primary',
  },
  {
    title: 'Faça trade de criptomoedas com ferramentas avançadas',
    subtitle: 'BTC/USDT 120.389,99 $ • 2,16%',
    cta: 'Trading Spot',
    variant: 'secondary',
  },
];

const recentTransactions: WalletTransaction[] = [];

export default function WalletPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <WalletSummary data={walletSummary} />
        <AssetTable assets={assets} />
        <PromotionalCards cards={promotions} />
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
}
