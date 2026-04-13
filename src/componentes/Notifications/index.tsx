"use client";

import { BellIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Prisma } from "@prisma/client";
import InviteList from "./invites/inviteList";

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

  return (
    <div className="relative" ref={ref}>
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
        <div className="fixed top-16 right-0 overflow-y-auto bg-zinc-900 border border-zinc-700 rounded-xl p-4 z-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm text-white">Convites</h3>
          </div>

          <InviteList invites={invites} />
        </div>
      )}
    </div>
  );
}
