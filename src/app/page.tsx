import { Header } from "@/componentes/Header";
import TasksTable from "@/componentes/tasks/TaskTable";
import { mockTasks } from "@/lib/mockTasks";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Todas as tarefas" />
      <main className="flex flex-1 flex-col bg-amber-200">
        <TasksTable tasks={mockTasks}/>
      </main>
    </div>
  );
}
