import { Header } from "@/componentes/Header";
import TasksTable from "@/componentes/tasks/TaskTable";

async function getTasks(sort: string, order: string) {
  const res = await fetch(
    `http://localhost:3000/api/tasks?sort=${sort}&order=${order}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Erro ao buscar tasks");
  }

  return res.json();
}

type HomeProps = {
  searchParams: Promise<{
    sort?: "dueAt" | "createdAt" | "updatedAt";
    order?: "asc" | "desc";
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const sort = params.sort ?? "createdAt";
  const order = params.order === "asc" ? "asc" : "desc";

  const tasks = await getTasks(sort, order);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Todas as tarefas" />
      <main className="flex flex-1 flex-col bg-[#2a2a2a]">
        <TasksTable tasks={tasks} sort={sort} order={order} />
      </main>
    </div>
  );
}
