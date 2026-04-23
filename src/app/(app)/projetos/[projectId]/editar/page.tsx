import { Header } from "@/componentes/Header";
import EditProjectForm from "@/componentes/projetos/EditProjectForm";
import { requireAuth } from "@/lib/auth";
import { getUserInvites } from "@/lib/invites";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

type EditarPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function Editar({ params }: EditarPageProps) {
  const user = await requireAuth();

  if (!user) {
    redirect("/login");
  }

  const invites = await getUserInvites(user.id, user.email);

  const resolvedParams = await params;
  const projectId = Number(resolvedParams.projectId);

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    redirect("/projetos");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title={project.title}
        page="Editar task"
        user={user}
        invites={invites}
      />
      <main className="flex flex-1 flex-col bg-[#1f1f1f] p-6 text-white">
        {/* Passando o user validado */}
        <EditProjectForm
          projectId={project.id}
          title={project.title}
          description={project.description ?? ""}
          imageUrl={project.imageUrl ?? ""}
        />
      </main>
    </div>
  );
}
