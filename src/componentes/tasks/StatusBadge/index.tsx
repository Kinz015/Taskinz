import { TaskStatus } from "@/types/task"

const statusMap: Record<
  TaskStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pendente",
    className: "bg-[#A12D2F]"
  },
  in_progress: {
    label: "Em andamento",
    className: "bg-[#D97706]"
  },
  completed: {
    label: "Concluída",
    className: "bg-[#2DA135]"
  }
}

type StatusBadgeProps = {
  status: TaskStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = statusMap[status]

  return (
    <span
      className={`rounded-md px-3 py-2 font-medium text-white ${className}`}
    >
      {label}
    </span>
  );
}
