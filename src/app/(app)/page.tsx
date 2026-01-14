import { Header } from "@/componentes/Header";
import TasksTable from "@/componentes/tasks/TaskTable";
import { getLoggedUser } from "@/lib/auth";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { TaskDTO } from "@/types/task";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type HomeProps = {
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
    `${baseUrl}/api/tasks?sort=${sort}&order=${order}`
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Erro ao buscar tasks concluídas: ${res.status} ${text}`);
  }

  return res.json();
}

export default async function Home({ searchParams }: HomeProps) {
  const user = await getLoggedUser(); // ✅ dentro do request

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const sort = params.sort ?? "createdAt";
  const order = params.order === "asc" ? "asc" : "desc";

  const tasks = await getTasks(sort, order);

  return (
    <>
      <Header title="Todas as tarefas" />
      <TasksTable tasks={tasks} sort={sort} order={order} user={user} />
    </>
  );
}
