"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { userAPI } from "@/services/API"
import { toast } from "react-toastify";
import FormInput from "@/app/users/components/FormInput";
import SubmitButton from "@/app/users/components/SubmitButton";
import InputMask from "react-input-mask";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    photo: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(userAPI.getById(id as string));
        const data = await response.json();
        setForm(data);
      } catch (error) {
        toast.error("Erro ao carregar dados do usuário");
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      id: Number(id),        // ← garante que user.Id baterá com o route‑param
    };
    try {
      const response = await fetch(userAPI.edit(id as string), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao editar");

      toast.success("Usuário atualizado com sucesso! 🎉");
      router.push("/users");
    } catch (error) {
      toast.error("Erro ao editar o usuário.");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-yellow-400 text-3xl font-semibold mb-6 text-center">
          Editar Usuário
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <label className="block text-sm text-white mb-1">Telefone</label>
            <InputMask
              mask="(99)99999-9999"
              value={form.phone}
              onChange={handleChange}
              name="phone"
              className="w-full p-2 rounded bg-gray-800 text-white"
              placeholder="(11)91234-5678"
            />
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
