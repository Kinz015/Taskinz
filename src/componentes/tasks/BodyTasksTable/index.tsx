"use client";

import { TaskDTO } from "@/types/task";
import { StatusBadge } from "../StatusBadge";
import { EllipsisIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type BodyTasksTableProps = {
  tasks: TaskDTO[];
};

export default function BodyTasksTable({ tasks }: BodyTasksTableProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

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
        {tasks.map((task, index) => (
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

                  <Link
                    href={`/tasks/${task.id}/edit`}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 hover:cursor-pointer"
                  >
                    Editar tarefa
                  </Link>
                  <button
                    onClick={() => {
                      console.log("Editar", task.id);
                      setOpenMenuId(null);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 hover:rounded-md hover:cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              )}

              {/* <Link
                href={`/tasks/${task.id}`}
                className="w-full h-full flex justify-center py-4 hover:bg-gray-300 hover:cursor-pointer rounded-r-lg"
              >
                <EllipsisIcon />
              </Link> */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
