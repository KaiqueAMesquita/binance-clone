'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import SubmitButton from './SubmitButton';
import styles from './CurrencyForm.module.css';
import { useEffect } from 'react';
import { currencyAPI, Currency } from '../../../services/CurrencyService';

interface CurrencyFormData {
  name: string;
  description: string;
  backing: string;
}

interface CurrencySelectOption {
  value: string;
  label: string;
}

interface CurrencyFormProps {
  initialValues?: CurrencyFormData;
  onSubmit?: (formData: CurrencyFormData) => void;
}

export default function CurrencyForm({ initialValues, onSubmit }: CurrencyFormProps) {
  const [form, setForm] = useState<CurrencyFormData>(initialValues || {
    name: '',
    description: '',
    backing: ''
  });
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const currencies = await currencyAPI.getAll();
        setCurrencies(currencies);
      } catch (error) {
        console.error('Erro ao carregar moedas:', error);
        toast.error('Erro ao carregar moedas de referência');
      } finally {
        setLoading(false);
      }
    };

    loadCurrencies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (onSubmit) {
        await onSubmit(form);
      } else {
        // Gerar um symbol baseado no nome
        const symbol = form.name
          .toUpperCase()
          .replace(/[^A-Z]/g, '')
          .substring(0, 3);

        const currency: Currency = {
          id: 0, // ID será gerado pelo backend
          symbol: symbol,
          name: form.name,
          description: form.description,
          backing: form.backing,
          histories: []
        };

        console.log('Dados enviados para o backend:', currency);

        try {
          const result = await currencyAPI.create(currency);
          console.log('Resposta do backend:', result);
          
          // Atualizar o estado do form com o ID retornado
          setForm({
            ...form,
            name: '',
            description: '',
            backing: ''
          });
          
          toast.success('Moeda cadastrada com sucesso!');
        } catch (error) {
          console.error('Erro detalhado:', error);
          toast.error('Erro ao cadastrar moeda');
          throw error;
        }

        toast.success('Moeda cadastrada com sucesso!');
        setForm({ name: '', description: '', backing: ''});
      }
    } catch (error) {
      toast.error('Erro ao cadastrar moeda');
      console.error('Erro:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <label className={styles.label}>Nome da Moeda</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Bitcoin, Ethereum..."
          className={styles.input}
        />
      </div>

      <div>
        <label className={styles.label}>Descrição</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Moeda digital descentralizada..."
          className={styles.input}
        />
      </div>

      <div>
        <label className={styles.label}>Moeda de Referência</label>
        <input
          type="text"
          name="backing"
          value={form.backing}
          onChange={handleChange}
          placeholder="USD, EUR..."
          className={styles.input}
        />
      </div>

      <SubmitButton label={initialValues ? 'Atualizar Moeda' : 'Cadastrar Moeda'} />
    </form>
  );
}