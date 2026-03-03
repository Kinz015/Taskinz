import { Header } from "@/componentes/Header";
import TasksTable from "@/componentes/tasks/TaskTable";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TaskDTO } from "@/types/task";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type EmAndamentoProps = {
  searchParams: Promise<{
    sort?: "dueAt" | "createdAt" | "updatedAt";
    order?: "asc" | "desc";
  }>;
};

export default async function Iniciada({ searchParams }: EmAndamentoProps) {
  const user = await requireAuth();

  // ✅ continua: UX + evita request desnecessário
  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const sort = params.sort ?? "createdAt";
  const order = params.order === "asc" ? "asc" : "desc";

  const tasksRaw = await prisma.task.findMany({
    where: {
      authorId: user.id,
      projectId: null,
      status: "started", // ← ESSENCIAL
    },
    orderBy: {
      [sort]: order,
    },
    include: {
      author: true,
      assignee: true,
    },
  });

  const tasks: TaskDTO[] = tasksRaw.map((task) => ({
    ...task,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    dueAt: task.dueAt ? task.dueAt.toISOString() : null,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Tarefas iniciadas" />
      <main className="flex flex-1 flex-col bg-[#2a2a2a]">
        <TasksTable
          tasks={tasks}
          sort={sort}
          order={order}
          user={user}
          page="started"
        />
      </main>
    </div>
  );
}
