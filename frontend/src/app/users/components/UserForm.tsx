'use client';

import { useEffect, useRef, useState } from 'react';
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
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === 'file' && e.target.files?.[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      // create object URL for preview
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  useEffect(() => {
    // cleanup object URL when preview changes or component unmounts
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const removePhoto = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setPhotoFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile) {
      toast.error('Selecione uma foto de perfil.');
      return;
    }

    try {
      const data = new FormData();
      data.append('photo', photoFile);

      console.log('>> enviando FormData para /api/upload …');
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: data });
      console.log('upload status:', uploadRes.status);

      // clona para ler raw text
      const raw = await uploadRes.clone().text();
      console.log('upload raw text:', raw);

      // parseia JSON da original
      const { url, error } = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(error || 'Falha no upload da foto.');
      }

      // 2) envia usuário + URL da foto para o backend
      const payload = { ...form, photo: url };
      const res = await fetch(userAPI.create(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Erro ao cadastrar.');

      toast.success('Usuário cadastrado com sucesso! ✨');
      setForm({ name: '', email: '', phone: '', address: '', password: '' });
      setPhotoFile(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erro ao cadastrar o usuário!');
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
      <div>
        <label className={styles.label}>Foto de Perfil</label>
        <input
          ref={el => (fileInputRef.current = el)}
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          className={styles.input}
        />

        {preview && (
          <div className={styles.photoPreview}>
            <img src={preview} alt="Pré-visualização" className={styles.photoPreviewImg} />
            <div className={styles.photoControls}>
              <button type="button" className={styles.removeButton} onClick={removePhoto}>
                Remover
              </button>
            </div>
          </div>
        )}
      </div>
      <SubmitButton label="Cadastrar" />
    </form>
  );
}
