import { Header } from "@/componentes/Header";
import CreateTaskForm from "@/componentes/CreateTaskForm";

export default function AdicionarTarefa() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Adicionar tarefa" />
      <main className="flex flex-1 flex-col bg-[#2a2a2a]">
        <CreateTaskForm/>
      </main>
    </div>
  );
}
