import { Header } from "@/componentes/Header";
import CreateTaskForm from "@/componentes/tasks/CreateTaskForm";
import { requireAuth } from "@/lib/auth";
import { getUserInvites } from "@/lib/invites";
import { redirect } from "next/navigation";

export default async function NewTaskPage() {
  const user = await requireAuth();

  if (!user) {
    redirect("/login"); // Redireciona para login se não estiver autenticado
  }

  const invites = await getUserInvites(user.id, user.email);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Adicionar tarefa" user={user} invites={invites} />
      <main className="flex flex-1 flex-col bg-[#1f1f1f] p-6 text-white">
        <CreateTaskForm user={user} />
      </main>
    </div>
  );
}
