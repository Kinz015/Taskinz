import { Header } from "@/componentes/Header";
import CreateTaskForm from "@/componentes/tasks/CreateTaskForm";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function NewTaskPage() {
  const auth = await requireAuth();

  if (!auth) {
    redirect("/login"); // Redireciona para login se não estiver autenticado
  }

  // Garantindo que `user` nunca será null
  const user = await prisma.user.findUnique({
    where: { id: auth.id },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    redirect("/login"); // Caso o user não seja encontrado
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
