import { Header } from "@/componentes/Header";
import { requireAuth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { EditTaskForm } from "@/componentes/tasks/EditTaskForm";
import { getTaskForUser } from "@/lib/tasks";

type EditTaskPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const user = await requireAuth();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const taskId = Number(id);

  if (Number.isNaN(taskId)) {
    notFound();
  }

  const task = await getTaskForUser(taskId, user.id);
  if (!task) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Editar task" />
      <main className="flex flex-1 flex-col bg-[#1f1f1f] p-6 text-white">
        {/* Passando o user validado */}
        <EditTaskForm task={task} user={user} />
      </main>
    </div>
  );
}
