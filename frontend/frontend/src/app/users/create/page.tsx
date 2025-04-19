"use client";
import UserForm from "../components/UserForm";

export default function UserCreatePage() {
  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-xl mx-auto p-8 rounded-lg shadow-lg bg-gray-800">
        <h1 className="text-yellow-400 text-3xl font-semibold text-center mb-6">Cadastrar Usuário</h1>
        <UserForm />
      </div>
    </div>
  );
}
