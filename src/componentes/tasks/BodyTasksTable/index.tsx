import { TaskDTO } from "@/types/task";
import { StatusBadge } from "../StatusBadge";

type BodyTasksTableProps = {
  tasks: TaskDTO[]
}

export default function BodyTasksTable({ tasks }: BodyTasksTableProps) {
  return (
    <table className="px-2 w-full border-separate border-spacing-y-2">
      <colgroup>
        <col className="w-[60]" />
        <col className="w-[320]" />
        <col className="w-[140]" />
        <col className="w-[200]" />
        <col className="w-[120]" />
        <col className="w-[140]" />
        <col className="w-[160]" />
        <col className="w-[80]" />
      </colgroup>
      <tbody>
        {tasks.map((task, index) => (
          <tr key={task.id} className="bg-[#E5E5E5]">
            <td className="rounded-l-lg px-3 py-2 font-semibold">
              {index + 1}
            </td>

            <td className="p-4 text-left">{task.title}</td>

            <td className="p-4 text-center">
              <StatusBadge status={task.status} />
            </td>

            <td className="p-4 text-center">
              {task.author.name ?? task.author.email}
            </td>
            <td className="p-4 text-center">
              {task.dueAt ? new Date(task.dueAt).toLocaleDateString() : "-"}
            </td>
            <td className="p-4 text-center">
              {new Date(task.createdAt).toLocaleDateString()}
            </td>
            <td className="p-4 text-center">
              {new Date(task.updatedAt).toLocaleDateString()}
            </td>

            <td className="rounded-r-lg p-4 text-right">
              <button className="rounded-l-lg px-2 hover:bg-gray-300">
                •••
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
