"use client";
import { useEffect, useState } from "react";
import { userAPI } from "@/services/API";
import { toast } from "react-toastify";
import { FaTrash, FaEdit } from "react-icons/fa";

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  photo?: string;
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(userAPI.getAll());
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error("Erro ao buscar os usuários.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      await fetch(userAPI.delete(id), {
        method: "DELETE",
      });
      toast.success("Usuário excluído com sucesso! 🗑");
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      toast.error("Erro ao excluir o usuário.");
    }
  };

  const handleEdit = (id: string) => {
    toast.info("Função de edição ainda não implementada!");
    // Ex: router.push(`/users/edit/${id}`);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-3xl mx-auto p-8 rounded-lg shadow-lg">
        <h1 className="text-yellow-400 text-3xl font-semibold text-center mb-6">
          Lista de Usuários
        </h1>
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user.id}
              className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
            >
              <span>{user.name}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(user.id)}
                  className="bg-yellow-500 text-gray-900 p-2 rounded-lg hover:bg-yellow-400 transition duration-300"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-500 transition duration-300"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
