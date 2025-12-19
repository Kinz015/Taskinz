"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string | null;
  email: string;
};

export default function CreateTaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [status, setStatus] = useState("");
  const [assigneeId, setAssigneeId] = useState<string | "">("");

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 🔹 Carregar usuários para o select de responsável
  useEffect(() => {
    async function loadUsers() {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    }

    loadUsers();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem("token");

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 👈 agora sim
      },
      body: JSON.stringify({
        title,
        description,
        dueAt: dueAt || null,
        status,
        assigneeId: assigneeId || null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erro ao criar task");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTitle("");
    setDescription("");
    setDueAt("");
    setStatus("");
    setAssigneeId("");
    setLoading(false);
  }

  return (
    <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-md m-auto">
      <h2 className="mb-6 text-center text-xl font-semibold text-gray-800">
        Criar nova task
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Título */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Título
          </label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
             focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm
             focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Responsável */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Responsável
          </label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
             focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
          >
            <option value="">— Sem responsável —</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
        </div>

        {/* Prazo */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Prazo
          </label>
          <input
            type="datetime-local"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                         focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
          />
        </div>

        {/* Status */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                         focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pendente</option>
            <option value="in_progress">Em andamento</option>
            <option value="completed">Concluída</option>
          </select>
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-md bg-indigo-600 py-2 text-sm font-medium text-white
                       transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
        >
          {loading ? "Criando..." : "Criar task"}
        </button>
      </form>
      {error && (
        <p className="mt-4 text-center text-sm text-red-600">{error}</p>
      )}

      {success && (
        <p className="mt-4 text-center text-sm text-green-600">
          Task criada com sucesso
        </p>
      )}
    </div>
  );
}
