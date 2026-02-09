"use client";

import { useDeleteTask } from "@/hooks/useDeleteTask";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toastSuccess, toastError } from "@/utils/toast";
import { AuthUser } from "@/types/auth";

type EditTaskFormProps = {
  task: {
    id: number;
    title: string;
    description: string | null;
    status: string;
    dueAt: Date | null;
    assigneeId: string | null;
  };
  user: AuthUser;
};

export function EditTaskForm({ task, user }: EditTaskFormProps) {
  const { deleteTask } = useDeleteTask();
  const router = useRouter();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [status, setStatus] = useState(task.status);
  const [dueAt, setDueAt] = useState(
    task.dueAt ? new Date(task.dueAt).toISOString().split("T")[0] : "",
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        status,
        dueAt: dueAt || null,
        assigneeId: user.id,
      }),
    });

    // ✅ TOAST DE SUCESSO
    if (!res.ok) {
      toastError("Erro ao salvar a task");
      return;
    }

    router.push(`/tasks/${task.id}`);
    router.refresh();

    toastSuccess("Tarefa atualizada com sucesso");
    setLoading(false);
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl rounded-lg bg-[#2a2a2a] p-6 shadow-lg space-y-6"
    >
      {/* Título */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-300">
          Título
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="
        w-full rounded-md bg-[#1f1f1f] px-3 py-2 text-white
        border border-gray-700
        focus:outline-none focus:ring-2 focus:ring-indigo-500
      "
        />
      </div>

      {/* Descrição */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-300">
          Descrição
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="
        w-full resize-none rounded-md bg-[#1f1f1f] px-3 py-2 text-white
        border border-gray-700
        focus:outline-none focus:ring-2 focus:ring-indigo-500
      "
        />
      </div>

      {/* Responsável */}
      <div>
        <label className="">Responsável</label>
        <div className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/80">
          {user.name}
        </div>
        <p className="mt-1 text-xs text-white/40">
          O responsável desta task será o usuário logado.
        </p>
      </div>

      {/* Status */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-300">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="
        w-full rounded-md bg-[#1f1f1f] px-3 py-2 text-white
        border border-gray-700
        focus:outline-none focus:ring-2 focus:ring-indigo-500
      "
        >
          <option value="overdue">Atrasada</option>
          <option value="started">Iniciada</option>
          <option value="completed">Concluída</option>
        </select>
      </div>

      {/* Prazo */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-300">
          Prazo
        </label>
        <input
          type="date"
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          className="
        w-full rounded-md bg-[#1f1f1f] px-3 py-2 text-white
        border border-gray-700
        focus:outline-none focus:ring-2 focus:ring-indigo-500
      "
        />
      </div>

      {/* Ações */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          disabled={loading}
          className="
        rounded-md bg-green-600 px-5 py-2 text-sm font-medium text-white
        hover:bg-green-700 hover:cursor-pointer
        disabled:cursor-not-allowed disabled:opacity-50
      "
        >
          {loading ? "Salvando..." : "Salvar alterações"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="
        rounded-md bg-gray-600 px-5 py-2 text-sm font-medium text-white
        hover:bg-gray-700 hover:cursor-pointer
      "
        >
          Cancelar
        </button>
        <button
          type="button"
          className="
        rounded-md bg-red-700 px-5 py-2 text-sm font-medium text-white
        hover:bg-red-800 hover:cursor-pointer
        disabled:cursor-not-allowed disabled:opacity-50
      "
          onClick={() => deleteTask({ id: task.id, title: task.title })}
        >
          Excluir task
        </button>
      </div>
    </form>
  );
}
