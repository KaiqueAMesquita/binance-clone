'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';
import FormInput from '@/app/users/components/FormInput';
import SubmitButton from '@/app/users/components/SubmitButton';
import { userAPI } from '@/services/API';
import styles from './page.module.css';
import { apiClient } from '@/services/apiClient';
import { userService } from '@/services/UserService';

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
        const userId = Array.isArray(id) ? id[0] : id;
        const userData = await userService.getUserById(Number(userId));
        setForm({
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          address: userData.address || '',
          password: '', 
          photo: userData.photo || '',
        });
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
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
    const userId = Array.isArray(id) ? id[0] : id;
  
    try {
      console.log('Dados a serem enviados:', form); // Adicione esta linha
      await userService.updateUser(Number(userId), form);
      toast.success('Usuário atualizado com sucesso!');
      router.push('/users');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao editar o usuário. Tente novamente.');
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