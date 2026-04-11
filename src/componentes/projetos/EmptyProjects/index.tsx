"use client";

import { useRouter } from "next/navigation";
import { FolderPlus } from "lucide-react";

export function EmptyProjects() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <div className="bg-gray-100 rounded-full p-6 mb-4">
        <FolderPlus className="w-10 h-10 text-gray-500" />
      </div>

      <h2 className="text-xl font-semibold mb-2">
        Você ainda não pertence a nenhum projeto
      </h2>

      <p className="text-gray-500 mb-6 max-w-md">
        Crie seu primeiro projeto para começar a organizar tarefas, equipes e
        produtividade.
      </p>

      <button
        onClick={() => router.push("/projetos/novo")}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Criar projeto
      </button>
    </div>
  );
}
