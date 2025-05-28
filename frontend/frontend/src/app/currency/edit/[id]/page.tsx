'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CurrencyForm from '../../components/CurrencyForm';
import styles from './page.module.css';

export default function CurrencyEditPage() {
  const { id } = useParams();
  const [currency, setCurrency] = useState<{
    name: string;
    description: string;
    price: string;
  } | null>(null);

  // Simulando dados falsos
  useEffect(() => {
    const fakeCurrency = {
      name: 'Bitcoin',
      description: 'A primeira e mais conhecida moeda digital do mundo',
      price: '30000.00'
    };
    setCurrency(fakeCurrency);
  }, [id]);

  // Simulando a atualização
  const handleUpdate = async (formData: {
    name: string;
    description: string;
    price: string;
  }) => {
    try {
      // Simulando sucesso
      toast.success('Moeda atualizada com sucesso! 💰');
      // Atualizando os dados localmente
      setCurrency(formData);
    } catch {
      toast.error('Erro ao atualizar moeda.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Editar Moeda</h1>
        {currency ? (
          <CurrencyForm
            initialValues={currency}
            onSubmit={handleUpdate}
          />
        ) : (
          <p>Carregando...</p>
        )}
      </div>
    </div>
  );
}