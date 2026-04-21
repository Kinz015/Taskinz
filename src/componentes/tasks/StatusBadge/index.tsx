import { TaskStatus } from "@/types/task";
import { useState, useRef, useEffect } from "react";

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
  const ref = useRef<HTMLDivElement>(null);

  const { label, className } = statusMap[status];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSelect(newStatus: TaskStatus) {
    onChangeStatus?.(newStatus);
    setOpen(false);
  }

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`${
          open && "my-3"
        } rounded-md px-3 border-none py-1 font-medium text-white transition hover:opacity-80 ${className}`}
      >
        {label}
      </button>
      {/* Dropdown */}{" "}
      {open && (
        <div className="absolute z-50 mt-2 w-40 rounded-lg bg-zinc-900 border text-white border-zinc-700 shadow-lg animate-in fade-in zoom-in-95">
          {" "}
          {statusOrder.map((s) => {
            const item = statusMap[s];
            return (
              <button
                key={s}
                onClick={() => handleSelect(s)}
                className="flex w-full rounded-lg items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-800 transition"
              >
                <span className={`w-2 h-2 rounded-full ${item.className}`} />{" "}
                {item.label}{" "}
              </button>
            );
          })}{" "}
        </div>
      )}
    </div>
  );
}
