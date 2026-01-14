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
  const [status, setStatus] = useState("pending");
  const [assigneeId, setAssigneeId] = useState<string | "">("");

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      const res = await fetch("/api/users", { credentials: "include" });
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

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title,
        description,
        dueAt: dueAt || null,
        status,
        assigneeId: assigneeId || null,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Erro ao criar task");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTitle("");
    setDescription("");
    setDueAt("");
    setStatus("pending");
    setAssigneeId("");
    setLoading(false);
  }

  const inputBase =
    "w-full rounded-lg bg-white/10 border border-white/10 text-white placeholder:text-white/30 px-3 py-2 text-sm outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10";
  const labelBase = "mb-1 block text-sm font-medium text-white/70";

  return (
    <div className="w-full max-w-xl rounded-2xl bg-white/10 border border-white/10 p-6 shadow-lg m-auto">
      <h2 className="mb-6 text-center text-2xl font-bold text-white">
        Criar nova task
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Título */}
        <div>
          <label className={labelBase}>Título</label>
          <input
            className={inputBase}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Descrição */}
        <div>
          <label className={labelBase}>Descrição</label>
          <textarea
            className={`${inputBase} resize-y`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Responsável */}
        <div>
          <label className={labelBase}>Responsável</label>
          <select
            className={inputBase}
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
          >
            <option className="bg-[#1b1b1f]" value="">
              — Sem responsável —
            </option>

            {users.map((user) => (
              <option className="bg-[#1b1b1f]" key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-white/40">
            Selecione alguém ou deixe sem responsável.
          </p>
        </div>

        {/* Prazo */}
        <div>
          <label className={labelBase}>Prazo</label>
          <input
            type="datetime-local"
            className={inputBase}
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
          />
        </div>

        {/* Status */}
        <div>
          <label className={labelBase}>Status</label>
          <select
            className={inputBase}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option className="bg-[#1b1b1f]" value="pending">
              Pendente
            </option>
            <option className="bg-[#1b1b1f]" value="in_progress">
              Em andamento
            </option>
            <option className="bg-[#1b1b1f]" value="completed">
              Concluída
            </option>
          </select>
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className={`mt-2 w-full rounded-lg py-2 text-sm font-semibold text-white transition
    ${
      loading
        ? "bg-green-500/60 cursor-not-allowed"
        : "bg-green-700 hover:bg-green-800"
    }
  `}
        >
          {loading ? "Criando..." : "Criar task"}
        </button>
      </form>

      {/* feedback */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-sm text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center text-sm text-emerald-200">
          Task criada com sucesso!
        </div>
      )}
    </div>
  );
}
