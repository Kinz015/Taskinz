import { Header } from "@/componentes/Header";
import CreateTaskForm from "@/componentes/tasks/CreateTaskForm";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

type NewTaskPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function NewTaskPage({ params }: NewTaskPageProps) {
  const user = await requireAuth();

  if (!user) {
    redirect("/login"); // Redireciona para login se não estiver autenticado
  }

  const resolvedParams = await params;
  const projectId = Number(resolvedParams.projectId);

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      members: {
        some: { userId: user.id },
      },
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!project) {
    return notFound();
  }

  if (isNaN(projectId)) return notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Criar task" />
      <main className="flex flex-1 flex-col bg-[#1f1f1f] p-6 text-white">
        <CreateTaskForm
          user={user}
          projectId={projectId}
          members={project.members}
        />
      </main>
    </div>
  );
}
