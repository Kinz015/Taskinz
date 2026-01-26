"use client";

import {
  LogOutIcon,
  ClipboardListIcon,
  ClipboardPlusIcon,
  ClipboardCheckIcon,
  ClipboardClockIcon,
  ClockAlertIcon,
  BookUserIcon,
  ShieldIcon,
  ShieldOffIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import SidebarLink from "../SidebarLink";
import { useRouter } from "next/navigation";
import { toastConfirmLogout } from "@/hooks/useDeleteTask";
import { AuthUser } from "@/types/auth";
import logo from "@/assets/TaskinzLogo.png";
import logoOnly from "@/assets/TaskinzLogoOnly.png";
import Link from "next/link";
import { useMemo, useState } from "react";

type SideBarProps = {
  user: AuthUser;
};

const ADMIN_MODE_KEY = "taskinz_admin_mode";

export function SideBar({ user }: SideBarProps) {
  const router = useRouter();
  // carrega preferência do modo admin
  const isAdmin = !!user?.isAdmin;

  const [adminMode, setAdminMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(ADMIN_MODE_KEY) === "true";
  });

  function toggleAdminMode() {
    if (!isAdmin) return;

    setAdminMode((prev) => {
      const next = !prev;
      window.localStorage.setItem(ADMIN_MODE_KEY, String(next));
      return next;
    });
  }

  const effectiveAdminMode = isAdmin && adminMode;

  async function handleLogout() {
    toastConfirmLogout({
      userName: user?.email || "usuário",
      onConfirm: async () => {
        // opcional: limpa o modo admin ao sair
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(ADMIN_MODE_KEY);
        }

        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });

        router.push("/login");
        router.refresh();
      },
    });
  }

  const userLinks = useMemo(
    () => [
      {
        id: "all",
        href: "/",
        label: "Todas as tarefas",
        icon: <ClipboardListIcon />,
      },
      {
        id: "add",
        href: "/adicionar-tarefa",
        label: "Adicionar tarefa",
        icon: <ClipboardPlusIcon />,
      },
      {
        id: "done",
        href: "/concluidas",
        label: "Concluídas",
        icon: <ClipboardCheckIcon />,
      },
      {
        id: "in_progress",
        href: "/em-andamento",
        label: "Em andamento",
        icon: <ClipboardClockIcon />,
      },
      {
        id: "pending",
        href: "/pendentes",
        label: "Pendentes",
        icon: <ClockAlertIcon />,
      },
    ],
    [],
  );

  const adminLinks = useMemo(
    () => [
      {
        id: "adm_all_tasks",
        href: "/admin/todas-as-tarefas",
        label: "Todas as tarefas (ADM)",
        icon: <ClipboardListIcon />,
      },
      {
        id: "adm_done",
        href: "/admin/concluidas",
        label: "Concluídas",
        icon: <ClipboardCheckIcon />,
      },
      {
        id: "adm_in_progress",
        href: "/admin/em-andamento",
        label: "Em andamento",
        icon: <ClipboardClockIcon />,
      },
      {
        id: "adm_pending",
        href: "/admin/pendentes",
        label: "Pendentes",
        icon: <ClockAlertIcon />,
      },
      {
        id: "excluidas",
        href: "/admin/excluidas",
        label: "Excluidas",
        icon: <Trash2Icon />,
      },
      {
        id: "adm_users",
        href: "/admin/todos-os-usuarios",
        label: "Todos os usuários",
        icon: <BookUserIcon />,
      },
      // coloque mais aqui
    ],
    [],
  );

  const linksToRender = effectiveAdminMode ? adminLinks : userLinks;

  return (
    <aside
      className="
        hidden md:inline
        min-[1100px]:w-50 xl:w-50 2xl:w-80
        bg-white transition-all
      "
    >
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
          {/* Links (mudam conforme o modo) */}
          {linksToRender.map((l) => (
            <SidebarLink key={l.id} href={l.href}>
              {l.icon}
              {l.label}
            </SidebarLink>
          ))}

          {/* Sair sempre disponível */}
          <SidebarLink onClick={handleLogout}>
            <LogOutIcon />
            Sair
          </SidebarLink>

          {/* Toggle só aparece se for admin */}
          {isAdmin && (
            <button
              type="button"
              onClick={toggleAdminMode}
              className="
                mb-2 w-full flex items-center gap-2
                rounded-lg border border-gray-200 bg-gray-50
                px-3 py-2 text-sm font-semibold text-gray-800
                hover:bg-gray-100
              "
              title="Alternar modo admin"
            >
              {adminMode ? (
                <ShieldOffIcon size={18} />
              ) : (
                <ShieldIcon size={18} />
              )}
              {adminMode ? "Sair do modo admin" : "Entrar no modo admin"}
            </button>
          )}

          {/* opcional: avisinho visual quando adminMode está ativo */}
          {user.isAdmin && adminMode && (
            <div className="px-3 py-2 text-xs rounded-lg bg-red-50 text-red-700 border border-red-100">
              Modo admin ativo
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}
