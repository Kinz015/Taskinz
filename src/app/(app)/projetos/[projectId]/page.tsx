import { Header } from "@/componentes/Header";
import TasksTable from "@/componentes/tasks/TaskTable";
import { requireAuth } from "@/lib/auth";
import { getUserInvites } from "@/lib/invites";
import { prisma } from "@/lib/prisma";
import { TaskDTO } from "@/types/task";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
  searchParams: Promise<{
    sort?: "dueAt" | "createdAt" | "updatedAt";
    order?: "asc" | "desc";
  }>;
};

export default async function Projetos({
  params,
  searchParams,
}: ProjectPageProps) {
  const user = await requireAuth();
  const invites = await getUserInvites(user.id, user.email);

  if (!user) {
    redirect("/login");
  }

  const resolvedParams = await params;
  const projectId = Number(resolvedParams.projectId);

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      tasks: true,
    },
  });

  if (!project) {
    return notFound();
  }

  if (isNaN(projectId)) return notFound();

  const resolvedSearch = await searchParams;
  const sort = resolvedSearch.sort ?? "createdAt";
  const order = resolvedSearch.order === "asc" ? "asc" : "desc";

  const tasksRaw = await prisma.task.findMany({
    where: { projectId },
    orderBy: { [sort]: order },
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
    <>
      <Header title={`${project.title}: Todas as tarefas`} user={user} invites={invites} />
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
