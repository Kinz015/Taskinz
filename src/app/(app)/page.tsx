import { Header } from "@/componentes/Header";
import TasksTable from "@/componentes/tasks/TaskTable";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TaskDTO } from "@/types/task";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type HomeProps = {
  searchParams: Promise<{
    sort?: "dueAt" | "createdAt" | "updatedAt";
    order?: "asc" | "desc";
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const user = await requireAuth();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const sort = params.sort ?? "createdAt";
  const order = params.order === "asc" ? "asc" : "desc";

  const tasksRaw = await prisma.task.findMany({
    where: {
      authorId: user.id,
      projectId: null, // ← ESSENCIAL
    },
    orderBy: {
      [sort]: order,
    },
    include: {
      author: true,
      assignee: true,
    },
  });

  const invites = await prisma.projectInvite.findMany({
    where: {
      status: "PENDING",
      OR: [{ inviteeId: user.id }, { inviteeEmail: user.email }],
    },
    include: {
      project: true,
      inviter: true,
    },
  });

  const tasks: TaskDTO[] = tasksRaw.map((task) => ({
    ...task,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    dueAt: task.dueAt ? task.dueAt.toISOString() : null,
  }));

  return (
    <>
      <Header title="Todas as tarefas" user={user} invites={invites}/>
      <TasksTable
        tasks={tasks}
        sort={sort}
        order={order}
        user={user}
        page="all"
      />
    </>
  );
}
