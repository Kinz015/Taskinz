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

  const isProjetosArea = pathname.startsWith("/projetos") && !isProjetoInterno;

  const isPessoal = !pathname.startsWith("/projetos");

  const projectId = isProjetoInterno ? pathname.split("/")[2] : null;

  const isAdm = projectRole === "OWNER" || projectRole === "ADMIN";

  let menu: MenuItem[] = [];

  if (isPessoal) menu = pessoalMenu;
  if (isProjetosArea) menu = projetosMenu;
  if (isProjetoInterno && projectId)
    menu = projetoInternoMenu(projectId, isAdm);

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
          <SidebarMenu items={menu} user={user} />
        </nav>
      </div>
    </aside>
  );
}
