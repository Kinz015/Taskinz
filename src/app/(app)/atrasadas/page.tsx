import { Header } from "@/componentes/Header";
import TasksTable from "@/componentes/tasks/TaskTable";
import { requireAuth } from "@/lib/auth";
import { getUserInvites } from "@/lib/invites";
import { prisma } from "@/lib/prisma";
import { TaskDTO } from "@/types/task";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AtrasadasProps = {
  searchParams: Promise<{
    sort?: "dueAt" | "createdAt" | "updatedAt";
    order?: "asc" | "desc";
  }>;
};

export default async function Atrasadas({ searchParams }: AtrasadasProps) {
  const user = await requireAuth();
  const invites = await getUserInvites(user.id, user.email);

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
      status: "overdue", // ← ESSENCIAL
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
      <Header title="Tarefas atrasadas" user={user} invites={invites} />
      <main className="flex flex-1 flex-col bg-[#2a2a2a]">
        <TasksTable
          tasks={tasks}
          sort={sort}
          order={order}
          user={user}
          page="overdue"
        />
      </main>
    </div>
  );
}
