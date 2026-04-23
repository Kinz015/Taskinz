"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { AuthUser } from "@/types/auth";
import logo from "@/assets/TaskinzLogo.png";
import logoOnly from "@/assets/TaskinzLogoOnly.png";
import Link from "next/link";
import { pessoalMenu } from "./pessoalMenu";
import { projetosMenu } from "./projetosMenu";
import { MenuItem } from "@/types/menus";
import { SidebarMenu } from "./SideBarMenu";
import { projetoInternoMenu } from "./projetoInternoMenu";
import { ProjectRole } from "@prisma/client";
import { useEffect, useState } from "react";

const MIN = 220;
const MAX = 400;

type SideBarProps = {
  user: AuthUser;
  projectRole?: ProjectRole;
};

export function SideBar({ user, projectRole }: SideBarProps) {
  const pathname = usePathname();
  const isProjetoInterno =
    pathname.startsWith("/projetos/") &&
    pathname !== "/projetos" &&
    pathname !== "/projetos/novo";

  const [width, setWidth] = useState(320);

  const isProjetosArea = pathname.startsWith("/projetos") && !isProjetoInterno;

  const isPessoal = !pathname.startsWith("/projetos");

  const projectId = isProjetoInterno ? pathname.split("/")[2] : null;

  const [role, setRole] = useState<ProjectRole | null>(projectRole ?? null);

  const startResize = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = width;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      if (newWidth >= MIN && newWidth <= MAX) {
        setWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  useEffect(() => {
    if (!projectId) return;

    async function fetchRole() {
      try {
        const res = await fetch(`/api/projects/${projectId}/role`);
        const data = await res.json();
        setRole(data.role);
      } catch (error) {
        console.error("Erro ao buscar role:", error);
      }
    }

    fetchRole();
  }, [projectId]);

  const isAdm = role === "OWNER" || role === "ADMIN";

  let menu: MenuItem[] = [];

  if (isPessoal) menu = pessoalMenu;
  if (isProjetosArea) menu = projetosMenu;
  if (isProjetoInterno && projectId)
    menu = projetoInternoMenu(projectId, isAdm);

  return (
    <aside style={{ width }} className="flex h-screen bg-white">
      <div className="h-screen flex flex-col w-full">
        <div className="h-50">
          <Link href="/" className="justify-center">
            <Image
              src={logoOnly}
              alt="Taskinz"
              width={71}
              height={71}
              className="hidden py-12 px-4 md:py-8 md:px-2 sm:py-4 sm:px-1 max-[1100px]:inline"
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
        </div>

        <nav className="overflow-y-auto scrollbar-hidden flex flex-1 flex-col gap-2 ml-2">
          {!isPessoal ? (
            <>
              <hr className="text-gray-500" />
              <h2 className="p-2 font-bold">Área de projetos</h2>
            </>
          ) : null}
          <SidebarMenu items={menu} user={user} />
        </nav>
      </div>
      <div
        onMouseDown={startResize}
        className="relative top-0 right-0 h-full w-2 cursor-col-resize z-10"
      />
    </aside>
  );
}
