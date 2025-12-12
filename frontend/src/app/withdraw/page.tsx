"use client";

import React, { useEffect, useState } from 'react';
import styles from '../deposit/page.module.css';
import SubmitButton from '@/app/users/components/SubmitButton';
import { walletService, BackendTransaction, BackendWallet } from '@/services/WalletService';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function WithdrawPage() {
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
    if (selectedWalletId == null) {
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
      const wallet = wallets.find(w => w.id === selectedWalletId) || wallets[0];
      if (!wallet) throw new Error('Carteira não encontrada.');
      if (value > Number(wallet.balance || 0)) {
        toast.error('Saldo insuficiente.');
        return;
      }

      // Prepare updated wallet using PUT (decrement balance)
      console.log('Tentando atualizar carteira — selectedWalletId:', selectedWalletId, 'wallet?.id:', wallet?.id);
      if (!wallet?.id) {
        setLoading(false);
        toast.error('Carteira inválida. Atualize a página e tente novamente.');
        return;
      }

      const updated = { ...wallet, balance: Number(wallet.balance) - value } as Partial<BackendWallet>;
      const updatedWallet = await walletService.updateWallet(wallet.id, updated);

      // Optionally record a transaction as well (keeps history consistent)
      const walletIdForTx = (updatedWallet && updatedWallet.id) ? updatedWallet.id : selectedWalletId!;
      const tx: Partial<BackendTransaction> = {
        type: 1 as any, // Withdrawal
        fromCurrency: wallet.currency,
        toCurrency: 'external',
        amount: value,
        walletId: walletIdForTx,
        status: 1 as any,
        transactionHash: '',
      };
      await walletService.addTransaction(walletIdForTx, tx);

      toast.success('Saque efetuado com sucesso.');
      router.push('/wallet');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Falha ao processar saque.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Saque</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Carteira</label>
          <select
            className={styles.select}
            value={selectedWalletId ?? ''}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (!Number.isNaN(v)) setSelectedWalletId(v);
            }}
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
            <SubmitButton label={loading ? 'Enviando...' : 'Sacar'} disabled={loading} />
          </div>
        </form>
      </div>
    </div>
  );
}
