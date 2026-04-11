"use client";

import { CirclePlusIcon, FolderPlus } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export function EmptyProjects() {
  return (
    <div className="pt-10">
      <div className="flex flex-col items-center text-center py-20">
        <div
          className={clsx(
            "flex items-center justify-center ",
            "bg-white/25 bg- rounded-full border-white/10",
            "text-white p-2.5 mb-4",
            "border",
          )}
        >
          <FolderPlus />
        </div>

        <h2 className="text-xl font-bold text-white">
          Você ainda não pertence a nenhum projeto
        </h2>

        <p className="mt-2 max-w-lg text-sm text-white/60">
          Crie seu primeiro projeto para começar a organizar tarefas, equipes e
          produtividade.
        </p>

        <Link
          href="adicionar-tarefa"
          className={clsx(
            "flex items-center rounded-md",
            "bg-green-600 hover:opacity-80",
            "mt-6 gap-2 px-3 py-2.5",
            "font-semibold text-white",
          )}
        >
          <CirclePlusIcon width={20} />
          <span className="flex pt-0.5 items-center">Criar Projeto</span>
        </Link>
      </div>
    </div>
  );
}
