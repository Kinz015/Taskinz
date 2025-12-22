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
import { AuthUser } from "@/types/auth";
import logo from "@/assets/TaskinzLogo.png";

type SideBarProps = {
  user: AuthUser | null;
};

export function SideBar({ user }: SideBarProps) {
  const router = useRouter();

  async function handleLogout() {
    toastConfirmLogout({
      userName: user?.email || "usuário",
      onConfirm: async () => {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });

        router.push("/login");
        router.refresh();
      },
    });
  }

  return (
    <aside
      className="
        hidden md:flex
        md:w-20
        lg:w-80
        bg-white
        transition-all
      "
    >
      <div className="min-h-screen flex flex-col w-full">
        {/* Logo — só no desktop */}
        <div className="hidden lg:flex justify-center">
          <Image
            src={logo}
            alt="Taskinz"
            width={400}
            height={100}
            priority
            className="p-20"
          />
        </div>

        <nav className="flex flex-1 flex-col gap-2 mx-2 mt-4">
          <SidebarLink href="/">
            <ClipboardListIcon />
            Todas as tarefas
          </SidebarLink>

          <SidebarLink href="/adicionar-tarefa">
            <ClipboardPlusIcon />
            Adicionar tarefa
          </SidebarLink>

          <SidebarLink href="/concluidas">
            <ClipboardCheckIcon />
            Concluídas
          </SidebarLink>

          <SidebarLink href="/em-andamento">
            <ClipboardClockIcon />
            Em andamento
          </SidebarLink>

          <SidebarLink href="/pendentes">
            <ClockAlertIcon />
            Pendentes
          </SidebarLink>

          <SidebarLink onClick={handleLogout}>
            <LogOutIcon />
            Sair
          </SidebarLink>
        </nav>
      </div>
    </aside>
  );
}
