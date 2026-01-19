"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MenuIcon,
  XIcon,
  LogOutIcon,
  ClipboardListIcon,
  ClipboardPlusIcon,
  ClipboardCheckIcon,
  ClipboardClockIcon,
  ClockAlertIcon,
  IdCardIcon,
} from "lucide-react";
import { toastConfirmLogout } from "@/hooks/useDeleteTask";
import logoOnly from "@/assets/TaskinzLogoOnly.png";

type Props = {
  user: {
    name?: string | null;
    email: string;
    imageUrl?: string | null;
  } | null;
};

export function MobileHeaderMenu({ user }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    toastConfirmLogout({
      userName: user?.email || "usuário",
      onConfirm: async () => {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });

        setOpen(false);
        router.push("/login");
        router.refresh();
      },
    });
  }

  // trava o scroll do body quando o menu abrir (opcional)
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      {/* Botão hamburguer */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-md hover:bg-white/10 text-white"
        aria-label="Abrir menu"
      >
        <MenuIcon size={22} />
      </button>

      {/* Overlay + Drawer */}
      {open && (
        <div className="fixed inset-0 z-50">
          {/* overlay */}
          <button
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          />

          {/* painel */}
          <aside className="absolute left-0 top-0 h-full w-[85%] max-w-[320px] bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Image src={logoOnly} alt="Taskinz" width={42} height={42} />
                <div className="text-sm">
                  <div className="font-semibold">
                    {user?.name ?? "Usuário"}
                  </div>
                  <div className="text-gray-500 truncate max-w-47.5">
                    {user?.email ?? ""}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100"
                aria-label="Fechar menu"
              >
                <XIcon size={20} />
              </button>
            </div>

            <nav className="p-3 flex flex-col gap-2">
              <MenuLink href="/" onClick={() => setOpen(false)} icon={<ClipboardListIcon size={18} />}>
                Todas as tarefas
              </MenuLink>

              <MenuLink href="/adicionar-tarefa" onClick={() => setOpen(false)} icon={<ClipboardPlusIcon size={18} />}>
                Adicionar tarefa
              </MenuLink>

              <MenuLink href="/minhas-tarefas" onClick={() => setOpen(false)} icon={<IdCardIcon size={18} />}>
                Minhas tarefas
              </MenuLink>

              <MenuLink href="/concluidas" onClick={() => setOpen(false)} icon={<ClipboardCheckIcon size={18} />}>
                Concluídas
              </MenuLink>

              <MenuLink href="/em-andamento" onClick={() => setOpen(false)} icon={<ClipboardClockIcon size={18} />}>
                Em andamento
              </MenuLink>

              <MenuLink href="/pendentes" onClick={() => setOpen(false)} icon={<ClockAlertIcon size={18} />}>
                Pendentes
              </MenuLink>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-left"
              >
                <LogOutIcon size={18} />
                Sair
              </button>
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-3 rounded-lg bg-gray-100 hover:bg-gray-200"
    >
      {icon}
      <span className="font-medium">{children}</span>
    </Link>
  );
}
