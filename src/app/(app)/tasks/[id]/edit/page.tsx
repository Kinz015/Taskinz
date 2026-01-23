import { Header } from "@/componentes/Header";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { EditTaskForm } from "@/componentes/tasks/EditTaskForm";

type EditTaskPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const auth = await requireAuth();

  if (!auth) {
    redirect("/login"); // Redireciona para login se não estiver autenticado
  }

  // Garantindo que `user` nunca será null
  const user = await prisma.user.findUnique({
    where: { id: auth.id },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    redirect("/login"); // Caso o user não seja encontrado
  }

  const { id } = await params;
  const taskId = Number(id);

  if (Number.isNaN(taskId)) {
    notFound();
  }

  const [task] = await Promise.all([
    prisma.task.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueAt: true,
        assigneeId: true,
        authorId: true,
      },
    }),
  ]);

  if (!task) {
    notFound();
  }

  if (task.authorId !== user.id) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Editar task" />
      <main className="flex flex-1 flex-col bg-[#1f1f1f] p-6 text-white">
        {/* Passando o user validado */}
        <EditTaskForm task={task} user={user} />
      </main>
    </div>
  );
}
