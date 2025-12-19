"use client";

import {
  LogOutIcon,
  ClipboardListIcon,
  ClipboardPlusIcon,
  ClipboardCheckIcon,
  ClipboardClockIcon,
  ClockAlertIcon,
} from "lucide-react";
import Image from "next/image";
import SidebarLink from "../SidebarLink";
import { useRouter } from "next/navigation";
import { toastConfirmLogout } from "@/hooks/useDeleteTask";
import { getLoggedUser } from "@/lib/auth";

export function SideBar() {
  const router = useRouter();
  const user = getLoggedUser();

  function handleLogout() {
    toastConfirmLogout({
      userName: user?.email || "usuário",
      onConfirm: () => {
        localStorage.removeItem("token");
        router.push("/login");
      },
    });
  }

  return (
    <aside className="w-80 bg-white">
      <div className="min-h-50">
        <Image
          src="/TaskinzSemFundo.png"
          alt="Taskinz"
          width={400}
          height={100}
          priority
          className="p-20"
        />
      </div>
      <div className="flex">
        <nav className="flex flex-1 flex-col gap-2 mx-2">
          <SidebarLink href="/">
            <ClipboardListIcon /> Todas as tarefas
          </SidebarLink>
          <SidebarLink href="/adicionar-tarefa">
            <ClipboardPlusIcon /> Adicionar tarefa
          </SidebarLink>
          <SidebarLink href="/concluidas">
            <ClipboardCheckIcon /> Concluídas
          </SidebarLink>
          <SidebarLink href="/em-andamento">
            <ClipboardClockIcon /> Em andamento
          </SidebarLink>
          <SidebarLink href="/pendentes">
            <ClockAlertIcon /> Pendentes
          </SidebarLink>
          <SidebarLink onClick={handleLogout}>
            <LogOutIcon /> Sair
          </SidebarLink>
        </nav>
      </div>
    </aside>
  );
}
