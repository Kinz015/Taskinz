import { Header } from "@/componentes/Header";
import TasksTable from "@/componentes/tasks/TaskTable";
import { requireAuth } from "@/lib/auth";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { prisma } from "@/lib/prisma";
import { TaskDTO } from "@/types/task";
import { headers } from "next/headers";
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

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("host");
  if (!host) throw new Error("Host header ausente");

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  return `${protocol}://${host}`;
}

async function getTasks(sort: string, order: string): Promise<TaskDTO[]> {
  const baseUrl = await getBaseUrl();

  const res = await fetchWithAuth(
    `${baseUrl}/api/tasks?sort=${sort}&order=${order}`,
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Erro ao buscar todas as tarefas: ${res.status} ${text}`);
  }

  return res.json();
}

export default async function Projetos({
  params,
  searchParams,
}: ProjectPageProps) {
  const user = await requireAuth();

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

  const tasks = await getTasks(sort, order);

  return (
    <>
      <Header title={project.title} />
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
