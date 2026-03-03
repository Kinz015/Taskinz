"use client";

import SidebarLink from "@/componentes/SidebarLink";
import { toastConfirmLogout } from "@/hooks/useDeleteTask";
import { AuthUser } from "@/types/auth";
import { MenuItem } from "@/types/menus";
import { BookUserIcon, ClipboardListIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  items: MenuItem[];
  user: AuthUser;
};

export function SidebarMenu({ items, user }: Props) {
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
    <>
      {items
        .filter((item) => item.visible !== false)
        .map((item) => (
          <SidebarLink key={item.label} href={item.href}>
            <item.icon />
            {item.label}
          </SidebarLink>
        ))}
      <SidebarLink onClick={handleLogout}>
        <LogOutIcon />
        Sair
      </SidebarLink>
      {user.isAdmin && (
        <div className="pt-4 flex flex-col gap-2">
          <hr className="text-gray-500" />
          <h2 className="p-2 font-bold">Área admin</h2>

          <SidebarLink href="/Admin/todas-as-tarefas">
            <ClipboardListIcon />
            Todas as tarefas
          </SidebarLink>

          <SidebarLink href="/Admin/todos-os-usuarios">
            <BookUserIcon />
            Todos os usuários
          </SidebarLink>
        </div>
      )}
    </>
  );
}
