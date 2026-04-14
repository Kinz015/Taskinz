"use client";

import { AuthUser } from "@/types/auth";
import { useState } from "react";

type CreateTaskFormProps = {
  user: AuthUser;
  projectId?: number;
  members?: {
    user: {
      id: string;
      name: string;
    };
  }[];
};

export default function CreateTaskForm({
  user,
  projectId,
  members,
}: CreateTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [status, setStatus] = useState("");
  const [assigneeId, setAssigneeId] = useState<string>(user.id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
        dueAt: dueAt ? new Date(dueAt).toISOString() : null,
        status, // "started" | "completed" | "overdue"
        projectId, // number
        assigneeId, // string (id do usuário escolhido)
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
    setStatus("overdue");
    setAssigneeId(user.id);
    setLoading(false);
  }

  const inputBase =
    "w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35";
  const labelBase = "block text-sm font-medium text-white/80";

  return (
    <div className="w-full max-w-xl p-6 m-auto">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6"
      >
        <label className={labelBase}>Título</label>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 focus-within:border-white/20">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputBase}
            maxLength={80}
            autoFocus
            required
          />
        </div>

        <div>
          <label className={`mt-5 ${labelBase}`}>Descrição (opcional)</label>
          <textarea
            className={
              "mt-2 min-h-27.5 w-full resize-y rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/20"
            }
            placeholder="Descreva rapidamente o objetivo da task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <label className={`mt-5 ${labelBase}`}>Responsável</label>
          {projectId ? (
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 focus-within:border-white/20">
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className={inputBase}
              >
                {members?.map((member) => (
                  <option key={member.user.id} className="bg-[#1b1b1f]">
                    {member.user.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/80">
                {user.name}
              </div>
              <p className="mt-1 text-xs text-white/40">
                O responsável desta task será o usuário logado.
              </p>
            </>
          )}
        </div>

        <div>
          <label className={`mt-5 ${labelBase}`}>Prazo</label>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 focus-within:border-white/20">
            <input
              type="datetime-local"
              className={inputBase}
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
            />
          </div>
        </div>

        <label className={`mt-5 ${labelBase}`}>Status</label>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 focus-within:border-white/20">
          <select
            className={inputBase}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option className="bg-[#1b1b1f]" value="overdue">
              Atrasada
            </option>
            <option className="bg-[#1b1b1f]" value="started">
              Iniciada
            </option>
            <option className="bg-[#1b1b1f]" value="completed">
              Concluída
            </option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-5 w-full rounded-lg py-2 text-sm font-semibold text-white transition ${
            loading
              ? "bg-green-500/60 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-800"
          }`}
        >
          {loading ? "Criando..." : "Criar task"}
        </button>
      </form>

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
