"use client";

import Image from "next/image";
import Link from "next/link";

export function SideBar() {
  return (
    <aside className="w-80 bg-white border-r">
      <Image
        src="/TaskinzSemFundo.png"
        alt="Taskinz"
        width={400}
        height={90}
        priority
        className="p-20 bg-amber-950"
      />
      <nav className="flex flex-col gap-2 p-4">
        <Link href="/">Todas as tarefas</Link>
        <Link href="/">Adicionar tarefa</Link>
        <Link href="/">Concluídas</Link>
        <Link href="/">Em andamento</Link>
        <Link href="/">Pendentes</Link>
        <Link href="/">Sair</Link>
      </nav>
    </aside>
  );
}
