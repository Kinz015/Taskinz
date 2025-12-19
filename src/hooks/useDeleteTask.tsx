"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function useDeleteTask() {
  const router = useRouter();

  async function deleteTask(task: { id: number; title: string }) {
    toast.warn(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="text-sm">
            Tem certeza que deseja excluir a tarefa:
            <br />
            <strong>{task.title}</strong>?
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={closeToast}
              className="rounded bg-gray-500 px-3 py-1 text-sm text-white"
            >
              Cancelar
            </button>

            <button
              onClick={async () => {
                try {
                  const res = await fetch(`/api/tasks/${task.id}`, {
                    method: "DELETE",
                  });

                  if (!res.ok) {
                    throw new Error();
                  }

                  toast.success("Tarefa excluída com sucesso");
                  closeToast();
                  router.push("/tasks");
                  router.refresh();
                } catch {
                  toast.error("Erro ao excluir tarefa");
                }
              }}
              className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
            >
              Excluir
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  }

  return { deleteTask };
}
