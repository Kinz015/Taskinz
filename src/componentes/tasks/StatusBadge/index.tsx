import { TaskStatus } from "@/lib/mockTasks";

const statusStyles: Record<TaskStatus, string> = {
  Concluída: "bg-[#2DA135]",
  "Em andamento": "bg-[#D97706]",
  Pendente: "bg-[#A12D2F]",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`rounded-md px-3 py-2 font-medium text-white ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
