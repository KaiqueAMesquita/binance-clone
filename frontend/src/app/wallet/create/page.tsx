// frontend/src/app/wallet/create/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { walletService } from '@/services/WalletService';
import styles from './create.module.css';

// List of available currencies for the wallet
const availableCurrencies = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'USDT', name: 'Tether' },
  { symbol: 'BNB', name: 'Binance Coin' },
  { symbol: 'SOL', name: 'Solana' },
];

export default function CreateWalletPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    currency: 'USDT',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Replace with actual user ID from your auth context
      const userId = 1; 
      await walletService.createWallet(formData.currency, userId);
      
      // Redirect to wallet page after successful creation
      router.push('/wallet');
    } catch (err) {
      console.error('Error creating wallet:', err);
      setError('Falha ao criar a carteira. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Criar Nova Carteira</h1>
        <p className={styles.subtitle}>Preencha os dados para criar uma nova carteira</p>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="currency">Moeda</label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className={styles.select}
              required
            >
              {availableCurrencies.map((currency) => (
                <option key={currency.symbol} value={currency.symbol}>
                  {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => router.push('/wallet')}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Criando...' : 'Criar Carteira'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}