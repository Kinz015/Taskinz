import { Header } from "@/componentes/Header";
import TasksTable from "@/componentes/tasks/TaskTable";

async function getTasks() {
  const res = await fetch("http://localhost:3000/api/tasks", {
    cache: "no-store", // sempre buscar dados atualizados
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar tasks");
  }

  return res.json();
}

export default async function Home() {
  const tasks = await getTasks()

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Todas as tarefas" />
      <main className="flex flex-1 flex-col bg-[#2a2a2a]">
        <TasksTable tasks={tasks} />
      </main>
    </div>
  );
}
