import { Header } from "@/componentes/Header";
import TasksTable from "@/componentes/tasks/TaskTable";
import { TaskDTO } from "@/types/task";

async function getCompletedTasks(): Promise<TaskDTO[]> {
  const res = await fetch("http://localhost:3000/api/tasks?status=completed", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar tasks concluídas");
  }

  return res.json();
}

export default async function Concluidas() {
  const tasks = await getCompletedTasks();

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Tarefas Concluídas" />
      <main className="flex flex-1 flex-col bg-[#2a2a2a]">
        <TasksTable tasks={tasks} />
      </main>
    </div>
  );
}
