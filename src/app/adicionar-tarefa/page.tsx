import { Header } from "@/componentes/Header";
import CreateTaskForm from "@/componentes/CreateTaskForm";

export default function AdicionarTarefa() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Adicionar tarefa" />
      <main className="w-full max-w-xl rounded-lg bg-white p-6 shadow-md m-auto">
        <h2 className="mb-6 text-center text-xl font-semibold text-gray-800">
          Criar nova task
        </h2>
        <CreateTaskForm/>
      </main>
    </div>
  );
}
