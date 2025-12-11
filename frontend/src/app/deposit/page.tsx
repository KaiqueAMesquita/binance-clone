"use client";

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import SubmitButton from '@/app/users/components/SubmitButton';
import { walletService, BackendTransaction, BackendWallet } from '@/services/WalletService';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function DepositPage() {
  const [wallets, setWallets] = useState<BackendWallet[]>([]);
  const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list = await walletService.listWallets();
        if (!active) return;
        setWallets(list || []);
        if (list && list.length) setSelectedWalletId(list[0].id);
      } catch (err) {
        console.error('Erro ao carregar wallets', err);
      }
    })();
    return () => { active = false; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWalletId) {
      toast.error('Selecione uma carteira.');
      return;
    }
    const value = Number(amount);
    if (!value || value <= 0) {
      toast.error('Informe um valor válido.');
      return;
    }

    try {
      setLoading(true);
      const wallet = wallets.find(w => w.id === selectedWalletId)!;
      const tx: Partial<BackendTransaction> = {
        // backend expects numeric enum values for TransactionType and TransactionStatus
        // TransactionType: Deposit = 0
        // TransactionStatus: Completed = 1
        type: 0 as any,
        fromCurrency: 'external',
        toCurrency: wallet.currency,
        amount: value,
        walletId: selectedWalletId,
        status: 1 as any,
        transactionHash: '',
      };
      await walletService.addTransaction(selectedWalletId, tx);
      toast.success('Depósito registrado com sucesso.');
      router.push('/wallet');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Falha ao criar depósito.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Depósito</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Carteira</label>
          <select
            className={styles.select}
            value={selectedWalletId ?? ''}
            onChange={(e) => setSelectedWalletId(Number(e.target.value))}
          >
            {wallets.map(w => (
              <option key={w.id} value={w.id}>{`${w.currency} — Saldo: ${w.balance}`}</option>
            ))}
          </select>

          <label className={styles.label}>Valor</label>
          <input
            type="number"
            step="any"
            min="0"
            className={styles.input}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />

          <div className={styles.actions}>
            <SubmitButton label={loading ? 'Enviando...' : 'Depositar'} disabled={loading} />
          </div>
        </form>
      </div>
    </div>
  );
}
