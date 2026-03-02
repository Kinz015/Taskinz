import { Header } from "@/componentes/Header";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Projetos({ params }: string) {
  const user = await requireAuth();

  if (!user) {
    redirect("/login");
  }

  const resolvedParams = await params;
  const projectId = Number(resolvedParams.projectId);

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      tasks: true,
    },
  });

  if (!project) {
    return notFound();
  }

  if (isNaN(projectId)) return notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Área de projetos" />
      <main className="flex flex-1 flex-col bg-[#2a2a2a]">
        <h1>{project.title}</h1>
      </main>
    </div>
  );
}
