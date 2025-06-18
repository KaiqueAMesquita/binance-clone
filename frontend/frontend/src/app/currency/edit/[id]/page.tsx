'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { currencyAPI, Currency } from '@/services/CurrencyService';
import CurrencyForm from '../../components/CurrencyForm';
import styles from './page.module.css';

export default function CurrencyEditPage() {
  const params = useParams();
  const id = params.id;
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const coinId = Array.isArray(id) ? id[0] : id;
        const data = await currencyAPI.getById(coinId);
        setCurrency(data);
      } catch (error) {
        console.error('Erro ao buscar moeda:', error);
        toast.error('Erro ao carregar dados da moeda');
        setError('Erro ao carregar dados da moeda');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCurrency();
    }
  }, [id]);

  const handleUpdate = async (formData: {
    name: string;
    description: string;
    backing: string;
  }) => {
    try {
      if (!currency) return;

      const updatedCurrency: Currency = {
        ...currency,
        name: formData.name,
        description: formData.description,
        backing: formData.backing,
      };

      await currencyAPI.update(updatedCurrency.id, updatedCurrency);
      toast.success('Moeda atualizada com sucesso!');
      setCurrency(updatedCurrency);
    } catch (error) {
      console.error('Erro ao atualizar moeda:', error);
      toast.error('Erro ao atualizar moeda');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!currency) {
    return <div className={styles.error}>Moeda não encontrada</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Editar Moeda</h1>
        <div className={styles.formContainer}>
          <CurrencyForm
            initialValues={{
              name: currency.name,
              description: currency.description,
              backing: currency.backing,
            }}
            onSubmit={handleUpdate}
          />
        </div>
      </div>
    </div>
  );
}