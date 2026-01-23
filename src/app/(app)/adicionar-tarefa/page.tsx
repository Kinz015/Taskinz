import { Header } from "@/componentes/Header";
import CreateTaskForm from "@/componentes/tasks/CreateTaskForm";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewTaskPage() {
  const user = await requireAuth();

  if (!user) {
    redirect("/login"); // Redireciona para login se não estiver autenticado
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Criar task" />
      <main className="flex flex-1 flex-col bg-[#1f1f1f] p-6 text-white">
        <CreateTaskForm user={user} />
      </main>
    </div>
  );
}
