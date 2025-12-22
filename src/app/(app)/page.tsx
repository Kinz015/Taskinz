import { Header } from "@/componentes/Header";
import TasksTable from "@/componentes/tasks/TaskTable";
import { getLoggedUser } from "@/lib/auth";
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

async function getTasks(sort: string, order: string) {
  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/tasks?sort=${sort}&order=${order}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar tasks");
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
    <div className="flex flex-col min-h-screen">
      <Header title="Todas as tarefas" />
      <main className="flex flex-1 flex-col bg-[#2a2a2a]">
        <TasksTable tasks={tasks} sort={sort} order={order} user={user} />
      </main>
    </div>
  );
}
