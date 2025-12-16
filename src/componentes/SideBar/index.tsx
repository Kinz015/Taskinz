"use client";

import { LogOutIcon } from "lucide-react";
import { ClipboardListIcon } from "lucide-react";
import { ClipboardPlusIcon } from "lucide-react";
import { ClipboardCheckIcon } from "lucide-react";
import { ClipboardClockIcon } from "lucide-react";
import { ClockAlertIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function SideBar() {
  const styleLink = "flex items-center font-bold bg-[#D9D9D9] p-4 rounded-xl gap-2";

  return (
    <aside className="w-80 bg-white border-r">
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
          <Link className={styleLink} href="/">
            <ClipboardListIcon /> Todas as tarefas
          </Link>
          <Link className={styleLink} href="/Adicionar-tarefa">
            <ClipboardPlusIcon/> Adicionar tarefa
          </Link>
          <Link className={styleLink} href="/Concluidas">
            <ClipboardCheckIcon/> Concluídas
          </Link>
          <Link className={styleLink} href="/Em-andamento">
            <ClipboardClockIcon/> Em andamento
          </Link>
          <Link className={styleLink} href="/Pendentes">
            <ClockAlertIcon/> Pendentes
          </Link>
          <Link className={styleLink} href="/">
            <LogOutIcon /> Sair
          </Link>
        </nav>
      </div>
    </aside>
  );
}
