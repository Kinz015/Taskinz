import { Header } from "@/componentes/Header";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type TaskPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TaskPage({ params }: TaskPageProps) {
  const { id } = await params;

  const task = await prisma.task.findUnique({
    where: { id: Number(id) },
    include: {
      author: true,
      assignee: true,
    },
  });

  if (!task) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#1f1f1f]">
      <Header title={`Task: ${task.title}`} />

      <main className="flex flex-1 items-start justify-center p-6 text-white">
        <div className="w-full max-w-2xl rounded-lg bg-[#2a2a2a] p-6 shadow-lg">
          <h2 className="mb-6 text-xl font-semibold text-white">
            Detalhes da tarefa
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Título:</p>
              <p className="text-base font-medium">{task.title}</p>
            </div>

            {task.description && (
              <div>
                <p className="text-sm text-gray-400">Descrição:</p>
                <p className="text-base">{task.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-400">Status:</p>
                <p className="font-medium capitalize">
                  {
                    // Mapeamento de status
                    {
                      in_progress: "Em Progresso",
                      pending: "Pendente",
                      completed: "Concluída",
                    }[task.status] || task.status // fallback para o valor original, caso não esteja no mapeamento
                  }
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Prazo:</p>
                <p className="font-medium">
                  {task.dueAt ? new Date(task.dueAt).toLocaleDateString() : "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Criado por:</p>
                <p className="font-medium">
                  {task.assignee
                    ? task.author.name || task.author.email
                    : "Sem responsável"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Criada em:</p>
                <p className="font-medium">
                  {new Date(task.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Responsável:</p>
                <p className="font-medium">
                  {task.assignee
                    ? task.assignee.name || task.assignee.email
                    : "Sem responsável"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Última alteração:</p>
                <p className="font-medium">
                  {new Date(task.updatedAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <Link
                  href={`/tasks/${task.id}/edit`}
                  className="
        rounded-md bg-gray-600 px-5 py-2 text-sm font-medium text-white
        hover:bg-gray-700 hover:cursor-pointer
      "
                >
                  Editar tarefa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
