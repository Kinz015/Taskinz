import { TaskStatus } from "@/types/task"

const statusMap: Record<
  TaskStatus,
  { label: string; className: string }
> = {
  overdue: {
    label: "Atrasada",
    className: "bg-[#A12D2F]"
  },
  started: {
    label: "Iniciada",
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
