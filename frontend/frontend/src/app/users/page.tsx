"use client";
import { useEffect, useState } from "react";
import userService, { User } from "@/services/UserService";
import UserList from "./components/UserList";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Erro ao buscar os usuários", error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-3xl mx-auto p-8 rounded-lg shadow-lg">
        <UserList />
      </div>
    </div>
  );
}
