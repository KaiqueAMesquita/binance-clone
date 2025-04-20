'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';
import FormInput from '@/app/users/components/FormInput';
import SubmitButton from '@/app/users/components/SubmitButton';
import { userAPI } from '@/services/API';
import styles from './page.module.css';

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    photo: '',
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(userAPI.getById(id!));
        const data = await res.json();
        setForm(data);
      } catch {
        toast.error('Erro ao carregar dados do usuário');
      }
    }
    fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, id: Number(id) };
    try {
      const res = await fetch(userAPI.edit(id!), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success('Usuário atualizado com sucesso! 🎉');
      router.push('/users');
    } catch {
      toast.error('Erro ao editar o usuário.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Editar Usuário</h1>
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
          <SubmitButton label="Salvar alterações" />
        </form>
      </div>
    </div>
  );
}