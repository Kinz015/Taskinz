import { Header } from "@/componentes/Header";
import TasksTable from "@/componentes/tasks/TaskTable";
import { requireAuth } from "@/lib/auth";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getUserInvites } from "@/lib/invites";
import { TaskDTO } from "@/types/task";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type TodasAsTasksProps = {
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
    `${baseUrl}/api/admin/tasks?sort=${sort}&order=${order}`,
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Erro ao buscar tasks (admin): ${res.status} ${text}`);
  }

  return res.json();
}

export default async function TodasAsTasks({
  searchParams,
}: TodasAsTasksProps) {
  const user = await requireAuth(); // ✅ dentro do request

  if (!user) redirect("/login");
  if (!user.isAdmin) notFound();

  const params = await searchParams;
  const sort = params.sort ?? "createdAt";
  const order = params.order === "asc" ? "asc" : "desc";

  const tasks = await getTasks(sort, order);

  const invites = await getUserInvites(user.id, user.email);

  return (
    <>
      <Header title="Todas as tarefas" user={user} invites={invites} />
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
