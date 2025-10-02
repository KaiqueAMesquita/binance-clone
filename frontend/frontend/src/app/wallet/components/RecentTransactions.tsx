import { FaRegFileAlt } from 'react-icons/fa';
import styles from './RecentTransactions.module.css';

export type WalletTransaction = {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'trade';
  asset: string;
  amount: number;
  currency: string;
  timestamp: string;
};

type RecentTransactionsProps = {
  transactions: WalletTransaction[];
};

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const hasTransactions = transactions.length > 0;

  return (
    <section className={styles.container} aria-labelledby="wallet-transactions-heading">
      <div className={styles.header}>
        <h2 id="wallet-transactions-heading">Transações Recentes</h2>
        <button className={styles.moreButton} type="button">
          Mais
        </button>
      </div>
      {hasTransactions ? (
        <div className={styles.transactionList}>
          {transactions.map((transaction) => (
            <div key={transaction.id} className={styles.transactionRow}>
              <div className={styles.transactionInfo}>
                <span className={styles.transactionType}>{transaction.type}</span>
                <span className={styles.transactionAsset}>
                  {transaction.amount} {transaction.currency}
                </span>
              </div>
              <time className={styles.transactionTime}>{transaction.timestamp}</time>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon} aria-hidden="true">
            <FaRegFileAlt size={28} />
          </div>
          <p>Sem registros</p>
        </div>
      )}
    </section>
  );
}
