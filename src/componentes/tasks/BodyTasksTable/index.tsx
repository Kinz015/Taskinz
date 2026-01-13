"use client";

import { TaskDTO } from "@/types/task";
import { StatusBadge } from "../StatusBadge";
import { EllipsisIcon, LockIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthUser } from "@/types/auth";
import { toastError } from "@/utils/toast";

type BodyTasksTableProps = {
  tasks: TaskDTO[];
  user: AuthUser;
};
export default function BodyTasksTable({ tasks, user }: BodyTasksTableProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const router = useRouter();

  return (
    <>
      {/* 📱 MOBILE */}
      <div className="md:hidden space-y-3 px-2">
        {tasks.map((task) => {
          const isAuthor = user.id === task.author.id;

          return (
            <div
              key={task.id}
              className="rounded-lg bg-[#E5E5E5] p-4 shadow-sm"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-800">
                    {task.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <StatusBadge status={task.status} />
                    <span className="text-gray-600">
                      {task.assignee ? task.assignee.name : "Sem responsável"}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-gray-600">
                    <p>
                      <strong>Prazo:</strong>{" "}
                      {task.dueAt
                        ? new Date(task.dueAt).toLocaleDateString()
                        : "-"}
                    </p>
                    <p>
                      <strong>Criada:</strong>{" "}
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === task.id ? null : task.id)
                    }
                    className="rounded-md p-2 hover:bg-gray-300"
                  >
                    <EllipsisIcon size={18} />
                  </button>

                  {openMenuId === task.id && (
                    <div className="absolute right-0 top-full mt-2 z-50 w-40 bg-white rounded-md shadow-lg border">
                      <Link
                        href={`/tasks/${task.id}`}
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Abrir tarefa
                      </Link>

                      <button
                        onClick={() => {
                          if (!isAuthor) {
                            toastError(
                              "Apenas o autor da tarefa pode editá-la."
                            );
                            setOpenMenuId(null);
                            return;
                          }

                          router.push(`/tasks/${task.id}/edit`);
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-left ${
                          isAuthor
                            ? "hover:bg-gray-100"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        {!isAuthor && <LockIcon size={14} />}
                        Editar tarefa
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🖥 DESKTOP */}
      <table className="hidden md:table px-2 w-full border-separate border-spacing-y-2">
        <colgroup>
          <col className="min-w-[60] w-[60] max-w-[60]" />
          <col className="w-[500]" />
          <col className="min-w-[150]" />
          <col className="min-w-[150]" />
          <col className="min-w-[150]" />
          <col className="min-w-[150]" />
          <col className="min-w-[150]" />
          <col className="min-w-[60] w-[60] max-w-[60]" />
        </colgroup>

        <tbody>
          {tasks.map((task, index) => {
            const isAuthor = user.id === task.author.id;

            return (
              <tr key={task.id} className="bg-[#E5E5E5]">
                <td className="rounded-l-lg text-center py-4 font-semibold">
                  {index + 1}
                </td>

                <td className="py-4 text-left max-w-75 truncate">
                  {task.title}
                </td>

                <td className="py-4 text-center">
                  <StatusBadge status={task.status} />
                </td>

                <td className="py-4 text-center">
                  {task.assignee ? task.assignee.name : "Sem responsável"}
                </td>

                <td className="py-4 text-center">
                  {task.dueAt ? new Date(task.dueAt).toLocaleDateString() : "-"}
                </td>

                <td className="py-4 text-center">
                  {new Date(task.createdAt).toLocaleDateString()}
                </td>

                <td className="py-4 text-center">
                  {new Date(task.updatedAt).toLocaleDateString()}
                </td>

                <td className="relative rounded-r-lg overflow-visible">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === task.id ? null : task.id)
                    }
                    className={`w-full h-full flex justify-center py-${
                      openMenuId === task.id ? "6" : "4"
                    } hover:bg-gray-300 hover:cursor-pointer rounded-r-lg`}
                  >
                    <EllipsisIcon />
                  </button>

                  {openMenuId === task.id && (
                    <div className="absolute right-0 top-full mt-2 z-50 w-40 bg-white rounded-md shadow-lg border">
                      <Link
                        href={`/tasks/${task.id}`}
                        className="block px-4 py-2 text-sm hover:bg-gray-100 hover:rounded-t-md hover:cursor-pointer"
                      >
                        Abrir tarefa
                      </Link>

                      <button
                        onClick={() => {
                          if (!isAuthor) {
                            toastError(
                              "Apenas o autor da tarefa pode editá-la."
                            );
                            setOpenMenuId(null);
                            return;
                          }

                          router.push(`/tasks/${task.id}/edit`);
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-left ${
                          isAuthor
                            ? "hover:bg-gray-100 hover:cursor-pointer"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        {!isAuthor && <LockIcon size={14} />}
                        Editar tarefa
                      </button>
                      <button
                        onClick={() => setOpenMenuId(null)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 hover:rounded-b-md hover:cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
