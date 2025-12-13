// frontend/src/app/wallet/components/CreateWalletButton.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { walletService } from '@/services/WalletService';
import styles from './CreateWalletButton.module.css';

export function CreateWalletButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Assuming we have the user ID from auth context or similar
      // For now using a placeholder user ID - you'll need to replace this with actual user ID
      await walletService.createWallet('USDT', 1); // Default to USDT for now
      router.refresh(); // Refresh the page to show the new wallet
    } catch (err) {
      console.error('Error creating wallet:', err);
      setError('Falha ao criar a carteira. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}
      <button 
        onClick={handleCreateWallet} 
        className={styles.createButton}
        disabled={isLoading}
      >
        {isLoading ? 'Criando...' : 'Criar Carteira'}
      </button>
    </div>
  );
}