"use client";

import { BellIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Prisma } from "@prisma/client";

type Invite = Prisma.ProjectInviteGetPayload<{
  include: {
    project: true;
    inviter: true;
  };
}>;

type NotificationBellProps = {
  invites: Invite[];
};

export default function NotificationBell({ invites }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  // 🔥 ações
  const handleAccept = async (id: number) => {
    await fetch(`/api/invites/${id}/accept`, { method: "POST" });
    location.reload();
  };

  const handleReject = async (id: number) => {
    await fetch(`/api/invites/${id}/reject`, { method: "POST" });
    location.reload();
  };

  return (
    <div className="relative flex" ref={ref}>
      {/* 🔔 BOTÃO */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-zinc-800"
      >
        <div className="relative w-6 h-6">
          <BellIcon color="white" />

          {/* 🔴 BADGE REAL */}
          {invites.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {invites.length}
            </span>
          )}
        </div>
      </button>

      {/* 📥 DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg p-3 z-50">
          <h3 className="font-bold mb-2 text-sm">Convites</h3>

          {invites.length === 0 ? (
            <p className="text-sm text-gray-400">Sem convites</p>
          ) : (
            <div className="space-y-3">
              {invites.map((invite) => (
                <div key={invite.id} className="p-3 rounded-lg bg-zinc-800">
                  {/* 🔥 MENSAGEM DINÂMICA */}
                  <p className="text-sm text-gray-200">
                    <b>{invite.inviter.name}</b> convidou você para o projeto{" "}
                    <b>{invite.project.title}</b>
                  </p>

                  {/* 🔘 BOTÕES */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleAccept(invite.id)}
                      className="bg-green-600 px-2 py-1 text-xs rounded text-white"
                    >
                      Aceitar
                    </button>

                    <button
                      onClick={() => handleReject(invite.id)}
                      className="bg-red-600 px-2 py-1 text-xs rounded text-white"
                    >
                      Recusar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
