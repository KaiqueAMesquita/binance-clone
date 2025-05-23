'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import SubmitButton from './SubmitButton';
import styles from './CurrencyForm.module.css';

export default function CurrencyForm() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/currencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      toast.success('Moeda cadastrada com sucesso! 💰');
      setForm({ name: '', description: '', price: '' });
    } catch {
      toast.error('Erro ao cadastrar moeda.');
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
        <label className={styles.label}>Preço</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="0.00"
          className={styles.input}
        />
      </div>

      <SubmitButton label="Cadastrar Moeda" />
    </form>
  );
}