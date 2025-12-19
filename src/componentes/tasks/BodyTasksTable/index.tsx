import { TaskDTO } from "@/types/task";
import { StatusBadge } from "../StatusBadge";
import { EllipsisIcon } from "lucide-react";
import Link from "next/link";

type BodyTasksTableProps = {
  tasks: TaskDTO[];
};

export default function BodyTasksTable({ tasks }: BodyTasksTableProps) {
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

            <td className="rounded-r-lg">
              <Link
                href={`/tasks/${task.id}`}
                className="w-full h-full flex justify-center py-4 hover:bg-gray-300 hover:cursor-pointer rounded-r-lg"
              >
                <EllipsisIcon />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
