import { Header } from "@/componentes/Header";
import { EditTaskForm } from "@/componentes/tasks/EditTaskForm";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

type EditTaskPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  // ✅ DESEMPACOTA params corretamente
  const { id } = await params;

  const taskId = Number(id);

  if (Number.isNaN(taskId)) {
    notFound();
  }

  const user = await requireAuth();

  const [task, users] = await Promise.all([
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
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!task) {
    redirect("404");
  }

  if (task.authorId !== user.id) {
    redirect("/");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Editar task" />
      <main className="flex flex-1 flex-col bg-[#1f1f1f] p-6 text-white">
        <EditTaskForm task={task} users={users} />
      </main>
    </div>
  );
}
