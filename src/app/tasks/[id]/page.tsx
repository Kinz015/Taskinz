import { Header } from "@/componentes/Header";
import { prisma } from "@/lib/prisma";
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
    <div className="flex flex-col min-h-screen">
      <Header title={`Task: ${task.title}`} />

      <main className="flex flex-1 flex-col bg-[#2a2a2a] p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Detalhes</h2>

        <div className="space-y-2">
          <p>
            <strong>Status:</strong> {task.status}
          </p>

          <p>
            <strong>Responsável:</strong>{" "}
            {task.assignee ? task.assignee.name ?? task.assignee.email : "—"}
          </p>

          <p>
            <strong>Prazo:</strong>{" "}
            {task.dueAt ? new Date(task.dueAt).toLocaleDateString() : "—"}
          </p>

          <p>
            <strong>Criada em:</strong>{" "}
            {new Date(task.createdAt).toLocaleDateString()}
          </p>

          <p>
            <strong>Última alteração:</strong>{" "}
            {new Date(task.updatedAt).toLocaleDateString()}
          </p>

          {task.description && (
            <p>
              <strong>Descrição:</strong> {task.description}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
