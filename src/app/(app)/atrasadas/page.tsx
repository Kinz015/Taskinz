import { Header } from "@/componentes/Header";
import TasksTable from "@/componentes/tasks/TaskTable";
import { getLoggedUser } from "@/lib/auth";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { TaskDTO } from "@/types/task";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AtrasadasProps = {
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

async function getAtrasadasTasks(sort: string, order: string): Promise<TaskDTO[]> {
  const baseUrl = await getBaseUrl();

  const res = await fetchWithAuth(
    `${baseUrl}/api/tasks?status=overdue&sort=${sort}&order=${order}`
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Erro ao buscar tasks atrasadas: ${res.status} ${text}`);
  }

  return res.json();
}

export default async function Atrasadas({ searchParams }: AtrasadasProps) {
  const user = await getLoggedUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const sort = params.sort ?? "createdAt";
  const order = params.order === "asc" ? "asc" : "desc";

  const tasks = await getAtrasadasTasks(sort, order);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Tarefas atrasadas"/>
      <main className="flex flex-1 flex-col bg-[#2a2a2a]">
        <TasksTable tasks={tasks} sort={sort} order={order} user={user} page="overdue"/>
      </main>
    </div>
  );
}
