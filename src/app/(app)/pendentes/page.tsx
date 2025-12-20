import { Header } from "@/componentes/Header";
import TasksTable from "@/componentes/tasks/TaskTable";
import { getLoggedUser } from "@/lib/auth";
import { TaskDTO } from "@/types/task";
import { redirect } from "next/navigation";

async function getPendentesTasks(
  sort: string,
  order: string
): Promise<TaskDTO[]> {
  const res = await fetch(
    `http://localhost:3000/api/tasks?status=pending&sort=${sort}&order=${order}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Erro ao buscar tasks pendentes");
  }

  return res.json();
}

type PendentesProps = {
  searchParams: Promise<{
    sort?: "dueAt" | "createdAt" | "updatedAt";
    order?: "asc" | "desc";
  }>;
};

export default async function Pendentes({ searchParams }: PendentesProps) {
  const params = await searchParams;

  const sort = params.sort ?? "createdAt";
  const order = params.order === "asc" ? "asc" : "desc";

  const user = await getLoggedUser();

  if (!user) {
    redirect("/login");
  }

  const tasks = await getPendentesTasks(sort, order);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Tarefas Pendentes" />

      <main className="flex flex-1 flex-col bg-[#2a2a2a]">
        <TasksTable tasks={tasks} sort={sort} order={order} user={user} />
      </main>
    </div>
  );
}
