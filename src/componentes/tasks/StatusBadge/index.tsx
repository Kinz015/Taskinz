"use client";

import { TaskStatus } from "@/types/task";
import { useState } from "react";
import { RowActionsMenu } from "@/componentes/RowActionsMenu";

const statusMap: Record<TaskStatus, { label: string; className: string }> = {
  overdue: {
    label: "Atrasada",
    className: "bg-[#A12D2F]",
  },
  started: {
    label: "Iniciada",
    className: "bg-[#D97706]",
  },
  completed: {
    label: "Concluída",
    className: "bg-[#2DA135]",
  },
};

const statusOrder: TaskStatus[] = ["overdue", "started", "completed"];

type StatusBadgeProps = {
  status: TaskStatus;
  onChangeStatus?: (newStatus: TaskStatus) => void;
};

export function StatusBadge({ status, onChangeStatus }: StatusBadgeProps) {
  const [open, setOpen] = useState(false);

  const { label, className } = statusMap[status];

  function handleSelect(newStatus: TaskStatus) {
    onChangeStatus?.(newStatus);
    setOpen(false);
  }

  return (
    <RowActionsMenu
      open={open}
      onToggle={() => setOpen((prev) => !prev)}
      onClose={() => setOpen(false)}
      trigger={
        <button
          className={`${open && "my-2"} rounded-md px-3 py-1 font-medium text-white ${className}`}
        >
          {label}
        </button>
      }
    >
      {statusOrder.map((s) => {
        const item = statusMap[s];
        return (
          <button
            key={s}
            onClick={() => handleSelect(s)}
            className={`${
              item.label === "Atrasada"
                ? "hover:rounded-t-lg"
                : item.label === "Concluída"
                  ? "hover:rounded-b-lg"
                  : ""
            } flex w-full items-center gap-2 px-3 py-2 text-sm hover:cursor-pointer hover:bg-zinc-800`}
          >
            <span className={`w-2 h-2 rounded-full ${item.className}`} />
            {item.label}
          </button>
        );
      })}
    </RowActionsMenu>
  );
}
