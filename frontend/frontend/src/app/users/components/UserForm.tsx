'use client';

import { useState } from 'react';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';
import { userAPI } from '@/services/API';
import FormInput from './FormInput';
import SubmitButton from './SubmitButton';
import styles from './UserForm.module.css';

export default function UserForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    photo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(userAPI.create(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Erro ao cadastrar.');

      toast.success('Usuário cadastrado com sucesso! ✨');
      setForm({ name: '', email: '', phone: '', address: '', password: '', photo: '' });
    } catch {
      toast.error('Erro ao cadastrar o usuário!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <FormInput
        label="Nome"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Digite o nome"
      />

      <FormInput
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Digite o email"
      />

      <div>
        <label className={styles.maskLabel}>Telefone</label>
        <InputMask
          mask="(99)99999-9999"
          value={form.phone}
          onChange={handleChange}
          name="phone"
        >
          {(inputProps: any) => (
            <input
              {...inputProps}
              type="text"
              className={styles.maskInput}
              placeholder="(11)91234-5678"
            />
          )}
        </InputMask>
      </div>

      <FormInput
        label="Endereço"
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Digite o endereço"
      />

      <FormInput
        label="Senha"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Digite a senha"
      />

      <FormInput
        label="URL da Foto"
        name="photo"
        value={form.photo}
        onChange={handleChange}
        placeholder="https://..."
      />

      <SubmitButton label="Cadastrar" />
    </form>
  );
}