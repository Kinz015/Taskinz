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
    <table className="px-2 w-full border-separate border-spacing-y-2">
      <colgroup>
        <col className="w-[40]" />
        <col className="w-[500]" />
        <col className="w-[200]" />
        <col className="w-[200]" />
        <col className="w-[200]" />
        <col className="w-[200]" />
        <col className="w-[200]" />
        <col className="w-[70]" />
      </colgroup>
      <tbody>
        {tasks.map((task, index) => {
          const isAuthor = user.id === task.author.id;
          return (
            <tr key={task.id} className="bg-[#E5E5E5]">
              <td className="rounded-l-lg pl-6 pr-3 py-4 font-semibold">
                {index + 1}
              </td>

              <td className="py-4 text-left">{task.title}</td>

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
                  className={`w-full h-full flex justify-center py-4 hover:bg-gray-300 
                  hover:cursor-pointer rounded-r-lg
                  ${openMenuId === task.id ? "py-7" : ""}`}
                >
                  <EllipsisIcon />
                </button>

                {openMenuId === task.id && (
                  <div className="absolute right-0 top-full mt-2 z-50 w-40 bg-white rounded-md shadow-lg border">
                    <Link
                      href={`/tasks/${task.id}`}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 hover:rounded-md"
                    >
                      Abrir tarefa
                    </Link>

                    <button
                      onClick={() => {
                        if (!isAuthor) {
                          toastError("Apenas o autor da tarefa pode editá-la.");
                          setOpenMenuId(null);
                          return;
                        }

                        router.push(`/tasks/${task.id}/edit`);
                      }}
                      className={`
                        flex items-center gap-2 w-full px-4 py-2 text-sm text-left
                        transition
                        ${
                          isAuthor
                            ? "hover:bg-gray-100 cursor-pointer"
                            : "opacity-50 cursor-not-allowed"
                        }
                      `}
                    >
                      {!isAuthor && <LockIcon size={14} className="shrink-0" />}
                      <span>Editar tarefa</span>
                    </button>
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 hover:rounded-md hover:cursor-pointer"
                    >
                      Fechar
                    </button>
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
