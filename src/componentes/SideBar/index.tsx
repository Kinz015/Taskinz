"use client";

import {
  LogOutIcon,
  ClipboardListIcon,
  ClipboardPlusIcon,
  ClipboardCheckIcon,
  ClipboardClockIcon,
  ClockAlertIcon,
  BookUserIcon,
  FolderKanbanIcon,
  FoldersIcon,
  FolderPlusIcon,
  UserRoundIcon,
} from "lucide-react";
import Image from "next/image";
import SidebarLink from "../SidebarLink";
import { usePathname, useRouter } from "next/navigation";
import { toastConfirmLogout } from "@/hooks/useDeleteTask";
import { AuthUser } from "@/types/auth";
import logo from "@/assets/TaskinzLogo.png";
import logoOnly from "@/assets/TaskinzLogoOnly.png";
import Link from "next/link";

type SideBarProps = {
  user: AuthUser;
};

export function SideBar({ user }: SideBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isProjetos =
    pathname === "/projetos" || pathname.startsWith("/projetos/");
  const isPessoal = !isProjetos; // simples: tudo que não é /projetos* é pessoal

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
    <aside className="hidden md:inline min-[1100px]:w-50 xl:w-50 2xl:w-80 bg-white transition-all">
      <div className="min-h-screen flex flex-col w-full">
        <Link href="/" className="lg:flex justify-center">
          <Image
            src={logoOnly}
            alt="Taskinz"
            width={71}
            height={71}
            className="hidden py-12 px-2 max-[1100px]:inline"
          />
          <Image
            src={logo}
            alt="Taskinz"
            width={400}
            height={100}
            priority
            className="hidden min-[1100px]:inline py-14 px-4 xl:py-20 xl:px-4 2xl:p-20"
          />
        </Link>

        <nav className="flex flex-1 flex-col gap-2 mx-2">
          {isPessoal && (
            <>
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

              <SidebarLink href="/projetos">
                <FolderKanbanIcon />
                Área de projetos
              </SidebarLink>
            </>
          )}

          {isProjetos && (
            <>
              <SidebarLink href="/projetos">
                <FoldersIcon />
                Meus projetos
              </SidebarLink>

              <SidebarLink href="/projetos/novo">
                <FolderPlusIcon />
                Criar projeto
              </SidebarLink>

              <SidebarLink href="/">
                <UserRoundIcon />
                Área pessoal
              </SidebarLink>
            </>
          )}

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
        </nav>
      </div>
    </aside>
  );
}
