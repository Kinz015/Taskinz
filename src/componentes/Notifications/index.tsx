"use client";

import { BellIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Notification = {
  id: number;
  title: string;
  description: string;
};

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Novo convite",
    description: "Você foi convidado para o projeto Taskinz",
  },
  {
    id: 2,
    title: "Atualização",
    description: "Um projeto foi atualizado",
  },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex" ref={ref}>
      {/* Botão do sino */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-zinc-800"
      >
        <div className="relative w-6 h-6">
          <BellIcon color="white" />

          {/* Badge */}
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            {mockNotifications.length}
          </span>
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg p-3 z-50">
          <h3 className="font-bold mb-2 text-sm">Notificações</h3>

          {mockNotifications.length === 0 ? (
            <p className="text-sm text-gray-400">Sem notificações</p>
          ) : (
            <div className="space-y-2">
              {mockNotifications.map((n) => (
                <div
                  key={n.id}
                  className="p-2 rounded hover:bg-zinc-800 cursor-pointer"
                >
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-gray-400">{n.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
