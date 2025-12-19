"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type ConfirmLogoutProps = {
  userName: string;
  onConfirm: () => void;
};


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
                  router.push("/");
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

export function toastConfirmLogout({
  userName,
  onConfirm,
}: ConfirmLogoutProps) {
  toast(
    ({ closeToast }) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-800">
          Deseja realmente sair da conta{" "}
          <strong>{userName}</strong>?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={closeToast}
            className="rounded-md bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
          >
            Cancelar
          </button>

          <button
            onClick={() => {
              closeToast?.();
              onConfirm();
            }}
            className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
          >
            Sair
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    }
  );
}